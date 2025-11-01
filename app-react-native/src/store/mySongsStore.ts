// This file intentionally left as a stub after removing the "Meus Cantos" feature.
// Keeping named exports avoids import errors if any stale references remain.

// Types are narrowed to never to prevent accidental use.
export type MyChord = never;
export type MyLine = never;
export type MySong = never;

export const useMySongsStore = (() => {
  throw new Error('MySongs feature was removed');
}) as unknown as any;
