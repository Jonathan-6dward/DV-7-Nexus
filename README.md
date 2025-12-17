# ⚔️ PROTOCOLO DV-7 NEXUS
**Droide de Dublagem e Vocalização — desenvolvido por anakyn_1337**

> *"Nenhuma voz, nenhum idioma permanecerá inacessível ao meu núcleo de processamento."*

O **DV-7 Nexus** é um droide especializado em análise vocal e recriação linguística, projetado para capturar, transcrever e recriar conteúdo audiovisual em múltiplos idiomas. Desenvolvido com tecnologia de IA avançada (Whisper ASR, TTS Neural, FFmpeg), o sistema oferece uma plataforma completa para dublagem automática de vídeos curtos, permitindo que criadores de conteúdo transcendam barreiras linguísticas com poucos comandos.

---

## 🔮 NÚCLEO DO SISTEMA

> **Todo vídeo entra no sistema como "arquivo local interno".**
> Não importa a origem: link de qualquer plataforma ou upload direto.

---

## ⚙️ ARQUITETURA DO DROIDE

**Sistema de Captura**: Conexão neural com múltiplas plataformas (Instagram, YouTube, TikTok, Facebook, Twitter/X, Vimeo, Reddit)
**Processador de Áudio**: Extração e normalização automática de sinais sonoros
**Módulo ASR**: Whisper Neural Engine para transcrição de alta precisão
**Sintetizador Vocal**: TTS Neural para recriação de voz em múltiplos idiomas
**Renderizador Visual**: FFmpeg Core para processamento e exportação de mídia

---

## 🔮 TECNOLOGIAS QUE ALIMENTAM O DV-7

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18+, TypeScript, Next.js 14, Tailwind CSS, Radix UI |
| Backend | tRPC, Express.js, Node.js, TypeScript |
| Banco de Dados | MySQL + Drizzle ORM |
| Autenticação | OAuth com Manus |
| Processamento | FFmpeg, yt-dlp |
| IA - Transcrição | OpenAI Whisper |
| IA - Síntese Vocal | OpenAI TTS / ElevenLabs |
| Fila de Jobs | BullMQ + Redis |
| Armazenamento | AWS S3 / Cloudflare R2 |

---

## 🧠 PROTOCOS DE OPERAÇÃO

### ✅ Captura Universal de Conteúdo
* Suporte multi-plataforma via análise neural de URL
* Upload direto como protocolo de fallback
* Pipeline unificado independente da origem

### ✅ Interface Progressiva
* Feedback em tempo real de cada etapa
* Visualização clara de progresso
* Capacidade de abortar missão a qualquer momento

### ✅ Flexibilidade Pós-Processamento
* Calibragem de transcrição pré-dublagem
* Geração de múltiplas versões do mesmo conteúdo
* Múltiplos formatos de exportação

### ✅ Gestão Inteligente de Falhas
* Mensagens contextuais e acionáveis
* Protocolos alternativos sempre disponíveis
* Sistema nunca deixa operador sem próxima ação

---

## 🧬 ESTRUTURA DO PROJETO

```
dv7-nexus/
├── frontend/                 # Frontend React com Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Componentes UI reutilizáveis
│   │   │   ├── pages/        # Telas do sistema
│   │   │   └── App.tsx       # Componente raiz
│   │   ├── lib/              # Bibliotecas e utilitários
│   │   ├── store/            # Gerenciamento de estado (Zustand)
│   │   ├── types/            # Tipos TypeScript
│   │   └── styles/           # Arquivos CSS/SCSS
│   ├── public/
│   ├── package.json
│   └── README.md             # Documentação do frontend
├── backend/                  # Backend tRPC + Express.js
│   ├── src/
│   │   ├── _core/            # Infraestrutura (context, trpc, auth, etc.)
│   │   ├── modules/          # Módulos específicos do sistema
│   │   │   ├── video/        # Processamento de vídeo
│   │   │   ├── transcription/# Transcrição automática
│   │   │   ├── dubbing/      # Geração de dublagem
│   │   │   └── rendering/    # Renderização final
│   │   ├── db.ts             # Funções de acesso ao banco de dados
│   │   └── routers.ts        # Definição de endpoints tRPC
│   ├── drizzle/              # Schema e migrações do banco de dados
│   │   ├── schema.ts         # Definição das tabelas
│   │   └── migrations/       # Arquivos de migração SQL
│   ├── shared/               # Código compartilhado com frontend
│   ├── package.json
│   └── README.md             # Documentação específica do backend
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
├── scripts/
│   ├── setup_linux.sh
│   ├── setup_windows.ps1
│   └── start.sh
└── README.md
```

---

## 🧪 TESTES AUTOMATIZADOS

O projeto inclui uma suite de testes para garantir a qualidade e confiabilidade:

### Executar todos os testes do backend

```bash
cd backend
npm test
```

### Executar testes específicos do frontend (em breve)

```bash
cd frontend
npm test
```

---

## 🚀 EXECUTANDO O SISTEMA COMPLETO

### 1. Executar Backend e Frontend Separadamente (Desenvolvimento)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (em outro terminal)
cd frontend
npm run dev
```

### 2. Frontend estará disponível em: `http://localhost:5173`
### 3. Backend estará disponível em: `http://localhost:3000`

---

## ⚔️ PROTOCOLO DV-7 NEXUS

**Status:** Em desenvolvimento (MVP completo)  
**Versão:** 1.0.0  
**Codinome:** Dubbing & Vocalization Nexus  
**Desenvolvido por:** anakyn_1337

> *"Forjado para transcender barreiras linguísticas. Projetado para conectar culturas.  
> O DV-7 Nexus transforma vozes em pontes entre mundos."*

---

## 🩶 LICENÇA

Este projeto segue os princípios do **Código Jedi** — ou, mais precisamente, a **MIT License**.

*O conhecimento deve ser livre, acessível e usado para o bem maior.*