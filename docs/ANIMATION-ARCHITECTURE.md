# Arquitectura de animación — Campo v8.02

## Capas

1. SVG del fondo, condición y carga.
2. Sprites SVG persistentes.
3. Casas.
4. Píldoras e interacción.

## Identidad

Cada agente usa:

```text
relevamiento + lote + categoría visual + índice
```

La identidad permite conservar posición, dirección, destino y estado durante zoom, pan y rerenders de la interfaz.

## Modos

- `paused`: todos visibles, sin movimiento.
- `soft`: actividad tranquila.
- `simfarm`: 1,28× de velocidad base, caminatas más frecuentes y actividad visible.

## Estados

```text
idle → turn → walk → graze/rest → idle
```

Los agentes no desaparecen entre estados.

## Tamaño

Todos los tipos visuales usan exactamente el mismo tamaño:

```text
Resumen: 16
Mapa: 18
```

Los archivos tienen el mismo lienzo técnico de 128 × 128 px y el motor no aplica escala por categoría.

## Reemplazo futuro de sprites

`animal-sprite-library.js` admite:

```javascript
states: {
  walk: {
    east: [
      'cow-walk-east-01.webp',
      'cow-walk-east-02.webp'
    ]
  }
}
```

El motor de movimiento no necesita cambios cuando existan secuencias reales.
