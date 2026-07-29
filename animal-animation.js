import {
  allAnimalSpritePaths,
  animalFrameCount,
  animalKindConfig,
  resolveAnimalSprite,
} from './animal-sprite-library.js'

const PREFERENCE_KEY = 'campo-animal-animation-v2'
const LEGACY_PREFERENCE_KEY = 'campo-animal-animation-v1'
const SVG_NS = 'http://www.w3.org/2000/svg'

const MODES = Object.freeze({
  paused: {
    id: 'paused', label: 'Pausada', glyph: '▶', speed: 0,
    summaryActivity: 0, normalActivity: 0, selectedActivity: 0,
    maxSummaryWalking: 0, maxNormalWalking: 0, maxSelectedWalking: 0,
  },
  soft: {
    id: 'soft', label: 'Suave', glyph: '≈', speed: 1,
    summaryActivity: 0.11, normalActivity: 0.15, selectedActivity: 0.24,
    maxSummaryWalking: 0.12, maxNormalWalking: 0.18, maxSelectedWalking: 0.28,
  },
  simfarm: {
    id: 'simfarm', label: 'SimFarm', glyph: '▶', speed: 1.28,
    summaryActivity: 0.16, normalActivity: 0.22, selectedActivity: 0.36,
    maxSummaryWalking: 0.16, maxNormalWalking: 0.22, maxSelectedWalking: 0.35,
  },
})
const MODE_ORDER = ['paused', 'soft', 'simfarm']

function readAnimationMode() {
  try {
    const stored = localStorage.getItem(PREFERENCE_KEY)
    if (MODES[stored]) return stored
    const legacy = localStorage.getItem(LEGACY_PREFERENCE_KEY)
    if (legacy === 'off') return 'paused'
  } catch {}
  return 'simfarm'
}

function writeAnimationMode(mode) {
  try { localStorage.setItem(PREFERENCE_KEY, MODES[mode] ? mode : 'simfarm') } catch {}
}

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

function agentIndexFromId(id) {
  const value = Number(String(id || '').split(':').at(-1))
  return Number.isFinite(value) ? value : 0
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

class AnimalAnimationManager {
  constructor() {
    this.mode = readAnimationMode()
    this.states = new Map()
    this.maps = []
    this.frameRequest = null
    this.lastTime = 0
    this.preloaded = false
    this.handleVisibility = this.handleVisibility.bind(this)
    document.addEventListener('visibilitychange', this.handleVisibility)
  }

  getMode() {
    return prefersReducedMotion() ? 'paused' : this.mode
  }

  getModeLabel() {
    return MODES[this.getMode()]?.label || 'SimFarm'
  }

  getModeGlyph() {
    return MODES[this.getMode()]?.glyph || '▶'
  }

  isEnabled() {
    return this.getMode() !== 'paused'
  }

  setMode(mode) {
    this.mode = MODES[mode] ? mode : 'simfarm'
    writeAnimationMode(this.mode)
    if (this.isEnabled()) this.start()
    else this.stop()
    for (const map of this.maps) {
      for (const agent of map.agents) this.applyAgent(agent, true)
    }
    return this.mode
  }

  cycleMode() {
    const current = this.getMode()
    const index = MODE_ORDER.indexOf(current)
    return this.setMode(MODE_ORDER[(index + 1) % MODE_ORDER.length])
  }

  toggle() {
    return this.setMode(this.isEnabled() ? 'paused' : 'simfarm') !== 'paused'
  }

  stop() {
    if (this.frameRequest) cancelAnimationFrame(this.frameRequest)
    this.frameRequest = null
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
      svg.querySelectorAll('.map-pill-svg[data-map-lot]').forEach((pill) => {
        try {
          const box = pill.getBBox()
          if (!box?.width || !box?.height) return
          const list = obstacles.get(pill.dataset.mapLot) || []
          list.push({ x: box.x, y: box.y, width: box.width, height: box.height })
          obstacles.set(pill.dataset.mapLot, list)
        } catch {}
      })
      const map = { svg, type, selectedLotId, polygons, obstacles, agents: [], agentsByLot: new Map() }
      svg.querySelectorAll('image.map-animal-svg[data-animal-id]').forEach((element) => {
        const id = element.dataset.animalId
        const polygon = polygons.get(element.dataset.lotId)
        if (!id || !polygon) return
        activeIds.add(id)
        let agent = this.states.get(id)
        const initialX = Number(element.dataset.centerX)
        const initialY = Number(element.dataset.centerY)
        const width = Number(element.dataset.animalWidth) || Number(element.getAttribute('width')) || 18
        const height = Number(element.dataset.animalHeight) || Number(element.getAttribute('height')) || width
        if (!agent) {
          const random = createRandom(id)
          const index = Number(element.dataset.agentIndex) || agentIndexFromId(id)
          agent = {
            id,
            index,
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
            bobPhase: random() * Math.PI * 2,
            currentSpeed: 0,
            nextDecision: performance.now() + 250 + random() * 2500,
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
          agent.homeX = initialX
          agent.homeY = initialY
          agent.targetX = initialX
          agent.targetY = initialY
          agent.state = 'idle'
        }
        map.agents.push(agent)
        const lotAgents = map.agentsByLot.get(agent.lotId) || []
        lotAgents.push(agent)
        map.agentsByLot.set(agent.lotId, lotAgents)
        this.applyAgent(agent, true)
      })
      maps.push(map)
    })
    this.maps = maps
    const expiration = Date.now() - 1000 * 60 * 30
    for (const [id, state] of this.states) {
      if (!activeIds.has(id) && state.lastSeen < expiration) this.states.delete(id)
    }
    this.start()
  }

  handleVisibility() {
    if (document.hidden) {
      this.stop()
      return
    }
    this.lastTime = performance.now()
    this.start()
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

  profile(agent) {
    const mode = MODES[this.getMode()] || MODES.simfarm
    const selected = Boolean(agent.map.selectedLotId && agent.map.selectedLotId === agent.lotId)
    const activity = agent.map.type === 'summary'
      ? mode.summaryActivity
      : selected ? mode.selectedActivity : mode.normalActivity
    const maxWalking = agent.map.type === 'summary'
      ? mode.maxSummaryWalking
      : selected ? mode.maxSelectedWalking : mode.maxNormalWalking
    const viewSpeed = agent.map.type === 'summary' ? 0.88 : selected ? 1.05 : 0.94
    return { mode, selected, activity, maxWalking, viewSpeed }
  }

  updateAgent(agent, dt, now) {
    const profile = this.profile(agent)
    if (!profile.mode.speed) {
      agent.currentSpeed = 0
      this.applyAgent(agent)
      return
    }

    if (agent.state === 'walk') {
      this.advanceWalk(agent, dt, now, profile)
    } else if (agent.state === 'turn') {
      if (now >= agent.nextDecision) {
        agent.state = 'walk'
        agent.currentSpeed = 0
        agent.frame = 0
        this.updateSprite(agent)
      }
    } else if (now >= agent.nextDecision) {
      this.decideNextState(agent, now, profile)
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

  advanceWalk(agent, dt, now, profile) {
    const dx = agent.targetX - agent.x
    const dy = agent.targetY - agent.y
    const distance = Math.hypot(dx, dy)
    const config = animalKindConfig(agent.kind)
    const desiredSpeed = config.speed * profile.mode.speed * profile.viewSpeed
    agent.currentSpeed += (desiredSpeed - agent.currentSpeed) * Math.min(1, dt * 4.8)
    const step = agent.currentSpeed * dt
    if (distance <= Math.max(0.8, step)) {
      agent.x = agent.targetX
      agent.y = agent.targetY
      agent.currentSpeed = 0
      const roll = agent.random()
      if (roll < 0.58) this.enterState(agent, 'graze', now, 2400, 6200)
      else if (roll < 0.72) this.enterState(agent, 'rest', now, 5500, 12000)
      else this.enterState(agent, 'idle', now, 1200, 3600)
      return
    }
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
      agent.currentSpeed = 0
      this.enterState(agent, 'idle', now, 900, 2400)
    }
  }

  decideNextState(agent, now, profile) {
    const lotAgents = agent.map.agentsByLot.get(agent.lotId) || []
    const moving = lotAgents.filter((other) => other.state === 'walk' || other.state === 'turn').length
    const movingRatio = lotAgents.length ? moving / lotAgents.length : 0
    const canWalk = movingRatio < profile.maxWalking
    const roll = agent.random()
    if (canWalk && roll < profile.activity && this.chooseTarget(agent, profile)) {
      agent.state = 'turn'
      agent.currentSpeed = 0
      agent.nextDecision = now + 160 + agent.random() * 280
      agent.frame = 0
      this.updateSprite(agent)
      return
    }
    if (roll < 0.68) {
      this.enterState(agent, 'graze', now, 2200, 5800)
    } else if (roll < 0.78 && agent.map.type !== 'summary') {
      this.enterState(agent, 'rest', now, 5500, 13000)
    } else {
      this.enterState(agent, 'idle', now, 1000, profile.selected ? 2800 : 4400)
    }
  }

  enterState(agent, state, now, minDuration, maxDuration) {
    agent.state = state
    agent.frame = 0
    agent.nextDecision = now + minDuration + agent.random() * Math.max(0, maxDuration - minDuration)
    this.updateSprite(agent)
  }

  chooseTarget(agent, profile) {
    const { bounds } = agent.polygon
    const span = Math.max(12, Math.min(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY))
    const maxDistance = span * (agent.map.type === 'summary' ? 0.11 : profile.selected ? 0.24 : 0.17)
    const minDistance = Math.max(5, maxDistance * 0.36)
    const homeRadius = span * (agent.map.type === 'summary' ? 0.22 : profile.selected ? 0.38 : 0.29)
    for (let attempt = 0; attempt < 42; attempt += 1) {
      let angle = agent.random() * Math.PI * 2
      let distance = minDistance + agent.random() * Math.max(2, maxDistance - minDistance)
      const fromHome = Math.hypot(agent.x - agent.homeX, agent.y - agent.homeY)
      if (fromHome > homeRadius * 0.76) {
        const towardHome = Math.atan2(agent.homeY - agent.y, agent.homeX - agent.x)
        angle = towardHome + (agent.random() - 0.5) * 1.1
        distance = Math.min(distance, Math.max(5, fromHome * 0.5))
      }
      const x = agent.x + Math.cos(angle) * distance
      const y = agent.y + Math.sin(angle) * distance
      if (!this.validPosition(agent, x, y)) continue
      const minimumSpacing = Math.max(3.5, agent.width * 0.52)
      if ((agent.map.agentsByLot.get(agent.lotId) || []).some((other) => other !== agent && Math.hypot(other.x - x, other.y - y) < minimumSpacing)) continue
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
    if (agent.obstacles.some((rect) => pointInRect(x, y, rect, Math.max(3, agent.width * 0.22)))) return false
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
    const now = performance.now() / 1000
    const bob = agent.state === 'walk'
      ? Math.sin(now * 12 + agent.bobPhase) * 0.55
      : agent.state === 'graze' ? Math.sin(now * 3.2 + agent.bobPhase) * 0.12 : 0
    element.setAttribute('x', (agent.x - agent.width / 2).toFixed(2))
    element.setAttribute('y', (agent.y - agent.height / 2).toFixed(2))
    element.setAttribute('width', agent.width.toFixed(2))
    element.setAttribute('height', agent.height.toFixed(2))
    element.setAttribute('transform', bob ? `translate(0 ${bob.toFixed(2)})` : '')
    element.dataset.animationState = agent.state
    element.dataset.direction = agent.direction
    element.style.opacity = '1'
  }
}

export const animalAnimator = new AnimalAnimationManager()
