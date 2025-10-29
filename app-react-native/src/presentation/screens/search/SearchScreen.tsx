import React, { useMemo, useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Screen, Text, Card } from '../../components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ALL_SONGS, type SongListItem } from '../../../data/indexes';
import { CATEGORIES } from '../../../shared/constants/categories';
import { Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';
import { useFavoritesStore } from '../../../store';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const normalize = (s: string) =>
    (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

  const [mode, setMode] = useState<'title' | 'reference' | 'lyrics'>('title');
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const isDark = (() => {
    const scheme = require('react-native').useColorScheme?.();
    const { useAppStore } = require('../../../store');
    const mode = useAppStore.getState().themeMode;
    return mode === 'system' ? scheme === 'dark' : mode === 'dark';
  })();

  const neutralIcon = isDark ? '#9CA3AF' : '#6B7280';
  const chipBg = isDark ? '#2A2A2A' : '#F3F4F6';
  const chipSelectedBg = isDark ? '#374151' : '#E5F2FD';
  const chipSelectedText = isDark ? '#FFFFFF' : '#1F2937';
  const chipTextInactive = isDark ? '#B3B3B3' : '#6B7280';

  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    CATEGORIES.forEach((c) => {
      // @ts-ignore color added to constants
      map[c.id] = (c as any).color as string;
    });
    return map;
  }, []);

  const results = useMemo(() => {
    const q = normalize(searchQuery).trim();
    if (!q) return ALL_SONGS as SongListItem[];
    return ALL_SONGS.filter((it) => {
      if (mode === 'title') {
        const t = normalize(it.title);
        return t.includes(q);
      }
      if (mode === 'reference') {
        const ref = normalize((it.reference ?? '') as string);
        return ref.includes(q);
      }
      // lyrics mode: compare against normalized lyrics stored in index
      const lyr = (it as any).lyrics as string | undefined;
      if (!lyr) return false;
      // 'lyr' is already normalized in index; 'q' is normalized too
      return lyr.includes(q);
    });
  }, [searchQuery, mode]);

  return (
    <Screen>
      <View className="px-4 pt-6">
        <Text variant="h2" className="mb-4">
          Buscar Cantos
        </Text>

        <View className="flex-row items-center bg-background-card rounded-lg px-4 py-3 mb-3" style={{ backgroundColor: isDark ? '#1E1E1E' : '#F3F4F6' }}>
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color={neutralIcon}
            style={{ marginRight: 12 }}
          />
          <TextInput
            placeholder="Digite o título ou referência..."
            placeholderTextColor={neutralIcon}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-base"
            style={{ color: isDark ? '#FFFFFF' : '#111827' }}
          />
          {searchQuery.length > 0 && (
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color={neutralIcon}
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>

        <View className="flex-row flex-wrap gap-2 mb-4">
          <Chip
            selected={mode === 'title'}
            onPress={() => setMode('title')}
            style={{ backgroundColor: mode === 'title' ? chipSelectedBg : chipBg }}
            textStyle={{ color: mode === 'title' ? chipSelectedText : chipTextInactive }}
          >
            Título
          </Chip>
          <Chip
            selected={mode === 'reference'}
            onPress={() => setMode('reference')}
            style={{ backgroundColor: mode === 'reference' ? chipSelectedBg : chipBg }}
            textStyle={{ color: mode === 'reference' ? chipSelectedText : chipTextInactive }}
          >
            Referência
          </Chip>
          <Chip
            selected={mode === 'lyrics'}
            onPress={() => setMode('lyrics')}
            style={{ backgroundColor: mode === 'lyrics' ? chipSelectedBg : chipBg }}
            textStyle={{ color: mode === 'lyrics' ? chipSelectedText : chipTextInactive }}
          >
            Letra
          </Chip>
        </View>

        {results.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <MaterialCommunityIcons name="music-note-off-outline" size={80} color={isDark ? '#3A3A3A' : '#9CA3AF'} />
            <Text variant="body" className="mt-4 text-center text-text-secondary">Nenhum resultado encontrado</Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => `${item.category}:${item.slug}`}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => {
              const accent = categoryColorMap[item.category] || '#90CAF9';
              const isItemFavorite = isFavorite(item.file);

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
                    <View
                      style={{
                        width: 6,
                        alignSelf: 'stretch',
                        backgroundColor: accent,
                        borderRadius: 3,
                        marginRight: 12,
                      }}
                    />
                    <View className="flex-1 pr-3">
                      <Text variant="h3" style={{ color: accent }}>
                        {item.title}
                      </Text>
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
            }}
          />
        )}
      </View>
    </Screen>
  );
};

export default SearchScreen;
