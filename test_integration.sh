#!/bin/bash
# DV-7 Nexus - Script de Teste de Integração
# Este script testa a integração completa entre frontend e backend

echo "🔬 Testando Integração DV-7 Nexus"
echo "=================================="

# Verificar se o backend está rodando
echo "🔍 Verificando backend..."

if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    echo "✅ Backend rodando em http://localhost:3000"
    BACKEND_OK=true
else
    echo "❌ Backend não respondendo"
    BACKEND_OK=false
fi

# Verificar se o frontend está rodando
echo "🔍 Verificando frontend..."

if curl -f http://localhost:5173/ >/dev/null 2>&1; then
    echo "✅ Frontend rodando em http://localhost:5173"
    FRONTEND_OK=true
else
    echo "❌ Frontend não respondendo"
    FRONTEND_OK=false
fi

echo ""

if [ "$BACKEND_OK" = true ]; then
    echo "🧪 Testando endpoints do backend..."
    
    # Testar tRPC endpoint
    echo "📡 Testando tRPC endpoints..."
    if curl -f -X POST http://localhost:3000/api/trpc/health.check \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","method":"GET","params":[],"id":1}' >/dev/null 2>&1; then
        echo "✅ Endpoint tRPC acessível"
        TRPC_OK=true
    else
        echo "❌ Endpoint tRPC inacessível"
        TRPC_OK=false
    fi
    
    # Testar autenticação
    echo "🔒 Testando autenticação..."
    if curl -f -X GET http://localhost:3000/api/trpc/auth.me \
        -H "Content-Type: application/json" \
        --data-binary '{"0":{},"_root":{"json":"{\"queries\":[[\"auth\",\"me\",\"{}\"]]}}}' >/dev/null 2>&1; then
        echo "✅ Endpoint de autenticação acessível"
        AUTH_OK=true
    else
        echo "⚠️ Endpoint de autenticação inacessível (pode ser normal sem sessão)"
        AUTH_OK=false
    fi
    
    echo ""
fi

# Testar comunicação entre frontend e backend
if [ "$BACKEND_OK" = true ] && [ "$FRONTEND_OK" = true ]; then
    echo "🔄 Testando comunicação frontend-backend..."
    
    # Tenta obter informações do backend via frontend (proxy ou direto)
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        echo "✅ Comunicação direta backend funcionando"
        DIRECT_COMM_OK=true
    else
        echo "⚠️ Comunicação direta backend falhou (normal em produção)"
        DIRECT_COMM_OK=false
    fi
    
    # Testar se o frontend pode acessar a API tRPC via proxy
    if curl -f http://localhost:5173/api/trpc/health.check >/dev/null 2>&1; then
        echo "✅ Proxy frontend-API funcionando"
        PROXY_COMM_OK=true
    else
        echo "⚠️ Proxy frontend-API falhou (pode usar CORS direto)"
        PROXY_COMM_OK=false
    fi
    
    echo ""
fi

# Testar integração de vídeo (DV-7 Nexus Core)
if [ "$BACKEND_OK" = true ]; then
    echo "🎬 Testando módulo DV-7 Nexus (processamento de vídeo)..."
    
    # Testar capacidade de capturar vídeo (simulando com URL de exemplo)
    echo "📡 Testando captura de vídeo..."
    if curl -f -X POST http://localhost:3000/api/trpc/videos.submit \
        -H "Content-Type: application/json" \
        --data-binary '{"0":{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","targetLanguage":"en-US"},"_root":{"json":"{\"queries\":[[\"videos\",\"submit\",{\"input\":{\"url\":\"https://www.youtube.com/watch?v=dQw4w9WgXcQ\",\"targetLanguage\":\"en-US\"}}]]}}' >/dev/null 2>&1; then
        echo "✅ Endpoint de submissão de vídeo acessível"
        VIDEO_SUBMIT_OK=true
    else
        echo "⚠️ Endpoint de submissão de vídeo falhou (pode precisar de autenticação)"
        VIDEO_SUBMIT_OK=false
    fi
    
    echo ""
fi

echo "📋 RELATÓRIO DE INTEGRAÇÃO"
echo "=========================="

echo "Backend: $([ "$BACKEND_OK" = true ] && echo '✅' || echo '❌')"
echo "Frontend: $([ "$FRONTEND_OK" = true ] && echo '✅' || echo '❌')"
echo "tRPC: $([ "$TRPC_OK" = true ] && echo '✅' || echo '❌')"
echo "Autenticação: $([ "$AUTH_OK" = true ] && echo '✅' || echo '❌')"
echo "Comunicação direta: $([ "$DIRECT_COMM_OK" = true ] && echo '✅' || echo '❌')"
echo "Proxy API: $([ "$PROXY_COMM_OK" = true ] && echo '✅' || echo '❌')"
echo "Processamento de vídeo: $([ "$VIDEO_SUBMIT_OK" = true ] && echo '✅' || echo '❌')"

echo ""
echo "🎯 STATUS DA INTEGRAÇÃO:"
if [ "$BACKEND_OK" = true ] && [ "$FRONTEND_OK" = true ]; then
    echo "🟢 Sistema integrado está funcionando!"
    
    if [ "$VIDEO_SUBMIT_OK" = true ]; then
        echo "🚀 DV-7 Nexus Core (módulo de vídeo) está integrado!"
    else
        echo "🟡 DV-7 Nexus Core precisa de autenticação ou ainda está em desenvolvimento"
    fi
else
    echo "🔴 Sistema não está completamente integrado"
fi

echo ""
echo "💡 PRÓXIMOS PASSOS:"
if [ "$BACKEND_OK" = false ]; then
    echo "  - Iniciar backend com: cd ~/dv7-nexus/backend && npm run dev"
fi

if [ "$FRONTEND_OK" = false ]; then
    echo "  - Iniciar frontend com: cd ~/dv7-nexus/frontend && npm run dev"
fi

if [ "$VIDEO_SUBMIT_OK" = false ]; then
    echo "  - Configurar autenticação para testes de vídeo"
    echo "  - Testar fluxo completo de processamento DV-7 Nexus"
fi

echo "  - Executar testes automatizados: npm test em ambos os diretórios"