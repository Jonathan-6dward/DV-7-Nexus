#!/bin/bash
# DV-7 Nexus - Script de Inicialização
# Este script inicia a aplicação DV-7 Nexus

echo "==========================================="
echo "DV-7 Nexus - Inicialização"
echo "==========================================="

echo "Iniciando DV-7 Nexus..."
echo "Escolha a versão para executar:"
echo "   1) Ambos (Frontend e Backend)"
echo "   2) Apenas Backend"
echo "   3) Apenas Frontend"
read -p "Digite sua escolha (1, 2 ou 3): " choice

case $choice in
    1)
        echo "Iniciando frontend e backend..."
        cd frontend && npm run dev &
        cd ../backend && npm run dev &
        echo "Frontend em http://localhost:3000"
        echo "Backend em http://localhost:4000"
        ;;
    2)
        echo "Iniciando backend..."
        cd backend && npm run dev &
        echo "Backend em http://localhost:4000"
        ;;
    3)
        echo "Iniciando frontend..."
        cd frontend && npm run dev &
        echo "Frontend em http://localhost:3000"
        ;;
    *)
        echo "Opção inválida. Iniciando ambos por padrão..."
        cd frontend && npm run dev &
        cd ../backend && npm run dev &
        echo "Frontend em http://localhost:3000"
        echo "Backend em http://localhost:4000"
        ;;
esac

echo ""
echo "==========================================="
echo "DV-7 Nexus está rodando!"
echo "==========================================="