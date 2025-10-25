# 📖 Caminho das Cifras - Aplicativo de Cantos Litúrgicos

> **Aplicativo mobile para acesso a cantos litúrgicos organizados por categorias, com letras, acordes, áudios e imagens.**

## 🎯 Objetivo

Facilitar o acesso aos cantos da comunidade durante celebrações litúrgicas, permitindo que músicos e fiéis acompanhem as músicas com letras, cifras e áudios de referência diretamente de seus dispositivos móveis.

## 🚀 Status do Projeto

```
🔴 Fase de Planejamento e Documentação
```

## 📚 Documentação

Toda a documentação do projeto está organizada na pasta `/docs`:

- **[REQUIREMENTS.md](docs/REQUIREMENTS.md)** - Requisitos funcionais e não-funcionais detalhados
- **[TECH_STACK.md](docs/TECH_STACK.md)** - Stack tecnológico e justificativas
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Arquitetura, padrões e estrutura de pastas
- **[ROADMAP.md](docs/ROADMAP.md)** - Planejamento de desenvolvimento por fases
- **[FLOWCHARTS.md](docs/FLOWCHARTS.md)** - Diagramas e fluxogramas do sistema

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **SOLID**, com separação clara de responsabilidades:

```
app-react-native/
├── src/
│   ├── core/           # Regras de negócio e entidades
│   ├── data/           # Camada de dados (repositories, datasources)
│   ├── presentation/   # UI (screens, components, state management)
│   └── shared/         # Utilitários compartilhados
├── assets/             # Recursos estáticos (fontes, ícones)
└── docs/               # Documentação completa
```

## 🛠️ Stack Tecnológico Principal

| Categoria | Tecnologia | Versão |
|-----------|-----------|--------|
| **Framework** | React Native | 0.75+ |
| **Toolkit** | Expo SDK | 52+ |
| **Linguagem** | TypeScript | 5.6+ |
| **Navegação** | React Navigation v7 | 7.0+ |
| **Estilização** | NativeWind (TailwindCSS) | 4.0+ |
| **UI Components** | React Native Paper | 5.12+ |
| **State Management** | Zustand | 5.0+ |
| **Audio Player** | Expo AV | 14.0+ |

## 📱 Funcionalidades Principais

- ✅ **Navegação por categorias** (Catecumenato, Eleição, Liturgia, Pré-Catecumenato)
- ✅ **Visualização de letras e cifras** com formatação adequada
- ✅ **Player de áudio** integrado com controles
- ✅ **Visualização de imagens** das partituras
- ✅ **Busca inteligente** por título ou conteúdo
- ✅ **Favoritos** para acesso rápido
- ✅ **Modo offline** completo
- ✅ **Tema claro/escuro**

## 🎨 Design System

O app utiliza **NativeWind** (Tailwind CSS para React Native) para estilização moderna e responsiva, combinado com **React Native Paper** para componentes Material Design prontos e acessíveis.

## 📦 Instalação e Execução

> ⚠️ **Projeto em fase de documentação**. Instruções de instalação serão adicionadas na fase de implementação.

## 🤝 Contribuindo

Este é um projeto privado para uso da comunidade. Sugestões e melhorias são bem-vindas.

## 📄 Licença

Uso privado - Comunidade Religiosa

## 👥 Autores

Desenvolvido com ❤️ para a comunidade.

---

**Última atualização:** Outubro 2025
