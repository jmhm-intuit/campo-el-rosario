#!/usr/bin/env bash
set -euo pipefail

ZIP_NAME="campo-el-rosario-v5-03-deploy.zip"
TMP_DIR="$(mktemp -d /tmp/campo-v5-03.XXXXXX)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

if [ ! -f "$ZIP_NAME" ]; then
  echo "No se encontro $ZIP_NAME en la raiz del repositorio."
  exit 1
fi

git pull --rebase origin main
unzip -q "$ZIP_NAME" -d "$TMP_DIR"

if [ ! -f "$TMP_DIR/index.html" ]; then
  echo "El ZIP no contiene index.html en su raiz."
  exit 1
fi

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name "$ZIP_NAME" \
  ! -name 'deploy-v5-03.sh' \
  ! -name 'campo-v5-03-unzip-push.sh' \
  -exec rm -rf {} +

cp -a "$TMP_DIR"/. .
rm -f "$ZIP_NAME"

git add -A
if git diff --cached --quiet; then
  echo "No hay cambios nuevos para confirmar."
else
  git commit -m "Deploy Campo v5.03"
fi

git push origin main

echo "Campo v5.03 enviado a main. Revisa GitHub Actions para confirmar el despliegue."
