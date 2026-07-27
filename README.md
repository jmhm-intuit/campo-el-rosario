# Campo El Rosario v5.05

Aplicación web local-first para registrar relevamientos de ganado, condición de lotes y lluvia.

## Mejoras de v5.05

- Dos modos de mapa: resumen legible y mapa detallado.
- Texturas de condición con escala visual más fina y homogénea.
- Animales con tamaño mínimo en pantalla: un sprite cada 30 animales, máximo 3 en resumen y 8 en mapa.
- En el resumen, cada lote muestra solamente nombre, total y punto de carga; la condición se lee en el fondo.
- En el mapa detallado, condición y carga aparecen juntas sin dejar de ser variables independientes.
- Etiquetas adaptativas para lotes angostos como ER-04 y ER-05.
- Tabla de 18 lotes ajustada al ancho de un teléfono, sin desplazamiento horizontal.
- Bordes de carga más sutiles para priorizar la condición del terreno.
- Versión `Campo v5.05` y fecha del relevamiento visibles en la interfaz.
- Workflow actualizado a Node 24.

Los datos continúan almacenándose con la clave `campo-el-rosario-v2`.
