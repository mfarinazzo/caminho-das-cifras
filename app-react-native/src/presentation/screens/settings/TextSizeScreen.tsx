import React from 'react';
import { View } from 'react-native';
import { Screen, Text, Card } from '../../components';
import Slider from '@react-native-community/slider';
import { useAppStore } from '../../../store';
import { useTheme as usePaperTheme } from 'react-native-paper';

const TextSizeScreen = () => {
  const { textScale, setTextScale } = useAppStore();
  const theme = usePaperTheme();
  const isDark = (theme as any).dark ?? false;

  const min = 0.8;
  const max = 1.6;

  return (
    <Screen scrollable>
      <View className="px-4 pt-6">
        <Text variant="h2" className="mb-4">Tamanho do Texto</Text>
        <Card className="mb-6">
          <Text variant="body" className="mb-2">Pré-visualização</Text>
          <Text variant="h1" className="mb-2">Título de Exemplo</Text>
          <Text variant="body" className="mb-1">Este é um parágrafo de exemplo que muda de tamanho conforme o controle deslizante abaixo.</Text>
          <Text variant="caption">Subtítulo e legendas também acompanham a escala.</Text>
        </Card>

        <Card>
          <View className="mb-2 flex-row justify-between">
            <Text variant="small">Menor</Text>
            <Text variant="small">Maior</Text>
          </View>
          <Slider
            value={textScale}
            minimumValue={min}
            maximumValue={max}
            step={0.05}
            onValueChange={setTextScale}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={isDark ? '#333333' : '#E5E7EB'}
            thumbTintColor={theme.colors.primary}
          />
          <View className="mt-2 items-center">
            <Text variant="caption">Escala atual: {textScale.toFixed(2)}x</Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
};

export default TextSizeScreen;
