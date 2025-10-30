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

export const ChordDiagram: React.FC<{ chord: ChordShape; size?: number; capoFret?: number }>= ({ chord, size = 96, capoFret = 0 }) => {
  const theme = usePaperTheme();
  const isDark = (theme as any).dark ?? false;
  const grid = isDark ? '#9CA3AF' : '#6B7280';
  const dot = isDark ? '#FFFFFF' : '#111827';
  const strapColor = isDark ? '#4B5563' : '#111827';
  const strapText = '#FFFFFF';

  const padding = 8;
  const width = size;
  // Keep a stable base grid height (previously ~size*1.2 total), independent of CAPO presence
  const headH = 18; // area for x/o below the grid
  const innerW = width - padding * 2;
  const baseTotalNoCapo = Math.round(size * 1.2);
  const baseInnerHNoCapo = baseTotalNoCapo - padding * 2 - headH; // constant grid area
  const gridH = Math.max(64, baseInnerHNoCapo); // ensure reasonable minimum

  const strapH = capoFret > 0 ? 18 : 0; // fixed CAPO strap height when shown
  const headerSpacing = capoFret > 0 ? 6 : 0;
  const headerH = strapH + headerSpacing; // space above grid when capo present
  const height = padding * 2 + headerH + gridH + headH; // total height grows when capo present

  const stringCount = Math.max(4, Math.min(6, chord.strings?.length || 6));
  const fretCount = 5;
  const baseFret = chord.baseFret ?? 1;
  const step = innerW / (stringCount - 1);
  const rowH = gridH / fretCount; // consistent row height per fret space
  const DOT_FRACTION = 0.5; // 0=center

  const relFret = (abs: number) => {
    if (abs <= 0) return 0;
    return baseFret > 1 ? abs - baseFret + 1 : abs;
  };

  return (
    <View style={{ width, height }}>
      {/* Header: fixed CAPO strap when active (square style) */}
      <View style={{ marginHorizontal: padding, height: headerH }}>
        {capoFret > 0 ? (
          <View style={{ height: strapH, borderRadius: 4, backgroundColor: strapColor, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="small" style={{ color: strapText, marginRight: 8 }}>{`${capoFret}ª`}</Text>
            {['C','A','P','O'].map((ch, i) => (
              <Text key={i} variant="small" style={{ color: strapText, marginHorizontal: 2 }}>{ch}</Text>
            ))}
          </View>
        ) : null}
      </View>

      <View style={{ marginHorizontal: padding }}>
        {/* Nut or top line */}
        <View style={{ height: baseFret === 1 ? 4 : 2, backgroundColor: grid, borderRadius: 2 }} />
        {/* Grid */}
        <View style={{ width: innerW, height: gridH, borderColor: grid, borderWidth: 1, borderTopWidth: 0 }}>
          {/* Strings */}
          <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
            {Array.from({ length: stringCount }).map((_, i) => (
              <View key={i} style={{ position: 'absolute', left: i * step, width: 1, top: 0, bottom: 0, backgroundColor: grid }} />
            ))}
          </View>
          {/* Frets */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: gridH }}>
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
          {/* Dots */}
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: gridH }}>
            {chord.strings.map((abs, i) => {
              const dotY = abs > 0 ? (relFret(abs) - (1 - DOT_FRACTION)) * rowH - 6 : -9999;
              const x = i * step;
              return (
                <View key={i} style={{ position: 'absolute', left: x - 6, width: 12, alignItems: 'center' }}>
                  {abs > 0 && (
                    <View style={{ position: 'absolute', top: dotY, width: 12, height: 12, borderRadius: 6, backgroundColor: dot }} />
                  )}
                </View>
              );
            })}
          </View>
        </View>
        {/* Bottom heads: X/O below grid */}
        <View style={{ width: innerW, height: headH, position: 'relative' }}>
          {chord.strings.map((abs, i) => {
            const head = abs < 0 ? 'x' : (abs === 0 && baseFret === 1 ? 'o' : '');
            const x = i * step;
            return (
              <View key={i} style={{ position: 'absolute', left: x - 6, width: 12, alignItems: 'center' }}>
                <Text variant="small">{head}</Text>
              </View>
            );
          })}
        </View>
        {baseFret > 1 ? (
          <Text variant="small" className="mt-1">{baseFret}fr</Text>
        ) : null}
      </View>
    </View>
  );
};
