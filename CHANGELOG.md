# Changelog

## Campo v5.02 — 26 de julio de 2026

### Relevamientos

- Se pueden editar relevamientos existentes sin duplicarlos.
- Los relevamientos se ordenan desde el más reciente y se agrupan por mes en el historial.
- El selector principal muestra una fecha concreta, con navegación anterior/siguiente.
- La edición de fechas históricas advierte cuando cambia el orden cronológico.
- Se muestra fecha de creación y última edición cuando corresponde.

### Lotes y condición

- Edición directa desde la ficha del lote en el mapa.
- Registro de lotes observados con cero animales.
- Distinción entre lote no observado y lote observado vacío.
- Condición opcional con tres orígenes: observada, estimada y sin información.
- Regla de estimación: condición reciente del lote dentro de 60 días; historial del mismo mes; condición general observada; condición general previa.
- Texturas más intensas dentro del polígono y paisaje exterior sin oscurecimiento.
- Indicador `≈` y tratamiento visual suavizado para condiciones estimadas.

### Mapa y lectura

- Bordes y halos de carga reducidos para no competir con la condición del lote.
- Condición y carga permanecen visualmente independientes.
- Etiquetas compactas y adaptativas, especialmente para ER-04 y ER-05.
- Menor escala y densidad de animales en la vista general.
- Un sprite representativo por cada 30 animales, con máximo de ocho por lote.

### Lluvia

- Registro diario opcional con fecha, milímetros y nota.
- Total mensual calculado automáticamente.
- Diferenciación entre `0 mm` y falta de información.
- El relevamiento puede guardarse sin datos de lluvia.

### Interfaz y estabilidad

- Nuevos iconos para Inicio, Existencias, Nacimientos y Registrar animales.
- `Campo v5.02` y fecha de datos visibles en la interfaz.
- Guardado automático de borradores.
- Nueva versión de caché PWA para evitar recursos antiguos.
- Se mantiene la clave local `campo-el-rosario-v2` para preservar los datos de V5.
