#!/bin/bash
# DV-7 Nexus - Script de Inicialização Completa
# Este script inicializa tanto o backend quanto o frontend para desenvolvimento

echo "🚀 Iniciando DV-7 Nexus - Sistema de Dublagem Neural"
echo "=================================================="

# Função para verificar se uma porta está em uso
is_port_available() {
    local port=$1
    nc -z localhost $port > /dev/null 2>&1
    return $?
}

# Função para matar processos em uma porta específica
kill_port_process() {
    local port=$1
    local pid=$(lsof -t -i:$port)
    if [ ! -z "$pid" ]; then
        echo "Matando processo na porta $port (PID: $pid)"
        kill -9 $pid 2>/dev/null || true
    fi
}

# Verificar e liberar portas principais se necessário
echo "🔍 Verificando portas de desenvolvimento..."
if ! is_port_available 3000; then
    echo "⚠️ Porta 3000 (backend) está ocupada, tentando liberar..."
    kill_port_process 3000
fi

if ! is_port_available 5173; then
    echo "⚠️ Porta 5173 (frontend) está ocupada, tentando liberar..."
    kill_port_process 5173
fi

echo ""

# Iniciar backend em primeiro
echo "⚙️ Iniciando Backend DV-7 Nexus..."
echo "----------------------------------------"
cd ~/dv7-nexus/backend

# Instalar dependências do backend (se necessário)
echo "📦 Instalando dependências do backend..."
npm install

# Verificar se podemos acessar o banco de dados
if [ -f .env ]; then
    echo "🔐 Carregando variáveis de ambiente..."
else
    echo "📝 Criando arquivo .env de exemplo..."
    cat > .env << EOL
# DV-7 Nexus Backend Configuration
DATABASE_URL="mysql://dv7_user:dV7_Nexus2025@localhost:3306/dv7_nexus"
DB_HOST=localhost
DB_PORT=3306
DB_USER=dv7_user
DB_PASSWORD=dV7_Nexus2025
DB_NAME=dv7_nexus
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
SECRET_KEY=dv7_nexus_secret_key_2025
EOL
fi

# Executar migrações do banco de dados
echo "💾 Executando migrações do banco de dados..."
npx prisma migrate dev --name init

# Iniciar backend em background
echo "⚙️ Iniciando servidor backend..."
npm run dev &
BACKEND_PID=$!

# Aguardar um pouco para o backend iniciar
sleep 3

# Iniciar frontend em segundo
echo ""
echo "🎨 Iniciando Frontend DV-7 Nexus..."
echo "----------------------------------------"
cd ~/dv7-nexus/frontend

# Instalar dependências do frontend (se necessário)
echo "📦 Instalando dependências do frontend..."
npm install

# Criar arquivo de ambiente do frontend
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env do frontend..."
    cat > .env << EOL
# DV-7 Nexus Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
NODE_ENV=development
EOL
fi

# Iniciar frontend em background
echo "🎨 Iniciando servidor frontend..."
npm run dev &
FRONTEND_PID=$!

# Aguardar mais um pouco para o frontend iniciar
sleep 5

echo ""
echo "🎉 DV-7 NEXUS ESTÁ RODANDO! 🎉"
echo "================================"
echo "📡 Backend (API): http://localhost:3000"
echo "📺 Frontend: http://localhost:5173"
echo "🔌 API tRPC: http://localhost:3000/api/trpc"
echo "🧪 Testes backend: npm test em ~/dv7-nexus/backend"
echo ""
echo "🔧 Para parar o sistema, pressione Ctrl+C"
echo ""

# Configurar limpeza quando o script for interrompido
cleanup() {
    echo ""
    echo "🛑 Parando DV-7 Nexus..."
    
    # Matar processos
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    echo "✅ DV-7 Nexus parado."
    exit 0
}

trap cleanup INT TERM

# Aguardar indefinidamente até que o usuário interrompa
wait $BACKEND_PID $FRONTEND_PID