# Changelog

## Campo v8.01 — Living Herds

### Animación

- Nuevo motor de movimiento continuo para los animales.
- Los animales permanecen visibles durante todo el ciclo; no se simula movimiento ocultando y mostrando sprites.
- Cada agente conserva una identidad estable por relevamiento, lote, categoría e índice.
- Movimiento lento en el Resumen y comportamiento más activo en el lote seleccionado.
- Selección automática de dirección según la trayectoria.
- Pausa automática cuando la pestaña no está visible.
- Compatibilidad con preferencias de movimiento reducido.
- Control local para activar o pausar la animación.

### Arquitectura futura

- Nueva biblioteca desacoplada de sprites.
- Soporte preparado para secuencias futuras de `idle`, `walk`, `graze` y otros estados.
- Precarga de los 64 assets direccionales actuales para evitar parpadeos al cambiar de dirección.
- El reemplazo de sprites no requiere modificar la lógica de movimiento.

### Resumen

- Controles de zoom y desplazamiento incorporados al mapa principal.
- Soporte de rueda, arrastre y gesto de pinza.
- Botón para volver a ver todo el establecimiento.

### Compatibilidad

- Datos sintéticos de 16 meses incluidos como estado inicial.
- Persistencia conservada bajo `campo-el-rosario-v2`.
- Funciones de eventos, balance, lluvia, histórico y edición de v7.01 preservadas.
