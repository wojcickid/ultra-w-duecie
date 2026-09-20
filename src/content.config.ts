// Definicje kolekcji treści (Astro Content Collections, Astro 7 + Zod 4).
// Nazwy kolekcji i pól po angielsku (DEC-005); opis modelu: docs/architecture.md.
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Autorzy: dwie osoby. Identyfikator = nazwa pliku (np. damian.json -> "damian").
const authors = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/authors' }),
  schema: z.object({
    displayName: z.string().min(1),
  }),
});

// Wynik jednej osoby w danym biegu (wyniki zapisywane osobno dla każdego autora).
// outcome: finished = ukończył, dnf = nie ukończył (Did Not Finish), dns = nie wystartował (Did Not Start).
const runResult = z
  .object({
    author: reference('authors'),
    outcome: z.enum(['finished', 'dnf', 'dns']).default('finished'),
    // Dla finished: data ukończenia (wymagana); dla dnf/dns: data podejścia (opcjonalna).
    completedDate: z.coerce.date().optional(),
    // Czas oficjalny w formacie HH:MM:SS (godziny mogą mieć 1-3 cyfry, np. 9:05:30 lub 105:12:00).
    time: z
      .string()
      .regex(
        /^\d{1,3}:[0-5]\d:[0-5]\d$/,
        'Czas musi mieć format HH:MM:SS (np. 12:34:56)',
      )
      .optional(),
    // Miejsce w klasyfikacji (liczba całkowita dodatnia); opcjonalne (DEC-012).
    place: z.number().int().positive().optional(),
    // Link do wyników tej osoby (np. jej wiersz w wynikach na żywo).
    resultsUrl: z.url().optional(),
    // Krótka notatka, np. "zejście na 62. km", "kontuzja".
    note: z.string().optional(),
  })
  .superRefine((result, ctx) => {
    if (result.outcome === 'finished') {
      if (result.completedDate === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['completedDate'],
          message: 'Wynik "Ukończył" wymaga daty ukończenia (completedDate).',
        });
      }
      if (result.time === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['time'],
          message: 'Wynik "Ukończył" wymaga czasu oficjalnego (time).',
        });
      }
    }
    if (result.outcome === 'dns' && result.time !== undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['time'],
        message: 'Wynik "Nie wystartował (DNS)" nie może mieć czasu (time).',
      });
    }
  });

// Biegi Korony Polskich Ultramaratonów 4.0 (+ bieg wycofany z listy). Identyfikator = nazwa pliku.
const runs = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/runs' }),
  schema: z
    .object({
      name: z.string().min(1),
      distanceKm: z.number().positive().optional(),
      location: z.string().optional(),
      // Orientacyjny termin jako tekst, np. "luty", "kwiecień/maj", "Boże Ciało".
      typicalMonth: z.string().optional(),
      // Rok terminu orientacyjnego (np. 2027); z `typicalMonth` daje „październik 2027” (DEC-012).
      expectedYear: z.number().int().min(2000).max(2100).optional(),
      status: z.enum(['completed', 'planned', 'unplanned']),
      // Bieg wycofany z listy Korony (DEC-008), np. Bieg 7 Dolin.
      retired: z.boolean().default(false),
      // Potwierdzona data startu (w odróżnieniu od orientacyjnych `typicalMonth` / `expectedYear`).
      plannedDate: z.coerce.date().optional(),
      // Link do wyników całego biegu; wyniki osób mają własne `resultsUrl`.
      resultsUrl: z.url().optional(),
      notes: z.string().optional(),
      // Pozycja do sortowania (kolejność na liście / w kalendarzu).
      order: z.number().int().optional(),
      results: z.array(runResult).default([]),
    })
    .superRefine((run, ctx) => {
      const seen = new Set<string>();
      run.results.forEach((result, index) => {
        const authorId = result.author.id;
        if (seen.has(authorId)) {
          ctx.addIssue({
            code: 'custom',
            path: ['results', index, 'author'],
            message: `Autor "${authorId}" ma więcej niż jeden wynik w tym biegu.`,
          });
        }
        seen.add(authorId);
      });
      if (
        run.status === 'completed' &&
        !run.results.some((result) => result.outcome === 'finished')
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['results'],
          message:
            'Bieg ze statusem "completed" musi mieć co najmniej jeden wynik "Ukończył" (outcome: finished).',
        });
      }
    }),
});

// Wpisy bloga: treść Markdown w pliku, dane w frontmatter. Identyfikator = nazwa pliku.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      date: z.coerce.date(),
      authors: z.array(reference('authors')).min(1),
      run: reference('runs').optional(),
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string().min(1),
          }),
        )
        .optional(),
    }),
});

export const collections = { authors, runs, posts };
