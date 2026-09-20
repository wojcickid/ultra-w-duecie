// Walidacja referencji między kolekcjami (Astro tylko loguje błąd referencji, kod wyjścia 0).
// Sprawdza: posts[].authors, posts[].run oraz runs[].results[].author. Uruchamiany przed build/check.
// Dodatkowo OSTRZEGA (bez przerywania, DEC-010), gdy bieg nie liczy się jako ukończony wspólnie.
import { readdirSync, readFileSync } from 'node:fs';
import { basename, extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml'; // zależność Astro (parsowanie frontmatter), bez własnej deklaracji

const root = fileURLToPath(new URL('..', import.meta.url));
const contentDir = join(root, 'src', 'content');
const errors = [];
const warnings = [];

const rel = (file) => relative(root, file).split(sep).join('/');

function listFiles(dir, extension) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full, extension);
    return extname(entry.name) === extension ? [full] : [];
  });
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    errors.push(`${rel(file)}: niepoprawny plik JSON (${error.message})`);
    return null;
  }
}

function readFrontmatter(file) {
  const raw = readFileSync(file, 'utf8');
  const text = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return {};
  try {
    return yaml.load(match[1]) ?? {};
  } catch (error) {
    errors.push(
      `${rel(file)}: niepoprawny frontmatter YAML (${error.message})`,
    );
    return null;
  }
}

// Referencja to tekst (id) albo obiekt { collection, id }.
const refId = (value) =>
  typeof value === 'object' && value !== null ? value.id : value;

function checkRef(file, field, value, knownIds, collection) {
  const id = refId(value);
  if (typeof id !== 'string' || !knownIds.has(id)) {
    errors.push(
      `${rel(file)}: pole "${field}" odwołuje się do nieistniejącego wpisu kolekcji "${collection}": "${id}"` +
        ` (dostępne: ${[...knownIds].join(', ') || 'brak'})`,
    );
  }
}

// Dzień kalendarzowy w strefie wyświetlania (jak toDayKey w src/lib/format.ts).
const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Europe/Warsaw',
});
function dayKey(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : dayKeyFormatter.format(date);
}

// Reguła DEC-010/DEC-011: wspólnie = każdy autor ma wynik "finished" z tą samą datą.
function checkTogether(file, run, authorIds) {
  const results = Array.isArray(run?.results) ? run.results : [];
  const finished = (id) =>
    results.find(
      (result) =>
        refId(result?.author) === id &&
        (result?.outcome ?? 'finished') === 'finished' &&
        result?.completedDate,
    );
  const perAuthor = [...authorIds].map((id) => [id, finished(id)]);
  if (perAuthor.length === 0) return;
  if (perAuthor.every(([, result]) => result)) {
    const days = perAuthor.map(([id, result]) => [
      id,
      dayKey(result.completedDate),
    ]);
    if (new Set(days.map(([, day]) => day)).size > 1) {
      warnings.push(
        `${rel(file)}: bieg "${run.name}": wszyscy autorzy mają wynik "Ukończył", ale daty ukończenia się różnią (${days
          .map(([id, day]) => `${id}: ${day}`)
          .join(
            ', ',
          )}). Taki bieg NIE liczy się jako ukończony wspólnie, a wyniki są pokazywane jako indywidualne. Jeśli biegli razem, ustaw tę samą datę ukończenia.`,
      );
    }
  } else if (run?.status === 'completed') {
    warnings.push(
      `${rel(file)}: bieg "${run.name}" ma status "completed", ale nie każdy autor ma wynik "Ukończył" (brakuje: ${perAuthor
        .filter(([, result]) => !result)
        .map(([id]) => id)
        .join(', ')}). Taki bieg NIE liczy się jako ukończony wspólnie.`,
    );
  }
}

const idsIn = (dir) =>
  new Set(listFiles(dir, '.json').map((f) => basename(f, '.json')));

const authorIds = idsIn(join(contentDir, 'authors'));
const runIds = idsIn(join(contentDir, 'runs'));

for (const file of listFiles(join(contentDir, 'runs'), '.json')) {
  const run = readJson(file);
  if (run) checkTogether(file, run, authorIds);
  if (!Array.isArray(run?.results)) continue;
  run.results.forEach((result, index) =>
    checkRef(
      file,
      `results[${index}].author`,
      result?.author,
      authorIds,
      'authors',
    ),
  );
}

for (const file of listFiles(join(contentDir, 'posts'), '.md')) {
  const data = readFrontmatter(file);
  if (!data) continue;
  if (Array.isArray(data.authors)) {
    data.authors.forEach((author, index) =>
      checkRef(file, `authors[${index}]`, author, authorIds, 'authors'),
    );
  }
  if (data.run !== undefined && data.run !== null) {
    checkRef(file, 'run', data.run, runIds, 'runs');
  }
}

if (warnings.length > 0) {
  console.warn('\nOstrzeżenia (src/content), budowa jest kontynuowana:');
  for (const message of warnings) console.warn(`  - ${message}`);
  console.warn('');
}

if (errors.length > 0) {
  console.error('\nBłąd walidacji treści (src/content):');
  for (const message of errors) console.error(`  - ${message}`);
  console.error(
    `\nZnaleziono błędów: ${errors.length}. Popraw dane i uruchom ponownie.\n`,
  );
  process.exit(1);
}
console.log(
  `Walidacja referencji: OK (autorzy: ${authorIds.size}, biegi: ${runIds.size}).`,
);
