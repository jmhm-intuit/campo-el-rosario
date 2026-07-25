export type ViewKey =
  | 'resumen'
  | 'carga'
  | 'mapa'
  | 'animales'
  | 'movimientos'
  | 'pasturas'
  | 'historico'
  | 'alertas'
  | 'respaldo'

export type MonthStatus = 'borrador' | 'revision' | 'cerrado'

export type AnimalEventType =
  | 'movimiento'
  | 'nacimiento'
  | 'muerte'
  | 'venta'
  | 'compra'
  | 'reclasificacion'
  | 'correccion'

export type EventStatus = 'pendiente' | 'confirmado' | 'rechazado'

export type EventSource = 'manual' | 'inferido' | 'importado'

export interface Lot {
  id: string
  name: string
  hectares: number
  shortName: string
  sector: 'norte' | 'centro' | 'sur'
}

export interface AnimalCategory {
  id: string
  name: string
  shortName: string
  loadFactor: number
  color: string
  description: string
}

export interface InventoryEntry {
  id: string
  period: string
  lotId: string
  categoryId: string
  quantity: number
  groupName?: string
  birthYear?: number
  ageRange?: string
  healthStatus?: string
  reproductiveStatus?: string
  breed?: string
  notes?: string
}

export interface AnimalEvent {
  id: string
  period: string
  date: string
  type: AnimalEventType
  originLotId?: string
  destinationLotId?: string
  categoryId: string
  destinationCategoryId?: string
  quantity: number
  reason?: string
  notes?: string
  source: EventSource
  status: EventStatus
  createdAt: string
}

export interface RainRecord {
  period: string
  millimeters: number
}

export type PastureType =
  | 'campo-natural'
  | 'avena'
  | 'sorgo'
  | 'rastrojo'
  | 'pastura-mejorada'
  | 'lotus'
  | 'descanso'
  | 'sin-informacion'

export type PastureCondition = 'muy-buena' | 'buena' | 'normal' | 'regular' | 'degradada'

export interface PastureArea {
  id: string
  lotId: string
  name: string
  hectares: number
  type: PastureType
  plantingYear?: number
  condition: PastureCondition
  notes?: string
}

export interface MonthRecord {
  period: string
  status: MonthStatus
  closedAt?: string
  reopenedReason?: string
}

export interface AppState {
  schemaVersion: number
  selectedPeriod: string
  inventory: InventoryEntry[]
  events: AnimalEvent[]
  rain: RainRecord[]
  pastures: PastureArea[]
  months: MonthRecord[]
  userName: string
  seededDemoData: boolean
  updatedAt: string
}

export interface LotMetric {
  lotId: string
  animals: number
  equivalents: number
  loadPerHa: number
  capacityUse: number
  previousAnimals: number
  animalChange: number
}

export type CapacityStatus = 'baja' | 'adecuada' | 'alta' | 'sobrecarga' | 'critica' | 'sin-datos'

export interface ReconciliationSuggestion {
  id: string
  kind: 'movimiento' | 'reclasificacion' | 'salida' | 'entrada'
  suggestedType: AnimalEventType
  categoryId: string
  destinationCategoryId?: string
  originLotId?: string
  destinationLotId?: string
  quantity: number
  explanation: string
  confidence: 'alta' | 'media' | 'baja'
}

export interface AlertItem {
  id: string
  severity: 'critica' | 'advertencia' | 'informativa'
  title: string
  description: string
  lotId?: string
  actionLabel?: string
}
