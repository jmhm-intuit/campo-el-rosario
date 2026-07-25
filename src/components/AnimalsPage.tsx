import { useMemo, useState } from 'react'
import { Beef, Edit3, Filter, Plus, Search, Trash2, X } from 'lucide-react'
import { CATEGORIES, LOTS } from '../data/config'
import { useCampo } from '../data/CampoStore'
import type { InventoryEntry } from '../types'
import { categoryDistribution, totalAnimalsForPeriod } from '../utils/calculations'
import { formatNumber } from '../utils/format'
import { Badge, Panel } from './UI'

const emptyForm = (period: string): InventoryEntry => ({
  id: '',
  period,
  lotId: 'ER-01',
  categoryId: 'vacas-cria',
  quantity: 1,
  groupName: '',
  birthYear: undefined,
  ageRange: '',
  healthStatus: '',
  reproductiveStatus: '',
  breed: '',
  notes: '',
})

export function AnimalsPage() {
  const { state, replacePeriodInventory } = useCampo()
  const period = state.selectedPeriod
  const entries = state.inventory.filter((entry) => entry.period === period)
  const [search, setSearch] = useState('')
  const [lotFilter, setLotFilter] = useState('todos')
  const [categoryFilter, setCategoryFilter] = useState('todas')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<InventoryEntry>(() => emptyForm(period))

  const distribution = categoryDistribution(state, period)
  const filtered = useMemo(
    () =>
      entries.filter((entry) => {
        const lot = LOTS.find((item) => item.id === entry.lotId)
        const category = CATEGORIES.find((item) => item.id === entry.categoryId)
        const haystack = `${lot?.name} ${category?.name} ${entry.groupName ?? ''} ${entry.notes ?? ''}`.toLowerCase()
        return (
          (!search || haystack.includes(search.toLowerCase())) &&
          (lotFilter === 'todos' || entry.lotId === lotFilter) &&
          (categoryFilter === 'todas' || entry.categoryId === categoryFilter)
        )
      }),
    [entries, search, lotFilter, categoryFilter],
  )

  const saveGroup = () => {
    if (!form.categoryId || !form.lotId || form.quantity <= 0) return
    const next: InventoryEntry = {
      ...form,
      id: form.id || crypto.randomUUID(),
      period,
      quantity: Math.round(form.quantity),
      groupName: form.groupName?.trim() || undefined,
      ageRange: form.ageRange?.trim() || undefined,
      healthStatus: form.healthStatus?.trim() || undefined,
      reproductiveStatus: form.reproductiveStatus?.trim() || undefined,
      breed: form.breed?.trim() || undefined,
      notes: form.notes?.trim() || undefined,
    }
    replacePeriodInventory(period, [...entries.filter((entry) => entry.id !== next.id), next])
    setForm(emptyForm(period))
    setFormOpen(false)
  }

  const editGroup = (entry: InventoryEntry) => {
    setForm({ ...entry })
    setFormOpen(true)
  }

  const deleteGroup = (id: string) => {
    if (!window.confirm('¿Eliminar este grupo del inventario mensual?')) return
    replacePeriodInventory(period, entries.filter((entry) => entry.id !== id))
  }

  return (
    <div className="animals-page page-stack">
      <div className="summary-strip">
        <div><Beef size={24} /><span><small>Total del período</small><strong>{formatNumber(totalAnimalsForPeriod(state, period))}</strong></span></div>
        {distribution.slice(0, 5).map((item) => (
          <div key={item.id}><i style={{ background: item.color }} /><span><small>{item.shortName}</small><strong>{formatNumber(item.quantity)}</strong></span></div>
        ))}
      </div>

      <Panel
        title="Grupos de animales"
        action={<button type="button" className="button button--primary" onClick={() => { setForm(emptyForm(period)); setFormOpen(true) }}><Plus size={16} /> Nuevo grupo</button>}
      >
        <div className="filters-row">
          <label className="search-field"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar grupo, lote o categoría" /></label>
          <label><Filter size={15} /><select value={lotFilter} onChange={(event) => setLotFilter(event.target.value)}><option value="todos">Todos los lotes</option>{LOTS.map((lot) => <option key={lot.id} value={lot.id}>{lot.name}</option>)}</select></label>
          <label><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="todas">Todas las categorías</option>{CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        </div>

        <div className="responsive-table">
          <table>
            <thead><tr><th>Grupo</th><th>Lote</th><th>Categoría</th><th>Cantidad</th><th>Nacimiento/edad</th><th>Salud</th><th>Estado reproductivo</th><th /></tr></thead>
            <tbody>
              {filtered.map((entry) => {
                const category = CATEGORIES.find((item) => item.id === entry.categoryId)
                return (
                  <tr key={entry.id}>
                    <td><strong>{entry.groupName || 'Sin nombre'}</strong>{entry.breed && <small>{entry.breed}</small>}</td>
                    <td>{LOTS.find((lot) => lot.id === entry.lotId)?.name}</td>
                    <td><span className="category-cell"><i style={{ background: category?.color }} />{category?.name}</span></td>
                    <td><strong>{formatNumber(entry.quantity)}</strong></td>
                    <td>{entry.birthYear ?? entry.ageRange ?? '—'}</td>
                    <td>{entry.healthStatus ? <Badge tone={entry.healthStatus.toLowerCase().includes('buena') || entry.healthStatus.toLowerCase().includes('salud') ? 'success' : 'warning'}>{entry.healthStatus}</Badge> : '—'}</td>
                    <td>{entry.reproductiveStatus ?? '—'}</td>
                    <td className="table-actions"><button type="button" className="icon-button" onClick={() => editGroup(entry)} title="Editar"><Edit3 size={16} /></button><button type="button" className="icon-button icon-button--danger" onClick={() => deleteGroup(entry.id)} title="Eliminar"><Trash2 size={16} /></button></td>
                  </tr>
                )
              })}
              {!filtered.length && <tr><td colSpan={8}><div className="empty-inline"><Beef size={24} /><span>No hay grupos que coincidan con los filtros.</span></div></td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>

      {formOpen && (
        <div className="modal-backdrop" onMouseDown={() => setFormOpen(false)}>
          <section className="modal" onMouseDown={(event) => event.stopPropagation()}>
            <header><div><Badge tone="info">Categoría obligatoria</Badge><h2>{form.id ? 'Editar grupo' : 'Nuevo grupo de animales'}</h2></div><button type="button" className="icon-button" onClick={() => setFormOpen(false)}><X size={20} /></button></header>
            <div className="modal__body form-grid">
              <label className="field-label">Lote *<select value={form.lotId} onChange={(event) => setForm({ ...form, lotId: event.target.value })}>{LOTS.map((lot) => <option key={lot.id} value={lot.id}>{lot.name} · {lot.hectares} ha</option>)}</select></label>
              <label className="field-label">Categoría *<select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>{CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
              <label className="field-label">Cantidad *<input type="number" min="1" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) })} /></label>
              <label className="field-label">Nombre del grupo<input value={form.groupName ?? ''} onChange={(event) => setForm({ ...form, groupName: event.target.value })} placeholder="Ej.: Vaquillonas 2024" /></label>
              <label className="field-label">Año de nacimiento<input type="number" min="1990" max="2100" value={form.birthYear ?? ''} onChange={(event) => setForm({ ...form, birthYear: event.target.value ? Number(event.target.value) : undefined })} /></label>
              <label className="field-label">Rango de edad<input value={form.ageRange ?? ''} onChange={(event) => setForm({ ...form, ageRange: event.target.value })} placeholder="Ej.: 12–18 meses" /></label>
              <label className="field-label">Estado de salud<input value={form.healthStatus ?? ''} onChange={(event) => setForm({ ...form, healthStatus: event.target.value })} placeholder="Ej.: Saludable" /></label>
              <label className="field-label">Estado reproductivo<input value={form.reproductiveStatus ?? ''} onChange={(event) => setForm({ ...form, reproductiveStatus: event.target.value })} placeholder="Ej.: Lista para servicio" /></label>
              <label className="field-label">Raza<input value={form.breed ?? ''} onChange={(event) => setForm({ ...form, breed: event.target.value })} /></label>
              <label className="field-label field-label--wide">Notas<textarea rows={3} value={form.notes ?? ''} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
            </div>
            <footer><button type="button" className="button button--ghost" onClick={() => setFormOpen(false)}>Cancelar</button><button type="button" className="button button--primary" onClick={saveGroup}>Guardar grupo</button></footer>
          </section>
        </div>
      )}
    </div>
  )
}
