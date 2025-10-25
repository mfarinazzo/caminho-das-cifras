import React from 'react';
import { View, TouchableOpacity, Switch } from 'react-native';
import { Screen, Text, Card } from '../../components';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = React.useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

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
                  color="#90CAF9"
                />
                <View className="ml-4">
                  <Text variant="body">Tema Escuro</Text>
                  <Text variant="small" className="mt-1">
                    Interface em modo noturno
                  </Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#3A3A3A', true: '#90CAF9' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </Card>

          <Card>
            <TouchableOpacity className="flex-row items-center">
              <MaterialCommunityIcons
                name="format-font-size-increase"
                size={24}
                color="#90CAF9"
              />
              <View className="ml-4 flex-1">
                <Text variant="body">Tamanho da Fonte</Text>
                <Text variant="small" className="mt-1">
                  Ajustar tamanho do texto
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#666666"
              />
            </TouchableOpacity>
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
                  color="#90CAF9"
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
                trackColor={{ false: '#3A3A3A', true: '#90CAF9' }}
                thumbColor="#FFFFFF"
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
                color="#90CAF9"
              />
              <View className="ml-4 flex-1">
                <Text variant="body">Sobre o App</Text>
                <Text variant="small" className="mt-1">
                  Versão 0.1.0
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#666666"
              />
            </TouchableOpacity>
          </Card>

          <Card>
            <TouchableOpacity className="flex-row items-center">
              <MaterialCommunityIcons
                name="heart-outline"
                size={24}
                color="#90CAF9"
              />
              <View className="ml-4 flex-1">
                <Text variant="body">Apoiar o Projeto</Text>
                <Text variant="small" className="mt-1">
                  Feito com ❤️ para a comunidade
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#666666"
              />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Footer */}
        <View className="items-center mt-8">
          <MaterialCommunityIcons name="music-note" size={40} color="#3A3A3A" />
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
