#!/bin/bash

# ============================================
# Uber Clone - Pre-Deployment Verification
# ============================================

echo "🚗 Uber Clone - Verificación Pre-Deployment"
echo "============================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Check if .env file exists in Backend
echo "📁 Verificando archivos de configuración..."

if [ -f "Backend/.env" ]; then
    echo -e "${GREEN}✓${NC} Backend/.env existe"
    
    # Check required variables
    if grep -q "DB_CONNECT=" Backend/.env && ! grep -q "DB_CONNECT=$" Backend/.env; then
        echo -e "${GREEN}  ✓${NC} DB_CONNECT configurado"
    else
        echo -e "${RED}  ✗${NC} DB_CONNECT no configurado"
        ERRORS=$((ERRORS+1))
    fi
    
    if grep -q "GOOGLE_MAPS_API=" Backend/.env && ! grep -q "GOOGLE_MAPS_API=$" Backend/.env; then
        echo -e "${GREEN}  ✓${NC} GOOGLE_MAPS_API configurado"
    else
        echo -e "${RED}  ✗${NC} GOOGLE_MAPS_API no configurado"
        ERRORS=$((ERRORS+1))
    fi
    
    if grep -q "JWT_SECRET=" Backend/.env && ! grep -q "JWT_SECRET=$" Backend/.env; then
        echo -e "${GREEN}  ✓${NC} JWT_SECRET configurado"
    else
        echo -e "${RED}  ✗${NC} JWT_SECRET no configurado"
        ERRORS=$((ERRORS+1))
    fi
else
    echo -e "${YELLOW}!${NC} Backend/.env no existe (se configurará en Render)"
fi

echo ""

if [ -f "frontend/.env" ] || [ -f "frontend/.env.local" ]; then
    ENV_FILE="frontend/.env"
    [ -f "frontend/.env.local" ] && ENV_FILE="frontend/.env.local"
    
    echo -e "${GREEN}✓${NC} Frontend env file existe ($ENV_FILE)"
    
    if grep -q "VITE_BASE_URL=" $ENV_FILE && ! grep -q "VITE_BASE_URL=$" $ENV_FILE; then
        echo -e "${GREEN}  ✓${NC} VITE_BASE_URL configurado"
    else
        echo -e "${YELLOW}  !${NC} VITE_BASE_URL no configurado (necesario para producción)"
    fi
    
    if grep -q "VITE_GOOGLE_MAPS_API_KEY=" $ENV_FILE && ! grep -q "VITE_GOOGLE_MAPS_API_KEY=$" $ENV_FILE; then
        echo -e "${GREEN}  ✓${NC} VITE_GOOGLE_MAPS_API_KEY configurado"
    else
        echo -e "${RED}  ✗${NC} VITE_GOOGLE_MAPS_API_KEY no configurado"
        ERRORS=$((ERRORS+1))
    fi
else
    echo -e "${YELLOW}!${NC} Frontend .env no existe (se configurará en Vercel)"
fi

echo ""
echo "📦 Verificando package.json..."

# Check backend package.json
if [ -f "Backend/package.json" ]; then
    if grep -q '"start"' Backend/package.json; then
        echo -e "${GREEN}✓${NC} Backend tiene script 'start'"
    else
        echo -e "${RED}✗${NC} Backend no tiene script 'start'"
        ERRORS=$((ERRORS+1))
    fi
fi

# Check frontend package.json
if [ -f "frontend/package.json" ]; then
    if grep -q '"build"' frontend/package.json; then
        echo -e "${GREEN}✓${NC} Frontend tiene script 'build'"
    else
        echo -e "${RED}✗${NC} Frontend no tiene script 'build'"
        ERRORS=$((ERRORS+1))
    fi
fi

echo ""
echo "🔍 Verificando dependencias..."

# Check if node_modules exists or if we should install
if [ -d "Backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend node_modules existe"
else
    echo -e "${YELLOW}!${NC} Backend node_modules no existe (se instalará en deploy)"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend node_modules existe"
else
    echo -e "${YELLOW}!${NC} Frontend node_modules no existe (se instalará en deploy)"
fi

echo ""
echo "============================================"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Todo listo para deployment!${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. Sube el código a GitHub"
    echo "2. Despliega el Backend en Render"
    echo "3. Despliega el Frontend en Vercel"
    echo "4. Configura las variables de entorno"
else
    echo -e "${RED}❌ Se encontraron $ERRORS errores${NC}"
    echo "Por favor corrige los errores antes de continuar."
fi

echo ""
