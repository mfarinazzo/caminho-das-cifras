import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..', 'src', 'data', 'songs');

function walk(dir: string, acc: string[] = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.isFile() && entry.name.endsWith('.json')) acc.push(p);
  }
  return acc;
}

function normalize(s: string) {
  return s
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\((.*?)\)/g, '($1)');
}

const chords = new Set<string>();
for (const file of walk(ROOT)) {
  const json = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const colunas = json.colunas || [];
  for (const col of colunas) {
    for (const est of col.estrofes || []) {
      for (const ln of est.linhas || []) {
        for (const ac of ln.acordes || []) {
          const c = String(ac.cifra || '').trim();
          if (c) chords.add(normalize(c));
        }
      }
    }
  }
}

const out = Array.from(chords).sort();
console.log(JSON.stringify(out, null, 2));
