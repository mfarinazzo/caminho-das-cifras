import type { ChordShape } from './ChordDiagram';
import { getChordShapesFromDb } from './chordDbAdapter';
import type { InstrumentType } from './chordDbAdapter';

// E A D G B E (left->right low to high)
// Absolute frets; -1 mute; 0 open; baseFret indicates diagram start fret.

export const CHORD_SHAPES: Record<string, ChordShape[]> = {
  C: [
    { name: 'C', strings: [-1, 3, 2, 0, 1, 0] }, // open C
    { name: 'C (A-shape barre)', strings: [-1, 3, 5, 5, 5, 3], baseFret: 3, barre: { from: 1, to: 5, fret: 3 } },
    { name: 'C (E-shape barre)', strings: [8, 10, 10, 9, 8, 8], baseFret: 8, barre: { from: 0, to: 5, fret: 8 } },
  ],
  'C#': [
    // Prefer A-shape at 4th fret for easier reach
    { name: 'C# (A-shape barre)', strings: [-1, 4, 6, 6, 6, 4], baseFret: 4, barre: { from: 1, to: 5, fret: 4 } },
  ],
  'C#m': [
    { name: 'C#m (Am-shape barre)', strings: [-1, 4, 6, 6, 5, 4], baseFret: 4, barre: { from: 1, to: 5, fret: 4 } },
  ],
  G: [
    { name: 'G', strings: [3, 2, 0, 0, 0, 3] },
    { name: 'G (E-shape barre)', strings: [3, 5, 5, 4, 3, 3], baseFret: 3, barre: { from: 0, to: 5, fret: 3 } },
    { name: 'G (D-shape high)', strings: [10, 9, 7, 8, 10, -1], baseFret: 7 },
  ],
  D: [
    { name: 'D', strings: [-1, -1, 0, 2, 3, 2] },
    { name: 'D (C-shape barre)', strings: [10, 12, 12, 11, 10, 10], baseFret: 10, barre: { from: 0, to: 5, fret: 10 } },
    { name: 'D (A-shape barre)', strings: [-1, 5, 7, 7, 7, 5], baseFret: 5, barre: { from: 1, to: 5, fret: 5 } },
  ],
  Am: [
    { name: 'Am', strings: [-1, 0, 2, 2, 1, 0] },
    { name: 'Am (E-shape barre)', strings: [5, 7, 7, 5, 5, 5], baseFret: 5, barre: { from: 0, to: 5, fret: 5 } },
    { name: 'Am (D-shape)', strings: [-1, -1, 7, 9, 10, 8], baseFret: 7 },
  ],
  Em: [
    { name: 'Em', strings: [0, 2, 2, 0, 0, 0] },
    { name: 'Em (E-shape barre)', strings: [7, 9, 9, 7, 8, 7], baseFret: 7, barre: { from: 0, to: 5, fret: 7 } },
    { name: 'Em (A-shape)', strings: [-1, 7, 9, 9, 8, 7], baseFret: 7, barre: { from: 1, to: 5, fret: 7 } },
  ],
  E: [
    { name: 'E', strings: [0, 2, 2, 1, 0, 0] },
    { name: 'E (C-shape barre)', strings: [12, 14, 14, 13, 12, 12], baseFret: 12, barre: { from: 0, to: 5, fret: 12 } },
    { name: 'E (G-shape)', strings: [3, 2, 0, 1, 0, 0], baseFret: 1 },
  ],
  A: [
    { name: 'A', strings: [-1, 0, 2, 2, 2, 0] },
    { name: 'A (E-shape barre)', strings: [5, 7, 7, 6, 5, 5], baseFret: 5, barre: { from: 0, to: 5, fret: 5 } },
    { name: 'A (D-shape)', strings: [-1, -1, 7, 6, 5, 5], baseFret: 5 },
  ],
  F: [
    { name: 'F (barre)', strings: [1, 3, 3, 2, 1, 1], baseFret: 1, barre: { from: 0, to: 5, fret: 1 } },
    { name: 'F (A-shape)', strings: [-1, 3, 3, 2, 1, -1], baseFret: 1 },
    { name: 'F (D-shape high)', strings: [13, 12, 10, 11, 13, -1], baseFret: 10 },
  ],
  'F#': [
    { name: 'F# (E-shape barre)', strings: [2, 4, 4, 3, 2, 2], baseFret: 2, barre: { from: 0, to: 5, fret: 2 } },
  ],
  'F#m': [
    { name: 'F#m (Em-shape barre)', strings: [2, 4, 4, 2, 2, 2], baseFret: 2, barre: { from: 0, to: 5, fret: 2 } },
  ],
};

export function findChordShapes(label: string, instrument: InstrumentType = 'guitar'): ChordShape[] {
  // Prefer the chord-db first (supports sharps/flats and many suffixes)
  const dbShapes = getChordShapesFromDb(label, instrument);
  if (dbShapes.length) return dbShapes;

  // Fallback to a tiny static set when DB didn't return anything
  const key = label.replace(/\s+/g, '');
  if (instrument === 'guitar') {
    if (CHORD_SHAPES[key]) return CHORD_SHAPES[key];
    const base = key.match(/^[A-G][#b]?m?/)?.[0] ?? key;
    if (CHORD_SHAPES[base]) return CHORD_SHAPES[base];
  }
  return [];
}
