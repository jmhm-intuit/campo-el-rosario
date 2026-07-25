import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardPaste,
  CloudUpload,
  Download,
  FileSpreadsheet,
  LockKeyhole,
  Plus,
  CloudRain,
  RefreshCcw,
  Save,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react'
import { CATEGORIES, LOTS, PASTURE_LABELS } from '../data/config'
import { useCampo } from '../data/CampoStore'
import type { AnimalEvent, AnimalEventType, ReconciliationSuggestion } from '../types'
import {
  buildAlerts,
  eventTotals,
  monthSummary,
  quantityFor,
  totalAnimalsForPeriod,
} from '../utils/calculations'
import {
  downloadTextFile,
  importInventoryCSV,
  INVENTORY_TEMPLATE,
  parseDelimited,
} from '../utils/csv'
import { formatDate, formatNumber, formatPeriod, normalizeText, periodToDate, previousPeriod } from '../utils/format'
import { buildReconciliationSuggestions, suggestionToEvent } from '../utils/reconcile'
import { AlertList } from './AlertList'
import { Badge, Panel } from './UI'

const STEPS = [
  'Período',
  'Animales por lote',
  'Cambios del mes',
  'Conciliación',
  'Lluvia y pasturas',
  'Resumen y alertas',
]

const EVENT_LABELS: Record<AnimalEventType, string> = {
  movimiento: 'Movimiento entre lotes',
  nacimiento: 'Nacimiento',
  muerte: 'Muerte',
  venta: 'Venta',
  compra: 'Compra',
  reclasificacion: 'Cambio de categoría',
  correccion: 'Corrección de inventario',
}

function suggestedOptions(suggestion: ReconciliationSuggestion): AnimalEventType[] {
  if (suggestion.kind === 'movimiento') return ['movimiento', 'correccion']
  if (suggestion.kind === 'reclasificacion') return ['reclasificacion', 'correccion']
  if (suggestion.kind === 'salida') return ['venta', 'muerte', 'movimiento', 'correccion']
  return ['nacimiento', 'compra', 'movimiento', 'correccion']
}

export function DataUpload() {
  const {
    state,
    setSelectedPeriod,
    setInventoryCell,
    replacePeriodInventory,
    copyPreviousMonth,
    addEvent,
    removeEvent,
    setRain,
    setMonthStatus,
  } = useCampo()
  const period = state.selectedPeriod
  const [step, setStep] = useState(1)
  const [pasteOpen, setPasteOpen] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [importMessages, setImportMessages] = useState<string[]>([])
  const [suggestionTypes, setSuggestionTypes] = useState<Record<string, AnimalEventType>>({})
  const [suggestionLots, setSuggestionLots] = useState<Record<string, string>>({})
  const [reopenReason, setReopenReason] = useState('')
  const fileRef = useRef<HTMLInputElement | null>(null)
  const month = state.months.find((item) => item.period === period)
  const isClosed = month?.status === 'cerrado'

  const [eventForm, setEventForm] = useState({
    date: periodToDate(period, 15),
    type: 'movimiento' as AnimalEventType,
    originLotId: 'ER-01',
    destinationLotId: 'ER-02',
    categoryId: 'vacas-cria',
    destinationCategoryId: 'vaquillonas-reposicion',
    quantity: 1,
    reason: '',
    applyToInventory: true,
  })

  useEffect(() => {
    setEventForm((current) => ({ ...current, date: periodToDate(period, 15) }))
  }, [period])

  const suggestions = useMemo(() => buildReconciliationSuggestions(state, period), [state, period])
  const alerts = useMemo(() => buildAlerts(state, period), [state, period])
  const summary = monthSummary(state, period)
  const currentEvents = state.events
    .filter((event) => event.period === period)
    .sort((a, b) => b.date.localeCompare(a.date))
  const rain = state.rain.find((record) => record.period === period)?.millimeters
  const completedLots = LOTS.filter((lot) =>
    state.inventory.some((entry) => entry.period === period && entry.lotId === lot.id),
  ).length
  const categoryTotals = CATEGORIES.map((category) => ({
    category,
    quantity: LOTS.reduce((sum, lot) => sum + quantityFor(state, period, lot.id, category.id), 0),
  }))

  const updateCell = (lotId: string, categoryId: string, rawValue: string | number) => {
    if (isClosed) return
    const quantity = typeof rawValue === 'number' ? rawValue : Number(rawValue)
    setInventoryCell(period, lotId, categoryId, Number.isFinite(quantity) ? quantity : 0)
  }

  const applyPastedMatrix = () => {
    const rows = parseDelimited(pasteText)
    if (rows.length < 2) {
      setImportMessages(['Pegá una tabla con encabezados y al menos una fila.'])
      return
    }
    const headers = rows[0].map((header) => normalizeText(header))
    const lotColumn = headers.findIndex((header) => ['lote', 'lot', 'potrero'].includes(header))
    if (lotColumn < 0) {
      setImportMessages(['La primera fila debe incluir una columna Lote.'])
      return
    }
    const categoryColumns = headers.map((header, index) => {
      const category = CATEGORIES.find(
        (item) =>
          normalizeText(item.name) === header ||
          normalizeText(item.shortName) === header ||
          normalizeText(item.id) === header,
      )
      return category ? { index, categoryId: category.id } : undefined
    }).filter(Boolean) as { index: number; categoryId: string }[]

    if (!categoryColumns.length) {
      setImportMessages(['No se reconoció ninguna categoría en los encabezados. Usá los nombres de la plantilla.'])
      return
    }

    const messages: string[] = []
    let applied = 0
    rows.slice(1).forEach((row, rowIndex) => {
      const rawLot = (row[lotColumn] ?? '').trim().toUpperCase().replace('/', '-')
      const lot = LOTS.find(
        (item) => item.id === rawLot || item.name.toUpperCase() === (row[lotColumn] ?? '').trim().toUpperCase(),
      )
      if (!lot) {
        messages.push(`Fila ${rowIndex + 2}: lote no reconocido (${row[lotColumn] ?? ''}).`)
        return
      }
      categoryColumns.forEach(({ index, categoryId }) => {
        const raw = row[index]
        if (raw === undefined || raw === '') return
        const value = Number(raw.replace(',', '.'))
        if (!Number.isFinite(value) || value < 0) {
          messages.push(`Fila ${rowIndex + 2}: cantidad inválida en ${categoryId}.`)
          return
        }
        updateCell(lot.id, categoryId, value)
        applied += 1
      })
    })
    setImportMessages([`${applied} celdas actualizadas.`, ...messages])
    if (!messages.length) {
      setPasteOpen(false)
      setPasteText('')
    }
  }

  const handleCSV = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const result = importInventoryCSV(text, period)
    setImportMessages(result.errors.length ? result.errors : [`${result.entries.length} registros importados correctamente.`])
    if (result.entries.length) {
      const importedPeriod = result.detectedPeriod ?? period
      if (importedPeriod !== period) setSelectedPeriod(importedPeriod)
      replacePeriodInventory(importedPeriod, result.entries.filter((entry) => entry.period === importedPeriod))
    }
    event.target.value = ''
  }

  const applyEventToInventory = (event: AnimalEvent) => {
    const get = (lotId: string | undefined, categoryId: string) =>
      lotId ? quantityFor(state, period, lotId, categoryId) : 0
    if (event.type === 'movimiento') {
      updateCell(event.originLotId!, event.categoryId, get(event.originLotId, event.categoryId) - event.quantity)
      updateCell(event.destinationLotId!, event.categoryId, get(event.destinationLotId, event.categoryId) + event.quantity)
    } else if (event.type === 'nacimiento' || event.type === 'compra') {
      updateCell(event.destinationLotId!, event.categoryId, get(event.destinationLotId, event.categoryId) + event.quantity)
    } else if (event.type === 'muerte' || event.type === 'venta') {
      updateCell(event.originLotId!, event.categoryId, get(event.originLotId, event.categoryId) - event.quantity)
    } else if (event.type === 'reclasificacion') {
      updateCell(event.originLotId!, event.categoryId, get(event.originLotId, event.categoryId) - event.quantity)
      updateCell(
        event.destinationLotId ?? event.originLotId!,
        event.destinationCategoryId!,
        get(event.destinationLotId ?? event.originLotId, event.destinationCategoryId!) + event.quantity,
      )
    } else if (event.type === 'correccion') {
      const lotId = event.destinationLotId ?? event.originLotId!
      updateCell(lotId, event.categoryId, get(lotId, event.categoryId) + event.quantity)
    }
  }

  const submitEvent = () => {
    if (isClosed) return
    const type = eventForm.type
    const requiresOrigin = ['movimiento', 'muerte', 'venta', 'reclasificacion'].includes(type)
    const requiresDestination = ['movimiento', 'nacimiento', 'compra'].includes(type)
    if (eventForm.quantity <= 0) return
    const newEvent: AnimalEvent = {
      id: crypto.randomUUID(),
      period,
      date: eventForm.date,
      type,
      originLotId: requiresOrigin || type === 'correccion' ? eventForm.originLotId : undefined,
      destinationLotId: requiresDestination ? eventForm.destinationLotId : type === 'reclasificacion' ? eventForm.originLotId : undefined,
      categoryId: eventForm.categoryId,
      destinationCategoryId: type === 'reclasificacion' ? eventForm.destinationCategoryId : undefined,
      quantity: Math.round(eventForm.quantity),
      reason: eventForm.reason || EVENT_LABELS[type],
      source: 'manual',
      status: 'confirmado',
      createdAt: new Date().toISOString(),
    }
    addEvent(newEvent)
    if (eventForm.applyToInventory) applyEventToInventory(newEvent)
    setEventForm((current) => ({ ...current, quantity: 1, reason: '' }))
  }

  const confirmSuggestion = (suggestion: ReconciliationSuggestion) => {
    const selectedType = suggestionTypes[suggestion.id] ?? suggestion.suggestedType
    const selectedLot = suggestionLots[suggestion.id]
    const event = suggestionToEvent(suggestion, selectedType, period, {
      originLotId:
        selectedType === 'movimiento' && suggestion.kind === 'entrada'
          ? selectedLot
          : suggestion.originLotId,
      destinationLotId:
        selectedType === 'movimiento' && suggestion.kind === 'salida'
          ? selectedLot
          : suggestion.destinationLotId,
      reason: 'Conciliación mensual validada por el usuario',
    })
    addEvent(event)
  }

  const closeMonth = () => {
    if (suggestions.length || rain === undefined) return
    setMonthStatus(period, 'cerrado')
  }

  const nextDisabled = step === 4 && suggestions.length > 0

  return (
    <div className="data-upload page-stack">
      <section className="workflow-hero">
        <div>
          <Badge tone={isClosed ? 'success' : month?.status === 'revision' ? 'warning' : 'info'}>
            {isClosed ? 'Mes cerrado' : month?.status === 'revision' ? 'Pendiente de revisión' : 'Borrador'}
          </Badge>
          <h2>Actualización mensual de {formatPeriod(period)}</h2>
          <p>Cargá los animales primero. La conciliación, el resumen y las alertas aparecen al final.</p>
        </div>
        <div className="workflow-progress-summary">
          <strong>{completedLots}/{LOTS.length}</strong>
          <span>lotes con datos</span>
        </div>
      </section>

      <ol className="stepper" aria-label="Pasos de carga mensual">
        {STEPS.map((label, index) => {
          const number = index + 1
          return (
            <li key={label} className={`${step === number ? 'is-current' : ''} ${step > number ? 'is-complete' : ''}`}>
              <button type="button" onClick={() => setStep(number)}>
                <span>{step > number ? <Check size={15} /> : number}</span>
                <small>{label}</small>
              </button>
            </li>
          )
        })}
      </ol>

      {isClosed && step !== 6 && (
        <div className="locked-banner">
          <LockKeyhole size={19} />
          <span>Este mes está cerrado. Podés revisar los datos, pero debés reabrirlo desde el último paso para editar.</span>
        </div>
      )}

      {step === 1 && (
        <Panel title="1. Elegí el período y la forma de empezar">
          <div className="period-start-grid">
            <div className="form-section">
              <label className="field-label">
                Mes a actualizar
                <input type="month" value={period} onChange={(event) => setSelectedPeriod(event.target.value)} />
              </label>
              <div className="period-status-card">
                <span><strong>{formatPeriod(period)}</strong><small>Estado actual: {month?.status ?? 'borrador'}</small></span>
                <Badge tone={isClosed ? 'success' : 'warning'}>{isClosed ? 'Cerrado' : 'Editable'}</Badge>
              </div>
            </div>
            <div className="start-methods">
              <button type="button" className="start-method" disabled={isClosed} onClick={() => copyPreviousMonth(period)}>
                <RefreshCcw size={25} />
                <span><strong>Copiar mes anterior</strong><small>La opción más rápida: empezá con la distribución previa y cambiá solo lo necesario.</small></span>
              </button>
              <button type="button" className="start-method" disabled={isClosed} onClick={() => setStep(2)}>
                <FileSpreadsheet size={25} />
                <span><strong>Escribir o pegar una tabla</strong><small>Usá la matriz, pegá desde Excel o cargá un CSV.</small></span>
              </button>
              <button type="button" className="start-method" disabled={isClosed} onClick={() => fileRef.current?.click()}>
                <CloudUpload size={25} />
                <span><strong>Importar inventario CSV</strong><small>Subí el estado completo por lote y categoría.</small></span>
              </button>
            </div>
          </div>
          <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={handleCSV} />
          {!!importMessages.length && <div className="import-messages">{importMessages.map((message) => <p key={message}>{message}</p>)}</div>}
        </Panel>
      )}

      {step === 2 && (
        <Panel
          title="2. Animales por lote y categoría"
          action={<Badge tone="info">Categoría obligatoria</Badge>}
          className="inventory-panel"
        >
          <div className="inventory-toolbar">
            <button type="button" className="button button--secondary" disabled={isClosed} onClick={() => copyPreviousMonth(period)}><RefreshCcw size={16} /> Copiar mes anterior</button>
            <button type="button" className="button button--secondary" disabled={isClosed} onClick={() => setPasteOpen((open) => !open)}><ClipboardPaste size={16} /> Pegar desde Excel</button>
            <button type="button" className="button button--secondary" disabled={isClosed} onClick={() => fileRef.current?.click()}><Upload size={16} /> Importar CSV</button>
            <button type="button" className="button button--ghost" onClick={() => downloadTextFile('plantilla-inventario-campo.csv', INVENTORY_TEMPLATE)}><Download size={16} /> Plantilla</button>
            <button
              type="button"
              className="button button--danger-ghost"
              disabled={isClosed}
              onClick={() => window.confirm('¿Vaciar todos los animales del período seleccionado?') && replacePeriodInventory(period, [])}
            >
              <Trash2 size={16} /> Vaciar mes
            </button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={handleCSV} />
          </div>

          {pasteOpen && (
            <div className="paste-box">
              <div>
                <strong>Pegá una tabla copiada desde Excel</strong>
                <p>La primera columna debe ser Lote. El resto de los encabezados deben coincidir con las categorías.</p>
              </div>
              <textarea
                value={pasteText}
                onChange={(event) => setPasteText(event.target.value)}
                placeholder={'Lote\tVacas de cría\tTerneros\tToros reproductores\nER-01\t80\t40\t2'}
                rows={7}
              />
              <div className="paste-box__actions">
                <button type="button" className="button button--ghost" onClick={() => setPasteOpen(false)}>Cancelar</button>
                <button type="button" className="button button--primary" onClick={applyPastedMatrix}><ClipboardPaste size={16} /> Aplicar tabla</button>
              </div>
            </div>
          )}

          {!!importMessages.length && <div className="import-messages">{importMessages.map((message) => <p key={message}>{message}</p>)}</div>}

          <div className="inventory-desktop responsive-table inventory-matrix-wrap">
            <table className="inventory-matrix">
              <thead>
                <tr>
                  <th className="sticky-col">Lote</th>
                  {CATEGORIES.map((category) => <th key={category.id} title={category.description}>{category.shortName}<small>EV {category.loadFactor}</small></th>)}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {LOTS.map((lot) => {
                  const lotTotal = CATEGORIES.reduce((sum, category) => sum + quantityFor(state, period, lot.id, category.id), 0)
                  return (
                    <tr key={lot.id}>
                      <th className="sticky-col"><strong>{lot.name}</strong><small>{lot.hectares} ha</small></th>
                      {CATEGORIES.map((category) => (
                        <td key={category.id}>
                          <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            value={quantityFor(state, period, lot.id, category.id) || ''}
                            placeholder="0"
                            disabled={isClosed}
                            aria-label={`${lot.name}, ${category.name}`}
                            onChange={(event) => updateCell(lot.id, category.id, event.target.value)}
                          />
                        </td>
                      ))}
                      <td className="inventory-total">{formatNumber(lotTotal)}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th className="sticky-col">Total</th>
                  {categoryTotals.map(({ category, quantity }) => <td key={category.id}>{formatNumber(quantity)}</td>)}
                  <td>{formatNumber(totalAnimalsForPeriod(state, period))}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="inventory-mobile">
            {LOTS.map((lot, index) => {
              const lotTotal = CATEGORIES.reduce((sum, category) => sum + quantityFor(state, period, lot.id, category.id), 0)
              return (
                <details key={lot.id} open={index === 0}>
                  <summary>
                    <span><strong>{lot.name}</strong><small>{lot.hectares} ha</small></span>
                    <Badge tone={lotTotal ? 'success' : 'neutral'}>{lotTotal} animales</Badge>
                  </summary>
                  <div className="mobile-inventory-fields">
                    {CATEGORIES.map((category) => (
                      <label key={category.id}>
                        <span>{category.name}<small>Factor {category.loadFactor}</small></span>
                        <input
                          type="number"
                          min="0"
                          value={quantityFor(state, period, lot.id, category.id) || ''}
                          placeholder="0"
                          disabled={isClosed}
                          onChange={(event) => updateCell(lot.id, category.id, event.target.value)}
                        />
                      </label>
                    ))}
                  </div>
                </details>
              )
            })}
          </div>

          <div className="inventory-footnote">
            <Save size={16} /> Cada cambio se guarda automáticamente en este dispositivo.
          </div>
        </Panel>
      )}

      {step === 3 && (
        <div className="two-column-page">
          <Panel title="3. Registrar un cambio del mes" className="event-form-panel">
            <div className="event-form-grid">
              <label className="field-label">Fecha<input type="date" value={eventForm.date} disabled={isClosed} onChange={(event) => setEventForm({ ...eventForm, date: event.target.value })} /></label>
              <label className="field-label">Tipo<select value={eventForm.type} disabled={isClosed} onChange={(event) => setEventForm({ ...eventForm, type: event.target.value as AnimalEventType })}>{Object.entries(EVENT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              {['movimiento', 'muerte', 'venta', 'reclasificacion', 'correccion'].includes(eventForm.type) && (
                <label className="field-label">Lote de origen<select value={eventForm.originLotId} disabled={isClosed} onChange={(event) => setEventForm({ ...eventForm, originLotId: event.target.value })}>{LOTS.map((lot) => <option key={lot.id} value={lot.id}>{lot.name}</option>)}</select></label>
              )}
              {['movimiento', 'nacimiento', 'compra'].includes(eventForm.type) && (
                <label className="field-label">Lote de destino<select value={eventForm.destinationLotId} disabled={isClosed} onChange={(event) => setEventForm({ ...eventForm, destinationLotId: event.target.value })}>{LOTS.map((lot) => <option key={lot.id} value={lot.id}>{lot.name}</option>)}</select></label>
              )}
              <label className="field-label">Categoría<select value={eventForm.categoryId} disabled={isClosed} onChange={(event) => setEventForm({ ...eventForm, categoryId: event.target.value })}>{CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
              {eventForm.type === 'reclasificacion' && (
                <label className="field-label">Nueva categoría<select value={eventForm.destinationCategoryId} disabled={isClosed} onChange={(event) => setEventForm({ ...eventForm, destinationCategoryId: event.target.value })}>{CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
              )}
              <label className="field-label">Cantidad<input type="number" min="1" value={eventForm.quantity} disabled={isClosed} onChange={(event) => setEventForm({ ...eventForm, quantity: Number(event.target.value) })} /></label>
              <label className="field-label field-label--wide">Motivo u observación<input value={eventForm.reason} disabled={isClosed} onChange={(event) => setEventForm({ ...eventForm, reason: event.target.value })} placeholder="Ej.: rotación, venta anual, servicio…" /></label>
              <label className="checkbox-field field-label--wide"><input type="checkbox" checked={eventForm.applyToInventory} disabled={isClosed} onChange={(event) => setEventForm({ ...eventForm, applyToInventory: event.target.checked })} /><span><strong>Aplicar también al inventario del mes</strong><small>Recomendado cuando registrás el evento antes de cargar el estado final.</small></span></label>
            </div>
            <button type="button" className="button button--primary button--block" disabled={isClosed || eventForm.quantity <= 0} onClick={submitEvent}><Plus size={17} /> Registrar cambio</button>
          </Panel>

          <Panel title={`Cambios registrados (${currentEvents.length})`}>
            <div className="event-list">
              {currentEvents.map((event) => (
                <article key={event.id}>
                  <span className={`event-type event-type--${event.type}`}>{EVENT_LABELS[event.type]}</span>
                  <div>
                    <strong>{event.quantity} · {CATEGORIES.find((category) => category.id === event.categoryId)?.shortName}</strong>
                    <small>{event.originLotId ?? '—'} {event.destinationLotId ? `→ ${event.destinationLotId}` : ''} · {formatDate(event.date)}</small>
                    <p>{event.reason}</p>
                  </div>
                  <Badge tone={event.status === 'confirmado' ? 'success' : 'warning'}>{event.source}</Badge>
                  {!isClosed && <button type="button" className="icon-button icon-button--danger" onClick={() => removeEvent(event.id)} title="Eliminar"><Trash2 size={16} /></button>}
                </article>
              ))}
              {!currentEvents.length && <div className="empty-inline"><Sparkles size={24} /><span>No hay cambios registrados todavía.</span></div>}
            </div>
          </Panel>
        </div>
      )}

      {step === 4 && (
        <Panel
          title="4. Conciliación entre meses"
          action={<Badge tone={suggestions.length ? 'warning' : 'success'}>{suggestions.length ? `${suggestions.length} pendientes` : 'Todo conciliado'}</Badge>}
        >
          <div className="reconciliation-intro">
            <Sparkles size={24} />
            <div><strong>Campo compara el inventario con el mes anterior y los eventos registrados.</strong><p>Las reglas son sugerencias. Confirmalas o elegí otra explicación; nunca se crean movimientos en silencio.</p></div>
          </div>
          <div className="reconciliation-list">
            {suggestions.map((suggestion) => {
              const selectedType = suggestionTypes[suggestion.id] ?? suggestion.suggestedType
              const needsLot = selectedType === 'movimiento' && (suggestion.kind === 'entrada' || suggestion.kind === 'salida')
              return (
                <article key={suggestion.id} className={`reconciliation-card confidence-${suggestion.confidence}`}>
                  <div className="reconciliation-card__main">
                    <span className="confidence-dot" />
                    <div>
                      <div className="reconciliation-title-row">
                        <strong>{suggestion.quantity} · {CATEGORIES.find((category) => category.id === suggestion.categoryId)?.name}</strong>
                        <Badge tone={suggestion.confidence === 'alta' ? 'success' : suggestion.confidence === 'media' ? 'warning' : 'neutral'}>Confianza {suggestion.confidence}</Badge>
                      </div>
                      <p>{suggestion.explanation}</p>
                      <small>{suggestion.originLotId ?? 'Entrada externa'} {suggestion.destinationLotId ? `→ ${suggestion.destinationLotId}` : suggestion.originLotId ? '→ Salida externa' : ''}</small>
                    </div>
                  </div>
                  <div className="reconciliation-card__controls">
                    <label>Explicación<select value={selectedType} disabled={isClosed} onChange={(event) => setSuggestionTypes({ ...suggestionTypes, [suggestion.id]: event.target.value as AnimalEventType })}>{suggestedOptions(suggestion).map((type) => <option key={type} value={type}>{EVENT_LABELS[type]}</option>)}</select></label>
                    {needsLot && (
                      <label>{suggestion.kind === 'entrada' ? 'Lote origen' : 'Lote destino'}<select value={suggestionLots[suggestion.id] ?? ''} disabled={isClosed} onChange={(event) => setSuggestionLots({ ...suggestionLots, [suggestion.id]: event.target.value })}><option value="">Seleccionar…</option>{LOTS.filter((lot) => lot.id !== suggestion.originLotId && lot.id !== suggestion.destinationLotId).map((lot) => <option key={lot.id} value={lot.id}>{lot.name}</option>)}</select></label>
                    )}
                    <button type="button" className="button button--primary" disabled={isClosed || (needsLot && !suggestionLots[suggestion.id])} onClick={() => confirmSuggestion(suggestion)}><CheckCircle2 size={16} /> Validar</button>
                  </div>
                </article>
              )
            })}
            {!suggestions.length && (
              <div className="reconciliation-success">
                <CheckCircle2 size={38} />
                <h3>El inventario está conciliado</h3>
                <p>Las diferencias entre {formatPeriod(previousPeriod(period))} y {formatPeriod(period)} están explicadas.</p>
              </div>
            )}
          </div>
        </Panel>
      )}

      {step === 5 && (
        <div className="two-column-page two-column-page--rain">
          <Panel title="5. Lluvia del mes">
            <div className="rain-entry">
              <span className="rain-entry__icon"><CloudRain size={42} /></span>
              <label>
                <span>Milímetros registrados en todo El Rosario</span>
                <div><input type="number" min="0" value={rain ?? ''} disabled={isClosed} onChange={(event) => setRain(period, Number(event.target.value))} /><strong>mm</strong></div>
              </label>
            </div>
            <p className="helper-text">En el MVP se registra un único valor mensual para todo el campo.</p>
          </Panel>
          <Panel title="Revisión anual de pasturas" action={<Badge tone="info">Opcional este mes</Badge>}>
            <div className="pasture-review-list">
              {LOTS.filter((lot) => state.pastures.some((pasture) => pasture.lotId === lot.id)).map((lot) => (
                <div key={lot.id}>
                  <strong>{lot.name}</strong>
                  <span>{state.pastures.filter((pasture) => pasture.lotId === lot.id).map((pasture) => `${PASTURE_LABELS[pasture.type]} · ${pasture.hectares} ha`).join(' · ')}</span>
                  <Badge tone="success">Actualizada</Badge>
                </div>
              ))}
              <p className="helper-text">Las superficies de pastura son subconjuntos del lote. Los animales continúan asignados al lote completo.</p>
            </div>
          </Panel>
        </div>
      )}

      {step === 6 && (
        <div className="final-review-grid">
          <Panel title={`6. Resumen de ${formatPeriod(period)}`} className="monthly-summary-panel">
            <div className="summary-flow">
              <div><small>Inventario inicial</small><strong>{formatNumber(summary.opening)}</strong></div>
              <span>+</span><div><small>Nacimientos</small><strong className="positive">{formatNumber(summary.births)}</strong></div>
              <span>+</span><div><small>Compras</small><strong className="positive">{formatNumber(summary.purchases)}</strong></div>
              <span>−</span><div><small>Ventas</small><strong className="negative">{formatNumber(summary.sales)}</strong></div>
              <span>−</span><div><small>Muertes</small><strong className="negative">{formatNumber(summary.deaths)}</strong></div>
              <span>=</span><div className="summary-flow__result"><small>Inventario final</small><strong>{formatNumber(summary.closing)}</strong></div>
            </div>
            <div className="summary-stats">
              <div><span>Movimientos validados</span><strong>{eventTotals(state, period).movements}</strong></div>
              <div><span>Reclasificaciones</span><strong>{eventTotals(state, period).reclassifications}</strong></div>
              <div><span>Correcciones</span><strong>{eventTotals(state, period).corrections}</strong></div>
              <div><span>Diferencias sin explicar</span><strong className={suggestions.length ? 'negative' : 'positive'}>{suggestions.length}</strong></div>
              <div><span>Lluvia mensual</span><strong>{rain === undefined ? 'Pendiente' : `${rain} mm`}</strong></div>
            </div>
            {isClosed ? (
              <div className="closed-month-box">
                <LockKeyhole size={26} />
                <div><strong>Mes cerrado</strong><p>El cierre protege el historial. Para editar, indicá por qué necesitás reabrirlo.</p></div>
                <input value={reopenReason} onChange={(event) => setReopenReason(event.target.value)} placeholder="Motivo de reapertura" />
                <button type="button" className="button button--secondary" disabled={!reopenReason.trim()} onClick={() => { setMonthStatus(period, 'borrador', reopenReason); setReopenReason('') }}><RefreshCcw size={16} /> Reabrir mes</button>
              </div>
            ) : (
              <button type="button" className="button button--primary button--large button--block" disabled={suggestions.length > 0 || rain === undefined} onClick={closeMonth}><LockKeyhole size={18} /> Cerrar {formatPeriod(period)}</button>
            )}
            {!isClosed && (suggestions.length > 0 || rain === undefined) && (
              <div className="close-blockers"><AlertTriangle size={17} /><span>{suggestions.length > 0 ? `Validá ${suggestions.length} diferencia${suggestions.length === 1 ? '' : 's'}. ` : ''}{rain === undefined ? 'Cargá la lluvia del mes.' : ''}</span></div>
            )}
          </Panel>
          <Panel title={`Alertas finales (${alerts.length})`}>
            <AlertList alerts={alerts} />
          </Panel>
        </div>
      )}

      <div className="workflow-navigation">
        <button type="button" className="button button--ghost" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))}><ArrowLeft size={17} /> Anterior</button>
        <span>Paso {step} de {STEPS.length}</span>
        <button type="button" className="button button--primary" disabled={step === STEPS.length || nextDisabled} onClick={() => setStep((current) => Math.min(STEPS.length, current + 1))}>Siguiente <ArrowRight size={17} /></button>
      </div>
    </div>
  )
}
