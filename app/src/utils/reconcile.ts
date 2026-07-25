import { CATEGORIES, LOTS } from '../data/config'
import type {
  AnimalEvent,
  AnimalEventType,
  AppState,
  ReconciliationSuggestion,
} from '../types'
import { entriesForPeriod } from './calculations'
import { periodToDate, previousPeriod } from './format'

type DeltaMap = Map<string, number>

const keyFor = (lotId: string, categoryId: string) => `${lotId}::${categoryId}`
const splitKey = (key: string) => {
  const [lotId, categoryId] = key.split('::')
  return { lotId, categoryId }
}

function aggregate(state: AppState, period: string): DeltaMap {
  const map = new Map<string, number>()
  entriesForPeriod(state, period).forEach((entry) => {
    const key = keyFor(entry.lotId, entry.categoryId)
    map.set(key, (map.get(key) ?? 0) + entry.quantity)
  })
  return map
}

function add(map: DeltaMap, lotId: string | undefined, categoryId: string | undefined, amount: number) {
  if (!lotId || !categoryId || !amount) return
  const key = keyFor(lotId, categoryId)
  map.set(key, (map.get(key) ?? 0) + amount)
}

function applyConfirmedEvents(state: AppState, period: string, expected: DeltaMap) {
  state.events
    .filter((event) => event.period === period && event.status === 'confirmado')
    .forEach((event) => {
      switch (event.type) {
        case 'movimiento':
          add(expected, event.originLotId, event.categoryId, -event.quantity)
          add(expected, event.destinationLotId, event.categoryId, event.quantity)
          break
        case 'nacimiento':
        case 'compra':
          add(expected, event.destinationLotId, event.categoryId, event.quantity)
          break
        case 'muerte':
        case 'venta':
          add(expected, event.originLotId, event.categoryId, -event.quantity)
          break
        case 'reclasificacion':
          add(expected, event.originLotId ?? event.destinationLotId, event.categoryId, -event.quantity)
          add(
            expected,
            event.destinationLotId ?? event.originLotId,
            event.destinationCategoryId,
            event.quantity,
          )
          break
        case 'correccion':
          if (event.originLotId && !event.destinationLotId) {
            add(expected, event.originLotId, event.categoryId, -event.quantity)
          } else {
            add(expected, event.destinationLotId ?? event.originLotId, event.categoryId, event.quantity)
          }
          break
      }
    })
}

function defaultExitType(categoryId: string): AnimalEventType {
  if (categoryId === 'vacas-ultimo-ternero' || categoryId === 'machos-recria-engorde') return 'venta'
  if (categoryId === 'terneros' || categoryId === 'terneras') return 'muerte'
  return 'correccion'
}

function defaultEntryType(categoryId: string): AnimalEventType {
  if (categoryId === 'terneros' || categoryId === 'terneras') return 'nacimiento'
  return 'compra'
}

export function buildReconciliationSuggestions(
  state: AppState,
  period: string,
): ReconciliationSuggestion[] {
  const previous = aggregate(state, previousPeriod(period))
  const expected = new Map(previous)
  applyConfirmedEvents(state, period, expected)
  const current = aggregate(state, period)
  const allKeys = new Set([...expected.keys(), ...current.keys()])
  const deltas = new Map<string, number>()

  allKeys.forEach((key) => {
    const difference = (current.get(key) ?? 0) - (expected.get(key) ?? 0)
    if (difference) deltas.set(key, difference)
  })

  const suggestions: ReconciliationSuggestion[] = []
  let counter = 1

  // First reconcile like-for-like movements between lots.
  CATEGORIES.forEach((category) => {
    const negatives = [...deltas.entries()]
      .filter(([key, value]) => splitKey(key).categoryId === category.id && value < 0)
      .map(([key, value]) => ({ key, remaining: -value, ...splitKey(key) }))
    const positives = [...deltas.entries()]
      .filter(([key, value]) => splitKey(key).categoryId === category.id && value > 0)
      .map(([key, value]) => ({ key, remaining: value, ...splitKey(key) }))

    negatives.forEach((negative) => {
      positives.forEach((positive) => {
        if (!negative.remaining || !positive.remaining || negative.lotId === positive.lotId) return
        const quantity = Math.min(negative.remaining, positive.remaining)
        suggestions.push({
          id: `rec-${period}-${counter++}`,
          kind: 'movimiento',
          suggestedType: 'movimiento',
          categoryId: category.id,
          originLotId: negative.lotId,
          destinationLotId: positive.lotId,
          quantity,
          explanation: `La baja de ${quantity} ${category.shortName.toLowerCase()} en ${negative.lotId} coincide con el aumento en ${positive.lotId}.`,
          confidence: 'alta',
        })
        negative.remaining -= quantity
        positive.remaining -= quantity
        deltas.set(negative.key, -negative.remaining)
        deltas.set(positive.key, positive.remaining)
      })
    })
  })

  // Then look for category changes within the same lot.
  LOTS.forEach((lot) => {
    const negatives = [...deltas.entries()]
      .filter(([key, value]) => splitKey(key).lotId === lot.id && value < 0)
      .map(([key, value]) => ({ key, remaining: -value, ...splitKey(key) }))
    const positives = [...deltas.entries()]
      .filter(([key, value]) => splitKey(key).lotId === lot.id && value > 0)
      .map(([key, value]) => ({ key, remaining: value, ...splitKey(key) }))

    negatives.forEach((negative) => {
      positives.forEach((positive) => {
        if (!negative.remaining || !positive.remaining || negative.categoryId === positive.categoryId) return
        const quantity = Math.min(negative.remaining, positive.remaining)
        const fromCategory = CATEGORIES.find((category) => category.id === negative.categoryId)
        const toCategory = CATEGORIES.find((category) => category.id === positive.categoryId)
        suggestions.push({
          id: `rec-${period}-${counter++}`,
          kind: 'reclasificacion',
          suggestedType: 'reclasificacion',
          categoryId: negative.categoryId,
          destinationCategoryId: positive.categoryId,
          originLotId: lot.id,
          destinationLotId: lot.id,
          quantity,
          explanation: `En ${lot.name} bajan ${quantity} ${fromCategory?.shortName.toLowerCase()} y suben ${quantity} ${toCategory?.shortName.toLowerCase()}.`,
          confidence: 'media',
        })
        negative.remaining -= quantity
        positive.remaining -= quantity
        deltas.set(negative.key, -negative.remaining)
        deltas.set(positive.key, positive.remaining)
      })
    })
  })

  // Anything left requires a user decision.
  ;[...deltas.entries()].forEach(([key, delta]) => {
    if (!delta) return
    const { lotId, categoryId } = splitKey(key)
    const category = CATEGORIES.find((item) => item.id === categoryId)
    if (delta < 0) {
      const quantity = -delta
      const suggestedType = defaultExitType(categoryId)
      suggestions.push({
        id: `rec-${period}-${counter++}`,
        kind: 'salida',
        suggestedType,
        categoryId,
        originLotId: lotId,
        quantity,
        explanation: `Faltan explicar ${quantity} ${category?.shortName.toLowerCase()} que ya no aparecen en ${lotId}.`,
        confidence: suggestedType === 'correccion' ? 'baja' : 'media',
      })
    } else {
      const suggestedType = defaultEntryType(categoryId)
      suggestions.push({
        id: `rec-${period}-${counter++}`,
        kind: 'entrada',
        suggestedType,
        categoryId,
        destinationLotId: lotId,
        quantity: delta,
        explanation: `Aparecen ${delta} ${category?.shortName.toLowerCase()} adicionales en ${lotId}.`,
        confidence: suggestedType === 'compra' ? 'baja' : 'media',
      })
    }
  })

  const typeOrder = { movimiento: 0, reclasificacion: 1, salida: 2, entrada: 3 }
  return suggestions.sort((a, b) => typeOrder[a.kind] - typeOrder[b.kind])
}

export function suggestionToEvent(
  suggestion: ReconciliationSuggestion,
  type: AnimalEventType,
  period: string,
  options?: {
    originLotId?: string
    destinationLotId?: string
    destinationCategoryId?: string
    reason?: string
  },
): AnimalEvent {
  return {
    id: crypto.randomUUID(),
    period,
    date: periodToDate(period, 28),
    type,
    originLotId: options?.originLotId ?? suggestion.originLotId,
    destinationLotId: options?.destinationLotId ?? suggestion.destinationLotId,
    categoryId: suggestion.categoryId,
    destinationCategoryId: options?.destinationCategoryId ?? suggestion.destinationCategoryId,
    quantity: suggestion.quantity,
    reason: options?.reason ?? 'Conciliación mensual validada',
    notes: suggestion.explanation,
    source: 'inferido',
    status: 'confirmado',
    createdAt: new Date().toISOString(),
  }
}
