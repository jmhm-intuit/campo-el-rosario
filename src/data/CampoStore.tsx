import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createDemoState } from './sample'
import { dataStore } from '../db/store'
import type {
  AnimalEvent,
  AppState,
  InventoryEntry,
  MonthStatus,
  PastureArea,
} from '../types'
import { previousPeriod } from '../utils/format'

interface CampoContextValue {
  state: AppState
  loading: boolean
  saving: boolean
  storageError?: string
  setSelectedPeriod: (period: string) => void
  setInventoryCell: (period: string, lotId: string, categoryId: string, quantity: number) => void
  replacePeriodInventory: (period: string, entries: InventoryEntry[]) => void
  copyPreviousMonth: (period: string) => void
  addEvent: (event: AnimalEvent) => void
  updateEvent: (event: AnimalEvent) => void
  removeEvent: (eventId: string) => void
  setRain: (period: string, millimeters: number) => void
  updatePasture: (pasture: PastureArea) => void
  addPasture: (pasture: PastureArea) => void
  removePasture: (pastureId: string) => void
  setMonthStatus: (period: string, status: MonthStatus, reopenedReason?: string) => void
  importBackup: (state: AppState) => void
  resetDemo: () => Promise<void>
  clearAll: () => Promise<void>
}

const CampoContext = createContext<CampoContextValue | null>(null)

function ensureMonth(state: AppState, period: string, status: MonthStatus = 'borrador'): AppState {
  if (state.months.some((month) => month.period === period)) return state
  return {
    ...state,
    months: [...state.months, { period, status }].sort((a, b) => a.period.localeCompare(b.period)),
  }
}

export function CampoProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AppState>(() => createDemoState())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [storageError, setStorageError] = useState<string>()
  const hasLoaded = useRef(false)

  useEffect(() => {
    let active = true
    dataStore
      .load()
      .then((stored) => {
        if (!active) return
        setState(stored ?? createDemoState())
        hasLoaded.current = true
        setLoading(false)
      })
      .catch((error: unknown) => {
        if (!active) return
        setStorageError(error instanceof Error ? error.message : 'No se pudo abrir el almacenamiento local.')
        hasLoaded.current = true
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!hasLoaded.current || loading) return
    setSaving(true)
    const timer = window.setTimeout(() => {
      const next = { ...state, updatedAt: new Date().toISOString() }
      dataStore
        .save(next)
        .then(() => setStorageError(undefined))
        .catch((error: unknown) =>
          setStorageError(error instanceof Error ? error.message : 'No se pudo guardar localmente.'),
        )
        .finally(() => setSaving(false))
    }, 300)
    return () => window.clearTimeout(timer)
  }, [state, loading])

  const mutate = useCallback((updater: (current: AppState) => AppState) => {
    setState((current) => ({ ...updater(current), updatedAt: new Date().toISOString() }))
  }, [])

  const setSelectedPeriod = useCallback(
    (period: string) => {
      mutate((current) => ({ ...ensureMonth(current, period), selectedPeriod: period }))
    },
    [mutate],
  )

  const setInventoryCell = useCallback(
    (period: string, lotId: string, categoryId: string, quantity: number) => {
      mutate((current) => {
        const next = ensureMonth(current, period)
        const withoutCell = next.inventory.filter(
          (entry) => !(entry.period === period && entry.lotId === lotId && entry.categoryId === categoryId),
        )
        const rounded = Math.max(0, Math.round(Number.isFinite(quantity) ? quantity : 0))
        return {
          ...next,
          inventory: rounded
            ? [
                ...withoutCell,
                {
                  id: crypto.randomUUID(),
                  period,
                  lotId,
                  categoryId,
                  quantity: rounded,
                },
              ]
            : withoutCell,
        }
      })
    },
    [mutate],
  )

  const replacePeriodInventory = useCallback(
    (period: string, entries: InventoryEntry[]) => {
      mutate((current) => {
        const next = ensureMonth(current, period)
        return {
          ...next,
          inventory: [
            ...next.inventory.filter((entry) => entry.period !== period),
            ...entries.map((entry) => ({ ...entry, period })),
          ],
        }
      })
    },
    [mutate],
  )

  const copyPreviousMonth = useCallback(
    (period: string) => {
      mutate((current) => {
        const sourcePeriod = previousPeriod(period)
        const source = current.inventory.filter((entry) => entry.period === sourcePeriod)
        const next = ensureMonth(current, period)
        return {
          ...next,
          inventory: [
            ...next.inventory.filter((entry) => entry.period !== period),
            ...source.map((entry) => ({
              ...entry,
              id: crypto.randomUUID(),
              period,
            })),
          ],
        }
      })
    },
    [mutate],
  )

  const addEvent = useCallback(
    (event: AnimalEvent) => mutate((current) => ({ ...current, events: [...current.events, event] })),
    [mutate],
  )

  const updateEvent = useCallback(
    (event: AnimalEvent) =>
      mutate((current) => ({
        ...current,
        events: current.events.map((candidate) => (candidate.id === event.id ? event : candidate)),
      })),
    [mutate],
  )

  const removeEvent = useCallback(
    (eventId: string) =>
      mutate((current) => ({
        ...current,
        events: current.events.filter((event) => event.id !== eventId),
      })),
    [mutate],
  )

  const setRain = useCallback(
    (period: string, millimeters: number) => {
      mutate((current) => ({
        ...current,
        rain: [
          ...current.rain.filter((record) => record.period !== period),
          { period, millimeters: Math.max(0, Number.isFinite(millimeters) ? millimeters : 0) },
        ].sort((a, b) => a.period.localeCompare(b.period)),
      }))
    },
    [mutate],
  )

  const updatePasture = useCallback(
    (pasture: PastureArea) =>
      mutate((current) => ({
        ...current,
        pastures: current.pastures.map((candidate) => (candidate.id === pasture.id ? pasture : candidate)),
      })),
    [mutate],
  )

  const addPasture = useCallback(
    (pasture: PastureArea) =>
      mutate((current) => ({ ...current, pastures: [...current.pastures, pasture] })),
    [mutate],
  )

  const removePasture = useCallback(
    (pastureId: string) =>
      mutate((current) => ({
        ...current,
        pastures: current.pastures.filter((pasture) => pasture.id !== pastureId),
      })),
    [mutate],
  )

  const setMonthStatus = useCallback(
    (period: string, status: MonthStatus, reopenedReason?: string) => {
      mutate((current) => {
        const next = ensureMonth(current, period)
        return {
          ...next,
          months: next.months.map((month) =>
            month.period === period
              ? {
                  ...month,
                  status,
                  closedAt: status === 'cerrado' ? new Date().toISOString() : undefined,
                  reopenedReason: status === 'borrador' ? reopenedReason : month.reopenedReason,
                }
              : month,
          ),
        }
      })
    },
    [mutate],
  )

  const importBackup = useCallback((nextState: AppState) => {
    setState({ ...nextState, updatedAt: new Date().toISOString() })
  }, [])

  const resetDemo = useCallback(async () => {
    const demo = createDemoState()
    setState(demo)
    await dataStore.save(demo)
  }, [])

  const clearAll = useCallback(async () => {
    const blank = createDemoState()
    blank.inventory = []
    blank.events = []
    blank.rain = []
    blank.months = [{ period: blank.selectedPeriod, status: 'borrador' }]
    blank.pastures = []
    blank.seededDemoData = false
    setState(blank)
    await dataStore.save(blank)
  }, [])

  const value = useMemo<CampoContextValue>(
    () => ({
      state,
      loading,
      saving,
      storageError,
      setSelectedPeriod,
      setInventoryCell,
      replacePeriodInventory,
      copyPreviousMonth,
      addEvent,
      updateEvent,
      removeEvent,
      setRain,
      updatePasture,
      addPasture,
      removePasture,
      setMonthStatus,
      importBackup,
      resetDemo,
      clearAll,
    }),
    [
      state,
      loading,
      saving,
      storageError,
      setSelectedPeriod,
      setInventoryCell,
      replacePeriodInventory,
      copyPreviousMonth,
      addEvent,
      updateEvent,
      removeEvent,
      setRain,
      updatePasture,
      addPasture,
      removePasture,
      setMonthStatus,
      importBackup,
      resetDemo,
      clearAll,
    ],
  )

  return <CampoContext.Provider value={value}>{children}</CampoContext.Provider>
}

export function useCampo() {
  const context = useContext(CampoContext)
  if (!context) throw new Error('useCampo debe utilizarse dentro de CampoProvider.')
  return context
}
