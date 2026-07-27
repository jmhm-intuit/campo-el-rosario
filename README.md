# Campo El Rosario v5.04

Aplicación web/PWA local para relevamientos de ganado, condición de lotes, carga animal y lluvia en El Rosario.

## Principales funciones

- Relevamientos por fecha exacta, editables y ordenados cronológicamente.
- Edición directa de cada lote desde el mapa.
- Registro de lotes con animales o con cero animales para informar su condición.
- Condiciones observadas, estimadas y sin información.
- Carga animal independiente de la condición del terreno.
- Lluvia diaria opcional, conservando la diferencia entre `0 mm` y sin información.
- Cinco texturas de condición de alto contraste.
- Cuatro tipos visuales de animales: toro, vaca, vaca con ternero y ternero/a.
- Cuatro categorías sugeridas por frecuencia al iniciar la carga de un lote.
- Tabla simplificada de todos los lotes en el resumen.
- Exportación CSV y respaldo JSON.

## Persistencia

Los datos continúan guardándose localmente con la clave:

```text
campo-el-rosario-v2
```

Publicar v5.04 en la misma URL y navegador conserva los relevamientos existentes. Se recomienda descargar un respaldo JSON antes de actualizar.

## Validación

```bash
node scripts/preflight.mjs
node scripts/smoke.mjs
```
