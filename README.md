# Campo El Rosario v8.02

Campo v8.02 refina **Living Herds** con una dinámica de movimiento inspirada en SimFarm y agrega un espacio seguro para cargar o eliminar los 16 meses de datos de muestra sin reemplazar El Rosario.

## Novedades principales

### Movimiento SimFarm

- Movimiento aproximadamente 25% más visible que en v8.01.
- Caminatas cortas, giros, pausas, pastoreo y descanso visual.
- Límite de animales que caminan simultáneamente para evitar movimiento caótico.
- Mayor actividad en el lote seleccionado y movimiento más calmo en el resto.
- Los animales permanecen visibles y conservan su identidad, posición y destino al hacer zoom o cambiar vistas.
- Modos disponibles: `Pausada`, `Suave` y `SimFarm`.
- `SimFarm` es el modo predeterminado.
- Se respeta `prefers-reduced-motion`.

### Tamaño uniforme

- Vaca, toro y ternero usan el mismo tamaño visual dentro de cada vista.
- Tamaño estándar del Resumen: 16 unidades del mapa.
- Tamaño estándar del Mapa: 18 unidades del mapa.
- La categoría se reconoce por la silueta, no por diferencias artificiales de escala.
- Se conserva la proporción aproximada de un sprite cada diez animales.

### Datos de muestra separados

- El Rosario y Muestra se guardan en espacios locales distintos.
- Usuarios existentes pueden instalar la muestra después de actualizar.
- Acciones disponibles: abrir, restablecer y eliminar la muestra.
- Eliminar la muestra no modifica los relevamientos reales.
- Instalaciones antiguas que tenían la muestra como base principal se migran de manera segura al espacio Muestra.

## Arquitectura

- `animal-animation.js`: agentes persistentes, estados, límites, obstáculos y modos de velocidad.
- `animal-sprite-library.js`: rutas, tamaños estándar y soporte futuro de frames reales.
- `app.js`: selección de espacios, interfaz, mapas y lógica operativa.

Los sprites actuales son imágenes direccionales estáticas. La biblioteca permite incorporar en el futuro secuencias reales para `walk`, `idle`, `graze` y `rest` sin modificar la lógica de movimiento.

## Persistencia

- El Rosario: `campo-el-rosario-v2`.
- Muestra: `campo-el-rosario-demo-v1`.
- Espacio activo: `campo-el-rosario-active-workspace-v1`.
- Los datos existentes se preservan al actualizar.

## Desarrollo local

```bash
python3 -m http.server 8080
```

Abrir `http://localhost:8080`.

## Validación

```bash
node --check app.js
node --check animal-animation.js
node --check animal-sprite-library.js
node scripts/preflight.mjs
node scripts/smoke.mjs
```
