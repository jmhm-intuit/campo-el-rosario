import {
  AlertTriangle,
  ArrowLeftRight,
  Beef,
  Bell,
  ChartNoAxesCombined,
  CloudUpload,
  DatabaseBackup,
  FileSpreadsheet,
  Home,
  Map,
  Settings2,
  Sprout,
} from 'lucide-react'
import type { ViewKey } from '../types'

const ITEMS: { key: ViewKey; label: string; icon: typeof Home; mobile?: boolean }[] = [
  { key: 'resumen', label: 'Resumen', icon: Home, mobile: true },
  { key: 'carga', label: 'Carga de datos', icon: CloudUpload, mobile: true },
  { key: 'mapa', label: 'Mapa', icon: Map, mobile: true },
  { key: 'animales', label: 'Animales', icon: Beef, mobile: true },
  { key: 'movimientos', label: 'Movimientos', icon: ArrowLeftRight, mobile: true },
  { key: 'pasturas', label: 'Pasturas', icon: Sprout },
  { key: 'historico', label: 'Histórico', icon: ChartNoAxesCombined },
  { key: 'alertas', label: 'Alertas', icon: Bell },
  { key: 'respaldo', label: 'Exportar y respaldo', icon: DatabaseBackup },
]

interface SidebarProps {
  active: ViewKey
  onNavigate: (view: ViewKey) => void
  alertCount: number
  userName: string
}

export function Sidebar({ active, onNavigate, alertCount, userName }: SidebarProps) {
  return (
    <>
      <aside className="sidebar">
        <button type="button" className="brand" onClick={() => onNavigate('resumen')} aria-label="Ir al resumen">
          <span className="brand__mark" aria-hidden="true">
            <Beef size={36} />
            <i />
          </span>
          <span>
            <strong>CAMPO</strong>
            <small>El Rosario</small>
          </span>
        </button>

        <nav className="sidebar__nav" aria-label="Navegación principal">
          {ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              type="button"
              key={key}
              className={active === key ? 'is-active' : ''}
              onClick={() => onNavigate(key)}
            >
              <Icon size={20} strokeWidth={2} />
              <span>{label}</span>
              {key === 'alertas' && alertCount > 0 && <b>{alertCount}</b>}
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="local-badge">
            <FileSpreadsheet size={17} />
            <span>
              <strong>Datos locales</strong>
              <small>Guardado en este dispositivo</small>
            </span>
          </div>
          <div className="user-card">
            <span className="user-card__avatar">{userName.slice(0, 1).toUpperCase()}</span>
            <span>
              <strong>{userName}</strong>
              <small>Administrador</small>
            </span>
            <Settings2 size={17} />
          </div>
          <small className="sidebar__version">Campo MVP · v0.1.0</small>
        </div>
      </aside>

      <nav className="mobile-nav" aria-label="Navegación móvil">
        {ITEMS.filter((item) => item.mobile).map(({ key, label, icon: Icon }) => (
          <button
            type="button"
            key={key}
            className={active === key ? 'is-active' : ''}
            onClick={() => onNavigate(key)}
          >
            <Icon size={20} />
            <span>{label === 'Carga de datos' ? 'Cargar' : label}</span>
          </button>
        ))}
        <button type="button" className={active === 'alertas' ? 'is-active' : ''} onClick={() => onNavigate('alertas')}>
          {alertCount > 0 ? <AlertTriangle size={20} /> : <Bell size={20} />}
          <span>Alertas</span>
          {alertCount > 0 && <b>{alertCount}</b>}
        </button>
      </nav>
    </>
  )
}
