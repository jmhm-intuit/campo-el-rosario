import { useMemo, useState } from 'react'
import { ArrowLeftRight, Check, Filter, Plus, Search, ShoppingCart, Skull, Sparkles, Trash2, X } from 'lucide-react'
import { CATEGORIES } from '../data/config'
import { useCampo } from '../data/CampoStore'
import type { AnimalEventType, ViewKey } from '../types'
import { eventTotals } from '../utils/calculations'
import { formatDate, formatNumber } from '../utils/format'
import { Badge, Panel } from './UI'

const labels: Record<AnimalEventType, string> = {
  movimiento: 'Movimiento',
  nacimiento: 'Nacimiento',
  muerte: 'Muerte',
  venta: 'Venta',
  compra: 'Compra',
  reclasificacion: 'Reclasificación',
  correccion: 'Corrección',
}

export function MovementsPage({ onNavigate }: { onNavigate: (view: ViewKey) => void }) {
  const { state, updateEvent, removeEvent } = useCampo()
  const period = state.selectedPeriod
  const [typeFilter, setTypeFilter] = useState<'todos' | AnimalEventType>('todos')
  const [search, setSearch] = useState('')
  const totals = eventTotals(state, period)
  const events = useMemo(
    () =>
      state.events
        .filter((event) => event.period === period)
        .filter((event) => typeFilter === 'todos' || event.type === typeFilter)
        .filter((event) => {
          const category = CATEGORIES.find((item) => item.id === event.categoryId)
          return `${event.originLotId ?? ''} ${event.destinationLotId ?? ''} ${category?.name ?? ''} ${event.reason ?? ''}`
            .toLowerCase()
            .includes(search.toLowerCase())
        })
        .sort((a, b) => b.date.localeCompare(a.date)),
    [state.events, period, typeFilter, search],
  )

  return (
    <div className="movements-page page-stack">
      <div className="summary-strip summary-strip--events">
        <div><ArrowLeftRight size={23} /><span><small>Movimientos</small><strong>{totals.movements}</strong></span></div>
        <div><Sparkles size={23} /><span><small>Nacimientos</small><strong>{formatNumber(totals.births)}</strong></span></div>
        <div><Skull size={23} /><span><small>Muertes</small><strong>{formatNumber(totals.deaths)}</strong></span></div>
        <div><ShoppingCart size={23} /><span><small>Ventas</small><strong>{formatNumber(totals.sales)}</strong></span></div>
        <div><Plus size={23} /><span><small>Compras</small><strong>{formatNumber(totals.purchases)}</strong></span></div>
      </div>

      <Panel
        title="Registro de movimientos y eventos"
        action={<button type="button" className="button button--primary" onClick={() => onNavigate('carga')}><Plus size={16} /> Registrar cambio</button>}
      >
        <div className="filters-row">
          <label className="search-field"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por lote, categoría o motivo" /></label>
          <label><Filter size={15} /><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as 'todos' | AnimalEventType)}><option value="todos">Todos los tipos</option>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        </div>
        <div className="responsive-table">
          <table>
            <thead><tr><th>Fecha</th><th>Tipo</th><th>Origen</th><th>Destino</th><th>Categoría</th><th>Cantidad</th><th>Motivo</th><th>Fuente</th><th>Estado</th><th /></tr></thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{formatDate(event.date)}</td>
                  <td><span className={`event-type event-type--${event.type}`}>{labels[event.type]}</span></td>
                  <td>{event.originLotId ?? '—'}</td>
                  <td>{event.destinationLotId ?? '—'}</td>
                  <td>{CATEGORIES.find((category) => category.id === event.categoryId)?.name}</td>
                  <td><strong>{formatNumber(event.quantity)}</strong></td>
                  <td>{event.reason ?? '—'}</td>
                  <td><Badge tone={event.source === 'inferido' ? 'info' : 'neutral'}>{event.source}</Badge></td>
                  <td>
                    {event.status === 'pendiente' ? (
                      <span className="inline-actions">
                        <button type="button" className="icon-button icon-button--success" title="Confirmar" onClick={() => updateEvent({ ...event, status: 'confirmado' })}><Check size={15} /></button>
                        <button type="button" className="icon-button icon-button--danger" title="Rechazar" onClick={() => updateEvent({ ...event, status: 'rechazado' })}><X size={15} /></button>
                      </span>
                    ) : (
                      <Badge tone={event.status === 'confirmado' ? 'success' : 'danger'}>{event.status}</Badge>
                    )}
                  </td>
                  <td><button type="button" className="icon-button icon-button--danger" title="Eliminar" onClick={() => window.confirm('¿Eliminar este registro?') && removeEvent(event.id)}><Trash2 size={15} /></button></td>
                </tr>
              ))}
              {!events.length && <tr><td colSpan={10}><div className="empty-inline"><ArrowLeftRight size={24} /><span>No hay registros que coincidan con los filtros.</span></div></td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
