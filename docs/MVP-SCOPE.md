# Alcance del MVP

## Objetivo principal

Reducir al mínimo el esfuerzo de registrar la distribución mensual de animales por lote y categoría. La obtención de insights depende de superar primero la barrera de carga de datos.

## Flujo de cierre mensual

1. Seleccionar el período.
2. Copiar el mes anterior, pegar desde Excel, completar la matriz o importar CSV.
3. Registrar cambios conocidos del mes.
4. Revisar las reglas de conciliación sugeridas.
5. Confirmar o cambiar cada explicación.
6. Registrar lluvia y revisar pasturas.
7. Ver resumen y alertas.
8. Cerrar el mes.

## Reglas de conciliación del MVP

- Busca salidas y entradas de la misma categoría en distintos lotes y propone movimientos.
- Busca reducciones y aumentos entre categorías dentro del mismo lote y propone reclasificaciones.
- Presenta las diferencias restantes como venta, muerte, nacimiento, compra, movimiento pendiente o corrección.
- Nunca confirma automáticamente una explicación.
- Requiere intervención del usuario antes del cierre mensual.

## Fuera de alcance

- Seguimiento individual de caravanas.
- Sincronización entre dispositivos.
- Cálculo agronómico estacional de capacidad.
- Integración meteorológica automática.
- GIS o límites georreferenciados exactos.
- Supuestos editables.
- Roles y permisos.

Estos elementos quedan preparados conceptualmente para una versión con Supabase.
