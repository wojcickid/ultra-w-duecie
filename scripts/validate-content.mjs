// Walidacja referencji między kolekcjami (Astro tylko loguje błąd referencji, kod wyjścia 0).
// Sprawdza: posts[].authors, posts[].run oraz runs[].results[].author. Uruchamiany przed build/check.
import { readdirSync, readFileSync } from 'node:fs';
import { basename, extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml'; // zależność Astro (parsowanie frontmatter), bez własnej deklaracji

const root = fileURLToPath(new URL('..', import.meta.url));
const contentDir = join(root, 'src', 'content');
const errors = [];

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

const idsIn = (dir) =>
  new Set(listFiles(dir, '.json').map((f) => basename(f, '.json')));

const authorIds = idsIn(join(contentDir, 'authors'));
const runIds = idsIn(join(contentDir, 'runs'));

for (const file of listFiles(join(contentDir, 'runs'), '.json')) {
  const run = readJson(file);
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
