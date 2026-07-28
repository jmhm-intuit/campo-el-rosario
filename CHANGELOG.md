# Changelog

## Campo v6.01 — 2026-07-27

### Mapa y lotes

- Se simplificó el mapa del resumen: muestra únicamente cabezas, textura de condición y borde de carga.
- Se eliminan nombres y condición escrita de la vista resumen.
- Se incorporó un selector visible entre Mapa y Tabla.
- La tabla utiliza encabezados explícitos y alineados: Lote, Cond., Carga EV/ha, Total, Vaca, Tern., Toro, Otras y Editar.
- Cada fila permite abrir o editar un lote con sus datos ya poblados.
- Se incorporaron 64 sprites aéreos transparentes recortados del archivo compartido: vaca, toro, ternero/a y vaca con ternero, en cuatro direcciones y cuatro variantes.
- Se redujo la escala visual del patrón de pasto y se suavizaron los bordes de carga.

### Dashboard

- Se corrigió el desbordamiento del KPI Carga del campo.
- Los KPI se adaptan a escritorio, tableta y teléfono.
- La composición del rodeo muestra cantidad y porcentaje; la categoría mayor define el ancho de referencia.
- Las alertas se consolidan en carga alta y riesgo de condición mala/anegada con al menos 0,50 EV/ha.

### Lluvias

- Nuevo módulo visual azul para Estación Laprida.
- Comparación mensual y quincenal contra promedio, P10 y P90.
- Vista acumulada de los últimos 12 meses.
- Índice hídrico y clasificación muy seco, seco, normal, húmedo y muy húmedo.
- Carga como total mensual o detalle por fecha.
- Confirmación obligatoria al guardar 0 mm: realmente cero o sin información.
- La lluvia puede editarse y los meses vacíos no se interpretan como cero.

### Próximamente

- Calendario sanitario.
- Calendario pastoril.
- Calendario comercial.

### Compatibilidad

- Se mantiene `campo-el-rosario-v2`.
- Nueva caché PWA: `campo-v601-assets-1`.
- Workflow de GitHub Pages con Node 24.
