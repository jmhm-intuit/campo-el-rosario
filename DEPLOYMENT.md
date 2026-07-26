# Publicar Campo V4 en la URL actual

## Desde GitHub Codespaces

1. Descargá `campo-el-rosario-v4-deploy.zip`.
2. Subilo a la raíz del repositorio `jmhm-intuit/campo-el-rosario`.
3. Abrí un Codespace sobre la rama `main`.
4. En la terminal, desde la raíz del repositorio, ejecutá:

```bash
mkdir -p /tmp/campo-v4
unzip -q campo-el-rosario-v4-deploy.zip -d /tmp/campo-v4
find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name 'campo-el-rosario-v4-deploy.zip' \
  -exec rm -rf {} +
cp -a /tmp/campo-v4/. .
rm -rf /tmp/campo-v4 campo-el-rosario-v4-deploy.zip
git add -A
git commit -m "Upgrade Campo to V4"
git push origin main
```

5. Abrí **Actions** y esperá que finalice **Deploy Campo V4 to GitHub Pages**.
6. Abrí la misma URL de GitHub Pages.

## Conservación de datos

V4 mantiene la misma clave local de V2 y V3. Reemplazar los archivos en la misma URL no elimina los relevamientos guardados.

Antes de publicar, descargá igualmente un respaldo JSON desde **Exportar y respaldo**. No borres los datos del sitio después de la actualización.
