# Campo El Rosario v5.01

Aplicación local-first para relevamientos ganaderos, condición de lotes, carga animal y lluvia.

## Mejoras de v5.01

- Edición de relevamientos existentes sin crear duplicados.
- Selector global de relevamientos agrupados por mes y ordenados del más reciente al más antiguo.
- Reordenamiento automático si se cambia la fecha de un relevamiento histórico.
- Texturas de alta definición para la condición del lote.
- Condición del lote y carga animal representadas como variables independientes:
  - fondo y textura: condición;
  - borde y halo exterior: carga animal.
- Etiquetas de lote con mejor jerarquía para nombre, cabezas y EV/ha.
- Un sprite por cada 30 animales, con un máximo de ocho por lote.
- Un único tipo visual por lote, definido por la categoría dominante.
- Assets laterales de Aberdeen Angus colorada para mapa y paneles.
- KPI de existencias con vaca y KPI de nacimientos con vaca y cría.
- Campo `v5.01` y fecha del relevamiento seleccionado visibles en la interfaz.
- Conservación de la clave local `campo-el-rosario-v2` para mantener los datos existentes.

## Validación

```bash
node --check app.js
node scripts/preflight.mjs
node scripts/smoke.mjs
```

## Publicación

El contenido del paquete de despliegue debe quedar en la raíz del repositorio de GitHub Pages. El workflow incluido valida y publica automáticamente con cada `push` a `main`.
