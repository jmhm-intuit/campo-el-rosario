const STORAGE_KEY = 'campo-el-rosario-v2'
const APP_VERSION = 503
const APP_VERSION_LABEL = '5.03'
const RELEASE_DATE = '2026-07-26'
const TARGET_LOAD = 0.8
const CONDITION_RECENT_DAYS = 60

const LOTS = [
  { id: 'ER-01', name: 'ER-01', hectares: 150, points: '51,45 219,45 219,278 51,278', label: [135,145], sprite: [135,190] },
  { id: 'ER-02', name: 'ER-02', hectares: 150, points: '219,45 400,45 400,278 219,278', label: [309,145], sprite: [310,190] },
  { id: 'ER-03', name: 'ER-03', hectares: 150, points: '400,45 563,45 563,278 400,278', label: [481,145], sprite: [482,190] },
  { id: 'ER-04', name: 'ER-04', hectares: 50, points: '563,45 643,45 643,191 563,173', label: [602,106], sprite: [603,151] },
  { id: 'ER-05', name: 'ER-05', hectares: 60, points: '643,45 748,45 748,214 643,191', label: [696,108], sprite: [696,153] },
  { id: 'ER-06', name: 'ER-06', hectares: 50, points: '563,173 643,191 643,337 563,318', label: [602,248], sprite: [603,293] },
  { id: 'ER-07', name: 'ER-07', hectares: 65, points: '643,191 748,214 748,359 643,337', label: [696,269], sprite: [696,314] },
  { id: 'ER-08-09', name: 'ER-08/09', hectares: 150, points: '219,278 400,278 400,538 219,538', label: [309,345], sprite: [310,408] },
  { id: 'ER-10', name: 'ER-10', hectares: 150, points: '400,278 563,278 563,538 400,538', label: [481,348], sprite: [482,408] },
  { id: 'ER-11', name: 'ER-11', hectares: 65, points: '563,318 660,340 660,538 563,538', label: [610,409], sprite: [612,454] },
  { id: 'ER-12', name: 'ER-12', hectares: 55, points: '660,340 748,359 748,538 660,538', label: [704,423], sprite: [704,468] },
  { id: 'ER-13', name: 'ER-13', hectares: 50, points: '563,538 641,538 641,795 563,795', label: [601,615], sprite: [602,666] },
  { id: 'ER-14', name: 'ER-14', hectares: 60, points: '641,538 748,538 748,795 641,795', label: [694,615], sprite: [694,666] },
  { id: 'ER-15-16', name: 'ER-15/16', hectares: 70, points: '563,795 641,795 641,1030 563,1030', label: [602,850], sprite: [602,912] },
  { id: 'ER-17', name: 'ER-17', hectares: 70, points: '641,795 734,795 734,1030 641,1030', label: [687,850], sprite: [688,912] },
  { id: 'ER-18', name: 'ER-18', hectares: 60, points: '734,840 857,840 857,1024 734,960', label: [792,884], sprite: [796,929] },
  { id: 'ER-19', name: 'ER-19', hectares: 150, points: '857,840 980,840 980,1218 857,1092', label: [918,898], sprite: [918,998] },
  { id: 'ER-20-21', name: 'ER-20/21', hectares: 180, points: '980,840 1089,840 1089,1301 980,1301', label: [1034,927], sprite: [1034,1070] },
]

const CATEGORIES = [
  { id: 'toros', name: 'Toros reproductores', short: 'Toros', factor: 1.25, kind: 'bull', asset: 'animals/map-bull-red-angus.png' },
  { id: 'vacas', name: 'Vacas de cría', short: 'Vacas', factor: 1, kind: 'cow', asset: 'animals/map-cow-red-angus.png' },
  { id: 'vaquillonas', name: 'Vaquillonas de reposición', short: 'Vaquillonas', factor: 1, kind: 'cow', asset: 'animals/map-cow-red-angus.png' },
  { id: 'terneros', name: 'Terneros', short: 'Terneros', factor: 0.5, kind: 'calf', asset: 'animals/map-calf-red-angus.png' },
  { id: 'terneras', name: 'Terneras', short: 'Terneras', factor: 0.5, kind: 'calf', asset: 'animals/map-calf-red-angus.png' },
  { id: 'machos-recria', name: 'Machos de recría y engorde', short: 'Recría/engorde', factor: 1, kind: 'cow', asset: 'animals/map-cow-red-angus.png' },
  { id: 'hembras-no-cria', name: 'Hembras no destinadas a cría', short: 'Hembras no cría', factor: 1, kind: 'cow', asset: 'animals/map-cow-red-angus.png' },
  { id: 'vacas-descarte', name: 'Vacas de descarte', short: 'Vacas descarte', factor: 1, kind: 'cow', asset: 'animals/map-cow-red-angus.png' },
  { id: 'otros', name: 'Otros animales', short: 'Otros', factor: 1, kind: 'cow', asset: 'animals/map-cow-red-angus.png' },
]

const SPRITE_VARIANTS = {
  cow: ['animals/map-cow-red-angus.png', 'animals/map-cow-red-angus-left.png'],
  bull: ['animals/map-bull-red-angus.png', 'animals/map-bull-red-angus-left.png'],
  calf: ['animals/map-calf-red-angus.png', 'animals/map-calf-red-angus-left.png'],
}

const FIELD_STATES = [
  { id: 'muy-bueno', label: 'Muy bueno', short: 'Muy b.', tone: 'excellent', pattern: 'v503/pasture-excellent.png', indicator: 'condition-indicator-excellent.png' },
  { id: 'bueno', label: 'Bueno', short: 'Bueno', tone: 'good', pattern: 'v503/pasture-good.png', indicator: 'condition-indicator-good.png' },
  { id: 'regular', label: 'Regular', short: 'Regular', tone: 'regular', pattern: 'v503/pasture-regular.png', indicator: 'condition-indicator-regular.png' },
  { id: 'malo', label: 'Malo', short: 'Malo', tone: 'poor', pattern: 'v503/pasture-poor.png', indicator: 'condition-indicator-poor.png' },
  { id: 'anegado', label: 'Anegado', short: 'Aneg.', tone: 'flooded', pattern: 'v503/pasture-waterlogged.png', indicator: 'condition-indicator-flooded.png' },
  { id: 'no-observado', label: 'Sin información', short: 'Sin info.', tone: 'unknown', pattern: null, indicator: 'condition-indicator-unobserved.png' },
]

const KPI_ASSETS = {
  animals: 'kpi/kpi-cow-red-angus.png',
  load: 'kpi/kpi-pasture.png',
  births: 'kpi/kpi-cow-calf-red-angus.png',
  deaths: 'kpi/kpi-health.png',
  trade: 'kpi/kpi-growth.png',
  rain: 'kpi/kpi-weather-rain.png',
}

const UI_ASSETS = {
  home: 'icons/icon-home-house.png',
  register: 'icons/icon-register-animals.png',
}

const INITIAL_GROUPS = {
  'ER-01': { fieldState: 'bueno', groups: [['vacas', 80], ['toros', 2], ['vacas-descarte', 96]] },
  'ER-02': { fieldState: 'regular', groups: [['vacas', 100], ['terneros', 55], ['terneras', 56], ['toros', 4], ['vacas-descarte', 2]] },
  'ER-03': { fieldState: 'bueno', groups: [['vacas', 92], ['toros', 3]] },
  'ER-06': { fieldState: 'regular', groups: [['vacas', 40]] },
  'ER-10': { fieldState: 'bueno', groups: [['hembras-no-cria', 63]] },
  'ER-11': { fieldState: 'regular', groups: [['vacas', 2], ['vaquillonas', 8], ['terneros', 2], ['toros', 1]] },
  'ER-12': { fieldState: 'regular', groups: [['terneros', 112], ['terneras', 136], ['machos-recria', 16], ['toros', 7]] },
  'ER-13': { fieldState: 'bueno', groups: [['vaquillonas', 63], ['hembras-no-cria', 18]] },
  'ER-14': { fieldState: 'bueno', groups: [['vacas', 35], ['terneros', 35], ['terneras', 12], ['vacas-descarte', 9]] },
  'ER-15-16': { fieldState: 'regular', groups: [['vacas-descarte', 117], ['machos-recria', 7]] },
  'ER-18': { fieldState: 'muy-bueno', groups: [['vaquillonas', 239], ['toros', 11]] },
  'ER-19': { fieldState: 'bueno', groups: [['vacas', 86], ['terneros', 35], ['terneras', 50], ['toros', 1]] },
  'ER-20-21': { fieldState: 'anegado', groups: [['terneros', 122], ['terneras', 122]] },
}

const lotLookup = Object.fromEntries(LOTS.map((lot) => [lot.id, lot]))
const categoryLookup = Object.fromEntries(CATEGORIES.map((category) => [category.id, category]))
const fieldStateLookup = Object.fromEntries(FIELD_STATES.map((item) => [item.id, item]))

function normalizeFieldState(value) {
  if (value === 'wet') return 'anegado'
  if (value === 'muy-malo') return 'malo'
  return fieldStateLookup[value] ? value : 'no-observado'
}

function fieldStateIcon(item, className = '') {
  const stateItem = item || fieldStateLookup['no-observado']
  return `<img class="field-state-icon ${className}" src="./assets/conditions/${stateItem.indicator}" alt="">`
}

function compactDateLabel(date) {
  if (!date) return 'Sin datos'
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
}



const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`)
const esc = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char])
const fmt = (value) => new Intl.NumberFormat('es-AR').format(Math.round(value || 0))
const decimal = (value, digits = 2) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number(value || 0))
const dateLabel = (date) => new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
const monthKey = (date) => String(date).slice(0, 7)
const monthLabel = (period) => new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(new Date(`${period}-01T12:00:00`))
const todayISO = () => new Date().toISOString().slice(0, 10)

function createInitialState() {
  const survey = {
    id: uid(),
    date: '2026-07-15',
    createdAt: '2026-07-15T18:00:00.000Z',
    rainPeriod: '2026-07',
    lots: Object.entries(INITIAL_GROUPS).map(([lotId, value]) => ({
      lotId,
      fieldState: value.fieldState,
      conditionSource: 'observed',
      groups: value.groups.map(([categoryId, quantity]) => ({ id: uid(), categoryId, quantity, birthYear: '', notes: '' })),
    })),
    events: { births: 0, deaths: 5, purchases: 0, sales: 0 },
    note: 'Relevamiento inicial basado en la información de referencia de El Rosario.',
  }
  return {
    version: APP_VERSION,
    selectedSurveyId: survey.id,
    surveys: [survey],
    rain: [
      { period: '2026-01', millimeters: 61 },
      { period: '2026-02', millimeters: 73 },
      { period: '2026-03', millimeters: 98 },
      { period: '2026-04', millimeters: 88 },
      { period: '2026-05', millimeters: 44 },
      { period: '2026-06', millimeters: 57 },
      { period: '2026-07', millimeters: 82 },
    ],
    rainEntries: [],
    draft: null,
    settings: { userName: 'Juan', establishment: 'El Rosario' },
    updatedAt: new Date().toISOString(),
    lastSavedAt: new Date().toISOString(),
  }
}

function migrateState(parsed) {
  if (!parsed || !Array.isArray(parsed.surveys)) return null
  const normalizeLot = (lot) => {
    const fieldState = normalizeFieldState(lot.fieldState)
    return {
      ...lot,
      fieldState,
      conditionSource: lot.conditionSource || (fieldState !== 'no-observado' ? 'observed' : 'unobserved'),
      groups: Array.isArray(lot.groups) ? lot.groups : [],
    }
  }
  const migrated = {
    ...parsed,
    version: APP_VERSION,
    surveys: parsed.surveys.map((survey) => ({
      ...survey,
      lots: Array.isArray(survey.lots) ? survey.lots.map(normalizeLot) : [],
      events: survey.events || { births: 0, deaths: 0, purchases: 0, sales: 0 },
    })),
    rain: Array.isArray(parsed.rain) ? parsed.rain : [],
    rainEntries: Array.isArray(parsed.rainEntries) ? parsed.rainEntries : [],
    draft: parsed.draft ? { mode: parsed.draft.mode || 'new', editingSurveyId: parsed.draft.editingSurveyId || null, ...parsed.draft } : null,
    settings: parsed.settings || { userName: 'Juan', establishment: 'El Rosario' },
    lastSavedAt: parsed.lastSavedAt || parsed.updatedAt || new Date().toISOString(),
  }
  if (migrated.draft?.lots) migrated.draft.lots = migrated.draft.lots.map(normalizeLot)
  if (!migrated.selectedSurveyId || !migrated.surveys.some((survey) => survey.id === migrated.selectedSurveyId)) {
    migrated.selectedSurveyId = [...migrated.surveys].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))[0]?.id || null
  }
  return migrated
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    const parsed = JSON.parse(raw)
    const migrated = migrateState(parsed)
    return migrated || createInitialState()
  } catch {
    return createInitialState()
  }
}

let state = loadState()
let ui = {
  view: location.hash.replace('#/', '') || 'resumen',
  selectedLotId: null,
  wizardStep: state.draft ? state.draft.step || 1 : 1,
  modal: null,
  toast: null,
}

function saveState() {
  state.version = APP_VERSION
  state.updatedAt = new Date().toISOString()
  state.lastSavedAt = state.updatedAt
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function selectedSurvey() {
  const selected = state.surveys.find((survey) => survey.id === state.selectedSurveyId)
  if (selected) return selected
  const latest = sortedSurveys()[0] || null
  if (latest) state.selectedSurveyId = latest.id
  return latest
}

function sortedSurveys() {
  return [...state.surveys].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
}

function latestSurvey() {
  return sortedSurveys()[0] || null
}

function surveyNavigation() {
  const list = sortedSurveys()
  const selected = selectedSurvey()
  const index = list.findIndex((survey) => survey.id === selected?.id)
  return {
    list,
    selected,
    index,
    newer: index > 0 ? list[index - 1] : null,
    older: index >= 0 && index < list.length - 1 ? list[index + 1] : null,
    latest: list[0] || null,
  }
}

function renderSurveyNavigator() {
  const nav = surveyNavigation()
  if (!nav.selected) return ''
  const isLatest = nav.selected.id === nav.latest?.id
  return `<section class="survey-navigator ${isLatest ? 'latest' : 'historical'}">
    <button class="survey-arrow" data-survey-older ${nav.older ? '' : 'disabled'} aria-label="Relevamiento anterior">${icon('back', 19)}</button>
    <button class="survey-current" data-open-survey-history>
      <small>Relevamiento seleccionado</small>
      <strong>${compactDateLabel(nav.selected.date)}</strong>
      <span>${isLatest ? 'Último disponible' : 'Registro histórico · tocar para cambiar'}</span>
    </button>
    <button class="survey-arrow newer" data-survey-newer ${nav.newer ? '' : 'disabled'} aria-label="Relevamiento siguiente">${icon('chevron', 19)}</button>
    <button class="survey-history-button" data-open-survey-history>${icon('history', 18)} Historial</button>
    ${!isLatest ? `<button class="survey-latest-button" data-view-latest>Volver al último</button>` : ''}
  </section>`
}

function dateDistanceDays(olderDate, newerDate) {
  const older = new Date(`${olderDate}T12:00:00`).getTime()
  const newer = new Date(`${newerDate}T12:00:00`).getTime()
  return Math.max(0, Math.round((newer - older) / 86400000))
}

function observedStateFromLotEntry(entry) {
  const stateId = normalizeFieldState(entry?.fieldState)
  return stateId !== 'no-observado' ? stateId : null
}

function modeState(states) {
  if (!states.length) return null
  const counts = new Map()
  for (const stateId of states) counts.set(stateId, (counts.get(stateId) || 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || null
}

function priorSurveysFor(survey) {
  return state.surveys
    .filter((item) => item.id !== survey?.id && String(item.date || '') <= String(survey?.date || '9999-99-99'))
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
}

function resolveLotCondition(survey, lotId) {
  if (!survey) return { stateId: 'no-observado', source: 'none', label: 'Sin información', explanation: 'No hay un relevamiento seleccionado.' }
  const currentEntry = (survey.lots || []).find((entry) => entry.lotId === lotId)
  const observed = observedStateFromLotEntry(currentEntry)
  if (observed) return { stateId: observed, source: 'observed', label: fieldStateLookup[observed].label, explanation: `Observada en el relevamiento del ${compactDateLabel(survey.date)}.` }

  const prior = priorSurveysFor(survey)
  const recent = prior.find((item) => {
    const entry = (item.lots || []).find((lot) => lot.lotId === lotId)
    return observedStateFromLotEntry(entry) && dateDistanceDays(item.date, survey.date) <= CONDITION_RECENT_DAYS
  })
  if (recent) {
    const stateId = observedStateFromLotEntry((recent.lots || []).find((lot) => lot.lotId === lotId))
    return { stateId, source: 'recent', label: fieldStateLookup[stateId].label, explanation: `Estimada usando la última observación de ${lotLookup[lotId].name}, del ${compactDateLabel(recent.date)}.` }
  }

  const month = String(survey.date || '').slice(5, 7)
  const seasonalStates = prior
    .filter((item) => String(item.date || '').slice(5, 7) === month)
    .map((item) => observedStateFromLotEntry((item.lots || []).find((lot) => lot.lotId === lotId)))
    .filter(Boolean)
  const seasonal = modeState(seasonalStates)
  if (seasonal) return { stateId: seasonal, source: 'seasonal', label: fieldStateLookup[seasonal].label, explanation: `Estimada con el historial de ${lotLookup[lotId].name} para ${monthLabel(monthKey(survey.date))}.` }

  const currentGeneral = modeState((survey.lots || []).map(observedStateFromLotEntry).filter(Boolean))
  if (currentGeneral) return { stateId: currentGeneral, source: 'general', label: fieldStateLookup[currentGeneral].label, explanation: 'Estimada usando la condición más frecuente entre los lotes observados en este relevamiento.' }

  const priorGeneralSurvey = prior.find((item) => (item.lots || []).some((entry) => observedStateFromLotEntry(entry)))
  const priorGeneral = priorGeneralSurvey ? modeState((priorGeneralSurvey.lots || []).map(observedStateFromLotEntry).filter(Boolean)) : null
  if (priorGeneral) return { stateId: priorGeneral, source: 'general', label: fieldStateLookup[priorGeneral].label, explanation: `Estimada usando la condición general del campo del ${compactDateLabel(priorGeneralSurvey.date)}.` }

  return { stateId: 'no-observado', source: 'none', label: 'Sin información', explanation: 'No existe una observación reciente ni suficiente historial para estimar la condición.' }
}

function conditionSourceLabel(source) {
  return ({ observed: 'Observada', recent: 'Estimada · dato reciente', seasonal: 'Estimada · historial del mes', general: 'Estimada · condición general', none: 'Sin información' })[source] || 'Sin información'
}

function conditionIsAssumed(source) {
  return ['recent', 'seasonal', 'general'].includes(source)
}

function rainEntriesForPeriod(period) {
  return (state.rainEntries || []).filter((entry) => monthKey(entry.date) === period).sort((a, b) => String(b.date).localeCompare(String(a.date)))
}

function monthlyRainSummary(period) {
  const entries = rainEntriesForPeriod(period)
  if (entries.length) return { period, millimeters: entries.reduce((sum, entry) => sum + Number(entry.millimeters || 0), 0), source: 'daily', entries }
  const legacy = (state.rain || []).find((item) => item.period === period)
  if (legacy && legacy.millimeters !== '' && legacy.millimeters != null) return { period, millimeters: Number(legacy.millimeters), source: 'monthly', entries: [] }
  return { period, millimeters: null, source: 'none', entries: [] }
}

function allRainPeriods() {
  return [...new Set([...(state.rain || []).map((item) => item.period), ...(state.rainEntries || []).map((entry) => monthKey(entry.date))])].sort()
}

function renderSurveySwitcher() {
  return ''
}

function previousSurvey(survey) {
  const list = state.surveys.filter((item) => item.id !== survey?.id).sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')) || String(a.createdAt || '').localeCompare(String(b.createdAt || '')))
  if (!survey?.date) return list.at(-1) || null
  const currentCreated = String(survey.createdAt || '9999')
  return [...list].reverse().find((item) => String(item.date || '') < survey.date || (item.date === survey.date && String(item.createdAt || '') < currentCreated)) || null
}

function surveyMetrics(survey) {
  const byLot = Object.fromEntries(LOTS.map((lot) => [lot.id, { animals: 0, equivalents: 0, groups: [] }]))
  let animals = 0
  let equivalents = 0
  const categories = Object.fromEntries(CATEGORIES.map((category) => [category.id, 0]))
  for (const lotEntry of survey?.lots || []) {
    for (const group of lotEntry.groups || []) {
      const quantity = Math.max(0, Number(group.quantity) || 0)
      const factor = categoryLookup[group.categoryId]?.factor || 1
      animals += quantity
      equivalents += quantity * factor
      categories[group.categoryId] = (categories[group.categoryId] || 0) + quantity
      byLot[lotEntry.lotId].animals += quantity
      byLot[lotEntry.lotId].equivalents += quantity * factor
      byLot[lotEntry.lotId].groups.push(group)
    }
  }
  for (const lot of LOTS) {
    byLot[lot.id].load = byLot[lot.id].equivalents / lot.hectares
    byLot[lot.id].capacityUse = byLot[lot.id].load / TARGET_LOAD
  }
  return { animals, equivalents, load: equivalents / 1735, categories, byLot }
}

function discrepancyAlerts(survey) {
  const prev = previousSurvey(survey)
  if (!survey || !prev) return []
  const current = surveyMetrics(survey)
  const prior = surveyMetrics(prev)
  const alerts = []
  const totalDiff = current.animals - prior.animals
  if (totalDiff !== 0) {
    alerts.push({
      severity: 'warning',
      title: 'Diferencia en el total de animales',
      text: `${totalDiff > 0 ? '+' : ''}${fmt(totalDiff)} ${Math.abs(totalDiff) === 1 ? 'animal' : 'animales'} respecto del relevamiento anterior.`,
    })
  }
  for (const lot of LOTS) {
    const now = current.byLot[lot.id].animals
    const before = prior.byLot[lot.id].animals
    const diff = now - before
    if (diff === 0) continue
    alerts.push({
      severity: before > 0 && now === 0 ? 'warning' : 'info',
      lotId: lot.id,
      title: `Diferencia en ${lot.name}`,
      text: `${before} → ${now} animales (${diff > 0 ? '+' : ''}${fmt(diff)}).`,
    })
  }
  return alerts
}

function operationalAlerts(survey) {
  if (!survey) return []
  const metrics = surveyMetrics(survey)
  const alerts = []
  for (const lot of LOTS) {
    const metric = metrics.byLot[lot.id]
    if (metric.load > TARGET_LOAD * 1.5) alerts.push({ severity: 'danger', lotId: lot.id, title: `Carga crítica en ${lot.name}`, text: `${decimal(metric.load)} EV/ha, muy por encima del objetivo de ${decimal(TARGET_LOAD)}.` })
    else if (metric.load > TARGET_LOAD * 1.15) alerts.push({ severity: 'warning', lotId: lot.id, title: `Carga alta en ${lot.name}`, text: `${decimal(metric.load)} EV/ha.` })
  }
  return alerts
}

function rainAnalysis(period) {
  const summary = monthlyRainSummary(period)
  const current = summary.millimeters
  const month = period?.slice(5, 7)
  const history = allRainPeriods()
    .filter((candidate) => candidate < period && candidate.slice(5, 7) === month)
    .map(monthlyRainSummary)
    .filter((item) => item.millimeters != null)
  if (current == null) return { current: null, status: 'Sin dato', delta: null, detail: 'No se registró lluvia para este mes.', source: summary.source, entries: summary.entries }
  if (!history.length) return { current, status: 'Sin base', delta: null, detail: summary.source === 'daily' ? `${summary.entries.length} registros diarios.` : 'Dato mensual heredado; todavía no hay años anteriores para comparar.', source: summary.source, entries: summary.entries }
  const average = history.reduce((sum, item) => sum + item.millimeters, 0) / history.length
  const delta = current - average
  const ratio = average ? delta / average : 0
  const status = ratio < -0.2 ? 'Déficit' : ratio > 0.2 ? 'Exceso' : 'Normal'
  const sourceText = summary.source === 'daily' ? `${summary.entries.length} registros diarios` : 'total mensual'
  return { current, status, delta, average, detail: `${sourceText} · ${delta >= 0 ? '+' : ''}${fmt(delta)} mm vs. histórico del mes.`, source: summary.source, entries: summary.entries }
}

function capacityClass(load) {
  if (!load) return 'empty'
  if (load <= TARGET_LOAD * 0.75) return 'low'
  if (load <= TARGET_LOAD) return 'ok'
  if (load <= TARGET_LOAD * 1.25) return 'high'
  if (load <= TARGET_LOAD * 1.5) return 'over'
  return 'critical'
}

function capacityLabel(load) {
  const status = capacityClass(load)
  return ({ empty: 'Sin carga', low: 'Baja', ok: 'Adecuada', high: 'Alta', over: 'Sobrecarga', critical: 'Crítica' })[status]
}

function icon(name, size = 20) {
  const paths = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2"/><path d="M9 10h6M9 14h6M9 18h4"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    cow: '<path d="M5 9h10l3 3v5H5z"/><path d="M7 17v4M15 17v4M18 12l3-2M4 10 1-3M8 9 6 6M14 9l2-3"/>',
    rain: '<path d="M7 17a4 4 0 0 1-.5-8A6 6 0 0 1 18 10a3.5 3.5 0 0 1-.5 7"/><path d="m8 20-1 2M12 20l-1 2M16 20l-1 2"/>',
    alert: '<path d="M12 3 2 21h20Z"/><path d="M12 9v5M12 18h.01"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  }
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || ''}</svg>`
}

function navigate(view) {
  ui.view = view
  location.hash = `/${view}`
  window.scrollTo({ top: 0, behavior: 'smooth' })
  render()
}

function showToast(message) {
  ui.toast = message
  render()
  setTimeout(() => { ui.toast = null; render() }, 2400)
}

function navItem(view, label, iconName) {
  const active = ui.view === view ? 'active' : ''
  return `<button class="nav-item ${active}" data-nav="${view}">${icon(iconName)}<span>${label}</span></button>`
}

function navItemAsset(view, label, assetPath) {
  const active = ui.view === view ? 'active' : ''
  return `<button class="nav-item ${active}" data-nav="${view}"><img class="nav-asset" src="./assets/${assetPath}" alt=""><span>${label}</span></button>`
}

function renderShell(content, title, subtitle, action = '') {
  const survey = selectedSurvey()
  const latest = latestSurvey()
  const dataDate = latest ? compactDateLabel(latest.date) : 'Sin datos'
  return `
    <div class="app-shell ${ui.view === 'relevamiento' ? 'survey-mode' : ''}">
      <aside class="sidebar">
        <div class="brand"><img src="./assets/${UI_ASSETS.home}" alt="Casa principal de El Rosario"><div><strong>CAMPO</strong><span>El Rosario</span></div></div>
        <nav>
          ${navItemAsset('resumen', 'Resumen', UI_ASSETS.home)}
          ${navItemAsset('relevamiento', 'Registrar', UI_ASSETS.register)}
          ${navItem('mapa', 'Mapa', 'map')}
          ${navItem('historico', 'Histórico y lluvia', 'history')}
          ${navItem('datos', 'Exportar y respaldo', 'download')}
        </nav>
        <div class="sidebar-card">
          <small>Datos más recientes</small>
          <strong>${latest ? dateLabel(latest.date) : 'Sin datos'}</strong>
          <span>Los datos se guardan en este dispositivo.</span>
        </div>
        <div class="sidebar-footer"><span>Campo v${APP_VERSION_LABEL}</span><span>Datos: ${dataDate}</span></div>
      </aside>
      <div class="content-shell">
        <header class="topbar">
          <button class="mobile-menu" data-toggle-nav aria-label="Menú">${icon('menu', 24)}</button>
          <div><h1>${title}</h1><p>${subtitle}</p></div>
          <div class="topbar-actions"><span class="release-status"><b>Campo v${APP_VERSION_LABEL}</b><small>Datos más recientes ${dataDate}</small></span>${action}</div>
        </header>
        <main class="page">${content}</main>
      </div>
      <nav class="mobile-nav">
        ${navItemAsset('resumen', 'Resumen', UI_ASSETS.home)}
        ${navItemAsset('relevamiento', 'Registrar', UI_ASSETS.register)}
        ${navItem('mapa', 'Mapa', 'map')}
        ${navItem('historico', 'Histórico', 'history')}
      </nav>
      ${ui.modal ? renderModal() : ''}
      ${ui.toast ? `<div class="toast">${icon('check', 18)} ${esc(ui.toast)}</div>` : ''}
    </div>`
}

function renderDashboard() {
  const survey = selectedSurvey()
  if (!survey) return renderShell('<div class="empty-state"><h2>No hay relevamientos</h2><button class="btn primary" data-start-survey>Crear el primero</button></div>', 'Resumen del campo', 'El Rosario')
  const metrics = surveyMetrics(survey)
  const prev = previousSurvey(survey)
  const prevMetrics = prev ? surveyMetrics(prev) : null
  const rainPeriod = survey.rainPeriod || monthKey(survey.date)
  const rain = rainAnalysis(rainPeriod)
  const alerts = operationalAlerts(survey).slice(0, 5)
  const events = survey.events || { births: 0, deaths: 0, purchases: 0, sales: 0 }
  const deltaAnimals = prevMetrics ? metrics.animals - prevMetrics.animals : null
  const resolved = LOTS.map((lot) => resolveLotCondition(survey, lot.id))
  const assumedCount = resolved.filter((item) => conditionIsAssumed(item.source)).length
  const noInfoCount = resolved.filter((item) => item.source === 'none').length
  const cards = `
    <section class="kpi-grid v2">
      ${kpiCard('Ganado total', fmt(metrics.animals), deltaAnimals == null ? 'Primer relevamiento' : `${deltaAnimals >= 0 ? '+' : ''}${fmt(deltaAnimals)} vs. anterior`, KPI_ASSETS.animals, 'brown')}
      ${kpiCard('Carga del campo', `${decimal(metrics.load)} EV/ha`, `Objetivo ${decimal(TARGET_LOAD)} EV/ha`, KPI_ASSETS.load, capacityClass(metrics.load))}
      ${kpiCard('Nacimientos', fmt(events.births), 'Desde el relevamiento anterior', KPI_ASSETS.births, 'gold')}
      ${kpiCard('Mortandad', fmt(events.deaths), 'Registro opcional del período', KPI_ASSETS.deaths, events.deaths ? 'red' : 'neutral')}
      ${kpiCard('Compras y ventas', `${fmt(events.purchases)} / ${fmt(events.sales)}`, 'Compras / ventas', KPI_ASSETS.trade, 'blue')}
      ${kpiCard('Lluvia', rain.current == null ? 'Sin dato' : `${fmt(rain.current)} mm`, `${rain.status} · ${rain.detail}`, KPI_ASSETS.rain, rain.status.toLowerCase().replace('é','e'), `data-open-rain="${rainPeriod}" role="button" tabindex="0"`)}
    </section>`

  const content = `
    ${renderSurveyNavigator()}
    <section class="welcome-strip">
      <div><span class="eyebrow">Relevamiento seleccionado</span><h2>${dateLabel(survey.date)}</h2><p>${survey.lots.length} lotes observados · ${assumedCount} condiciones estimadas · ${noInfoCount} sin información</p></div>
      <div class="welcome-actions"><button class="btn secondary large" data-edit-selected-survey>${icon('edit', 18)} Editar relevamiento</button><button class="btn primary large" data-start-survey>${icon('plus', 19)} Nuevo relevamiento</button></div>
    </section>
    ${cards}
    <section class="dashboard-grid">
      <article class="panel map-panel">
        <div class="panel-head"><div><span class="eyebrow">Mapa vivo</span><h3>El Rosario</h3></div><button class="btn ghost" data-nav="mapa">Abrir mapa</button></div>
        ${renderMap(survey, true)}
      </article>
      <aside class="dashboard-side">
        <article class="panel alerts-panel">
          <div class="panel-head"><h3>Alertas de carga</h3><span class="count-pill">${alerts.length}</span></div>
          ${alerts.length ? `<div class="alert-list">${alerts.map(renderAlert).join('')}</div>` : '<div class="empty-inline">Sin alertas de carga.</div>'}
        </article>
        <article class="panel">
          <div class="panel-head"><h3>Composición del rodeo</h3></div>
          ${renderCategoryBars(metrics.categories, metrics.animals)}
        </article>
        <article class="panel rain-card interactive" data-open-rain="${rainPeriod}">
          <div class="panel-head"><h3>Registro de lluvia</h3><button class="text-link" data-open-rain="${rainPeriod}">Carga diaria</button></div>
          <div class="rain-hero"><strong>${rain.current == null ? '—' : fmt(rain.current)}</strong><span>mm · ${monthLabel(rainPeriod)}</span><b class="rain-state ${esc(rain.status.toLowerCase().replace('é','e'))}">${esc(rain.status)}</b></div>
          <p>${esc(rain.detail)}</p>
        </article>
      </aside>
    </section>
    <section class="bottom-grid">
      <article class="panel adoption-card">
        <div class="adoption-visual single"><img src="./assets/${UI_ASSETS.register}" alt="Registrar animales"></div>
        <div><span class="eyebrow">Carga simple, datos útiles</span><h3>Registrá cada lote observado</h3><p>Podés cargar animales y condición, o registrar un lote vacío solamente para informar su estado.</p><button class="btn primary" data-start-survey>Comenzar relevamiento</button></div>
      </article>
      <article class="panel recent-panel"><div class="panel-head"><h3>Últimos relevamientos</h3><button class="text-link" data-open-survey-history>Ver todos</button></div>${renderRecentSurveys()}</article>
    </section>`
  return renderShell(content, 'Resumen del campo', 'Animales, carga y condición del relevamiento seleccionado')
}

function kpiCard(label, value, note, assetPath, tone, attrs = '') {
  return `<article class="kpi-card tone-${tone} ${attrs ? 'interactive' : ''}" ${attrs}><span class="kpi-icon"><img src="./assets/${assetPath}" alt=""></span><div><small>${label}</small><strong>${value}</strong><p>${note}</p></div></article>`
}

function renderAlert(alert) {
  return `<button class="alert-item ${alert.severity}" ${alert.lotId ? `data-lot="${alert.lotId}"` : ''}><span>${icon('alert', 18)}</span><div><strong>${esc(alert.title)}</strong><p>${esc(alert.text)}</p></div>${alert.lotId ? icon('chevron', 17) : ''}</button>`
}

function renderCategoryBars(categories, total) {
  const rows = CATEGORIES.map((category) => ({ ...category, quantity: categories[category.id] || 0 })).filter((item) => item.quantity > 0).sort((a, b) => b.quantity - a.quantity).slice(0, 6)
  return `<div class="category-bars">${rows.map((item) => `<div class="category-row"><div><span>${esc(item.short)}</span><strong>${fmt(item.quantity)}</strong></div><div class="bar"><i style="width:${Math.max(3, item.quantity / Math.max(1, total) * 100)}%"></i></div></div>`).join('')}</div>`
}

function renderRecentSurveys() {
  return `<div class="recent-list">${sortedSurveys().slice(0, 4).map((survey) => { const m = surveyMetrics(survey); return `<button class="recent-item" data-select-survey="${survey.id}"><span class="date-box"><b>${survey.date.slice(8,10)}</b><small>${new Intl.DateTimeFormat('es-AR',{month:'short'}).format(new Date(`${survey.date}T12:00:00`))}</small></span><div><strong>${fmt(m.animals)} animales</strong><p>${survey.lots.length} lotes · ${decimal(m.load)} EV/ha</p></div>${icon('chevron',18)}</button>` }).join('')}</div>`
}

function parseLotPoints(lot) {
  return lot.points.trim().split(/\s+/).map((pair) => pair.split(',').map(Number))
}

function polygonArea(points) {
  return Math.abs(points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length]
    return sum + point[0] * next[1] - next[0] * point[1]
  }, 0) / 2)
}

function pointInPolygon(point, polygon) {
  const [x, y] = point
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]
    const intersects = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 0.00001) + xi)
    if (intersects) inside = !inside
  }
  return inside
}

function seededNumber(seed) {
  let hash = 2166136261
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 100000) / 100000
}

function spriteCountForLot(lot, metric, compact) {
  const heads = Number(metric.animals) || 0
  if (!heads) return 0
  return Math.min(8, Math.max(1, Math.ceil(heads / 30)))
}

function dominantAnimalKind(lotEntry) {
  const totals = { cow: 0, bull: 0, calf: 0 }
  for (const group of lotEntry.groups || []) {
    const kind = categoryLookup[group.categoryId]?.kind || 'cow'
    totals[kind] += Number(group.quantity) || 0
  }
  let best = 'cow'
  for (const kind of ['bull', 'calf']) if (totals[kind] > totals[best]) best = kind
  return best
}

function isHouseZone(lotId, x, y) {
  if (lotId === 'ER-08-09') return x > 270 && x < 390 && y > 345 && y < 460
  if (lotId === 'ER-13') return x > 570 && x < 646 && y > 700 && y < 800
  return false
}

function spritePositions(lot, count, spriteWidth) {
  const polygon = parseLotPoints(lot)
  const xs = polygon.map((point) => point[0])
  const ys = polygon.map((point) => point[1])
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const width = maxX - minX, height = maxY - minY
  const marginX = Math.max(spriteWidth * .62, Math.min(22, width * .13))
  const marginY = Math.max(spriteWidth * .38, Math.min(22, height * .11))
  const positions = []
  const fitsInside = (x, y) => {
    const halfW = spriteWidth * .48, halfH = spriteWidth * .28
    return [[x,y],[x-halfW,y-halfH],[x+halfW,y-halfH],[x-halfW,y+halfH],[x+halfW,y+halfH]].every((point) => pointInPolygon(point, polygon))
  }
  for (let attempt = 0; attempt < 900 && positions.length < count; attempt++) {
    const x = minX + marginX + seededNumber(`${lot.id}-v501-x-${attempt}`) * Math.max(1, width - marginX * 2)
    const y = minY + marginY + seededNumber(`${lot.id}-v501-y-${attempt}`) * Math.max(1, height - marginY * 2)
    const labelDistance = Math.hypot(x - lot.label[0], y - lot.label[1])
    const minDistance = Math.max(spriteWidth * .82, Math.min(38, width / Math.max(2.2, Math.sqrt(count))))
    if (!fitsInside(x, y) || labelDistance < 59 || isHouseZone(lot.id, x, y)) continue
    if (positions.some((point) => Math.hypot(x - point.x, y - point.y) < minDistance)) continue
    positions.push({ x, y })
  }
  if (!positions.length && fitsInside(lot.sprite[0], lot.sprite[1])) positions.push({ x: lot.sprite[0], y: lot.sprite[1] })
  return positions
}

function renderHerdSprites(lotEntry, lot, compact, metric) {
  const count = spriteCountForLot(lot, metric, compact)
  const polygon = parseLotPoints(lot)
  const width = Math.max(...polygon.map((point) => point[0])) - Math.min(...polygon.map((point) => point[0]))
  const spriteWidth = Math.max(compact ? 13 : 15, Math.min(compact ? 20 : 23, width / (compact ? 6.6 : 5.9)))
  const positions = spritePositions(lot, count, spriteWidth)
  const kind = dominantAnimalKind(lotEntry)
  const variants = SPRITE_VARIANTS[kind] || SPRITE_VARIANTS.cow
  const scale = kind === 'calf' ? .76 : kind === 'bull' ? 1.04 : 1
  const drawWidth = spriteWidth * scale
  const drawHeight = drawWidth * .60
  return positions.map((position, index) => {
    const asset = variants[Math.floor(seededNumber(`${lot.id}-${index}-asset-v503`) * variants.length) % variants.length]
    const angle = (seededNumber(`${lot.id}-${index}-angle-v503`) - .5) * 8
    const shadowRx = (drawWidth * .39).toFixed(1)
    const shadowRy = Math.max(1.2, drawHeight * .16).toFixed(1)
    const shadowCy = (position.y + drawHeight * .31).toFixed(1)
    return `<g class="animal-marker ${kind}">
      <ellipse class="animal-ground-shadow" cx="${position.x.toFixed(1)}" cy="${shadowCy}" rx="${shadowRx}" ry="${shadowRy}" />
      <image class="animal-sprite ${kind}" href="./assets/${asset}" x="${(position.x - drawWidth/2).toFixed(1)}" y="${(position.y - drawHeight/2).toFixed(1)}" width="${drawWidth.toFixed(1)}" height="${drawHeight.toFixed(1)}" preserveAspectRatio="xMidYMid meet" transform="rotate(${angle.toFixed(1)} ${position.x.toFixed(1)} ${position.y.toFixed(1)})" />
    </g>`
  }).join('')
}

function renderMap(survey, compact = false) {
  const metrics = surveyMetrics(survey)
  const selected = ui.selectedLotId
  const lotEntries = Object.fromEntries((survey.lots || []).map((entry) => [entry.lotId, entry]))
  const conditions = Object.fromEntries(LOTS.map((lot) => [lot.id, resolveLotCondition(survey, lot.id)]))
  const patternSize = 480
  const patternVariants = [0, 90, 180, 270]
  const patternDefs = FIELD_STATES.filter((item) => item.pattern).flatMap((item) => patternVariants.map((angle, variant) => `
    <pattern id="condition-${item.id}-${variant}" patternUnits="userSpaceOnUse" width="${patternSize}" height="${patternSize}">
      <image href="./assets/conditions/${item.pattern}" x="0" y="0" width="${patternSize}" height="${patternSize}" preserveAspectRatio="xMidYMid slice" transform="rotate(${angle} ${patternSize / 2} ${patternSize / 2})" />
    </pattern>`)).join('') + `
    <pattern id="condition-assumed-hatch" patternUnits="userSpaceOnUse" width="18" height="18" patternTransform="rotate(32)">
      <rect width="18" height="18" fill="transparent" />
      <rect width="1.4" height="18" fill="rgba(255,255,255,.24)" />
    </pattern>
    <pattern id="condition-no-info" patternUnits="userSpaceOnUse" width="22" height="22" patternTransform="rotate(35)">
      <rect width="22" height="22" fill="rgba(232,232,222,.06)" />
      <rect width="1.5" height="22" fill="rgba(255,255,255,.18)" />
    </pattern>`

  const conditionLayer = LOTS.map((lot) => {
    const condition = conditions[lot.id]
    if (condition.source === 'none') return `<polygon class="lot-condition source-none state-no-observado" points="${lot.points}" fill="url(#condition-no-info)" />`
    const assumed = conditionIsAssumed(condition.source)
    const variant = Math.floor(seededNumber(`${lot.id}-${condition.stateId}-texture-v503`) * patternVariants.length) % patternVariants.length
    return `<polygon class="lot-condition source-${condition.source} state-${condition.stateId}" points="${lot.points}" fill="url(#condition-${condition.stateId}-${variant})" />${assumed ? `<polygon class="condition-assumption-hatch" points="${lot.points}" fill="url(#condition-assumed-hatch)" />` : ''}`
  }).join('')

  const loadHalos = LOTS.map((lot) => {
    const metric = metrics.byLot[lot.id]
    return `<polygon class="lot-load-halo ${capacityClass(metric.load)}" points="${lot.points}" vector-effect="non-scaling-stroke" />`
  }).join('')
  const loadBorders = LOTS.map((lot) => {
    const metric = metrics.byLot[lot.id]
    return `<polygon class="lot-load-border ${capacityClass(metric.load)}" points="${lot.points}" vector-effect="non-scaling-stroke" />`
  }).join('')
  const animals = survey.lots.filter((lotEntry) => metrics.byLot[lotEntry.lotId]?.animals > 0).map((lotEntry) => renderHerdSprites(lotEntry, lotLookup[lotEntry.lotId], compact, metrics.byLot[lotEntry.lotId])).join('')
  const houses = `
    <image class="map-house main-house" href="./assets/buildings/building-house-main-er08-09.png" x="285" y="355" width="104" height="96" preserveAspectRatio="xMidYMid meet" />
    <image class="map-house secondary-house" href="./assets/buildings/building-house-secondary-er13.png" x="578" y="716" width="64" height="64" preserveAspectRatio="xMidYMid meet" />`
  const hitAreas = LOTS.map((lot) => `<polygon class="lot-hit ${selected === lot.id ? 'selected' : ''}" data-map-lot="${lot.id}" points="${lot.points}" />`).join('')

  const labels = LOTS.map((lot) => {
    const metric = metrics.byLot[lot.id]
    const status = capacityClass(metric.load)
    const entry = lotEntries[lot.id]
    const condition = conditions[lot.id]
    const points = parseLotPoints(lot)
    const width = Math.max(...points.map((point) => point[0])) - Math.min(...points.map((point) => point[0]))
    const narrow = width <= 108
    const longName = lot.name.length > 7
    const observed = Boolean(entry)
    const countText = observed ? fmt(metric.animals) : '—'
    const sourceMark = conditionIsAssumed(condition.source) ? '≈ ' : ''
    const conditionText = `${sourceMark}${fieldStateLookup[condition.stateId]?.short || 'Sin info.'}`
    const conditionClass = `condition-${condition.stateId} source-${condition.source}`
    if (narrow) {
      const code = lot.name.replace('ER-', '')
      const cardWidth = longName ? 64 : 54
      return `<g class="map-label narrow ${conditionClass}" transform="translate(${lot.label[0]} ${lot.label[1]})" data-map-lot="${lot.id}">
        <rect class="label-card" x="-${cardWidth/2}" y="-35" width="${cardWidth}" height="70" rx="9"/>
        <text class="lot-prefix" text-anchor="middle" y="-20">ER</text>
        <text class="lot-code" text-anchor="middle" y="-5">${esc(code)}</text>
        <text class="lot-heads" text-anchor="middle" y="16">${countText}</text>
        <circle class="load-dot ${status}" cx="-${cardWidth/2-8}" cy="27" r="3"/>
        <text class="lot-condition-text" text-anchor="middle" y="30">${esc(conditionText)}</text>
        <rect class="condition-strip state-${condition.stateId}" x="-${cardWidth/2-5}" y="32" width="${cardWidth-10}" height="3" rx="1.5"/>
      </g>`
    }
    const cardWidth = longName ? 108 : 92
    return `<g class="map-label standard ${conditionClass}" transform="translate(${lot.label[0]} ${lot.label[1]})" data-map-lot="${lot.id}">
      <rect class="label-card" x="-${cardWidth/2}" y="-28" width="${cardWidth}" height="56" rx="10"/>
      <text class="lot-name" text-anchor="middle" y="-10">${lot.name}</text>
      <text class="lot-heads" text-anchor="middle" y="10">${countText}</text>
      <circle class="load-dot ${status}" cx="-${cardWidth/2-10}" cy="21" r="3.2"/>
      <text class="lot-condition-text" text-anchor="middle" y="24">${esc(conditionText)}</text>
      <rect class="condition-strip state-${condition.stateId}" x="-${cardWidth/2-6}" y="25" width="${cardWidth-12}" height="3" rx="1.5"/>
    </g>`
  }).join('')

  return `<div class="ranch-map ${compact ? 'compact' : ''}">
    <svg class="map-canvas" viewBox="0 0 1154 1363" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mapa interactivo de El Rosario">
      <defs>${patternDefs}</defs>
      <image class="aerial-base" href="./assets/map/el-rosario-map.png" x="0" y="0" width="1154" height="1363" preserveAspectRatio="none" />
      <g class="condition-layer">${conditionLayer}</g>
      <g class="load-halo-layer">${loadHalos}</g>
      <g class="load-border-layer">${loadBorders}</g>
      <g class="animal-layer">${animals}</g>
      <g class="house-layer">${houses}</g>
      <g class="interaction-layer">${hitAreas}${labels}</g>
    </svg>
    <div class="map-load-badge"><span>Carga total</span><strong>${decimal(metrics.load)} EV/ha</strong></div>
  </div>`
}

function renderMapPage() {
  const survey = selectedSurvey()
  const metrics = surveyMetrics(survey)
  const lot = ui.selectedLotId ? lotLookup[ui.selectedLotId] : null
  const lotEntry = lot ? survey.lots.find((entry) => entry.lotId === lot.id) : null
  const metric = lot ? metrics.byLot[lot.id] : null
  const loadClass = metric ? capacityClass(metric.load) : 'empty'
  const condition = lot ? resolveLotCondition(survey, lot.id) : null
  const sourceLabel = condition ? conditionSourceLabel(condition.source) : ''
  const side = lot ? `<aside class="lot-inspector">
    <button class="inspector-close" data-close-lot>${icon('close',20)}</button>
    <span class="eyebrow">Lote seleccionado</span><h2>${lot.name}</h2><p>${lot.hectares} hectáreas · ${lotEntry ? 'Observado' : 'No observado en esta fecha'}</p>
    <div class="lot-stat-grid"><div><small>Animales</small><strong>${lotEntry ? fmt(metric.animals) : '—'}</strong></div><div><small>Carga</small><strong>${lotEntry ? `${decimal(metric.load)} EV/ha` : 'Sin dato'}</strong></div></div>
    <div class="load-status-card ${loadClass}"><span class="load-status-dot"></span><div><small>Estado de carga</small><strong>${lotEntry ? capacityLabel(metric.load) : 'Sin carga registrada'}</strong><p>${lotEntry ? `${Math.round(metric.capacityUse * 100)}% del objetivo de ${decimal(TARGET_LOAD)} EV/ha` : 'Registrá el lote para calcular su carga.'}</p></div></div>
    <div class="load-meter"><i class="${loadClass}" style="width:${lotEntry ? Math.min(100, metric.capacityUse * 100) : 0}%"></i></div>
    <h3>Composición</h3>
    <div class="group-list">${lotEntry?.groups?.length ? lotEntry.groups.map((group) => `<div><img src="./assets/${categoryLookup[group.categoryId]?.asset || 'animals/map-cow-red-angus.png'}"><span>${esc(categoryLookup[group.categoryId]?.short || group.categoryId)}${group.birthYear ? `<small>Nac. ${group.birthYear}</small>` : ''}</span><strong>${fmt(group.quantity)}</strong></div>`).join('') : `<p class="empty-inline">${lotEntry ? 'Lote registrado sin animales.' : 'No se registró este lote.'}</p>`}</div>
    <h3>Condición del lote</h3>
    <div class="condition-detail-card source-${condition.source}">${fieldStateIcon(fieldStateLookup[condition.stateId])}<div><strong>${condition.label}${conditionIsAssumed(condition.source) ? ' ≈' : ''}</strong><span>${sourceLabel}</span><p>${esc(condition.explanation)}</p></div></div>
    <div class="lot-inspector-actions"><button class="btn primary" data-edit-map-lot="${lot.id}">${icon('edit',16)} ${lotEntry ? 'Editar lote' : 'Registrar lote'}</button><button class="btn secondary" data-open-survey-history>${icon('history',16)} Cambiar fecha</button></div>
  </aside>` : `<aside class="lot-inspector empty-inspector"><img src="./assets/${UI_ASSETS.home}"><h2>Elegí un lote</h2><p>Tocá cualquier lote para ver animales, carga, condición y editarlo directamente.</p></aside>`
  const content = `${renderSurveyNavigator()}<div class="map-page-layout"><article class="panel full-map-panel">${renderMap(survey, false)}</article>${side}</div>`
  return renderShell(content, 'Mapa del campo', `Relevamiento del ${dateLabel(survey.date)}`, `<button class="btn primary" data-start-survey>${icon('plus',17)} Nuevo</button>`)
}

function startSurvey() {
  state.draft = {
    id: uid(),
    mode: 'new',
    editingSurveyId: null,
    date: todayISO(),
    rainPeriod: monthKey(todayISO()),
    lots: [],
    events: { births: 0, deaths: 0, purchases: 0, sales: 0 },
    note: '',
    step: 1,
    lastSavedAt: new Date().toISOString(),
  }
  ui.wizardStep = 1
  saveState()
  navigate('relevamiento')
}

function editSurvey(surveyId) {
  const survey = state.surveys.find((item) => item.id === surveyId)
  if (!survey) return
  state.draft = {
    id: survey.id,
    mode: 'edit',
    editingSurveyId: survey.id,
    originalDate: survey.date,
    originalCreatedAt: survey.createdAt,
    date: survey.date,
    rainPeriod: survey.rainPeriod || monthKey(survey.date),
    lots: JSON.parse(JSON.stringify(survey.lots || [])),
    events: { births: 0, deaths: 0, purchases: 0, sales: 0, ...(survey.events || {}) },
    note: survey.note || '',
    step: 1,
    lastSavedAt: new Date().toISOString(),
  }
  saveState()
  navigate('relevamiento')
}

function renderSurveyWizard() {
  const draft = state.draft
  if (!draft) {
    const content = `<section class="survey-intro"><div class="survey-intro-copy"><span class="eyebrow">Una fotografía del campo</span><h2>Nuevo relevamiento</h2><p>Registrá los lotes observados. Podés cargar animales y condición, o registrar un lote vacío solamente para informar su estado.</p><ul><li>${icon('check',18)} Empezá de cero</li><li>${icon('check',18)} Agregá solo los lotes observados</li><li>${icon('check',18)} Revisá diferencias al final, sin bloqueos</li></ul><button class="btn primary large" data-start-survey>${icon('plus',19)} Comenzar</button></div><div class="survey-intro-art single"><img src="./assets/${UI_ASSETS.register}" alt="Registrar animales"></div></section>`
    return renderShell(content, 'Nuevo relevamiento', 'Registrar animales y condición por lote')
  }
  const isEditing = draft.mode === 'edit'
  const step = draft.step || ui.wizardStep || 1
  const stepper = `<div class="stepper"><span class="${step>=1?'done':''}"><i>1</i>Fecha y lluvia</span><span class="${step>=2?'done':''}"><i>2</i>Registrar lotes</span><span class="${step>=3?'done':''}"><i>3</i>Revisar</span></div>`
  let body = ''
  if (step === 1) body = renderSurveyStepOne(draft)
  if (step === 2) body = renderSurveyStepTwo(draft)
  if (step === 3) body = renderSurveyStepThree(draft)
  return renderShell(`${stepper}<div class="draft-save-status">${icon('check',14)} Borrador guardado automáticamente</div>${body}`, isEditing ? 'Editar relevamiento' : 'Nuevo relevamiento', isEditing ? `Modificando el registro del ${dateLabel(draft.originalDate || draft.date)}` : 'Podés dejar lotes sin cargar', `<button class="btn ghost" data-cancel-survey>Cancelar</button>`)
}

function renderSurveyStepOne(draft) {
  const rain = rainAnalysis(draft.rainPeriod)
  return `<section class="wizard-card narrow"><div class="wizard-title"><span class="step-number">1</span><div><h2>¿Cuándo se hizo el relevamiento?</h2><p>Puede haber varios relevamientos en un mes o pasar más de un mes entre ellos.</p></div></div>
    <label class="field"><span>Fecha del relevamiento</span><div class="input-icon">${icon('calendar',18)}<input type="date" id="survey-date" value="${esc(draft.date)}"></div></label>
    <div class="soft-divider"></div>
    <div class="wizard-title compact"><span class="step-number water">${icon('rain',20)}</span><div><h3>Lluvia del mes <small>(opcional)</small></h3><p>Podés cargar eventos diarios o dejar el mes sin información. Cero milímetros y campo vacío son datos diferentes.</p></div></div>
    <button class="rain-month-summary" data-open-rain="${draft.rainPeriod}"><span><small>${monthLabel(draft.rainPeriod)}</small><strong>${rain.current == null ? 'Sin información' : `${fmt(rain.current)} mm`}</strong></span><b>${rain.entries?.length ? `${rain.entries.length} registros diarios` : rain.source === 'monthly' ? 'Total mensual heredado' : 'Cargar lluvia diaria'}</b>${icon('chevron',18)}</button>
    <div class="wizard-actions"><span></span><button class="btn primary large" data-step-one-next>Continuar ${icon('chevron',18)}</button></div>
  </section>`
}

function renderSurveyStepTwo(draft) {
  const total = draft.lots.reduce((sum, lot) => sum + lot.groups.reduce((a, group) => a + Number(group.quantity || 0), 0), 0)
  const cards = draft.lots.length ? draft.lots.map((lotEntry) => {
    const lot = lotLookup[lotEntry.lotId]
    const quantity = lotEntry.groups.reduce((sum, group) => sum + Number(group.quantity || 0), 0)
    const stateInfo = fieldStateLookup[lotEntry.fieldState] || fieldStateLookup['no-observado']
    return `<article class="loaded-lot-card"><div class="lot-card-number">${lot.name.replace('ER-','')}</div><div class="loaded-lot-content"><div><h3>${lot.name}</h3><p>${quantity ? `${fmt(quantity)} animales · ${lotEntry.groups.length} ${lotEntry.groups.length===1?'grupo':'grupos'}` : 'Lote observado sin animales'}</p></div><span class="field-mini ${stateInfo.tone}">${fieldStateIcon(stateInfo)}<b>${stateInfo.label}</b></span></div><div class="lot-card-actions"><button data-edit-draft-lot="${lot.id}" aria-label="Editar">${icon('edit',18)}</button><button data-remove-draft-lot="${lot.id}" aria-label="Eliminar">${icon('trash',18)}</button></div></article>`
  }).join('') : `<div class="empty-add"><img src="./assets/${UI_ASSETS.register}"><h3>Todavía no registraste lotes</h3><p>Agregá un lote con animales o registralo vacío para informar su condición.</p><button class="btn primary" data-add-draft-lot>${icon('plus',18)} Registrar un lote</button></div>`
  return `<section class="wizard-card wide"><div class="wizard-title"><span class="step-number">2</span><div><h2>Registrar lotes observados</h2><p>Podés cargar animales y condición, o solamente la condición de un lote vacío.</p></div></div>
    <div class="loaded-summary"><div><small>Lotes observados</small><strong>${draft.lots.length}</strong></div><div><small>Animales ingresados</small><strong>${fmt(total)}</strong></div><button class="btn secondary" data-add-draft-lot>${icon('plus',18)} Agregar lote</button></div>
    <div class="loaded-lots">${cards}</div>
    <div class="wizard-actions"><button class="btn ghost" data-wizard-back>${icon('back',18)} Atrás</button><button class="btn primary large" data-step-two-next>Revisar resumen ${icon('chevron',18)}</button></div>
  </section>`
}

function draftAsSurvey(draft) {
  const now = new Date().toISOString()
  return { id: draft.id, date: draft.date, createdAt: draft.originalCreatedAt || now, editedAt: draft.mode === 'edit' ? now : null, rainPeriod: draft.rainPeriod, lots: draft.lots, events: draft.events, note: draft.note }
}

function renderSurveyStepThree(draft) {
  const survey = draftAsSurvey(draft)
  const metrics = surveyMetrics(survey)
  const alerts = discrepancyAlerts(survey)
  const loadAlerts = operationalAlerts(survey)
  const unobservedLots = LOTS.filter((lot) => !draft.lots.some((item) => item.lotId === lot.id))
  const conditionSummary = LOTS.map((lot) => resolveLotCondition(survey, lot.id))
  const observedConditions = conditionSummary.filter((item) => item.source === 'observed').length
  const assumedConditions = conditionSummary.filter((item) => conditionIsAssumed(item.source)).length
  const noInfoConditions = conditionSummary.filter((item) => item.source === 'none').length
  return `<section class="wizard-card wide review-card"><div class="wizard-title"><span class="step-number">3</span><div><h2>Revisá y guardá</h2><p>Cualquier diferencia de uno o más animales aparece aquí. Las alertas nunca impiden guardar.</p></div></div>
    <div class="review-hero"><div><small>Fecha</small><strong>${dateLabel(draft.date)}</strong></div><div><small>Animales</small><strong>${fmt(metrics.animals)}</strong></div><div><small>Carga promedio</small><strong>${decimal(metrics.load)} EV/ha</strong></div><div><small>Lotes observados</small><strong>${draft.lots.length} / 18</strong></div></div>
    <div class="review-grid">
      <article class="review-section"><h3>Totales por categoría</h3>${metrics.animals ? renderCategoryBars(metrics.categories, metrics.animals) : '<div class="empty-inline">No se registraron animales.</div>'}</article>
      <article class="review-section"><h3>Condición de los lotes</h3><div class="condition-origin-summary"><div><strong>${observedConditions}</strong><span>observadas</span></div><div><strong>${assumedConditions}</strong><span>estimadas</span></div><div><strong>${noInfoConditions}</strong><span>sin información</span></div></div>${renderFieldStateSummary(draft)}</article>
    </div>
    <details class="optional-events"><summary>Eventos opcionales desde el relevamiento anterior</summary><p>Completá estos datos solo si los tenés. No se registran movimientos entre lotes en esta versión.</p><div class="event-grid"><label>Nacimientos<input type="number" min="0" data-event-field="births" value="${draft.events.births || 0}"></label><label>Mortandad<input type="number" min="0" data-event-field="deaths" value="${draft.events.deaths || 0}"></label><label>Compras<input type="number" min="0" data-event-field="purchases" value="${draft.events.purchases || 0}"></label><label>Ventas<input type="number" min="0" data-event-field="sales" value="${draft.events.sales || 0}"></label></div></details>
    <section class="review-alerts"><div class="panel-head"><h3>Diferencias y alertas</h3><span>${alerts.length + loadAlerts.length}</span></div>${alerts.length || loadAlerts.length ? `<div class="alert-list">${[...alerts,...loadAlerts].map(renderAlert).join('')}</div>` : '<div class="empty-inline success">No detectamos diferencias ni alertas de carga.</div>'}</section>
    <details class="empty-lots"><summary>${unobservedLots.length} lotes no fueron observados</summary><div>${unobservedLots.map((lot) => { const condition=resolveLotCondition(survey,lot.id); return `<span>${lot.name} · ${condition.label}${conditionIsAssumed(condition.source)?' ≈':''}</span>` }).join('')}</div></details>
    <label class="field"><span>Nota general (opcional)</span><textarea id="survey-note" rows="3" placeholder="Observaciones del relevamiento">${esc(draft.note || '')}</textarea></label>
    <div class="wizard-actions"><button class="btn ghost" data-wizard-back>${icon('back',18)} Volver a editar</button><button class="btn primary large" data-save-survey>${icon('check',18)} ${draft.mode === 'edit' ? 'Guardar cambios' : 'Confirmar y guardar'}</button></div>
  </section>`
}

function renderFieldStateSummary(draft) {
  const survey = draftAsSurvey(draft)
  const counts = Object.fromEntries(FIELD_STATES.map((item) => [item.id, 0]))
  LOTS.forEach((lot) => counts[resolveLotCondition(survey, lot.id).stateId]++)
  const rows = FIELD_STATES.filter((item) => counts[item.id])
  return `<div class="field-summary">${rows.map((item) => `<div><span>${fieldStateIcon(item)} ${item.label}</span><strong>${counts[item.id]}</strong></div>`).join('')}</div>`
}

function renderModal() {
  if (ui.modal.type === 'lot-form') return renderLotFormModal()
  if (ui.modal.type === 'survey-detail') return renderSurveyDetailModal()
  if (ui.modal.type === 'survey-history') return renderSurveyHistoryModal()
  if (ui.modal.type === 'rain-manager') return renderRainModal()
  if (ui.modal.type === 'confirm-reset') return `<div class="modal-backdrop"><div class="modal small"><button class="modal-close" data-close-modal>${icon('close')}</button><h2>Restablecer datos de demostración</h2><p>Se eliminarán los relevamientos guardados en este dispositivo.</p><div class="modal-actions"><button class="btn ghost" data-close-modal>Cancelar</button><button class="btn danger" data-confirm-reset>Restablecer</button></div></div></div>`
  return ''
}

function renderLotFormModal() {
  const modal = ui.modal
  const model = modal.lot
  const directSurvey = modal.context === 'direct' ? state.surveys.find((survey) => survey.id === modal.surveyId) : null
  const collection = modal.context === 'direct' ? (directSurvey?.lots || []) : (state.draft?.lots || [])
  const available = LOTS.filter((lot) => lot.id === model.lotId || !collection.some((item) => item.lotId === lot.id))
  const groups = model.groups.length ? model.groups.map((group, index) => `<div class="animal-group-row" data-group-index="${index}"><div class="group-main"><label><span>Categoría</span><select data-group-category="${index}"><option value="">Elegir categoría</option>${CATEGORIES.map((category) => `<option value="${category.id}" ${group.categoryId===category.id?'selected':''}>${category.name}</option>`).join('')}</select></label><label class="quantity-field"><span>Cantidad</span><input type="number" inputmode="numeric" min="0" data-group-quantity="${index}" value="${esc(group.quantity)}" placeholder="0"></label><button class="icon-button remove-group" data-remove-group="${index}" aria-label="Eliminar grupo">${icon('trash',18)}</button></div><details ${group.birthYear || group.notes ? 'open' : ''}><summary>Agregar detalle opcional</summary><div class="group-details"><label><span>Año de nacimiento</span><input type="number" min="1990" max="2035" data-group-year="${index}" value="${esc(group.birthYear || '')}" placeholder="Ej. 2025"></label><label><span>Nota</span><input type="text" data-group-notes="${index}" value="${esc(group.notes || '')}" placeholder="Ej. Listas para servicio"></label></div></details></div>`).join('') : `<div class="empty-groups"><img src="./assets/${UI_ASSETS.register}" alt=""><div><strong>Sin animales cargados</strong><p>Podés agregar un grupo o guardar el lote vacío si elegís una condición.</p></div></div>`
  const contextSurvey = directSurvey || (state.draft ? draftAsSurvey(state.draft) : selectedSurvey())
  const suggestion = model.lotId ? resolveLotCondition(contextSurvey, model.lotId) : null
  const isHistorical = directSurvey && directSurvey.id !== latestSurvey()?.id
  return `<div class="modal-backdrop"><div class="modal lot-modal"><button class="modal-close" data-close-modal>${icon('close')}</button><span class="eyebrow">Registro por lote</span><h2>${modal.isEdit ? 'Editar lote' : 'Registrar lote'}</h2>${isHistorical ? `<div class="historical-edit-warning">${icon('alert',17)} Estás editando el relevamiento histórico del ${compactDateLabel(directSurvey.date)}. Esto puede cambiar comparaciones posteriores.</div>` : ''}<label class="field"><span>Lote</span><select id="modal-lot-select" ${modal.isEdit || modal.context === 'direct' ? 'disabled' : ''}><option value="">Elegir lote</option>${available.map((lot) => `<option value="${lot.id}" ${model.lotId===lot.id?'selected':''}>${lot.name} · ${lot.hectares} ha</option>`).join('')}</select></label><div class="modal-section-head"><div><h3>Grupos de animales <small>(opcional)</small></h3><p>Podés repetir una categoría con distintos años de nacimiento.</p></div><button class="btn secondary small" data-add-group>${icon('plus',17)} Agregar grupo</button></div><div class="animal-groups">${groups}</div><div class="modal-section-head field-head"><div><h3>Condición del lote</h3><p>Elegí una condición para registrarla como observada. También podés dejarla sin información.</p></div></div>${suggestion && suggestion.source !== 'observed' && suggestion.source !== 'none' ? `<div class="condition-suggestion"><span>≈ Sugerencia automática</span><strong>${suggestion.label}</strong><p>${esc(suggestion.explanation)}</p></div>` : ''}<div class="field-state-options">${FIELD_STATES.map((item) => `<button class="field-state-option ${normalizeFieldState(model.fieldState)===item.id?'selected':''}" data-field-state="${item.id}">${fieldStateIcon(item)}<strong>${item.label}</strong></button>`).join('')}</div><div class="modal-actions">${modal.context === 'direct' && modal.isEdit ? `<button class="btn danger-outline push-left" data-remove-direct-lot="${model.lotId}">Quitar del relevamiento</button>` : ''}<button class="btn ghost" data-close-modal>Cancelar</button><button class="btn primary" data-save-lot>Guardar lote</button></div></div></div>`
}

function renderSurveyHistoryModal() {
  const groups = []
  for (const survey of sortedSurveys()) {
    const key = monthKey(survey.date)
    let group = groups.find((item) => item.key === key)
    if (!group) { group = { key, surveys: [] }; groups.push(group) }
    group.surveys.push(survey)
  }
  return `<div class="modal-backdrop"><div class="modal survey-history-modal"><button class="modal-close" data-close-modal>${icon('close')}</button><span class="eyebrow">Historial</span><h2>Elegí un relevamiento</h2><p>Las fechas están ordenadas desde la más reciente.</p><div class="survey-history-groups">${groups.map((group) => `<section><h3>${monthLabel(group.key)}</h3>${group.surveys.map((survey) => { const metrics=surveyMetrics(survey); return `<button class="survey-history-option ${survey.id===selectedSurvey()?.id?'selected':''}" data-select-survey="${survey.id}" data-close-after><span><strong>${dateLabel(survey.date)}</strong><small>${survey.id===latestSurvey()?.id?'Último disponible':'Relevamiento histórico'}</small></span><b>${fmt(metrics.animals)} animales</b>${icon('chevron',17)}</button>` }).join('')}</section>`).join('')}</div></div></div>`
}

function renderRainModal() {
  const period = ui.modal.period || monthKey(selectedSurvey()?.date || todayISO())
  const summary = monthlyRainSummary(period)
  const analysis = rainAnalysis(period)
  const editing = summary.entries.find((entry) => entry.id === ui.modal.entryId) || null
  const defaultDate = editing?.date || (period === monthKey(todayISO()) ? todayISO() : `${period}-01`)
  return `<div class="modal-backdrop"><div class="modal rain-modal"><button class="modal-close" data-close-modal>${icon('close')}</button><span class="eyebrow">Lluvia diaria</span><h2>${monthLabel(period)}</h2><label class="field compact-month"><span>Cambiar mes</span><input type="month" id="rain-period-select" value="${period}"></label><div class="rain-modal-total"><img src="./assets/${KPI_ASSETS.rain}" alt=""><div><small>Total del mes</small><strong>${summary.millimeters == null ? 'Sin información' : `${fmt(summary.millimeters)} mm`}</strong><span>${analysis.status} · ${analysis.detail}</span></div></div>${summary.source === 'monthly' ? '<div class="legacy-rain-note">Este total proviene del registro mensual de una versión anterior. Al agregar una fecha diaria, será reemplazado.</div>' : ''}<div class="rain-entry-list">${summary.entries.length ? summary.entries.map((entry) => `<div><span><strong>${compactDateLabel(entry.date)}</strong><small>${esc(entry.note || 'Sin nota')}</small></span><b>${decimal(entry.millimeters,1)} mm</b><button data-edit-rain-entry="${entry.id}">${icon('edit',16)}</button><button data-delete-rain-entry="${entry.id}">${icon('trash',16)}</button></div>`).join('') : '<div class="empty-inline">No hay registros diarios. Podés dejar el mes en blanco.</div>'}</div><div class="rain-entry-form"><h3>${editing ? 'Editar registro' : 'Agregar lluvia'}</h3><div class="rain-form-grid"><label><span>Fecha</span><input type="date" id="rain-entry-date" value="${defaultDate}"></label><label><span>Milímetros</span><input type="number" min="0" step="0.1" inputmode="decimal" id="rain-entry-mm" value="${editing?.millimeters ?? ''}" placeholder="0"></label></div><label><span>Nota opcional</span><input type="text" id="rain-entry-note" value="${esc(editing?.note || '')}" placeholder="Ej. Lluvia fuerte durante la noche"></label><button class="btn primary" data-save-rain-entry>${editing ? 'Guardar cambios' : 'Agregar registro'}</button></div><div class="modal-actions"><button class="btn danger-outline push-left" data-clear-rain-month>Dejar el mes sin información</button><button class="btn ghost" data-close-modal>Cerrar</button></div></div></div>`
}

function renderHistory() {
  const surveys = sortedSurveys()
  const rainRows = allRainPeriods().sort((a, b) => b.localeCompare(a)).map(monthlyRainSummary)
  const maxAnimals = Math.max(...surveys.map((survey) => surveyMetrics(survey).animals), 1)
  const content = `<section class="history-header"><div><span class="eyebrow">Fotografías del campo</span><h2>Historial de relevamientos</h2><p>Compará fechas exactas, aunque no tengan una frecuencia mensual fija.</p></div><button class="btn primary" data-start-survey>${icon('plus',18)} Nuevo relevamiento</button></section><section class="history-grid"><article class="panel"><div class="panel-head"><h3>Evolución de animales</h3><span>${surveys.length} relevamientos</span></div><div class="survey-chart">${[...surveys].reverse().map((survey) => { const m=surveyMetrics(survey); return `<button data-detail-survey="${survey.id}" title="${dateLabel(survey.date)}"><i style="height:${Math.max(8,m.animals/maxAnimals*100)}%"></i><span>${fmt(m.animals)}</span><small>${survey.date.slice(5)}</small></button>` }).join('')}</div></article><article class="panel"><div class="panel-head"><h3>Lluvia por mes</h3><button class="btn secondary small" data-open-rain="${monthKey(todayISO())}">${icon('plus',16)} Carga diaria</button></div><div class="rain-table">${rainRows.length ? rainRows.map((item) => { const analysis=rainAnalysis(item.period); return `<div><span><strong>${monthLabel(item.period)}</strong><small>${analysis.status} · ${item.source === 'daily' ? `${item.entries.length} registros` : 'total mensual'}</small></span><b>${item.millimeters == null ? '—' : `${fmt(item.millimeters)} mm`}</b><button data-open-rain="${item.period}">${icon('edit',16)}</button></div>` }).join('') : '<div class="empty-inline">Todavía no hay lluvia registrada.</div>'}</div></article></section><section class="panel survey-list-panel"><div class="panel-head"><h3>Todos los relevamientos</h3><button class="text-link" data-open-survey-history>Selector por fecha</button></div><div class="survey-list">${surveys.map((survey,index)=>{ const m=surveyMetrics(survey); const prior=previousSurvey(survey); const diff=prior?m.animals-surveyMetrics(prior).animals:null; return `<button class="survey-row" data-detail-survey="${survey.id}"><span class="survey-index">${surveys.length-index}</span><div><strong>${dateLabel(survey.date)}</strong><p>${survey.lots.length} lotes observados · ${decimal(m.load)} EV/ha</p></div><div class="survey-total"><strong>${fmt(m.animals)}</strong><small>${diff==null?'Inicial':`${diff>=0?'+':''}${fmt(diff)} vs. anterior`}</small></div>${icon('chevron',18)}</button>` }).join('')}</div></section>`
  return renderShell(content, 'Histórico y lluvia', 'Relevamientos por fecha y lluvia con carga diaria')
}

function renderSurveyDetailModal() {
  const survey = state.surveys.find((item) => item.id === ui.modal.surveyId)
  if (!survey) return ''
  const m = surveyMetrics(survey)
  const alerts = discrepancyAlerts(survey)
  return `<div class="modal-backdrop"><div class="modal detail-modal"><button class="modal-close" data-close-modal>${icon('close')}</button><span class="eyebrow">Relevamiento guardado</span><h2>${dateLabel(survey.date)}</h2>${survey.editedAt ? `<p class="edited-note">Última edición: ${new Intl.DateTimeFormat('es-AR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(survey.editedAt))}</p>` : ''}<div class="review-hero"><div><small>Animales</small><strong>${fmt(m.animals)}</strong></div><div><small>Carga</small><strong>${decimal(m.load)} EV/ha</strong></div><div><small>Lotes</small><strong>${survey.lots.length}</strong></div></div>${renderCategoryBars(m.categories,m.animals)}${alerts.length?`<h3>Diferencias detectadas</h3><div class="alert-list">${alerts.map(renderAlert).join('')}</div>`:''}<div class="modal-actions"><button class="btn secondary" data-export-survey="${survey.id}">Exportar CSV</button><button class="btn secondary" data-edit-survey="${survey.id}">${icon('edit',16)} Editar</button><button class="btn primary" data-select-survey="${survey.id}" data-close-after>Ver en el mapa</button></div></div></div>`
}

function renderDataPage() {
  const survey = selectedSurvey()
  const latest = latestSurvey()
  const content = `<section class="data-page-grid"><article class="panel data-card"><span class="data-icon">${icon('download',26)}</span><h2>Exportar datos</h2><p>Descargá el relevamiento seleccionado o el historial completo en formato CSV.</p><div class="stack-buttons"><button class="btn primary" data-export-latest>Relevamiento seleccionado CSV</button><button class="btn secondary" data-export-all>Historial completo CSV</button></div></article><article class="panel data-card"><span class="data-icon">${icon('clipboard',26)}</span><h2>Respaldo completo</h2><p>El respaldo JSON conserva relevamientos, lluvia diaria y configuración local.</p><div class="stack-buttons"><button class="btn primary" data-export-backup>Descargar respaldo</button><label class="btn secondary file-button">Restaurar respaldo<input type="file" id="import-backup" accept="application/json"></label></div></article><article class="panel data-card version-card"><span class="data-icon"><img src="./assets/${UI_ASSETS.home}" alt=""></span><h2>Información de la app</h2><p><strong>Campo v${APP_VERSION_LABEL}</strong><br>Publicación: ${RELEASE_DATE}<br>Datos más recientes: ${latest ? dateLabel(latest.date) : 'Sin datos'}<br>Relevamiento seleccionado: ${survey ? dateLabel(survey.date) : 'Sin datos'}</p><small>Los datos siguen almacenados localmente hasta incorporar Supabase.</small></article><article class="panel data-card warning-card"><span class="data-icon">${icon('alert',26)}</span><h2>Datos locales</h2><p>La URL comparte la aplicación, pero cada dispositivo conserva su propia información hasta implementar Supabase.</p><button class="btn danger-outline" data-reset-demo>Restablecer demo</button></article></section>`
  return renderShell(content, 'Exportar y respaldo', 'Protegé los datos guardados en este dispositivo')
}

function renderLotFormModalEventUpdate(target) {
  if (!ui.modal || ui.modal.type !== 'lot-form') return
  const index = Number(target.dataset.groupCategory ?? target.dataset.groupQuantity ?? target.dataset.groupYear ?? target.dataset.groupNotes)
  const group = ui.modal.lot.groups[index]
  if (!group) return
  if (target.dataset.groupCategory !== undefined) group.categoryId = target.value
  if (target.dataset.groupQuantity !== undefined) group.quantity = target.value
  if (target.dataset.groupYear !== undefined) group.birthYear = target.value
  if (target.dataset.groupNotes !== undefined) group.notes = target.value
}

function download(filename, content, type='text/plain;charset=utf-8') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function surveyCsv(survey) {
  const rows = [['fecha','lote','hectareas','condicion_observada','condicion_efectiva','origen_condicion','categoria','cantidad','anio_nacimiento','nota']]
  for (const lotEntry of survey.lots) {
    const lot = lotLookup[lotEntry.lotId]
    const effective = resolveLotCondition(survey, lot.id)
    if (!lotEntry.groups.length) rows.push([survey.date, lot.name, lot.hectares, fieldStateLookup[lotEntry.fieldState]?.label || '', effective.label, conditionSourceLabel(effective.source), '', 0, '', 'Lote observado sin animales'])
    for (const group of lotEntry.groups) rows.push([survey.date, lot.name, lot.hectares, fieldStateLookup[lotEntry.fieldState]?.label || '', effective.label, conditionSourceLabel(effective.source), categoryLookup[group.categoryId]?.name || group.categoryId, group.quantity, group.birthYear || '', group.notes || ''])
  }
  return rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"','""')}"`).join(',')).join('\n')
}

function allCsv() {
  const rows = [['fecha','lote','hectareas','condicion_observada','condicion_efectiva','origen_condicion','categoria','cantidad','anio_nacimiento','nota']]
  for (const survey of sortedSurveys().reverse()) {
    for (const lotEntry of survey.lots) {
      const lot = lotLookup[lotEntry.lotId]
      const effective = resolveLotCondition(survey, lot.id)
      if (!lotEntry.groups.length) rows.push([survey.date, lot.name, lot.hectares, fieldStateLookup[lotEntry.fieldState]?.label || '', effective.label, conditionSourceLabel(effective.source), '', 0, '', 'Lote observado sin animales'])
      for (const group of lotEntry.groups) rows.push([survey.date, lot.name, lot.hectares, fieldStateLookup[lotEntry.fieldState]?.label || '', effective.label, conditionSourceLabel(effective.source), categoryLookup[group.categoryId]?.name || group.categoryId, group.quantity, group.birthYear || '', group.notes || ''])
    }
  }
  return rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"','""')}"`).join(',')).join('\n')
}

function render() {
  if (!['resumen','relevamiento','mapa','historico','datos'].includes(ui.view)) ui.view='resumen'
  let html = ''
  if (ui.view === 'resumen') html = renderDashboard()
  if (ui.view === 'relevamiento') html = renderSurveyWizard()
  if (ui.view === 'mapa') html = renderMapPage()
  if (ui.view === 'historico') html = renderHistory()
  if (ui.view === 'datos') html = renderDataPage()
  document.getElementById('app').innerHTML = html
  bindEvents()
}

function bindEvents() {
  document.querySelectorAll('[data-nav]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.nav)))
  document.querySelectorAll('[data-start-survey]').forEach((button) => button.addEventListener('click', startSurvey))
  document.querySelectorAll('[data-edit-selected-survey]').forEach((button) => button.addEventListener('click', () => editSurvey(selectedSurvey()?.id)))
  document.querySelectorAll('[data-edit-survey]').forEach((button) => button.addEventListener('click', () => { ui.modal = null; editSurvey(button.dataset.editSurvey) }))
  document.querySelectorAll('[data-open-survey-history]').forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); ui.modal = { type: 'survey-history' }; render() }))
  document.querySelectorAll('[data-survey-older]').forEach((button) => button.addEventListener('click', () => { const target=surveyNavigation().older; if(target){state.selectedSurveyId=target.id;ui.selectedLotId=null;saveState();render()} }))
  document.querySelectorAll('[data-survey-newer]').forEach((button) => button.addEventListener('click', () => { const target=surveyNavigation().newer; if(target){state.selectedSurveyId=target.id;ui.selectedLotId=null;saveState();render()} }))
  document.querySelectorAll('[data-view-latest]').forEach((button) => button.addEventListener('click', () => { const target=latestSurvey(); if(target){state.selectedSurveyId=target.id;ui.selectedLotId=null;saveState();render()} }))
  document.querySelectorAll('[data-map-lot]').forEach((element) => element.addEventListener('click', () => { ui.selectedLotId = element.dataset.mapLot; if (ui.view !== 'mapa') navigate('mapa'); else render() }))
  document.querySelectorAll('[data-lot]').forEach((element) => element.addEventListener('click', () => { ui.selectedLotId=element.dataset.lot; navigate('mapa') }))
  document.querySelectorAll('[data-close-lot]').forEach((button) => button.addEventListener('click', () => { ui.selectedLotId=null; render() }))
  document.querySelectorAll('[data-edit-map-lot]').forEach((button) => button.addEventListener('click', () => {
    const survey = selectedSurvey()
    const lotId = button.dataset.editMapLot
    const existing = (survey.lots || []).find((item) => item.lotId === lotId)
    ui.modal = { type:'lot-form', context:'direct', surveyId:survey.id, isEdit:Boolean(existing), originalLotId:lotId, lot:existing ? JSON.parse(JSON.stringify(existing)) : { lotId, fieldState:'no-observado', conditionSource:'unobserved', groups:[] } }
    render()
  }))
  document.querySelectorAll('[data-select-survey]').forEach((button) => button.addEventListener('click', () => { state.selectedSurveyId=button.dataset.selectSurvey; ui.selectedLotId=null; saveState(); if (button.dataset.closeAfter !== undefined) ui.modal=null; render() }))
  document.querySelectorAll('[data-detail-survey]').forEach((button) => button.addEventListener('click', () => { ui.modal={type:'survey-detail',surveyId:button.dataset.detailSurvey}; render() }))
  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => { ui.modal=null; render() }))
  document.querySelectorAll('[data-cancel-survey]').forEach((button) => button.addEventListener('click', () => { if(confirm('¿Cancelar este relevamiento? Se perderá el borrador.')) { state.draft=null; saveState(); navigate('resumen') } }))

  const dateInput = document.getElementById('survey-date')
  if (dateInput) dateInput.addEventListener('change', (event) => { state.draft.date=event.target.value; state.draft.rainPeriod=monthKey(event.target.value); state.draft.lastSavedAt=new Date().toISOString(); saveState(); render() })
  document.querySelectorAll('[data-step-one-next]').forEach((button) => button.addEventListener('click', () => { if(!state.draft.date) return alert('Elegí una fecha.'); state.draft.step=2; saveState(); render() }))
  document.querySelectorAll('[data-wizard-back]').forEach((button) => button.addEventListener('click', () => { state.draft.step=Math.max(1,(state.draft.step||1)-1); saveState(); render() }))
  document.querySelectorAll('[data-step-two-next]').forEach((button) => button.addEventListener('click', () => { state.draft.step=3; saveState(); render() }))
  document.querySelectorAll('[data-add-draft-lot]').forEach((button) => button.addEventListener('click', () => { ui.modal={type:'lot-form',context:'draft',isEdit:false,lot:{lotId:'',fieldState:'no-observado',conditionSource:'unobserved',groups:[]}}; render() }))
  document.querySelectorAll('[data-edit-draft-lot]').forEach((button) => button.addEventListener('click', () => { const existing=state.draft.lots.find((item)=>item.lotId===button.dataset.editDraftLot); ui.modal={type:'lot-form',context:'draft',isEdit:true,originalLotId:existing.lotId,lot:JSON.parse(JSON.stringify(existing))}; render() }))
  document.querySelectorAll('[data-remove-draft-lot]').forEach((button) => button.addEventListener('click', () => { if(confirm(`¿Eliminar ${lotLookup[button.dataset.removeDraftLot].name} del relevamiento?`)){state.draft.lots=state.draft.lots.filter((item)=>item.lotId!==button.dataset.removeDraftLot);saveState();render()} }))
  const modalLotSelect = document.getElementById('modal-lot-select')
  if (modalLotSelect) modalLotSelect.addEventListener('change', (event) => { ui.modal.lot.lotId = event.target.value; render() })
  document.querySelectorAll('[data-add-group]').forEach((button) => button.addEventListener('click', () => { ui.modal.lot.groups.push({id:uid(),categoryId:'',quantity:'',birthYear:'',notes:''}); render() }))
  document.querySelectorAll('[data-remove-group]').forEach((button) => button.addEventListener('click', () => { ui.modal.lot.groups.splice(Number(button.dataset.removeGroup),1); render() }))
  document.querySelectorAll('[data-field-state]').forEach((button) => button.addEventListener('click', () => { ui.modal.lot.fieldState=button.dataset.fieldState; ui.modal.lot.conditionSource=button.dataset.fieldState==='no-observado'?'unobserved':'observed'; render() }))
  document.querySelectorAll('[data-group-category],[data-group-quantity],[data-group-year],[data-group-notes]').forEach((input) => input.addEventListener('input', (event) => renderLotFormModalEventUpdate(event.target)))
  document.querySelectorAll('[data-save-lot]').forEach((button) => button.addEventListener('click', () => {
    const select=document.getElementById('modal-lot-select'); if(select) ui.modal.lot.lotId=select.value
    if(!ui.modal.lot.lotId) return alert('Elegí un lote.')
    const partial = ui.modal.lot.groups.some((group) => (group.categoryId || group.quantity !== '' || group.birthYear || group.notes) && !(group.categoryId && Number(group.quantity) > 0))
    if (partial) return alert('Completá categoría y cantidad en cada grupo, o eliminá la fila incompleta.')
    const validGroups=ui.modal.lot.groups.filter((group)=>group.categoryId && Number(group.quantity)>0).map((group)=>({...group,quantity:Math.round(Number(group.quantity)),birthYear:group.birthYear?Number(group.birthYear):'',notes:String(group.notes||'').trim()}))
    const stateId=normalizeFieldState(ui.modal.lot.fieldState)
    if(!validGroups.length && stateId==='no-observado') return alert('Para registrar un lote sin animales, elegí una condición del lote.')
    const saved={...ui.modal.lot,fieldState:stateId,conditionSource:stateId==='no-observado'?'unobserved':'observed',groups:validGroups}
    if(ui.modal.context==='direct'){
      const survey=state.surveys.find((item)=>item.id===ui.modal.surveyId)
      if(!survey)return
      const exists=(survey.lots||[]).some((item)=>item.lotId===saved.lotId)
      survey.lots=exists?(survey.lots||[]).map((item)=>item.lotId===saved.lotId?saved:item):[...(survey.lots||[]),saved]
      survey.editedAt=new Date().toISOString()
      ui.modal=null;saveState();showToast('Lote actualizado');render()
    }else{
      state.draft.lots=ui.modal.isEdit?state.draft.lots.map((item)=>item.lotId===(ui.modal.originalLotId||saved.lotId)?saved:item):[...state.draft.lots,saved]
      state.draft.lastSavedAt=new Date().toISOString();ui.modal=null;saveState();render()
    }
  }))
  document.querySelectorAll('[data-remove-direct-lot]').forEach((button)=>button.addEventListener('click',()=>{
    if(!confirm(`¿Quitar ${lotLookup[button.dataset.removeDirectLot].name} del relevamiento seleccionado?`))return
    const survey=state.surveys.find((item)=>item.id===ui.modal.surveyId);if(!survey)return
    survey.lots=(survey.lots||[]).filter((item)=>item.lotId!==button.dataset.removeDirectLot);survey.editedAt=new Date().toISOString();ui.modal=null;saveState();showToast('Lote quitado del relevamiento');render()
  }))

  document.querySelectorAll('[data-event-field]').forEach((input) => input.addEventListener('input', (event) => { state.draft.events[event.target.dataset.eventField]=Math.max(0,Number(event.target.value)||0); saveState() }))
  const note=document.getElementById('survey-note'); if(note) note.addEventListener('input',(event)=>{state.draft.note=event.target.value;saveState()})
  document.querySelectorAll('[data-save-survey]').forEach((button) => button.addEventListener('click', () => {
    const draft=state.draft
    const survey=draftAsSurvey(draft)
    if (draft.mode === 'edit') {
      if (draft.originalDate && draft.originalDate !== draft.date) {
        const ok = confirm(`La fecha cambiará de ${dateLabel(draft.originalDate)} a ${dateLabel(draft.date)}. El historial se reordenará. ¿Continuar?`)
        if (!ok) return
      }
      state.surveys = state.surveys.map((item) => item.id === draft.editingSurveyId ? survey : item)
    } else state.surveys.push(survey)
    state.selectedSurveyId=survey.id
    state.draft=null; saveState(); showToast(draft.mode === 'edit' ? 'Relevamiento actualizado' : 'Relevamiento guardado'); setTimeout(()=>navigate('resumen'),400)
  }))

  document.querySelectorAll('[data-open-rain]').forEach((button)=>button.addEventListener('click',(event)=>{event.stopPropagation();ui.modal={type:'rain-manager',period:button.dataset.openRain||monthKey(selectedSurvey()?.date||todayISO()),entryId:null};render()}))
  const rainPeriod=document.getElementById('rain-period-select');if(rainPeriod)rainPeriod.addEventListener('change',(event)=>{ui.modal.period=event.target.value;ui.modal.entryId=null;render()})
  document.querySelectorAll('[data-edit-rain-entry]').forEach((button)=>button.addEventListener('click',()=>{ui.modal.entryId=button.dataset.editRainEntry;render()}))
  document.querySelectorAll('[data-delete-rain-entry]').forEach((button)=>button.addEventListener('click',()=>{if(!confirm('¿Eliminar este registro de lluvia?'))return;state.rainEntries=(state.rainEntries||[]).filter((entry)=>entry.id!==button.dataset.deleteRainEntry);saveState();render()}))
  document.querySelectorAll('[data-save-rain-entry]').forEach((button)=>button.addEventListener('click',()=>{
    const date=document.getElementById('rain-entry-date')?.value
    const raw=document.getElementById('rain-entry-mm')?.value
    const noteValue=document.getElementById('rain-entry-note')?.value||''
    if(!date)return alert('Elegí una fecha.')
    if(raw==='')return alert('Ingresá los milímetros. Podés usar 0 si no llovió.')
    const millimeters=Number(raw);if(!Number.isFinite(millimeters)||millimeters<0)return alert('Ingresá un valor válido.')
    const entry={id:ui.modal.entryId||uid(),date,millimeters,note:noteValue.trim()}
    state.rainEntries=ui.modal.entryId?(state.rainEntries||[]).map((item)=>item.id===ui.modal.entryId?entry:item):[...(state.rainEntries||[]),entry]
    state.rain=(state.rain||[]).filter((item)=>item.period!==monthKey(date))
    ui.modal.period=monthKey(date);ui.modal.entryId=null;saveState();render()
  }))
  document.querySelectorAll('[data-clear-rain-month]').forEach((button)=>button.addEventListener('click',()=>{if(!confirm(`¿Dejar ${monthLabel(ui.modal.period)} sin información de lluvia?`))return;state.rainEntries=(state.rainEntries||[]).filter((entry)=>monthKey(entry.date)!==ui.modal.period);state.rain=(state.rain||[]).filter((item)=>item.period!==ui.modal.period);saveState();render()}))

  document.querySelectorAll('[data-export-latest]').forEach((button)=>button.addEventListener('click',()=>{const survey=selectedSurvey();download(`campo-${survey.date}.csv`,surveyCsv(survey),'text/csv;charset=utf-8')}))
  document.querySelectorAll('[data-export-all]').forEach((button)=>button.addEventListener('click',()=>download('campo-historial.csv',allCsv(),'text/csv;charset=utf-8')))
  document.querySelectorAll('[data-export-survey]').forEach((button)=>button.addEventListener('click',()=>{const survey=state.surveys.find((item)=>item.id===button.dataset.exportSurvey);download(`campo-${survey.date}.csv`,surveyCsv(survey),'text/csv;charset=utf-8')}))
  document.querySelectorAll('[data-export-backup]').forEach((button)=>button.addEventListener('click',()=>download(`campo-respaldo-${todayISO()}.json`,JSON.stringify(state,null,2),'application/json')))
  const importInput=document.getElementById('import-backup'); if(importInput) importInput.addEventListener('change', async(event)=>{const file=event.target.files[0];if(!file)return;try{const imported=JSON.parse(await file.text());const migrated=migrateState(imported);if(!migrated)throw new Error('Formato no válido');state=migrated;saveState();showToast('Respaldo restaurado');setTimeout(()=>navigate('resumen'),400)}catch(error){alert(`No se pudo importar: ${error.message}`)}})
  document.querySelectorAll('[data-reset-demo]').forEach((button)=>button.addEventListener('click',()=>{ui.modal={type:'confirm-reset'};render()}))
  document.querySelectorAll('[data-confirm-reset]').forEach((button)=>button.addEventListener('click',()=>{state=createInitialState();saveState();ui.modal=null;showToast('Datos restablecidos');setTimeout(()=>navigate('resumen'),300)}))
}

function editRain(existingPeriod='') {
  ui.modal = { type: 'rain-manager', period: existingPeriod || monthKey(todayISO()), entryId: null }
  render()
}

window.addEventListener('hashchange',()=>{ui.view=location.hash.replace('#/','')||'resumen';render()})
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))
render()
