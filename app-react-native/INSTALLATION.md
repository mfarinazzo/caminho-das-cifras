# 🚀 Guia de Instalação e Execução - Caminho das Cifras

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js 18+** - [Download aqui](https://nodejs.org/)
2. **Git** (opcional, mas recomendado)
3. **Expo Go** no seu celular:
   - [Android - Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

---

## 🎯 Passo a Passo (Windows PowerShell)

### 1️⃣ Navegar até a pasta do projeto

```powershell
cd e:\igrejaproject\app-react-native
```

### 2️⃣ Instalar dependências

```powershell
npm install
```

⏱️ **Tempo estimado:** 2-5 minutos (dependendo da internet)

### 3️⃣ Iniciar o servidor de desenvolvimento

```powershell
npm start
```

Você verá algo assim no terminal:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### 4️⃣ Abrir no seu celular

**No Android:**
1. Abra o app **Expo Go**
2. Toque em "Scan QR code"
3. Escaneie o QR code do terminal

**No iPhone:**
1. Abra o app **Câmera**
2. Aponte para o QR code
3. Toque na notificação que aparecer
4. Abrirá no Expo Go automaticamente

---

## ⚙️ Comandos Úteis

### Iniciar servidor (modo normal)
```powershell
npm start
```

### Iniciar com cache limpo (se tiver problemas)
```powershell
npm start -- --clear
```

### Verificar tipos TypeScript
```powershell
npm run type-check
```

### Formatar código
```powershell
npm run format
```

---

## 🐛 Resolução de Problemas Comuns

### ❌ Erro: "Cannot find module 'react'"

**Solução:** Instale as dependências novamente
```powershell
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

### ❌ Erro: "Metro bundler crashed"

**Solução:** Limpe o cache e reinicie
```powershell
npm start -- --clear
```

### ❌ App não carrega no celular

**Soluções:**
1. Certifique-se que PC e celular estão na **mesma rede Wi-Fi**
2. Desative VPNs no PC e celular
3. Desative firewall temporariamente ou adicione exceção para Node.js
4. Tente usar o modo **Tunnel**:
   ```powershell
   npm start -- --tunnel
   ```

### ❌ "Unable to resolve module"

**Solução:** Reinstale e limpe cache
```powershell
npm install
npm start -- --clear
```

### ❌ Erros do TypeScript no VS Code

**Solução:** Reload do TypeScript Server
1. Abra Command Palette (`Ctrl+Shift+P`)
2. Digite: "TypeScript: Restart TS Server"
3. Pressione Enter

---

## 📱 Testando no Dispositivo Físico

### Vantagens do Expo Go:
- ✅ Sem necessidade de build
- ✅ Hot reload instantâneo
- ✅ Testa no dispositivo real
- ✅ Sem emulador pesado

### Como funciona:
1. Você faz alterações no código
2. Salva o arquivo (`Ctrl+S`)
3. App recarrega automaticamente no celular (em ~2 segundos)

---

## 🎨 O que você verá

Ao abrir o app, você verá:

1. **Bottom Navigation** com 4 abas:
   - 🏠 **Início** - Categorias de cantos (Catecumenato, Eleição, Liturgia, etc.)
   - 🔍 **Buscar** - Campo de busca (placeholder por enquanto)
   - ❤️ **Favoritos** - Lista vazia com mensagem
   - ⚙️ **Configurações** - Opções de tema, fonte, notificações

2. **Tema Escuro Minimalista**:
   - Fundo: `#121212`
   - Cards: `#2A2A2A`
   - Texto: Branco/Cinza
   - Accent: Azul claro (`#90CAF9`)

---

## 🔧 Configuração Avançada (Opcional)

### Usar dispositivo Android via USB (sem Wi-Fi)

```powershell
npm run android
```

**Requisitos:**
- Android Studio instalado
- USB debugging ativado
- Drivers do celular instalados

### Abrir DevTools

Enquanto o app está rodando no celular:
- **Android:** Agite o celular e toque em "Debug"
- **iOS:** Agite o celular e toque em "Debug"

Ou pressione no terminal:
- `m` - Abrir menu
- `r` - Reload app
- `j` - Abrir debugger

---

## 📦 Estrutura Atual (Fase 0 - Setup)

```
app-react-native/
├── App.tsx                  ✅ Entry point
├── package.json             ✅ Dependências
├── tsconfig.json            ✅ Config TypeScript
├── tailwind.config.js       ✅ Config TailwindCSS
├── babel.config.js          ✅ Config Babel
├── app.json                 ✅ Config Expo
│
├── src/
│   ├── presentation/
│   │   ├── components/      ✅ Screen, Text, Button, Card
│   │   ├── navigation/      ✅ AppNavigator, Bottom Tabs
│   │   ├── screens/         ✅ Home, Search, Favorites, Settings
│   │   └── theme/           ✅ Colors, typography
│   │
│   └── shared/
│       └── constants/       ✅ Categories, routes
│
└── docs/                    ✅ Documentação completa
```

---

## ✅ Checklist de Instalação

Marque conforme for completando:

- [ ] Node.js 18+ instalado
- [ ] Expo Go instalado no celular
- [ ] Navegou até `e:\igrejaproject\app-react-native`
- [ ] Executou `npm install`
- [ ] Executou `npm start`
- [ ] Escaneou QR code com Expo Go
- [ ] App carregou com tela de categorias
- [ ] Consegue navegar entre as abas (Início, Buscar, Favoritos, Config)

---

## 🎯 Próximos Passos

Após confirmar que o app está rodando:

1. **Teste a navegação** entre as abas
2. **Explore a tela de configurações**
3. **Veja o código dos componentes** em `src/presentation/`
4. **Leia a documentação** em `docs/`

---

## 📞 Dúvidas?

Se encontrar algum problema:

1. Verifique a seção **Resolução de Problemas** acima
2. Confira se todos os pré-requisitos estão instalados
3. Certifique-se de estar na rede Wi-Fi correta
4. Tente limpar cache: `npm start -- --clear`

---

**Pronto para começar! 🚀**

Feito com ❤️ para a comunidade
