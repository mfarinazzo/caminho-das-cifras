# 🗺️ Roadmap de Desenvolvimento

## Visão Geral

Este roadmap está dividido em **fases iterativas e incrementais**, seguindo metodologia ágil. Cada fase entrega valor funcional e pode ser testada no dispositivo real.

---

## 📊 Cronograma Estimado

| Fase | Duração | Objetivo | Status |
|------|---------|----------|--------|
| **Fase 0** | 2 dias | Setup e Infraestrutura | 🔴 Não iniciado |
| **Fase 1** | 3-4 dias | MVP Core (Navegação + Visualização) | 🔴 Não iniciado |
| **Fase 2** | 2-3 dias | Player de Áudio | 🔴 Não iniciado |
| **Fase 3** | 2 dias | Busca e Favoritos | 🔴 Não iniciado |
| **Fase 4** | 1-2 dias | Configurações e Polish | 🔴 Não iniciado |
| **Fase 5** | 1 dia | Build e Distribuição | 🔴 Não iniciado |

**Total Estimado:** 11-14 dias de desenvolvimento

---

## 🎯 Fase 0: Setup e Infraestrutura

**Objetivo:** Preparar ambiente de desenvolvimento e estrutura base do projeto.

### Tarefas

- [ ] **0.1 Inicializar Projeto Expo**
  ```bash
  npx create-expo-app@latest igreja-app --template blank-typescript
  ```

- [ ] **0.2 Instalar Dependências Core**
  - React Navigation
  - NativeWind + Tailwind
  - React Native Paper
  - Zustand
  - TypeScript utilities

- [ ] **0.3 Configurar Ferramentas de Dev**
  - ESLint + Prettier
  - TypeScript config (tsconfig.json)
  - Path aliases (`@core`, `@presentation`, etc.)
  - Git hooks (Husky + lint-staged)

- [ ] **0.4 Criar Estrutura de Pastas**
  - Conforme definido em `ARCHITECTURE.md`
  - Criar README em cada pasta principal

- [ ] **0.5 Configurar Tema Base**
  - Tailwind config com cores da igreja
  - React Native Paper theme
  - Fontes customizadas (se houver)

- [ ] **0.6 Setup de Assets**
  - Copiar JSONs para `assets/data/`
  - Copiar MP3s para `assets/audios/`
  - Copiar PNGs para `assets/sheet-music/`
  - Otimizar tamanho de arquivos

- [ ] **0.7 Configurar EAS**
  ```bash
  eas build:configure
  ```
  - Criar perfis de build (development, preview, production)

### Entregável
✅ Projeto configurado, rodando em Expo Go, exibindo "Hello World"

### Tempo Estimado
**2 dias**

---

## 🚀 Fase 1: MVP Core (Alta Prioridade)

**Objetivo:** Implementar funcionalidades essenciais de navegação e visualização.

### Sprint 1.1: Estrutura de Dados e Domínio (1 dia)

- [ ] **1.1.1 Criar Entidades**
  - `Song.ts`
  - `Category.ts`
  - `Verse.ts`
  - `Chord.ts`

- [ ] **1.1.2 Criar DTOs**
  - `SongDTO.ts`
  - `CategoryDTO.ts`

- [ ] **1.1.3 Criar Mappers**
  - `SongMapper.ts` (DTO → Entity)

- [ ] **1.1.4 Criar Repositórios**
  - Interface `ISongRepository`
  - Implementação `SongRepository`
  - `JsonDataSource` para leitura dos JSONs

- [ ] **1.1.5 Criar Use Cases Básicos**
  - `GetAllCategories.ts`
  - `GetSongsByCategory.ts`
  - `GetSongById.ts`

- [ ] **1.1.6 Testes Unitários**
  - Testar mappers
  - Testar use cases com mock repository

### Sprint 1.2: Navegação (0.5 dia)

- [ ] **1.2.1 Configurar React Navigation**
  - Bottom Tabs Navigator
  - Stack Navigator
  - Tipos de navegação

- [ ] **1.2.2 Criar Estrutura de Rotas**
  - Tab: Home, Busca, Favoritos, Configurações
  - Stack: CategoriesScreen → SongListScreen → SongDetailScreen

### Sprint 1.3: Tela de Categorias (0.5 dia)

- [ ] **1.3.1 Criar HomeScreen**
  - Layout com grid de categorias

- [ ] **1.3.2 Criar Componentes**
  - `CategoryCard.tsx`
  - `CategoryGrid.tsx`

- [ ] **1.3.3 Hook `useCategories`**
  - Carrega categorias
  - Conta cantos por categoria

- [ ] **1.3.4 Estilização**
  - Design responsivo
  - Ícones para cada categoria

### Sprint 1.4: Tela de Lista de Cantos (1 dia)

- [ ] **1.4.1 Criar SongListScreen**
  - Recebe parâmetro de categoria da rota

- [ ] **1.4.2 Criar Componentes**
  - `SongListItem.tsx` (card do canto)
  - `EmptyState.tsx` (quando não há cantos)
  - `LoadingState.tsx`

- [ ] **1.4.3 Hook `useSongList`**
  - Carrega cantos da categoria
  - Loading state
  - Error handling

- [ ] **1.4.4 Implementar FlatList**
  - Virtualização
  - Pull to refresh
  - Indicadores de áudio/imagem disponíveis

### Sprint 1.5: Tela de Detalhes do Canto (1.5 dias)

- [ ] **1.5.1 Criar SongDetailScreen**
  - Header com título e referência
  - Área de scroll para letras

- [ ] **1.5.2 Criar Componentes**
  - `SongHeader.tsx` (título, subtítulo, referência)
  - `LyricsSection.tsx` (exibe estrofes)
  - `VerseDisplay.tsx` (estrofe individual)
  - `ChordOverlay.tsx` (cifras sobre letras)

- [ ] **1.5.3 Hook `useSongDetail`**
  - Carrega dados do canto por ID
  - Formata texto com cifras

- [ ] **1.5.4 Lógica de Cifras**
  - Posicionar cifras corretamente sobre as palavras
  - Suporte a indicadores (bis, bis a, etc.)
  - Ajuste de fonte

- [ ] **1.5.5 Estilização**
  - Texto legível
  - Cifras destacadas
  - Scroll suave

### Entregável
✅ App funcional: navegar entre categorias, ver lista de cantos, visualizar detalhes com letras e cifras.

### Tempo Estimado
**3-4 dias**

---

## 🎵 Fase 2: Player de Áudio (Alta Prioridade)

**Objetivo:** Implementar reprodução de áudio dos cantos.

### Sprint 2.1: Infraestrutura de Áudio (0.5 dia)

- [ ] **2.1.1 Instalar Expo AV**
  ```bash
  npx expo install expo-av
  ```

- [ ] **2.1.2 Criar Interface de Áudio**
  - `IAudioPlayer.ts`

- [ ] **2.1.3 Criar Adapter**
  - `ExpoAudioPlayer.ts` implementa `IAudioPlayer`

- [ ] **2.1.4 Criar Repository**
  - `AudioRepository.ts`

### Sprint 2.2: Store de Áudio (0.5 dia)

- [ ] **2.2.1 Criar `audioStore.ts` (Zustand)**
  - Estado: isPlaying, currentSong, duration, position
  - Ações: play, pause, seek, setPlaybackSpeed

- [ ] **2.2.2 Integrar com Use Cases**
  - `PlayAudio.ts`
  - `PauseAudio.ts`
  - `SeekAudio.ts`

### Sprint 2.3: Componente AudioPlayer (1.5 dias)

- [ ] **2.3.1 Criar `AudioPlayer.tsx`**
  - Play/Pause button
  - Progress bar com seek
  - Timer (current/total)
  - Loading state

- [ ] **2.3.2 Hook `useAudioPlayer`**
  - Gerencia estado local do player
  - Integra com audioStore
  - Cleanup ao desmontar

- [ ] **2.3.3 Estilização**
  - Design moderno e intuitivo
  - Feedback visual (animações)

- [ ] **2.3.4 Integrações**
  - Background audio (opcional)
  - Notificação de mídia (opcional)
  - Auto-pause em ligação telefônica

- [ ] **2.3.5 Tratamento de Erros**
  - Áudio não encontrado
  - Erro de carregamento
  - Feedback ao usuário

### Sprint 2.4: Testes (0.5 dia)

- [ ] **2.4.1 Testes Unitários**
  - Use cases de áudio
  - AudioStore actions

- [ ] **2.4.2 Testes de Integração**
  - Hook useAudioPlayer
  - Flow completo (play → pause → seek)

### Entregável
✅ Player de áudio funcional integrado na tela de detalhes.

### Tempo Estimado
**2-3 dias**

---

## 🔍 Fase 3: Busca e Favoritos (Média Prioridade)

**Objetivo:** Implementar busca de cantos e sistema de favoritos.

### Sprint 3.1: Sistema de Busca (1.5 dias)

- [ ] **3.1.1 Instalar FlexSearch**
  ```bash
  npm install flexsearch
  ```

- [ ] **3.1.2 Criar Search Engine**
  - `FlexSearchEngine.ts`
  - Índice de cantos (título, subtítulo, referência)
  - Busca fuzzy

- [ ] **3.1.3 Criar Use Case**
  - `SearchSongs.ts`

- [ ] **3.1.4 Criar Store**
  - `searchStore.ts`
  - Estado: query, results, recentSearches
  - Ações: search, clearResults, addToRecent

- [ ] **3.1.5 Criar SearchScreen**
  - SearchBar component
  - Resultados em lista
  - Histórico de buscas
  - Empty state

- [ ] **3.1.6 Hook `useSearch`**
  - Debounce de busca (300ms)
  - Loading state
  - Highlight de termo buscado

### Sprint 3.2: Sistema de Favoritos (0.5 dia)

- [ ] **3.2.1 Criar Repository**
  - `FavoriteRepository.ts`
  - Persistência com AsyncStorage

- [ ] **3.2.2 Criar Use Cases**
  - `ToggleFavorite.ts`
  - `GetFavorites.ts`

- [ ] **3.2.3 Criar Store**
  - `favoritesStore.ts`
  - Estado: favorites (array de IDs)
  - Ações: toggle, loadFavorites
  - Persistência automática

- [ ] **3.2.4 Criar FavoritesScreen**
  - Lista de cantos favoritos
  - Remoção rápida (swipe)
  - Empty state

- [ ] **3.2.5 Integração**
  - Botão de favorito em SongDetailScreen
  - Indicador visual em SongListItem

### Entregável
✅ Busca funcional + Sistema de favoritos completo.

### Tempo Estimado
**2 dias**

---

## ⚙️ Fase 4: Configurações e Polish (Média Prioridade)

**Objetivo:** Ajustes finais, configurações do usuário e polimento da UI.

### Sprint 4.1: Tela de Configurações (0.5 dia)

- [ ] **4.1.1 Criar SettingsScreen**
  - Lista de opções

- [ ] **4.1.2 Criar Componentes**
  - `ThemeSelector.tsx` (Claro/Escuro/Sistema)
  - `FontSizeSelector.tsx` (Pequeno/Médio/Grande/Muito Grande)

- [ ] **4.1.3 Criar Store**
  - `appStore.ts`
  - Estado: theme, fontSize
  - Persistência com SecureStore

- [ ] **4.1.4 Aplicar Configurações**
  - Hook `useTheme` (aplica tema globalmente)
  - Hook `useFontSize` (ajusta fonte nas letras)

### Sprint 4.2: Melhorias de UX (0.5 dia)

- [ ] **4.2.1 Loading States**
  - Skeleton screens
  - Spinners consistentes

- [ ] **4.2.2 Error Handling**
  - Error boundary
  - Toast notifications
  - Retry mechanisms

- [ ] **4.2.3 Animações**
  - Transições suaves (React Native Reanimated)
  - Feedback tátil (Haptics)

- [ ] **4.2.4 Acessibilidade**
  - Labels para screen readers
  - Contraste adequado
  - Tamanhos de toque (min 44x44)

### Sprint 4.3: Visualização de Imagem (0.5 dia)

- [ ] **4.3.1 Criar ImageViewer Component**
  - Modal fullscreen
  - Pinch to zoom
  - Pan gesture

- [ ] **4.3.2 Integração**
  - Botão em SongDetailScreen
  - Loading da imagem

### Sprint 4.4: Testes e Bug Fixes (0.5 dia)

- [ ] **4.4.1 Testes E2E**
  - Flow completo de navegação
  - Busca → Resultado → Detalhes
  - Favoritar → Ver favoritos

- [ ] **4.4.2 Correção de Bugs**
  - Revisar issues encontradas

- [ ] **4.4.3 Otimizações**
  - Performance de listas
  - Tamanho de bundle

### Entregável
✅ App completo e polido, pronto para build.

### Tempo Estimado
**1-2 dias**

---

## 📦 Fase 5: Build e Distribuição

**Objetivo:** Gerar builds para distribuição entre amigos.

### Sprint 5.1: Build Android (0.5 dia)

- [ ] **5.1.1 Configurar app.json**
  - Nome do app
  - Bundle identifier
  - Ícone e splash screen
  - Versão

- [ ] **5.1.2 Build de Preview**
  ```bash
  eas build --platform android --profile preview
  ```
  - Gera APK para testes

- [ ] **5.1.3 Testar APK**
  - Instalar em dispositivos reais
  - Verificar funcionalidades

### Sprint 5.2: Build de Produção (0.5 dia)

- [ ] **5.2.1 Ajustes Finais**
  - Versão final
  - Remove logs de debug

- [ ] **5.2.2 Build Production**
  ```bash
  eas build --platform android --profile production
  ```
  - Gera AAB (Play Store) ou APK

- [ ] **5.2.3 Documentação de Instalação**
  - README com instruções para amigos
  - Como instalar APK no Android
  - Permissões necessárias

### Sprint 5.3: Distribuição (opcional)

- [ ] **5.3.1 Upload para Google Drive**
  - Link compartilhável

- [ ] **5.3.2 Criar grupo no WhatsApp**
  - Compartilhar APK
  - Canal de feedback

- [ ] **5.3.3 Instruções de Uso**
  - Vídeo demonstrativo curto
  - Documento com features principais

### Entregável
✅ APK pronto para distribuição + Documentação.

### Tempo Estimado
**1 dia**

---

## 📈 Roadmap Futuro (Pós-MVP)

### Versão 1.1 (Melhorias)
- [ ] Playlists personalizadas
- [ ] Histórico de cantos recentes
- [ ] Compartilhar canto (via WhatsApp)
- [ ] Exportar letra em PDF
- [ ] Modo landscape otimizado

### Versão 1.2 (Features Avançadas)
- [ ] Transposição de tom (mudar cifras)
- [ ] Metrônomo integrado
- [ ] Modo apresentação (fullscreen sem controles)
- [ ] Sincronização via nuvem (opcional)

### Versão 2.0 (Expansão)
- [ ] Build iOS
- [ ] Backend com API (CMS para gerenciar cantos)
- [ ] Upload de novos cantos pela comunidade
- [ ] Comentários e avaliações
- [ ] Notificações de novos cantos

---

## 📊 Métricas de Sucesso

### MVP (Versão 1.0)
- ✅ 100% das funcionalidades de alta prioridade implementadas
- ✅ App roda offline sem crashes
- ✅ Tempo de carregamento < 3s
- ✅ Feedback positivo de pelo menos 10 usuários beta

### Pós-MVP
- 📊 50+ downloads entre amigos
- 📊 Taxa de retenção > 60% (30 dias)
- 📊 Média de 4+ estrelas (feedback informal)
- 📊 < 5% taxa de crash

---

## 🔄 Processo de Desenvolvimento

### Daily Workflow
1. **Morning:** Revisar tarefas do dia
2. **Development:** Implementar features (TDD quando possível)
3. **Testing:** Testar em Expo Go
4. **Commit:** Commits atômicos com mensagens descritivas
5. **Evening:** Update do roadmap, documentar decisões

### Git Workflow
```
main (produção)
  └── develop (desenvolvimento)
      └── feature/nome-feature (branches de feature)
```

### Commit Messages (Conventional Commits)
```
feat: adiciona player de áudio
fix: corrige posicionamento de cifras
docs: atualiza README com instruções de build
refactor: reorganiza estrutura de pastas
test: adiciona testes para SongRepository
```

---

## 📝 Change Log

### [1.0.0] - TBD (MVP)
#### Added
- Navegação por categorias
- Visualização de letras com cifras
- Player de áudio
- Sistema de busca
- Sistema de favoritos
- Tema claro/escuro
- Ajuste de tamanho de fonte

---

**Versão do Roadmap:** 1.0  
**Última Atualização:** Outubro 2025  
**Próxima Revisão:** Semanalmente durante desenvolvimento
