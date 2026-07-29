# Changelog

## Campo v8.02 — Living Herds Refinement

### Dinámica SimFarm

- Nuevo selector de movimiento: Pausada, Suave y SimFarm.
- SimFarm utiliza mayor velocidad, pausas más breves y caminatas más perceptibles.
- Estados visuales: idle, giro, caminata, pastoreo y descanso.
- Aceleración y desaceleración progresiva.
- Oscilación sutil durante la caminata para reducir el efecto de deslizamiento.
- Control de la proporción máxima del rodeo caminando al mismo tiempo.
- Animales agrupados por lote y repulsión básica entre destinos.
- Evitación de casas, píldoras y alambrados.

### Tamaño de animales

- Tamaño visual uniforme para vacas, toros, terneros y agrupaciones.
- Eliminación de escalas diferentes por categoría.
- 16 unidades en Resumen y 18 unidades en Mapa.
- Se mantienen todos los sprites proporcionales a las cabezas registradas.

### Muestra segura

- Espacio Muestra separado de El Rosario.
- Cargar datos de muestra en instalaciones existentes.
- Abrir, restablecer y eliminar la muestra.
- Selector de espacio en la interfaz.
- Migración segura de instalaciones v8.01 que tenían la muestra como estado inicial.

### Compatibilidad

- Clave real conservada: `campo-el-rosario-v2`.
- Relevamientos, eventos, lluvia, histórico y balance de v8.01 preservados.
- Nueva caché PWA: `campo-v802-assets-1`.
