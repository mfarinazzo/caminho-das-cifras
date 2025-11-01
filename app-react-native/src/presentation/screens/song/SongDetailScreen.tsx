import React, { useMemo, useState } from 'react';
import { View, ScrollView, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Screen, Text } from '../../components';
import type { HomeStackScreenProps } from '../../navigation/types';
import { getSongByFile } from '@data/songs/registry';
import { Chip, Divider, IconButton, useTheme as usePaperTheme, TextInput, Button } from 'react-native-paper';
import { CATEGORIES } from '../../../shared/constants/categories';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFavoritesStore, useAppStore } from '../../../store';
import { ChordDiagram } from '../../components';
import { findChordShapes } from '../../components/music/chordShapes';
import type { InstrumentType } from '../../../store';
import Slider from '@react-native-community/slider';

// Notas e transposição (Português)
const PT_NOTES = ['Do','Do#','Re','Re#','Mi','Fa','Fa#','Sol','Sol#','La','La#','Si'] as const;
const NOTE_TO_SEMITONE: Record<string, number> = {
  'do':0,'do#':1,'dob':11,
  're':2,'re#':3,'reb':1,
  'mi':4,'mib':3,
  'fa':5,'fa#':6,'fab':4,
  'sol':7,'sol#':8,'solb':6,
  'la':9,'la#':10,'lab':8,
  'si':11,'sib':10,
  'c':0,'c#':1,'cb':11,
  'd':2,'d#':3,'db':1,
  'e':4,'eb':3,
  'f':5,'f#':6,'fb':4,
  'g':7,'g#':8,'gb':6,
  'a':9,'a#':10,'ab':8,
  'b':11,'bb':10,
};

const SEMITONE_TO_PT = PT_NOTES as unknown as string[];

function parseChord(ch: string): { root: number; rest: string } | null {
  if (!ch) return null;
  // allow optional space between root and accidental (e.g., "Do #", "Re b")
  const m = ch.trim().match(/^\s*((?:Do|Re|Mi|Fa|Sol|La|Si|[A-G]))\s*([#b]?)(.*)$/i);
  if (!m) return null;
  const note = (m[1] || '').toLowerCase();
  const acc = (m[2] || '').toLowerCase();
  const rest = (m[3] || '').trim();
  const key = note + acc;
  const root = NOTE_TO_SEMITONE[key];
  if (root === undefined) return null;
  return { root, rest };
}

function transposeChord(ch: string, semitones: number): string {
  const p = parseChord(ch);
  if (!p) return ch;
  const newRoot = (p.root + (semitones % 12) + 12) % 12;
  return `${SEMITONE_TO_PT[newRoot]}${p.rest}`;
}

function normalizeWord(w: string): string {
  return w
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacríticos combinantes
    .replace(/[^a-z0-9à-úçãõâêîôûáéíóúüñ]+/gi, '');
}

function splitWords(line: string): string[] {
  // mantém palavras e pontuação como tokens, separando por espaços
  return (line || '').split(/(\s+)/).filter((t) => t.length > 0);
}

// Detecta letras latinas (inclui acentuadas comuns) sem usar escapes Unicode avançados
const LETTER_RE = /[A-Za-zÀ-ÖØ-öø-ÿ]/;

function getLetterIndices(s: string): number[] {
  const idxs: number[] = [];
  for (let i = 0; i < s.length; i++) {
    if (LETTER_RE.test(s[i])) idxs.push(i);
  }
  return idxs;
}

type SongJson = any;

export default function SongDetailScreen({ route }: HomeStackScreenProps<'SongDetail'>) {
  const { file, title } = route.params;
  const song: SongJson | undefined = getSongByFile(file);
  const { instrument, capoBySong, setCapoForSong, clearCapoForSong, transposeBySong, setTransposeForSong, clearTransposeForSong, notesBySong, setNoteForSong, clearNoteForSong } = useAppStore();
  const savedCapo = capoBySong[file] ?? 0;
  const savedTranspose = transposeBySong[file] ?? 0;

  const [transpose, setTranspose] = useState(savedTranspose);
  const [tonePickerVisible, setTonePickerVisible] = useState(false);
  const [capoPickerVisible, setCapoPickerVisible] = useState(false);
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const CHORD_BAND = 10; // altura reservada por linha para exibir acordes sem invadir a linha acima

  // Favoritos
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isCurrentFavorite = isFavorite(file);
  const paperTheme = usePaperTheme();
  const isDark = (paperTheme as any).dark ?? false;
  const strapColor = isDark ? '#4B5563' : '#111827';
  const strapText = '#FFFFFF';

  const capoHouse = song?.bracadeira?.tem ? song?.bracadeira?.casa : null;
  const currentKey = song?.tom as string | undefined;
  const categoryMeta = CATEGORIES.find((c) => c.id === (route.params.category as any));
  const accent = categoryMeta?.color ?? '#90CAF9';

  const scrollRef = React.useRef<ScrollView | null>(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const [speed, setSpeed] = useState(30); // pixels per second
  const [controlsVisible, setControlsVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const savedNote = notesBySong[file] || '';
  const [noteModal, setNoteModal] = useState(false);
  const [noteText, setNoteText] = useState(savedNote);

  // compute currently active root for highlight in tone menu
  let origIdx = -1;
  let origMode: 'maior' | 'menor' | null = null;
  if (currentKey) {
    const m = currentKey.match(/^(Do|Do#|Re|Re#|Mi|Fa|Fa#|Sol|Sol#|La|La#|Si)\s+(maior|menor)$/);
    if (m) {
      origIdx = PT_NOTES.indexOf(m[1] as any);
      origMode = (m[2] as 'maior' | 'menor');
    }
  }
  const activeRootIdx = origIdx >= 0 ? ((origIdx + transpose) % 12) : -1;

  React.useEffect(() => {
    let raf: number | null = null;
    let last = Date.now();
    const tick = () => {
      if (!autoScroll || !scrollRef.current) return;
      const now = Date.now();
      const dt = Math.max(0, now - last) / 1000;
      last = now;
      const nextY = ((scrollRef as any)._y || 0) + speed * dt;
      scrollRef.current.scrollTo({ y: nextY, animated: false });
      (scrollRef as any)._y = nextY;
      raf = requestAnimationFrame(tick as any);
    };
    if (autoScroll) {
      last = Date.now();
      raf = requestAnimationFrame(tick as any);
    }
    return () => {
      if (raf) cancelAnimationFrame(raf as any);
    };
  }, [autoScroll, speed]);

  const onScroll = React.useCallback((e: any) => {
    (scrollRef as any)._y = e.nativeEvent.contentOffset.y;
  }, []);

  const handleSelectTone = (rootIndex: number) => {
    // calcula offset com base no tom original, se existir
    let offset = 0;
    if (currentKey) {
      const m = currentKey.match(/^(Do|Do#|Re|Re#|Mi|Fa|Fa#|Sol|Sol#|La|La#|Si)\s+(maior|menor)$/);
      if (m) {
        const origIdx = PT_NOTES.indexOf(m[1] as any);
        if (origIdx >= 0) {
          offset = (rootIndex - origIdx + 12) % 12;
        }
      }
    }
    setTranspose(offset);
    setTransposeForSong(file, offset);
    setTonePickerVisible(false);
  };

  const toSentenceCase = (s: string) => {
    const lower = (s || '').toLowerCase();
    const m = lower.match(/^\s*["'«“]?/);
    const lead = m ? m[0] : '';
    const rest = lower.slice(lead.length);
    if (!rest) return lower;
    return lead + rest.charAt(0).toUpperCase() + rest.slice(1);
  };

  function parseChordParts(ch: string): { root: string; acc: string; rest: string } | null {
    // keep in sync with parseChord: allow optional space before accidental
    const m = ch.trim().match(/^\s*((?:Do|Re|Mi|Fa|Sol|La|Si|[A-G]))\s*([#b]?)(.*)$/i);
    if (!m) return null;
    return { root: m[1], acc: m[2] || '', rest: (m[3] || '').trim() };
  }

  // Convert Portuguese chord label to an English-style label suitable for chord shape lookup
  function toEnglishShapeLabel(label: string): string {
    const p = parseChordParts(label);
    if (!p) return label;
    const rootLc = p.root.toLowerCase();
    const map: Record<string, string> = {
      'do': 'C', 're': 'D', 'mi': 'E', 'fa': 'F', 'sol': 'G', 'la': 'A', 'si': 'B',
      'c': 'C', 'd': 'D', 'e': 'E', 'f': 'F', 'g': 'G', 'a': 'A', 'b': 'B',
    };
    const enRoot = map[rootLc] || p.root.toUpperCase();

    // normalize minor markers: '-' or 'menor' -> 'm' (keep other qualifiers like 7, sus, add)
    const rest = (p.rest || '').trim();
    let restNorm = rest;
    if (/^[-\u2212]/.test(restNorm)) { // '-' or unicode minus
      restNorm = restNorm.replace(/^[-\u2212]\s*/, 'm');
    } else if (/^menor\b/i.test(restNorm)) {
      restNorm = restNorm.replace(/^menor\b/i, 'm');
    }
    // normalize spacing so shapes key becomes like 'C#m', 'Fm7'
    const acc = p.acc || '';
    const spaced = `${enRoot}${acc}${restNorm ? ' ' + restNorm : ''}`;
    return spaced;
  }

  const uniqueChords: string[] = useMemo(() => {
    if (!song) return [];
    const set = new Map<string, string>();
    (song.colunas || []).forEach((col: any) => {
      (col.estrofes || []).forEach((est: any) => {
        (est.linhas || []).forEach((ln: any) => {
          (ln.acordes || []).forEach((c: any) => {
            const label = transposeChord(c.cifra || '', transpose).trim();
            const parts = parseChordParts(label);
            if (!parts) return;
            const display = `${parts.root}${parts.acc}${parts.rest ? ' ' + parts.rest : ''}`.trim();
            const key = `${parts.root}${parts.acc}${(parts.rest || '').replace(/\s+/g, '')}`;
            if (!set.has(key)) set.set(key, display);
          });
        });
      });
    });
    return Array.from(set.values());
  }, [song, transpose]);

  // crude mapper to a simple shape just for demo; can be extended later
  const mapToShape = (label: string) => ({
    name: label,
    strings: [ -1, 3, 2, 0, 1, 0 ], // default C major-ish placeholder
  });

  // Componente para renderizar uma palavra com acordes posicionados sobre um caractere específico
  const WordToken: React.FC<{
    text: string;
    bold?: boolean;
    chordBand: number;
    chords: Array<{ label: string; charIndex: number }>;
  }> = ({ text, bold, chordBand, chords }) => {
    const [xs, setXs] = useState<number[]>([]);
    return (
      <View style={{ position: 'relative', marginRight: 8, marginBottom: 6 }}>
        {chords.map((t, k) => (
          <Text
            key={`ch-${k}`}
            variant="small"
            // onPress removed as requested (non-clickable)
            style={{
              color: '#FF5252',
              position: 'absolute',
              top: -chordBand,
              left: xs[t.charIndex] ?? 0,
              fontSize: 12,
              lineHeight: 14,
              textDecorationLine: 'none',
            }}
          >
            {t.label}
          </Text>
        ))}
        <View style={{ flexDirection: 'row' }}>
          {Array.from(text).map((ch, ci) => (
            <Text
              // eslint-disable-next-line react/no-array-index-key
              key={ci}
              variant="body"
              className={bold ? 'font-bold' : ''}
              onLayout={(e) => {
                const x = e.nativeEvent.layout.x;
                setXs((prev) => (prev[ci] === x ? prev : Object.assign([], prev, { [ci]: x })));
              }}
            >
              {ch}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderLine = (
    ln: any,
    idx: number,
    mode: 'S' | 'A' | 'N',
    capState?: { done: boolean }
  ) => {
    const tokens = splitWords(ln.letra || '');
    const occ: Record<string, number> = {};
    const chords = (ln.acordes || []) as Array<{
      cifra: string;
      palavra_alvo: string;
      ocorrencia_palavra?: number | null;
      posicao?: number | null;
    }>;
    return (
      <View
        key={idx}
        className="flex-row flex-wrap"
        style={{ paddingTop: CHORD_BAND, marginBottom: 6, rowGap: 8 }}
      >
        {tokens.map((tok, i) => {
          if (/^\s+$/.test(tok)) {
            return <View key={i} style={{ width: 4, height: 0 }} />;
          }
          const base = normalizeWord(tok);
          occ[base] = (occ[base] || 0) + 1;
          const matchChords = chords.filter(
            (c) => normalizeWord(c.palavra_alvo || '') === base && (c.ocorrencia_palavra || 1) === occ[base]
          );
          const chordItems = matchChords.map((c) => ({
            label: transposeChord(c.cifra || '', transpose),
            posicao: typeof c.posicao === 'number' ? c.posicao : null,
          }));

          // Formatting rules
          let displayTok = tok;
          if (mode === 'A') {
            displayTok = tok.toUpperCase();
          } else if (mode === 'S') {
            // português básico: apenas a primeira letra da estrofe em maiúscula
            const lower = tok.toLowerCase();
            if (capState && !capState.done) {
              const nonSpaceIdx = lower.search(/\S/);
              if (nonSpaceIdx >= 0) {
                displayTok =
                  lower.slice(0, nonSpaceIdx) +
                  lower.charAt(nonSpaceIdx).toUpperCase() +
                  lower.slice(nonSpaceIdx + 1);
                capState.done = true;
              } else {
                displayTok = lower;
              }
            } else {
              displayTok = lower;
            }
          }

          // Renderiza por caractere apenas se houver acorde(s) para posicionar; senão, usa Text simples
          if (!chordItems.length) {
            return (
              <View key={i} style={{ position: 'relative', marginRight: 8, marginBottom: 6 }}>
                <Text variant="body" className={mode === 'A' ? 'font-bold' : ''}>{displayTok}</Text>
              </View>
            );
          }

          // Mapear índices de letras no token renderizado para alinhar com posicao
          const letterIdxs = getLetterIndices(displayTok);
          const targets = chordItems.map((ci) => {
            const count = letterIdxs.length;
            if (!count) return { label: ci.label, charIndex: 0 };
            const pos = typeof ci.posicao === 'number' ? Math.max(0, Math.min(ci.posicao!, count - 1)) : 0;
            return { label: ci.label, charIndex: letterIdxs[pos] };
          });

          return (
            <WordToken
              key={i}
              text={displayTok}
              bold={mode === 'A'}
              chordBand={CHORD_BAND}
              chords={targets}
            />
          );
        })}
      </View>
    );
  };

  const toneGrid = (
    <View className="p-4 rounded-xl" style={{ backgroundColor: paperTheme.colors.surface }}>
      <Text variant="h3" className="mb-3">Selecionar tom</Text>
      <Divider style={{ marginBottom: 8, backgroundColor: isDark ? '#333333' : '#E5E7EB' }} />
      {/* Modo segue o da música; sem seletor de maior/menor */}
      <View className="flex-row flex-wrap">
        {PT_NOTES.map((n, idx) => {
          const selected = idx === activeRootIdx;
          return (
            <Pressable
              key={n}
              onPress={() => handleSelectTone(idx)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                marginRight: 8,
                marginBottom: 8,
                borderRadius: 8,
                backgroundColor: selected ? strapColor : (isDark ? '#FFFFFF' : '#111827'),
                borderWidth: 1,
                borderColor: isDark ? '#374151' : '#E5E7EB',
              }}
            >
              <Text variant="body" style={{ color: selected ? strapText : undefined }}>{n}</Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable onPress={() => { setTranspose(0); clearTransposeForSong(file); setTonePickerVisible(false); }}
        style={{ marginTop: 12, alignSelf: 'stretch', paddingVertical: 12, borderRadius: 10, backgroundColor: strapColor, alignItems: 'center' }}>
        <Text variant="body" style={{ color: strapText }}>Restaurar padrão</Text>
      </Pressable>
      <Text variant="caption" className="mt-2 text-text-secondary">Toque no tom desejado.</Text>
    </View>
  );

  const capoGrid = (
    <View className="p-4 rounded-xl" style={{ backgroundColor: paperTheme.colors.surface }}>
      <Text variant="h3" className="mb-3">Braçadeira (Capo)</Text>
      <Divider style={{ marginBottom: 8, backgroundColor: isDark ? '#333333' : '#E5E7EB' }} />
      <View className="flex-row flex-wrap items-center mb-2">
        {[0,1,2,3,4,5,6,7].map((f) => {
          const selected = savedCapo === f;
          return (
            <Pressable
              key={f}
              onPress={() => { setCapoForSong(file, f); setCapoPickerVisible(false); }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                marginRight: 8,
                marginBottom: 8,
                borderRadius: 8,
                backgroundColor: selected ? strapColor : (isDark ? '#FFFFFF' : '#111827'),
                borderWidth: 1,
                borderColor: isDark ? '#374151' : '#E5E7EB',
              }}
            >
              <Text variant="body" style={{ color: selected ? strapText : undefined }}>{f === 0 ? 'Sem' : `${f}ª`}</Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable onPress={() => { clearCapoForSong(file); setCapoPickerVisible(false); }}
        style={{ marginTop: 4, alignSelf: 'stretch', paddingVertical: 12, borderRadius: 10, backgroundColor: strapColor, alignItems: 'center' }}>
        <Text variant="body" style={{ color: strapText }}>Restaurar padrão</Text>
      </Pressable>
      <Text variant="caption" className="mt-2 text-text-secondary">Defina a casa do capo e visualize no diagrama.</Text>
    </View>
  );

  const noteGrid = (
    <View className="p-4 rounded-xl" style={{ backgroundColor: paperTheme.colors.surface }}>
      <Text variant="h3" className="mb-3">Anotação</Text>
      <Divider style={{ marginBottom: 8, backgroundColor: isDark ? '#333333' : '#E5E7EB' }} />
      <TextInput
        mode="outlined"
        placeholder="Escreva até 150 caracteres"
        value={noteText}
        onChangeText={(t) => setNoteText((t || '').slice(0,150))}
        multiline
        numberOfLines={3}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
        {savedNote ? (
          <Button onPress={() => { clearNoteForSong(file); setNoteText(''); setNoteModal(false); }} textColor="#FF5252">Excluir</Button>
        ) : null}
        <Button onPress={() => { setNoteForSong(file, (noteText || '').slice(0,150)); setNoteModal(false); }}>
          Salvar
        </Button>
      </View>
      <Text variant="caption" className="mt-2 text-text-secondary">Sua anotação fica visível acima do texto do canto.</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView ref={scrollRef} onScroll={onScroll} scrollEventThrottle={16}>
        <Screen scrollable={false}>
          <View className="px-4 pt-4 pb-2">
            <View className="flex-row items-center justify-between mb-1">
              <Text variant="h1" className="flex-1">{title}</Text>
              <TouchableOpacity
                onPress={() => toggleFavorite(file)}
                style={{ padding: 4 }}
              >
                <MaterialCommunityIcons
                  name={isCurrentFavorite ? "heart" : "heart-outline"}
                  size={20}
                  color={isCurrentFavorite ? "#E91E63" : (isDark ? "#FFFFFF" : "#111827")}
                />
              </TouchableOpacity>
            </View>
            {song?.referencia ? (
              <Text variant="caption" className="mb-3 text-text-secondary">{song.referencia}</Text>
            ) : null}
            <View className="flex-row items-center mb-2">
              <Chip
                onPress={() => setTonePickerVisible(true)}
                style={{ backgroundColor: '#D32F2F' }}
                textStyle={{ color: '#FFFFFF' }}
              >
                {activeRootIdx >= 0 ? `Tom: ${PT_NOTES[activeRootIdx]}${origMode ? ' ' + origMode : ''}` : (currentKey ? `Tom: ${currentKey}` : 'Tom: —')}{transpose ? `  (Transp. ${transpose>0?'+':''}${transpose})` : ''}
              </Chip>
              <Chip style={{ marginLeft: 8 }} onPress={() => setCapoPickerVisible(true)}>
                Braçadeira: {savedCapo ? `${savedCapo}ª` : (song?.bracadeira?.tem ? `${song.bracadeira.casa}ª` : '—')}
              </Chip>
            </View>
            {/* Chord diagrams strip below tone/capo, expanded and not clickable */}
            {uniqueChords.length ? (
              <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8, paddingRight: 32 }}>
                {uniqueChords.map((c) => {
                  const searchLabel = toEnglishShapeLabel(c);
                  const shapes = findChordShapes(searchLabel, instrument as InstrumentType);
                  const shape = shapes.length ? { ...shapes[0], name: c } : null;
                  return (
                    <View key={c} style={{ alignItems: 'center', marginRight: 20 }}>
                      {shape ? (
                        <ChordDiagram chord={shape} capoFret={savedCapo || (song?.bracadeira?.tem ? song.bracadeira.casa : 0)} />
                      ) : (
                        <View style={{ width: 96, height: Math.round(96*1.2), alignItems: 'center', justifyContent: 'center' }}>
                          <Text variant="small" className="text-text-secondary">sem diagrama</Text>
                        </View>
                      )}
                      <Text variant="small" className="mt-1">{c}</Text>
                    </View>
                  );
                })}
              </ScrollView>
            ) : null}

            {/* Song note (if any) */}
            {savedNote ? (
              <View className="mb-2">
                <Text variant="small" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>{`"${savedNote}"`}</Text>
              </View>
            ) : null}
          </View>

          {!song ? (
            <View className="px-4 pb-4"><Text variant="body">Canto não encontrado.</Text></View>
          ) : (
            <View className="px-4 pb-6">
              {(song.colunas || []).map((col: any, ci: number) => (
                <View key={ci} className="mb-4">
                  {(col.estrofes || []).map((est: any, ei: number) => {
                    const ind = (est.indicador || '').toString().trim().toUpperCase();
                    const mode: 'S' | 'A' | 'N' = ind.startsWith('S') ? 'S' : ind.startsWith('A') ? 'A' : 'N';
                    const hasBis = !!(est.repeticao && String(est.repeticao).toLowerCase().includes('bis'));
                    const capState = { done: false };
                    return (
                      <View key={ei} className="mb-3 flex-row">
                        {hasBis ? (
                          <View style={{ width: 4, borderRadius: 2, backgroundColor: accent, marginRight: 10 }} />
                        ) : null}
                        <View style={{ flex: 1 }}>
                          {est.indicador ? (
                            <Text variant="small" className="mb-2 text-text-secondary">{est.indicador}{est.repeticao ? ` • ${est.repeticao}` : ''}</Text>
                          ) : null}
                          {(est.linhas || []).map((ln: any, li: number) => renderLine(ln, li, mode, capState))}
                        </View>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          )}

          <Modal visible={tonePickerVisible} transparent animationType="fade" onRequestClose={() => setTonePickerVisible(false)}>
            <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', padding: 16, justifyContent: 'center' }} onPress={() => setTonePickerVisible(false)}>
              {toneGrid}
            </Pressable>
          </Modal>

          <Modal visible={capoPickerVisible} transparent animationType="fade" onRequestClose={() => setCapoPickerVisible(false)}>
            <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', padding: 16, justifyContent: 'center' }} onPress={() => setCapoPickerVisible(false)}>
              {capoGrid}
            </Pressable>
          </Modal>

          <Modal visible={noteModal} transparent animationType="fade" onRequestClose={() => setNoteModal(false)}>
            <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', padding: 16, justifyContent: 'center' }} onPress={() => setNoteModal(false)}>
              {noteGrid}
            </Pressable>
          </Modal>

          <Modal visible={!!selectedChord} transparent animationType="fade" onRequestClose={() => setSelectedChord(null)}>
            {/* Removed modal content since diagrams are inline and non-clickable */}
            <Pressable style={{ flex: 1 }} onPress={() => setSelectedChord(null)} />
          </Modal>
        </Screen>
      </ScrollView>

      {/* Floating menu and sub-buttons */}
      {!controlsVisible ? (
        <>
          <TouchableOpacity
            onPress={() => setMenuOpen((v) => !v)}
            style={{ position: 'absolute', right: 16, bottom: 16, width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF5252', elevation: 2 }}
          >
            <MaterialCommunityIcons name={menuOpen ? 'close' : 'menu'} size={26} color="#FFFFFF" />
          </TouchableOpacity>
          {menuOpen ? (
            <>
              <TouchableOpacity
                onPress={() => { setMenuOpen(false); setControlsVisible(true); }}
                style={{ position: 'absolute', right: 16, bottom: 16 + 56, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF5252', elevation: 2 }}
              >
                <MaterialCommunityIcons name="tortoise" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setMenuOpen(false); setNoteText(notesBySong[file] || ''); setNoteModal(true); }}
                style={{ position: 'absolute', right: 16, bottom: 16 + 56 + 48, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF5252', elevation: 2 }}
              >
                <MaterialCommunityIcons name="note-edit-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : null}
        </>
      ) : null}

      {/* Auto-scroll controls panel (shown on demand) */}
      {controlsVisible ? (
        <View style={{ position: 'absolute', left: 8, right: 8, bottom: 8, padding: 12, borderRadius: 12, backgroundColor: 'rgba(17,17,23,0.9)' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="tortoise" size={22} color="#FFFFFF" />
            <View style={{ flex: 1, marginHorizontal: 12 }}>
              <Slider
                minimumValue={5}
                maximumValue={120}
                step={1}
                value={speed}
                onValueChange={setSpeed}
                minimumTrackTintColor="#FF5252"
                maximumTrackTintColor="#888888"
                thumbTintColor="#FFFFFF"
              />
            </View>
            <TouchableOpacity onPress={() => setAutoScroll((v) => !v)} style={{ paddingHorizontal: 8 }}>
              <MaterialCommunityIcons name={autoScroll ? 'pause-circle' : 'play-circle'} size={26} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setControlsVisible(false)} style={{ paddingHorizontal: 4, marginLeft: 4 }}>
              <MaterialCommunityIcons name="chevron-down" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}
