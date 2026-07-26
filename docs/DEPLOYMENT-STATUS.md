# Estado de implementación — Campo v5.02

## Estado

**Lista para publicar en la misma URL de GitHub Pages.** La aplicación todavía no fue subida a la cuenta de GitHub del usuario desde este entorno.

## Cambios incluidos

- Edición de relevamientos existentes y navegación cronológica por fecha exacta.
- Selector principal visible con registros ordenados desde el más reciente.
- Edición directa de lotes desde el mapa.
- Registro de lotes observados con cero animales.
- Condición observada, estimada o sin información.
- Estimación automática mediante registro reciente, patrón estacional y condición general.
- Texturas de condición dentro de cada polígono sin oscurecer el exterior del campo.
- Carga animal independiente mediante borde y halo sutil.
- Etiquetas adaptativas para lotes angostos, medianos y grandes.
- Menor densidad visual: un sprite cada 30 animales, con máximo de ocho.
- Registro diario opcional de lluvia, incluido `0 mm` como dato válido.
- Versión del código y fecha del relevamiento visible.
- Guardado automático de borradores.
- Persistencia compatible con versiones anteriores mediante `campo-el-rosario-v2`.

## Validaciones

Los siguientes comandos deben finalizar correctamente antes de empaquetar:

```bash
node --check app.js
node scripts/preflight.mjs
node scripts/smoke.mjs
```

El workflow de GitHub Pages repite estas validaciones antes de publicar.

## Publicación

Usar `campo-el-rosario-v5-02-deploy.zip`, extraer su contenido en la raíz del repositorio y hacer push a `main`. Consulta `DEPLOYMENT.md` para el bloque completo de Codespaces.
