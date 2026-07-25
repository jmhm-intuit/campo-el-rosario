# Campo — El Rosario V2

Versión 2 de la aplicación local de gestión ganadera de El Rosario.

## Cambios principales de V2

- Usa como fondo **exactamente** la imagen aérea vertical aprobada de El Rosario.
- Superpone lotes, cantidades, carga animal, ganado e infraestructura como capas independientes.
- Sustituye la carga mensual por **relevamientos con fecha libre**.
- Cada relevamiento comienza desde cero y permite cargar únicamente los lotes con animales.
- Permite varios grupos de la misma categoría dentro de un lote, con año de nacimiento y nota opcionales.
- Incorpora opciones simples para el estado del campo.
- Registra la lluvia por mes aunque haya varios relevamientos dentro del mismo mes.
- Genera alertas por discrepancias y carga animal sin impedir el guardado.
- Elimina del flujo principal los movimientos entre lotes y la gestión detallada de pasturas, que quedan para versiones futuras.
- Combina compras y ventas en un KPI y utiliza un único KPI de lluvia.
- Incluye exportaciones CSV, respaldo JSON, restauración local y PWA básica.

## Uso local

No requiere instalación ni compilación. Abrí `index.html` desde un servidor web estático.

Ejemplo:

```bash
python3 -m http.server 8080
```

Luego abrí `http://localhost:8080`.

## Publicación

El repositorio incluye un workflow de GitHub Pages en `.github/workflows/deploy-pages.yml`.

1. Subí todo el contenido a la raíz de un repositorio.
2. En **Settings → Pages**, elegí **GitHub Actions**.
3. Ejecutá el workflow o hacé push a `main`.

También puede publicarse directamente en Vercel como sitio estático.

## Datos

Los datos se guardan en `localStorage` bajo la clave `campo-el-rosario-v2`.

La URL comparte la aplicación, pero no sincroniza los datos entre dispositivos. La futura versión con Supabase reemplazará la persistencia local sin cambiar el flujo principal.

## Archivos importantes

- `assets/el-rosario-map.png`: imagen aérea aprobada y sin modificaciones geométricas.
- `app.js`: lógica de relevamientos, cálculos, alertas, exportaciones y navegación.
- `styles.css`: experiencia responsive para escritorio, tablet y teléfono.
- `docs/campo-v2-dashboard-preview.png`: vista previa de escritorio.
- `docs/campo-v2-mobile-preview.png`: vista previa del flujo móvil.
