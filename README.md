# Campo El Rosario v5.03

Aplicación web local-first para registrar relevamientos de ganado, condición de los lotes y lluvia de **El Rosario**.

## Novedades de v5.03

- Cinco condiciones visuales: **Muy bueno, Bueno, Regular, Malo y Anegado**.
- Migración automática de registros anteriores `Muy malo` a `Malo`.
- Cinco nuevas texturas orgánicas, sin lagunas ni objetos grandes que delaten la repetición.
- Variación determinística de orientación por lote para evitar que dos polígonos se vean idénticos.
- Intensidad y contraste ajustados para mantener visibles las vacas Aberdeen Angus coloradas.
- Sombra de suelo y contorno claro sutil en cada animal del mapa.
- Nuevo icono compacto de **Registrar animales**: una vaca con un único símbolo `+`.
- La fotografía aérea permanece intacta fuera de los polígonos.
- Se conservan edición directa, condiciones estimadas, lotes vacíos, lluvia diaria e historial por fecha de v5.02.

## Datos locales

La actualización conserva la clave histórica:

```text
campo-el-rosario-v2
```

Los relevamientos existentes permanecen en el mismo navegador y URL. Antes de publicar una actualización conviene descargar un respaldo JSON desde la aplicación.

## Validación local

```bash
node --check app.js
node scripts/preflight.mjs
node scripts/smoke.mjs
```

## Publicación

Consulta [DEPLOYMENT.md](DEPLOYMENT.md) o ejecuta `deploy-v5-03.sh` después de subir el ZIP de despliegue a la raíz del repositorio.
