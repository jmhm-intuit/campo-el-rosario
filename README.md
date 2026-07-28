# Campo El Rosario v6.01

Aplicación web/PWA local-first para registrar relevamientos ganaderos, condición de lotes, carga animal y lluvias de Laprida.

## Novedades de v6.01

- Resumen visual simplificado: cabezas, condición por textura y carga por borde.
- Vista de mapa con sprites aéreos y vista de tabla sincronizada.
- Edición de un lote desde el mapa o desde la tabla.
- Composición del rodeo con barras relativas a la categoría mayor y porcentajes.
- Alertas consolidadas por carga y riesgo combinado.
- Módulo de lluvias de Laprida con comparación mensual, quincenal y acumulada de 12 meses.
- Confirmación explícita cuando se registra 0 mm.
- Índice hídrico y sección informativa “Próximamente en Campo”.
- KPI responsivos que no desbordan sus tarjetas.

## Persistencia

La aplicación conserva la clave `campo-el-rosario-v2`. Los datos existentes permanecen en el mismo navegador y URL. Los datos todavía se guardan localmente; el repositorio o GitHub Pages no sincronizan dispositivos.

## Validación

```bash
node --check app.js
node scripts/preflight.mjs
node scripts/smoke.mjs
```
