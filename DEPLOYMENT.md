# Publicar Campo v7.01 desde el teléfono

## 1. Respaldo

Antes de actualizar, abrir la versión actual de Campo y descargar un respaldo JSON.

## 2. Subir el ZIP

Subir `campo-el-rosario-v7-01-deploy.zip` a la raíz del repositorio `jmhm-intuit/campo-el-rosario` y confirmar el archivo en `main`.

## 3. Abrir Codespaces

Abrir el repositorio, seleccionar **Code → Codespaces** y abrir la terminal en la raíz.

## 4. Descomprimir, reemplazar y publicar

```bash
git pull --rebase origin main

rm -rf /tmp/campo-v7-01
mkdir -p /tmp/campo-v7-01

unzip -q campo-el-rosario-v7-01-deploy.zip -d /tmp/campo-v7-01

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name 'campo-el-rosario-v7-01-deploy.zip' \
  -exec rm -rf {} +

cp -a /tmp/campo-v7-01/. .

rm -rf /tmp/campo-v7-01
rm -f campo-el-rosario-v7-01-deploy.zip

git add -A
git commit -m "Deploy Campo v7.01"
git push origin main
```

## 5. Verificar

- Abrir GitHub → Actions.
- Esperar el check verde de `Deploy Campo v7.01 to GitHub Pages`.
- Abrir `https://jmhm-intuit.github.io/campo-el-rosario/`.
- Confirmar que la interfaz muestra `Campo v7.01`.

No borrar los datos del sitio: los relevamientos permanecen almacenados localmente en ese navegador.
