import React, { useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Screen, Text, Card } from '../../components';
// @ts-ignore - dynamic require to bypass missing type declarations
const PitchModule: any = (() => { try { return require('react-native-pitch-detector'); } catch { return {}; } })();
const PitchDetector: any = PitchModule.PitchDetector || PitchModule.default || PitchModule;
import { useTheme as usePaperTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// Prefer expo-audio (SDK 54+); fallback to expo-av if not installed
// @ts-ignore
const ExpoAudio: any = (() => { try { return require('expo-audio').Audio; } catch { try { return require('expo-av').Audio; } catch { return null; } } })();
import Constants from 'expo-constants';
import { useAppStore, type InstrumentType } from '../../../store';

// Helper to map frequency to nearest note (A4=440)
const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
function freqToNote(freq: number) {
  const A4 = 440;
  const n = Math.round(12 * Math.log2(freq / A4));
  const noteIndex = (n + 9 + 1200) % 12; // +9 aligns A with index 9
  const octave = 4 + Math.floor((n + 9) / 12);
  const note = NOTE_NAMES[noteIndex];
  const targetFreq = A4 * Math.pow(2, n / 12);
  const cents = 1200 * Math.log2(freq / targetFreq);
  return { note, octave, cents, targetFreq };
}

function noteToFreq(note: string, octave: number) {
  const idx = NOTE_NAMES.indexOf(note.toUpperCase());
  if (idx < 0) return null;
  const midi = 12 * (octave + 1) + idx; // C-1 = 0
  const freq = 440 * Math.pow(2, (midi - 69) / 12);
  return freq;
}

function parseNoteToken(tok: string): { note: string; octave: number } | null {
  const m = (tok || '').trim().match(/^([A-G]#?)(-?\d+)$/i);
  if (!m) return null;
  return { note: m[1].toUpperCase(), octave: parseInt(m[2], 10) };
}

const TUNINGS: Record<InstrumentType, string[]> = {
  guitar: ['E2','A2','D3','G3','B3','E4'],
  ukulele: ['G4','C4','E4','A4'],
  // Charango standard "afinación temple diablo" with reentrant first course (extra E)
  charango: ['G4','C5','E5','A4','E5'],
};

const INSTRUMENT_LABEL: Record<InstrumentType, string> = {
  guitar: 'Violão',
  ukulele: 'Ukulele',
  charango: 'Charango',
};

const TunerScreen = () => {
  const theme = usePaperTheme();
  const isDark = (theme as any).dark ?? false;
  const accent = '#FF5252';
  const { instrument } = useAppStore();

  const [micStatus, setMicStatus] = useState<'checking'|'granted'|'denied'>('checking');
  const [listening, setListening] = useState(false);
  const [freq, setFreq] = useState<number | null>(null);
  const [noteInfo, setNoteInfo] = useState<{note:string;octave:number;cents:number;targetFreq:number} | null>(null);
  const [selectedString, setSelectedString] = useState<string | null>(null);
  const [scaleW, setScaleW] = useState(0);

  const isExpoGo = (Constants as any)?.appOwnership === 'expo';
  const nativePitchAvailable = !!(PitchDetector && (PitchDetector.start || PitchDetector.addListener));
  const SUPPORTED = nativePitchAvailable && !!ExpoAudio && !isExpoGo;

  useEffect(() => {
    (async () => {
      try {
        if (!ExpoAudio) { setMicStatus('denied'); return; }
        const p = await ExpoAudio.requestPermissionsAsync?.();
        setMicStatus(p?.status === 'granted' ? 'granted' : 'denied');
      } catch {
        setMicStatus('denied');
      }
    })();
    return () => {
      try { PitchDetector?.stop?.(); } catch {}
      try { PitchDetector?.removeAllListeners?.(); } catch {}
    };
  }, []);

  useEffect(() => {
    if (freq && freq > 10) setNoteInfo(freqToNote(freq)); else setNoteInfo(null);
  }, [freq]);

  const start = async () => {
    try {
      if (!ExpoAudio) return;
      if (micStatus !== 'granted') {
        const p = await ExpoAudio.requestPermissionsAsync?.();
        setMicStatus(p?.status === 'granted' ? 'granted' : 'denied');
        if (p?.status !== 'granted') return;
      }
      await ExpoAudio.setAudioModeAsync?.({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
      });
      const sub: any = PitchDetector?.addListener?.((data: any) => {
        const f = typeof data === 'number' ? data : (data?.frequency ?? 0);
        setFreq(f);
      });
      (start as any)._sub = sub;
      await PitchDetector?.start?.();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  const stop = async () => {
    try {
      const sub: any = (start as any)._sub;
      if (sub && typeof sub.remove === 'function') sub.remove();
      await PitchDetector?.stop?.();
      PitchDetector?.removeAllListeners?.();
    } finally {
      setListening(false);
      setFreq(null);
    }
  };

  const indicatorColor = !noteInfo ? (isDark ? '#9CA3AF' : '#6B7280') : Math.abs(noteInfo.cents) < 5 ? '#10B981' : '#F59E0B';

  const tuningStrings = TUNINGS[instrument] || TUNINGS.guitar;
  const tuningChips = useMemo(() => tuningStrings.map((s) => s), [tuningStrings]);

  const targetLabel = selectedString || tuningStrings[tuningStrings.length - 1];
  const targetParts = parseNoteToken(targetLabel);
  const targetFreq = targetParts ? noteToFreq(targetParts.note, targetParts.octave) : null;
  const targetDelta = noteInfo && targetFreq ? (1200 * Math.log2((freq || 0.0001) / targetFreq)) : null;

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const centsDisplay = noteInfo ? clamp(noteInfo.cents, -50, 50) : 0;
  const pct = (centsDisplay + 50) / 100; // 0..1

  const trackPadding = 16;
  const trackWidth = Math.max(0, scaleW - trackPadding * 2);
  const markerLeft = trackPadding + pct * trackWidth;
  const tickPositions = [0, 0.25, 0.5, 0.75, 1].map((t) => trackPadding + t * trackWidth);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 pt-6 pb-2">
          <Text variant="h2" className="mb-3">Afinador</Text>
          {!SUPPORTED && (
            <Card className="mb-4 p-4">
              {isExpoGo ? (
                <>
                  <Text variant="body">Afinador indisponível no Expo Go.</Text>
                  <Text variant="small" className="mt-1 text-text-secondary">Instale um Dev Client (expo prebuild + expo run) ou build standalone para usar o afinador.</Text>
                </>
              ) : (
                <>
                  <Text variant="body">Afinador não suportado neste dispositivo.</Text>
                  <Text variant="small" className="mt-1 text-text-secondary">Verifique a instalação do módulo de pitch e as permissões de microfone.</Text>
                </>
              )}
            </Card>
          )}
          {micStatus === 'denied' && (
            <Card className="mb-4 p-4">
              <Text variant="body">Permissão de microfone negada.</Text>
              <Text variant="small" className="mt-1 text-text-secondary">Habilite o microfone nas configurações do sistema para usar o afinador.</Text>
            </Card>
          )}

          <Card className="mb-4 items-center p-4">
            <MaterialCommunityIcons name={"guitar-pick" as any} size={40} color={accent} />
            <Text variant="caption" className="mt-2 text-text-secondary">Toque a corda próximo ao microfone</Text>

            <View className="mt-4 items-center">
              <Text variant="h1" style={{ color: accent }}>
                {noteInfo ? `${noteInfo.note}${noteInfo.octave}` : '--'}
              </Text>
              <Text variant="caption" className="mt-1">{freq ? `${freq.toFixed(1)} Hz` : 'Aguardando...'}</Text>
              <Text variant="small" className="mt-1">{noteInfo ? `${noteInfo.cents > 0 ? '+' : ''}${noteInfo.cents.toFixed(0)} cents` : ''}</Text>
              {targetDelta !== null && (
                <Text variant="small" className="mt-1 text-text-secondary">alvo {targetLabel}: {targetDelta > 0 ? '+' : ''}{Math.round(targetDelta)}¢</Text>
              )}
            </View>

            {/* Needle scale */}
            <View className="mt-5 w-full" onLayout={(e) => setScaleW(e.nativeEvent.layout.width)}>
              <View style={{ height: 48, justifyContent: 'center', alignItems: 'center' }}>
                {/* track */}
                <View style={{ position: 'absolute', left: trackPadding, right: trackPadding, height: 6, backgroundColor: isDark ? '#2A2A2A' : '#E5E7EB', borderRadius: 3 }} />
                {/* ticks */}
                {tickPositions.map((x, i) => (
                  <View key={i} style={{ position: 'absolute', left: x - 1, top: -8, width: 2, height: 22, backgroundColor: isDark ? '#4B5563' : '#9CA3AF' }} />
                ))}
                {/* marker */}
                <View style={{ position: 'absolute', left: markerLeft - 7, width: 14, height: 14, borderRadius: 7, backgroundColor: indicatorColor }} />
                {/* labels */}
                <View style={{ position: 'absolute', left: trackPadding, right: trackPadding, top: 28, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text variant="small" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>-50</Text>
                  <Text variant="small" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>0</Text>
                  <Text variant="small" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>+50</Text>
                </View>
              </View>
            </View>

            {/* Tuning selector */}
            <View className="mt-4 w-full">
              <Text variant="caption" className="mb-2 text-text-secondary">Cordas padrão ({INSTRUMENT_LABEL[instrument]})</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row' }}>
                  {tuningChips.map((s) => (
                    <TouchableOpacity key={s} onPress={() => setSelectedString(s)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, marginRight: 8, backgroundColor: (selectedString || targetLabel) === s ? accent : (isDark ? '#2A2A2A' : '#F3F4F6') }}>
                      <Text variant="small" style={{ color: (selectedString || targetLabel) === s ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#1F2937') }}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Controls */}
            <View className="mt-5 flex-row items-center">
              {!listening ? (
                <TouchableOpacity onPress={start} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: accent, borderRadius: 24, paddingVertical: 10, paddingHorizontal: 16 }}>
                  <MaterialCommunityIcons name="play" size={20} color="#FFFFFF" />
                  <Text variant="body" style={{ color: '#FFFFFF', marginLeft: 8 }}>Iniciar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={stop} style={{ flexDirection: 'row', alignItems: 'center', borderColor: accent, borderWidth: 1, borderRadius: 24, paddingVertical: 10, paddingHorizontal: 16 }}>
                  <MaterialCommunityIcons name="stop" size={20} color={accent} />
                  <Text variant="body" style={{ color: accent, marginLeft: 8 }}>Parar</Text>
                </TouchableOpacity>
              )}
            </View>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default TunerScreen;
