import { useEffect, useMemo, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { AlertsPage } from './components/AlertsPage'
import { AnimalsPage } from './components/AnimalsPage'
import { BackupPage } from './components/BackupPage'
import { Dashboard } from './components/Dashboard'
import { DataUpload } from './components/DataUpload'
import { Header } from './components/Header'
import { HistoryPage } from './components/HistoryPage'
import { MapPage } from './components/MapPage'
import { MovementsPage } from './components/MovementsPage'
import { PasturesPage } from './components/PasturesPage'
import { Sidebar } from './components/Sidebar'
import { useCampo } from './data/CampoStore'
import type { ViewKey } from './types'
import { buildAlerts } from './utils/calculations'

const VALID_VIEWS: ViewKey[] = [
  'resumen',
  'carga',
  'mapa',
  'animales',
  'movimientos',
  'pasturas',
  'historico',
  'alertas',
  'respaldo',
]

const VIEW_TITLES: Record<ViewKey, { title: string; subtitle: string }> = {
  resumen: { title: 'Resumen del Campo', subtitle: 'El Rosario' },
  carga: { title: 'Carga de datos', subtitle: 'Actualización mensual simple y guiada' },
  mapa: { title: 'Mapa del Campo', subtitle: 'Animales, carga y pasturas por lote' },
  animales: { title: 'Animales', subtitle: 'Grupos por lote y categoría' },
  movimientos: { title: 'Movimientos', subtitle: 'Trazabilidad de cambios del mes' },
  pasturas: { title: 'Pasturas', subtitle: 'Subáreas dentro de cada lote' },
  historico: { title: 'Histórico', subtitle: 'Comparación mes a mes y evolución' },
  alertas: { title: 'Alertas', subtitle: 'Prioridades operativas y calidad de datos' },
  respaldo: { title: 'Exportar y respaldo', subtitle: 'Protección de los datos locales' },
}

function initialView(): ViewKey {
  const hash = window.location.hash.replace('#/', '').replace('#', '') as ViewKey
  return VALID_VIEWS.includes(hash) ? hash : 'resumen'
}

export default function App() {
  const { state, loading, saving, storageError, setSelectedPeriod } = useCampo()
  const [activeView, setActiveView] = useState<ViewKey>(initialView)
  const [initialLotId, setInitialLotId] = useState<string>()
  const periods = useMemo(
    () => [...new Set([...state.months.map((month) => month.period), ...state.inventory.map((entry) => entry.period)])].sort(),
    [state.months, state.inventory],
  )
  const alerts = useMemo(() => buildAlerts(state, state.selectedPeriod), [state])

  useEffect(() => {
    const onHashChange = () => setActiveView(initialView())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (view: ViewKey) => {
    setActiveView(view)
    window.location.hash = `/${view}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openLot = (lotId: string) => {
    setInitialLotId(lotId)
  }

  if (loading) {
    return (
      <div className="app-loading">
        <div className="brand__mark"><LoaderCircle className="spin" size={38} /></div>
        <strong>Abriendo Campo</strong>
        <span>Cargando la base local…</span>
      </div>
    )
  }

  const header = VIEW_TITLES[activeView]

  return (
    <div className="app-shell">
      <Sidebar active={activeView} onNavigate={navigate} alertCount={alerts.length} userName={state.userName} />
      <div className="app-content">
        <Header
          title={header.title}
          subtitle={header.subtitle}
          period={state.selectedPeriod}
          periods={periods}
          onPeriodChange={setSelectedPeriod}
          saving={saving}
          storageError={storageError}
        />
        <main className="page-container">
          {activeView === 'resumen' && <Dashboard onNavigate={navigate} onOpenLot={openLot} />}
          {activeView === 'carga' && <DataUpload />}
          {activeView === 'mapa' && <MapPage key={initialLotId ?? 'map'} initialLotId={initialLotId} />}
          {activeView === 'animales' && <AnimalsPage />}
          {activeView === 'movimientos' && <MovementsPage onNavigate={navigate} />}
          {activeView === 'pasturas' && <PasturesPage />}
          {activeView === 'historico' && <HistoryPage />}
          {activeView === 'alertas' && <AlertsPage onNavigate={navigate} onOpenLot={openLot} />}
          {activeView === 'respaldo' && <BackupPage />}
        </main>
      </div>
    </div>
  )
}
