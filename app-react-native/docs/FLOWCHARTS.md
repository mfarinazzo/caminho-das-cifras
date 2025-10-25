# 📊 Fluxogramas e Diagramas do Sistema

Este documento contém os principais fluxogramas e diagramas que representam visualmente a arquitetura e os fluxos do aplicativo.

---

## 1. Fluxo Principal do Usuário

```mermaid
flowchart TD
    Start([Abrir App]) --> Home[Tela de Categorias]
    Home --> SelectCat{Selecionar<br/>Categoria}
    
    SelectCat --> ListSongs[Lista de Cantos<br/>da Categoria]
    
    ListSongs --> SelectSong{Selecionar<br/>Canto}
    SelectSong --> Detail[Detalhes do Canto<br/>Letras + Cifras]
    
    Detail --> HasAudio{Tem<br/>Áudio?}
    HasAudio -->|Sim| PlayAudio[Reproduzir Áudio]
    HasAudio -->|Não| ViewOnly[Apenas Visualização]
    
    PlayAudio --> Controls{Controles}
    Controls -->|Play/Pause| PlayAudio
    Controls -->|Seek| PlayAudio
    Controls -->|Voltar| Detail
    
    Detail --> HasImage{Tem<br/>Imagem?}
    HasImage -->|Sim| ViewImage[Ver Partitura<br/>Fullscreen]
    HasImage -->|Não| Detail
    
    ViewImage --> CloseImage{Fechar}
    CloseImage --> Detail
    
    Detail --> Favorite{Favoritar?}
    Favorite -->|Sim| AddFav[Adicionar aos<br/>Favoritos]
    Favorite -->|Não| Detail
    
    AddFav --> Detail
    
    Detail --> Back{Voltar}
    Back --> ListSongs
    
    ListSongs --> BackCat{Voltar}
    BackCat --> Home
    
    Home --> BottomNav{Navegar<br/>Bottom Tabs}
    BottomNav -->|Home| Home
    BottomNav -->|Busca| Search[Tela de Busca]
    BottomNav -->|Favoritos| Favs[Tela de Favoritos]
    BottomNav -->|Config| Settings[Configurações]
    
    Search --> SearchQuery[Digitar Busca]
    SearchQuery --> ShowResults[Exibir Resultados]
    ShowResults --> SelectSong
    
    Favs --> FavList[Lista de Favoritos]
    FavList --> SelectSong
    
    Settings --> ChangeTheme[Mudar Tema]
    Settings --> ChangeFont[Ajustar Fonte]
    ChangeTheme --> Settings
    ChangeFont --> Settings
    
    style Start fill:#4CAF50
    style Detail fill:#2196F3
    style PlayAudio fill:#FF9800
    style AddFav fill:#E91E63
```

---

## 2. Arquitetura em Camadas

```mermaid
graph TB
    subgraph "PRESENTATION LAYER"
        A[Screens] --> B[Components]
        A --> C[Hooks]
        A --> D[Navigation]
        C --> E[Zustand Stores]
    end
    
    subgraph "DOMAIN LAYER (CORE)"
        F[Entities] 
        G[Use Cases]
        H[Repository Interfaces]
        
        G --> F
        G --> H
    end
    
    subgraph "DATA LAYER"
        I[Repositories<br/>Implementation]
        J[Data Sources]
        K[Mappers]
        
        I --> J
        I --> K
        K --> F
    end
    
    subgraph "INFRASTRUCTURE LAYER"
        L[Expo AV<br/>Audio Player]
        M[AsyncStorage]
        N[FlexSearch<br/>Engine]
        O[File System<br/>Assets]
    end
    
    A --> G
    E --> G
    H -.implements.-> I
    J --> O
    J --> M
    I --> L
    I --> N
    
    style F fill:#4CAF50
    style G fill:#4CAF50
    style H fill:#4CAF50
    style A fill:#2196F3
    style I fill:#FF9800
    style J fill:#FF9800
```

---

## 3. Fluxo de Dados (Get Song Details)

```mermaid
sequenceDiagram
    participant U as User
    participant S as SongDetailScreen
    participant H as useSongDetail Hook
    participant UC as GetSongById UseCase
    participant R as SongRepository
    participant DS as JsonDataSource
    participant M as SongMapper
    
    U->>S: Navega para detalhes (songId)
    S->>H: Chama hook com songId
    H->>UC: execute(songId)
    UC->>R: findById(songId)
    R->>DS: loadSong(songId)
    DS->>DS: Lê JSON do arquivo
    DS-->>R: Retorna SongDTO
    R->>M: toDomain(songDTO)
    M-->>R: Retorna Song Entity
    R-->>UC: Retorna Song
    UC-->>H: Retorna Song
    H-->>S: Atualiza state com song
    S->>S: Renderiza UI com dados
    S-->>U: Exibe letras e cifras
```

---

## 4. Fluxo de Áudio (Play/Pause)

```mermaid
sequenceDiagram
    participant U as User
    participant AP as AudioPlayer Component
    participant AS as audioStore (Zustand)
    participant UC as PlayAudio UseCase
    participant AR as AudioRepository
    participant EPA as ExpoAudioPlayer

    U->>AP: Clica Play
    AP->>AS: play(songId, audioUri)
    AS->>UC: execute(songId, audioUri)
    UC->>AR: play(audioUri)
    AR->>EPA: load(audioUri)
    EPA->>EPA: Audio.Sound.createAsync()
    EPA-->>AR: Sound instance
    AR->>EPA: playAsync()
    EPA-->>AR: Playing
    AR-->>UC: Success
    UC-->>AS: Atualiza state (isPlaying: true)
    AS-->>AP: Re-render (botão = Pause)
    AP-->>U: Mostra ícone Pause + progresso
    
    U->>AP: Clica Pause
    AP->>AS: pause()
    AS->>EPA: pauseAsync()
    EPA-->>AS: Paused
    AS-->>AP: Re-render (botão = Play)
    AP-->>U: Mostra ícone Play
```

---

## 5. Sistema de Favoritos

```mermaid
flowchart TD
    A[Usuário clica<br/>Botão Favoritar] --> B{Já é<br/>favorito?}
    
    B -->|Sim| C[Remove dos Favoritos]
    B -->|Não| D[Adiciona aos Favoritos]
    
    C --> E[favoritesStore.toggle]
    D --> E
    
    E --> F[ToggleFavorite UseCase]
    F --> G[FavoriteRepository]
    
    G --> H[AsyncStorage]
    H --> I[Persiste JSON<br/>@favorites: string[]]
    
    I --> J[Atualiza Store State]
    J --> K[Re-render UI]
    
    K --> L{Favorito<br/>Ativo?}
    L -->|Sim| M[Ícone Coração Cheio<br/>Cor Vermelha]
    L -->|Não| N[Ícone Coração Vazio<br/>Cor Cinza]
    
    M --> O[Aparece na<br/>Tela de Favoritos]
    N --> P[Não aparece na<br/>Tela de Favoritos]
    
    style A fill:#2196F3
    style M fill:#E91E63
    style O fill:#E91E63
```

---

## 6. Sistema de Busca

```mermaid
flowchart TD
    A[Usuário digita<br/>na SearchBar] --> B[Debounce 300ms]
    
    B --> C[searchStore.search]
    C --> D[SearchSongs UseCase]
    
    D --> E[FlexSearchEngine]
    E --> F{Índice<br/>existe?}
    
    F -->|Não| G[Criar Índice]
    G --> H[Indexar todos os cantos<br/>título, subtítulo, referência]
    
    F -->|Sim| I[Buscar no Índice]
    H --> I
    
    I --> J[Retorna IDs dos<br/>cantos encontrados]
    J --> K[SongRepository.findByIds]
    
    K --> L[Carrega dados<br/>completos dos cantos]
    L --> M[Ordena por<br/>Relevância]
    
    M --> N[searchStore atualiza<br/>results]
    N --> O[Re-render SearchScreen]
    
    O --> P[Exibe lista de<br/>resultados]
    P --> Q{Resultados<br/>encontrados?}
    
    Q -->|Sim| R[Lista com<br/>highlight do termo]
    Q -->|Não| S[Empty State<br/>Nenhum resultado]
    
    R --> T[Usuário seleciona<br/>resultado]
    T --> U[Navega para<br/>SongDetailScreen]
    
    style A fill:#2196F3
    style E fill:#FF9800
    style R fill:#4CAF50
    style S fill:#F44336
```

---

## 7. Estrutura de Componentes (SongDetailScreen)

```mermaid
graph TD
    A[SongDetailScreen] --> B[Screen Container]
    B --> C[ScrollView]
    
    C --> D[SongHeader]
    C --> E[LyricsSection]
    C --> F[AudioPlayer]
    C --> G[ActionButtons]
    
    D --> D1[Title]
    D --> D2[Subtitle]
    D --> D3[Reference]
    D --> D4[Page Number]
    
    E --> E1[Verse 1]
    E --> E2[Verse 2]
    E --> E3[Verse N]
    
    E1 --> E1A[Line 1 + Chords]
    E1 --> E1B[Line 2 + Chords]
    
    F --> F1[Play/Pause Button]
    F --> F2[Progress Bar]
    F --> F3[Time Display]
    
    G --> G1[Favorite Button]
    G --> G2[View Image Button]
    G --> G3[Share Button]
    
    A --> H[useSongDetail Hook]
    A --> I[useAudioPlayer Hook]
    A --> J[useFavorites Hook]
    
    H --> K[GetSongById UseCase]
    I --> L[audioStore]
    J --> M[favoritesStore]
    
    style A fill:#2196F3
    style F fill:#FF9800
    style G1 fill:#E91E63
```

---

## 8. Ciclo de Vida do Player de Áudio

```mermaid
stateDiagram-v2
    [*] --> Idle: Component Mount
    
    Idle --> Loading: User Press Play
    Loading --> Playing: Audio Loaded
    Loading --> Error: Load Failed
    
    Playing --> Paused: User Press Pause
    Paused --> Playing: User Press Play
    
    Playing --> Seeking: User Drags Slider
    Seeking --> Playing: Seek Complete
    
    Playing --> Finished: Audio Ends
    Finished --> Playing: User Press Play (restart)
    
    Playing --> Idle: Component Unmount
    Paused --> Idle: Component Unmount
    
    Error --> Idle: User Dismiss Error
    
    note right of Loading
        Carregando arquivo MP3
        Exibe spinner
    end note
    
    note right of Playing
        Atualizando progresso
        Notificação ativa
    end note
    
    note right of Error
        Exibe mensagem
        Permite retry
    end note
```

---

## 9. Fluxo de Build e Deploy

```mermaid
flowchart LR
    A[Código Fonte] --> B{Ambiente}
    
    B -->|Development| C[Expo Go]
    C --> D[Teste em<br/>Dispositivo Real]
    D --> E{Aprovado?}
    E -->|Não| A
    
    B -->|Preview| F[EAS Build Preview]
    F --> G[Gera APK]
    G --> H[Distribui para<br/>Beta Testers]
    H --> I{Feedback OK?}
    I -->|Não| A
    
    E -->|Sim| F
    I -->|Sim| J[EAS Build Production]
    
    J --> K[Gera AAB/APK]
    K --> L{Distribuição}
    
    L -->|Privada| M[Upload Google Drive]
    M --> N[Compartilha via<br/>WhatsApp]
    
    L -->|Pública| O[Google Play Store<br/>Internal Testing]
    O --> P[Grupo Fechado]
    
    N --> Q[Usuários Instalam]
    P --> Q
    
    Q --> R[Coleta Feedback]
    R --> S{Novos<br/>Features?}
    S -->|Sim| A
    S -->|Não| T[Manutenção]
    
    style A fill:#4CAF50
    style G fill:#FF9800
    style K fill:#2196F3
    style Q fill:#E91E63
```

---

## 10. Estratégia de Cache

```mermaid
flowchart TD
    A[App Inicia] --> B[Load Categories]
    B --> C{Cache Existe?}
    
    C -->|Não| D[Carrega JSONs]
    D --> E[Cria Índice de Busca]
    E --> F[Salva em Memória]
    F --> G[App Pronto]
    
    C -->|Sim| H[Carrega de Memória]
    H --> G
    
    G --> I[Usuário Navega]
    I --> J[Seleciona Canto]
    
    J --> K{Dados em<br/>Memória?}
    K -->|Sim| L[Renderiza Imediato]
    K -->|Não| M[Carrega JSON]
    M --> N[Cache em Memória]
    N --> L
    
    L --> O[Reproduz Áudio]
    O --> P{Áudio em<br/>Cache?}
    
    P -->|Sim| Q[Toca Imediato]
    P -->|Não| R[Carrega MP3]
    R --> S[Cache do SO]
    S --> Q
    
    style G fill:#4CAF50
    style L fill:#2196F3
    style Q fill:#FF9800
```

---

## 11. Estrutura de Testes

```mermaid
graph TD
    A[Test Suite] --> B[Unit Tests]
    A --> C[Integration Tests]
    A --> D[E2E Tests]
    
    B --> B1[Utils]
    B --> B2[Mappers]
    B --> B3[Use Cases]
    B --> B4[Pure Functions]
    
    B1 --> B1A[string.utils.test.ts]
    B2 --> B2A[SongMapper.test.ts]
    B3 --> B3A[GetSongById.test.ts]
    
    C --> C1[Repositories]
    C --> C2[Stores]
    C --> C3[Hooks]
    
    C1 --> C1A[SongRepository.test.ts<br/>Mock DataSource]
    C2 --> C2A[audioStore.test.ts<br/>Mock UseCase]
    C3 --> C3A[useSongList.test.ts<br/>Mock Repository]
    
    D --> D1[Navigation Flow]
    D --> D2[Search Flow]
    D --> D3[Favorite Flow]
    
    D1 --> D1A[Categories → List → Detail]
    D2 --> D2A[Search → Results → Detail]
    D3 --> D3A[Add Favorite → View Favorites]
    
    style B fill:#4CAF50
    style C fill:#FF9800
    style D fill:#2196F3
```

---

## 12. Modelo de Dados (Entidades)

```mermaid
classDiagram
    class Category {
        +string id
        +string name
        +string icon
        +int songCount
    }
    
    class Song {
        +string id
        +string title
        +string subtitle
        +string reference
        +int page
        +Category category
        +Bracadeira bracadeira
        +Column[] columns
        +string audioUri
        +string imageUri
        +boolean hasAudio()
        +boolean hasImage()
    }
    
    class Column {
        +int id
        +Verse[] verses
    }
    
    class Verse {
        +string indicator
        +string repetition
        +Line[] lines
    }
    
    class Line {
        +string lyrics
        +Chord[] chords
    }
    
    class Chord {
        +string symbol
        +string targetWord
        +int occurrence
        +int position
    }
    
    class Bracadeira {
        +boolean has
        +string house
    }
    
    Song "1" --> "1..*" Column
    Column "1" --> "1..*" Verse
    Verse "1" --> "1..*" Line
    Line "1" --> "0..*" Chord
    Song "1" --> "1" Category
    Song "1" --> "0..1" Bracadeira
```

---

## 13. Fluxo de Tratamento de Erros

```mermaid
flowchart TD
    A[Operação Executada] --> B{Erro<br/>Ocorreu?}
    
    B -->|Não| C[Sucesso]
    C --> D[Atualiza UI]
    
    B -->|Sim| E{Tipo de Erro}
    
    E -->|Network| F[Sem Internet]
    E -->|File Not Found| G[Recurso Não Encontrado]
    E -->|Parse Error| H[Dados Corrompidos]
    E -->|Permission| I[Sem Permissão]
    E -->|Unknown| J[Erro Desconhecido]
    
    F --> K[Toast: Verifique sua conexão]
    G --> L[Toast: Arquivo não disponível]
    H --> M[Toast: Erro ao carregar dados]
    I --> N[Toast: Permissão necessária]
    J --> O[Toast: Algo deu errado]
    
    K --> P{Ação<br/>Recuperável?}
    L --> P
    M --> P
    N --> P
    O --> P
    
    P -->|Sim| Q[Botão Retry]
    P -->|Não| R[Voltar para tela anterior]
    
    Q --> S{Retry<br/>Sucesso?}
    S -->|Sim| C
    S -->|Não| T[Log Error]
    
    R --> T
    T --> U[Sentry/Console]
    
    U --> V[Fim]
    D --> V
    
    style B fill:#F44336
    style C fill:#4CAF50
    style Q fill:#FF9800
```

---

## 14. Navegação (Stack & Tabs)

```mermaid
graph TD
    A[App Root] --> B[Bottom Tab Navigator]
    
    B --> C[Home Tab]
    B --> D[Search Tab]
    B --> E[Favorites Tab]
    B --> F[Settings Tab]
    
    C --> G[Stack: Home]
    D --> H[Stack: Search]
    E --> I[Stack: Favorites]
    F --> J[Stack: Settings]
    
    G --> G1[CategoriesScreen]
    G1 --> G2[SongListScreen]
    G2 --> G3[SongDetailScreen]
    G3 --> G4[ImageViewerModal]
    
    H --> H1[SearchScreen]
    H1 --> G3
    
    I --> I1[FavoritesScreen]
    I1 --> G3
    
    J --> J1[SettingsScreen]
    
    style B fill:#2196F3
    style G3 fill:#FF9800
```

---

## Legendas

### Cores dos Diagramas

- 🟢 **Verde (#4CAF50):** Sucesso, Estado Final, Entidades
- 🔵 **Azul (#2196F3):** Telas, Apresentação, Navegação
- 🟠 **Laranja (#FF9800):** Processamento, Dados, Middleware
- 🔴 **Vermelho (#F44336):** Erros, Estados Negativos
- 💗 **Rosa (#E91E63):** Favoritos, Ações do Usuário

---

**Versão:** 1.0  
**Última Atualização:** Outubro 2025  
**Ferramentas:** Mermaid.js  
**Próxima Revisão:** Durante desenvolvimento (atualizar conforme implementação)
