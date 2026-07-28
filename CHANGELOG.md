# Changelog — Campo v7.01

## Gestión del rodeo

- Nuevo módulo Eventos con ventas, compras, nacimientos, mortandad y recategorizaciones.
- Registro transaccional por fecha, lote, categoría y cantidad.
- Campos comerciales opcionales para compras y ventas.
- Controles de stock disponible para ventas, mortandad y recategorizaciones.
- CSV independiente de eventos.

## Balance y relevamientos

- Balance del rodeo entre fotografías: anterior + eventos = esperado vs. observado.
- Discrepancia total y por categoría.
- El siguiente relevamiento se precarga usando el último relevamiento y los eventos posteriores.
- La discrepancia se informa, pero no bloquea el guardado.

## Mapa

- Un sprite por aproximadamente 10 cabezas, sin máximo artificial.
- Composición visual proporcional entre vacas, terneros/as y toros.
- Zoom, desplazamiento, Ver todo y Volver al lote.
- Centrado inicial en el lote seleccionado o ER-08/09.
- Píldoras dependientes del nivel de zoom y siempre por encima de los sprites.
- Inspector con pestañas Actual, Evolución y Eventos.
- Serie temporal de EV/ha y franja histórica de condición.

## Categorías

- Taxonomía jerárquica sin categoría Otros.
- Migración de categorías antiguas a Vacas de descarte o Novillitos.
- Novillitos y Toritos disponibles para retención de machos.

## Histórico e introducción

- Archivar y restaurar relevamientos.
- Eliminar con confirmación reforzada.
- Nueva sección Introducción con guía, conceptos, novedades y próximos módulos.

## Muestra

- 16 relevamientos mensuales.
- 52 eventos detallados.
- Todas las entidades sintéticas usan `nombre: Muestra`.
