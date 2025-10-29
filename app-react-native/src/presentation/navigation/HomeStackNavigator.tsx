import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { useTheme as usePaperTheme } from 'react-native-paper';

// Screens will be imported here
import HomeScreen from '../screens/home/HomeScreen';
import CategoryListScreen from '../screens/category/CategoryListScreen';
import SongDetailScreen from '../screens/song/SongDetailScreen';
import TextSizeScreen from '../screens/settings/TextSizeScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigator = () => {
  const theme = usePaperTheme();
  const isDark = (theme as any).dark ?? false;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: isDark ? '#FFFFFF' : '#111827',
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="Categories"
        component={HomeScreen}
        options={{ title: 'Categorias' }}
      />
      <Stack.Screen
        name="SongList"
        component={CategoryListScreen}
        options={({ route }) => ({ title: route.params.categoryName })}
      />
      <Stack.Screen
        name="SongDetail"
        component={SongDetailScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <Stack.Screen
        name="TextSize"
        component={TextSizeScreen}
        options={{ title: 'Tamanho do Texto' }}
      />
    </Stack.Navigator>
  );
};
