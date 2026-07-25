import { CATEGORIES, SCHEMA_VERSION } from './config'
import type { AppState, InventoryEntry, PastureArea } from '../types'

const PERIODS = ['2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07']

const juneMatrix: Record<string, Record<string, number>> = {
  'ER-01': { 'vacas-cria': 80, 'toros-reproductores': 2, 'vacas-ultimo-ternero': 116 },
  'ER-02': { 'vacas-cria': 140, terneros: 55, terneras: 56, 'toros-reproductores': 4, 'vacas-ultimo-ternero': 2 },
  'ER-03': { 'vacas-cria': 92, 'toros-reproductores': 3 },
  'ER-04': {},
  'ER-05': {},
  'ER-06': {},
  'ER-07': {},
  'ER-08-09': {},
  'ER-10': { 'hembras-fuera-cria': 63 },
  'ER-11': { 'vacas-cria': 2, 'vaquillonas-reposicion': 8, terneros: 2, 'toros-reproductores': 1 },
  'ER-12': { terneros: 115, terneras: 136, 'machos-recria-engorde': 16, 'toros-reproductores': 7 },
  'ER-13': { 'vaquillonas-reposicion': 53, 'hembras-fuera-cria': 18 },
  'ER-14': { 'vacas-cria': 35, terneros: 35, terneras: 12, 'vacas-ultimo-ternero': 9 },
  'ER-15-16': { 'vacas-ultimo-ternero': 117, 'machos-recria-engorde': 7 },
  'ER-17': {},
  'ER-18': { 'vaquillonas-reposicion': 249, 'toros-reproductores': 11 },
  'ER-19': { 'vacas-cria': 86, terneros: 35, terneras: 35, 'toros-reproductores': 1 },
  'ER-20-21': { terneros: 122, terneras: 122 },
}

const cloneMatrix = (matrix: Record<string, Record<string, number>>) =>
  Object.fromEntries(Object.entries(matrix).map(([lot, values]) => [lot, { ...values }]))

const julyMatrix = cloneMatrix(juneMatrix)
julyMatrix['ER-02']['vacas-cria'] = 100
julyMatrix['ER-06']['vacas-cria'] = 40
julyMatrix['ER-01']['vacas-ultimo-ternero'] = 96
julyMatrix['ER-19'].terneras = 50
julyMatrix['ER-12'].terneros = 112
// Deliberately left without an event so the reconciliation screen has one useful suggestion.
julyMatrix['ER-18']['vaquillonas-reposicion'] = 239
julyMatrix['ER-13']['vaquillonas-reposicion'] = 63

function matrixToEntries(period: string, matrix: Record<string, Record<string, number>>): InventoryEntry[] {
  return Object.entries(matrix).flatMap(([lotId, categories]) =>
    Object.entries(categories)
      .filter(([, quantity]) => quantity > 0)
      .map(([categoryId, quantity]) => ({
        id: `${period}-${lotId}-${categoryId}`,
        period,
        lotId,
        categoryId,
        quantity,
      })),
  )
}

function scaledEntries(period: string, factor: number): InventoryEntry[] {
  const scaled = cloneMatrix(juneMatrix)
  Object.values(scaled).forEach((categoryMap) => {
    Object.keys(categoryMap).forEach((categoryId) => {
      categoryMap[categoryId] = Math.max(0, Math.round(categoryMap[categoryId] * factor))
    })
  })
  return matrixToEntries(period, scaled)
}

const pastures: PastureArea[] = [
  { id: 'p-er02-1', lotId: 'ER-02', name: 'Rastrojo norte', hectares: 13.5, type: 'rastrojo', plantingYear: 2026, condition: 'normal' },
  { id: 'p-er03-1', lotId: 'ER-03', name: 'Rastrojo central', hectares: 26, type: 'rastrojo', plantingYear: 2026, condition: 'buena' },
  { id: 'p-er04-1', lotId: 'ER-04', name: 'Avena 1', hectares: 27, type: 'avena', plantingYear: 2026, condition: 'muy-buena' },
  { id: 'p-er05-1', lotId: 'ER-05', name: 'Avena 2', hectares: 47, type: 'avena', plantingYear: 2026, condition: 'muy-buena' },
  { id: 'p-er06-1', lotId: 'ER-06', name: 'Rastrojo chico', hectares: 7, type: 'rastrojo', plantingYear: 2026, condition: 'normal' },
  { id: 'p-er08-1', lotId: 'ER-08-09', name: 'Rastrojo manga', hectares: 10, type: 'rastrojo', plantingYear: 2026, condition: 'regular' },
  { id: 'p-er08-2', lotId: 'ER-08-09', name: 'Sorgo manga', hectares: 5, type: 'sorgo', plantingYear: 2026, condition: 'buena' },
  { id: 'p-er10-1', lotId: 'ER-10', name: 'Avena centro', hectares: 16.8, type: 'avena', plantingYear: 2026, condition: 'buena' },
  { id: 'p-er13-1', lotId: 'ER-13', name: 'Rastrojo oeste', hectares: 5, type: 'rastrojo', plantingYear: 2026, condition: 'regular' },
  { id: 'p-er14-1', lotId: 'ER-14', name: 'Rastrojo grande', hectares: 20, type: 'rastrojo', plantingYear: 2026, condition: 'normal' },
  { id: 'p-er14-2', lotId: 'ER-14', name: 'Sorgo sur', hectares: 15, type: 'sorgo', plantingYear: 2026, condition: 'buena' },
  { id: 'p-er15-1', lotId: 'ER-15-16', name: 'Rastrojo angosto', hectares: 10, type: 'rastrojo', plantingYear: 2026, condition: 'normal' },
  { id: 'p-er18-1', lotId: 'ER-18', name: 'Avena sur', hectares: 36, type: 'avena', plantingYear: 2026, condition: 'muy-buena' },
]

export function createDemoState(): AppState {
  const inventory = [
    ...scaledEntries('2025-12', 0.91),
    ...scaledEntries('2026-01', 0.93),
    ...scaledEntries('2026-02', 0.95),
    ...scaledEntries('2026-03', 0.97),
    ...scaledEntries('2026-04', 0.99),
    ...scaledEntries('2026-05', 1.01),
    ...matrixToEntries('2026-06', juneMatrix),
    ...matrixToEntries('2026-07', julyMatrix),
  ]

  return {
    schemaVersion: SCHEMA_VERSION,
    selectedPeriod: '2026-07',
    inventory,
    events: [
      {
        id: 'event-move-40',
        period: '2026-07',
        date: '2026-07-04',
        type: 'movimiento',
        originLotId: 'ER-02',
        destinationLotId: 'ER-06',
        categoryId: 'vacas-cria',
        quantity: 40,
        reason: 'Ajuste de carga',
        source: 'manual',
        status: 'confirmado',
        createdAt: '2026-07-04T12:00:00.000Z',
      },
      {
        id: 'event-sale-20',
        period: '2026-07',
        date: '2026-07-09',
        type: 'venta',
        originLotId: 'ER-01',
        categoryId: 'vacas-ultimo-ternero',
        quantity: 20,
        reason: 'Venta programada de vacas CUT',
        source: 'manual',
        status: 'confirmado',
        createdAt: '2026-07-09T12:00:00.000Z',
      },
      {
        id: 'event-birth-15',
        period: '2026-07',
        date: '2026-07-12',
        type: 'nacimiento',
        destinationLotId: 'ER-19',
        categoryId: 'terneras',
        quantity: 15,
        reason: 'Parición',
        source: 'manual',
        status: 'confirmado',
        createdAt: '2026-07-12T12:00:00.000Z',
      },
      {
        id: 'event-death-3',
        period: '2026-07',
        date: '2026-07-18',
        type: 'muerte',
        originLotId: 'ER-12',
        categoryId: 'terneros',
        quantity: 3,
        reason: 'Mortandad registrada',
        source: 'manual',
        status: 'confirmado',
        createdAt: '2026-07-18T12:00:00.000Z',
      },
    ],
    rain: [
      { period: '2025-12', millimeters: 46 },
      { period: '2026-01', millimeters: 61 },
      { period: '2026-02', millimeters: 73 },
      { period: '2026-03', millimeters: 98 },
      { period: '2026-04', millimeters: 88 },
      { period: '2026-05', millimeters: 44 },
      { period: '2026-06', millimeters: 57 },
      { period: '2026-07', millimeters: 82 },
    ],
    pastures,
    months: PERIODS.map((period) => ({
      period,
      status: period === '2026-07' ? 'revision' : 'cerrado',
      closedAt: period === '2026-07' ? undefined : `${period}-28T18:00:00.000Z`,
    })),
    userName: 'Juan',
    seededDemoData: true,
    updatedAt: new Date().toISOString(),
  }
}

export const CATEGORY_IDS = CATEGORIES.map((category) => category.id)
