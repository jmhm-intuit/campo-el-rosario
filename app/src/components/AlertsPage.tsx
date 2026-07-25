import { useMemo, useState } from 'react'
import { AlertCircle, Bell, Info, Settings2, TriangleAlert } from 'lucide-react'
import { useCampo } from '../data/CampoStore'
import type { AlertItem, ViewKey } from '../types'
import { buildAlerts } from '../utils/calculations'
import { AlertList } from './AlertList'
import { Badge, Panel } from './UI'

export function AlertsPage({
  onNavigate,
  onOpenLot,
}: {
  onNavigate: (view: ViewKey) => void
  onOpenLot: (lotId: string) => void
}) {
  const { state } = useCampo()
  const [filter, setFilter] = useState<'todas' | AlertItem['severity']>('todas')
  const alerts = useMemo(() => buildAlerts(state, state.selectedPeriod), [state])
  const filtered = filter === 'todas' ? alerts : alerts.filter((alert) => alert.severity === filter)
  const counts = {
    critica: alerts.filter((alert) => alert.severity === 'critica').length,
    advertencia: alerts.filter((alert) => alert.severity === 'advertencia').length,
    informativa: alerts.filter((alert) => alert.severity === 'informativa').length,
  }

  const handleSelect = (alert: AlertItem) => {
    if (alert.lotId) {
      onOpenLot(alert.lotId)
      onNavigate('mapa')
    }
  }

  return (
    <div className="alerts-page page-stack">
      <div className="alert-summary-grid">
        <button type="button" className={filter === 'critica' ? 'is-active' : ''} onClick={() => setFilter(filter === 'critica' ? 'todas' : 'critica')}><AlertCircle size={24} /><span><small>Críticas</small><strong>{counts.critica}</strong></span></button>
        <button type="button" className={filter === 'advertencia' ? 'is-active' : ''} onClick={() => setFilter(filter === 'advertencia' ? 'todas' : 'advertencia')}><TriangleAlert size={24} /><span><small>Advertencias</small><strong>{counts.advertencia}</strong></span></button>
        <button type="button" className={filter === 'informativa' ? 'is-active' : ''} onClick={() => setFilter(filter === 'informativa' ? 'todas' : 'informativa')}><Info size={24} /><span><small>Informativas</small><strong>{counts.informativa}</strong></span></button>
        <button type="button" className={filter === 'todas' ? 'is-active' : ''} onClick={() => setFilter('todas')}><Bell size={24} /><span><small>Total activas</small><strong>{alerts.length}</strong></span></button>
      </div>

      <div className="alerts-layout">
        <Panel title="Alertas del período" action={<Badge tone="info">Reglas del MVP</Badge>}>
          <AlertList alerts={filtered} onSelect={handleSelect} />
        </Panel>
        <Panel title="Cómo funcionan">
          <div className="rule-list">
            <article><span>1</span><div><strong>Carga animal</strong><p>Compara los EV/ha del lote con el objetivo fijo de 0,80 EV/ha.</p></div></article>
            <article><span>2</span><div><strong>Calidad de datos</strong><p>Detecta lluvia faltante, conciliaciones abiertas y eventos pendientes.</p></div></article>
            <article><span>3</span><div><strong>Reproducción</strong><p>Usa recordatorios mensuales simples para planificar la entrada y salida de toros.</p></div></article>
            <article><span>4</span><div><strong>Pasturas</strong><p>Recuerda revisar ventanas de siembra. Los ciclos estacionales avanzados quedan para una versión futura.</p></div></article>
          </div>
          <div className="future-note"><Settings2 size={18} /><span><strong>Próxima versión</strong><small>La pestaña Supuestos permitirá cambiar factores de carga, umbrales y calendarios.</small></span></div>
        </Panel>
      </div>
    </div>
  )
}
