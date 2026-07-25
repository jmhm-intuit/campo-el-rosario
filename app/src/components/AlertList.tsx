import { AlertCircle, ChevronRight, CircleAlert, Info, TriangleAlert } from 'lucide-react'
import type { AlertItem } from '../types'

const icons = {
  critica: AlertCircle,
  advertencia: TriangleAlert,
  informativa: Info,
}

export function AlertList({
  alerts,
  limit,
  onSelect,
}: {
  alerts: AlertItem[]
  limit?: number
  onSelect?: (alert: AlertItem) => void
}) {
  const visible = typeof limit === 'number' ? alerts.slice(0, limit) : alerts
  if (!visible.length) {
    return (
      <div className="alerts-empty">
        <CircleAlert size={26} />
        <strong>Sin alertas activas</strong>
        <span>El período no presenta avisos pendientes.</span>
      </div>
    )
  }
  return (
    <div className="alert-list">
      {visible.map((alert) => {
        const Icon = icons[alert.severity]
        return (
          <button type="button" key={alert.id} className={`alert-row alert-row--${alert.severity}`} onClick={() => onSelect?.(alert)}>
            <span className="alert-row__icon">
              <Icon size={18} />
            </span>
            <span className="alert-row__content">
              <strong>{alert.title}</strong>
              <small>{alert.description}</small>
            </span>
            <ChevronRight size={17} />
          </button>
        )
      })}
    </div>
  )
}
