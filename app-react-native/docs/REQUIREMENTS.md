# 📋 Requisitos do Sistema

## 1. Visão Geral

O **Igreja App** é um aplicativo mobile desenvolvido em React Native que permite aos membros da comunidade acessar cantos litúrgicos organizados por categorias, com suporte a letras, cifras, áudios e imagens.

## 2. Requisitos Funcionais

### 2.1 RF01 - Navegação por Categorias

**Descrição:** O usuário deve poder navegar entre as categorias de cantos.

**Categorias:**
- Pré-Catecumenato
- Catecumenato
- Eleição
- Liturgia

**Critérios de Aceitação:**
- ✅ Exibir lista de categorias na tela inicial
- ✅ Ao selecionar uma categoria, exibir lista de cantos
- ✅ Indicador visual de quantos cantos existem em cada categoria
- ✅ Ícones distintos para cada categoria

### 2.2 RF02 - Listagem de Cantos

**Descrição:** Exibir lista de cantos dentro de cada categoria.

**Critérios de Aceitação:**
- ✅ Ordenação alfabética por título
- ✅ Exibir título principal e subtítulo
- ✅ Indicador visual se o canto possui áudio/imagem disponível
- ✅ Loading state durante carregamento
- ✅ Mensagem apropriada quando não há cantos

### 2.3 RF03 - Visualização de Canto

**Descrição:** Exibir detalhes completos de um canto selecionado.

**Informações Exibidas:**
- Título principal e subtítulo
- Referência bíblica (se houver)
- Página do hinário (se houver)
- Braçadeira (se houver)
- Letras organizadas por estrofes
- Cifras posicionadas sobre as palavras corretas
- Indicadores de repetição (bis, bis a, etc.)
- Player de áudio (se disponível)
- Botão para visualizar imagem da partitura

**Critérios de Aceitação:**
- ✅ Texto legível com tamanho de fonte ajustável
- ✅ Cifras claramente posicionadas
- ✅ Scroll suave entre estrofes
- ✅ Interface responsiva
- ✅ Botão de voltar para a lista

### 2.4 RF04 - Reprodução de Áudio

**Descrição:** Permitir reprodução do áudio do canto.

**Funcionalidades:**
- Play/Pause
- Barra de progresso com tempo atual/total
- Controle de volume (do sistema)
- Continuar tocando em background (opcional)
- Bloquear tela durante reprodução

**Critérios de Aceitação:**
- ✅ Player integrado na tela de visualização do canto
- ✅ Controles intuitivos e responsivos
- ✅ Feedback visual do estado (playing/paused/loading)
- ✅ Tratamento de erros de carregamento
- ✅ Auto-pause quando sair da tela (opcional)

### 2.5 RF05 - Visualização de Imagem

**Descrição:** Permitir visualização da imagem da partitura.

**Critérios de Aceitação:**
- ✅ Abrir em modal/tela fullscreen
- ✅ Suporte a zoom (pinch to zoom)
- ✅ Rotação da imagem (se necessário)
- ✅ Loading state durante carregamento
- ✅ Botão de fechar/voltar

### 2.6 RF06 - Busca de Cantos

**Descrição:** Permitir busca por título ou conteúdo dos cantos.

**Critérios de Aceitação:**
- ✅ Campo de busca acessível de todas as telas
- ✅ Busca em tempo real (debounce)
- ✅ Buscar por: título, subtítulo, referência
- ✅ Destacar termo buscado nos resultados
- ✅ Filtrar por categoria (opcional)
- ✅ Histórico de buscas recentes

### 2.7 RF07 - Favoritos

**Descrição:** Permitir marcar cantos como favoritos.

**Critérios de Aceitação:**
- ✅ Botão de favoritar na tela de visualização
- ✅ Lista de favoritos acessível
- ✅ Persistência local dos favoritos
- ✅ Remover dos favoritos facilmente
- ✅ Indicador visual de canto favoritado

### 2.8 RF08 - Modo Offline

**Descrição:** Funcionar completamente sem conexão à internet.

**Critérios de Aceitação:**
- ✅ Todos os dados locais (JSON, MP3, PNG)
- ✅ Sem requisições à API externa
- ✅ Funcionamento completo offline
- ✅ Assets otimizados para tamanho do app

### 2.9 RF09 - Ajuste de Fonte

**Descrição:** Permitir ajustar tamanho da fonte das letras.

**Critérios de Aceitação:**
- ✅ 3-5 tamanhos predefinidos (Pequeno, Médio, Grande, Muito Grande)
- ✅ Persistência da preferência
- ✅ Aplicar em todas as telas de visualização
- ✅ Manter legibilidade das cifras

### 2.10 RF10 - Tema Claro/Escuro

**Descrição:** Suportar temas claro e escuro.

**Critérios de Aceitação:**
- ✅ Seguir preferência do sistema (opcional)
- ✅ Alternância manual pelo usuário
- ✅ Persistência da escolha
- ✅ Transição suave entre temas
- ✅ Contraste adequado em ambos os temas

## 3. Requisitos Não-Funcionais

### 3.1 RNF01 - Performance

- ✅ Tempo de carregamento inicial < 3 segundos
- ✅ Transições de tela < 300ms
- ✅ Scroll suave (60fps)
- ✅ Áudio deve iniciar em < 1 segundo
- ✅ Imagens carregam com progressive loading

### 3.2 RNF02 - Usabilidade

- ✅ Interface intuitiva sem necessidade de tutorial
- ✅ Navegação com no máximo 3 toques para qualquer canto
- ✅ Feedback visual para todas as ações
- ✅ Mensagens de erro claras e úteis
- ✅ Acessibilidade (screen readers, contraste)

### 3.3 RNF03 - Compatibilidade

- ✅ Android 8.0+ (API Level 26+)
- ✅ iOS 13.0+
- ✅ Suporte a tablets (layout responsivo)
- ✅ Orientação portrait e landscape

### 3.4 RNF04 - Manutenibilidade

- ✅ Código TypeScript com tipagem forte
- ✅ Componentes reutilizáveis e modulares
- ✅ Testes unitários (cobertura mínima 70%)
- ✅ Documentação inline (JSDoc)
- ✅ Padrões de código (ESLint + Prettier)

### 3.5 RNF05 - Segurança

- ✅ Dados locais não-sensíveis (não requer criptografia)
- ✅ Sem coleta de dados do usuário
- ✅ Sem permissões desnecessárias
- ✅ Assets protegidos contra modificação

### 3.6 RNF06 - Escalabilidade

- ✅ Suportar até 500 cantos sem degradação de performance
- ✅ Busca otimizada com índices
- ✅ Lazy loading de componentes pesados
- ✅ Cache inteligente de recursos

### 3.7 RNF07 - Tamanho do App

- ✅ APK < 100MB
- ✅ Assets otimizados (imagens comprimidas, áudios em MP3)
- ✅ Code splitting quando possível
- ✅ Remoção de dependências não utilizadas

## 4. Regras de Negócio

### RN01 - Estrutura de Dados

- Cada canto pertence a uma única categoria
- Categorias são fixas e predefinidas
- Cantos podem ter ou não: áudio, imagem, braçadeira, referência
- Estrutura de JSON segue o formato atual do `output_api/`

### RN02 - Reprodução de Áudio

- Apenas um áudio pode tocar por vez
- Ao sair da tela do canto, o áudio pode continuar (decisão de UX)
- Áudio pausa ao receber ligação telefônica

### RN03 - Favoritos

- Limite de 100 cantos favoritos
- Favoritos persistem entre sessões
- Favoritos são locais (não sincronizados entre dispositivos)

### RN04 - Busca

- Busca ignora acentuação e case-sensitive
- Busca por palavra completa ou parcial
- Resultados ordenados por relevância

## 5. Casos de Uso Prioritários

### 🔴 Alta Prioridade (MVP)
1. Navegar por categorias
2. Visualizar lista de cantos
3. Visualizar detalhes do canto com letras e cifras
4. Reproduzir áudio

### 🟡 Média Prioridade
5. Buscar cantos
6. Favoritar cantos
7. Ajustar tamanho de fonte
8. Tema claro/escuro

### 🟢 Baixa Prioridade (Futuro)
9. Visualizar imagem da partitura
10. Compartilhar canto
11. Criar playlists personalizadas
12. Histórico de cantos recentes

## 6. Fluxo Principal do Usuário

```
1. Abrir App
   ↓
2. Ver Categorias (Tela Inicial)
   ↓
3. Selecionar Categoria
   ↓
4. Ver Lista de Cantos
   ↓
5. Selecionar Canto
   ↓
6. Visualizar Letra/Cifras
   ↓
7. [Opcional] Tocar Áudio
   ↓
8. [Opcional] Ver Imagem
   ↓
9. Voltar para Lista ou Nova Categoria
```

## 7. Critérios de Aceitação do MVP

✅ MVP será considerado completo quando:
1. Todas as funcionalidades de **Alta Prioridade** estiverem implementadas
2. App funcionar 100% offline
3. Performance atender RNF01
4. Build APK funcional para compartilhamento

---

**Versão:** 1.0  
**Última Atualização:** Outubro 2025  
**Próxima Revisão:** Após conclusão do MVP
