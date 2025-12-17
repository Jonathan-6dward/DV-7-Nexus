# DV-7 Nexus - Script de Instalação Automática para Windows
# Este script instala todas as dependências e inicia a aplicação

Write-Host "===========================================" -ForegroundColor Green
Write-Host "DV-7 Nexus - Instalação Automática" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

# Verifica se está rodando como administrador (necessário para algumas instalações)
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "AVISO: Execute este script como administrador para instalações mais completas." -ForegroundColor Yellow
}

Write-Host "`n1. Verificando dependências..." -ForegroundColor Cyan

# Função para verificar se o Node.js está instalado
function Test-Node {
    try {
        $node_version = node --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Node.js encontrado: $node_version" -ForegroundColor Green
            return $true
        } else {
            return $false
        }
    } catch {
        return $false
    }
}

# Função para verificar se o FFmpeg está instalado
function Test-FFmpeg {
    try {
        $ffmpeg_version = ffmpeg -version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "FFmpeg encontrado: $($ffmpeg_version[0])" -ForegroundColor Green
            return $true
        } else {
            return $false
        }
    } catch {
        return $false
    }
}

# Verifica Node.js
if (-not (Test-Node)) {
    Write-Host "Node.js não encontrado. Instalando via Chocolatey..." -ForegroundColor Yellow
    $choco = Get-Command choco -ErrorAction SilentlyContinue
    if ($choco) {
        choco install nodejs -y
    } else {
        Write-Host "Chocolatey não encontrado. Por favor, instale Node.js manualmente." -ForegroundColor Red
        Read-Host "Pressione Enter para continuar ou instale manualmente e reinicie o script"
        exit 1
    }
}

# Verifica FFmpeg
if (-not (Test-FFmpeg)) {
    Write-Host "FFmpeg não encontrado. Instalando via Chocolatey..." -ForegroundColor Yellow
    $choco = Get-Command choco -ErrorAction SilentlyContinue
    if ($choco) {
        choco install ffmpeg -y
    } else {
        Write-Host "FFmpeg não encontrado e não foi possível instalar automaticamente." -ForegroundColor Red
        Write-Host "Por favor, baixe e instale FFmpeg manualmente de: https://www.gyan.dev/ffmpeg/builds/" -ForegroundColor Yellow
        Read-Host "Pressione Enter para continuar"
        exit 1
    }
}

# Verifica se o yt-dlp está instalado
try {
    $yt_dlp_version = yt-dlp --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "yt-dlp encontrado: $yt_dlp_version" -ForegroundColor Green
    } else {
        Write-Host "yt-dlp não encontrado. Instalando..." -ForegroundColor Yellow
        pip install yt-dlp
    }
} catch {
    Write-Host "yt-dlp não encontrado. Instalando via pip..." -ForegroundColor Yellow
    pip install yt-dlp
}

# Instala dependências do frontend
Write-Host "`n2. Instalando dependências do frontend..." -ForegroundColor Cyan
Set-Location frontend
npm install
Set-Location ..

# Instala dependências do backend
Write-Host "`n3. Instalando dependências do backend..." -ForegroundColor Cyan
Set-Location backend
npm install
Set-Location ..

Write-Host "`n4. Iniciando aplicação DV-7 Nexus..." -ForegroundColor Cyan

# Pergunta ao usuário qual versão executar
Write-Host "`nEscolha a versão para executar:" -ForegroundColor Yellow
Write-Host "1) Ambos (Frontend e Backend)" -ForegroundColor White
Write-Host "2) Apenas Backend" -ForegroundColor White
Write-Host "3) Apenas Frontend" -ForegroundColor White

$choice = Read-Host "`nDigite sua escolha (1, 2 ou 3)"

switch ($choice) {
    "1" {
        Write-Host "`nIniciando frontend e backend..." -ForegroundColor Green
        Start-Process -FilePath "cmd" -ArgumentList "/c", "cd frontend && npm run dev"
        Start-Process -FilePath "cmd" -ArgumentList "/c", "cd backend && npm run dev"
        Write-Host "Frontend em http://localhost:3000" -ForegroundColor Green
        Write-Host "Backend em http://localhost:4000" -ForegroundColor Green
    }
    "2" {
        Write-Host "`nIniciando backend..." -ForegroundColor Green
        Start-Process -FilePath "cmd" -ArgumentList "/c", "cd backend && npm run dev"
        Write-Host "Backend em http://localhost:4000" -ForegroundColor Green
    }
    "3" {
        Write-Host "`nIniciando frontend..." -ForegroundColor Green
        Start-Process -FilePath "cmd" -ArgumentList "/c", "cd frontend && npm run dev"
        Write-Host "Frontend em http://localhost:3000" -ForegroundColor Green
    }
    default {
        Write-Host "Opção inválida. Iniciando ambos por padrão..." -ForegroundColor Yellow
        Start-Process -FilePath "cmd" -ArgumentList "/c", "cd frontend && npm run dev"
        Start-Process -FilePath "cmd" -ArgumentList "/c", "cd backend && npm run dev"
        Write-Host "Frontend em http://localhost:3000" -ForegroundColor Green
        Write-Host "Backend em http://localhost:4000" -ForegroundColor Green
    }
}

Write-Host "`n===========================================" -ForegroundColor Green
Write-Host "DV-7 Nexus está rodando!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

Write-Host "`nPressione qualquer tecla para fechar..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")