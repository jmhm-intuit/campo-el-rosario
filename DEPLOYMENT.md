# Desplegar Campo v5.03 desde GitHub Codespaces

## Antes de actualizar

1. Abre la versión actual de Campo.
2. Descarga un respaldo JSON desde **Exportar y respaldo**.
3. Sube estos dos archivos a la raíz del repositorio:
   - `campo-el-rosario-v5-03-deploy.zip`
   - `campo-v5-03-unzip-push.sh`

## Opción recomendada: script automático

En la terminal de Codespaces, desde la raíz del repositorio:

```bash
chmod +x campo-v5-03-unzip-push.sh
./campo-v5-03-unzip-push.sh
```

El script hace `git pull`, descomprime el ZIP, reemplaza la versión anterior, crea el commit y hace push a `main`.

## Bloque manual equivalente

```bash
git pull --rebase origin main

rm -rf /tmp/campo-v5-03
mkdir -p /tmp/campo-v5-03

unzip -q campo-el-rosario-v5-03-deploy.zip -d /tmp/campo-v5-03

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name 'campo-el-rosario-v5-03-deploy.zip' \
  ! -name 'campo-v5-03-unzip-push.sh' \
  -exec rm -rf {} +

cp -a /tmp/campo-v5-03/. .
rm -rf /tmp/campo-v5-03
rm -f campo-el-rosario-v5-03-deploy.zip

git add -A
git commit -m "Deploy Campo v5.03"
git push origin main
```

Si Git responde `nothing to commit`, ejecuta solamente:

```bash
git push origin main
```

## Verificación

1. Abre **GitHub → Actions**.
2. Espera que `Deploy Campo v5.03 to GitHub Pages` tenga un check verde.
3. Abre:

```text
https://jmhm-intuit.github.io/campo-el-rosario/
```

Confirma que la interfaz muestre `Campo v5.03`. No borres los datos del sitio: allí se guardan los relevamientos locales.
