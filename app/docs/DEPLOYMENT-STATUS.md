# Estado de despliegue — MVP 0.1.0

Fecha de preparación: **24 de julio de 2026**

## Preparado

- Repositorio React + TypeScript + Vite.
- Configuración de producción con salida estática en `dist/`.
- Workflow de GitHub Actions para GitHub Pages.
- Configuración compatible con importación directa en Vercel.
- Persistencia local mediante IndexedDB, con respaldo de emergencia en localStorage.
- Plantillas y datos ficticios de prueba en CSV.
- Documentación de instalación, respaldo y publicación.

## Verificaciones ejecutadas en esta entrega

- Preflight del producto: **OK**.
- 18 lotes ER y superficie total de 1.735 ha: **OK**.
- Proporción visual del mapa según hectáreas: **OK**.
- Factores 0,50 EV para terneros y 1,25 EV para toros: **OK**.
- Compilación estática de TypeScript contra stubs de React: **OK**.
- Pruebas de cálculos, CSV y conciliación sobre el escenario demo: **OK**.
- Sintaxis CSS con PostCSS: **OK**.
- Sintaxis YAML del workflow de despliegue: **OK**.

## Verificación pendiente al conectar GitHub

El entorno donde se preparó el paquete no permitió descargar dependencias desde npm. Por esa razón, la compilación completa de Vite debe ser ejecutada por primera vez en un equipo con acceso a npm o por el workflow incluido en GitHub Actions.

Comandos:

```bash
npm install
npm run preflight
npm run check
npm run build
```

El despliegue público también requiere acceso a la cuenta o repositorio GitHub y, para la opción recomendada, a Vercel.
