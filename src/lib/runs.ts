import type { RunStatus } from '../components/StatusBadge.astro';
import { formatDate, toDayKey } from './format';

interface RunLike {
  status: 'completed' | 'planned' | 'unplanned';
  retired: boolean;
}

// Jedno źródło prawdy dla znaczników biegu (strona główna, /biegi, /biegi/<id>).
// Bieg wycofany dostaje znacznik „Wycofany”; ukończony wycofany zachowuje też „Ukończony” (DEC-008).
export function getRunBadges(run: RunLike): RunStatus[] {
  if (!run.retired) return [run.status];
  return run.status === 'completed'
    ? ['completed', 'withdrawn']
    : ['withdrawn'];
}

interface RunTermSource {
  typicalMonth?: string;
  expectedYear?: number;
  plannedDate?: Date;
  results?: readonly {
    outcome: 'finished' | 'dnf' | 'dns';
    completedDate?: Date;
  }[];
}

/**
 * Rodzaj terminu biegu (DEC-012):
 * - `confirmed` — znana data (z wyników albo `plannedDate`),
 * - `approximate` — termin orientacyjny (`typicalMonth`, opcjonalnie z `expectedYear`),
 * - `tbd` — termin do ustalenia (brak jakichkolwiek danych o terminie).
 */
export type RunTermKind = 'confirmed' | 'approximate' | 'tbd';

export interface RunTerm {
  kind: RunTermKind;
  /** Etykieta terminu: „Ukończono” / „Podejście” / „Pierwsze podejście” (z wyników) albo „Termin”. */
  label: string;
  /** Tekst do wyświetlenia: „3 października 2026”, „październik 2027”, „październik”, „Termin do ustalenia”. */
  value: string;
  /** Data w formacie YYYY-MM-DD (dla `<time>`); tylko przy `kind: 'confirmed'`. */
  isoDate?: string;
  /** Prawda dla terminu orientacyjnego (miesiąc i/lub rok), nigdy dla potwierdzonej daty. */
  approximate: boolean;
  /** Dopisek „termin orientacyjny”: tylko gdy termin orientacyjny nie ma roku (sam miesiąc). */
  qualifier?: string;
}

const APPROXIMATE_QUALIFIER = 'termin orientacyjny';
const TBD_TEXT = 'Termin do ustalenia';

// Jedno źródło prawdy dla terminu biegu (oś czasu, /biegi, /biegi/<id>, karta „Najbliższy start”).
// Kolejność: data z wyników (najwcześniejsza) > `plannedDate` > `typicalMonth` (+ `expectedYear`) > do ustalenia.
// Etykieta dla wyników: „Ukończono” (wszyscy z datą ukończyli tego samego dnia), „Podejście” (ten sam dzień,
// ale np. DNF/DNS), „Pierwsze podejście” (wyniki z różnych dni, DEC-010). Zawsze zwraca wartość (nigdy `undefined`).
export function getRunTerm(run: RunTermSource): RunTerm {
  const dated = (run.results ?? []).flatMap((result) =>
    result.completedDate
      ? [{ outcome: result.outcome, date: result.completedDate }]
      : [],
  );
  if (dated.length > 0) {
    const earliest = new Date(
      Math.min(...dated.map((result) => result.date.getTime())),
    );
    const days = new Set(dated.map((result) => toDayKey(result.date)));
    const allFinished = dated.every((result) => result.outcome === 'finished');
    return {
      kind: 'confirmed',
      label:
        days.size > 1
          ? 'Pierwsze podejście'
          : allFinished
            ? 'Ukończono'
            : 'Podejście',
      value: formatDate(earliest),
      isoDate: toDayKey(earliest),
      approximate: false,
    };
  }
  if (run.plannedDate) {
    return {
      kind: 'confirmed',
      label: 'Termin',
      value: formatDate(run.plannedDate),
      isoDate: toDayKey(run.plannedDate),
      approximate: false,
    };
  }
  const month = run.typicalMonth?.trim();
  if (month) {
    return {
      kind: 'approximate',
      label: 'Termin',
      value:
        run.expectedYear === undefined ? month : `${month} ${run.expectedYear}`,
      approximate: true,
      qualifier:
        run.expectedYear === undefined ? APPROXIMATE_QUALIFIER : undefined,
    };
  }
  if (run.expectedYear !== undefined) {
    return {
      kind: 'approximate',
      label: 'Termin',
      value: String(run.expectedYear),
      approximate: true,
      qualifier: APPROXIMATE_QUALIFIER,
    };
  }
  return { kind: 'tbd', label: 'Termin', value: TBD_TEXT, approximate: false };
}

// Termin jako jeden tekst, gdy widok nie ma osobnego miejsca na dopisek:
// „3 października 2026”, „październik 2027”, „październik (termin orientacyjny)”, „Termin do ustalenia”.
export function formatRunTerm(term: RunTerm): string {
  return term.qualifier ? `${term.value} (${term.qualifier})` : term.value;
}

interface RunFactsSource extends RunTermSource {
  distanceKm?: number;
  location?: string;
}

// Dane biegu do wyświetlenia (Dystans / Miejsce / termin); brakujące pola są pomijane.
export function getRunFacts(run: RunFactsSource) {
  const facts: { label: string; value: string }[] = [];
  if (run.distanceKm !== undefined) {
    facts.push({
      label: 'Dystans',
      value: `${run.distanceKm.toLocaleString('pl-PL')} km`,
    });
  }
  if (run.location) facts.push({ label: 'Miejsce', value: run.location });
  const term = getRunTerm(run);
  facts.push({
    label: term.label,
    // „Termin: do ustalenia” zamiast powtórzenia słowa „Termin”.
    value: term.kind === 'tbd' ? 'do ustalenia' : formatRunTerm(term),
  });
  return facts;
}

type Outcome = 'finished' | 'dnf' | 'dns';

interface ResultLike {
  author: { id: string };
  outcome: Outcome;
  time?: string;
  note?: string;
}

// Zwięzły opis wyniku osoby (bez koloru): „Damian: ukończył 09:49:42”, „Grzegorz: nie wystartował (DNS)”, z notatką po myślniku.
export function getResultSummaries(
  results: readonly ResultLike[],
  authorNames: ReadonlyMap<string, string>,
): string[] {
  return results.map((result) => {
    const name = authorNames.get(result.author.id) ?? result.author.id;
    const text = {
      finished: `ukończył${result.time ? ` ${result.time}` : ''}`,
      dnf: 'nie ukończył (DNF)',
      dns: 'nie wystartował (DNS)',
    }[result.outcome];
    return `${name}: ${text}${result.note ? ` — ${result.note}` : ''}`;
  });
}
