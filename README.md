# Campo El Rosario v5.02

Aplicación web local-first para registrar relevamientos de ganado, condición de los lotes y lluvia de **El Rosario**.

## Novedades principales

- Edición de relevamientos existentes y navegación cronológica desde el más reciente.
- Edición directa de cada lote desde el mapa.
- Registro de lotes observados con cero animales.
- Condiciones observadas, estimadas y sin información.
- Estimación de condición por registro reciente, historial estacional y condición general del campo.
- Texturas visibles dentro de los polígonos sin oscurecer el paisaje exterior.
- Carga animal independiente, comunicada con bordes y halos sutiles.
- Etiquetas adaptativas para lotes angostos como ER-04 y ER-05.
- Registro diario opcional de lluvia, distinguiendo `0 mm` de ausencia de información.
- Versión del código y fecha de datos visibles en la interfaz.

## Datos locales

La aplicación conserva los datos en el navegador con la clave histórica:

```text
campo-el-rosario-v2
```

Abrir la misma URL en otro dispositivo no sincroniza la información. Antes de actualizar, conviene descargar un respaldo JSON desde la aplicación.

## Validación local

```bash
node --check app.js
node scripts/preflight.mjs
node scripts/smoke.mjs
```

## Publicación

Consulta [DEPLOYMENT.md](DEPLOYMENT.md) para actualizar GitHub Pages desde el teléfono mediante GitHub Codespaces.
