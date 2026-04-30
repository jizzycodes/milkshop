#!/usr/bin/env bash
set -euo pipefail

# Quick Debian deploy for Milkshop backend container.
# Usage:
#   chmod +x deploy/deploy-docker.sh
#   ./deploy/deploy-docker.sh
#
# Optional overrides:
#   APP_NAME=milkshop-backend IMAGE_NAME=milkshop-backend:latest PORT_MAP=4000:4000 ./deploy/deploy-docker.sh

APP_NAME="${APP_NAME:-milkshop-backend}"
IMAGE_NAME="${IMAGE_NAME:-milkshop-backend:latest}"
PORT_MAP="${PORT_MAP:-4000:4000}"
ENV_FILE="${ENV_FILE:-.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE in $(pwd)"
  echo "Create it first (copy from .env.example and fill values)."
  exit 1
fi

echo "[1/4] Building image: $IMAGE_NAME"
docker build -t "$IMAGE_NAME" .

echo "[2/4] Running DB migrations"
docker run --rm --env-file "$ENV_FILE" "$IMAGE_NAME" node server/db/run-migration.js

echo "[3/4] Restarting container: $APP_NAME"
if docker ps -a --format '{{.Names}}' | grep -q "^${APP_NAME}$"; then
  docker rm -f "$APP_NAME" >/dev/null 2>&1 || true
fi

echo "[4/4] Starting container"
docker run -d \
  --name "$APP_NAME" \
  --restart unless-stopped \
  --env-file "$ENV_FILE" \
  -p "$PORT_MAP" \
  "$IMAGE_NAME"

echo "Deploy complete."
docker ps --filter "name=${APP_NAME}"
