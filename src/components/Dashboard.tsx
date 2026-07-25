import { useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Beef,
  CloudRain,
  Droplets,
  Expand,
  Skull,
  Sprout,
  Tractor,
  Warehouse,
} from 'lucide-react'
import { CATEGORIES, LOTS, TARGET_LOAD_PER_HA, TOTAL_HECTARES } from '../data/config'
import { useCampo } from '../data/CampoStore'
import type { ViewKey } from '../types'
import {
  annualRain,
  buildAlerts,
  eventTotals,
  metricForLot,
  totalAnimalsForPeriod,
  totalLoadForPeriod,
} from '../utils/calculations'
import { formatDate, formatDecimal, formatNumber, previousPeriod } from '../utils/format'
import { AlertList } from './AlertList'
import { CategoryDonut, LoadHistoryChart, MiniSparkline } from './Charts'
import { RanchMap } from './RanchMap'
import { Badge, Panel } from './UI'

function Delta({ value, invert = false }: { value: number; invert?: boolean }) {
  const positive = invert ? value < 0 : value > 0
  const neutral = value === 0
  const Icon = neutral ? ArrowRight : positive ? ArrowUpRight : ArrowDownRight
  return (
    <span className={`kpi-delta ${neutral ? 'is-neutral' : positive ? 'is-positive' : 'is-negative'}`}>
      <Icon size={13} /> {value > 0 ? '+' : ''}{formatNumber(value)} vs. mes anterior
    </span>
  )
}

interface DashboardProps {
  onNavigate: (view: ViewKey) => void
  onOpenLot?: (lotId: string) => void
}

export function Dashboard({ onNavigate, onOpenLot }: DashboardProps) {
  const { state } = useCampo()
  const period = state.selectedPeriod
  const previous = previousPeriod(period)
  const [selectedLotId, setSelectedLotId] = useState<string>()
  const alerts = useMemo(() => buildAlerts(state, period), [state, period])
  const totals = eventTotals(state, period)
  const previousTotals = eventTotals(state, previous)
  const totalAnimals = totalAnimalsForPeriod(state, period)
  const previousAnimals = totalAnimalsForPeriod(state, previous)
  const load = totalLoadForPeriod(state, period)
  const previousLoad = totalLoadForPeriod(state, previous)
  const monthlyRain = state.rain.find((record) => record.period === period)?.millimeters ?? 0
  const previousRain = state.rain.find((record) => record.period === previous)?.millimeters ?? 0
  const recentPeriods = [...new Set(state.inventory.map((entry) => entry.period))].sort().slice(-6)
  const selectedMetric = selectedLotId ? metricForLot(state, period, selectedLotId) : undefined
  const selectedLot = LOTS.find((lot) => lot.id === selectedLotId)
  const selectedEntries = selectedLotId
    ? state.inventory.filter((entry) => entry.period === period && entry.lotId === selectedLotId)
    : []

  return (
    <div className="dashboard page-stack">
      {state.seededDemoData && (
        <div className="demo-banner">
          <span><strong>Modo demostración:</strong> estos datos de ejemplo se guardan localmente y pueden reemplazarse desde Carga de datos.</span>
          <button type="button" onClick={() => onNavigate('carga')}>Cargar datos reales <ArrowRight size={15} /></button>
        </div>
      )}

      <div className="kpi-grid">
        <article className="kpi-card">
          <span className="kpi-card__icon kpi-card__icon--brown"><Beef size={27} /></span>
          <span className="kpi-card__content">
            <small>Total animales</small>
            <strong>{formatNumber(totalAnimals)}</strong>
            <Delta value={totalAnimals - previousAnimals} />
          </span>
          <MiniSparkline values={recentPeriods.map((item) => totalAnimalsForPeriod(state, item))} />
        </article>
        <article className="kpi-card">
          <span className="kpi-card__icon kpi-card__icon--green"><Sprout size={27} /></span>
          <span className="kpi-card__content">
            <small>Carga animal</small>
            <strong>{formatDecimal(load, 2)} <em>EV/ha</em></strong>
            <Delta value={Number(((load - previousLoad) * 100).toFixed(0))} />
          </span>
          <div className="capacity-meter" title={`Objetivo ${TARGET_LOAD_PER_HA} EV/ha`}>
            <i style={{ width: `${Math.min(100, (load / (TARGET_LOAD_PER_HA * 1.5)) * 100)}%` }} />
          </div>
        </article>
        <article className="kpi-card">
          <span className="kpi-card__icon kpi-card__icon--ochre"><Beef size={25} /></span>
          <span className="kpi-card__content">
            <small>Nacimientos</small>
            <strong>{formatNumber(totals.births)}</strong>
            <Delta value={totals.births - previousTotals.births} />
          </span>
        </article>
        <article className="kpi-card">
          <span className="kpi-card__icon kpi-card__icon--red"><Skull size={25} /></span>
          <span className="kpi-card__content">
            <small>Mortandad</small>
            <strong>{formatNumber(totals.deaths)}</strong>
            <Delta value={totals.deaths - previousTotals.deaths} invert />
          </span>
        </article>
        <article className="kpi-card">
          <span className="kpi-card__icon kpi-card__icon--gold"><Tractor size={25} /></span>
          <span className="kpi-card__content">
            <small>Vendidos</small>
            <strong>{formatNumber(totals.sales)}</strong>
            <Delta value={totals.sales - previousTotals.sales} />
          </span>
        </article>
        <article className="kpi-card">
          <span className="kpi-card__icon kpi-card__icon--blue"><CloudRain size={26} /></span>
          <span className="kpi-card__content">
            <small>Lluvia del mes</small>
            <strong>{formatNumber(monthlyRain)} <em>mm</em></strong>
            <Delta value={monthlyRain - previousRain} />
          </span>
        </article>
        <article className="kpi-card kpi-card--wide-mobile">
          <span className="kpi-card__icon kpi-card__icon--blue"><Droplets size={26} /></span>
          <span className="kpi-card__content">
            <small>Lluvia anual</small>
            <strong>{formatNumber(annualRain(state, period))} <em>mm</em></strong>
            <span className="kpi-note">Acumulado del año</span>
          </span>
        </article>
        <article className="kpi-card kpi-card--wide-mobile">
          <span className="kpi-card__icon kpi-card__icon--green"><Warehouse size={26} /></span>
          <span className="kpi-card__content">
            <small>Superficie</small>
            <strong>{formatNumber(TOTAL_HECTARES)} <em>ha</em></strong>
            <span className="kpi-note">18 unidades de manejo</span>
          </span>
        </article>
      </div>

      <div className="dashboard-main-grid">
        <Panel
          title="Mapa del Campo"
          className="panel--map"
          action={<button type="button" className="text-button" onClick={() => onNavigate('mapa')}><Expand size={15} /> Abrir mapa</button>}
        >
          <RanchMap
            state={state}
            period={period}
            selectedLotId={selectedLotId}
            onSelectLot={(lotId) => setSelectedLotId((current) => (current === lotId ? undefined : lotId))}
            compact
            showModeSelector
          />
        </Panel>

        <div className="dashboard-side-stack">
          {selectedLot && selectedMetric ? (
            <Panel
              title={selectedLot.name}
              action={<button type="button" className="text-button" onClick={() => setSelectedLotId(undefined)}>Cerrar</button>}
              className="lot-detail-card"
            >
              <div className="lot-detail-hero">
                <span>
                  <small>Animales</small>
                  <strong>{formatNumber(selectedMetric.animals)}</strong>
                </span>
                <span>
                  <small>Carga</small>
                  <strong>{formatDecimal(selectedMetric.loadPerHa, 2)} EV/ha</strong>
                </span>
                <span>
                  <small>Superficie</small>
                  <strong>{selectedLot.hectares} ha</strong>
                </span>
              </div>
              <div className="category-mini-list">
                {selectedEntries.map((entry) => {
                  const category = CATEGORIES.find((item) => item.id === entry.categoryId)
                  return (
                    <div key={entry.id}>
                      <i style={{ background: category?.color }} />
                      <span>{category?.shortName ?? entry.categoryId}</span>
                      <strong>{formatNumber(entry.quantity)}</strong>
                    </div>
                  )
                })}
                {!selectedEntries.length && <p className="muted">No hay animales registrados en este lote.</p>}
              </div>
              <button
                type="button"
                className="button button--primary button--block"
                onClick={() => {
                  onOpenLot?.(selectedLot.id)
                  onNavigate('mapa')
                }}
              >
                Ver detalle del lote
              </button>
            </Panel>
          ) : (
            <Panel title={`Alertas importantes (${alerts.length})`} action={<button type="button" className="text-button" onClick={() => onNavigate('alertas')}>Ver todas</button>}>
              <AlertList alerts={alerts} limit={4} onSelect={(alert) => alert.lotId && setSelectedLotId(alert.lotId)} />
            </Panel>
          )}

          <Panel title="Distribución por categoría" action={<button type="button" className="text-button" onClick={() => onNavigate('animales')}>Ver detalle</button>}>
            <CategoryDonut state={state} period={period} />
          </Panel>

          <Panel title="Evolución de carga animal" action={<Badge tone="info">12 meses</Badge>}>
            <LoadHistoryChart state={state} />
          </Panel>
        </div>
      </div>

      <div className="dashboard-bottom-grid">
        <Panel title="Movimientos recientes" action={<button type="button" className="text-button" onClick={() => onNavigate('movimientos')}>Ver todos</button>}>
          <div className="responsive-table compact-table">
            <table>
              <thead>
                <tr><th>Fecha</th><th>Origen</th><th>Destino</th><th>Categoría</th><th>Cantidad</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {state.events
                  .filter((event) => event.period === period)
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, 5)
                  .map((event) => (
                    <tr key={event.id}>
                      <td>{formatDate(event.date)}</td>
                      <td>{event.originLotId ?? '—'}</td>
                      <td>{event.destinationLotId ?? '—'}</td>
                      <td>{CATEGORIES.find((category) => category.id === event.categoryId)?.shortName}</td>
                      <td><strong>{event.quantity}</strong></td>
                      <td><Badge tone={event.status === 'confirmado' ? 'success' : 'warning'}>{event.status}</Badge></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Carga de datos mensual" className="data-cta-panel">
          <div className="data-cta-grid">
            <button type="button" className="data-method-card" onClick={() => onNavigate('carga')}>
              <span className="data-method-card__icon"><CloudRain size={22} /></span>
              <strong>Cargar estado completo</strong>
              <p>Copiá el mes anterior, pegá desde Excel o importá un CSV.</p>
              <span>Empezar <ArrowRight size={15} /></span>
            </button>
            <button type="button" className="data-method-card" onClick={() => onNavigate('movimientos')}>
              <span className="data-method-card__icon"><Tractor size={22} /></span>
              <strong>Registrar cambios del mes</strong>
              <p>Movimientos, nacimientos, muertes, ventas y compras.</p>
              <span>Registrar <ArrowRight size={15} /></span>
            </button>
          </div>
          <div className="month-close-row">
            <span>
              <strong>{state.months.find((month) => month.period === period)?.status === 'cerrado' ? 'Mes cerrado' : 'Revisión abierta'}</strong>
              <small>Última actualización local: {new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(state.updatedAt))}</small>
            </span>
            <button type="button" className="button button--primary" onClick={() => onNavigate('carga')}>Continuar revisión</button>
          </div>
        </Panel>
      </div>
    </div>
  )
}
