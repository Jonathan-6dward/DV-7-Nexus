# DV-7 Nexus - Frontend

## 🤖 Sobre o Projeto

DV-7 Nexus é um sistema avançado de dublagem e vocalização de vídeos que utiliza tecnologia de IA para processar, transcrever e dublar conteúdo audiovisual em múltiplos idiomas.

## 🛠️ Tecnologias Utilizadas

- **React 18.3.1** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **React Router DOM** - Navegação entre páginas
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes UI acessíveis
- **Zustand** - Gerenciamento de estado
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de dados
- **tRPC** - Comunicação type-safe com backend (mock incluído)
- **React Query** - Gerenciamento de estado servidor
- **Sonner** - Notificações toast
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── ui/                    # Componentes UI base (shadcn)
│   │   ├── LanguageSelector.tsx   # Seletor de idiomas
│   │   ├── VoiceProfileSelector.tsx # Seletor de perfis vocais
│   │   ├── VideoUploader.tsx      # Componente de upload
│   │   └── ProgressTracker.tsx    # Rastreador de progresso
│   ├── pages/
│   │   ├── StartProject.tsx       # Tela 1: Iniciar Projeto
│   │   ├── TranscriptionReview.tsx # Tela 2: Revisão de Transcrição
│   │   ├── Processing.tsx         # Tela 3: Processamento
│   │   └── Result.tsx             # Tela 4: Resultado Final
│   └── App.tsx                    # Componente raiz
├── lib/
│   └── trpc.ts                    # Configuração tRPC (mock)
├── store/
│   └── useVideoStore.ts           # Store Zustand
├── types/
│   └── index.ts                   # Tipos TypeScript
└── styles/
    └── theme.css                  # Tema customizado
```

## 🎨 Paleta de Cores

- **Principal**: `#8b5cf6` (Roxo/Purple) - Destaque de funcionalidades
- **Fundo Escuro**: `#1e293b` (Azul escuro) - Tema técnico
- **Sucesso**: `#22c55e` (Verde) - Operações completas
- **Aviso**: `#f59e0b` (Âmbar) - Avisos
- **Erro**: `#ef4444` (Vermelho) - Erros

## 🚀 Fluxo de Trabalho

### Tela 1: Iniciar Projeto
- Captura de vídeo via URL ou upload
- Seleção de idioma de destino
- Seleção de perfil vocal
- Plataformas suportadas: YouTube, TikTok, Instagram, Twitter, Facebook, Vimeo

### Tela 2: Revisão de Transcrição
- Player de vídeo embutido
- Editor de transcrição com segmentos temporais
- Edição manual de cada segmento
- Confirmação de configurações de dublagem

### Tela 3: Processamento
- Barra de progresso animada
- Status em tempo real
- Estimativa de tempo restante
- Opção de cancelamento

### Tela 4: Resultado Final
- Player com vídeo processado
- Download do vídeo dublado
- Exportações adicionais:
  - Áudio isolado
  - Transcrição (TXT)
  - Legendas (SRT)
- Opção para gerar versão alternativa
- Botão para nova missão

## 🔌 Integração tRPC (Backend)

O projeto está preparado para integração com backend tRPC. Os endpoints esperados incluem:

### Autenticação
- `router.auth.me()` - Informações do usuário
- `router.auth.logout()` - Logout

### Vídeos
- `router.videos.list()` - Listar vídeos
- `router.videos.get({ id })` - Obter vídeo
- `router.videos.submit({ url, targetLanguage, voiceProfile })` - Submeter vídeo
- `router.videos.update({ id, ... })` - Atualizar vídeo
- `router.videos.delete({ id })` - Deletar vídeo

### Transcrições
- `router.transcription.get({ videoId })` - Obter transcrição
- `router.transcription.create({ videoId, language })` - Criar transcrição

### Dublagem
- `router.dubbing.get({ videoId })` - Obter dublagem
- `router.dubbing.create({ videoId, targetLanguage, voiceProfile })` - Criar dublagem

### Vídeos Renderizados
- `router.renderedVideos.get({ videoId })` - Obter vídeo renderizado

## 💡 Funcionalidades Principais

✅ **Captura Universal de Conteúdo**
- Validação em tempo real da URL
- Identificação automática da plataforma
- Feedback visual de plataforma suportada

✅ **Interface Progressiva**
- Feedback instantâneo de cada etapa
- Indicadores visuais de progresso
- Cancelamento seguro a qualquer momento

✅ **Flexibilidade Pós-Processamento**
- Edição de transcrição com sincronização temporal
- Geração de múltiplas versões (idioma/perfil vocal)
- Múltiplos formatos de exportação

✅ **Gestão Inteligente de Falhas**
- Mensagens de erro contextualizadas
- Alternativas para recuperação de falhas
- Manutenção do estado entre tentativas

## 🌐 Idiomas Suportados

- Português (Brasil)
- English (US)
- Español
- Français
- Deutsch
- Italiano
- 日本語
- 한국어
- 中文 (简体)

## 🎙️ Perfis Vocais

- Profissional Masculino
- Profissional Feminino
- Casual Masculino
- Casual Feminino
- Energético
- Calmo
- Narrativo

## 📱 Responsividade

O projeto é totalmente responsivo, adaptando-se para:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## 🔐 Segurança

- Validação de dados no frontend com Zod
- Type-safety com TypeScript
- Sanitização de inputs
- Tratamento adequado de erros de rede

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📝 Próximos Passos

Para conectar ao backend real:

1. Substituir o mock em `/src/lib/trpc.ts` pela configuração real do tRPC
2. Configurar a URL do backend no cliente tRPC
3. Adicionar autenticação JWT se necessário
4. Implementar queries e mutations reais

## 🤝 Contribuindo

Este projeto segue as melhores práticas de desenvolvimento:
- Componentes reutilizáveis
- Separação de concerns
- Type-safety completo
- Estado centralizado com Zustand
- UI consistente com design system

## 📄 Licença

Desenvolvido para o DV-7 Nexus - Droide de Dublagem e Vocalização
