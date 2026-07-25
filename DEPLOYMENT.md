# Publicar Campo V2

## GitHub Pages desde el teléfono

1. Creá o abrí el repositorio `campo-el-rosario`.
2. Reemplazá los archivos de V1 por el contenido de este paquete.
3. Confirmá que `index.html`, `app.js`, `styles.css` y la carpeta `assets` estén en la raíz.
4. Entrá en **Settings → Pages**.
5. En **Build and deployment**, seleccioná **GitHub Actions**.
6. Abrí **Actions → Deploy Campo V2 to GitHub Pages** y ejecutá **Run workflow**.

La URL existente se actualizará cuando finalice el workflow.

## Vercel

Este proyecto es completamente estático. Puede importarse desde GitHub sin comando de compilación ni carpeta de salida especial.

## Actualización sin perder datos

La V2 usa una clave local diferente (`campo-el-rosario-v2`). Los datos de la V1 no se migran automáticamente. Antes de reemplazar una versión con datos reales, exportá un respaldo desde la aplicación.
