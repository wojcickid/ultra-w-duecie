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
