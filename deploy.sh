#!/usr/bin/env bash
# Deploy Atmos Clima em /opt/atmosclima (VPS)
# Uso (na VPS, como root):
#   curl -fsSL https://raw.githubusercontent.com/korgloriws/atmosclima/main/deploy.sh | bash
# ou, após clonar:
#   bash /opt/atmosclima/deploy.sh

set -euo pipefail

APP_DIR="/opt/atmosclima"
REPO="https://github.com/korgloriws/atmosclima.git"
PORT="3030"

echo "==> Atmos Clima deploy → ${APP_DIR} :${PORT}"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js não encontrado. Instale Node 20+ antes."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm não encontrado."
  exit 1
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "==> Instalando PM2 globalmente..."
  npm install -g pm2
fi

if [ -d "${APP_DIR}/.git" ]; then
  echo "==> Atualizando repositório..."
  cd "${APP_DIR}"
  git fetch origin
  git reset --hard origin/main
else
  echo "==> Clonando repositório..."
  mkdir -p "$(dirname "${APP_DIR}")"
  git clone "${REPO}" "${APP_DIR}"
  cd "${APP_DIR}"
fi

echo "==> Instalando dependências..."
npm ci

echo "==> Build de produção..."
npm run build

echo "==> Reiniciando com PM2..."
if pm2 describe atmosclima >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
fi

pm2 save

echo ""
echo "✅ Atmos Clima no ar: http://$(hostname -I | awk '{print $1}'):${PORT}/"
echo "   Local: http://127.0.0.1:${PORT}/"
echo "   Admin: http://127.0.0.1:${PORT}/afiliados/admin"
