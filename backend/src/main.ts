// backend/src/main.ts - Arquivo principal do backend
import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";

// Middleware para servir arquivos estáticos do frontend em produção
import path from "path";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Habilitar CORS para permitir comunicação com o frontend
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL || '']
      : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  }));

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Servir arquivos estáticos do frontend em produção
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

    // Rota para servir index.html para todas as outras requisições (SPA)
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
    });
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`DV-7 Nexus Server running on http://localhost:${port}/`);
    console.log(`API available at: http://localhost:${port}/api/trpc`);
    if (process.env.NODE_ENV === 'development') {
      console.log(`Frontend development server should run on port 5173`);
    }
  });
}

startServer().catch(console.error);