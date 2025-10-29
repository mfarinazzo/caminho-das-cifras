import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Screen, Text, Card } from '../../components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFavoritesStore } from '../../../store';
import { ALL_SONGS } from '../../../data/indexes';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';

const FavoritesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { favorites, removeFavorite, toggleFavorite } = useFavoritesStore();

  const isDark = (() => {
    const scheme = require('react-native').useColorScheme?.();
    const { useAppStore } = require('../../../store');
    const mode = useAppStore.getState().themeMode;
    return mode === 'system' ? scheme === 'dark' : mode === 'dark';
  })();

  // Buscar dados dos cantos favoritos
  const favoriteSongs = favorites.map(file => 
    ALL_SONGS.find(song => song.file === file)
  ).filter((song): song is NonNullable<typeof song> => Boolean(song));

  const renderFavoriteItem = ({ item }: { item: typeof ALL_SONGS[0] }) => (
    <Card 
      className="mb-3" 
      onPress={() => navigation.navigate('SongDetail', { 
        file: item.file, 
        title: item.title, 
        category: item.category as any 
      })}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text variant="h3">{item.title}</Text>
          {item.reference && (
            <Text variant="caption" className="mt-1 text-text-secondary">
              {item.reference}
            </Text>
          )}
          <Text variant="small" className="mt-1 text-text-secondary capitalize">
            {item.category.replace('-', ' ')}
          </Text>
        </View>
        <View className="flex-row items-center">
          {item.hasChords && (
            <MaterialCommunityIcons
              name="music-note"
              size={16}
              color={isDark ? '#B3E5FC' : '#1D4ED8'}
              style={{ marginRight: 8 }}
            />
          )}
          {item.hasCapo && (
            <MaterialCommunityIcons
              name="guitar-pick"
              size={16}
              color={isDark ? '#A7F3D0' : '#047857'}
              style={{ marginRight: 8 }}
            />
          )}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(item.file);
            }}
            style={{ padding: 4 }}
          >
            <MaterialCommunityIcons
              name="heart"
              size={16}
              color="#E91E63"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <Screen>
      <View className="px-4 pt-6 flex-1">
        <Text variant="h2" className="mb-6">
          Favoritos
        </Text>

        {favoriteSongs.length === 0 ? (
          <View className="items-center justify-center mt-32">
            <MaterialCommunityIcons
              name="heart-outline"
              size={80}
              color={isDark ? '#3A3A3A' : '#9CA3AF'}
            />
            <Text variant="body" className="mt-6 text-center text-text-secondary">
              Você ainda não tem favoritos
            </Text>
            <Text variant="caption" className="mt-2 text-center px-12">
              Marque seus cantos preferidos tocando no ícone de coração
            </Text>
          </View>
        ) : (
          <FlatList
            data={favoriteSongs}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.file}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </Screen>
  );
};

export default FavoritesScreen;
