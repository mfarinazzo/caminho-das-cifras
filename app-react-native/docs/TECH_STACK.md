# 🛠️ Stack Tecnológico

## Visão Geral

Este documento detalha todas as tecnologias, bibliotecas e ferramentas utilizadas no projeto, com justificativas técnicas para cada escolha.

---

## 🎯 Princípios de Seleção

1. **Atualidade:** Versões mais recentes e estáveis (2024-2025)
2. **Manutenção Ativa:** Bibliotecas com comunidade ativa
3. **Performance:** Otimizadas para mobile
4. **Developer Experience:** Boa documentação e TypeScript support
5. **Tamanho:** Bundle size otimizado

---

## 📱 Core Stack

### React Native + Expo

| Tecnologia | Versão | Justificativa |
|------------|---------|---------------|
| **React Native** | 0.75+ | Framework líder para mobile cross-platform |
| **Expo SDK** | 52+ | Build simplificada, EAS Build, OTA updates |
| **Expo Router** | 4.0+ | File-based routing moderno (Next.js-like) |

**Por que Expo?**
- ✅ Build simplificada (EAS Build)
- ✅ Sem necessidade de Android Studio/Xcode para desenvolvimento
- ✅ Distribuição fácil via APK/IPA
- ✅ Over-the-Air updates (para correções rápidas)
- ✅ Conjunto completo de APIs nativas
- ✅ Expo Go para testes rápidos no dispositivo

**Alternativas consideradas:**
- ❌ React Native CLI: Requer mais configuração nativa
- ❌ Flutter: Não é JavaScript/TypeScript

---

## 🔤 Linguagem

### TypeScript

| Tecnologia | Versão | Justificativa |
|------------|---------|---------------|
| **TypeScript** | 5.6+ | Type safety, melhor DX, menos bugs |

**Configuração:**
- Modo `strict` ativado
- Path aliases configurados (`@core/*`, `@presentation/*`, etc.)
- Tipagem forte em todo o código

---

## 🎨 Estilização & UI

### NativeWind (TailwindCSS)

| Tecnologia | Versão | Justificativa |
|------------|---------|---------------|
| **NativeWind** | 4.0+ | TailwindCSS para React Native |
| **TailwindCSS** | 3.4+ | Utility-first CSS, design system consistente |

**Por que NativeWind?**
- ✅ Sintaxe familiar (Tailwind)
- ✅ Performance otimizada (compile-time)
- ✅ Responsividade simples (`sm:`, `md:`, `lg:`)
- ✅ Tema claro/escuro nativo
- ✅ Sem CSS-in-JS runtime overhead

**Exemplo:**
```tsx
<View className="flex-1 bg-white dark:bg-gray-900">
  <Text className="text-xl font-bold text-gray-900 dark:text-white">
    Título
  </Text>
</View>
```

### React Native Paper

| Tecnologia | Versão | Justificativa |
|------------|---------|---------------|
| **React Native Paper** | 5.12+ | Material Design components prontos |

**Por que Paper?**
- ✅ Componentes acessíveis (a11y)
- ✅ Material Design 3 (Material You)
- ✅ Theming integrado
- ✅ Componentes complexos prontos (Modal, Snackbar, etc.)
- ✅ TypeScript support completo

**Componentes principais que usaremos:**
- `Button`, `IconButton`, `FAB`
- `Card`, `List`, `Divider`
- `Searchbar`, `TextInput`
- `Modal`, `Portal`, `Snackbar`
- `ActivityIndicator`, `ProgressBar`

---

## 🧭 Navegação

### React Navigation v7

| Tecnologia | Versão | Justificativa |
|------------|---------|---------------|
| **@react-navigation/native** | 7.0+ | Navegação moderna e performática |
| **@react-navigation/native-stack** | 7.0+ | Stack navigator nativo (melhor performance) |
| **@react-navigation/bottom-tabs** | 7.0+ | Bottom tabs para navegação principal |

**Estrutura de Navegação:**
```
Bottom Tabs (Home, Busca, Favoritos, Configurações)
  └── Stack Navigator
      ├── Lista de Categorias
      ├── Lista de Cantos
      └── Detalhes do Canto
```

**Alternativa:** Expo Router
- Optamos por React Navigation pela maturidade e controle fino
- Expo Router é mais novo, consideraremos em futuras versões

---

## 🗄️ State Management

### Zustand

| Tecnologia | Versão | Justificativa |
|------------|---------|---------------|
| **Zustand** | 5.0+ | State management minimalista e performático |

**Por que Zustand?**
- ✅ API simples e intuitiva
- ✅ Sem boilerplate (vs Redux)
- ✅ TypeScript-first
- ✅ DevTools integration
- ✅ Middleware de persistência integrado
- ✅ Bundle size pequeno (~1KB)

**Stores principais:**
```typescript
- useAppStore      // Config global (tema, fonte)
- useFavoritesStore // Favoritos persistidos
- useAudioStore     // Estado do player
- useSearchStore    // Histórico e estado de busca
```

**Alternativas consideradas:**
- ❌ Redux Toolkit: Muito boilerplate
- ❌ Context API: Performance issues em listas grandes
- ❌ Jotai/Recoil: Mais complexos que necessário

---

## 🎵 Áudio

### Expo AV

| Tecnologia | Versão | Justificativa |
|------------|---------|---------------|
| **expo-av** | 14.0+ | API de áudio/vídeo nativa do Expo |

**Funcionalidades:**
- ✅ Reprodução de MP3 local
- ✅ Controles (play, pause, seek)
- ✅ Background audio (opcional)
- ✅ Notificação de mídia
- ✅ Evento de progresso

**Alternativa considerada:**
- React Native Track Player: Mais complexo, desnecessário para nosso caso

---

## 🖼️ Imagens

### Expo Image

| Tecnologia | Versão | Justificativa |
|------------|---------|---------------|
| **expo-image** | 1.12+ | Componente de imagem otimizado |

**Por que Expo Image?**
- ✅ Performance superior ao `<Image>` padrão
- ✅ Cache automático inteligente
- ✅ Placeholder e blur durante loading
- ✅ Suporte a WebP, AVIF
- ✅ Lazy loading nativo

### React Native Zoom Toolkit

| Tecnologia | Versão | Justificativa |
|------------|---------|---------------|
| **react-native-zoom-toolkit** | 1.0+ | Zoom/pan de imagens |

Para visualização fullscreen das partituras com pinch-to-zoom.

---

## 💾 Persistência Local

### Expo SecureStore + AsyncStorage

| Tecnologia | Versão | Justificativa |
|------------|---------|---------------|
| **expo-secure-store** | 13.0+ | Armazenamento seguro (preferências) |
| **@react-native-async-storage/async-storage** | 2.0+ | Armazenamento key-value simples |

**Uso:**
- SecureStore: Preferências do usuário
- AsyncStorage: Cache de dados, favoritos

---

## 🔍 Busca

### FlexSearch

| Tecnologia | Versão | Justificativa |
|------------|---------|---------------|
| **flexsearch** | 0.7+ | Full-text search ultra-rápido |

**Por que FlexSearch?**
- ✅ Performance excepcional
- ✅ Busca fuzzy
- ✅ Suporte a português
- ✅ Índices customizáveis
- ✅ Funciona offline

---

## 🧪 Qualidade de Código

### Linting & Formatting

| Tecnologia | Versão | Justificativa |
|------------|---------|---------------|
| **ESLint** | 9.0+ | Linting de JavaScript/TypeScript |
| **@typescript-eslint** | 8.0+ | Regras específicas para TypeScript |
| **Prettier** | 3.3+ | Formatação consistente |
| **eslint-plugin-react-hooks** | 5.0+ | Regras para React Hooks |

**Configuração:**
- Airbnb style guide (adaptado)
- Import order automático
- Prettier integrado ao ESLint

### Type Checking

| Tecnologia | Versão | Justificativa |
|------------|---------|---------------|
| **typescript** | 5.6+ | Type checking estático |

Scripts:
```json
{
  "type-check": "tsc --noEmit",
  "lint": "eslint . --ext .ts,.tsx",
  "format": "prettier --write \"**/*.{ts,tsx,json,md}\""
}
```

---

## 🧪 Testes

### Jest + React Native Testing Library

| Tecnologia | Versão | Justificativa |
|------------|---------|---------------|
| **Jest** | 29.0+ | Framework de testes |
| **@testing-library/react-native** | 12.0+ | Testing utilities para RN |
| **@testing-library/jest-native** | 5.4+ | Matchers customizados |

**Cobertura mínima:** 70%

**Estrutura de testes:**
```
__tests__/
├── unit/           # Testes unitários (functions, utils)
├── integration/    # Testes de integração (stores, services)
└── e2e/           # Testes end-to-end (flows principais)
```

---

## 📦 Build & Deploy

### EAS Build

| Tecnologia | Versão | Justificativa |
|------------|---------|---------------|
| **EAS CLI** | Latest | Build cloud do Expo |

**Perfis de Build:**
```json
{
  "development": "Desenvolvimento local",
  "preview": "Build para testes internos (APK)",
  "production": "Build final (AAB/IPA)"
}
```

**Distribuição:**
- APK direto para compartilhamento via WhatsApp
- AAB para futura publicação na Play Store (opcional)

---

## 🔧 Ferramentas de Desenvolvimento

### Expo Dev Tools

| Tecnologia | Justificativa |
|------------|---------------|
| **Expo Go** | Testes rápidos no dispositivo sem build |
| **Expo Dev Client** | Build customizada com native modules |
| **React Native Debugger** | Debugging avançado |
| **Flipper** | Inspeção de rede, logs, layout |

---

## 📊 Monitoramento (Futuro)

### Sentry (Opcional)

Para tracking de crashes e performance quando em produção.

---

## 🎨 Design Tokens

### Configuração TailwindCSS

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {...},    // Cor principal da igreja
        secondary: {...},  // Cor secundária
        accent: {...},     // Destaque
      },
      fontFamily: {
        sans: ['Inter', 'system-ui'],
        mono: ['JetBrains Mono'],
      },
    },
  },
}
```

---

## 📐 Estrutura de Versões

### Semantic Versioning

```
MAJOR.MINOR.PATCH
  │     │     └─ Bug fixes
  │     └─────── Novas features (backward compatible)
  └───────────── Breaking changes
```

**Exemplo:** `1.0.0` → `1.1.0` → `1.1.1`

---

## 📚 Dependências Completas

### Dependencies (package.json)

```json
{
  "dependencies": {
    "react": "18.3.1",
    "react-native": "0.75.4",
    "expo": "~52.0.0",
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "@react-navigation/bottom-tabs": "^7.0.0",
    "react-native-paper": "^5.12.0",
    "nativewind": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^5.0.0",
    "expo-av": "~14.0.0",
    "expo-image": "~1.12.0",
    "expo-secure-store": "~13.0.0",
    "@react-native-async-storage/async-storage": "^2.0.0",
    "flexsearch": "^0.7.43",
    "react-native-zoom-toolkit": "^1.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "@types/react": "~18.3.0",
    "@types/react-native": "~0.75.0",
    "typescript": "~5.6.0",
    "eslint": "^9.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "prettier": "^3.3.0",
    "jest": "^29.7.0",
    "@testing-library/react-native": "^12.0.0"
  }
}
```

---

## 🔄 Processo de Atualização

**Cadência de Updates:**
- Dependencies: Revisão mensal
- Security patches: Imediato
- Major versions: Análise de breaking changes antes

---

**Versão do Documento:** 1.0  
**Última Atualização:** Outubro 2025  
**Responsável:** Equipe de Desenvolvimento
