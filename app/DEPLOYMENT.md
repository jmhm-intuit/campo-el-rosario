# Despliegue de Campo

La aplicación puede publicarse como sitio estático. El repositorio está preparado para dos caminos: **Vercel** y **GitHub Pages**.

## Antes de publicar

Desde la carpeta del proyecto:

```bash
npm install
npm run preflight
npm run check
npm run build
```

El resultado debe terminar sin errores y crear la carpeta `dist/`.

## Opción recomendada: GitHub + Vercel

### 1. Crear el repositorio

Cree un repositorio vacío en GitHub, por ejemplo `campo-el-rosario`.

### 2. Enviar el código

```bash
git init
git add .
git commit -m "Initial Campo MVP"
git branch -M main
git remote add origin REEMPLAZAR_CON_LA_URL_DEL_REPOSITORIO
git push -u origin main
```

### 3. Importar en Vercel

1. En Vercel, seleccione **Add New → Project**.
2. Conecte GitHub y elija el repositorio.
3. Confirme que el framework detectado sea **Vite**.
4. Use `npm run build` como comando de compilación.
5. Use `dist` como directorio de salida.
6. Publique.

No se requieren variables de entorno para el MVP local.

### 4. Mantener una URL estable

Use la URL de producción como dirección oficial. Los despliegues de vista previa pueden tener un origen distinto y, por lo tanto, una base local separada en el navegador.

## Alternativa: GitHub Pages

El flujo `.github/workflows/deploy-pages.yml` ya compila y despliega el sitio.

### 1. Enviar el proyecto a `main`

Siga los comandos de Git de la sección anterior.

### 2. Habilitar Pages

En GitHub:

1. Abra **Settings**.
2. Abra **Pages**.
3. En **Build and deployment**, elija **GitHub Actions** como origen.
4. Abra la pestaña **Actions** y espere a que finalice el flujo “Deploy Campo to GitHub Pages”.

El flujo también puede iniciarse manualmente con **Run workflow**.

## Actualizaciones posteriores

Para publicar una nueva versión:

```bash
git add .
git commit -m "Describe the change"
git push
```

Vercel o GitHub Pages ejecutarán la compilación configurada en el repositorio.

## Respaldo antes de cambios importantes

Los datos del MVP viven en el navegador, no en GitHub ni en el servidor de despliegue. Antes de:

- cambiar la URL oficial;
- limpiar datos del navegador;
- cambiar de navegador o equipo;
- reemplazar el dominio;

exporte el respaldo JSON desde **Exportar y respaldo**.

## Migración futura a Supabase

Cuando se agregue Supabase, mantenga las entidades actuales y reemplace el adaptador local por un adaptador remoto. El esquema previsto incluye:

- lotes;
- grupos de animales;
- inventarios mensuales;
- eventos y movimientos;
- lluvia;
- pasturas;
- cierres mensuales;
- alertas y supuestos.

Hasta entonces, la URL es compartible pero la información de cada navegador permanece independiente.
