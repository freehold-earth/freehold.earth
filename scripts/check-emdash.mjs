// Fails if any text file under the given paths contains an em dash (U+2014).
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const EM_DASH = String.fromCharCode(0x2014);
const SKIP_DIRS = new Set(['node_modules', '.git']);
const BINARY = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.pdf',
]);

function* walk(path) {
  if (!existsSync(path)) return;
  if (statSync(path).isDirectory()) {
    for (const entry of readdirSync(path)) {
      if (!SKIP_DIRS.has(entry)) yield* walk(join(path, entry));
    }
  } else if (!BINARY.has(extname(path).toLowerCase())) {
    yield path;
  }
}

const hits = [];
for (const root of process.argv.slice(2)) {
  for (const file of walk(root)) {
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        if (line.includes(EM_DASH)) hits.push(`${file}:${i + 1}`);
      });
  }
}

if (hits.length) {
  console.error(
    `Em dashes found (use full stops, commas, colons or parentheses):\n${hits.join('\n')}`,
  );
  process.exit(1);
}
console.log('No em dashes found.');
