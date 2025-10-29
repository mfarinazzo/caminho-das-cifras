import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/settings/SettingsScreen';
import TextSizeScreen from '../screens/settings/TextSizeScreen';
import { useTheme as usePaperTheme } from 'react-native-paper';

export type SettingsStackParamList = {
  SettingsHome: undefined;
  TextSize: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsStackNavigator = () => {
  const theme = usePaperTheme();
  const isDark = (theme as any).dark ?? false;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: isDark ? '#FFFFFF' : '#111827',
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="SettingsHome" component={SettingsScreen} options={{ title: 'Configurações' }} />
      <Stack.Screen name="TextSize" component={TextSizeScreen} options={{ title: 'Tamanho do Texto' }} />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
