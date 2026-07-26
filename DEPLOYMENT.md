# Publicar Campo V5 en la URL actual

## Antes de actualizar

1. Abrí la versión actual de Campo.
2. Entrá en **Exportar y respaldo**.
3. Descargá un respaldo JSON.

V5 mantiene la misma clave local, por lo que los datos deberían conservarse al publicar en la misma URL. El respaldo es una medida adicional de seguridad.

## Desde un teléfono con GitHub Codespaces

1. Descargá `campo-el-rosario-v5-deploy.zip`.
2. Subilo a la raíz de `jmhm-intuit/campo-el-rosario` y confirmá el upload en `main`.
3. Abrí **Code → Codespaces**.
4. Desde la raíz del repositorio, ejecutá:

```bash
mkdir -p /tmp/campo-v5
unzip -q campo-el-rosario-v5-deploy.zip -d /tmp/campo-v5
find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name 'campo-el-rosario-v5-deploy.zip' \
  -exec rm -rf {} +
cp -a /tmp/campo-v5/. .
rm -rf /tmp/campo-v5
rm campo-el-rosario-v5-deploy.zip

git add -A
git commit -m "Upgrade Campo to V5"
git push origin main
```

5. Abrí **Actions** y esperá el check verde de **Deploy Campo V5 to GitHub Pages**.
6. Abrí la URL habitual:

```text
https://jmhm-intuit.github.io/campo-el-rosario/
```

## Cómo confirmar que se publicó V5

En la UI deben aparecer:

```text
Campo v5.0.0
Datos: <fecha del último relevamiento>
```

Si todavía aparece la versión anterior, cerrá la pestaña y abrí nuevamente la URL. No borres los datos del sitio.
