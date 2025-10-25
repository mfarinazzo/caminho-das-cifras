import React, { useMemo, useState } from 'react';
import { View, ScrollView, Modal, Pressable } from 'react-native';
import { Screen, Text } from '../../components';
import type { HomeStackScreenProps } from '../../navigation/types';
import { getSongByFile } from '@data/songs/registry';
import { Chip, Divider } from 'react-native-paper';
import { CATEGORIES } from '../../../shared/constants/categories';

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
  const m = ch.trim().match(/^\s*((?:Do|Re|Mi|Fa|Sol|La|Si|[A-G]))([#b]?)(.*)$/i);
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
  const [transpose, setTranspose] = useState(0);
  const [tonePickerVisible, setTonePickerVisible] = useState(false);
  const CHORD_BAND = 10; // altura reservada por linha para exibir acordes sem invadir a linha acima

  const capoHouse = song?.bracadeira?.tem ? song?.bracadeira?.casa : null;
  const currentKey = song?.tom as string | undefined;
  const categoryMeta = CATEGORIES.find((c) => c.id === (route.params.category as any));
  const accent = categoryMeta?.color ?? '#90CAF9';

  const handleSelectTone = (rootIndex: number, mode: 'maior' | 'menor') => {
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
            style={{
              color: '#FF5252',
              position: 'absolute',
              top: -chordBand,
              left: xs[t.charIndex] ?? 0,
              fontSize: 12,
              lineHeight: 14,
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
    <View className="bg-background-card p-4 rounded-xl">
      <Text variant="h3" className="mb-3">Selecionar tom</Text>
      <Divider style={{ marginBottom: 8, backgroundColor: '#333' }} />
      <View className="flex-row flex-wrap">
        {PT_NOTES.map((n, idx) => (
          <Pressable
            key={n}
            onPress={() => handleSelectTone(idx, 'maior')}
            style={{ paddingVertical: 8, paddingHorizontal: 12, marginRight: 8, marginBottom: 8, borderRadius: 8, backgroundColor: '#1e1e1e' }}
          >
            <Text variant="body">{n}</Text>
          </Pressable>
        ))}
      </View>
      <Text variant="caption" className="mt-2 text-text-secondary">Toque no tom desejado (modo maior). Suporte a menor pode ser adicionado se precisar.</Text>
    </View>
  );

  return (
    <Screen scrollable>
      <View className="px-4 pt-4 pb-2">
        <Text variant="h1" className="mb-1">{title}</Text>
        {song?.referencia ? (
          <Text variant="caption" className="mb-3 text-text-secondary">{song.referencia}</Text>
        ) : null}
        <View className="flex-row items-center mb-4">
          <Chip
            onPress={() => setTonePickerVisible(true)}
            style={{ backgroundColor: '#D32F2F' }}
            textStyle={{ color: '#FFFFFF' }}
          >
            {currentKey ? `Tom: ${currentKey}` : 'Tom: —'}{transpose ? `  (Transp. ${transpose>0?'+':''}${transpose})` : ''}
          </Chip>
          {song?.bracadeira?.tem ? (
            <Chip style={{ marginLeft: 8 }}>
              Braçadeira: {song.bracadeira.casa}
            </Chip>
          ) : null}
        </View>
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
    </Screen>
  );
}
