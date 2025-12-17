#!/bin/bash
# Script para testar o sistema DV-7 Nexus completo

echo "🔍 Iniciando sistema DV-7 Nexus para testes..."
cd ~/dv7-nexus

# Verificar se as dependências estão instaladas
echo "📦 Verificando dependências do backend..."
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do backend..."
    npm install
fi

# Executar os testes
echo "🧪 Executando testes do backend..."
npm test

echo "✅ Testes concluídos!"
echo "DV-7 Nexus está pronto para uso!"