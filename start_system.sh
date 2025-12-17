#!/bin/bash
# Script para executar o DV-7 Nexus completo

echo "🚀 Iniciando DV-7 Nexus - Sistema de Dublagem Neural"

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados."

# Função para iniciar backend (executado em background)
start_backend() {
    echo "🔧 Iniciando backend..."
    cd backend
    npm install >/dev/null 2>&1
    echo "✅ Backend instalado. Iniciando servidor..."
    npm run dev &
    BACKEND_PID=$!
    cd ..
}

# Função para iniciar frontend (executado em background)
start_frontend() {
    echo "🔧 Iniciando frontend..."
    cd frontend
    npm install >/dev/null 2>&1
    echo "✅ Frontend instalado. Iniciando servidor..."
    npm run dev &
    FRONTEND_PID=$!
    cd ..
}

# Iniciar ambos em paralelo
start_backend
sleep 5  # Aguardar backend iniciar
start_frontend

echo "🌐 DV-7 Nexus está rodando!"
echo "📺 Frontend: http://localhost:5173"
echo "⚙️ Backend:  http://localhost:3000"
echo "📡 API tRPC: http://localhost:3000/api/trpc"
echo ""
echo "PRESSIONE Ctrl+C para parar o sistema"

# Função para limpar ao encerrar
cleanup() {
    echo ""
    echo "🛑 Parando DV-7 Nexus..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ DV-7 Nexus parado."
    exit 0
}

# Capturar sinal de interrupção (Ctrl+C)
trap cleanup INT

# Manter o script executando
wait