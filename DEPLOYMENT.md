# Publicación de Campo v8.02

## Archivo a subir

Subir a la raíz del repositorio:

```text
campo-el-rosario-v8-02-deploy.zip
```

## Codespaces: descomprimir, confirmar y hacer push

```bash
git pull --rebase origin main

rm -rf /tmp/campo-v8-02
mkdir -p /tmp/campo-v8-02

unzip -q campo-el-rosario-v8-02-deploy.zip -d /tmp/campo-v8-02

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name 'campo-el-rosario-v8-02-deploy.zip' \
  -exec rm -rf {} +

cp -a /tmp/campo-v8-02/. .

rm -rf /tmp/campo-v8-02
rm -f campo-el-rosario-v8-02-deploy.zip

git add -A
git commit -m "Deploy Campo v8.02"
git push origin main
```

## Verificación

1. Abrir **GitHub → Actions**.
2. Esperar el check verde de **Deploy Campo v8.02 to GitHub Pages**.
3. Abrir `https://jmhm-intuit.github.io/campo-el-rosario/`.
4. Verificar que la interfaz muestre `Campo v8.02`.
5. En Mapa, confirmar que el modo predeterminado sea `SimFarm`.
6. En Datos y configuración, confirmar las acciones de Muestra.

Antes de actualizar, exportar un respaldo JSON de El Rosario. No borrar los datos del sitio del navegador.
