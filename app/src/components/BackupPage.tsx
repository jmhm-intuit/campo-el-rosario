import { useRef, useState } from 'react'
import {
  AlertTriangle,
  DatabaseBackup,
  Download,
  FileJson,
  FileSpreadsheet,
  HardDrive,
  RefreshCcw,
  Trash2,
  Upload,
} from 'lucide-react'
import { useCampo } from '../data/CampoStore'
import type { AppState } from '../types'
import {
  downloadTextFile,
  eventsToCSV,
  inventoryToCSV,
  INVENTORY_TEMPLATE,
  EVENTS_TEMPLATE,
  pastureToCSV,
  rainToCSV,
} from '../utils/csv'
import { formatPeriod } from '../utils/format'
import { Badge, Panel } from './UI'

export function BackupPage() {
  const { state, importBackup, resetDemo, clearAll } = useCampo()
  const restoreRef = useRef<HTMLInputElement | null>(null)
  const [message, setMessage] = useState('')

  const exportBackup = () => {
    downloadTextFile(
      `campo-el-rosario-respaldo-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(state, null, 2),
      'application/json;charset=utf-8',
    )
  }

  const restoreBackup = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as AppState
      if (!parsed || !Array.isArray(parsed.inventory) || !Array.isArray(parsed.events) || !Array.isArray(parsed.months)) {
        throw new Error('El archivo no tiene la estructura de un respaldo de Campo.')
      }
      importBackup(parsed)
      setMessage('Respaldo restaurado correctamente.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo restaurar el respaldo.')
    }
  }

  return (
    <div className="backup-page page-stack">
      <div className="local-storage-callout">
        <HardDrive size={34} />
        <div><Badge tone="warning">MVP local</Badge><h2>Los datos viven en este navegador</h2><p>La URL se puede compartir, pero cada dispositivo mantiene una base independiente. Exportá un respaldo antes de borrar datos del navegador o cambiar de equipo.</p></div>
      </div>

      <div className="backup-grid">
        <Panel title="Respaldo completo" className="backup-card backup-card--primary">
          <DatabaseBackup size={34} />
          <h3>Guardar todo el estado de Campo</h3>
          <p>Incluye inventarios, eventos, lluvia, pasturas, cierres mensuales y decisiones de conciliación.</p>
          <div className="backup-card__actions">
            <button type="button" className="button button--primary" onClick={exportBackup}><Download size={17} /> Exportar JSON</button>
            <button type="button" className="button button--secondary" onClick={() => restoreRef.current?.click()}><Upload size={17} /> Restaurar respaldo</button>
          </div>
          <input ref={restoreRef} type="file" accept=".json,application/json" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) restoreBackup(file); event.target.value = '' }} />
          {message && <p className="backup-message">{message}</p>}
        </Panel>

        <Panel title="Inventario CSV" className="backup-card">
          <FileSpreadsheet size={32} />
          <h3>Animales por lote y categoría</h3>
          <p>Exportá solo {formatPeriod(state.selectedPeriod)} o todo el historial para analizarlo en Excel.</p>
          <div className="backup-card__actions backup-card__actions--stack">
            <button type="button" className="button button--secondary" onClick={() => downloadTextFile(`inventario-${state.selectedPeriod}.csv`, inventoryToCSV(state, state.selectedPeriod))}>Período actual</button>
            <button type="button" className="button button--secondary" onClick={() => downloadTextFile('inventario-historico.csv', inventoryToCSV(state))}>Todo el historial</button>
          </div>
        </Panel>

        <Panel title="Eventos CSV" className="backup-card">
          <FileSpreadsheet size={32} />
          <h3>Movimientos y cambios</h3>
          <p>Incluye movimientos, nacimientos, muertes, ventas, compras, reclasificaciones y correcciones.</p>
          <button type="button" className="button button--secondary button--block" onClick={() => downloadTextFile('movimientos-y-eventos.csv', eventsToCSV(state.events))}><Download size={16} /> Exportar eventos</button>
        </Panel>

        <Panel title="Lluvia y pasturas" className="backup-card">
          <FileSpreadsheet size={32} />
          <h3>Datos productivos complementarios</h3>
          <p>Dos archivos separados para facilitar el análisis y una futura migración a Supabase.</p>
          <div className="backup-card__actions backup-card__actions--stack">
            <button type="button" className="button button--secondary" onClick={() => downloadTextFile('lluvia.csv', rainToCSV(state))}>Exportar lluvia</button>
            <button type="button" className="button button--secondary" onClick={() => downloadTextFile('pasturas.csv', pastureToCSV(state))}>Exportar pasturas</button>
          </div>
        </Panel>
      </div>

      <Panel title="Plantillas de importación">
        <div className="template-row">
          <div><FileSpreadsheet size={25} /><span><strong>Inventario mensual</strong><small>Período, lote, categoría y cantidad obligatorios.</small></span></div>
          <button type="button" className="button button--secondary" onClick={() => downloadTextFile('plantilla-inventario.csv', INVENTORY_TEMPLATE)}><Download size={16} /> Descargar</button>
        </div>
        <div className="template-row">
          <div><FileJson size={25} /><span><strong>Eventos mensuales</strong><small>Movimientos, ventas, muertes, compras y otros cambios.</small></span></div>
          <button type="button" className="button button--secondary" onClick={() => downloadTextFile('plantilla-eventos.csv', EVENTS_TEMPLATE)}><Download size={16} /> Descargar</button>
        </div>
      </Panel>

      <Panel title="Herramientas de prueba" className="danger-zone">
        <div className="danger-zone__row">
          <div><RefreshCcw size={22} /><span><strong>Restablecer datos de demostración</strong><small>Vuelve a cargar el ejemplo incluido en el MVP.</small></span></div>
          <button type="button" className="button button--secondary" onClick={() => window.confirm('¿Restablecer los datos de demostración?') && resetDemo()}>Restablecer demo</button>
        </div>
        <div className="danger-zone__row">
          <div><AlertTriangle size={22} /><span><strong>Eliminar todos los datos locales</strong><small>Esta acción no puede deshacerse sin un respaldo.</small></span></div>
          <button type="button" className="button button--danger" onClick={() => window.confirm('¿Eliminar todos los datos locales? Exportá un respaldo antes de continuar.') && clearAll()}><Trash2 size={16} /> Eliminar todo</button>
        </div>
      </Panel>
    </div>
  )
}
