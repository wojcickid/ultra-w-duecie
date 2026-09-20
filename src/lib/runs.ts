import type { RunStatus } from '../components/StatusBadge.astro';
import { formatDate } from './format';

interface RunLike {
  status: 'completed' | 'planned' | 'unplanned';
  retired: boolean;
}

// Bieg wycofany dostaje znacznik „Wycofany”; ukończony wycofany zachowuje też „Ukończony” (DEC-008).
export function getRunBadges(run: RunLike): RunStatus[] {
  if (!run.retired) return [run.status];
  return run.status === 'completed'
    ? ['completed', 'withdrawn']
    : ['withdrawn'];
}

interface RunFactsSource {
  distanceKm?: number;
  location?: string;
  typicalMonth?: string;
  plannedDate?: Date;
}

// Dane biegu do wyświetlenia (Dystans / Miejsce / Termin); brakujące pola są pomijane.
export function getRunFacts(run: RunFactsSource) {
  const facts: { label: string; value: string }[] = [];
  if (run.distanceKm !== undefined) {
    facts.push({
      label: 'Dystans',
      value: `${run.distanceKm.toLocaleString('pl-PL')} km`,
    });
  }
  if (run.location) facts.push({ label: 'Miejsce', value: run.location });
  if (run.plannedDate) {
    facts.push({ label: 'Termin', value: formatDate(run.plannedDate) });
  } else if (run.typicalMonth) {
    facts.push({
      label: 'Termin',
      value: `orientacyjnie: ${run.typicalMonth}`,
    });
  }
  return facts;
}
