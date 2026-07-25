import { CATEGORIES, TOTAL_HECTARES } from '../data/config'
import type { AppState } from '../types'
import {
  annualRain,
  categoryDistribution,
  totalEquivalentsForPeriod,
} from '../utils/calculations'
import { clamp, formatDecimal, formatNumber, formatShortPeriod } from '../utils/format'

interface LineChartProps {
  data: { label: string; value: number }[]
  height?: number
  target?: number
  suffix?: string
}

export function LineChart({ data, height = 180, target, suffix = '' }: LineChartProps) {
  const width = 620
  const padding = { left: 42, right: 16, top: 16, bottom: 30 }
  const values = data.map((item) => item.value)
  const max = Math.max(...values, target ?? 0, 1) * 1.12
  const min = Math.min(...values, 0)
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  const x = (index: number) => padding.left + (data.length === 1 ? 0 : (index / (data.length - 1)) * chartWidth)
  const y = (value: number) => padding.top + ((max - value) / (max - min || 1)) * chartHeight
  const points = data.map((item, index) => `${x(index)},${y(item.value)}`).join(' ')
  const area = `${padding.left},${padding.top + chartHeight} ${points} ${padding.left + chartWidth},${padding.top + chartHeight}`

  return (
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Gráfico de evolución">
      <defs>
        <linearGradient id="lineArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4d803b" stopOpacity="0.34" />
          <stop offset="1" stopColor="#4d803b" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((step) => {
        const value = max - (max - min) * step
        const lineY = padding.top + chartHeight * step
        return (
          <g key={step}>
            <line x1={padding.left} x2={width - padding.right} y1={lineY} y2={lineY} stroke="#d8d4c8" strokeWidth="1" />
            <text x={padding.left - 8} y={lineY + 4} textAnchor="end" fontSize="10" fill="#76756c">
              {formatDecimal(value, value < 10 ? 1 : 0)}
            </text>
          </g>
        )
      })}
      {target !== undefined && (
        <g>
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={y(target)}
            y2={y(target)}
            stroke="#bf8a23"
            strokeWidth="1.5"
            strokeDasharray="6 5"
          />
          <text x={width - padding.right} y={y(target) - 5} textAnchor="end" fontSize="10" fill="#976715">
            Objetivo {formatDecimal(target, 1)}{suffix}
          </text>
        </g>
      )}
      <polygon points={area} fill="url(#lineArea)" />
      <polyline points={points} fill="none" stroke="#355f2c" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((item, index) => (
        <g key={`${item.label}-${index}`}>
          <circle cx={x(index)} cy={y(item.value)} r="4" fill="#f7f3e7" stroke="#355f2c" strokeWidth="2.5" />
          <text x={x(index)} y={height - 9} textAnchor="middle" fontSize="10" fill="#727168">
            {item.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

interface RainBarChartProps {
  data: { label: string; value: number }[]
  height?: number
}

export function RainBarChart({ data, height = 180 }: RainBarChartProps) {
  const width = 620
  const padding = { left: 36, right: 14, top: 16, bottom: 30 }
  const max = Math.max(...data.map((item) => item.value), 10) * 1.15
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  const slot = chartWidth / Math.max(data.length, 1)
  const barWidth = Math.min(32, slot * 0.56)

  return (
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Gráfico de lluvia">
      {[0, 0.5, 1].map((step) => {
        const lineY = padding.top + chartHeight * step
        const value = max - max * step
        return (
          <g key={step}>
            <line x1={padding.left} x2={width - padding.right} y1={lineY} y2={lineY} stroke="#d8d4c8" />
            <text x={padding.left - 7} y={lineY + 4} textAnchor="end" fontSize="10" fill="#76756c">
              {Math.round(value)}
            </text>
          </g>
        )
      })}
      {data.map((item, index) => {
        const barHeight = (item.value / max) * chartHeight
        const x = padding.left + slot * index + (slot - barWidth) / 2
        const y = padding.top + chartHeight - barHeight
        return (
          <g key={`${item.label}-${index}`}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx="4" fill="#4c7ea1" />
            <rect x={x} y={y} width={barWidth} height={Math.min(10, barHeight)} rx="4" fill="#6c9abd" />
            <text x={x + barWidth / 2} y={height - 9} textAnchor="middle" fontSize="10" fill="#727168">
              {item.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function CategoryDonut({ state, period }: { state: AppState; period: string }) {
  const distribution = categoryDistribution(state, period)
  const total = distribution.reduce((sum, item) => sum + item.quantity, 0)
  let cursor = 0
  const stops = distribution.map((item) => {
    const start = cursor
    cursor += total ? (item.quantity / total) * 100 : 0
    return `${item.color} ${start}% ${cursor}%`
  })

  return (
    <div className="donut-layout">
      <div
        className="donut"
        style={{ background: total ? `conic-gradient(${stops.join(',')})` : '#d7d6ce' }}
        aria-label={`Distribución de ${formatNumber(total)} animales`}
      >
        <div className="donut__center">
          <strong>{formatNumber(total)}</strong>
          <span>Total</span>
        </div>
      </div>
      <div className="donut-legend">
        {distribution.slice(0, 7).map((item) => (
          <div key={item.id}>
            <i style={{ background: item.color }} />
            <span>{item.shortName}</span>
            <strong>
              {formatNumber(item.quantity)} ({total ? Math.round((item.quantity / total) * 100) : 0}%)
            </strong>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LoadHistoryChart({ state }: { state: AppState }) {
  const periods = [...new Set(state.inventory.map((entry) => entry.period))].sort().slice(-12)
  const data = periods.map((period) => ({
    label: formatShortPeriod(period),
    value: totalEquivalentsForPeriod(state, period) / TOTAL_HECTARES,
  }))
  return <LineChart data={data} target={0.8} suffix=" EV/ha" />
}

export function RainHistoryChart({ state }: { state: AppState }) {
  const data = [...state.rain]
    .sort((a, b) => a.period.localeCompare(b.period))
    .slice(-12)
    .map((record) => ({ label: formatShortPeriod(record.period), value: record.millimeters }))
  return <RainBarChart data={data} />
}

export function MiniSparkline({ values, positive = true }: { values: number[]; positive?: boolean }) {
  const width = 110
  const height = 34
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * width
      const y = height - clamp((value - min) / (max - min || 1), 0, 1) * (height - 4) - 2
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg className="mini-sparkline" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline points={points} fill="none" stroke={positive ? '#4c783b' : '#b4573d'} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function AnnualRainSummary({ state, period }: { state: AppState; period: string }) {
  return <strong>{formatNumber(annualRain(state, period))} mm</strong>
}
