# Despliegue de Campo v6.01

## Archivo requerido

Subir `campo-el-rosario-v6-01-deploy.zip` a la raíz del repositorio.

## Codespaces

```bash
git pull --rebase origin main

rm -rf /tmp/campo-v6-01
mkdir -p /tmp/campo-v6-01

unzip -q campo-el-rosario-v6-01-deploy.zip -d /tmp/campo-v6-01

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name 'campo-el-rosario-v6-01-deploy.zip' \
  -exec rm -rf {} +

cp -a /tmp/campo-v6-01/. .

rm -rf /tmp/campo-v6-01
rm -f campo-el-rosario-v6-01-deploy.zip

git add -A
git commit -m "Deploy Campo v6.01"
git push origin main
```

Después, revisar GitHub → Actions y esperar el check verde del workflow **Deploy Campo v6.01 to GitHub Pages**.

## Importante

- No borrar los datos del sitio en el navegador.
- Se recomienda exportar un respaldo JSON antes del despliegue.
- La banda mensual y acumulada P10–P90 es una referencia aproximada obtenida sumando las quincenas históricas.
