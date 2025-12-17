// backend/src/main.ts - Arquivo principal do backend
import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import { createContext } from './context';

async function startServer() {
  const app: Express = express();
  const server = createServer(app);

  // Middleware para parsing de JSON com tamanho maior para uploads de arquivos
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Configuração de CORS para permitir comunicação com frontend
  app.use(
    cors({
      origin: process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || '']
        : ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
    })
  );

  // Rota de health check
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'DV-7 Nexus Backend'
    });
  });

  // Rota para API tRPC
  app.use(
    '/api/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Rota para uploads de arquivos
  app.use('/uploads', express.static('uploads'));

  // Iniciar o servidor na porta especificada
  const PORT = parseInt(process.env.PORT || '3000');
  server.listen(PORT, () => {
    console.log(`DV-7 Nexus Backend rodando na porta ${PORT}`);
    console.log(`tRPC API disponível em: http://localhost:${PORT}/api/trpc`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

startServer().catch((error) => {
  console.error('Erro ao iniciar o servidor:', error);
  process.exit(1);
});