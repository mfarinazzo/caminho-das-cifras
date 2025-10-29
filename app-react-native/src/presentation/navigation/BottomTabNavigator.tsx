import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootTabParamList } from './types';
import { HomeStackNavigator } from './HomeStackNavigator';
import { useTheme as usePaperTheme } from 'react-native-paper';

// Placeholder screens
import SearchScreen from '../screens/search/SearchScreen';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import SettingsStackNavigator from '@presentation/navigation/SettingsStackNavigator';
import TunerScreen from '@presentation/screens/tuner/TunerScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const BottomTabNavigator = () => {
  const theme = usePaperTheme();
  const isDark = (theme as any).dark ?? false;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: isDark ? '#333333' : '#E5E7EB',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#FF5252',
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Buscar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tuner"
        component={TunerScreen}
        options={{
          tabBarLabel: 'Afinador',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name={"guitar-pick" as any} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: 'Config',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
