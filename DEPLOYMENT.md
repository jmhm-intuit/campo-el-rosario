# Publishing Campo v9.02

Upload `campo-el-rosario-v9-02-deploy.zip` to the repository root, then run:

```bash
git pull --rebase origin main

rm -rf /tmp/campo-v9-02
mkdir -p /tmp/campo-v9-02

unzip -q campo-el-rosario-v9-02-deploy.zip -d /tmp/campo-v9-02

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name 'campo-el-rosario-v9-02-deploy.zip' \
  -exec rm -rf {} +

cp -a /tmp/campo-v9-02/. .

rm -rf /tmp/campo-v9-02
rm -f campo-el-rosario-v9-02-deploy.zip

git add -A
git commit -m "Deploy Campo v9.02"
git push origin main
```

After the push, wait for the GitHub Pages action to finish and confirm the UI displays `Campo v9.02`.

Before deploying, export a JSON backup. Do not clear browser site data because Campo keeps the operational database locally.
