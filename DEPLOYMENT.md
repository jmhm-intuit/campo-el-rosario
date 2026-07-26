# Actualizar Campo a v5.01 desde GitHub Codespaces

1. Subí `campo-el-rosario-v5-01-deploy.zip` a la raíz del repositorio.
2. Abrí Codespaces y ejecutá:

```bash
rm -rf /tmp/campo-v501
mkdir -p /tmp/campo-v501

unzip -q campo-el-rosario-v5-01-deploy.zip -d /tmp/campo-v501

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name 'campo-el-rosario-v5-01-deploy.zip' \
  -exec rm -rf {} +

cp -a /tmp/campo-v501/. .

rm -rf /tmp/campo-v501
rm campo-el-rosario-v5-01-deploy.zip

git add -A
git commit -m "Deploy Campo v5.01"
git push origin main
```

3. Abrí **Actions** y esperá el check verde de `Deploy Campo v5.01 to GitHub Pages`.
4. Abrí la misma URL de la aplicación.

Antes de actualizar, exportá un respaldo JSON desde la versión online. No borres los datos del sitio: la aplicación conserva la misma clave local para migrar los relevamientos existentes.
