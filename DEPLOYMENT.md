# Publishing Campo v10.01

Upload `campo-el-rosario-v10-01-deploy.zip` to the repository root, then run:

```bash
git pull --rebase origin main
rm -rf /tmp/campo-v10-01
mkdir -p /tmp/campo-v10-01
unzip -q campo-el-rosario-v10-01-deploy.zip -d /tmp/campo-v10-01
find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name 'campo-el-rosario-v10-01-deploy.zip' \
  -exec rm -rf {} +
cp -a /tmp/campo-v10-01/. .
rm -rf /tmp/campo-v10-01
rm -f campo-el-rosario-v10-01-deploy.zip
git add -A
git commit -m "Deploy Campo v10.01"
git push origin main
```

Wait for the GitHub Pages workflow and confirm the UI displays `Campo v10.01`.
