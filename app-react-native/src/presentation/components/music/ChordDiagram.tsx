import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/Text';
import { useTheme as usePaperTheme } from 'react-native-paper';

export type ChordShape = {
  name: string;
  strings: number[]; // absolute fret numbers per string EADGBE, -1 mute, 0 open
  baseFret?: number; // starting fret of the diagram (default 1)
  barre?: { from: number; to: number; fret: number } | null; // string indices 0..5 left->right
};

export const ChordDiagram: React.FC<{ chord: ChordShape; size?: number }>= ({ chord, size = 96 }) => {
  const theme = usePaperTheme();
  const isDark = (theme as any).dark ?? false;
  const grid = isDark ? '#9CA3AF' : '#6B7280';
  const dot = isDark ? '#FFFFFF' : '#111827';

  const width = size;
  const height = Math.round(size * 1.2);
  const padding = 8;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2 - 18;
  const stringCount = Math.max(4, Math.min(6, chord.strings?.length || 6));
  const fretCount = 5;
  const baseFret = chord.baseFret ?? 1;
  const step = innerW / (stringCount - 1);
  const rowH = innerH / fretCount; // consistent row height per fret space
  const DOT_FRACTION = 0.5; // 0=center; keep central and consistent across frets

  const relFret = (abs: number) => {
    if (abs <= 0) return 0;
    return baseFret > 1 ? abs - baseFret + 1 : abs;
  };

  return (
    <View style={{ width, height }}>
      <Text variant="small" className="mb-1">{chord.name}</Text>
      <View style={{ marginHorizontal: padding }}>
        {/* Nut or top line */}
        <View style={{ height: baseFret === 1 ? 4 : 2, backgroundColor: grid, borderRadius: 2 }} />
        {/* Grid */}
        <View style={{ width: innerW, height: innerH, borderColor: grid, borderWidth: 1, borderTopWidth: 0 }}>
          {/* Strings */}
          <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
            {Array.from({ length: stringCount }).map((_, i) => (
              <View key={i} style={{ position: 'absolute', left: i * step, width: 1, top: 0, bottom: 0, backgroundColor: grid }} />
            ))}
          </View>
          {/* Frets: absolute lines at fixed multiples of rowH to avoid drift */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: innerH }}>
            {Array.from({ length: fretCount - 1 }).map((_, i) => (
              <View key={i} style={{ position: 'absolute', top: (i + 1) * rowH, left: 0, right: 0, height: 1, backgroundColor: grid }} />
            ))}
          </View>
          {/* Barre */}
          {chord.barre ? (
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
              {(() => {
                const y = (relFret(chord.barre!.fret) - 0.5) * rowH - 6;
                const x1 = chord.barre!.from * step - 6;
                const x2 = chord.barre!.to * step + 6;
                return (
                  <View style={{ position: 'absolute', top: y, left: Math.min(x1, x2), width: Math.abs(x2 - x1), height: 12, backgroundColor: dot, borderRadius: 6 }} />
                );
              })()}
            </View>
          ) : null}
          {/* Dots + string heads, centered on string lines */}
          <View style={{ position: 'absolute', left: 0, right: 0, top: -18, height: innerH + 18 }}>
            {chord.strings.map((abs, i) => {
              const head = abs < 0 ? 'x' : (abs === 0 && baseFret === 1 ? 'o' : '');
              const dotY = abs > 0 ? (relFret(abs) - (1 - DOT_FRACTION)) * rowH - 6 + 18 : -9999;
              const x = i * step;
              return (
                <View key={i} style={{ position: 'absolute', left: x - 6, width: 12, alignItems: 'center' }}>
                  <Text variant="small">{head}</Text>
                  {abs > 0 && (
                    <View style={{ position: 'absolute', top: dotY, width: 12, height: 12, borderRadius: 6, backgroundColor: dot }} />
                  )}
                </View>
              );
            })}
          </View>
        </View>
        {baseFret > 1 ? (
          <Text variant="small" className="mt-1">{baseFret}fr</Text>
        ) : null}
      </View>
    </View>
  );
};
