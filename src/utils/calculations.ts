import { CATEGORIES, LOTS, TARGET_LOAD_PER_HA, TOTAL_HECTARES } from '../data/config'
import type {
  AlertItem,
  AppState,
  CapacityStatus,
  InventoryEntry,
  LotMetric,
} from '../types'
import { previousPeriod } from './format'

export function entriesForPeriod(state: AppState, period: string): InventoryEntry[] {
  return state.inventory.filter((entry) => entry.period === period)
}

export function quantityFor(
  state: AppState,
  period: string,
  lotId: string,
  categoryId: string,
): number {
  return state.inventory
    .filter((entry) => entry.period === period && entry.lotId === lotId && entry.categoryId === categoryId)
    .reduce((sum, entry) => sum + entry.quantity, 0)
}

export function categoryFactor(categoryId: string): number {
  return CATEGORIES.find((category) => category.id === categoryId)?.loadFactor ?? 1
}

export function totalAnimalsForPeriod(state: AppState, period: string): number {
  return entriesForPeriod(state, period).reduce((sum, entry) => sum + entry.quantity, 0)
}

export function totalEquivalentsForPeriod(state: AppState, period: string): number {
  return entriesForPeriod(state, period).reduce(
    (sum, entry) => sum + entry.quantity * categoryFactor(entry.categoryId),
    0,
  )
}

export function totalLoadForPeriod(state: AppState, period: string): number {
  return totalEquivalentsForPeriod(state, period) / TOTAL_HECTARES
}

export function metricForLot(state: AppState, period: string, lotId: string): LotMetric {
  const lot = LOTS.find((candidate) => candidate.id === lotId)
  const current = entriesForPeriod(state, period).filter((entry) => entry.lotId === lotId)
  const prev = entriesForPeriod(state, previousPeriod(period)).filter((entry) => entry.lotId === lotId)
  const animals = current.reduce((sum, entry) => sum + entry.quantity, 0)
  const equivalents = current.reduce(
    (sum, entry) => sum + entry.quantity * categoryFactor(entry.categoryId),
    0,
  )
  const previousAnimals = prev.reduce((sum, entry) => sum + entry.quantity, 0)
  const hectares = lot?.hectares ?? 0
  const loadPerHa = hectares ? equivalents / hectares : 0
  return {
    lotId,
    animals,
    equivalents,
    loadPerHa,
    capacityUse: TARGET_LOAD_PER_HA ? loadPerHa / TARGET_LOAD_PER_HA : 0,
    previousAnimals,
    animalChange: animals - previousAnimals,
  }
}

export function metricsForPeriod(state: AppState, period: string): LotMetric[] {
  return LOTS.map((lot) => metricForLot(state, period, lot.id))
}

export function capacityStatus(loadPerHa: number, animals: number): CapacityStatus {
  if (!animals) return 'sin-datos'
  const use = loadPerHa / TARGET_LOAD_PER_HA
  if (use < 0.7) return 'baja'
  if (use <= 1) return 'adecuada'
  if (use <= 1.25) return 'alta'
  if (use <= 1.5) return 'sobrecarga'
  return 'critica'
}

export const CAPACITY_COLORS: Record<CapacityStatus, string> = {
  baja: '#6f983c',
  adecuada: '#8cb65f',
  alta: '#e5bb25',
  sobrecarga: '#e97e24',
  critica: '#c84527',
  'sin-datos': '#8f958b',
}

export const CAPACITY_LABELS: Record<CapacityStatus, string> = {
  baja: 'Baja',
  adecuada: 'Adecuada',
  alta: 'Alta',
  sobrecarga: 'Sobrecarga',
  critica: 'Crítica',
  'sin-datos': 'Sin animales',
}

export function categoryDistribution(state: AppState, period: string) {
  const entries = entriesForPeriod(state, period)
  return CATEGORIES.map((category) => ({
    ...category,
    quantity: entries
      .filter((entry) => entry.categoryId === category.id)
      .reduce((sum, entry) => sum + entry.quantity, 0),
  })).filter((item) => item.quantity > 0)
}

export function eventTotals(state: AppState, period: string) {
  const confirmed = state.events.filter((event) => event.period === period && event.status === 'confirmado')
  const total = (type: string) =>
    confirmed.filter((event) => event.type === type).reduce((sum, event) => sum + event.quantity, 0)
  return {
    births: total('nacimiento'),
    deaths: total('muerte'),
    sales: total('venta'),
    purchases: total('compra'),
    movements: confirmed.filter((event) => event.type === 'movimiento').length,
    reclassifications: confirmed.filter((event) => event.type === 'reclasificacion').length,
    corrections: confirmed.filter((event) => event.type === 'correccion').length,
  }
}

export function annualRain(state: AppState, period: string): number {
  const year = period.slice(0, 4)
  return state.rain
    .filter((record) => record.period.startsWith(year) && record.period <= period)
    .reduce((sum, record) => sum + record.millimeters, 0)
}

export function buildAlerts(state: AppState, period: string): AlertItem[] {
  const alerts: AlertItem[] = []
  const metrics = metricsForPeriod(state, period)

  metrics.forEach((metric) => {
    const lot = LOTS.find((candidate) => candidate.id === metric.lotId)
    const status = capacityStatus(metric.loadPerHa, metric.animals)
    if (status === 'critica') {
      alerts.push({
        id: `load-critical-${metric.lotId}`,
        severity: 'critica',
        title: `Sobrecarga crítica en ${lot?.name}`,
        description: `${metric.loadPerHa.toFixed(2)} EV/ha frente a un objetivo de ${TARGET_LOAD_PER_HA.toFixed(2)}.`,
        lotId: metric.lotId,
        actionLabel: 'Ver lote',
      })
    } else if (status === 'sobrecarga' || status === 'alta') {
      alerts.push({
        id: `load-high-${metric.lotId}`,
        severity: 'advertencia',
        title: `Carga elevada en ${lot?.name}`,
        description: `${metric.loadPerHa.toFixed(2)} EV/ha. Revisar distribución o capacidad disponible.`,
        lotId: metric.lotId,
        actionLabel: 'Revisar',
      })
    }
  })

  const rain = state.rain.find((record) => record.period === period)?.millimeters
  if (rain === undefined) {
    alerts.push({
      id: `rain-missing-${period}`,
      severity: 'advertencia',
      title: 'Falta cargar la lluvia del mes',
      description: 'Ingresá un valor para completar la revisión mensual.',
    })
  } else if (rain < 50) {
    alerts.push({
      id: `rain-low-${period}`,
      severity: 'informativa',
      title: 'Lluvia mensual baja',
      description: `${rain} mm registrados. Comparar con la condición de las pasturas.`,
    })
  }

  const unresolved = state.events.filter((event) => event.period === period && event.status === 'pendiente')
  if (unresolved.length) {
    alerts.push({
      id: `events-pending-${period}`,
      severity: 'advertencia',
      title: `${unresolved.length} movimiento${unresolved.length === 1 ? '' : 's'} pendiente${unresolved.length === 1 ? '' : 's'}`,
      description: 'Validá los movimientos antes de cerrar el mes.',
    })
  }

  const month = state.months.find((item) => item.period === period)
  if (!month || month.status !== 'cerrado') {
    alerts.push({
      id: `month-open-${period}`,
      severity: 'informativa',
      title: 'Revisión mensual abierta',
      description: 'Completá la conciliación, el resumen y las alertas para cerrar el período.',
    })
  }

  // MVP reminders; they are intentionally simple rules until the assumptions module is added.
  const monthNumber = Number(period.slice(5, 7))
  if ([7, 8].includes(monthNumber)) {
    alerts.push({
      id: `service-reminder-${period}`,
      severity: 'advertencia',
      title: 'Planificar servicio reproductivo',
      description: 'Revisar grupos de vaquillonas y definir lotes para introducir toros.',
    })
  }
  if ([2, 3, 4].includes(monthNumber)) {
    alerts.push({
      id: `planting-reminder-${period}`,
      severity: 'advertencia',
      title: 'Ventana de planificación de pasturas',
      description: 'Revisar lotes altos y superficies disponibles para siembra.',
    })
  }

  return alerts.sort((a, b) => {
    const order = { critica: 0, advertencia: 1, informativa: 2 }
    return order[a.severity] - order[b.severity]
  })
}

export function monthSummary(state: AppState, period: string) {
  const previous = previousPeriod(period)
  const opening = totalAnimalsForPeriod(state, previous)
  const closing = totalAnimalsForPeriod(state, period)
  return {
    opening,
    closing,
    change: closing - opening,
    ...eventTotals(state, period),
  }
}
