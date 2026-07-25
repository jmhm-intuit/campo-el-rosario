const STORAGE_KEY = 'campo-el-rosario-v2'
const APP_VERSION = 2
const TARGET_LOAD = 0.8

const LOTS = [
  { id: 'ER-01', name: 'ER-01', hectares: 150, points: '50,42 214,42 214,273 50,273', label: [132,145], sprite: [133,190] },
  { id: 'ER-02', name: 'ER-02', hectares: 150, points: '214,42 395,42 395,273 214,273', label: [304,145], sprite: [305,190] },
  { id: 'ER-03', name: 'ER-03', hectares: 150, points: '395,42 556,42 556,273 395,273', label: [475,145], sprite: [475,190] },
  { id: 'ER-04', name: 'ER-04', hectares: 50, points: '556,42 633,42 633,178 556,145', label: [594,92], sprite: [594,130] },
  { id: 'ER-05', name: 'ER-05', hectares: 60, points: '633,42 739,42 739,207 633,178', label: [685,98], sprite: [685,145] },
  { id: 'ER-06', name: 'ER-06', hectares: 50, points: '556,145 633,178 633,324 556,312', label: [594,238], sprite: [594,275] },
  { id: 'ER-07', name: 'ER-07', hectares: 65, points: '633,178 739,207 739,353 633,324', label: [685,264], sprite: [685,306] },
  { id: 'ER-08-09', name: 'ER-08/09', hectares: 150, points: '214,273 395,273 395,526 214,526', label: [305,345], sprite: [310,455] },
  { id: 'ER-10', name: 'ER-10', hectares: 150, points: '395,273 556,273 556,526 395,526', label: [475,350], sprite: [475,445] },
  { id: 'ER-11', name: 'ER-11', hectares: 65, points: '556,312 633,324 633,526 556,526', label: [594,410], sprite: [594,468] },
  { id: 'ER-12', name: 'ER-12', hectares: 55, points: '633,324 739,353 739,526 633,526', label: [685,425], sprite: [685,480] },
  { id: 'ER-13', name: 'ER-13', hectares: 50, points: '556,526 633,526 633,784 556,784', label: [594,620], sprite: [594,690] },
  { id: 'ER-14', name: 'ER-14', hectares: 60, points: '633,526 739,526 739,784 633,784', label: [685,620], sprite: [685,690] },
  { id: 'ER-15-16', name: 'ER-15/16', hectares: 70, points: '556,784 633,784 633,1016 556,1016', label: [594,850], sprite: [594,940] },
  { id: 'ER-17', name: 'ER-17', hectares: 70, points: '633,784 739,784 739,1016 633,1016', label: [685,850], sprite: [685,940] },
  { id: 'ER-18', name: 'ER-18', hectares: 60, points: '724,827 844,827 844,1050 724,955', label: [785,892], sprite: [785,960] },
  { id: 'ER-19', name: 'ER-19', hectares: 150, points: '844,827 969,827 969,1205 844,1050', label: [906,905], sprite: [906,1030] },
  { id: 'ER-20-21', name: 'ER-20/21', hectares: 180, points: '969,827 1074,827 1074,1278 969,1278', label: [1021,930], sprite: [1021,1080] },
]

const CATEGORIES = [
  { id: 'toros', name: 'Toros reproductores', short: 'Toros', factor: 1.25, asset: 'bull-black.png' },
  { id: 'vacas', name: 'Vacas de cría', short: 'Vacas', factor: 1, asset: 'cow-black.png' },
  { id: 'vaquillonas', name: 'Vaquillonas de reposición', short: 'Vaquillonas', factor: 1, asset: 'cow-red.png' },
  { id: 'terneros', name: 'Terneros', short: 'Terneros', factor: 0.5, asset: 'calf-black.png' },
  { id: 'terneras', name: 'Terneras', short: 'Terneras', factor: 0.5, asset: 'calf-red.png' },
  { id: 'machos-recria', name: 'Machos de recría y engorde', short: 'Recría/engorde', factor: 1, asset: 'cow-black.png' },
  { id: 'hembras-no-cria', name: 'Hembras no destinadas a cría', short: 'Hembras no cría', factor: 1, asset: 'cow-red.png' },
  { id: 'vacas-descarte', name: 'Vacas de descarte', short: 'Vacas descarte', factor: 1, asset: 'cow-red.png' },
  { id: 'otros', name: 'Otros animales', short: 'Otros', factor: 1, asset: 'cow-black.png' },
]

const FIELD_STATES = [
  { id: 'muy-bueno', label: 'Muy bueno', icon: '🌿', tone: 'excellent' },
  { id: 'bueno', label: 'Bueno', icon: '🌱', tone: 'good' },
  { id: 'regular', label: 'Regular', icon: '🟡', tone: 'regular' },
  { id: 'malo', label: 'Malo', icon: '🟤', tone: 'poor' },
  { id: 'anegado', label: 'Anegado', icon: '💧', tone: 'wet' },
  { id: 'no-observado', label: 'No observado', icon: '○', tone: 'unknown' },
]

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
      groups: value.groups.map(([categoryId, quantity], index) => ({ id: uid(), categoryId, quantity, birthYear: '', notes: index === 0 ? '' : '' })),
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
    draft: null,
    settings: { userName: 'Juan', establishment: 'El Rosario' },
    updatedAt: new Date().toISOString(),
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    const parsed = JSON.parse(raw)
    if (parsed.version !== APP_VERSION || !Array.isArray(parsed.surveys)) return createInitialState()
    return parsed
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
  state.updatedAt = new Date().toISOString()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function selectedSurvey() {
  return state.surveys.find((survey) => survey.id === state.selectedSurveyId) || [...state.surveys].sort((a, b) => b.date.localeCompare(a.date))[0]
}

function sortedSurveys() {
  return [...state.surveys].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
}

function previousSurvey(survey) {
  const list = [...state.surveys].sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt))
  const index = list.findIndex((item) => item.id === survey?.id)
  if (index >= 0) return index > 0 ? list[index - 1] : null
  if (!survey?.date) return list.at(-1) || null
  return [...list].reverse().find((item) => item.date <= survey.date) || null
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
  if (prior.animals > 0 && Math.abs(totalDiff) / prior.animals >= 0.1) {
    alerts.push({ severity: 'warning', title: 'Cambio importante en el total', text: `${totalDiff > 0 ? '+' : ''}${fmt(totalDiff)} animales respecto del relevamiento anterior.` })
  }
  for (const lot of LOTS) {
    const now = current.byLot[lot.id].animals
    const before = prior.byLot[lot.id].animals
    const diff = now - before
    if (before > 0 && now === 0) {
      alerts.push({ severity: 'warning', lotId: lot.id, title: `${lot.name} figura sin animales`, text: `Tenía ${fmt(before)} animales en el relevamiento anterior.` })
    } else if (Math.abs(diff) >= 30 && (before === 0 || Math.abs(diff) / Math.max(1, before) >= 0.2)) {
      alerts.push({ severity: 'info', lotId: lot.id, title: `Cambio en ${lot.name}`, text: `${diff > 0 ? '+' : ''}${fmt(diff)} animales desde el relevamiento anterior.` })
    }
  }
  return alerts.slice(0, 10)
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
  const current = state.rain.find((item) => item.period === period)?.millimeters ?? null
  const month = period?.slice(5, 7)
  const history = state.rain.filter((item) => item.period < period && item.period.slice(5, 7) === month)
  if (current == null) return { current: null, status: 'Sin dato', delta: null, detail: 'No se registró lluvia para este mes.' }
  if (!history.length) return { current, status: 'Sin base', delta: null, detail: 'Todavía no hay años anteriores para comparar.' }
  const average = history.reduce((sum, item) => sum + item.millimeters, 0) / history.length
  const delta = current - average
  const ratio = average ? delta / average : 0
  const status = ratio < -0.2 ? 'Déficit' : ratio > 0.2 ? 'Exceso' : 'Normal'
  return { current, status, delta, average, detail: `${delta >= 0 ? '+' : ''}${fmt(delta)} mm vs. histórico del mes.` }
}

function capacityClass(load) {
  if (!load) return 'empty'
  if (load <= TARGET_LOAD * 0.75) return 'low'
  if (load <= TARGET_LOAD) return 'ok'
  if (load <= TARGET_LOAD * 1.25) return 'high'
  if (load <= TARGET_LOAD * 1.5) return 'over'
  return 'critical'
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

function renderShell(content, title, subtitle, action = '') {
  const survey = selectedSurvey()
  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand"><img src="./assets/cow-black.png" alt=""><div><strong>CAMPO</strong><span>El Rosario</span></div></div>
        <nav>
          ${navItem('resumen', 'Resumen', 'home')}
          ${navItem('relevamiento', 'Nuevo relevamiento', 'clipboard')}
          ${navItem('mapa', 'Mapa', 'map')}
          ${navItem('historico', 'Histórico y lluvia', 'history')}
          ${navItem('datos', 'Exportar y respaldo', 'download')}
        </nav>
        <div class="sidebar-card">
          <small>Último relevamiento</small>
          <strong>${survey ? dateLabel(survey.date) : 'Sin datos'}</strong>
          <span>Los datos se guardan en este dispositivo.</span>
        </div>
        <div class="sidebar-footer">Campo V2 · local</div>
      </aside>
      <div class="content-shell">
        <header class="topbar">
          <button class="mobile-menu" data-toggle-nav aria-label="Menú">${icon('menu', 24)}</button>
          <div><h1>${title}</h1><p>${subtitle}</p></div>
          <div class="topbar-actions">${action}</div>
        </header>
        <main class="page">${content}</main>
      </div>
      <nav class="mobile-nav">
        ${navItem('resumen', 'Resumen', 'home')}
        ${navItem('relevamiento', 'Cargar', 'plus')}
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
  const rain = rainAnalysis(survey.rainPeriod || monthKey(survey.date))
  const alerts = [...operationalAlerts(survey), ...discrepancyAlerts(survey)].slice(0, 5)
  const events = survey.events || { births: 0, deaths: 0, purchases: 0, sales: 0 }
  const deltaAnimals = prevMetrics ? metrics.animals - prevMetrics.animals : null
  const cards = `
    <section class="kpi-grid v2">
      ${kpiCard('Ganado total', fmt(metrics.animals), deltaAnimals == null ? 'Primer relevamiento' : `${deltaAnimals >= 0 ? '+' : ''}${fmt(deltaAnimals)} vs. anterior`, 'cow', 'brown')}
      ${kpiCard('Carga del campo', `${decimal(metrics.load)} EV/ha`, `Objetivo ${decimal(TARGET_LOAD)} EV/ha`, 'map', capacityClass(metrics.load))}
      ${kpiCard('Nacimientos', fmt(events.births), 'Desde el relevamiento anterior', 'plus', 'gold')}
      ${kpiCard('Mortandad', fmt(events.deaths), 'Registro opcional del período', 'alert', events.deaths ? 'red' : 'neutral')}
      ${kpiCard('Compras y ventas', `${fmt(events.purchases)} / ${fmt(events.sales)}`, 'Compras / ventas', 'clipboard', 'blue')}
      ${kpiCard('Lluvia', rain.current == null ? 'Sin dato' : `${fmt(rain.current)} mm`, `${rain.status} · ${rain.detail}`, 'rain', rain.status.toLowerCase().replace('é','e'))}
    </section>`

  const content = `
    <section class="welcome-strip">
      <div><span class="eyebrow">Última fotografía del campo</span><h2>${dateLabel(survey.date)}</h2><p>${survey.lots.length} lotes con animales · ${18 - survey.lots.length} lotes sin carga registrada</p></div>
      <button class="btn primary large" data-start-survey>${icon('plus', 19)} Nuevo relevamiento</button>
    </section>
    ${cards}
    <section class="dashboard-grid">
      <article class="panel map-panel">
        <div class="panel-head"><div><span class="eyebrow">Mapa vivo</span><h3>El Rosario</h3></div><button class="btn ghost" data-nav="mapa">Abrir mapa</button></div>
        ${renderMap(survey, true)}
      </article>
      <aside class="dashboard-side">
        <article class="panel alerts-panel">
          <div class="panel-head"><h3>Alertas y diferencias</h3><span class="count-pill">${alerts.length}</span></div>
          ${alerts.length ? `<div class="alert-list">${alerts.map(renderAlert).join('')}</div>` : '<div class="empty-inline">Sin alertas importantes.</div>'}
        </article>
        <article class="panel">
          <div class="panel-head"><h3>Composición del rodeo</h3></div>
          ${renderCategoryBars(metrics.categories, metrics.animals)}
        </article>
        <article class="panel rain-card">
          <div class="panel-head"><h3>Registro de lluvia</h3><button class="text-link" data-nav="historico">Ver histórico</button></div>
          <div class="rain-hero"><strong>${rain.current == null ? '—' : fmt(rain.current)}</strong><span>mm · ${monthLabel(survey.rainPeriod)}</span><b class="rain-state ${esc(rain.status.toLowerCase().replace('é','e'))}">${esc(rain.status)}</b></div>
          <p>${esc(rain.detail)}</p>
        </article>
      </aside>
    </section>
    <section class="bottom-grid">
      <article class="panel adoption-card">
        <div class="adoption-visual"><img src="./assets/cow-black.png" alt="Vaca Angus"><img src="./assets/calf-red.png" alt="Ternero Angus"></div>
        <div><span class="eyebrow">Carga simple, datos útiles</span><h3>Registrá solo los lotes que tienen animales</h3><p>Elegí un lote, agregá las categorías presentes y continuá. Los lotes no cargados quedan con cero animales en ese relevamiento.</p><button class="btn primary" data-start-survey>Comenzar relevamiento</button></div>
      </article>
      <article class="panel recent-panel"><div class="panel-head"><h3>Últimos relevamientos</h3><button class="text-link" data-nav="historico">Ver todos</button></div>${renderRecentSurveys()}</article>
    </section>`
  return renderShell(content, 'Resumen del campo', 'Una vista clara del último relevamiento')
}

function kpiCard(label, value, note, iconName, tone) {
  return `<article class="kpi-card tone-${tone}"><span class="kpi-icon">${icon(iconName, 24)}</span><div><small>${label}</small><strong>${value}</strong><p>${note}</p></div></article>`
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

function renderMap(survey, compact = false) {
  const metrics = surveyMetrics(survey)
  const selected = ui.selectedLotId
  const polygonMarkup = LOTS.map((lot) => {
    const metric = metrics.byLot[lot.id]
    const status = capacityClass(metric.load)
    return `<polygon class="lot-hit ${status} ${selected === lot.id ? 'selected' : ''}" data-map-lot="${lot.id}" points="${lot.points}" />`
  }).join('')
  const labels = LOTS.map((lot) => {
    const metric = metrics.byLot[lot.id]
    return `<g class="map-label" transform="translate(${lot.label[0]} ${lot.label[1]})" data-map-lot="${lot.id}"><rect x="-43" y="-22" width="86" height="44" rx="10"/><text class="lot-name" text-anchor="middle" y="-4">${lot.name}</text><text class="lot-value" text-anchor="middle" y="13">${metric.animals ? `${fmt(metric.animals)} · ${decimal(metric.load)} EV/ha` : '0 animales'}</text></g>`
  }).join('')
  const occupiedLots = survey.lots.filter((lotEntry) => metrics.byLot[lotEntry.lotId].animals > 0)
  const sprites = occupiedLots.map((lotEntry) => renderHerdSprites(lotEntry, lotLookup[lotEntry.lotId], compact)).join('')
  const infra = compact ? '' : `
    <img class="map-infra house-one" src="./assets/house-small.png" alt="Casa">
    <img class="map-infra house-two" src="./assets/house-small.png" alt="Casa">
    <img class="map-infra corral" src="./assets/corral.png" alt="Corrales">
    <img class="map-infra water" src="./assets/windmill-tank.png" alt="Molino y tanque australiano">`
  return `<div class="ranch-map ${compact ? 'compact' : ''}">
    <img class="map-background" src="./assets/el-rosario-map.png" alt="Mapa aéreo de El Rosario">
    <svg class="map-overlay" viewBox="0 0 1154 1363" preserveAspectRatio="xMidYMid meet" aria-label="Lotes interactivos">
      ${polygonMarkup}${labels}
    </svg>
    ${sprites}${infra}
    <div class="map-legend"><span><i class="low"></i>Baja</span><span><i class="ok"></i>Adecuada</span><span><i class="high"></i>Alta</span><span><i class="critical"></i>Crítica</span></div>
  </div>`
}

function renderHerdSprites(lotEntry, lot, compact) {
  const groups = [...lotEntry.groups].sort((a, b) => Number(b.quantity) - Number(a.quantity)).slice(0, compact ? 3 : 5)
  const left = lot.sprite[0] / 1154 * 100
  const top = lot.sprite[1] / 1363 * 100
  return `<div class="herd-cluster ${compact ? 'compact' : ''}" style="left:${left}%;top:${top}%" data-lot="${lot.id}">${groups.map((group, index) => {
    const category = categoryLookup[group.categoryId] || CATEGORIES[0]
    const asset = index % 2 && category.asset.includes('black') ? category.asset.replace('black','red') : category.asset
    return `<img src="./assets/${asset}" alt="${esc(category.short)}" style="--i:${index}">`
  }).join('')}</div>`
}

function renderMapPage() {
  const survey = selectedSurvey()
  const metrics = surveyMetrics(survey)
  const lot = ui.selectedLotId ? lotLookup[ui.selectedLotId] : null
  const lotEntry = lot ? survey.lots.find((entry) => entry.lotId === lot.id) : null
  const metric = lot ? metrics.byLot[lot.id] : null
  const side = lot ? `<aside class="lot-inspector">
    <button class="inspector-close" data-close-lot>${icon('close',20)}</button>
    <span class="eyebrow">Lote seleccionado</span><h2>${lot.name}</h2><p>${lot.hectares} hectáreas</p>
    <div class="lot-stat-grid"><div><small>Animales</small><strong>${fmt(metric.animals)}</strong></div><div><small>Carga</small><strong>${decimal(metric.load)} EV/ha</strong></div></div>
    <div class="load-meter"><i class="${capacityClass(metric.load)}" style="width:${Math.min(100, metric.capacityUse * 100)}%"></i></div>
    <p class="capacity-caption">${Math.round(metric.capacityUse * 100)}% del objetivo de carga</p>
    <h3>Composición</h3>
    <div class="group-list">${lotEntry?.groups?.length ? lotEntry.groups.map((group) => `<div><img src="./assets/${categoryLookup[group.categoryId]?.asset || 'cow-black.png'}"><span>${esc(categoryLookup[group.categoryId]?.short || group.categoryId)}${group.birthYear ? `<small>Nac. ${group.birthYear}</small>` : ''}</span><strong>${fmt(group.quantity)}</strong></div>`).join('') : '<p class="empty-inline">Sin animales en este relevamiento.</p>'}</div>
    <h3>Estado del campo</h3><div class="field-state-badge ${lotEntry?.fieldState || 'no-observado'}">${fieldStateLookup[lotEntry?.fieldState || 'no-observado']?.icon} ${fieldStateLookup[lotEntry?.fieldState || 'no-observado']?.label}</div>
  </aside>` : `<aside class="lot-inspector empty-inspector"><img src="./assets/cow-black.png"><h2>Elegí un lote</h2><p>Tocá cualquier lote para ver su ganado, carga y estado del campo.</p></aside>`
  return renderShell(`<div class="map-page-layout"><article class="panel full-map-panel">${renderMap(survey, false)}</article>${side}</div>`, 'Mapa del campo', `Relevamiento del ${dateLabel(survey.date)}`)
}

function startSurvey() {
  state.draft = {
    id: uid(),
    date: todayISO(),
    rainPeriod: monthKey(todayISO()),
    rainMm: state.rain.find((item) => item.period === monthKey(todayISO()))?.millimeters ?? '',
    lots: [],
    events: { births: 0, deaths: 0, purchases: 0, sales: 0 },
    note: '',
    step: 1,
  }
  ui.wizardStep = 1
  saveState()
  navigate('relevamiento')
}

function renderSurveyWizard() {
  const draft = state.draft
  if (!draft) {
    const content = `<section class="survey-intro"><div class="survey-intro-copy"><span class="eyebrow">Una fotografía del campo</span><h2>Nuevo relevamiento</h2><p>Cargá solamente los lotes que tienen animales. No necesitás completar una planilla ni registrar movimientos entre fechas.</p><ul><li>${icon('check',18)} Empezá de cero</li><li>${icon('check',18)} Agregá categorías presentes</li><li>${icon('check',18)} Revisá alertas sin bloquear el guardado</li></ul><button class="btn primary large" data-start-survey>${icon('plus',19)} Comenzar</button></div><div class="survey-intro-art"><img src="./assets/cow-black.png"><img src="./assets/calf-red.png"><img src="./assets/windmill-tank.png"></div></section>`
    return renderShell(content, 'Nuevo relevamiento', 'Carga simple para usuarios no técnicos')
  }
  const step = draft.step || ui.wizardStep || 1
  const stepper = `<div class="stepper"><span class="${step>=1?'done':''}"><i>1</i>Fecha y lluvia</span><span class="${step>=2?'done':''}"><i>2</i>Animales por lote</span><span class="${step>=3?'done':''}"><i>3</i>Resumen</span></div>`
  let body = ''
  if (step === 1) body = renderSurveyStepOne(draft)
  if (step === 2) body = renderSurveyStepTwo(draft)
  if (step === 3) body = renderSurveyStepThree(draft)
  return renderShell(`${stepper}${body}`, 'Nuevo relevamiento', 'Podés guardar una fotografía del campo cuando sea necesario', `<button class="btn ghost" data-cancel-survey>Cancelar</button>`)
}

function renderSurveyStepOne(draft) {
  return `<section class="wizard-card narrow"><div class="wizard-title"><span class="step-number">1</span><div><h2>¿Cuándo se hizo el relevamiento?</h2><p>Puede haber varios relevamientos en un mes o pasar más de un mes entre ellos.</p></div></div>
    <label class="field"><span>Fecha del relevamiento</span><div class="input-icon">${icon('calendar',18)}<input type="date" id="survey-date" value="${esc(draft.date)}"></div></label>
    <div class="soft-divider"></div>
    <div class="wizard-title compact"><span class="step-number water">${icon('rain',20)}</span><div><h3>Lluvia mensual</h3><p>Se guarda por mes, aunque hagas más de un relevamiento.</p></div></div>
    <label class="field"><span>Lluvia de ${monthLabel(draft.rainPeriod)}</span><div class="unit-input"><input type="number" min="0" inputmode="decimal" id="survey-rain" value="${esc(draft.rainMm)}" placeholder="Ej. 82"><b>mm</b></div></label>
    <p class="helper">Podés dejar este dato vacío y completarlo más tarde.</p>
    <div class="wizard-actions"><span></span><button class="btn primary large" data-step-one-next>Continuar ${icon('chevron',18)}</button></div>
  </section>`
}

function renderSurveyStepTwo(draft) {
  const total = draft.lots.reduce((sum, lot) => sum + lot.groups.reduce((a, group) => a + Number(group.quantity || 0), 0), 0)
  const cards = draft.lots.length ? draft.lots.map((lotEntry) => {
    const lot = lotLookup[lotEntry.lotId]
    const quantity = lotEntry.groups.reduce((sum, group) => sum + Number(group.quantity || 0), 0)
    const stateInfo = fieldStateLookup[lotEntry.fieldState] || fieldStateLookup['no-observado']
    return `<article class="loaded-lot-card"><div class="lot-card-number">${lot.shortName || lot.name.replace('ER-','')}</div><div class="loaded-lot-content"><div><h3>${lot.name}</h3><p>${fmt(quantity)} animales · ${lotEntry.groups.length} ${lotEntry.groups.length===1?'grupo':'grupos'}</p></div><span class="field-mini ${stateInfo.tone}">${stateInfo.icon} ${stateInfo.label}</span></div><div class="lot-card-actions"><button data-edit-draft-lot="${lot.id}" aria-label="Editar">${icon('edit',18)}</button><button data-remove-draft-lot="${lot.id}" aria-label="Eliminar">${icon('trash',18)}</button></div></article>`
  }).join('') : `<div class="empty-add"><img src="./assets/cow-black.png"><h3>Todavía no agregaste lotes</h3><p>Elegí el primer lote con animales y cargá solamente las categorías que están presentes.</p><button class="btn primary" data-add-draft-lot>${icon('plus',18)} Agregar lote con animales</button></div>`
  return `<section class="wizard-card wide"><div class="wizard-title"><span class="step-number">2</span><div><h2>Animales por lote</h2><p>Los lotes que no agregues quedarán registrados con cero animales.</p></div></div>
    <div class="loaded-summary"><div><small>Lotes cargados</small><strong>${draft.lots.length}</strong></div><div><small>Animales ingresados</small><strong>${fmt(total)}</strong></div><button class="btn secondary" data-add-draft-lot>${icon('plus',18)} Agregar lote</button></div>
    <div class="loaded-lots">${cards}</div>
    <div class="wizard-actions"><button class="btn ghost" data-wizard-back>${icon('back',18)} Atrás</button><button class="btn primary large" data-step-two-next ${draft.lots.length ? '' : 'disabled'}>Revisar resumen ${icon('chevron',18)}</button></div>
  </section>`
}

function draftAsSurvey(draft) {
  return { id: draft.id, date: draft.date, createdAt: new Date().toISOString(), rainPeriod: draft.rainPeriod, lots: draft.lots, events: draft.events, note: draft.note }
}

function renderSurveyStepThree(draft) {
  const survey = draftAsSurvey(draft)
  const metrics = surveyMetrics(survey)
  const alerts = discrepancyAlerts(survey)
  const loadAlerts = operationalAlerts(survey)
  const emptyLots = LOTS.filter((lot) => !draft.lots.some((item) => item.lotId === lot.id))
  return `<section class="wizard-card wide review-card"><div class="wizard-title"><span class="step-number">3</span><div><h2>Revisá y guardá</h2><p>Las alertas sirven para detectar posibles errores, pero no impiden guardar el relevamiento.</p></div></div>
    <div class="review-hero"><div><small>Fecha</small><strong>${dateLabel(draft.date)}</strong></div><div><small>Animales</small><strong>${fmt(metrics.animals)}</strong></div><div><small>Carga promedio</small><strong>${decimal(metrics.load)} EV/ha</strong></div><div><small>Lotes cargados</small><strong>${draft.lots.length} / 18</strong></div></div>
    <div class="review-grid">
      <article class="review-section"><h3>Totales por categoría</h3>${renderCategoryBars(metrics.categories, metrics.animals)}</article>
      <article class="review-section"><h3>Estado del campo</h3>${renderFieldStateSummary(draft)}</article>
    </div>
    <details class="optional-events"><summary>Eventos opcionales desde el relevamiento anterior</summary><p>Completá estos datos solo si los tenés. No se registran movimientos entre lotes en esta versión.</p><div class="event-grid"><label>Nacimientos<input type="number" min="0" data-event-field="births" value="${draft.events.births || 0}"></label><label>Mortandad<input type="number" min="0" data-event-field="deaths" value="${draft.events.deaths || 0}"></label><label>Compras<input type="number" min="0" data-event-field="purchases" value="${draft.events.purchases || 0}"></label><label>Ventas<input type="number" min="0" data-event-field="sales" value="${draft.events.sales || 0}"></label></div></details>
    <section class="review-alerts"><div class="panel-head"><h3>Alertas de revisión</h3><span>${alerts.length + loadAlerts.length}</span></div>${alerts.length || loadAlerts.length ? `<div class="alert-list">${[...alerts,...loadAlerts].map(renderAlert).join('')}</div>` : '<div class="empty-inline success">No detectamos discrepancias importantes.</div>'}</section>
    <details class="empty-lots"><summary>${emptyLots.length} lotes quedarán con 0 animales</summary><div>${emptyLots.map((lot) => `<span>${lot.name}</span>`).join('')}</div></details>
    <label class="field"><span>Nota general (opcional)</span><textarea id="survey-note" rows="3" placeholder="Observaciones del relevamiento">${esc(draft.note || '')}</textarea></label>
    <div class="wizard-actions"><button class="btn ghost" data-wizard-back>${icon('back',18)} Volver a editar</button><button class="btn primary large" data-save-survey>${icon('check',18)} Confirmar y guardar</button></div>
  </section>`
}

function renderFieldStateSummary(draft) {
  const counts = Object.fromEntries(FIELD_STATES.map((item) => [item.id, 0]))
  draft.lots.forEach((lot) => counts[lot.fieldState || 'no-observado']++)
  return `<div class="field-summary">${FIELD_STATES.filter((item) => counts[item.id]).map((item) => `<div><span>${item.icon} ${item.label}</span><strong>${counts[item.id]}</strong></div>`).join('')}</div>`
}

function renderModal() {
  if (ui.modal.type === 'lot-form') return renderLotFormModal()
  if (ui.modal.type === 'survey-detail') return renderSurveyDetailModal()
  if (ui.modal.type === 'confirm-reset') return `<div class="modal-backdrop"><div class="modal small"><button class="modal-close" data-close-modal>${icon('close')}</button><h2>Restablecer datos de demostración</h2><p>Se eliminarán los relevamientos guardados en este dispositivo.</p><div class="modal-actions"><button class="btn ghost" data-close-modal>Cancelar</button><button class="btn danger" data-confirm-reset>Restablecer</button></div></div></div>`
  return ''
}

function renderLotFormModal() {
  const modal = ui.modal
  const draft = modal.lot
  const available = LOTS.filter((lot) => lot.id === draft.lotId || !state.draft.lots.some((item) => item.lotId === lot.id))
  const groups = draft.groups.map((group, index) => `<div class="animal-group-row" data-group-index="${index}"><div class="group-main"><label><span>Categoría</span><select data-group-category="${index}"><option value="">Elegir categoría</option>${CATEGORIES.map((category) => `<option value="${category.id}" ${group.categoryId===category.id?'selected':''}>${category.name}</option>`).join('')}</select></label><label class="quantity-field"><span>Cantidad</span><input type="number" inputmode="numeric" min="0" data-group-quantity="${index}" value="${esc(group.quantity)}" placeholder="0"></label><button class="icon-button remove-group" data-remove-group="${index}" aria-label="Eliminar grupo">${icon('trash',18)}</button></div><details ${group.birthYear || group.notes ? 'open' : ''}><summary>Agregar detalle opcional</summary><div class="group-details"><label><span>Año de nacimiento</span><input type="number" min="1990" max="2030" data-group-year="${index}" value="${esc(group.birthYear || '')}" placeholder="Ej. 2025"></label><label><span>Nota</span><input type="text" data-group-notes="${index}" value="${esc(group.notes || '')}" placeholder="Ej. Listas para servicio"></label></div></details></div>`).join('')
  return `<div class="modal-backdrop"><div class="modal lot-modal"><button class="modal-close" data-close-modal>${icon('close')}</button><span class="eyebrow">Lote con animales</span><h2>${modal.isEdit ? 'Editar lote' : 'Agregar lote'}</h2><label class="field"><span>Lote</span><select id="modal-lot-select" ${modal.isEdit?'disabled':''}><option value="">Elegir lote</option>${available.map((lot) => `<option value="${lot.id}" ${draft.lotId===lot.id?'selected':''}>${lot.name} · ${lot.hectares} ha</option>`).join('')}</select></label><div class="modal-section-head"><div><h3>Grupos de animales</h3><p>Podés repetir una categoría con distintos años de nacimiento.</p></div><button class="btn secondary small" data-add-group>${icon('plus',17)} Agregar categoría</button></div><div class="animal-groups">${groups}</div><div class="modal-section-head field-head"><div><h3>Estado del campo</h3><p>Elegí la opción que mejor representa lo observado.</p></div></div><div class="field-state-options">${FIELD_STATES.map((item) => `<button class="field-state-option ${draft.fieldState===item.id?'selected':''}" data-field-state="${item.id}"><span>${item.icon}</span><strong>${item.label}</strong></button>`).join('')}</div><div class="modal-actions"><button class="btn ghost" data-close-modal>Cancelar</button><button class="btn primary" data-save-draft-lot>Guardar lote</button></div></div></div>`
}

function renderHistory() {
  const surveys = sortedSurveys()
  const rainRows = [...state.rain].sort((a, b) => b.period.localeCompare(a.period))
  const maxAnimals = Math.max(...surveys.map((survey) => surveyMetrics(survey).animals), 1)
  const content = `<section class="history-header"><div><span class="eyebrow">Fotografías del campo</span><h2>Historial de relevamientos</h2><p>Compará fechas aunque no tengan una frecuencia mensual fija.</p></div><button class="btn primary" data-start-survey>${icon('plus',18)} Nuevo relevamiento</button></section><section class="history-grid"><article class="panel"><div class="panel-head"><h3>Evolución de animales</h3><span>${surveys.length} relevamientos</span></div><div class="survey-chart">${[...surveys].reverse().map((survey) => { const m=surveyMetrics(survey); return `<button data-detail-survey="${survey.id}" title="${dateLabel(survey.date)}"><i style="height:${Math.max(8,m.animals/maxAnimals*100)}%"></i><span>${fmt(m.animals)}</span><small>${survey.date.slice(5)}</small></button>` }).join('')}</div></article><article class="panel"><div class="panel-head"><h3>Registro de lluvia mensual</h3><button class="btn secondary small" data-add-rain>${icon('plus',16)} Agregar mes</button></div><div class="rain-table">${rainRows.map((item) => { const analysis=rainAnalysis(item.period); return `<div><span><strong>${monthLabel(item.period)}</strong><small>${analysis.status}</small></span><b>${fmt(item.millimeters)} mm</b><button data-edit-rain="${item.period}">${icon('edit',16)}</button></div>` }).join('')}</div></article></section><section class="panel survey-list-panel"><div class="panel-head"><h3>Todos los relevamientos</h3></div><div class="survey-list">${surveys.map((survey,index)=>{ const m=surveyMetrics(survey); const prior=previousSurvey(survey); const diff=prior?m.animals-surveyMetrics(prior).animals:null; return `<button class="survey-row" data-detail-survey="${survey.id}"><span class="survey-index">${surveys.length-index}</span><div><strong>${dateLabel(survey.date)}</strong><p>${survey.lots.length} lotes con animales · ${decimal(m.load)} EV/ha</p></div><div class="survey-total"><strong>${fmt(m.animals)}</strong><small>${diff==null?'Inicial':`${diff>=0?'+':''}${fmt(diff)} vs. anterior`}</small></div>${icon('chevron',18)}</button>` }).join('')}</div></section>`
  return renderShell(content, 'Histórico y lluvia', 'Relevamientos por fecha y lluvia por mes')
}

function renderSurveyDetailModal() {
  const survey = state.surveys.find((item) => item.id === ui.modal.surveyId)
  if (!survey) return ''
  const m = surveyMetrics(survey)
  const alerts = discrepancyAlerts(survey)
  return `<div class="modal-backdrop"><div class="modal detail-modal"><button class="modal-close" data-close-modal>${icon('close')}</button><span class="eyebrow">Relevamiento guardado</span><h2>${dateLabel(survey.date)}</h2><div class="review-hero"><div><small>Animales</small><strong>${fmt(m.animals)}</strong></div><div><small>Carga</small><strong>${decimal(m.load)} EV/ha</strong></div><div><small>Lotes</small><strong>${survey.lots.length}</strong></div></div>${renderCategoryBars(m.categories,m.animals)}${alerts.length?`<h3>Diferencias detectadas</h3><div class="alert-list">${alerts.map(renderAlert).join('')}</div>`:''}<div class="modal-actions"><button class="btn secondary" data-export-survey="${survey.id}">Exportar CSV</button><button class="btn primary" data-select-survey="${survey.id}" data-close-after>Ver en el mapa</button></div></div></div>`
}

function renderDataPage() {
  const content = `<section class="data-page-grid"><article class="panel data-card"><span class="data-icon">${icon('download',26)}</span><h2>Exportar datos</h2><p>Descargá el último relevamiento o el historial completo en formato CSV.</p><div class="stack-buttons"><button class="btn primary" data-export-latest>Último relevamiento CSV</button><button class="btn secondary" data-export-all>Historial completo CSV</button></div></article><article class="panel data-card"><span class="data-icon">${icon('clipboard',26)}</span><h2>Respaldo completo</h2><p>El respaldo JSON conserva relevamientos, lluvia y configuración local.</p><div class="stack-buttons"><button class="btn primary" data-export-backup>Descargar respaldo</button><label class="btn secondary file-button">Restaurar respaldo<input type="file" id="import-backup" accept="application/json"></label></div></article><article class="panel data-card warning-card"><span class="data-icon">${icon('alert',26)}</span><h2>Datos locales</h2><p>La URL comparte la aplicación, pero cada dispositivo conserva su propia información hasta implementar Supabase.</p><button class="btn danger-outline" data-reset-demo>Restablecer demo</button></article></section>`
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
  const rows = [['fecha','lote','hectareas','estado_campo','categoria','cantidad','anio_nacimiento','nota']]
  for (const lotEntry of survey.lots) {
    const lot = lotLookup[lotEntry.lotId]
    for (const group of lotEntry.groups) rows.push([survey.date, lot.name, lot.hectares, fieldStateLookup[lotEntry.fieldState]?.label || '', categoryLookup[group.categoryId]?.name || group.categoryId, group.quantity, group.birthYear || '', group.notes || ''])
  }
  return rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"','""')}"`).join(',')).join('\n')
}

function allCsv() {
  const rows = [['fecha','lote','hectareas','estado_campo','categoria','cantidad','anio_nacimiento','nota']]
  for (const survey of sortedSurveys().reverse()) {
    for (const lotEntry of survey.lots) {
      const lot = lotLookup[lotEntry.lotId]
      for (const group of lotEntry.groups) rows.push([survey.date, lot.name, lot.hectares, fieldStateLookup[lotEntry.fieldState]?.label || '', categoryLookup[group.categoryId]?.name || group.categoryId, group.quantity, group.birthYear || '', group.notes || ''])
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
  document.querySelectorAll('[data-map-lot]').forEach((element) => element.addEventListener('click', () => { ui.selectedLotId = element.dataset.mapLot; if (ui.view !== 'mapa') navigate('mapa'); else render() }))
  document.querySelectorAll('[data-lot]').forEach((element) => element.addEventListener('click', () => { ui.selectedLotId=element.dataset.lot; navigate('mapa') }))
  document.querySelectorAll('[data-close-lot]').forEach((button) => button.addEventListener('click', () => { ui.selectedLotId=null; render() }))
  document.querySelectorAll('[data-select-survey]').forEach((button) => button.addEventListener('click', () => { state.selectedSurveyId=button.dataset.selectSurvey; saveState(); if (button.dataset.closeAfter !== undefined) { ui.modal=null; navigate('mapa') } else render() }))
  document.querySelectorAll('[data-detail-survey]').forEach((button) => button.addEventListener('click', () => { ui.modal={type:'survey-detail',surveyId:button.dataset.detailSurvey}; render() }))
  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => { ui.modal=null; render() }))
  document.querySelectorAll('[data-cancel-survey]').forEach((button) => button.addEventListener('click', () => { if(confirm('¿Cancelar este relevamiento? Se perderá el borrador.')) { state.draft=null; saveState(); navigate('resumen') } }))
  const dateInput = document.getElementById('survey-date')
  if (dateInput) dateInput.addEventListener('change', (event) => { state.draft.date=event.target.value; state.draft.rainPeriod=monthKey(event.target.value); state.draft.rainMm=state.rain.find((item)=>item.period===state.draft.rainPeriod)?.millimeters ?? ''; saveState(); render() })
  const rainInput = document.getElementById('survey-rain')
  if (rainInput) rainInput.addEventListener('input', (event) => { state.draft.rainMm=event.target.value; saveState() })
  document.querySelectorAll('[data-step-one-next]').forEach((button) => button.addEventListener('click', () => { if(!state.draft.date) return alert('Elegí una fecha.'); state.draft.step=2; saveState(); render() }))
  document.querySelectorAll('[data-wizard-back]').forEach((button) => button.addEventListener('click', () => { state.draft.step=Math.max(1,(state.draft.step||1)-1); saveState(); render() }))
  document.querySelectorAll('[data-step-two-next]').forEach((button) => button.addEventListener('click', () => { state.draft.step=3; saveState(); render() }))
  document.querySelectorAll('[data-add-draft-lot]').forEach((button) => button.addEventListener('click', () => { ui.modal={type:'lot-form',isEdit:false,lot:{lotId:'',fieldState:'no-observado',groups:[{id:uid(),categoryId:'',quantity:'',birthYear:'',notes:''}]}}; render() }))
  document.querySelectorAll('[data-edit-draft-lot]').forEach((button) => button.addEventListener('click', () => { const existing=state.draft.lots.find((item)=>item.lotId===button.dataset.editDraftLot); ui.modal={type:'lot-form',isEdit:true,lot:JSON.parse(JSON.stringify(existing))}; render() }))
  document.querySelectorAll('[data-remove-draft-lot]').forEach((button) => button.addEventListener('click', () => { if(confirm(`¿Eliminar ${lotLookup[button.dataset.removeDraftLot].name} del relevamiento?`)){state.draft.lots=state.draft.lots.filter((item)=>item.lotId!==button.dataset.removeDraftLot);saveState();render()} }))
  document.querySelectorAll('[data-add-group]').forEach((button) => button.addEventListener('click', () => { ui.modal.lot.groups.push({id:uid(),categoryId:'',quantity:'',birthYear:'',notes:''}); render() }))
  document.querySelectorAll('[data-remove-group]').forEach((button) => button.addEventListener('click', () => { if(ui.modal.lot.groups.length===1) return; ui.modal.lot.groups.splice(Number(button.dataset.removeGroup),1); render() }))
  document.querySelectorAll('[data-field-state]').forEach((button) => button.addEventListener('click', () => { ui.modal.lot.fieldState=button.dataset.fieldState; render() }))
  document.querySelectorAll('[data-group-category],[data-group-quantity],[data-group-year],[data-group-notes]').forEach((input) => input.addEventListener('input', (event) => renderLotFormModalEventUpdate(event.target)))
  document.querySelectorAll('[data-save-draft-lot]').forEach((button) => button.addEventListener('click', () => {
    const select=document.getElementById('modal-lot-select'); if(select) ui.modal.lot.lotId=select.value
    const validGroups=ui.modal.lot.groups.filter((group)=>group.categoryId && Number(group.quantity)>0).map((group)=>({...group,quantity:Math.round(Number(group.quantity)),birthYear:group.birthYear?Number(group.birthYear):'',notes:String(group.notes||'').trim()}))
    if(!ui.modal.lot.lotId) return alert('Elegí un lote.')
    if(!validGroups.length) return alert('Agregá al menos una categoría con cantidad.')
    const saved={...ui.modal.lot,groups:validGroups}
    state.draft.lots=ui.modal.isEdit ? state.draft.lots.map((item)=>item.lotId===saved.lotId?saved:item) : [...state.draft.lots,saved]
    ui.modal=null; saveState(); render()
  }))
  document.querySelectorAll('[data-event-field]').forEach((input) => input.addEventListener('input', (event) => { state.draft.events[event.target.dataset.eventField]=Math.max(0,Number(event.target.value)||0); saveState() }))
  const note=document.getElementById('survey-note'); if(note) note.addEventListener('input',(event)=>{state.draft.note=event.target.value;saveState()})
  document.querySelectorAll('[data-save-survey]').forEach((button) => button.addEventListener('click', () => {
    const draft=state.draft; const survey=draftAsSurvey(draft)
    state.surveys.push(survey); state.selectedSurveyId=survey.id
    if(draft.rainMm !== '' && draft.rainMm != null){ const mm=Math.max(0,Number(draft.rainMm)||0); state.rain=[...state.rain.filter((item)=>item.period!==draft.rainPeriod),{period:draft.rainPeriod,millimeters:mm}].sort((a,b)=>a.period.localeCompare(b.period)) }
    state.draft=null; saveState(); showToast('Relevamiento guardado'); setTimeout(()=>navigate('resumen'),400)
  }))
  document.querySelectorAll('[data-export-latest]').forEach((button)=>button.addEventListener('click',()=>{const survey=selectedSurvey();download(`campo-${survey.date}.csv`,surveyCsv(survey),'text/csv;charset=utf-8')}))
  document.querySelectorAll('[data-export-all]').forEach((button)=>button.addEventListener('click',()=>download('campo-historial.csv',allCsv(),'text/csv;charset=utf-8')))
  document.querySelectorAll('[data-export-survey]').forEach((button)=>button.addEventListener('click',()=>{const survey=state.surveys.find((item)=>item.id===button.dataset.exportSurvey);download(`campo-${survey.date}.csv`,surveyCsv(survey),'text/csv;charset=utf-8')}))
  document.querySelectorAll('[data-export-backup]').forEach((button)=>button.addEventListener('click',()=>download(`campo-respaldo-${todayISO()}.json`,JSON.stringify(state,null,2),'application/json')))
  const importInput=document.getElementById('import-backup'); if(importInput) importInput.addEventListener('change', async(event)=>{const file=event.target.files[0];if(!file)return;try{const imported=JSON.parse(await file.text());if(imported.version!==APP_VERSION||!Array.isArray(imported.surveys))throw new Error('Formato no válido');state=imported;saveState();showToast('Respaldo restaurado');setTimeout(()=>navigate('resumen'),400)}catch(error){alert(`No se pudo importar: ${error.message}`)}})
  document.querySelectorAll('[data-reset-demo]').forEach((button)=>button.addEventListener('click',()=>{ui.modal={type:'confirm-reset'};render()}))
  document.querySelectorAll('[data-confirm-reset]').forEach((button)=>button.addEventListener('click',()=>{state=createInitialState();saveState();ui.modal=null;showToast('Datos restablecidos');setTimeout(()=>navigate('resumen'),300)}))
  document.querySelectorAll('[data-add-rain]').forEach((button)=>button.addEventListener('click',()=>editRain()))
  document.querySelectorAll('[data-edit-rain]').forEach((button)=>button.addEventListener('click',()=>editRain(button.dataset.editRain)))
}

function editRain(existingPeriod='') {
  const period=prompt('Mes de lluvia (AAAA-MM)',existingPeriod||monthKey(todayISO())); if(!period||!/^\d{4}-\d{2}$/.test(period)) return
  const existing=state.rain.find((item)=>item.period===period)?.millimeters ?? ''
  const value=prompt(`Milímetros de ${monthLabel(period)}`,existing); if(value==null)return
  const mm=Number(value); if(!Number.isFinite(mm)||mm<0)return alert('Ingresá un valor válido.')
  state.rain=[...state.rain.filter((item)=>item.period!==period),{period,millimeters:mm}].sort((a,b)=>a.period.localeCompare(b.period));saveState();render()
}

window.addEventListener('hashchange',()=>{ui.view=location.hash.replace('#/','')||'resumen';render()})
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))
render()
