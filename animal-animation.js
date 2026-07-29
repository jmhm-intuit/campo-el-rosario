import {
  allAnimalSpritePaths,
  animalFrameCount,
  animalKindConfig,
  resolveAnimalSprite,
} from './animal-sprite-library.js'

const PREFERENCE_KEY = 'campo-animal-animation-v1'

function readAnimationPreference() {
  try { return localStorage.getItem(PREFERENCE_KEY) !== 'off' } catch { return true }
}

function writeAnimationPreference(enabled) {
  try { localStorage.setItem(PREFERENCE_KEY, enabled ? 'on' : 'off') } catch {}
}
const SVG_NS = 'http://www.w3.org/2000/svg'

function hashString(value) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function createRandom(seed) {
  let state = hashString(seed) || 1
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

function parsePoints(value = '') {
  return String(value).trim().split(/\s+/).filter(Boolean).map((pair) => pair.split(',').map(Number))
}

function pointInPolygon([x, y], polygon) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]
    const intersects = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 0.00001) + xi)
    if (intersects) inside = !inside
  }
  return inside
}

function polygonBounds(points) {
  const xs = points.map((point) => point[0])
  const ys = points.map((point) => point[1])
  return {
    minX: Math.min(...xs), maxX: Math.max(...xs),
    minY: Math.min(...ys), maxY: Math.max(...ys),
  }
}

function directionFromVector(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy)) return dx >= 0 ? 'east' : 'west'
  return dy >= 0 ? 'south' : 'north'
}

function rectFromImage(image) {
  return {
    x: Number(image.getAttribute('x')) || 0,
    y: Number(image.getAttribute('y')) || 0,
    width: Number(image.getAttribute('width')) || 0,
    height: Number(image.getAttribute('height')) || 0,
  }
}

function pointInRect(x, y, rect, padding = 0) {
  return x >= rect.x - padding && x <= rect.x + rect.width + padding && y >= rect.y - padding && y <= rect.y + rect.height + padding
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

class AnimalAnimationManager {
  constructor() {
    this.enabled = readAnimationPreference()
    this.states = new Map()
    this.maps = []
    this.frameRequest = null
    this.lastTime = 0
    this.preloaded = false
    this.handleVisibility = this.handleVisibility.bind(this)
    document.addEventListener('visibilitychange', this.handleVisibility)
  }

  isEnabled() {
    return this.enabled && !prefersReducedMotion()
  }

  toggle() {
    this.enabled = !this.enabled
    writeAnimationPreference(this.enabled)
    if (this.enabled) this.start()
    return this.enabled
  }

  preload() {
    if (this.preloaded) return
    this.preloaded = true
    for (const path of allAnimalSpritePaths()) {
      const image = new Image()
      image.decoding = 'async'
      image.src = path
    }
  }

  mount(root = document) {
    this.preload()
    const maps = []
    const activeIds = new Set()
    root.querySelectorAll('svg[data-map-svg]').forEach((svg) => {
      const type = svg.dataset.mapSvg || 'summary'
      const selectedLotId = svg.dataset.selectedLotId || ''
      const polygons = new Map()
      svg.querySelectorAll('polygon.lot-hit[data-map-lot]').forEach((polygon) => {
        const points = parsePoints(polygon.getAttribute('points'))
        if (points.length >= 3) polygons.set(polygon.dataset.mapLot, { points, bounds: polygonBounds(points) })
      })
      const obstacles = new Map()
      svg.querySelectorAll('image.map-house-svg[data-lot-id]').forEach((image) => {
        const list = obstacles.get(image.dataset.lotId) || []
        list.push(rectFromImage(image))
        obstacles.set(image.dataset.lotId, list)
      })
      const map = { svg, type, selectedLotId, polygons, obstacles, agents: [] }
      svg.querySelectorAll('image.map-animal-svg[data-animal-id]').forEach((element) => {
        const id = element.dataset.animalId
        const polygon = polygons.get(element.dataset.lotId)
        if (!id || !polygon) return
        activeIds.add(id)
        let agent = this.states.get(id)
        const initialX = Number(element.dataset.centerX)
        const initialY = Number(element.dataset.centerY)
        const width = Number(element.dataset.animalWidth) || Number(element.getAttribute('width')) || 20
        const height = Number(element.dataset.animalHeight) || Number(element.getAttribute('height')) || width
        if (!agent) {
          const random = createRandom(id)
          agent = {
            id,
            random,
            x: initialX,
            y: initialY,
            homeX: initialX,
            homeY: initialY,
            targetX: initialX,
            targetY: initialY,
            width,
            height,
            lotId: element.dataset.lotId,
            kind: element.dataset.kind || 'cow',
            direction: element.dataset.direction || 'east',
            variant: Number(element.dataset.variant) || 0,
            state: 'idle',
            frame: 0,
            frameClock: random() * 1.2,
            nextDecision: performance.now() + 1200 + random() * 5000,
            lastSeen: Date.now(),
          }
          this.states.set(id, agent)
        }
        agent.element = element
        agent.map = map
        agent.polygon = polygon
        agent.obstacles = obstacles.get(agent.lotId) || []
        agent.width = width
        agent.height = height
        agent.lastSeen = Date.now()
        if (!this.validPosition(agent, agent.x, agent.y)) {
          agent.x = initialX
          agent.y = initialY
          agent.targetX = initialX
          agent.targetY = initialY
          agent.state = 'idle'
        }
        map.agents.push(agent)
        this.applyAgent(agent, true)
      })
      maps.push(map)
    })
    this.maps = maps
    const expiration = Date.now() - 1000 * 60 * 20
    for (const [id, state] of this.states) {
      if (!activeIds.has(id) && state.lastSeen < expiration) this.states.delete(id)
    }
    this.start()
  }

  handleVisibility() {
    if (!document.hidden) {
      this.lastTime = performance.now()
      this.start()
    }
  }

  start() {
    if (this.frameRequest || !this.maps.length || !this.isEnabled()) return
    this.lastTime = performance.now()
    this.frameRequest = requestAnimationFrame((time) => this.tick(time))
  }

  tick(time) {
    this.frameRequest = null
    const dt = Math.min(0.05, Math.max(0, (time - this.lastTime) / 1000))
    this.lastTime = time
    if (!document.hidden && this.isEnabled()) {
      for (const map of this.maps) {
        for (const agent of map.agents) this.updateAgent(agent, dt, time)
      }
    }
    if (this.maps.length && this.isEnabled()) this.frameRequest = requestAnimationFrame((nextTime) => this.tick(nextTime))
  }

  movementIntensity(agent) {
    if (agent.map.type === 'summary') return 0.28
    if (agent.map.selectedLotId && agent.map.selectedLotId === agent.lotId) return 1
    return 0.24
  }

  updateAgent(agent, dt, now) {
    const intensity = this.movementIntensity(agent)
    if (agent.state === 'walk') {
      const dx = agent.targetX - agent.x
      const dy = agent.targetY - agent.y
      const distance = Math.hypot(dx, dy)
      const config = animalKindConfig(agent.kind)
      const speed = config.speed * (agent.map.type === 'summary' ? 0.55 : 1)
      const step = speed * dt
      if (distance <= Math.max(0.8, step)) {
        agent.x = agent.targetX
        agent.y = agent.targetY
        agent.state = 'idle'
        agent.nextDecision = now + 1800 + agent.random() * 5200 / Math.max(0.25, intensity)
      } else {
        const nextX = agent.x + dx / distance * step
        const nextY = agent.y + dy / distance * step
        if (this.validPosition(agent, nextX, nextY)) {
          agent.x = nextX
          agent.y = nextY
          const nextDirection = directionFromVector(dx, dy)
          if (nextDirection !== agent.direction) {
            agent.direction = nextDirection
            agent.frame = 0
            this.updateSprite(agent)
          }
        } else {
          agent.state = 'idle'
          agent.nextDecision = now + 1200 + agent.random() * 2600
        }
      }
    } else if (now >= agent.nextDecision) {
      const moveChance = 0.45 * intensity
      if (agent.random() < moveChance && this.chooseTarget(agent)) {
        agent.state = 'walk'
        agent.frame = 0
        this.updateSprite(agent)
      } else {
        agent.state = 'idle'
        agent.nextDecision = now + 2200 + agent.random() * 6500 / Math.max(0.25, intensity)
      }
    }

    const frameCount = animalFrameCount(agent.kind, agent.state, agent.direction)
    if (frameCount > 1) {
      agent.frameClock += dt
      const frameDuration = agent.state === 'walk' ? 0.18 : 0.42
      if (agent.frameClock >= frameDuration) {
        agent.frameClock %= frameDuration
        agent.frame = (agent.frame + 1) % frameCount
        this.updateSprite(agent)
      }
    }
    this.applyAgent(agent)
  }

  chooseTarget(agent) {
    const { bounds } = agent.polygon
    const span = Math.max(12, Math.min(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY))
    const maxDistance = span * (agent.map.type === 'summary' ? 0.13 : 0.24)
    const minDistance = Math.min(8, maxDistance * 0.35)
    for (let attempt = 0; attempt < 36; attempt += 1) {
      const angle = agent.random() * Math.PI * 2
      const distance = minDistance + agent.random() * Math.max(2, maxDistance - minDistance)
      const x = agent.x + Math.cos(angle) * distance
      const y = agent.y + Math.sin(angle) * distance
      if (!this.validPosition(agent, x, y)) continue
      if (agent.map.agents.some((other) => other !== agent && other.lotId === agent.lotId && Math.hypot(other.x - x, other.y - y) < Math.max(4, agent.width * 0.42))) continue
      agent.targetX = x
      agent.targetY = y
      agent.direction = directionFromVector(x - agent.x, y - agent.y)
      return true
    }
    return false
  }

  validPosition(agent, x, y) {
    const radiusX = Math.max(2.5, agent.width * 0.34)
    const radiusY = Math.max(2.5, agent.height * 0.28)
    const samples = [
      [x, y], [x - radiusX, y], [x + radiusX, y],
      [x, y - radiusY], [x, y + radiusY],
    ]
    if (!samples.every((point) => pointInPolygon(point, agent.polygon.points))) return false
    if (agent.obstacles.some((rect) => pointInRect(x, y, rect, Math.max(3, agent.width * 0.18)))) return false
    return true
  }

  updateSprite(agent) {
    const path = resolveAnimalSprite({
      kind: agent.kind,
      direction: agent.direction,
      variant: agent.variant,
      state: agent.state,
      frame: agent.frame,
    })
    if (agent.element?.getAttribute('href') !== path) agent.element?.setAttribute('href', path)
  }

  applyAgent(agent, forceSprite = false) {
    const element = agent.element
    if (!element || !element.isConnected) return
    if (forceSprite) this.updateSprite(agent)
    element.setAttribute('x', (agent.x - agent.width / 2).toFixed(2))
    element.setAttribute('y', (agent.y - agent.height / 2).toFixed(2))
    element.setAttribute('width', agent.width.toFixed(2))
    element.setAttribute('height', agent.height.toFixed(2))
    element.dataset.animationState = agent.state
    element.dataset.direction = agent.direction
    element.style.opacity = '1'
  }
}

export const animalAnimator = new AnimalAnimationManager()
