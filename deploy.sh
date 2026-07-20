#!/usr/bin/env bash
# Deploy Atmos Clima em /opt/atmosclima (Docker)
# Uso na VPS:
#   cd /opt/atmosclima && bash deploy.sh
#
# Ou o fluxo padrão dos outros projetos:
#   git pull && docker-compose build && docker-compose down && docker-compose up -d && docker builder prune -f

set -euo pipefail

APP_DIR="/opt/atmosclima"
REPO="https://github.com/korgloriws/atmosclima.git"
PORT="3030"

echo "==> Atmos Clima deploy (Docker) → ${APP_DIR} :${PORT}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker não encontrado."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1 && ! command -v docker-compose >/dev/null 2>&1; then
  echo "docker-compose não encontrado."
  exit 1
fi

COMPOSE="docker compose"
if ! docker compose version >/dev/null 2>&1; then
  COMPOSE="docker-compose"
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

echo "==> Build + restart..."
${COMPOSE} build
${COMPOSE} down
${COMPOSE} up -d
docker builder prune -f

echo ""
echo " Atmos Clima no ar: http://31.97.167.75:${PORT}/"
echo "   Admin: http://31.97.167.75:${PORT}/afiliados/admin"
