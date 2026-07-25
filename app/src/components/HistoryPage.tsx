import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, CalendarRange, CloudRain, Scale, UsersRound } from 'lucide-react'
import { LOTS, TOTAL_HECTARES } from '../data/config'
import { useCampo } from '../data/CampoStore'
import {
  annualRain,
  metricForLot,
  totalAnimalsForPeriod,
  totalEquivalentsForPeriod,
} from '../utils/calculations'
import { formatDecimal, formatNumber, formatPeriod, previousPeriod } from '../utils/format'
import { LoadHistoryChart, RainHistoryChart } from './Charts'
import { RanchMap } from './RanchMap'
import { Badge, Panel } from './UI'

function ComparisonValue({ current, previous, suffix = '' }: { current: number; previous: number; suffix?: string }) {
  const delta = current - previous
  const positive = delta > 0
  const negative = delta < 0
  return (
    <div className="comparison-value">
      <strong>{formatNumber(current)}{suffix}</strong>
      <span className={positive ? 'positive' : negative ? 'negative' : ''}>
        {positive ? <ArrowUpRight size={14} /> : negative ? <ArrowDownRight size={14} /> : null}
        {delta > 0 ? '+' : ''}{formatNumber(delta)}{suffix}
      </span>
    </div>
  )
}

export function HistoryPage() {
  const { state } = useCampo()
  const period = state.selectedPeriod
  const periods = [...new Set([...state.months.map((month) => month.period), ...state.inventory.map((entry) => entry.period)])].sort().reverse()
  const defaultCompare = periods.includes(previousPeriod(period)) ? previousPeriod(period) : periods.find((item) => item !== period) ?? period
  const [comparePeriod, setComparePeriod] = useState(defaultCompare)

  const currentAnimals = totalAnimalsForPeriod(state, period)
  const compareAnimals = totalAnimalsForPeriod(state, comparePeriod)
  const currentLoad = totalEquivalentsForPeriod(state, period) / TOTAL_HECTARES
  const compareLoad = totalEquivalentsForPeriod(state, comparePeriod) / TOTAL_HECTARES
  const currentRain = state.rain.find((record) => record.period === period)?.millimeters ?? 0
  const compareRain = state.rain.find((record) => record.period === comparePeriod)?.millimeters ?? 0

  const rows = useMemo(
    () =>
      LOTS.map((lot) => ({
        lot,
        current: metricForLot(state, period, lot.id),
        previous: metricForLot(state, comparePeriod, lot.id),
      })).sort((a, b) => Math.abs(b.current.animals - b.previous.animals) - Math.abs(a.current.animals - a.previous.animals)),
    [state, period, comparePeriod],
  )

  return (
    <div className="history-page page-stack">
      <section className="comparison-toolbar">
        <div><CalendarRange size={24} /><span><strong>Comparación histórica</strong><small>Mes a mes o mismo período entre años</small></span></div>
        <label>Período actual<input type="month" value={period} disabled /></label>
        <span>vs.</span>
        <label>Comparar con<select value={comparePeriod} onChange={(event) => setComparePeriod(event.target.value)}>{periods.filter((item) => item !== period).map((item) => <option key={item} value={item}>{formatPeriod(item)}</option>)}</select></label>
      </section>

      <div className="history-kpis">
        <article><UsersRound size={23} /><span><small>Animales</small><ComparisonValue current={currentAnimals} previous={compareAnimals} /></span></article>
        <article><Scale size={23} /><span><small>Carga animal</small><div className="comparison-value"><strong>{formatDecimal(currentLoad, 2)} EV/ha</strong><span className={currentLoad > compareLoad ? 'positive' : currentLoad < compareLoad ? 'negative' : ''}>{currentLoad > compareLoad ? '+' : ''}{formatDecimal(currentLoad - compareLoad, 2)}</span></div></span></article>
        <article><CloudRain size={23} /><span><small>Lluvia mensual</small><ComparisonValue current={currentRain} previous={compareRain} suffix=" mm" /></span></article>
        <article><CloudRain size={23} /><span><small>Lluvia anual acumulada</small><ComparisonValue current={annualRain(state, period)} previous={annualRain(state, comparePeriod)} suffix=" mm" /></span></article>
      </div>

      <div className="history-maps-grid">
        <Panel title={formatPeriod(comparePeriod)} action={<Badge tone="neutral">Base de comparación</Badge>}>
          <RanchMap state={state} period={comparePeriod} compact showModeSelector={false} />
        </Panel>
        <Panel title={formatPeriod(period)} action={<Badge tone="info">Período actual</Badge>}>
          <RanchMap state={state} period={period} compact showModeSelector={false} />
        </Panel>
      </div>

      <div className="two-column-page">
        <Panel title="Evolución de carga animal"><LoadHistoryChart state={state} /></Panel>
        <Panel title="Lluvia mensual"><RainHistoryChart state={state} /></Panel>
      </div>

      <Panel title="Cambio de animales por lote">
        <div className="responsive-table">
          <table>
            <thead><tr><th>Lote</th><th>{formatPeriod(comparePeriod)}</th><th>{formatPeriod(period)}</th><th>Cambio</th><th>Carga anterior</th><th>Carga actual</th></tr></thead>
            <tbody>
              {rows.map(({ lot, current, previous }) => {
                const delta = current.animals - previous.animals
                return (
                  <tr key={lot.id}>
                    <td><strong>{lot.name}</strong><small>{lot.hectares} ha</small></td>
                    <td>{formatNumber(previous.animals)}</td>
                    <td>{formatNumber(current.animals)}</td>
                    <td className={delta > 0 ? 'positive' : delta < 0 ? 'negative' : ''}>{delta > 0 ? '+' : ''}{delta}</td>
                    <td>{formatDecimal(previous.loadPerHa, 2)} EV/ha</td>
                    <td>{formatDecimal(current.loadPerHa, 2)} EV/ha</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
