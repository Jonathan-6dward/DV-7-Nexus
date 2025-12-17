#!/bin/bash
# DV-7 Nexus - Script de Instalação Automática para Linux
# Este script instala todas as dependências e inicia a aplicação

echo "==========================================="
echo "DV-7 Nexus - Instalação Automática"
echo "==========================================="

# Função para detectar distribuição Linux
detect_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        DISTRO=$NAME
        ID=$ID
    else
        echo "Não foi possível detectar a distribuição Linux"
        exit 1
    fi
}

echo "1. Detectando distribuição..."
detect_distro
echo "Distribuição detectada: $DISTRO"

# Função para instalar dependências baseadas na distribuição
install_dependencies() {
    case $ID in
        ubuntu|debian|linuxmint|zorin)
            echo "Instalando dependências para Ubuntu/Debian/Zorin..."
            sudo apt update
            sudo apt install -y nodejs npm ffmpeg yt-dlp redis-server postgresql
            ;;
        centos|rhel|fedora)
            echo "Instalando dependências para CentOS/RHEL/Fedora..."
            if [ "$ID" = "fedora" ]; then
                sudo dnf install -y nodejs npm ffmpeg yt-dlp redis postgresql-server
            else
                sudo yum install -y nodejs npm ffmpeg yt-dlp redis postgresql-server
            fi
            ;;
        arch|manjaro)
            echo "Instalando dependências para Arch/Manjaro..."
            sudo pacman -S --noconfirm nodejs npm ffmpeg yt-dlp redis postgresql
            ;;
        *)
            echo "Distribuição não suportada automaticamente: $DISTRO"
            echo "Por favor, instale manualmente: nodejs, npm, ffmpeg, yt-dlp, redis, postgresql"
            read -p "Pressione Enter para continuar ou Ctrl+C para cancelar"
            ;;
    esac
}

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "Node.js não encontrado. Instalando..."
    install_dependencies
else
    echo "Node.js encontrado: $(node --version)"
fi

# Verifica se o FFmpeg está instalado
if ! command -v ffmpeg &> /dev/null; then
    echo "FFmpeg não encontrado. Instalando..."
    install_dependencies
else
    echo "FFmpeg encontrado: $(ffmpeg -version | head -n 1)"
fi

# Verifica se o yt-dlp está instalado
if ! command -v yt-dlp &> /dev/null; then
    echo "yt-dlp não encontrado. Instalando..."
    install_dependencies
else
    echo "yt-dlp encontrado: $(yt-dlp --version)"
fi

# Instala dependências do frontend
echo "2. Instalando dependências do frontend..."
cd frontend
npm install
cd ..

# Instala dependências do backend
echo "3. Instalando dependências do backend..."
cd backend
npm install
cd ..

echo "4. Iniciando aplicação DV-7 Nexus..."
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

# Mantém o script aberto para ver os resultados
echo ""
read -p "Pressione Enter para fechar..."