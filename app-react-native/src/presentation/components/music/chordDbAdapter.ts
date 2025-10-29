// filepath: src/presentation/components/music/chordDbAdapter.ts
import type { ChordShape } from './ChordDiagram';

// Map PT root names to EN for chord-db
const PT_TO_EN_ROOT: Record<string, string> = {
  'do': 'C', 're': 'D', 'mi': 'E', 'fa': 'F', 'sol': 'G', 'la': 'A', 'si': 'B',
  'c': 'C', 'd': 'D', 'e': 'E', 'f': 'F', 'g': 'G', 'a': 'A', 'b': 'B',
};

function stripDiacriticsAndAccidentals(s: string) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[♯]/g, '#')
    .replace(/[♭]/g, 'b');
}

function parsePtChord(label: string): { rootEn: string; rest: string; displayRoot: string } | null {
  const raw = (label || '').trim();
  const s = stripDiacriticsAndAccidentals(raw);
  // Prefer full solfege tokens over single letters to avoid matching only "D" in "Do"
  const tokens = ['sol', 'si', 'la', 'fa', 'mi', 're', 'do']; // order matters (longest first)
  let matchToken: string | null = null;
  for (const t of tokens) {
    if (s.toLowerCase().startsWith(t)) { matchToken = t; break; }
  }

  let rootToken = '';
  let acc = '';
  let afterIdx = 0;
  if (matchToken) {
    rootToken = s.slice(0, matchToken.length);
    afterIdx = matchToken.length;
  } else if (/^[a-g]/i.test(s)) {
    rootToken = s.charAt(0);
    afterIdx = 1;
  } else {
    return null;
  }

  // Optional accidental right after root
  const nextChar = s.charAt(afterIdx);
  if (nextChar === '#' || nextChar === 'b') {
    acc = nextChar;
    afterIdx += 1;
  }

  const rootEnBase = PT_TO_EN_ROOT[rootToken.toLowerCase()];
  if (!rootEnBase) return null;
  const rootEn = `${rootEnBase}${acc}`;

  // Compute displayRoot from original raw text using equivalent length
  const displayLen = rootToken.length + acc.length;
  const displayRoot = raw.slice(0, displayLen);
  const after = raw.slice(displayLen);
  return { rootEn, rest: after, displayRoot };
}

function normalizeRest(restRaw: string) {
  let r = (stripDiacriticsAndAccidentals(restRaw) || '').toLowerCase();
  r = r.replace(/\s+/g, '');
  r = r.replace(/[()]/g, '');
  // Treat leading minus as minor (e.g., D- => Dm). Also handle unicode minus.
  r = r.replace(/^[-−]/, 'm');
  // Portuguese aliases for minor
  r = r.replace(/^(menor|min)/, 'm');
  // Common aliases
  r = r.replace(/7m|m7/i, 'm7');
  r = r.replace(/7maj|maj7|7m?aj/i, 'maj7');
  r = r.replace(/°|º/g, 'dim');
  r = r.replace(/\+/g, 'aug');
  return r;
}

function suffixCandidates(restNorm: string, isMinor: boolean): string[] {
  const has = (k: string) => restNorm.includes(k);
  const cands: string[] = [];
  const sus2 = has('sus2');
  const sus4 = has('sus4') || (has('sus') && !sus2);
  const add9 = has('add9') || (!has('9') && has('add') && has('9'));
  const maj7 = has('maj7');
  const nine = has('9');
  const seven = has('7') && !maj7 && !nine; // avoid double counting
  const dim = has('dim');
  const aug = has('aug');

  if (dim) return ['dim', 'm7b5', 'm', 'minor'];
  if (aug) return ['aug', '7#5'];

  if (sus2) cands.push('sus2');
  if (sus4) cands.push('sus4');

  if (isMinor) {
    if (nine) cands.unshift('m9', 'min9', 'minor9');
    if (maj7) cands.unshift('mmaj7');
    if (seven) cands.unshift('m7', 'min7', 'minor7');
    cands.push('m', 'minor');
  } else {
    if (maj7) cands.unshift('maj7');
    if (nine) cands.unshift('9');
    if (seven) cands.unshift('7');
    cands.push('major', '');
  }

  if (add9) cands.unshift(isMinor ? 'madd9' : 'add9');

  return Array.from(new Set(cands));
}

function toChordShapesFromPositions(positions: any[]): ChordShape[] {
  return (positions || []).map((p) => {
    const baseFret: number | undefined = p?.baseFret || undefined;
    const relFrets: number[] = (p?.frets ?? []).slice();
    const absFrets = relFrets.map((f) => (f > 0 && baseFret ? f + baseFret - 1 : f));

    // Detect barre from dataset if available
    let barre: ChordShape['barre'] | null = null;
    const barres: number[] = Array.isArray(p?.barres) ? p.barres : [];
    if (barres.length) {
      const bf = barres[0]; // choose first barre fret (relative)
      const absBarreFret = baseFret ? bf + baseFret - 1 : bf;
      const idxs = absFrets
        .map((v, i) => (v === absBarreFret ? i : -1))
        .filter((i) => i >= 0);
      if (idxs.length >= 2) {
        barre = { from: Math.min(...idxs), to: Math.max(...idxs), fret: absBarreFret };
      }
    }

    return {
      name: '',
      strings: absFrets,
      baseFret,
      barre,
    } as ChordShape;
  });
}

function enharmonic(root: string): string | null {
  const sharpToFlat: Record<string, string> = { 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb' };
  const flatToSharp: Record<string, string> = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
  if (root in sharpToFlat) return sharpToFlat[root];
  if (root in flatToSharp) return flatToSharp[root];
  return null;
}

function displaySuffixFromDb(suf: string, isMinor?: boolean): string {
  const s = (suf || '').toLowerCase();
  if (s === 'major' || s === '') return isMinor ? 'm' : '';
  if (s === 'minor') return 'm';
  // Normalize any stray '-' coming from user input (we don't expect from DB)
  if (s === '-') return 'm';
  return suf;
}

export type InstrumentType = 'guitar' | 'ukulele';

function loadChordDb(instrument: InstrumentType) {
  // Try package entry first (if present)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const db = require('@tombatossals/chords-db');
    const byInstr = (
      db?.default?.instruments?.[instrument] ||
      db?.instruments?.[instrument] ||
      db?.[instrument] ||
      (db?.chords ? db : undefined)
    );
    if (byInstr?.chords) return byInstr;
  } catch {}

  // Static JSON fallbacks (Metro requires static paths)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const guitarJson = require('@tombatossals/chords-db/lib/guitar.json');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ukuleleJson = require('@tombatossals/chords-db/lib/ukulele.json');
  return instrument === 'ukulele' ? ukuleleJson : guitarJson;
}

export function getChordShapesFromDb(label: string, instrument: InstrumentType = 'guitar'): ChordShape[] {
  if (!label) return [];
  const parsed = parsePtChord(label);
  if (!parsed) return [];
  const restNorm = normalizeRest(parsed.rest);
  const isMinor = /^m/.test(restNorm);
  const suffixes = suffixCandidates(restNorm, isMinor);

  const rootDb = loadChordDb(instrument);
  if (!rootDb?.chords) return [];

  const tryRoots = [parsed.rootEn];
  const alt = enharmonic(parsed.rootEn);
  if (alt) tryRoots.push(alt);

  for (const root of tryRoots) {
    const list = rootDb.chords[root];
    if (!Array.isArray(list)) continue;

    for (const suf of suffixes) {
      const match = list.find((c: any) => (c?.suffix || '').toLowerCase() === String(suf).toLowerCase());
      if (match && Array.isArray(match.positions) && match.positions.length) {
        const shapes = toChordShapesFromPositions(match.positions);
        const dispSuf = displaySuffixFromDb(match.suffix, isMinor);
        shapes.forEach((s) => (s.name = `${parsed.displayRoot}${dispSuf}`));
        return shapes;
      }
    }
  }

  return [];
}
