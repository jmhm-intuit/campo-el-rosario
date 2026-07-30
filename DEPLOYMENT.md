# Publishing Campo v9.01

## File to upload

Upload this file to the repository root:

```text
campo-el-rosario-v9-01-deploy.zip
```

## Codespaces: unzip, commit and push

```bash
git pull --rebase origin main

rm -rf /tmp/campo-v9-01
mkdir -p /tmp/campo-v9-01

unzip -q campo-el-rosario-v9-01-deploy.zip -d /tmp/campo-v9-01

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name 'campo-el-rosario-v9-01-deploy.zip' \
  -exec rm -rf {} +

cp -a /tmp/campo-v9-01/. .

rm -rf /tmp/campo-v9-01
rm -f campo-el-rosario-v9-01-deploy.zip

git add -A
git commit -m "Deploy Campo v9.01"
git push origin main
```

If Git reports `nothing to commit`, run only:

```bash
git push origin main
```

## Verification

1. Open **GitHub → Actions**.
2. Wait for **Deploy Campo v9.01 to GitHub Pages** to finish with a green check.
3. Open `https://jmhm-intuit.github.io/campo-el-rosario/`.
4. Confirm that the UI displays `Campo v9.01`.
5. Confirm that Inicio, Registrar, Revisar and Mapa appear in the phone navigation.
6. Open Revisar and validate Campo, Rodeo and Balance tabs.
7. Start a Quick Review and confirm that projected values are preloaded.
8. Confirm that existing El Rosario data and the separate Muestra workspace remain available.

Before updating, export a JSON backup of El Rosario. Do not clear browser site data after deployment.
