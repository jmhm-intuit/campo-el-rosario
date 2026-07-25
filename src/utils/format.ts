export function formatNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat('es-AR', { maximumFractionDigits }).format(value)
}

export function formatDecimal(value: number, digits = 2): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

export function formatPeriod(period: string): string {
  const [year, month] = period.split('-').map(Number)
  if (!year || !month) return period
  return new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1))
}

export function formatShortPeriod(period: string): string {
  const [year, month] = period.split('-').map(Number)
  if (!year || !month) return period
  const result = new Intl.DateTimeFormat('es-AR', { month: 'short' }).format(new Date(year, month - 1, 1))
  return result.replace('.', '')
}

export function previousPeriod(period: string): string {
  const [year, month] = period.split('-').map(Number)
  const date = new Date(year, month - 2, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function nextPeriod(period: string): string {
  const [year, month] = period.split('-').map(Number)
  const date = new Date(year, month, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function periodToDate(period: string, day = 1): string {
  return `${period}-${String(day).padStart(2, '0')}`
}

export function formatDate(date: string): string {
  if (!date) return '—'
  const parsed = new Date(`${date}T12:00:00`)
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(parsed)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[\s_/]+/g, '-')
}
