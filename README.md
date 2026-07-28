# Campo El Rosario v7.01

Aplicación web local-first para gestionar relevamientos, eventos del rodeo, lotes, carga animal, condición del terreno y lluvias de Laprida.

## Novedades de v7.01

- Registro detallado de ventas, compras, nacimientos, mortandad y recategorizaciones.
- Balance del rodeo entre relevamientos: stock anterior, eventos, esperado, observado y discrepancia.
- Nuevo relevamiento precargado desde la fotografía anterior más los eventos registrados.
- Categorías jerárquicas: Vacas, Vaquillonas, Terneros/as, Toros y Novillos.
- Resumen visual sin etiquetas: condición por terreno, carga por borde y stock por densidad de sprites.
- Mapa con zoom y centrado por lote; inicia en el lote seleccionado o ER-08/09.
- Evolución por lote con serie de carga, franja de condición y cronología de eventos.
- Tabla de lotes alineada y editable, incluida una versión móvil de una sola línea.
- Relevamientos editables, archivables y eliminables.
- Sección Introducción con guía de uso, novedades y hoja de ruta.
- Datos sintéticos Muestra de 16 meses y 52 eventos detallados.

## Persistencia

La aplicación conserva la clave de almacenamiento:

```text
campo-el-rosario-v2
```

Los datos existentes permanecen disponibles al actualizar desde la misma URL y navegador.

## Desarrollo y validación

```bash
node --check app.js
node scripts/preflight.mjs
node scripts/smoke.mjs
```

## Publicación

Consultar `DEPLOYMENT.md`.
