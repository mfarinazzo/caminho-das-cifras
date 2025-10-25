import React from 'react';
import { View } from 'react-native';
import { Screen, Text } from '../../components';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FavoritesScreen = () => {
  return (
    <Screen>
      <View className="px-4 pt-6">
        <Text variant="h2" className="mb-6">
          Favoritos
        </Text>

        <View className="items-center justify-center mt-32">
          <MaterialCommunityIcons
            name="heart-outline"
            size={80}
            color="#3A3A3A"
          />
          <Text variant="body" className="mt-6 text-center text-text-secondary">
            Você ainda não tem favoritos
          </Text>
          <Text variant="caption" className="mt-2 text-center px-12">
            Marque seus cantos preferidos tocando no ícone de coração
          </Text>
        </View>
      </View>
    </Screen>
  );
};

export default FavoritesScreen;
