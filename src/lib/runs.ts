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
  plannedDate?: Date;
  results?: readonly {
    outcome: 'finished' | 'dnf' | 'dns';
    completedDate?: Date;
  }[];
}

export interface RunTerm {
  label: string;
  value: string;
  /** Data w formacie YYYY-MM-DD (dla `<time>`); brak przy terminie orientacyjnym. */
  isoDate?: string;
}

// Jedno źródło prawdy dla terminu biegu (oś czasu, /biegi, /biegi/<id>).
// Data z wyników (najwcześniejsza) ma pierwszeństwo przed `plannedDate` i `typicalMonth`.
// Etykieta: „Ukończono” (wszyscy z datą ukończyli tego samego dnia), „Podejście” (ten sam dzień,
// ale np. DNF/DNS), „Pierwsze podejście” (wyniki z różnych dni, DEC-010).
export function getRunTerm(run: RunTermSource): RunTerm | undefined {
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
      label:
        days.size > 1
          ? 'Pierwsze podejście'
          : allFinished
            ? 'Ukończono'
            : 'Podejście',
      value: formatDate(earliest),
      isoDate: earliest.toISOString().slice(0, 10),
    };
  }
  if (run.plannedDate) {
    return {
      label: 'Termin',
      value: formatDate(run.plannedDate),
      isoDate: run.plannedDate.toISOString().slice(0, 10),
    };
  }
  if (run.typicalMonth) {
    return { label: 'Termin', value: `orientacyjnie: ${run.typicalMonth}` };
  }
  return undefined;
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
  if (term) facts.push({ label: term.label, value: term.value });
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
