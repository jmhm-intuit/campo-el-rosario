import { useMemo, useState } from 'react'
import { Edit3, Plus, Sprout, Trash2, X } from 'lucide-react'
import { LOTS, PASTURE_LABELS } from '../data/config'
import { useCampo } from '../data/CampoStore'
import type { PastureArea, PastureCondition, PastureType } from '../types'
import { RanchMap } from './RanchMap'
import { Badge, Panel } from './UI'

const pastureTypes = Object.entries(PASTURE_LABELS) as [PastureType, string][]
const conditions: { value: PastureCondition; label: string }[] = [
  { value: 'muy-buena', label: 'Muy buena' },
  { value: 'buena', label: 'Buena' },
  { value: 'normal', label: 'Normal' },
  { value: 'regular', label: 'Regular' },
  { value: 'degradada', label: 'Degradada' },
]

function blankPasture(): PastureArea {
  return {
    id: '',
    lotId: 'ER-01',
    name: '',
    hectares: 1,
    type: 'campo-natural',
    plantingYear: new Date().getFullYear(),
    condition: 'normal',
    notes: '',
  }
}

export function PasturesPage() {
  const { state, addPasture, updatePasture, removePasture } = useCampo()
  const [selectedLotId, setSelectedLotId] = useState('ER-04')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<PastureArea>(blankPasture())
  const [error, setError] = useState('')

  const lotRows = useMemo(
    () =>
      LOTS.map((lot) => {
        const areas = state.pastures.filter((pasture) => pasture.lotId === lot.id)
        const allocated = areas.reduce((sum, pasture) => sum + pasture.hectares, 0)
        return { lot, areas, allocated }
      }),
    [state.pastures],
  )

  const openNew = (lotId = selectedLotId) => {
    setForm({ ...blankPasture(), lotId })
    setError('')
    setFormOpen(true)
  }

  const save = () => {
    const lot = LOTS.find((item) => item.id === form.lotId)
    const usedByOthers = state.pastures
      .filter((pasture) => pasture.lotId === form.lotId && pasture.id !== form.id)
      .reduce((sum, pasture) => sum + pasture.hectares, 0)
    if (!form.name.trim()) {
      setError('Ingresá un nombre para el área de pastura.')
      return
    }
    if (form.hectares <= 0 || (lot && usedByOthers + form.hectares > lot.hectares)) {
      setError(`La superficie total no puede superar las ${lot?.hectares ?? 0} ha del lote.`)
      return
    }
    const normalized = { ...form, id: form.id || crypto.randomUUID(), name: form.name.trim() }
    if (form.id) updatePasture(normalized)
    else addPasture(normalized)
    setFormOpen(false)
  }

  return (
    <div className="pastures-page page-stack">
      <div className="pasture-page-grid">
        <Panel title="Pasturas dentro de los lotes" className="panel--pasture-map">
          <RanchMap state={state} period={state.selectedPeriod} selectedLotId={selectedLotId} onSelectLot={setSelectedLotId} initialMode="pasturas" showModeSelector={false} />
        </Panel>
        <Panel
          title={LOTS.find((lot) => lot.id === selectedLotId)?.name ?? 'Lote'}
          action={<button type="button" className="button button--primary" onClick={() => openNew()}><Plus size={16} /> Agregar área</button>}
        >
          <div className="selected-pasture-list">
            {state.pastures.filter((pasture) => pasture.lotId === selectedLotId).map((pasture) => (
              <article key={pasture.id}>
                <span className={`pasture-icon pasture-icon--${pasture.type}`}><Sprout size={20} /></span>
                <div><strong>{pasture.name}</strong><small>{PASTURE_LABELS[pasture.type]} · {pasture.hectares} ha · {pasture.plantingYear ?? 'Sin año'}</small><p>{pasture.notes || 'Sin observaciones.'}</p></div>
                <Badge tone={pasture.condition === 'degradada' || pasture.condition === 'regular' ? 'warning' : 'success'}>{conditions.find((condition) => condition.value === pasture.condition)?.label}</Badge>
                <button type="button" className="icon-button" onClick={() => { setForm({ ...pasture }); setError(''); setFormOpen(true) }}><Edit3 size={16} /></button>
              </article>
            ))}
            {!state.pastures.some((pasture) => pasture.lotId === selectedLotId) && <div className="empty-inline"><Sprout size={24} /><span>No hay subáreas de pastura registradas. El lote se considera campo natural.</span></div>}
          </div>
        </Panel>
      </div>

      <Panel title="Superficie de pasturas por lote">
        <div className="responsive-table">
          <table>
            <thead><tr><th>Lote</th><th>Superficie del lote</th><th>Áreas registradas</th><th>Superficie asignada</th><th>Disponible</th><th>Tipos</th><th /></tr></thead>
            <tbody>
              {lotRows.map(({ lot, areas, allocated }) => (
                <tr key={lot.id} onClick={() => setSelectedLotId(lot.id)} className={lot.id === selectedLotId ? 'is-selected-row' : ''}>
                  <td><strong>{lot.name}</strong></td>
                  <td>{lot.hectares} ha</td>
                  <td>{areas.length}</td>
                  <td>{allocated.toLocaleString('es-AR', { maximumFractionDigits: 1 })} ha</td>
                  <td>{(lot.hectares - allocated).toLocaleString('es-AR', { maximumFractionDigits: 1 })} ha</td>
                  <td>{areas.length ? [...new Set(areas.map((pasture) => PASTURE_LABELS[pasture.type]))].join(', ') : 'Campo natural'}</td>
                  <td><button type="button" className="text-button" onClick={(event) => { event.stopPropagation(); openNew(lot.id) }}>Agregar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {formOpen && (
        <div className="modal-backdrop" onMouseDown={() => setFormOpen(false)}>
          <section className="modal" onMouseDown={(event) => event.stopPropagation()}>
            <header><div><Badge tone="info">Subárea del lote</Badge><h2>{form.id ? 'Editar pastura' : 'Nueva área de pastura'}</h2></div><button type="button" className="icon-button" onClick={() => setFormOpen(false)}><X size={20} /></button></header>
            <div className="modal__body form-grid">
              <label className="field-label">Lote<select value={form.lotId} onChange={(event) => setForm({ ...form, lotId: event.target.value })}>{LOTS.map((lot) => <option key={lot.id} value={lot.id}>{lot.name} · {lot.hectares} ha</option>)}</select></label>
              <label className="field-label">Nombre del área<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ej.: Avena norte" /></label>
              <label className="field-label">Tipo<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as PastureType })}>{pastureTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="field-label">Hectáreas<input type="number" min="0.1" step="0.1" value={form.hectares} onChange={(event) => setForm({ ...form, hectares: Number(event.target.value) })} /></label>
              <label className="field-label">Año de siembra<input type="number" min="1990" max="2100" value={form.plantingYear ?? ''} onChange={(event) => setForm({ ...form, plantingYear: event.target.value ? Number(event.target.value) : undefined })} /></label>
              <label className="field-label">Condición<select value={form.condition} onChange={(event) => setForm({ ...form, condition: event.target.value as PastureCondition })}>{conditions.map((condition) => <option key={condition.value} value={condition.value}>{condition.label}</option>)}</select></label>
              <label className="field-label field-label--wide">Notas<textarea rows={3} value={form.notes ?? ''} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
              {error && <p className="form-error field-label--wide">{error}</p>}
            </div>
            <footer>{form.id && <button type="button" className="button button--danger-ghost" onClick={() => { if (window.confirm('¿Eliminar esta pastura?')) { removePasture(form.id); setFormOpen(false) } }}><Trash2 size={16} /> Eliminar</button>}<span /><button type="button" className="button button--ghost" onClick={() => setFormOpen(false)}>Cancelar</button><button type="button" className="button button--primary" onClick={save}>Guardar</button></footer>
          </section>
        </div>
      )}
    </div>
  )
}
