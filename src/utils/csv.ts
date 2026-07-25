import { CATEGORIES, LOT_ALIASES, LOTS } from '../data/config'
import type { AnimalEvent, AppState, InventoryEntry } from '../types'
import { normalizeText } from './format'

export interface InventoryImportResult {
  entries: InventoryEntry[]
  errors: string[]
  detectedPeriod?: string
}

function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim()) ?? ''
  const counts = [',', ';', '\t'].map((delimiter) => ({
    delimiter,
    count: firstLine.split(delimiter).length,
  }))
  return counts.sort((a, b) => b.count - a.count)[0]?.delimiter ?? ','
}

export function parseDelimited(text: string, forcedDelimiter?: string): string[][] {
  const delimiter = forcedDelimiter ?? detectDelimiter(text)
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const next = text[index + 1]

    if (char === '"' && quoted && next === '"') {
      field += '"'
      index += 1
    } else if (char === '"') {
      quoted = !quoted
    } else if (char === delimiter && !quoted) {
      row.push(field.trim())
      field = ''
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') index += 1
      row.push(field.trim())
      field = ''
      if (row.some((cell) => cell.length)) rows.push(row)
      row = []
    } else {
      field += char
    }
  }

  row.push(field.trim())
  if (row.some((cell) => cell.length)) rows.push(row)
  return rows
}

function normalizeHeader(value: string): string {
  return normalizeText(value).replace(/-/g, '_')
}

function resolveLot(value: string): string | undefined {
  const upper = value.trim().toUpperCase().replace(/\s+/g, ' ')
  if (LOT_ALIASES[upper]) return LOT_ALIASES[upper]
  const normalized = upper.replace('/', '-').replace(/\sY\s/g, '-')
  if (LOTS.some((lot) => lot.id === normalized)) return normalized
  if (/^ER-\d$/.test(normalized)) {
    const padded = normalized.replace(/^ER-(\d)$/, 'ER-0$1')
    if (LOTS.some((lot) => lot.id === padded)) return padded
  }
  return LOTS.find((lot) => lot.name.toUpperCase() === upper)?.id
}

function resolveCategory(value: string): string | undefined {
  const normalized = normalizeText(value)
  const exact = CATEGORIES.find(
    (category) =>
      normalizeText(category.id) === normalized ||
      normalizeText(category.name) === normalized ||
      normalizeText(category.shortName) === normalized,
  )
  if (exact) return exact.id

  const aliases: Record<string, string> = {
    toro: 'toros-reproductores',
    toros: 'toros-reproductores',
    vaca: 'vacas-cria',
    vacas: 'vacas-cria',
    'vaca-nueva': 'vacas-cria',
    vaquillona: 'vaquillonas-reposicion',
    vaquillonas: 'vaquillonas-reposicion',
    reposicion: 'vaquillonas-reposicion',
    ternero: 'terneros',
    ternera: 'terneras',
    novillo: 'machos-recria-engorde',
    novillito: 'machos-recria-engorde',
    'vacas-cut': 'vacas-ultimo-ternero',
    cut: 'vacas-ultimo-ternero',
    'hembra-no-cria': 'hembras-fuera-cria',
  }
  return aliases[normalized]
}

export function importInventoryCSV(text: string, fallbackPeriod: string): InventoryImportResult {
  const rows = parseDelimited(text)
  const errors: string[] = []
  if (!rows.length) return { entries: [], errors: ['El archivo está vacío.'] }

  const headers = rows[0].map(normalizeHeader)
  const indexes = {
    period: headers.findIndex((header) => ['period', 'periodo', 'mes'].includes(header)),
    lot: headers.findIndex((header) => ['lot', 'lote', 'potrero'].includes(header)),
    category: headers.findIndex((header) => ['category', 'categoria'].includes(header)),
    quantity: headers.findIndex((header) => ['quantity', 'cantidad', 'cabezas', 'animales'].includes(header)),
    groupName: headers.findIndex((header) => ['group_name', 'grupo', 'nombre_grupo'].includes(header)),
    birthYear: headers.findIndex((header) => ['birth_year', 'anio_nacimiento', 'ano_nacimiento'].includes(header)),
    ageRange: headers.findIndex((header) => ['age_range', 'rango_edad', 'edad'].includes(header)),
    healthStatus: headers.findIndex((header) => ['health_status', 'estado_salud', 'salud'].includes(header)),
    reproductiveStatus: headers.findIndex((header) => ['reproductive_status', 'estado_reproductivo', 'reproduccion'].includes(header)),
    breed: headers.findIndex((header) => ['breed', 'raza'].includes(header)),
    notes: headers.findIndex((header) => ['notes', 'notas', 'observaciones'].includes(header)),
  }

  if (indexes.lot < 0 || indexes.category < 0 || indexes.quantity < 0) {
    return {
      entries: [],
      errors: ['La plantilla debe incluir las columnas lote, categoria y cantidad.'],
    }
  }

  const entries: InventoryEntry[] = []
  let detectedPeriod: string | undefined

  rows.slice(1).forEach((row, index) => {
    const line = index + 2
    const period = indexes.period >= 0 && row[indexes.period] ? row[indexes.period].slice(0, 7) : fallbackPeriod
    const lotId = resolveLot(row[indexes.lot] ?? '')
    const categoryId = resolveCategory(row[indexes.category] ?? '')
    const quantity = Number(String(row[indexes.quantity] ?? '').replace(',', '.'))

    if (!/^\d{4}-\d{2}$/.test(period)) {
      errors.push(`Fila ${line}: período inválido. Usá AAAA-MM.`)
      return
    }
    if (!lotId) {
      errors.push(`Fila ${line}: lote no reconocido (${row[indexes.lot] ?? ''}).`)
      return
    }
    if (!categoryId) {
      errors.push(`Fila ${line}: categoría no reconocida (${row[indexes.category] ?? ''}).`)
      return
    }
    if (!Number.isFinite(quantity) || quantity < 0) {
      errors.push(`Fila ${line}: cantidad inválida.`)
      return
    }

    detectedPeriod ??= period
    const optional = (position: number) => (position >= 0 ? row[position] || undefined : undefined)
    const birthYearRaw = optional(indexes.birthYear)
    const birthYear = birthYearRaw ? Number(birthYearRaw) : undefined
    entries.push({
      id: crypto.randomUUID(),
      period,
      lotId,
      categoryId,
      quantity: Math.round(quantity),
      groupName: optional(indexes.groupName),
      birthYear: birthYear && Number.isFinite(birthYear) ? birthYear : undefined,
      ageRange: optional(indexes.ageRange),
      healthStatus: optional(indexes.healthStatus),
      reproductiveStatus: optional(indexes.reproductiveStatus),
      breed: optional(indexes.breed),
      notes: optional(indexes.notes),
    })
  })

  return { entries, errors, detectedPeriod }
}

function escapeCSV(value: unknown): string {
  const text = value === undefined || value === null ? '' : String(value)
  if (/[",;\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

export function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escapeCSV(row[header])).join(',')),
  ].join('\n')
}

export function inventoryToCSV(state: AppState, period?: string): string {
  const rows = state.inventory
    .filter((entry) => !period || entry.period === period)
    .sort((a, b) => a.period.localeCompare(b.period) || a.lotId.localeCompare(b.lotId))
    .map((entry) => ({
      periodo: entry.period,
      lote: LOTS.find((lot) => lot.id === entry.lotId)?.name ?? entry.lotId,
      categoria: CATEGORIES.find((category) => category.id === entry.categoryId)?.name ?? entry.categoryId,
      cantidad: entry.quantity,
      nombre_grupo: entry.groupName ?? '',
      anio_nacimiento: entry.birthYear ?? '',
      rango_edad: entry.ageRange ?? '',
      estado_salud: entry.healthStatus ?? '',
      estado_reproductivo: entry.reproductiveStatus ?? '',
      raza: entry.breed ?? '',
      notas: entry.notes ?? '',
    }))
  return toCSV(rows)
}

export function eventsToCSV(events: AnimalEvent[]): string {
  return toCSV(
    events.map((event) => ({
      fecha: event.date,
      periodo: event.period,
      tipo_evento: event.type,
      lote_origen: event.originLotId ?? '',
      lote_destino: event.destinationLotId ?? '',
      categoria: CATEGORIES.find((category) => category.id === event.categoryId)?.name ?? event.categoryId,
      categoria_destino: event.destinationCategoryId
        ? CATEGORIES.find((category) => category.id === event.destinationCategoryId)?.name ?? event.destinationCategoryId
        : '',
      cantidad: event.quantity,
      motivo: event.reason ?? '',
      notas: event.notes ?? '',
      origen_registro: event.source,
      estado: event.status,
    })),
  )
}

export function rainToCSV(state: AppState): string {
  return toCSV(
    [...state.rain]
      .sort((a, b) => a.period.localeCompare(b.period))
      .map((record) => ({ periodo: record.period, lluvia_mm: record.millimeters })),
  )
}

export function pastureToCSV(state: AppState): string {
  return toCSV(
    state.pastures.map((pasture) => ({
      lote: pasture.lotId,
      area: pasture.name,
      hectareas: pasture.hectares,
      tipo: pasture.type,
      anio_siembra: pasture.plantingYear ?? '',
      condicion: pasture.condition,
      notas: pasture.notes ?? '',
    })),
  )
}

export function downloadTextFile(filename: string, content: string, mime = 'text/csv;charset=utf-8') {
  const prefix = mime.includes('csv') ? '\uFEFF' : ''
  const blob = new Blob([prefix, content], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export const INVENTORY_TEMPLATE = `periodo,lote,categoria,cantidad,nombre_grupo,anio_nacimiento,rango_edad,estado_salud,estado_reproductivo,raza,notas
2026-07,ER-01,Vacas de cría,80,Grupo principal,2021,,Saludable,Preñada,,
2026-07,ER-01,Terneros,40,,2026,,Saludable,,,
2026-07,ER-01,Toros reproductores,2,,2022,,Saludable,En servicio,,`

export const EVENTS_TEMPLATE = `fecha,tipo_evento,lote_origen,lote_destino,categoria,cantidad,motivo,notas
2026-07-15,movimiento,ER-12,ER-06,Vacas de cría,40,Ajuste de carga,
2026-07-18,venta,ER-14,,Vacas de último ternero (CUT),20,Venta anual,`
