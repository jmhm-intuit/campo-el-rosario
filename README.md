# Campo — El Rosario V5

Aplicación web local-first para registrar relevamientos de ganado por lote y visualizar carga animal, condición del campo y lluvia sobre el mapa de El Rosario.

## Mejoras principales de V5

- Sustituye la geometría anterior por los polígonos revisados sobre el fondo maestro de `1154 × 1363 px`.
- Usa la condición del campo como textura semitransparente dentro de cada lote.
- Usa el borde del lote para mostrar la carga animal en EV/ha.
- Representa el rodeo con sprites Red Angus vistos desde arriba, distribuidos según la cantidad y las categorías realmente cargadas.
- Mantiene visibles la casa principal de ER-08/09 y la casa secundaria de ER-13.
- Incorpora la nueva familia de iconos KPI.
- Muestra `Campo v5.0.0` y la fecha del último relevamiento en la interfaz.
- Mantiene el proceso de relevamiento simple: fecha, lluvia, lotes que se quieran cargar, revisión final y guardado.
- Los lotes pueden quedar sin cargar y el estado del campo sigue siendo opcional.
- Cualquier diferencia de uno o más animales se informa al final, sin bloquear el guardado.
- Conserva los datos locales de V2–V4 porque mantiene la clave `campo-el-rosario-v2`.

## Orden de capas del mapa

1. Fondo aéreo maestro.
2. Textura de condición del campo.
3. Borde de carga animal.
4. Animales.
5. Casas permanentes.
6. Áreas interactivas, nombres y valores.

Todas las capas usan el mismo `viewBox="0 0 1154 1363"`.

## Validación

```bash
node --check app.js
node scripts/preflight.mjs
node scripts/smoke.mjs
```

## Uso local

No requiere compilación:

```bash
python3 -m http.server 8080
```

Luego abrí `http://localhost:8080`.

## Persistencia

Los datos se guardan en el navegador. Publicar V5 en la misma URL no elimina los relevamientos existentes. Antes de actualizar, es recomendable exportar un respaldo JSON desde **Exportar y respaldo**.
