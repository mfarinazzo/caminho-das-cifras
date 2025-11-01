import React from 'react';
import { View, FlatList } from 'react-native';
import { Screen, Text, Card } from '../../components';
import { CATEGORIES } from '../../../shared/constants/categories';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { HomeStackParamList } from '../../navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const withAlpha = (hex: string, alpha: number) => {
    // expects hex like #RRGGBB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const renderCategoryCard = ({ item }: { item: typeof CATEGORIES[number] }) => (
    <Card
      onPress={() => {
        navigation.navigate('SongList', {
          categoryId: item.id as any,
          categoryName: item.name,
        });
      }}
      className="mb-4"
    >
      <View className="flex-row items-center">
        <View
          className="p-3 rounded-lg mr-4"
          style={{ backgroundColor: withAlpha(item.color as string, 0.18) }}
        >
          <MaterialCommunityIcons
            name={item.icon as any}
            size={32}
            color={item.color as string}
          />
        </View>
        <View className="flex-1">
          <Text variant="h3">{item.name}</Text>
          <Text variant="caption" className="mt-1">
            Toque para ver os cantos
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color="#666666"
        />
      </View>
    </Card>
  );

  return (
    <Screen>
      <View className="px-4 pt-6 pb-2">
        <Text variant="h1" className="mb-2">
          Categorias
        </Text>
        <Text variant="caption" className="mb-6">
          Selecione uma categoria para navegar pelos cantos
        </Text>
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryCard}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
};

export default HomeScreen;
