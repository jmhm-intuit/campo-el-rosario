# Desplegar Campo v5.04 desde GitHub Codespaces

Sube `campo-el-rosario-v5-04-deploy.zip` a la raíz del repositorio y confírmalo en `main`.

Después ejecuta en la terminal:

```bash
git pull --rebase origin main

rm -rf /tmp/campo-v5-04
mkdir -p /tmp/campo-v5-04

unzip -q campo-el-rosario-v5-04-deploy.zip -d /tmp/campo-v5-04

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name 'campo-el-rosario-v5-04-deploy.zip' \
  -exec rm -rf {} +

cp -a /tmp/campo-v5-04/. .

rm -rf /tmp/campo-v5-04
rm -f campo-el-rosario-v5-04-deploy.zip

git add -A
git commit -m "Deploy Campo v5.04"
git push origin main
```

Si Git responde `nothing to commit`, ejecuta solamente:

```bash
git push origin main
```

Después revisa **GitHub → Actions** y espera que `Deploy Campo v5.04 to GitHub Pages` tenga un check verde.

La aplicación seguirá disponible en:

```text
https://jmhm-intuit.github.io/campo-el-rosario/
```

Confirma que la interfaz muestre `Campo v5.04`. No borres los datos del sitio: allí se guardan los relevamientos locales.
