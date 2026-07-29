/**
 * Campo v8.01 animal sprite library.
 *
 * The animation engine depends only on this interface. Replacing the current
 * directional stills with true multi-frame sprites later requires changing
 * this file (or loading a generated manifest), not the movement logic.
 */

const CURRENT_BASE = './assets/animals/v601'

export const ANIMAL_SPRITE_LIBRARY = {
  version: '8.01-current-assets',
  directions: ['north', 'east', 'south', 'west'],
  kinds: {
    cow: {
      folder: 'cow', prefix: 'cow', variantCount: 4, scale: 1, speed: 4.1,
      states: {},
    },
    bull: {
      folder: 'bull', prefix: 'bull', variantCount: 4, scale: 1.08, speed: 3.25,
      states: {},
    },
    calf: {
      folder: 'calf', prefix: 'calf', variantCount: 4, scale: 0.78, speed: 5.15,
      states: {},
    },
    cowCalf: {
      folder: 'cow-calf', prefix: 'cow-calf', variantCount: 4, scale: 1.18, speed: 3.65,
      states: {},
    },
  },
}

function safeKind(kind) {
  return ANIMAL_SPRITE_LIBRARY.kinds[kind] ? kind : 'cow'
}

function safeDirection(direction) {
  return ANIMAL_SPRITE_LIBRARY.directions.includes(direction) ? direction : 'east'
}

/**
 * Resolves a sprite path. Future sprite packs can add a `states` object:
 *
 * states: {
 *   walk: { east: ['path/frame-1.webp', 'path/frame-2.webp'] },
 *   idle: { east: ['path/idle-1.webp', 'path/idle-2.webp'] },
 * }
 *
 * Until those assets exist, the stable directional image is returned and the
 * animal moves continuously without blinking or being removed from the DOM.
 */
export function resolveAnimalSprite({ kind = 'cow', direction = 'east', variant = 0, state = 'idle', frame = 0 } = {}) {
  const normalizedKind = safeKind(kind)
  const normalizedDirection = safeDirection(direction)
  const config = ANIMAL_SPRITE_LIBRARY.kinds[normalizedKind]
  const frames = config.states?.[state]?.[normalizedDirection]
  if (Array.isArray(frames) && frames.length) {
    return frames[Math.abs(frame) % frames.length]
  }
  const variantNumber = (Math.abs(Number(variant) || 0) % config.variantCount) + 1
  return `${CURRENT_BASE}/${config.folder}/${config.prefix}-${normalizedDirection}-${variantNumber}.png`
}

export function animalFrameCount(kind, state, direction) {
  const config = ANIMAL_SPRITE_LIBRARY.kinds[safeKind(kind)]
  const frames = config.states?.[state]?.[safeDirection(direction)]
  return Array.isArray(frames) && frames.length ? frames.length : 1
}

export function animalKindConfig(kind) {
  return ANIMAL_SPRITE_LIBRARY.kinds[safeKind(kind)]
}

export function allAnimalSpritePaths() {
  const paths = new Set()
  for (const [kind, config] of Object.entries(ANIMAL_SPRITE_LIBRARY.kinds)) {
    for (const direction of ANIMAL_SPRITE_LIBRARY.directions) {
      for (let variant = 0; variant < config.variantCount; variant += 1) {
        paths.add(resolveAnimalSprite({ kind, direction, variant }))
      }
      for (const state of Object.values(config.states || {})) {
        for (const path of state?.[direction] || []) paths.add(path)
      }
    }
  }
  return [...paths]
}
