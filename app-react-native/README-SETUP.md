# Igreja App

Aplicativo mobile para cantos litúrgicos da comunidade.

## 🚀 Como executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo Go app instalado no seu celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Instalação

```powershell
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm start
```

### Executar no dispositivo

1. Após executar `npm start`, um QR code aparecerá no terminal
2. Abra o app **Expo Go** no seu celular
3. Escaneie o QR code:
   - **Android**: Use o scanner integrado do Expo Go
   - **iOS**: Use a câmera nativa do iPhone

### Scripts disponíveis

```powershell
# Iniciar servidor (escolher plataforma depois)
npm start

# Abrir diretamente no Android (emulador ou dispositivo)
npm run android

# Abrir diretamente no iOS (apenas macOS)
npm run ios

# Verificar tipos TypeScript
npm run type-check

# Lint do código
npm run lint

# Formatar código
npm run format
```

## 📱 Funcionalidades Atuais (Fase 0)

- ✅ Navegação por Bottom Tabs (Início, Buscar, Favoritos, Configurações)
- ✅ Tela inicial com categorias de cantos
- ✅ Tema escuro minimalista e moderno
- ✅ Componentes base reutilizáveis
- ✅ Estrutura de pastas Clean Architecture

## 🎨 Stack Tecnológico

- **React Native** 0.75.4
- **Expo** SDK 52
- **TypeScript** 5.6
- **NativeWind** 4.0 (TailwindCSS)
- **React Native Paper** 5.12 (Material Design)
- **React Navigation** 7.0

## 📂 Estrutura do Projeto

```
src/
├── core/              # Domínio (entities, use cases)
├── data/              # Repositórios e datasources
├── presentation/      # UI (screens, components, navigation)
│   ├── components/    # Componentes reutilizáveis
│   ├── navigation/    # Navegação
│   ├── screens/       # Telas
│   └── theme/         # Cores e tipografia
├── infrastructure/    # Implementações técnicas
└── shared/            # Utils e constantes
```

## 📖 Documentação

Veja a pasta `/docs` para documentação completa:
- [Requisitos](docs/REQUIREMENTS.md)
- [Stack Tecnológico](docs/TECH_STACK.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Fluxogramas](docs/FLOWCHARTS.md)

## 🎯 Próximas Fases

- **Fase 1**: Implementar navegação completa e visualização de cantos
- **Fase 2**: Player de áudio
- **Fase 3**: Busca e favoritos
- **Fase 4**: Configurações e polish
- **Fase 5**: Build para distribuição

## 📄 Licença

Uso privado - Comunidade Religiosa
