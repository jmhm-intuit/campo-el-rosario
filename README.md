# Campo — El Rosario V4

Aplicación web local para registrar relevamientos de ganado, carga animal, lluvia y estado general de El Rosario.

## Cambios principales de V4

- Incorpora la biblioteca definitiva de sprites transparentes de Angus colorado.
- Distribuye varios animales dentro de cada lote para representar visualmente su ocupación y carga, sin dibujar una vaca por cada cabeza real.
- Mantiene los animales dentro de los polígonos y evita el área de las etiquetas.
- Reemplaza la casa de ER-08/09 por un asset transparente inspirado en la fotografía real compartida: galería de cuatro arcos, paredes envejecidas, tanque lateral y techo plano.
- Mantiene una segunda casa rural permanente en el extremo inferior derecho de ER-13.
- Usa la imagen aérea aprobada y todas las capas dentro del mismo `viewBox` de `1154 × 1363`, evitando escalas independientes.
- Conserva el flujo **Registrar animales por lote**, el estado del campo opcional y la posibilidad de dejar lotes sin cargar.
- Muestra al final cualquier diferencia de uno o más animales respecto del relevamiento anterior, sin bloquear el guardado.
- Conserva automáticamente los relevamientos de V2 y V3 porque mantiene la misma clave de almacenamiento local.

## Capas del mapa

1. Imagen aérea aprobada.
2. Color de carga por lote.
3. Sprites individuales de animales.
4. Casas permanentes.
5. Polígonos interactivos, nombres, cantidades y carga.

Las casas se ven siempre, pero permanecen como una capa fija sobre el mapa. Esto permite ajustar su escala y posición sin modificar la imagen aérea original.

## Uso local

No requiere compilación:

```bash
python3 -m http.server 8080
```

Abrí `http://localhost:8080`.

## Datos y compatibilidad

Campo V4 sigue usando la clave local `campo-el-rosario-v2`. Al actualizar la aplicación en la misma URL, los relevamientos existentes se migran a la versión 4 sin cambiar su ubicación.

La URL comparte la aplicación, pero los datos continúan siendo locales a cada dispositivo hasta incorporar sincronización remota.
