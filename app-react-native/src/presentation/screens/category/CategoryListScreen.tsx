import React, { useMemo, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Screen, Text, Card } from '../../components';
import type { HomeStackScreenProps } from '../../navigation/types';
import { CATEGORY_INDEXES, type SongListItem } from '../../../data/indexes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Searchbar, Chip } from 'react-native-paper';
import { CATEGORIES } from '../../../shared/constants/categories';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';

const ItemRow = ({ item }: { item: SongListItem }) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  return (
  <Card className="mb-3" onPress={() => navigation.navigate('SongDetail', { file: item.file, title: item.title, category: item.category as any })}>
    <View className="flex-row items-center justify-between">
      <View className="flex-1 pr-3">
        <Text variant="h3">{item.title}</Text>
        <Text variant="caption" className="mt-1 text-gray-400">
          {(item.reference && String(item.reference).trim()) || ((item as any).subtitle && String((item as any).subtitle).trim()) || ''}
        </Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#666666" />
    </View>
  </Card>
);
}

export default function CategoryListScreen({ route }: HomeStackScreenProps<'SongList'>) {
  const { categoryId, categoryName } = route.params;
  const data = CATEGORY_INDEXES[categoryId] as SongListItem[];
  const [query, setQuery] = useState('');
  const [onlyChords, setOnlyChords] = useState(false);
  const [onlyCapo, setOnlyCapo] = useState(false);
  const [onlyWithRef, setOnlyWithRef] = useState(false);
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

  const filtered = useMemo(() => {
    const q = normalize(query);
    let base = data;
    if (onlyChords) {
      base = base.filter((it) => !!it.hasChords);
    }
    if (onlyCapo) {
      base = base.filter((it) => !!it.hasCapo);
    }
    if (onlyWithRef) {
      base = base.filter((it) => (it.reference ?? '').toString().trim().length > 0);
    }

    if (!q) return base;
    return base.filter((it) => {
      const t = normalize(it.title);
      const sl = normalize(it.slug);
      return t.includes(q) || sl.includes(q);
    });
  }, [data, query, onlyChords, onlyCapo, onlyWithRef]);

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
          style={{ marginBottom: 16, backgroundColor: withAlpha(accent, 0.08) }}
          inputStyle={{ color: '#fff' }}
          iconColor={accent}
        />
        <View className="flex-row flex-wrap gap-2 mb-2">
          <Chip
            selected={onlyChords}
            onPress={() => setOnlyChords((v) => !v)}
            selectedColor={accent}
            style={onlyChords ? { backgroundColor: withAlpha(accent, 0.12) } : undefined}
          >
            Com cifras
          </Chip>
          <Chip
            selected={onlyCapo}
            onPress={() => setOnlyCapo((v) => !v)}
            selectedColor={accent}
            style={onlyCapo ? { backgroundColor: withAlpha(accent, 0.12) } : undefined}
          >
            Com braçadeira
          </Chip>
          <Chip
            selected={onlyWithRef}
            onPress={() => setOnlyWithRef((v) => !v)}
            selectedColor={accent}
            style={onlyWithRef ? { backgroundColor: withAlpha(accent, 0.12) } : undefined}
          >
            Com referência
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
