# Changelog

## Campo v5.04 — 27 de julio de 2026

### Condición de los lotes

- Nueva paleta de alto contraste para **Muy bueno, Bueno, Regular, Malo y Anegado**.
- Texturas verdes, amarillas, terrosas y húmedas claramente diferenciadas.
- Se mantiene intacta la fotografía aérea fuera de los polígonos.
- Las condiciones estimadas continúan diferenciadas mediante menor intensidad y el símbolo `≈`.

### Indicadores del mapa

- Cada etiqueta de lote muestra ahora dos indicadores compactos y separados:
  - condición del terreno;
  - estado de carga animal.
- Se conserva una composición vertical compacta para ER-04, ER-05 y otros lotes angostos.
- Los bordes de carga continúan siendo secundarios respecto de la textura del lote.

### Animales

- Cuatro assets maestros en color caoba natural:
  - toro;
  - vaca;
  - vaca con ternero;
  - ternero/a.
- El mapa puede combinar distintas categorías visuales dentro de un mismo lote.
- Vacas y terneros pueden representarse como una unidad de vaca con cría, sin modificar los totales registrados.
- Doble contorno, sombra suave y sombra de suelo aplicados mediante SVG para conservar contraste sobre todos los fondos.

### Carga por lote

- Los lotes nuevos o vacíos abren con cuatro categorías sugeridas en valor `0`.
- Las categorías sugeridas se ordenan según su frecuencia histórica de uso.
- Cuando no existe suficiente historial se utilizan Vacas, Terneros/as, Toros y Vaquillonas.
- Las categorías pueden dejarse en cero, cambiarse, eliminarse o ampliarse.
- Solo se guardan las categorías con cantidad mayor que cero.

### Resumen

- Nueva tabla simplificada con los 18 lotes.
- Columnas de condición, carga, total de animales, vacas, terneros/as y toros.
- Acceso directo al lote desde cada fila.

### Compatibilidad

- Se mantiene la clave local `campo-el-rosario-v2`.
- Se mantiene la migración automática `Muy malo → Malo`.
- Nueva caché PWA `campo-v504-assets-1`.
