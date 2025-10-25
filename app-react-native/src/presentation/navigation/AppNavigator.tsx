import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from './BottomTabNavigator';

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
};
