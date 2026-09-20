// Logika postępu Korony (DEC-007, DEC-008): czyste funkcje bez zależności od Astro.

// Liczba biegów Korony Polskich Ultramaratonów 4.0 (mianownik licznika).
export const CROWN_TOTAL = 10;

interface RunLike {
  id: string;
  data: {
    order?: number;
    results: { author: { id: string } }[];
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

// Bieg ukończony wspólnie = każdy autor ma wynik (bieg wycofany też się liczy, DEC-008).
export function isCompletedTogether(
  run: RunLike,
  authorIds: readonly string[],
): boolean {
  if (authorIds.length === 0) return false;
  const done = new Set(run.data.results.map((result) => result.author.id));
  return authorIds.every((id) => done.has(id));
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
