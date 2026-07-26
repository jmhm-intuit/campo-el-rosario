import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const appPath = path.join(root, 'app.js')
const appElement = { innerHTML: '' }
const noop = () => {}
const localStore = new Map()
const documentStub = {
  getElementById(id) { if (id === 'app') return appElement; return null },
  querySelectorAll() { return [] },
  querySelector() { return null },
  createElement() { return { click: noop, set href(value) { this._href = value }, set download(value) { this._download = value } } },
}
const context = {
  console,
  document: documentStub,
  window: { addEventListener: noop, scrollTo: noop },
  navigator: {},
  location: { hash: '' },
  localStorage: {
    getItem(key) { return localStore.get(key) ?? null },
    setItem(key, value) { localStore.set(key, value) },
    removeItem(key) { localStore.delete(key) },
  },
  crypto: globalThis.crypto,
  Intl, Date, Math, JSON, Number, String, Array, Object, Set, Map, Blob,
  URL: { createObjectURL: () => 'blob:mock', revokeObjectURL: noop },
  setTimeout: () => 0,
  clearTimeout: noop,
  alert: noop,
  confirm: () => true,
  prompt: () => null,
}
context.globalThis = context
vm.createContext(context)

const rawSource = fs.readFileSync(appPath, 'utf8')
const source = rawSource + `\n;globalThis.__campoTest = {
  render, renderDashboard, renderMap, renderMapPage, renderHistory, renderDataPage,
  renderSurveyWizard, renderLotFormModal, renderRainModal, renderSurveyHistoryModal,
  startSurvey, editSurvey, draftAsSurvey, spriteCountForLot, dominantAnimalKind,
  sortedSurveys, resolveLotCondition, monthlyRainSummary, rainAnalysis,
  surveyMetrics, normalizeFieldState, state, ui, LOTS
};`
vm.runInContext(source, context, { filename: 'app.js' })
const api = context.__campoTest
const checks = []
const check = (condition, message) => { if (!condition) throw new Error(message); checks.push(message) }

check(appElement.innerHTML.includes('Campo v5.03'), 'La versión Campo v5.03 aparece en la interfaz')
check(appElement.innerHTML.includes('survey-navigator'), 'El selector visible de relevamientos está en la pantalla principal')
check(appElement.innerHTML.includes('Último disponible'), 'La fecha más reciente está identificada')
check(appElement.innerHTML.includes('condition-assumption-hatch'), 'El mapa distingue condiciones estimadas')
check(appElement.innerHTML.includes('lot-load-halo'), 'La carga animal se representa independientemente mediante halo')
check(appElement.innerHTML.includes('lot-load-border'), 'La carga animal incluye un borde sutil')
check(appElement.innerHTML.includes('map-label narrow'), 'Los lotes angostos usan etiquetas compactas')
check(!appElement.innerHTML.includes('map-condition-legend'), 'No se muestra una leyenda permanente de condiciones')
check(appElement.innerHTML.includes('kpi-cow-red-angus.png'), 'Existencias usa una vaca')
check(appElement.innerHTML.includes('kpi-cow-calf-red-angus.png'), 'Nacimientos usa vaca con cría')
check(appElement.innerHTML.includes('viewBox="0 0 1154 1363"'), 'El mapa mantiene el sistema maestro')
check(appElement.innerHTML.includes('Registro de lluvia'), 'El KPI de lluvia está visible')

check(!appElement.innerHTML.includes('Muy malo'), 'Muy malo ya no aparece como estado seleccionable')
check(appElement.innerHTML.includes('v503/pasture-excellent.png'), 'El mapa utiliza las nuevas texturas v5.03')
check(appElement.innerHTML.includes('animal-ground-shadow'), 'Cada animal incluye una sombra de contraste')
check(api.normalizeFieldState('muy-malo') === 'malo', 'Los registros Muy malo migran automáticamente a Malo')


const first = api.state.surveys[0]
api.editSurvey(first.id)
check(api.state.draft?.mode === 'edit', 'Un relevamiento existente entra en modo edición')
check(api.state.draft?.editingSurveyId === first.id, 'La edición conserva el identificador')
check(api.state.draft?.lots?.length === first.lots.length, 'La edición carga los lotes existentes')
const edited = api.draftAsSurvey(api.state.draft)
check(edited.id === first.id && edited.editedAt, 'La edición conserva ID y registra editedAt')

api.state.draft = null
api.state.surveys.push({ ...first, id: 'newer-test', date: '2026-08-02', createdAt: '2026-08-02T12:00:00.000Z', lots: [] })
api.state.selectedSurveyId = 'newer-test'
check(api.sortedSurveys()[0].id === 'newer-test', 'Los relevamientos se ordenan del más reciente al más antiguo')
const inferred = api.resolveLotCondition(api.state.surveys.find((item) => item.id === 'newer-test'), 'ER-01')
check(inferred.source === 'recent' && inferred.stateId === 'bueno', 'Se reutiliza una condición reciente del mismo lote dentro de 60 días')
check(inferred.explanation.includes('última observación'), 'La condición estimada explica su origen')

// An observed lot with zero animals remains a valid lot record.
const latest = api.state.surveys.find((item) => item.id === 'newer-test')
latest.lots = [{ lotId: 'ER-04', fieldState: 'bueno', conditionSource: 'observed', groups: [] }]
check(api.surveyMetrics(latest).byLot['ER-04'].animals === 0, 'Un lote observado puede guardarse con cero animales')
check(api.resolveLotCondition(latest, 'ER-04').source === 'observed', 'La condición de un lote vacío puede ser observada')

check(api.spriteCountForLot({}, { animals: 1 }, false) === 1, 'Un lote ocupado muestra al menos un sprite')
check(api.spriteCountForLot({}, { animals: 60 }, false) === 2, 'La escala visual es un sprite cada 30 animales')
check(api.spriteCountForLot({}, { animals: 500 }, false) === 8, 'La vista general limita a ocho sprites')
check(api.dominantAnimalKind({ groups: [{ categoryId: 'toros', quantity: 10 }, { categoryId: 'vacas', quantity: 40 }] }) === 'cow', 'La categoría dominante define un único tipo visual')

api.state.rainEntries.push({ id: 'rain-zero', date: '2026-08-01', millimeters: 0, note: 'Sin lluvia' })
api.state.rainEntries.push({ id: 'rain-ten', date: '2026-08-10', millimeters: 10, note: '' })
const rain = api.monthlyRainSummary('2026-08')
check(rain.source === 'daily' && rain.millimeters === 10 && rain.entries.length === 2, 'La lluvia diaria suma valores y conserva 0 mm como dato')
check(api.monthlyRainSummary('2026-09').millimeters === null, 'Un mes sin carga permanece sin información')

api.ui.modal = { type: 'lot-form', context: 'direct', surveyId: latest.id, isEdit: true, lot: latest.lots[0] }
check(api.renderLotFormModal().includes('Editar lote'), 'La edición directa del lote se renderiza desde el mapa')
api.ui.modal = { type: 'rain-manager', period: '2026-08', entryId: null }
check(api.renderRainModal().includes('Lluvia diaria'), 'El modal de lluvia diaria se renderiza')
api.ui.modal = { type: 'survey-history' }
check(api.renderSurveyHistoryModal().includes('Elegí un relevamiento'), 'El selector histórico por fecha se renderiza')
api.ui.modal = null

for (const view of ['resumen', 'mapa', 'historico', 'datos']) {
  api.ui.view = view
  api.render()
  check(appElement.innerHTML.length > 1000, `La vista ${view} se renderiza`)
}

console.log(`Smoke test Campo v5.03 aprobado (${checks.length} comprobaciones).`)
