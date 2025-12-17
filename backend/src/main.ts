// backend/src/main.ts - Arquivo principal do backend
import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { createServer, Server } from 'http';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createContext } from './context';
import { appRouter } from './routers';

async function startServer(): Promise<Server> {
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
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
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
  const PORT = Number(process.env.PORT) || 3000;
  const availablePort = await findAvailablePort(PORT);

  server.listen(availablePort, () => {
    console.log(`DV-7 Nexus Backend rodando na porta ${availablePort}`);
    console.log(`tRPC API disponível em: http://localhost:${availablePort}/api/trpc`);
    console.log(`Health check: http://localhost:${availablePort}/health`);
  });

  return server;
}

// Função para encontrar porta disponível
async function findAvailablePort(startPort: number): Promise<number> {
  const net = await import('net');

  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.listen(startPort, () => {
      server.close(() => {
        resolve(startPort);
      });
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Porta ${startPort} está ocupada, tentando próxima...`);
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

startServer()
  .then(() => {
    console.log('DV-7 Nexus Backend iniciado com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  });