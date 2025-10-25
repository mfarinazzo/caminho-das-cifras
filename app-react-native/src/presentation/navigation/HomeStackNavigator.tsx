import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';

// Screens will be imported here
import HomeScreen from '../screens/home/HomeScreen';
import CategoryListScreen from '../screens/category/CategoryListScreen';
import SongDetailScreen from '../screens/song/SongDetailScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: '#121212',
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
    </Stack.Navigator>
  );
};
