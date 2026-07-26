# Desplegar Campo v5.02 desde GitHub Codespaces

## Antes de actualizar

1. Abre la versión actual de Campo.
2. Descarga un respaldo JSON desde **Exportar y respaldo**.
3. Sube `campo-el-rosario-v5-02-deploy.zip` a la raíz del repositorio `campo-el-rosario` y confirma el archivo en `main`.

## Descomprimir, reemplazar, confirmar y hacer push

En la terminal de Codespaces, desde la raíz del repositorio, pega:

```bash
git pull --rebase origin main

rm -rf /tmp/campo-v5-02
mkdir -p /tmp/campo-v5-02

unzip -q campo-el-rosario-v5-02-deploy.zip -d /tmp/campo-v5-02

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name 'campo-el-rosario-v5-02-deploy.zip' \
  -exec rm -rf {} +

cp -a /tmp/campo-v5-02/. .

rm -rf /tmp/campo-v5-02
rm -f campo-el-rosario-v5-02-deploy.zip

git add -A
git commit -m "Deploy Campo v5.02"
git push origin main
```

Si Git responde `nothing to commit`, ejecuta solamente:

```bash
git push origin main
```

## Verificación

1. Abre **GitHub → Actions**.
2. Espera que `Deploy Campo v5.02 to GitHub Pages` tenga un check verde.
3. Abre:

```text
https://jmhm-intuit.github.io/campo-el-rosario/
```

Confirma que la interfaz muestre `Campo v5.02`. No borres los datos del sitio: allí se guardan los relevamientos locales.
