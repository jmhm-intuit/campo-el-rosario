# Changelog

## 5.01 — 2026-07-26

### Relevamientos
- Se agregó edición de registros existentes.
- Se agregó selector por fecha agrupado por mes.
- Las fechas se muestran de la más reciente a la más antigua.
- Las ediciones guardan `editedAt` y conservan el identificador original.
- Cambiar una fecha histórica solicita confirmación y reordena el historial.

### Mapa
- Nuevas superficies de condición en alta resolución.
- La condición ocupa el fondo del polígono y puede cubrir visualmente la fotografía aérea.
- La carga animal se muestra con borde y halo independiente.
- Etiquetas de lote rediseñadas para mejorar la lectura de cabezas y EV/ha.
- Escala visual actualizada a un sprite cada 30 animales, máximo ocho.
- Los lotes con varias categorías usan el tipo animal dominante.
- Se removió la leyenda permanente de condiciones.

### Assets
- Vaca Aberdeen Angus colorada para existencias.
- Vaca con cría para nacimientos.
- Toro, vaca y ternero laterales transparentes para el mapa.
- Nuevas texturas para Muy bueno, Bueno, Regular, Malo, Muy malo y Anegado.

### Datos y PWA
- Se mantiene la clave de almacenamiento de V5.
- Nueva caché `campo-v501-assets-1` para forzar la actualización visual.
