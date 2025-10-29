import React, { useMemo, useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Screen, Text, Card } from '../../components';
import type { HomeStackScreenProps } from '../../navigation/types';
import { CATEGORY_INDEXES, type SongListItem } from '../../../data/indexes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Searchbar, Chip, useTheme as usePaperTheme } from 'react-native-paper';
import { CATEGORIES } from '../../../shared/constants/categories';
import { useFavoritesStore } from '../../../store';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';

const ItemRow = ({ item }: { item: SongListItem }) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isItemFavorite = isFavorite(item.file);
  const paperTheme = usePaperTheme();
  const isDark = (paperTheme as any).dark ?? false;

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(item.file);
  };

  return (
    <Card
      className="mb-3"
      onPress={() =>
        navigation.navigate('SongDetail', {
          file: item.file,
          title: item.title,
          category: item.category as any,
        })
      }
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text variant="h3">{item.title}</Text>
          <Text variant="caption" className="mt-1 text-text-secondary">
            {(item.reference && String(item.reference).trim()) ||
              ((item as any).subtitle && String((item as any).subtitle).trim()) ||
              ''}
          </Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleFavoritePress} style={{ padding: 4 }}>
            <MaterialCommunityIcons
              name={isItemFavorite ? 'heart' : 'heart-outline'}
              size={16}
              color={isItemFavorite ? '#E91E63' : (isDark ? '#B3B3B3' : '#6B7280')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

export default function CategoryListScreen({ route }: HomeStackScreenProps<'SongList'>) {
  const { categoryId, categoryName } = route.params;
  const data = CATEGORY_INDEXES[categoryId] as SongListItem[];
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'title' | 'reference' | 'lyrics'>('title');
  const meta = CATEGORIES.find((c) => c.id === categoryId);
  const accent = meta?.color ?? '#90CAF9';
  const withAlpha = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '') // remove acentos
      .replace(/[^a-z0-9\s\-_.]/g, '');

  const scheme = require('react-native').useColorScheme?.();
  const { useAppStore } = require('../../../store');
  const modeTheme = useAppStore.getState().themeMode;
  const isDark = modeTheme === 'system' ? scheme === 'dark' : modeTheme === 'dark';

  const filtered = useMemo(() => {
    const q = normalize(query).trim();
    if (!q) return data;
    return data.filter((it) => {
      if (mode === 'title') {
        const t = normalize(it.title);
        return t.includes(q);
      }
      if (mode === 'reference') {
        const ref = normalize((it.reference ?? '') as string);
        return ref.includes(q);
      }
      const lyr = (it as any).lyrics as string | undefined;
      if (!lyr) return false;
      // indexes already store normalized lyrics
      return lyr.includes(q);
    });
  }, [data, query, mode]);

  return (
    <Screen>
      <View className="px-4 pt-6 pb-2">
        <Text variant="h1" className="mb-2">{categoryName}</Text>
        <Text variant="caption" className="mb-3">Lista de cantos</Text>
        <View
          className="mb-3 rounded-full"
          style={{ height: 4, backgroundColor: withAlpha(accent, 0.7) }}
        />
        <Searchbar
          placeholder="Pesquisar cantos..."
          value={query}
          onChangeText={setQuery}
          style={{ marginBottom: 12, backgroundColor: isDark ? withAlpha(accent, 0.08) : '#F3F4F6' }}
          inputStyle={{ color: isDark ? '#FFFFFF' : '#111827' }}
          iconColor={accent}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        />
        {/* Mode chips similar to Search screen */}
        <View className="flex-row flex-wrap gap-2 mb-2">
          <Chip
            selected={mode === 'title'}
            onPress={() => setMode('title')}
            style={{ backgroundColor: mode === 'title' ? (isDark ? '#374151' : '#E5F2FD') : (isDark ? '#2A2A2A' : '#F3F4F6') }}
            textStyle={{ color: mode === 'title' ? (isDark ? '#FFFFFF' : '#1F2937') : (isDark ? '#B3B3B3' : '#6B7280') }}
          >
            Título
          </Chip>
          <Chip
            selected={mode === 'reference'}
            onPress={() => setMode('reference')}
            style={{ backgroundColor: mode === 'reference' ? (isDark ? '#374151' : '#E5F2FD') : (isDark ? '#2A2A2A' : '#F3F4F6') }}
            textStyle={{ color: mode === 'reference' ? (isDark ? '#FFFFFF' : '#1F2937') : (isDark ? '#B3B3B3' : '#6B7280') }}
          >
            Referência
          </Chip>
          <Chip
            selected={mode === 'lyrics'}
            onPress={() => setMode('lyrics')}
            style={{ backgroundColor: mode === 'lyrics' ? (isDark ? '#374151' : '#E5F2FD') : (isDark ? '#2A2A2A' : '#F3F4F6') }}
            textStyle={{ color: mode === 'lyrics' ? (isDark ? '#FFFFFF' : '#1F2937') : (isDark ? '#B3B3B3' : '#6B7280') }}
          >
            Letra
          </Chip>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => <ItemRow item={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        ListEmptyComponent={() => (
          <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
            <Text variant="body">Nenhum canto encontrado.</Text>
          </View>
        )}
      />
    </Screen>
  );
}
