import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Beef, MapPin, Sprout } from 'lucide-react'
import { CATEGORIES, LOTS, PASTURE_LABELS, TARGET_LOAD_PER_HA } from '../data/config'
import { useCampo } from '../data/CampoStore'
import {
  CAPACITY_LABELS,
  capacityStatus,
  metricForLot,
  quantityFor,
} from '../utils/calculations'
import { formatDecimal, formatNumber } from '../utils/format'
import { RanchMap } from './RanchMap'
import { Badge, Panel } from './UI'

export function MapPage({ initialLotId }: { initialLotId?: string }) {
  const { state } = useCampo()
  const period = state.selectedPeriod
  const [selectedLotId, setSelectedLotId] = useState(initialLotId ?? 'ER-12')
  const selectedLot = LOTS.find((lot) => lot.id === selectedLotId) ?? LOTS[0]
  const metric = metricForLot(state, period, selectedLot.id)
  const status = capacityStatus(metric.loadPerHa, metric.animals)
  const categories = CATEGORIES.map((category) => ({
    ...category,
    quantity: quantityFor(state, period, selectedLot.id, category.id),
  })).filter((category) => category.quantity > 0)
  const pastures = state.pastures.filter((pasture) => pasture.lotId === selectedLot.id)
  const sortedLots = useMemo(
    () => LOTS.map((lot) => ({ lot, metric: metricForLot(state, period, lot.id) })).sort((a, b) => b.metric.loadPerHa - a.metric.loadPerHa),
    [state, period],
  )

  return (
    <div className="map-page page-stack">
      <div className="map-page-grid">
        <Panel title="Mapa interactivo de El Rosario" className="panel--full-map">
          <RanchMap
            state={state}
            period={period}
            selectedLotId={selectedLot.id}
            onSelectLot={setSelectedLotId}
            showModeSelector
          />
        </Panel>

        <aside className="lot-inspector">
          <Panel
            title={selectedLot.name}
            action={<Badge tone={status === 'critica' ? 'danger' : status === 'sobrecarga' || status === 'alta' ? 'warning' : 'success'}>{CAPACITY_LABELS[status]}</Badge>}
          >
            <div className="lot-inspector__hero">
              <MapPin size={24} />
              <div><strong>{selectedLot.hectares} ha</strong><small>Superficie fija</small></div>
            </div>
            <div className="lot-inspector__metrics">
              <div><span><Beef size={17} /> Animales</span><strong>{formatNumber(metric.animals)}</strong><small>{metric.animalChange > 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {metric.animalChange > 0 ? '+' : ''}{metric.animalChange} vs. mes anterior</small></div>
              <div><span><Sprout size={17} /> Carga actual</span><strong>{formatDecimal(metric.loadPerHa, 2)} EV/ha</strong><small>Objetivo {TARGET_LOAD_PER_HA.toFixed(2)} EV/ha</small></div>
            </div>
            <div className="capacity-progress">
              <div><span>Uso de capacidad</span><strong>{Math.round(metric.capacityUse * 100)}%</strong></div>
              <span><i style={{ width: `${Math.min(100, metric.capacityUse * 100)}%` }} /></span>
            </div>
            <h3>Animales por categoría</h3>
            <div className="category-detail-list">
              {categories.map((category) => (
                <div key={category.id}>
                  <i style={{ background: category.color }} />
                  <span>{category.name}</span>
                  <strong>{formatNumber(category.quantity)}</strong>
                </div>
              ))}
              {!categories.length && <p className="muted">Sin animales registrados.</p>}
            </div>
            <h3>Pasturas del lote</h3>
            <div className="pasture-chips">
              {pastures.map((pasture) => <span key={pasture.id}>{PASTURE_LABELS[pasture.type]} · {pasture.hectares} ha</span>)}
              {!pastures.length && <span>Campo natural · sin subdivisiones registradas</span>}
            </div>
          </Panel>
        </aside>
      </div>

      <Panel title="Resumen por lote">
        <div className="responsive-table">
          <table>
            <thead><tr><th>Lote</th><th>Superficie</th><th>Animales</th><th>Equivalentes</th><th>EV/ha</th><th>Cambio mensual</th><th>Estado</th></tr></thead>
            <tbody>
              {sortedLots.map(({ lot, metric: lotMetric }) => {
                const lotStatus = capacityStatus(lotMetric.loadPerHa, lotMetric.animals)
                return (
                  <tr key={lot.id} className={selectedLot.id === lot.id ? 'is-selected-row' : ''} onClick={() => setSelectedLotId(lot.id)}>
                    <td><strong>{lot.name}</strong></td>
                    <td>{lot.hectares} ha</td>
                    <td>{formatNumber(lotMetric.animals)}</td>
                    <td>{formatDecimal(lotMetric.equivalents, 1)}</td>
                    <td>{formatDecimal(lotMetric.loadPerHa, 2)}</td>
                    <td className={lotMetric.animalChange > 0 ? 'positive' : lotMetric.animalChange < 0 ? 'negative' : ''}>{lotMetric.animalChange > 0 ? '+' : ''}{lotMetric.animalChange}</td>
                    <td><Badge tone={lotStatus === 'critica' ? 'danger' : lotStatus === 'alta' || lotStatus === 'sobrecarga' ? 'warning' : lotStatus === 'sin-datos' ? 'neutral' : 'success'}>{CAPACITY_LABELS[lotStatus]}</Badge></td>
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
