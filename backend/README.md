# ⚔️ PROTOCOLO DV-7 NEXUS - BACKEND

**Droide de Dublagem e Vocalização — desenvolvido por anakyn_1337**

> *"Nenhuma voz, nenhum idioma permanecerá inacessível ao meu núcleo de processamento."*

O **DV-7 Nexus Backend** é a parte servidor do sistema de dublagem neural, construído com tecnologias modernas e práticas de desenvolvimento robustas.

## 🔮 ARQUITETURA DO BACKEND

- **Framework**: [tRPC](https://trpc.io/) + Express (com potencial para integração com NestJS)
- **Banco de Dados**: MySQL com [Drizzle ORM](https://orm.drizzle.team/)
- **Autenticação**: OAuth com Manus
- **Tipagem**: TypeScript strict com Zod para validação
- **Testes**: Vitest para testes unitários e de integração

## 🧩 ESTRUTURA DO PROJETO

```
backend/
├── src/                    # Código fonte do backend
│   ├── _core/             # Infraestrutura interna (context, trpc, oauth, etc.)
│   ├── modules/           # Módulos específicos do sistema
│   │   ├── video/         # Módulo de processamento de vídeo
│   │   ├── transcription/ # Módulo de transcrição
│   │   ├── dubbing/       # Módulo de dublagem
│   │   └── rendering/     # Módulo de renderização
│   ├── jobs/              # Processos em segundo plano
│   ├── services/          # Lógica de negócio
│   ├── utils/             # Utilitários
│   ├── db.ts              # Funções de acesso ao banco de dados
│   └── routers.ts         # Definição de endpoints tRPC
├── drizzle/               # Schema e migrações do banco de dados
│   ├── schema.ts          # Definição das tabelas
│   └── migrations/        # Arquivos de migração SQL
├── shared/                # Código compartilhado com o frontend
├── tests/                 # Arquivos de teste (opcional, pode estar em server/)
└── ...
```

## 🧠 TABELAS DO BANCO DE DADOS

- **users**: Autenticação e autorização
- **videos**: Informações sobre vídeos processados
- **transcripts**: Transcrições geradas para vídeos
- **dubbing**: Informações sobre dublagens geradas
- **renderedVideos**: Vídeos finais renderizados
- **tasks**: Tarefas de processamento assíncrono
- **comments**: Comentários e feedback

## ⚙️ INSTALAÇÃO E CONFIGURAÇÃO

### Pré-requisitos

- Node.js >= 22.13.0
- pnpm >= 10.4.1
- Banco de dados MySQL/TiDB
- Conta Manus para OAuth

### 1. Instalar dependências

```bash
cd backend
pnpm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do diretório backend:

```env
# Banco de dados
DATABASE_URL=mysql://user:password@localhost:3306/dv7_nexus

# Autenticação
JWT_SECRET=sua-chave-secreta-aqui
VITE_APP_ID=seu-app-id-manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login

# Informações do proprietário
OWNER_NAME=Seu Nome
OWNER_OPEN_ID=seu-open-id

# Ambiente
NODE_ENV=development
PORT=3000
```

### 3. Executar migrações do banco de dados

```bash
cd backend
pnpm db:push
```

Este comando irá:
- Gerar as migrações SQL baseadas no schema Drizzle
- Aplicar as migrações ao banco de dados
- Criar todas as tabelas necessárias para o DV-7 Nexus

### 4. Iniciar o servidor de desenvolvimento

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

## 🧪 TESTES AUTOMATIZADOS

O projeto inclui uma suite de testes para garantir a qualidade e confiabilidade:

### Executar todos os testes

```bash
pnpm test
```

### Executar testes em modo watch

```bash
pnpm test --watch
```

### Executar teste específico

```bash
pnpm test video.test.ts
```

### Estratégia de testes

- **Testes unitários**: Funções e utilitários individuais
- **Testes de integração**: Endpoints tRPC e lógica de negócio
- **Testes de autorização**: Verificação de acesso entre usuários
- **Testes de validação**: Entrada de dados e formatos

## 🚀 ENDPOINTS PRINCIPAIS

### Autenticação
- `auth.me` - Obter informações do usuário autenticado
- `auth.logout` - Fazer logout

### Vídeos (DV-7 Nexus)
- `videos.list` - Listar vídeos do usuário
- `videos.get` - Obter informações de vídeo específico
- `videos.submit` - Submeter vídeo para processamento
- `videos.update` - Atualizar informações do vídeo
- `videos.delete` - Deletar vídeo

### Transcrição (DV-7 Nexus)
- `transcription.get` - Obter transcrição de vídeo
- `transcription.create` - Criar transcrição para vídeo

### Dublagem (DV-7 Nexus)
- `dubbing.get` - Obter dublagem de vídeo
- `dubbing.create` - Criar dublagem para vídeo

### Vídeos Renderizados (DV-7 Nexus)
- `renderedVideos.get` - Obter vídeo renderizado

### Tarefas
- `tasks.list` - Listar tarefas do usuário
- `tasks.get` - Obter tarefa específica
- `tasks.create` - Criar nova tarefa
- `tasks.update` - Atualizar tarefa
- `tasks.delete` - Deletar tarefa

## 🛠️ DESENVOLVIMENTO

### Adicionar novo módulo para o DV-7 Nexus

1. **Editar `drizzle/schema.ts`**: Adicionar novas tabelas se necessário
2. **Executar migrações**: `pnpm db:push`
3. **Adicionar funções em `src/db.ts`**: Criar queries para novas tabelas
4. **Criar endpoints em `src/routers.ts`**: Definir rotas tRPC
5. **Escrever testes**: Criar arquivos de teste para novas funcionalidades

### Executar verificações de código

```bash
# Verificar tipos TypeScript
pnpm check

# Formatar código
pnpm format
```

## 🚀 DEPLOYMENT

### Build para produção

```bash
pnpm build
```

### Iniciar em produção

```bash
NODE_ENV=production pnpm start
```

## 🔐 SEGURANÇA

### Práticas implementadas

- Validação rigorosa de entrada com Zod
- Controle de acesso baseado em usuário (usuário só acessa seus dados)
- Sanitização de URLs e parâmetros
- Armazenamento seguro de secrets em variáveis de ambiente
- Logging estruturado para monitoramento

## 📈 MONITORAMENTO

- Métricas de uso por usuário
- Status de processamento de vídeos
- Tempo de resposta dos endpoints
- Taxa de sucesso/erro das operações

---

## ⚔️ PROTOCOLO DV-7 NEXUS

**Status**: Em desenvolvimento  
**Versão**: 1.0.0 (MVP)  
**Codinome**: Dubbing & Vocalization Nexus  
**Desenvolvido por**: anakyn_1337

> *"Forjado para transcender barreiras linguísticas. Projetado para conectar culturas.  
> O DV-7 Nexus transforma vozes em pontes entre mundos."*