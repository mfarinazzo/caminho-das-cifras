import React from 'react';
import { View, TouchableOpacity, Switch } from 'react-native';
import { Screen, Text, Card } from '../../components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '../../../store';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../../navigation/SettingsStackNavigator';

const SettingsScreen = () => {
  const { themeMode, setThemeMode, instrument, setInstrument } = useAppStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const paperTheme = usePaperTheme();
  const isDark = (paperTheme as any).dark ?? false;
  const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();

  return (
    <Screen scrollable>
      <View className="px-4 pt-6 pb-8">
        <Text variant="h2" className="mb-6">
          Configurações
        </Text>

        {/* Appearance Section */}
        <View className="mb-6">
          <Text variant="caption" className="mb-3 uppercase">
            Aparência
          </Text>

          <Card className="mb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <MaterialCommunityIcons
                  name="theme-light-dark"
                  size={24}
                  color="#FF5252"
                />
                <View className="ml-4">
                  <Text variant="body">Tema Escuro</Text>
                  <Text variant="small" className="mt-1">
                    Interface em modo noturno
                  </Text>
                </View>
              </View>
              <Switch
                value={themeMode === 'dark'}
                onValueChange={(val) => setThemeMode(val ? 'dark' : 'light')}
                trackColor={{ false: isDark ? '#3A3A3A' : '#E5E7EB', true: '#FF5252' }}
                thumbColor={isDark ? '#111827' : '#FFFFFF'}
              />
            </View>
          </Card>

          <Card className="mb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <MaterialCommunityIcons
                  name="palette-outline"
                  size={24}
                  color="#FF5252"
                />
                <View className="ml-4">
                  <Text variant="body">Seguir sistema</Text>
                  <Text variant="small" className="mt-1">
                    Adapta claro/escuro conforme o sistema
                  </Text>
                </View>
              </View>
              <Switch
                value={themeMode === 'system'}
                onValueChange={(val) => setThemeMode(val ? 'system' : (themeMode === 'dark' ? 'dark' : 'light'))}
                trackColor={{ false: isDark ? '#3A3A3A' : '#E5E7EB', true: '#FF5252' }}
                thumbColor={isDark ? '#111827' : '#FFFFFF'}
              />
            </View>
          </Card>

          <Card>
            <TouchableOpacity className="flex-row items-center" onPress={() => navigation.navigate('TextSize')}>
              <MaterialCommunityIcons
                name="format-font-size-increase"
                size={24}
                color="#FF5252"
              />
              <View className="ml-4 flex-1">
                <Text variant="body">Tamanho da Fonte</Text>
                <Text variant="small" className="mt-1">
                  Ajustar tamanho do texto
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Instrument Section */}
        <View className="mb-6">
          <Text variant="caption" className="mb-3 uppercase">Instrumento</Text>
          <Card className="mb-3">
            <View className="mb-3 flex-row items-center">
              <MaterialCommunityIcons name="guitar-electric" size={24} color="#FF5252" />
              <View className="ml-4">
                <Text variant="body">Exibir cifras para</Text>
                <Text variant="small" className="mt-1">Escolha o instrumento dos diagramas</Text>
              </View>
            </View>
            {/* Segmented control placed below */}
            <View style={{ flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 10, padding: 4 }}>
              <TouchableOpacity
                onPress={() => setInstrument('guitar')}
                style={{ flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', backgroundColor: instrument==='guitar' ? '#FF5252' : 'transparent' }}
              >
                <Text variant="small" style={{ color: instrument==='guitar' ? '#FFFFFF' : '#1F2937' }}>Violão</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setInstrument('ukulele')}
                style={{ flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', backgroundColor: instrument==='ukulele' ? '#FF5252' : 'transparent' }}
              >
                <Text variant="small" style={{ color: instrument==='ukulele' ? '#FFFFFF' : '#1F2937' }}>Ukulele</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Notifications Section */}
        <View className="mb-6">
          <Text variant="caption" className="mb-3 uppercase">
            Notificações
          </Text>

          <Card>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={24}
                  color="#FF5252"
                />
                <View className="ml-4">
                  <Text variant="body">Notificações</Text>
                  <Text variant="small" className="mt-1">
                    Receber avisos de novos cantos
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: isDark ? '#3A3A3A' : '#E5E7EB', true: '#FF5252' }}
                thumbColor={isDark ? '#111827' : '#FFFFFF'}
              />
            </View>
          </Card>
        </View>

        {/* About Section */}
        <View className="mb-6">
          <Text variant="caption" className="mb-3 uppercase">
            Sobre
          </Text>

          <Card className="mb-3">
            <TouchableOpacity className="flex-row items-center">
              <MaterialCommunityIcons
                name="information-outline"
                size={24}
                color="#FF5252"
              />
              <View className="ml-4 flex-1">
                <Text variant="body">Sobre o App</Text>
                <Text variant="small" className="mt-1">
                  Versão 0.1.0
                </Text>
              </View>
            </TouchableOpacity>
          </Card>

          <Card>
            <TouchableOpacity className="flex-row items-center">
              <MaterialCommunityIcons
                name="heart-outline"
                size={24}
                color="#FF5252"
              />
              <View className="ml-4 flex-1">
                <Text variant="body">Apoiar o Projeto</Text>
                <Text variant="small" className="mt-1">
                  Feito com ❤️ para a comunidade
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Footer */}
        <View className="items-center mt-8">
          <MaterialCommunityIcons name="music-note" size={40} color={isDark ? '#3A3A3A' : '#9CA3AF'} />
          <Text variant="caption" className="mt-3">
            Caminho das Cifras
          </Text>
          <Text variant="small" className="mt-1">
            Cantos Litúrgicos
          </Text>
        </View>
      </View>
    </Screen>
  );
};

export default SettingsScreen;
