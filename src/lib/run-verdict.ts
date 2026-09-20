// Werdykt „czy ukończyliśmy razem?” dla widoków biegu (karty, oś czasu, strona biegu).
// Czyste funkcje bez zależności od Astro; regułę „razem” zapewnia `isCompletedTogether` (DEC-010, DEC-011).
import { formatDate, toDayKey } from './format';
import { isCompletedTogether } from './progress';

type Outcome = 'finished' | 'dnf' | 'dns';

interface RunLike {
  id: string;
  data: {
    results: {
      author: { id: string };
      outcome: Outcome;
      completedDate?: Date;
    }[];
  };
}

export interface AuthorRef {
  id: string;
  name: string;
}

export type TogetherVerdictKind = 'together' | 'not-together' | 'upcoming';

export interface TogetherVerdict {
  kind: TogetherVerdictKind;
  /** Krótkie stwierdzenie: „Ukończyliśmy razem”, „Nie ukończyliśmy tego biegu razem”, „Jeszcze przed nami”. */
  headline: string;
  /** Data ukończenia wspólnego (`formatDate`) i ta sama jako YYYY-MM-DD (dla `<time>`); tylko `together`. */
  date?: string;
  isoDate?: string;
  /** Powód z danych (np. „tylko Damian ukończył; Grzegorz nie wystartował (DNS)”); tylko `not-together`. */
  reason?: string;
}

const OUTCOME_TEXT: Record<Outcome, string> = {
  finished: 'ukończył',
  dnf: 'nie ukończył (DNF)',
  dns: 'nie wystartował (DNS)',
};

function joinList(items: readonly string[]): string {
  return items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} i ${items[items.length - 1]}`;
}

// Powód, dla którego bieg z wynikami nie jest ukończony wspólnie. Zawsze wynika z danych, nic nie zgaduje.
function getNotTogetherReason(
  run: RunLike,
  authors: readonly AuthorRef[],
): string {
  const rows = authors.map((author) => ({
    name: author.name,
    result: run.data.results.find(
      (candidate) => candidate.author.id === author.id,
    ),
  }));
  const finishers = rows.filter((row) => row.result?.outcome === 'finished');
  const everyone = authors.length === 2 ? 'obaj' : 'wszyscy';

  if (finishers.length === rows.length) {
    return `${everyone} ukończyli, ale w różnych dniach`;
  }
  if (rows.every((row) => row.result?.outcome === 'dnf')) {
    return `${everyone} nie ukończyli (DNF)`;
  }
  if (rows.every((row) => row.result?.outcome === 'dns')) {
    return `${everyone} nie wystartowali (DNS)`;
  }
  const others = rows
    .filter((row) => row.result?.outcome !== 'finished')
    .map((row) =>
      row.result
        ? `${row.name} ${OUTCOME_TEXT[row.result.outcome]}`
        : `${row.name} — brak wyniku`,
    );
  if (finishers.length === 0) return others.join(', ');
  const verb = finishers.length > 1 ? 'ukończyli' : 'ukończył';
  return `tylko ${joinList(finishers.map((row) => row.name))} ${verb}; ${others.join(', ')}`;
}

export function getTogetherVerdict(
  run: RunLike,
  authors: readonly AuthorRef[],
): TogetherVerdict {
  const authorIds = authors.map((author) => author.id);
  if (run.data.results.length === 0) {
    return { kind: 'upcoming', headline: 'Jeszcze przed nami' };
  }
  if (isCompletedTogether(run, authorIds)) {
    // Wszyscy mają tę samą datę ukończenia, więc wystarczy pierwsza.
    const completedDate = run.data.results.find(
      (result) => result.completedDate,
    )?.completedDate;
    return {
      kind: 'together',
      headline: 'Ukończyliśmy razem',
      date: completedDate ? formatDate(completedDate) : undefined,
      isoDate: completedDate ? toDayKey(completedDate) : undefined,
    };
  }
  return {
    kind: 'not-together',
    headline: 'Nie ukończyliśmy tego biegu razem',
    reason: getNotTogetherReason(run, authors),
  };
}

// Adnotacja o biegu poza listą Korony 4.0 (historia projektu, DEC-012); undefined dla biegu z listy.
export function getRetiredNote(
  run: { data: { retired?: boolean } },
  together: boolean,
): string | undefined {
  if (!run.data.retired) return undefined;
  return together
    ? 'Nie jest jedną z 10 pozycji Korony 4.0, ale zalicza się do naszego wspólnego postępu wg regulaminu Korony.'
    : 'Nie jest jedną z 10 pozycji Korony 4.0 (historia projektu).';
}
