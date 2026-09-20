// Logika postępu Korony (DEC-007, DEC-008, DEC-010, DEC-011): czyste funkcje bez zależności od Astro.
import { toDayKey } from './format';

// Liczba biegów Korony Polskich Ultramaratonów 4.0 (mianownik licznika).
export const CROWN_TOTAL = 10;

interface RunLike {
  id: string;
  data: {
    order?: number;
    results: {
      author: { id: string };
      outcome: 'finished' | 'dnf' | 'dns';
      completedDate?: Date;
    }[];
  };
}

// Sortuje po `order` rosnąco; biegi bez `order` trafiają na koniec (stabilnie, po id).
export function sortRuns<T extends RunLike>(runs: readonly T[]): T[] {
  return [...runs].sort(
    (a, b) =>
      (a.data.order ?? Infinity) - (b.data.order ?? Infinity) ||
      a.id.localeCompare(b.id),
  );
}

// Bieg ukończony wspólnie = każdy autor ma wynik "finished" z tą samą datą ukończenia
// (DEC-010). Bieg wycofany też się liczy (DEC-008); DNF i DNS nigdy (DEC-011).
export function isCompletedTogether(
  run: RunLike,
  authorIds: readonly string[],
): boolean {
  if (authorIds.length === 0) return false;
  const days = new Set<string>();
  for (const id of authorIds) {
    const result = run.data.results.find(
      (candidate) => candidate.author.id === id,
    );
    if (result?.outcome !== 'finished' || !result.completedDate) return false;
    days.add(toDayKey(result.completedDate));
  }
  return days.size === 1;
}

export function countCompletedTogether(
  runs: readonly RunLike[],
  authorIds: readonly string[],
): number {
  return runs.filter((run) => isCompletedTogether(run, authorIds)).length;
}

// Wyniki jednego autora (także solo), w kolejności biegów; `together` = ukończone wspólnie.
export function getAuthorResults<T extends RunLike>(
  runs: readonly T[],
  authorId: string,
  authorIds: readonly string[],
) {
  return sortRuns(runs).flatMap((run) => {
    const result: T['data']['results'][number] | undefined =
      run.data.results.find((candidate) => candidate.author.id === authorId);
    return result
      ? [{ run, result, together: isCompletedTogether(run, authorIds) }]
      : [];
  });
}

interface CrownRunLike extends RunLike {
  data: RunLike['data'] & { retired?: boolean };
}

// Podział na aktywne biegi Korony 4.0 (`retired: false`) i historię projektu (`retired: true`, DEC-012).
// Oba bloki w kolejności `order`. Wycofany bieg ukończony wspólnie nadal wlicza się do postępu (DEC-008).
export function splitCrownAndHistory<T extends CrownRunLike>(
  runs: readonly T[],
): { crown: T[]; history: T[] } {
  const sorted = sortRuns(runs);
  return {
    crown: sorted.filter((run) => !run.data.retired),
    history: sorted.filter((run) => run.data.retired === true),
  };
}

export interface TogetherSummary<T> {
  /** Liczba biegów ukończonych wspólnie (licznik X z X/10; wlicza też bieg wycofany, DEC-008). */
  count: number;
  /** Mianownik licznika (`CROWN_TOTAL`). */
  total: number;
  /** Biegi ukończone wspólnie, w kolejności `order` (do opisu „z czego składa się licznik”). */
  runs: T[];
  /** Z tego: biegi aktywne (z listy Korony 4.0). */
  fromCrown: T[];
  /** Z tego: biegi wycofane z listy (historia projektu). */
  fromHistory: T[];
}

// Komplet wyliczeń „razem” dla widoków (strona główna, /biegi): licznik i skład licznika.
export function getTogetherSummary<T extends CrownRunLike>(
  runs: readonly T[],
  authorIds: readonly string[],
): TogetherSummary<T> {
  const together = sortRuns(runs).filter((run) =>
    isCompletedTogether(run, authorIds),
  );
  return {
    count: together.length,
    total: CROWN_TOTAL,
    runs: together,
    fromCrown: together.filter((run) => !run.data.retired),
    fromHistory: together.filter((run) => run.data.retired === true),
  };
}

interface NextRunLike extends CrownRunLike {
  data: CrownRunLike['data'] & { plannedDate?: Date };
}

export interface NextRun<T> {
  run: T;
  /** Data startu (dzień kalendarzowy YYYY-MM-DD w Europe/Warsaw), np. dla `<time>` i skryptu ukrywającego kartę. */
  isoDate: string;
  /** Liczba dni do startu (0 = start dziś). */
  daysUntil: number;
}

// Liczba dni między dwoma kluczami dnia YYYY-MM-DD (bez wpływu stref i czasu letniego).
function daysBetween(fromKey: string, toKey: string): number {
  return Math.round(
    (Date.parse(`${toKey}T00:00:00Z`) - Date.parse(`${fromKey}T00:00:00Z`)) /
      86_400_000,
  );
}

// Najbliższy przyszły start (DEC-012): niewycofany bieg z potwierdzoną datą `plannedDate`, który nie jest
// jeszcze ukończony wspólnie, o dacie nie wcześniejszej niż dziś. Dni porównujemy w Europe/Warsaw
// (jak `toDayKey`), więc w dniu startu bieg jest jeszcze „najbliższy”; dzień później znika.
// `now` jest parametrem, żeby dało się to testować; przy remisie decyduje `order`, potem `id`.
// Termin orientacyjny (`typicalMonth` / `expectedYear`) nie jest brany pod uwagę: nie ma potwierdzonej daty.
export function getNextRun<T extends NextRunLike>(
  runs: readonly T[],
  authorIds: readonly string[],
  now: Date,
): NextRun<T> | undefined {
  const today = toDayKey(now);
  const upcoming = sortRuns(runs).flatMap((run) => {
    const { plannedDate, retired } = run.data;
    if (retired || !plannedDate || isCompletedTogether(run, authorIds)) {
      return [];
    }
    const isoDate = toDayKey(plannedDate);
    return isoDate >= today
      ? [{ run, isoDate, daysUntil: daysBetween(today, isoDate) }]
      : [];
  });
  // Sortowanie stabilne: kolejność `sortRuns` rozstrzyga remisy dat.
  return upcoming.sort((a, b) => a.isoDate.localeCompare(b.isoDate))[0];
}
