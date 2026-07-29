# Publicación de Campo v8.01

## Archivo a subir

Subir a la raíz del repositorio:

```text
campo-el-rosario-v8-01-deploy.zip
```

## Codespaces: descomprimir, confirmar y hacer push

```bash
git pull --rebase origin main

rm -rf /tmp/campo-v8-01
mkdir -p /tmp/campo-v8-01

unzip -q campo-el-rosario-v8-01-deploy.zip -d /tmp/campo-v8-01

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name 'campo-el-rosario-v8-01-deploy.zip' \
  -exec rm -rf {} +

cp -a /tmp/campo-v8-01/. .

rm -rf /tmp/campo-v8-01
rm -f campo-el-rosario-v8-01-deploy.zip

git add -A
git commit -m "Deploy Campo v8.01"
git push origin main
```

## Verificación

1. Abrir **GitHub → Actions**.
2. Esperar el check verde de **Deploy Campo v8.01 to GitHub Pages**.
3. Abrir `https://jmhm-intuit.github.io/campo-el-rosario/`.
4. Verificar que la interfaz muestre `Campo v8.01`.
5. Confirmar que el mapa del Resumen tenga controles de zoom y un botón de pausa/reproducción.

Antes de actualizar, exportar un respaldo JSON de los datos actuales. No borrar los datos del sitio del navegador.
