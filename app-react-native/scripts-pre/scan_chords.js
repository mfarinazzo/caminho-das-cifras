// filepath: app-react-native/scripts-pre/scan_chords.js
// Enhanced Node.js scanner: extracts unique chord tokens from cifra strings
// Usage: node scripts-pre/scan_chords.js [--out path]

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'src', 'data', 'songs');

function stripDia(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[♯]/g, '#')
    .replace(/[♭]/g, 'b');
}

function walk(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.isFile() && entry.name.endsWith('.json')) acc.push(p);
  }
  return acc;
}

function cleanToken(tok) {
  let s = String(tok || '');
  s = s.replace(/[\[\]]/g, '');
  s = s.replace(/\*/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  s = s.replace(/\s*([/#|,;])\s*/g, '$1');
  return s;
}

// Find chord-like tokens inside a cifra string, splitting combined progressions
function extractChords(str) {
  const s = String(str || '');
  const results = [];
  const roughParts = s.split(/[|;,]+/);
  for (const part of roughParts) {
    const p = part.trim();
    if (!p) continue;

    // Replace glued chords like "LaMi" => "La Mi" by inserting space before uppercase roots (prefer solfege tokens first)
    const separated = p.replace(/(Do|Re|Mi|Fa|Sol|La|Si|[A-G])(?=(Do|Re|Mi|Fa|Sol|La|Si|[A-G]))/g, '$1 ');

    const tokens = separated.split(/[\s/]+/).filter(Boolean);
    for (let t of tokens) {
      t = cleanToken(t);
      if (!t) continue;
      const norm = stripDia(t);
      // Prefer full solfege over letters to avoid matching only 'D' in 'Do'
      const m = norm.match(/^(do|re|mi|fa|sol|la|si|[a-g])([#b]?)(.*)$/i);
      if (!m) continue;
      const root = m[1];
      const acc = m[2] || '';
      let rest = (m[3] || '');

      // Normalize rest: remove spaces and parentheses
      rest = stripDia(rest).toLowerCase();
      rest = rest.replace(/\s+/g, '');
      rest = rest.replace(/[()]/g, '');
      // Treat leading '-' and Portuguese aliases as minor
      rest = rest.replace(/^[-−]/, 'm');
      rest = rest.replace(/^(menor|min)/, 'm');
      // Common aliases
      rest = rest.replace(/7m|m7/i, 'm7');
      rest = rest.replace(/7maj|maj7|7m?aj/i, 'maj7');
      rest = rest.replace(/°|º/g, 'dim');
      rest = rest.replace(/\+/g, 'aug');

      // Compose label: no space when minor 'm' prefix, space otherwise for readability
      const spacer = rest.startsWith('m') ? '' : (rest ? ' ' : '');
      const label = `${root}${acc}${spacer}${rest}`.trim();
      if (label) results.push(label);
    }
  }
  return results;
}

const chords = new Set();
for (const file of walk(ROOT)) {
  try {
    const json = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const colunas = json.colunas || [];
    for (const col of colunas) {
      for (const est of col.estrofes || []) {
        for (const ln of est.linhas || []) {
          for (const ac of ln.acordes || []) {
            const raw = ac.cifra || '';
            for (const c of extractChords(raw)) {
              chords.add(c);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error(`Failed parsing ${file}:`, err && err.message ? err.message : err);
  }
}

const out = Array.from(chords).sort();

const outIdx = process.argv.indexOf('--out');
if (outIdx !== -1 && process.argv[outIdx + 1]) {
  const outPath = path.resolve(process.cwd(), process.argv[outIdx + 1]);
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
} else {
  process.stdout.write(JSON.stringify(out, null, 2));
}
