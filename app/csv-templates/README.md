# Plantillas CSV

## Inventario mensual

Archivo: `plantilla-inventario.csv`

Campos obligatorios:

- `periodo`: formato `AAAA-MM`
- `lote`: uno de los lotes ER configurados
- `categoria`: nombre o identificador de una categoría válida
- `cantidad`: número entero mayor o igual a cero

Los demás campos son opcionales. La app también permite pegar una matriz directamente desde Excel sin preparar un archivo CSV.

## Eventos del mes

Archivo: `plantilla-eventos.csv`

Tipos admitidos:

- `movimiento`
- `nacimiento`
- `muerte`
- `venta`
- `compra`
- `reclasificacion`
- `correccion`

En un movimiento se requiere lote de origen y destino. En una venta o muerte se requiere origen; en un nacimiento o compra se requiere destino.
