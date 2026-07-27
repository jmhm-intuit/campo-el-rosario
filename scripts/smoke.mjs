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
  allocateVisualKinds, suggestedCategoryIds, suggestedCategoryGroups, lotFormModel,
  lotCategoryRollup, renderLotsSummaryTable, renderHerdSpritesHtml, renderMapLabelHtml,
  sortedSurveys, resolveLotCondition, monthlyRainSummary, rainAnalysis, surveyMetrics,
  normalizeFieldState, FIELD_STATES, CATEGORIES, state, ui, LOTS
};`
vm.runInContext(source, context, { filename: 'app.js' })
const api = context.__campoTest
const checks = []
const check = (condition, message) => { if (!condition) throw new Error(message); checks.push(message) }

check(appElement.innerHTML.includes('Campo v5.05'), 'La versión Campo v5.05 aparece en la interfaz')
check(appElement.innerHTML.includes('survey-navigator'), 'El selector visible de relevamientos está en la pantalla principal')
check(appElement.innerHTML.includes('lots-summary-table'), 'El resumen incluye la tabla compacta de todos los lotes')
check(appElement.innerHTML.includes('map-ui-overlay'), 'El mapa usa overlays HTML alineados para animales y etiquetas')
check(appElement.innerHTML.includes('map-animal-html'), 'Los animales mantienen un tamaño mínimo en pantalla')
check(appElement.innerHTML.includes('map-label-html'), 'Los nombres y cantidades usan etiquetas responsivas')
check(appElement.innerHTML.includes('v505/pasture-excellent.png'), 'El mapa usa las texturas finas v5.05')
check(appElement.innerHTML.includes('animals/v505/cow-red-angus.png'), 'El mapa usa los animales v5.05')
check(!appElement.innerHTML.includes('map-condition-legend'), 'No se muestra una leyenda permanente de condiciones')

const summaryMap = api.renderMap(api.state.surveys[0], true)
const fullMap = api.renderMap(api.state.surveys[0], false)
check(summaryMap.includes('summary-map'), 'El resumen usa un modo de mapa específico')
check(fullMap.includes('full-map'), 'La vista del mapa usa un modo detallado')
check(summaryMap.includes('compact-meta'), 'El resumen muestra solo lote, total y punto de carga')
check(fullMap.includes('map-condition-mini') && fullMap.includes('map-load-mini'), 'El mapa detallado muestra condición y carga juntas')

check(api.FIELD_STATES.filter((item) => item.id !== 'no-observado').length === 5, 'La app ofrece cinco condiciones visuales')
check(api.normalizeFieldState('muy-malo') === 'malo', 'Los registros Muy malo migran automáticamente a Malo')
check(api.CATEGORIES.some((item) => item.id === 'terneros-as'), 'Existe la categoría combinada Terneros/as')

const suggested = api.suggestedCategoryIds()
check(suggested.length === 4, 'Se sugieren cuatro categorías al iniciar una carga')
check(new Set(suggested).size === 4, 'Las cuatro categorías sugeridas son únicas')
const blankGroups = api.suggestedCategoryGroups()
check(blankGroups.length === 4 && blankGroups.every((group) => Number(group.quantity) === 0), 'Las categorías sugeridas aparecen con valor cero')
const emptyModel = api.lotFormModel({ lotId: 'ER-04', groups: [], fieldState: 'bueno' }, true)
check(emptyModel.groups.length === 4, 'Un lote nuevo o vacío abre con cuatro categorías editables')

const visualMix = api.allocateVisualKinds({ groups: [
  { categoryId: 'vacas', quantity: 60 },
  { categoryId: 'terneros-as', quantity: 30 },
  { categoryId: 'toros', quantity: 10 },
] }, 4)
check(visualMix.includes('cowCalf'), 'Vacas y terneros generan el asset compuesto cuando corresponde')
check(visualMix.includes('bull'), 'Los toros se conservan en una composición mixta')
check(visualMix.length === 4, 'La mezcla visual respeta la cantidad de slots disponible')

const rollup = api.lotCategoryRollup([
  { categoryId: 'vacas', quantity: 10 },
  { categoryId: 'vacas-descarte', quantity: 2 },
  { categoryId: 'terneros', quantity: 4 },
  { categoryId: 'terneras', quantity: 5 },
  { categoryId: 'terneros-as', quantity: 3 },
  { categoryId: 'toros', quantity: 1 },
])
check(rollup.cows === 12 && rollup.calves === 12 && rollup.bulls === 1, 'La tabla agrega vacas, terneros/as y toros correctamente')

const first = api.state.surveys[0]
api.editSurvey(first.id)
check(api.state.draft?.mode === 'edit', 'Un relevamiento existente entra en modo edición')
check(api.state.draft?.lots?.length === first.lots.length, 'La edición carga los lotes existentes')

api.state.draft = null
api.state.surveys.push({ ...first, id: 'newer-test', date: '2026-08-02', createdAt: '2026-08-02T12:00:00.000Z', lots: [] })
api.state.selectedSurveyId = 'newer-test'
check(api.sortedSurveys()[0].id === 'newer-test', 'Los relevamientos se ordenan del más reciente al más antiguo')
const inferred = api.resolveLotCondition(api.state.surveys.find((item) => item.id === 'newer-test'), 'ER-01')
check(inferred.source === 'recent' && inferred.stateId === 'bueno', 'Se reutiliza una condición reciente del mismo lote dentro de 60 días')

const latest = api.state.surveys.find((item) => item.id === 'newer-test')
latest.lots = [{ lotId: 'ER-04', fieldState: 'bueno', conditionSource: 'observed', groups: [] }]
check(api.surveyMetrics(latest).byLot['ER-04'].animals === 0, 'Un lote observado puede guardarse con cero animales')
check(api.resolveLotCondition(latest, 'ER-04').source === 'observed', 'La condición de un lote vacío puede ser observada')

check(api.spriteCountForLot({}, { animals: 1 }, false) === 1, 'Un lote ocupado muestra al menos un sprite')
check(api.spriteCountForLot({}, { animals: 60 }, true) === 2, 'Sesenta animales muestran dos sprites en el resumen')
check(api.spriteCountForLot({}, { animals: 500 }, true) === 3, 'El resumen limita a tres sprites por lote')
check(api.spriteCountForLot({}, { animals: 500 }, false) === 8, 'El mapa detallado limita a ocho sprites')

api.state.rainEntries.push({ id: 'rain-zero', date: '2026-08-01', millimeters: 0, note: 'Sin lluvia' })
api.state.rainEntries.push({ id: 'rain-ten', date: '2026-08-10', millimeters: 10, note: '' })
const rain = api.monthlyRainSummary('2026-08')
check(rain.source === 'daily' && rain.millimeters === 10 && rain.entries.length === 2, 'La lluvia diaria suma valores y conserva 0 mm como dato')

api.ui.modal = { type: 'lot-form', context: 'direct', surveyId: latest.id, isEdit: true, lot: api.lotFormModel(latest.lots[0], true) }
const lotModal = api.renderLotFormModal()
check(lotModal.includes('Las cuatro más frecuentes'), 'El formulario explica el orden dinámico de categorías')
check((lotModal.match(/data-group-category=/g) || []).length === 4, 'Un lote vacío muestra cuatro filas de categoría')
check(lotModal.includes('value="0"'), 'Las filas sugeridas comienzan en cero')
api.ui.modal = null

for (const view of ['resumen', 'mapa', 'historico', 'datos']) {
  api.ui.view = view
  api.render()
  check(appElement.innerHTML.length > 1000, `La vista ${view} se renderiza`)
}

console.log(`Smoke test Campo v5.05 aprobado (${checks.length} comprobaciones).`)
