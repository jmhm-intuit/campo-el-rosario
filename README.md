# Campo El Rosario v8.01

Campo v8.01 añade una primera implementación de **rodeos vivos** utilizando exclusivamente los 64 sprites aéreos que ya formaban parte de la aplicación.

## Novedades principales

- Movimiento continuo de los animales dentro de su lote.
- Los sprites nunca se ocultan para simular la animación: permanecen visibles y cambian de posición.
- Dirección del sprite actualizada según la trayectoria: norte, este, sur u oeste.
- Posiciones estables por relevamiento y lote.
- Respeto de los límites de los polígonos y exclusión de las dos casas.
- Mayor actividad en el lote seleccionado y movimiento reducido en los demás.
- Zoom, arrastre, rueda y gesto táctil también en el mapa del Resumen.
- Botón para pausar o activar la animación.
- Respeto de `prefers-reduced-motion`.
- Los 16 meses de datos sintéticos continúan preestablecidos en instalaciones nuevas.
- Compatibilidad con todos los relevamientos, eventos y respaldos de v7.01.

## Arquitectura de sprites

La lógica se divide en dos archivos:

- `animal-animation.js`: movimiento, límites, estados y sincronización con el mapa.
- `animal-sprite-library.js`: resolución de archivos, escalas, velocidades y futura definición de frames.

La biblioteca actual usa imágenes direccionales estáticas. Cuando existan secuencias reales de caminata, pastoreo o reposo, podrán agregarse al objeto `states` sin reescribir el motor de movimiento.

## Datos

- Clave local conservada: `campo-el-rosario-v2`.
- Los datos existentes no se eliminan al actualizar.
- Las instalaciones nuevas cargan la muestra sintética de 16 meses.
- Los sprites representan aproximadamente diez animales y no identifican animales individuales.

## Desarrollo local

Servir la carpeta con cualquier servidor estático. Por ejemplo:

```bash
python3 -m http.server 8080
```

Después abrir `http://localhost:8080`.

## Validación

```bash
node --check app.js
node --check animal-animation.js
node --check animal-sprite-library.js
node scripts/preflight.mjs
node scripts/smoke.mjs
```
