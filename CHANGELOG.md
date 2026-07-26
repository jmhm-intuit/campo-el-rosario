# Changelog

## Campo v5.03 — 26 de julio de 2026

### Condición del lote

- La visualización se simplifica a cinco estados: Muy bueno, Bueno, Regular, Malo y Anegado.
- Los registros históricos con `Muy malo` se convierten automáticamente a `Malo` al cargarse.
- Se incorporan cinco texturas nuevas de 768 × 768 px.
- Las texturas evitan lagunas, rocas grandes y centros visuales que hagan evidente el mosaico.
- El patrón usa una escala mayor y una orientación determinística distinta por lote.
- Las condiciones estimadas mantienen menor intensidad y el indicador `≈`.
- `Sin información` sigue siendo un estado de origen de datos, no una sexta condición del terreno.

### Animales y contraste

- Cada animal incorpora una sombra elíptica suave debajo del sprite.
- Se aplica un contorno crema fino y una sombra oscura para conservar lectura sobre verde, tierra y barro.
- La intensidad de las texturas se ajusta para que el ganado siga siendo el elemento principal de ocupación.

### Iconografía

- Se reemplaza el icono anterior de Registrar animales por una marca compacta de vaca + símbolo `+`.
- La misma composición se utiliza en navegación, bienvenida, estados vacíos y formularios.
- Se incluyen exportaciones de 24, 32, 48 y 256 px con fondo transparente.

### Compatibilidad

- Se mantiene la clave local `campo-el-rosario-v2`.
- Se mantiene la geometría revisada de los 18 lotes y las 1.735 hectáreas.
- Se conserva toda la funcionalidad de edición directa, relevamientos históricos, lotes sin animales y lluvia diaria.
- Nueva caché PWA `campo-v503-assets-1`.
