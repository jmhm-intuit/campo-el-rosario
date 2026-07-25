import { CalendarDays, Check, CloudOff, Database, LoaderCircle, Menu } from 'lucide-react'
import { nextPeriod } from '../utils/format'

interface HeaderProps {
  title: string
  subtitle?: string
  period: string
  periods: string[]
  onPeriodChange: (period: string) => void
  saving: boolean
  storageError?: string
  onMenu?: () => void
}

export function Header({
  title,
  subtitle,
  period,
  periods,
  onPeriodChange,
  saving,
  storageError,
  onMenu,
}: HeaderProps) {
  const allPeriods = [...new Set([...periods, nextPeriod(period)])].sort().reverse()
  return (
    <header className="topbar">
      <div className="topbar__title">
        <button type="button" className="topbar__menu" onClick={onMenu} aria-label="Abrir menú">
          <Menu size={22} />
        </button>
        <span>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </span>
      </div>
      <div className="topbar__actions">
        <label className="period-picker">
          <CalendarDays size={18} />
          <select value={period} onChange={(event) => onPeriodChange(event.target.value)} aria-label="Período actual">
            {allPeriods.map((item) => (
              <option key={item} value={item}>
                {new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(
                  new Date(Number(item.slice(0, 4)), Number(item.slice(5, 7)) - 1, 1),
                )}
              </option>
            ))}
          </select>
        </label>
        <div className={`save-status ${storageError ? 'save-status--error' : ''}`} title={storageError}>
          {storageError ? (
            <CloudOff size={17} />
          ) : saving ? (
            <LoaderCircle size={17} className="spin" />
          ) : (
            <Check size={17} />
          )}
          <span>{storageError ? 'Error local' : saving ? 'Guardando…' : 'Guardado local'}</span>
          <Database size={15} />
        </div>
      </div>
    </header>
  )
}
