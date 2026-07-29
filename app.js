import { animalAnimator } from './animal-animation.js'
import { resolveAnimalSprite } from './animal-sprite-library.js'

const STORAGE_KEY = 'campo-el-rosario-v2'
const APP_VERSION = 801
const APP_VERSION_LABEL = '8.01'
const RELEASE_DATE = '2026-07-28'
const TARGET_LOAD = 0.8
const CONDITION_RECENT_DAYS = 60

const RAIN_STATION = 'Laprida'
const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const RAIN_HISTORICAL_FORTNIGHTS = [
  {
    "month": 1,
    "monthName": "Enero",
    "half": 1,
    "period": "1–15",
    "average": 43.0,
    "p10": 19.8,
    "p90": 69.4
  },
  {
    "month": 1,
    "monthName": "Enero",
    "half": 2,
    "period": "16–fin de mes",
    "average": 45.8,
    "p10": 21.2,
    "p90": 74.1
  },
  {
    "month": 2,
    "monthName": "Febrero",
    "half": 1,
    "period": "1–15",
    "average": 52.5,
    "p10": 21.3,
    "p90": 75.5
  },
  {
    "month": 2,
    "monthName": "Febrero",
    "half": 2,
    "period": "16–28/29",
    "average": 46.4,
    "p10": 18.8,
    "p90": 66.8
  },
  {
    "month": 3,
    "monthName": "Marzo",
    "half": 1,
    "period": "1–15",
    "average": 44.3,
    "p10": 17.8,
    "p90": 73.7
  },
  {
    "month": 3,
    "monthName": "Marzo",
    "half": 2,
    "period": "16–fin de mes",
    "average": 47.3,
    "p10": 19.0,
    "p90": 78.7
  },
  {
    "month": 4,
    "monthName": "Abril",
    "half": 1,
    "period": "1–15",
    "average": 39.2,
    "p10": 9.9,
    "p90": 72.3
  },
  {
    "month": 4,
    "monthName": "Abril",
    "half": 2,
    "period": "16–fin de mes",
    "average": 39.2,
    "p10": 9.9,
    "p90": 72.3
  },
  {
    "month": 5,
    "monthName": "Mayo",
    "half": 1,
    "period": "1–15",
    "average": 25.7,
    "p10": 3.4,
    "p90": 58.3
  },
  {
    "month": 5,
    "monthName": "Mayo",
    "half": 2,
    "period": "16–fin de mes",
    "average": 27.5,
    "p10": 3.6,
    "p90": 62.2
  },
  {
    "month": 6,
    "monthName": "Junio",
    "half": 1,
    "period": "1–15",
    "average": 14.5,
    "p10": 1.2,
    "p90": 36.0
  },
  {
    "month": 6,
    "monthName": "Junio",
    "half": 2,
    "period": "16–fin de mes",
    "average": 14.5,
    "p10": 1.2,
    "p90": 36.0
  },
  {
    "month": 7,
    "monthName": "Julio",
    "half": 1,
    "period": "1–15",
    "average": 13.9,
    "p10": 0.5,
    "p90": 37.3
  },
  {
    "month": 7,
    "monthName": "Julio",
    "half": 2,
    "period": "16–fin de mes",
    "average": 14.9,
    "p10": 0.5,
    "p90": 39.7
  },
  {
    "month": 8,
    "monthName": "Agosto",
    "half": 1,
    "period": "1–15",
    "average": 19.3,
    "p10": 1.9,
    "p90": 44.5
  },
  {
    "month": 8,
    "monthName": "Agosto",
    "half": 2,
    "period": "16–fin de mes",
    "average": 20.6,
    "p10": 2.1,
    "p90": 47.5
  },
  {
    "month": 9,
    "monthName": "Septiembre",
    "half": 1,
    "period": "1–15",
    "average": 28.1,
    "p10": 8.7,
    "p90": 55.2
  },
  {
    "month": 9,
    "monthName": "Septiembre",
    "half": 2,
    "period": "16–fin de mes",
    "average": 28.1,
    "p10": 8.7,
    "p90": 55.2
  },
  {
    "month": 10,
    "monthName": "Octubre",
    "half": 1,
    "period": "1–15",
    "average": 40.2,
    "p10": 16.7,
    "p90": 65.1
  },
  {
    "month": 10,
    "monthName": "Octubre",
    "half": 2,
    "period": "16–fin de mes",
    "average": 42.8,
    "p10": 17.8,
    "p90": 69.4
  },
  {
    "month": 11,
    "monthName": "Noviembre",
    "half": 1,
    "period": "1–15",
    "average": 41.5,
    "p10": 16.7,
    "p90": 67.5
  },
  {
    "month": 11,
    "monthName": "Noviembre",
    "half": 2,
    "period": "16–fin de mes",
    "average": 41.5,
    "p10": 16.7,
    "p90": 67.5
  },
  {
    "month": 12,
    "monthName": "Diciembre",
    "half": 1,
    "period": "1–15",
    "average": 36.9,
    "p10": 14.0,
    "p90": 64.4
  },
  {
    "month": 12,
    "monthName": "Diciembre",
    "half": 2,
    "period": "16–fin de mes",
    "average": 39.3,
    "p10": 15.0,
    "p90": 68.6
  }
]

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

const CATEGORY_FAMILIES = [
  { id: 'vacas', label: 'Vacas' },
  { id: 'vaquillonas', label: 'Vaquillonas' },
  { id: 'terneros', label: 'Terneros/as' },
  { id: 'toros', label: 'Toros' },
  { id: 'novillos', label: 'Novillos' },
]

const CATEGORIES = [
  { id: 'vacas-cria', parent: 'vacas', name: 'Vaca de cría', short: 'Vaca cría', factor: 1, kind: 'cow' },
  { id: 'vacas-descarte', parent: 'vacas', name: 'Vaca de descarte', short: 'Vaca descarte', factor: 1, kind: 'cow' },
  { id: 'vaquillonas-reposicion', parent: 'vaquillonas', name: 'Vaquillona de reposición', short: 'Vaq. reposición', factor: 1, kind: 'cow' },
  { id: 'vaquillonas-primer-servicio', parent: 'vaquillonas', name: 'Vaquillona de primer servicio', short: 'Vaq. 1er servicio', factor: 1, kind: 'cow' },
  { id: 'ternero-macho', parent: 'terneros', name: 'Ternero macho', short: 'Ternero', factor: 0.5, kind: 'calf' },
  { id: 'ternera-hembra', parent: 'terneros', name: 'Ternera hembra', short: 'Ternera', factor: 0.5, kind: 'calf' },
  { id: 'ternero-sin-definir', parent: 'terneros', name: 'Ternero/a sin definir', short: 'Tern. s/def.', factor: 0.5, kind: 'calf' },
  { id: 'toro-reproductor', parent: 'toros', name: 'Toro reproductor', short: 'Toro', factor: 1.25, kind: 'bull' },
  { id: 'torito', parent: 'toros', name: 'Torito', short: 'Torito', factor: 1, kind: 'bull' },
  { id: 'novillito', parent: 'novillos', name: 'Novillito', short: 'Novillito', factor: 1, kind: 'bull' },
  { id: 'novillo', parent: 'novillos', name: 'Novillo', short: 'Novillo', factor: 1, kind: 'bull' },
]

const CATEGORY_MIGRATION = {
  vacas: 'vacas-cria',
  'vacas-descarte': 'vacas-descarte',
  'hembras-no-cria': 'vacas-descarte',
  vaquillonas: 'vaquillonas-reposicion',
  terneros: 'ternero-macho',
  terneras: 'ternera-hembra',
  'terneros-as': 'ternero-sin-definir',
  toros: 'toro-reproductor',
  'machos-recria': 'novillito',
  otros: 'vacas-descarte',
}

const EVENT_TYPES = [
  { id: 'sale', label: 'Venta', group: 'commercial', sign: -1, icon: '↗' },
  { id: 'purchase', label: 'Compra', group: 'commercial', sign: 1, icon: '↙' },
  { id: 'death', label: 'Mortandad', group: 'herd', sign: -1, icon: '✚' },
  { id: 'birth', label: 'Nacimiento', group: 'herd', sign: 1, icon: '●' },
  { id: 'reclassification', label: 'Recategorización', group: 'herd', sign: 0, icon: '⇄' },
]


const DEFAULT_CATEGORY_IDS = ['vacas-cria', 'ternero-sin-definir', 'toro-reproductor', 'vaquillonas-reposicion']

const SPRITE_VARIANTS = {
  "cow": {
    "north": [
      "animals/v601/cow/cow-north-1.png",
      "animals/v601/cow/cow-north-2.png",
      "animals/v601/cow/cow-north-3.png",
      "animals/v601/cow/cow-north-4.png"
    ],
    "east": [
      "animals/v601/cow/cow-east-1.png",
      "animals/v601/cow/cow-east-2.png",
      "animals/v601/cow/cow-east-3.png",
      "animals/v601/cow/cow-east-4.png"
    ],
    "south": [
      "animals/v601/cow/cow-south-1.png",
      "animals/v601/cow/cow-south-2.png",
      "animals/v601/cow/cow-south-3.png",
      "animals/v601/cow/cow-south-4.png"
    ],
    "west": [
      "animals/v601/cow/cow-west-1.png",
      "animals/v601/cow/cow-west-2.png",
      "animals/v601/cow/cow-west-3.png",
      "animals/v601/cow/cow-west-4.png"
    ]
  },
  "bull": {
    "north": [
      "animals/v601/bull/bull-north-1.png",
      "animals/v601/bull/bull-north-2.png",
      "animals/v601/bull/bull-north-3.png",
      "animals/v601/bull/bull-north-4.png"
    ],
    "east": [
      "animals/v601/bull/bull-east-1.png",
      "animals/v601/bull/bull-east-2.png",
      "animals/v601/bull/bull-east-3.png",
      "animals/v601/bull/bull-east-4.png"
    ],
    "south": [
      "animals/v601/bull/bull-south-1.png",
      "animals/v601/bull/bull-south-2.png",
      "animals/v601/bull/bull-south-3.png",
      "animals/v601/bull/bull-south-4.png"
    ],
    "west": [
      "animals/v601/bull/bull-west-1.png",
      "animals/v601/bull/bull-west-2.png",
      "animals/v601/bull/bull-west-3.png",
      "animals/v601/bull/bull-west-4.png"
    ]
  },
  "calf": {
    "north": [
      "animals/v601/calf/calf-north-1.png",
      "animals/v601/calf/calf-north-2.png",
      "animals/v601/calf/calf-north-3.png",
      "animals/v601/calf/calf-north-4.png"
    ],
    "east": [
      "animals/v601/calf/calf-east-1.png",
      "animals/v601/calf/calf-east-2.png",
      "animals/v601/calf/calf-east-3.png",
      "animals/v601/calf/calf-east-4.png"
    ],
    "south": [
      "animals/v601/calf/calf-south-1.png",
      "animals/v601/calf/calf-south-2.png",
      "animals/v601/calf/calf-south-3.png",
      "animals/v601/calf/calf-south-4.png"
    ],
    "west": [
      "animals/v601/calf/calf-west-1.png",
      "animals/v601/calf/calf-west-2.png",
      "animals/v601/calf/calf-west-3.png",
      "animals/v601/calf/calf-west-4.png"
    ]
  },
  "cowCalf": {
    "north": [
      "animals/v601/cow-calf/cow-calf-north-1.png",
      "animals/v601/cow-calf/cow-calf-north-2.png",
      "animals/v601/cow-calf/cow-calf-north-3.png",
      "animals/v601/cow-calf/cow-calf-north-4.png"
    ],
    "east": [
      "animals/v601/cow-calf/cow-calf-east-1.png",
      "animals/v601/cow-calf/cow-calf-east-2.png",
      "animals/v601/cow-calf/cow-calf-east-3.png",
      "animals/v601/cow-calf/cow-calf-east-4.png"
    ],
    "south": [
      "animals/v601/cow-calf/cow-calf-south-1.png",
      "animals/v601/cow-calf/cow-calf-south-2.png",
      "animals/v601/cow-calf/cow-calf-south-3.png",
      "animals/v601/cow-calf/cow-calf-south-4.png"
    ],
    "west": [
      "animals/v601/cow-calf/cow-calf-west-1.png",
      "animals/v601/cow-calf/cow-calf-west-2.png",
      "animals/v601/cow-calf/cow-calf-west-3.png",
      "animals/v601/cow-calf/cow-calf-west-4.png"
    ]
  }
}

const FIELD_STATES = [
  { id: 'muy-bueno', label: 'Muy bueno', short: 'Muy b.', tone: 'excellent', pattern: 'v505/pasture-excellent.png', indicator: 'condition-indicator-excellent.png' },
  { id: 'bueno', label: 'Bueno', short: 'Bueno', tone: 'good', pattern: 'v505/pasture-good.png', indicator: 'condition-indicator-good.png' },
  { id: 'regular', label: 'Regular', short: 'Regular', tone: 'regular', pattern: 'v505/pasture-regular.png', indicator: 'condition-indicator-regular.png' },
  { id: 'malo', label: 'Malo', short: 'Malo', tone: 'poor', pattern: 'v505/pasture-poor.png', indicator: 'condition-indicator-poor.png' },
  { id: 'anegado', label: 'Anegado', short: 'Aneg.', tone: 'flooded', pattern: 'v505/pasture-waterlogged.png', indicator: 'condition-indicator-flooded.png' },
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

const SAMPLE_DATA_URL = './data/campo-muestra-16-meses-v8.json'

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
  if (window.CAMPO_SAMPLE_STATE) {
    const sample = JSON.parse(JSON.stringify(window.CAMPO_SAMPLE_STATE))
    sample.version = APP_VERSION
    sample.sampleMode = true
    sample.settings = { userName: 'Muestra', establishment: 'El Rosario', introSeen: false, showArchived: false, ...(sample.settings || {}) }
    sample.updatedAt = new Date().toISOString()
    sample.lastSavedAt = sample.updatedAt
    return sample
  }
  const survey = {
    id: uid(), nombre: 'Muestra', date: '2026-07-15', createdAt: '2026-07-15T18:00:00.000Z', rainPeriod: '2026-07', archived: false,
    lots: Object.entries(INITIAL_GROUPS).map(([lotId, value]) => ({
      nombre: 'Muestra', lotId, fieldState: value.fieldState, conditionSource: 'observed',
      groups: value.groups.map(([categoryId, quantity]) => ({ id: uid(), nombre: 'Muestra', categoryId: CATEGORY_MIGRATION[categoryId] || categoryId, quantity, birthYear: '', notes: '' })),
    })),
    events: { nombre: 'Muestra', births: 0, deaths: 5, purchases: 0, sales: 0 }, note: 'Relevamiento inicial de muestra.',
  }
  return {
    nombre: 'Muestra', version: APP_VERSION, selectedSurveyId: survey.id, surveys: [survey], animalEvents: [], sampleMode: true,
    rain: [{ period: '2026-07', millimeters: 82 }], rainEntries: [], draft: null,
    settings: { nombre: 'Muestra', userName: 'Muestra', establishment: 'El Rosario', introSeen: false, showArchived: false },
    updatedAt: new Date().toISOString(), lastSavedAt: new Date().toISOString(),
  }
}

function migrateState(parsed) {
  if (!parsed || !Array.isArray(parsed.surveys)) return null
  const migrateCategoryId = (id) => categoryLookup[id] ? id : (CATEGORY_MIGRATION[id] || 'vacas-descarte')
  const normalizeGroup = (group) => ({
    ...group,
    id: group.id || uid(),
    nombre: group.nombre || parsed.nombre || 'Muestra',
    categoryId: migrateCategoryId(group.categoryId),
    quantity: Math.max(0, Number(group.quantity) || 0),
    birthYear: group.birthYear || '',
    notes: group.notes || '',
  })
  const normalizeLot = (lot) => {
    const fieldState = normalizeFieldState(lot.fieldState)
    return {
      ...lot,
      nombre: lot.nombre || parsed.nombre || 'Muestra',
      fieldState,
      conditionSource: lot.conditionSource || (fieldState !== 'no-observado' ? 'observed' : 'unobserved'),
      groups: Array.isArray(lot.groups) ? lot.groups.map(normalizeGroup) : [],
    }
  }
  const normalizeEvent = (event) => ({
    ...event,
    id: event.id || uid(),
    nombre: event.nombre || parsed.nombre || 'Muestra',
    type: EVENT_TYPES.some((item) => item.id === event.type) ? event.type : 'sale',
    categoryId: event.categoryId ? migrateCategoryId(event.categoryId) : '',
    toCategoryId: event.toCategoryId ? migrateCategoryId(event.toCategoryId) : '',
    quantity: Math.max(0, Number(event.quantity) || 0),
    notes: event.notes || '',
  })
  const migrated = {
    ...parsed,
    nombre: parsed.nombre || 'Muestra',
    version: APP_VERSION,
    surveys: parsed.surveys.map((survey) => ({
      ...survey,
      nombre: survey.nombre || parsed.nombre || 'Muestra',
      archived: Boolean(survey.archived),
      lots: Array.isArray(survey.lots) ? survey.lots.map(normalizeLot) : [],
      events: { nombre: parsed.nombre || 'Muestra', births: 0, deaths: 0, purchases: 0, sales: 0, ...(survey.events || {}) },
    })),
    animalEvents: Array.isArray(parsed.animalEvents) ? parsed.animalEvents.map(normalizeEvent) : [],
    rain: Array.isArray(parsed.rain) ? parsed.rain : [],
    rainEntries: Array.isArray(parsed.rainEntries) ? parsed.rainEntries : [],
    draft: parsed.draft ? { mode: parsed.draft.mode || 'new', editingSurveyId: parsed.draft.editingSurveyId || null, ...parsed.draft } : null,
    settings: { userName: 'Juan', establishment: 'El Rosario', introSeen: false, showArchived: false, ...(parsed.settings || {}) },
    sampleMode: Boolean(parsed.sampleMode || parsed.nombre === 'Muestra'),
    lastSavedAt: parsed.lastSavedAt || parsed.updatedAt || new Date().toISOString(),
  }
  if (migrated.draft?.lots) migrated.draft.lots = migrated.draft.lots.map(normalizeLot)
  if (!migrated.selectedSurveyId || !migrated.surveys.some((survey) => survey.id === migrated.selectedSurveyId && !survey.archived)) {
    migrated.selectedSurveyId = [...migrated.surveys].filter((survey) => !survey.archived).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))[0]?.id || null
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
  mapMode: 'map',
  mapInspectorTab: 'actual',
  mapViewBox: null,
  summaryViewBox: null,
  mapDragging: false,
  eventFilter: 'all',
  historyShowArchived: false,
  rainTab: 'period',
  rainGranularity: 'monthly',
  rainYear: Number((selectedSurvey()?.date || '2026-01-01').slice(0, 4)),
  rainEndPeriod: monthKey(selectedSurvey()?.date || todayISO()),
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

function sortedSurveys(includeArchived = false) {
  return [...state.surveys]
    .filter((survey) => includeArchived || !survey.archived)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
}

function latestSurvey() {
  return sortedSurveys(false)[0] || null
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
  const list = sortedSurveys(false).filter((item) => item.id !== survey?.id).sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')) || String(a.createdAt || '').localeCompare(String(b.createdAt || '')))
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
    if (!byLot[lotEntry.lotId]) continue
    for (const group of lotEntry.groups || []) {
      const categoryId = categoryLookup[group.categoryId] ? group.categoryId : (CATEGORY_MIGRATION[group.categoryId] || 'vacas-descarte')
      const quantity = Math.max(0, Number(group.quantity) || 0)
      const factor = categoryLookup[categoryId]?.factor || 1
      animals += quantity
      equivalents += quantity * factor
      categories[categoryId] = (categories[categoryId] || 0) + quantity
      byLot[lotEntry.lotId].animals += quantity
      byLot[lotEntry.lotId].equivalents += quantity * factor
      byLot[lotEntry.lotId].groups.push({ ...group, categoryId })
    }
  }
  for (const lot of LOTS) {
    byLot[lot.id].load = byLot[lot.id].equivalents / lot.hectares
    byLot[lot.id].capacityUse = byLot[lot.id].load / TARGET_LOAD
  }
  return { animals, equivalents, load: equivalents / 1735, categories, byLot }
}


const eventTypeLookup = Object.fromEntries(EVENT_TYPES.map((item) => [item.id, item]))

function categoryFamily(categoryId) {
  return categoryLookup[categoryId]?.parent || 'vacas'
}

function categoryOptionsHtml(selected = '', filter = null) {
  const allowed = filter ? new Set(filter) : null
  return CATEGORY_FAMILIES.map((family) => {
    const options = CATEGORIES.filter((category) => category.parent === family.id && (!allowed || allowed.has(category.id)))
    if (!options.length) return ''
    return `<optgroup label="${esc(family.label)}">${options.map((category) => `<option value="${category.id}" ${selected === category.id ? 'selected' : ''}>${esc(category.name)}</option>`).join('')}</optgroup>`
  }).join('')
}

function activeAnimalEvents() {
  return [...(state.animalEvents || [])].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
}

function eventsBetween(startDate, endDate, includeStart = false) {
  return activeAnimalEvents().filter((event) => {
    const date = String(event.date || '')
    const afterStart = !startDate || (includeStart ? date >= startDate : date > startDate)
    const beforeEnd = !endDate || date <= endDate
    return afterStart && beforeEnd
  }).sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))
}

function eventTotals(events = []) {
  const totals = { sale: 0, purchase: 0, death: 0, birth: 0, reclassification: 0 }
  for (const event of events) totals[event.type] = (totals[event.type] || 0) + Math.max(0, Number(event.quantity) || 0)
  return totals
}

function eventTypeLabel(type) {
  return eventTypeLookup[type]?.label || type
}

function eventSignedQuantity(event) {
  const quantity = Math.max(0, Number(event.quantity) || 0)
  const sign = eventTypeLookup[event.type]?.sign || 0
  return quantity * sign
}

function inventoryFromSurvey(survey) {
  const inventory = Object.fromEntries(LOTS.map((lot) => [lot.id, Object.fromEntries(CATEGORIES.map((category) => [category.id, 0]))]))
  for (const lotEntry of survey?.lots || []) {
    if (!inventory[lotEntry.lotId]) continue
    for (const group of lotEntry.groups || []) {
      const id = categoryLookup[group.categoryId] ? group.categoryId : CATEGORY_MIGRATION[group.categoryId]
      if (!id) continue
      inventory[lotEntry.lotId][id] = (inventory[lotEntry.lotId][id] || 0) + Math.max(0, Number(group.quantity) || 0)
    }
  }
  return inventory
}

function cloneInventory(inventory) {
  return JSON.parse(JSON.stringify(inventory))
}

function applyEventToInventory(inventory, event) {
  const lotId = event.lotId
  if (!inventory[lotId]) inventory[lotId] = Object.fromEntries(CATEGORIES.map((category) => [category.id, 0]))
  const quantity = Math.max(0, Number(event.quantity) || 0)
  const categoryId = categoryLookup[event.categoryId] ? event.categoryId : CATEGORY_MIGRATION[event.categoryId]
  const toCategoryId = categoryLookup[event.toCategoryId] ? event.toCategoryId : CATEGORY_MIGRATION[event.toCategoryId]
  if (event.type === 'purchase' || event.type === 'birth') inventory[lotId][categoryId] = Math.max(0, (inventory[lotId][categoryId] || 0) + quantity)
  if (event.type === 'sale' || event.type === 'death') inventory[lotId][categoryId] = Math.max(0, (inventory[lotId][categoryId] || 0) - quantity)
  if (event.type === 'reclassification') {
    inventory[lotId][categoryId] = Math.max(0, (inventory[lotId][categoryId] || 0) - quantity)
    inventory[lotId][toCategoryId] = Math.max(0, (inventory[lotId][toCategoryId] || 0) + quantity)
  }
  return inventory
}

function surveyBeforeOrOn(date) {
  return sortedSurveys(false).filter((survey) => String(survey.date || '') <= String(date || '')).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))[0] || null
}

function projectedInventoryAt(date, excludeEventId = null) {
  const base = surveyBeforeOrOn(date) || sortedSurveys(false).at(-1) || null
  const inventory = inventoryFromSurvey(base)
  if (!base) return { base: null, inventory, events: [] }
  const events = eventsBetween(base.date, date).filter((event) => event.id !== excludeEventId)
  events.forEach((event) => applyEventToInventory(inventory, event))
  return { base, inventory, events }
}

function projectedLotsForDate(date) {
  const { base, inventory, events } = projectedInventoryAt(date)
  if (!base) return { base: null, lots: [], events }
  const sourceByLot = Object.fromEntries((base.lots || []).map((entry) => [entry.lotId, entry]))
  const lots = LOTS.map((lot) => {
    const source = sourceByLot[lot.id]
    const groups = CATEGORIES.map((category) => ({
      id: uid(), nombre: state.nombre || 'Muestra', categoryId: category.id,
      quantity: Math.max(0, Math.round(inventory[lot.id]?.[category.id] || 0)), birthYear: '', notes: 'Precargado desde eventos', projected: true,
    })).filter((group) => group.quantity > 0)
    const fieldState = source?.fieldState || 'no-observado'
    if (!groups.length && !source) return null
    return { nombre: state.nombre || 'Muestra', lotId: lot.id, fieldState, conditionSource: source?.conditionSource || 'unobserved', groups, projected: true }
  }).filter(Boolean)
  return { base, lots, events }
}

function availableCategoryQuantity(date, lotId, categoryId, excludeEventId = null) {
  const { inventory } = projectedInventoryAt(date, excludeEventId)
  return Math.max(0, Number(inventory?.[lotId]?.[categoryId]) || 0)
}

function eventsForSurveyInterval(survey) {
  const previous = previousSurvey(survey)
  return eventsBetween(previous?.date || null, survey?.date || null)
}

function categoryEventDelta(events) {
  const result = Object.fromEntries(CATEGORIES.map((category) => [category.id, 0]))
  for (const event of events) {
    const quantity = Math.max(0, Number(event.quantity) || 0)
    if (event.type === 'birth' || event.type === 'purchase') result[event.categoryId] = (result[event.categoryId] || 0) + quantity
    if (event.type === 'sale' || event.type === 'death') result[event.categoryId] = (result[event.categoryId] || 0) - quantity
    if (event.type === 'reclassification') {
      result[event.categoryId] = (result[event.categoryId] || 0) - quantity
      result[event.toCategoryId] = (result[event.toCategoryId] || 0) + quantity
    }
  }
  return result
}

function herdBalanceForSurvey(survey) {
  const previous = previousSurvey(survey)
  if (!previous || !survey) return null
  const priorMetrics = surveyMetrics(previous)
  const currentMetrics = surveyMetrics(survey)
  const events = eventsBetween(previous.date, survey.date)
  const totals = eventTotals(events)
  const expected = priorMetrics.animals + totals.birth + totals.purchase - totals.sale - totals.death
  const discrepancy = currentMetrics.animals - expected
  const deltas = categoryEventDelta(events)
  const categoryDifferences = CATEGORIES.map((category) => {
    const expectedCategory = (priorMetrics.categories[category.id] || 0) + (deltas[category.id] || 0)
    const observed = currentMetrics.categories[category.id] || 0
    return { category, expected: expectedCategory, observed, difference: observed - expectedCategory }
  }).filter((item) => item.expected || item.observed).sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))
  return { previous, survey, priorMetrics, currentMetrics, events, totals, expected, discrepancy, discrepancyPct: expected ? discrepancy / expected * 100 : 0, categoryDifferences }
}

function eventsForLot(lotId, untilDate = null) {
  return activeAnimalEvents().filter((event) => event.lotId === lotId && (!untilDate || String(event.date || '') <= String(untilDate))).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
}

function lotHistorySeries(lotId) {
  return [...sortedSurveys(false)].reverse().map((survey) => {
    const metric = surveyMetrics(survey).byLot[lotId]
    const condition = resolveLotCondition(survey, lotId)
    return { survey, load: metric.load, animals: metric.animals, condition }
  })
}

function eventAffectsTotal(type) {
  return ['sale', 'purchase', 'death', 'birth'].includes(type)
}

function eventGroupLabel(type) {
  return eventTypeLookup[type]?.group === 'commercial' ? 'Comercial' : 'Cambios del rodeo'
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
  const highLots = []
  const combinedRisk = []
  for (const lot of LOTS) {
    const metric = metrics.byLot[lot.id]
    const loadState = capacityClass(metric.load)
    const high = ['high', 'over', 'critical'].includes(loadState)
    if (high) highLots.push({ lot, metric, loadState })
    const condition = resolveLotCondition(survey, lot.id)
    if (high && ['malo', 'anegado'].includes(condition.stateId)) combinedRisk.push({ lot, metric, loadState, condition })
  }
  const alerts = []
  if (highLots.length) alerts.push({
    severity: highLots.some((item) => item.loadState === 'critical') ? 'danger' : 'warning',
    title: `Carga alta en ${highLots.length} ${highLots.length === 1 ? 'lote' : 'lotes'}`,
    text: highLots.map((item) => item.lot.name).join(', '),
    lotIds: highLots.map((item) => item.lot.id),
  })
  if (combinedRisk.length) alerts.push({
    severity: 'danger',
    title: 'Condición comprometida y carga alta',
    text: `${combinedRisk.length} ${combinedRisk.length === 1 ? 'lote requiere' : 'lotes requieren'} atención: ${combinedRisk.map((item) => item.lot.name).join(', ')}.`,
    lotIds: combinedRisk.map((item) => item.lot.id),
  })
  return alerts
}

function rainAnalysis(period) {
  const summary = monthlyRainSummary(period)
  const current = summary.millimeters
  const historical = historicalMonth(Number(String(period).slice(5, 7)))
  if (current == null) return { current: null, status: 'Sin dato', delta: null, average: historical.average, p10: historical.p10, p90: historical.p90, index: null, detail: 'No se registró lluvia para este mes.', source: summary.source, entries: summary.entries }
  const index = hydricIndex(current, historical.average)
  const status = hydricState(index)
  const delta = current - historical.average
  const sourceText = summary.source === 'daily' ? `${summary.entries.length} registros por fecha` : 'total mensual'
  return { current, status, delta, average: historical.average, p10: historical.p10, p90: historical.p90, index, detail: `${sourceText} · ${delta >= 0 ? '+' : ''}${fmt(delta)} mm frente al promedio de Laprida.`, source: summary.source, entries: summary.entries }
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


function categoryUsageStats() {
  const stats = Object.fromEntries(CATEGORIES.map((category) => [category.id, { occurrences: 0, quantity: 0 }]))
  for (const survey of sortedSurveys(true)) {
    for (const lotEntry of survey.lots || []) {
      const seen = new Set()
      for (const group of lotEntry.groups || []) {
        const id = categoryLookup[group.categoryId] ? group.categoryId : CATEGORY_MIGRATION[group.categoryId]
        if (!stats[id]) continue
        const quantity = Math.max(0, Number(group.quantity) || 0)
        stats[id].quantity += quantity
        if (quantity > 0 && !seen.has(id)) { stats[id].occurrences += 1; seen.add(id) }
      }
    }
  }
  return stats
}

function suggestedCategoryIds() {
  const stats = categoryUsageStats()
  const ranked = CATEGORIES
    .filter((category) => stats[category.id].occurrences > 0)
    .sort((a, b) => stats[b.id].occurrences - stats[a.id].occurrences || stats[b.id].quantity - stats[a.id].quantity || a.name.localeCompare(b.name))
    .map((category) => category.id)
  for (const categoryId of DEFAULT_CATEGORY_IDS) if (!ranked.includes(categoryId)) ranked.push(categoryId)
  return ranked.slice(0, 4)
}

function suggestedCategoryGroups() {
  return suggestedCategoryIds().map((categoryId) => ({ id: uid(), categoryId, quantity: 0, birthYear: '', notes: '', suggested: true }))
}

function lotFormModel(lot, suggestWhenEmpty = false) {
  const model = JSON.parse(JSON.stringify(lot))
  if (suggestWhenEmpty && !(model.groups || []).length) model.groups = suggestedCategoryGroups()
  return model
}

function lotCategoryRollup(groups = []) {
  const totals = { cows: 0, calves: 0, bulls: 0, heifers: 0, steers: 0 }
  for (const group of groups) {
    const quantity = Math.max(0, Number(group.quantity) || 0)
    const category = categoryLookup[group.categoryId]
    if (!category) continue
    if (category.parent === 'vacas') totals.cows += quantity
    if (category.parent === 'terneros') totals.calves += quantity
    if (category.parent === 'toros') totals.bulls += quantity
    if (category.parent === 'vaquillonas') totals.heifers += quantity
    if (category.parent === 'novillos') totals.steers += quantity
  }
  return totals
}

function conditionAbbreviation(stateId) {
  return ({ 'muy-bueno': 'Muy b.', bueno: 'Bueno', regular: 'Regular', malo: 'Malo', anegado: 'Aneg.', 'no-observado': 'Sin info.' })[stateId] || 'Sin info.'
}

function loadAbbreviation(load) {
  return ({ empty: 'Sin carga', low: 'Baja', ok: 'Adecuada', high: 'Alta', over: 'Sobre.', critical: 'Crítica' })[capacityClass(load)]
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
    event: '<path d="M4 7h16M4 12h16M4 17h10"/><circle cx="18" cy="17" r="3"/><path d="M18 15.5v3M16.5 17h3"/>',
    balance: '<path d="M12 3v18M5 7h14M6 7l-3 6h6ZM18 7l-3 6h6Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    archive: '<path d="M4 7h16v13H4z"/><path d="M3 3h18v4H3zM9 11h6"/>',
    restore: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    zoomIn: '<circle cx="10" cy="10" r="7"/><path d="M15 15l6 6M10 7v6M7 10h6"/>',
    zoomOut: '<circle cx="10" cy="10" r="7"/><path d="M15 15l6 6M7 10h6"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
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
  const latest = latestSurvey()
  const dataDate = latest ? compactDateLabel(latest.date) : 'Sin datos'
  const sampleBadge = state.sampleMode ? '<span class="sample-badge">MODO MUESTRA</span>' : ''
  return `
    <div class="app-shell ${ui.view === 'relevamiento' ? 'survey-mode' : ''}">
      <aside class="sidebar">
        <div class="brand"><img src="./assets/${UI_ASSETS.home}" alt="Casa principal de El Rosario"><div><strong>CAMPO</strong><span>El Rosario</span></div></div>
        ${sampleBadge}
        <nav>
          ${navItemAsset('resumen', 'Resumen', UI_ASSETS.home)}
          ${navItemAsset('relevamiento', 'Registrar', UI_ASSETS.register)}
          ${navItem('eventos', 'Eventos', 'event')}
          ${navItem('mapa', 'Mapa y lotes', 'map')}
          ${navItem('lluvias', 'Lluvias', 'rain')}
          ${navItem('historico', 'Histórico', 'history')}
          ${navItem('intro', 'Introducción', 'info')}
          ${navItem('datos', 'Exportar y respaldo', 'download')}
        </nav>
        <div class="sidebar-card"><small>Datos más recientes</small><strong>${latest ? dateLabel(latest.date) : 'Sin datos'}</strong><span>Los datos se guardan en este dispositivo.</span></div>
        <div class="sidebar-footer"><span>Campo v${APP_VERSION_LABEL}</span><span>Datos: ${dataDate}</span></div>
      </aside>
      <div class="content-shell">
        <header class="topbar">
          <button class="mobile-menu" data-toggle-nav aria-label="Menú">${icon('menu', 24)}</button>
          <div><h1>${title}</h1><p>${subtitle}</p></div>
          <div class="topbar-actions">${sampleBadge}<span class="release-status"><b>Campo v${APP_VERSION_LABEL}</b><small>Datos más recientes ${dataDate}</small></span>${action}</div>
        </header>
        <main class="page">${content}</main>
      </div>
      <nav class="mobile-nav mobile-nav-v7">
        ${navItemAsset('resumen', 'Resumen', UI_ASSETS.home)}
        ${navItemAsset('relevamiento', 'Registrar', UI_ASSETS.register)}
        ${navItem('eventos', 'Eventos', 'event')}
        ${navItem('mapa', 'Mapa', 'map')}
        ${navItem('intro', 'Más', 'menu')}
      </nav>
      ${ui.modal ? renderModal() : ''}
      ${ui.toast ? `<div class="toast">${icon('check', 18)} ${esc(ui.toast)}</div>` : ''}
    </div>`
}


function renderBalancePanel(balance, compact = false) {
  if (!balance) return `<div class="empty-inline">Se necesita un relevamiento anterior para calcular el balance.</div>`
  const status = balance.discrepancy === 0 ? 'ok' : Math.abs(balance.discrepancyPct) <= .5 ? 'minor' : 'warning'
  const lines = [
    ['Stock observado anterior', balance.priorMetrics.animals, 'neutral'],
    ['Nacimientos', balance.totals.birth, 'positive'],
    ['Compras', balance.totals.purchase, 'positive'],
    ['Ventas', -balance.totals.sale, 'negative'],
    ['Mortandad', -balance.totals.death, 'negative'],
  ]
  return `<div class="herd-balance ${compact?'compact':''}"><div class="balance-equation">${lines.map(([label,value,tone])=>`<div class="${tone}"><span>${label}</span><strong>${value>0?'+':''}${fmt(value)}</strong></div>`).join('')}<div class="expected"><span>Stock esperado</span><strong>${fmt(balance.expected)}</strong></div><div><span>Stock observado</span><strong>${fmt(balance.currentMetrics.animals)}</strong></div><div class="discrepancy ${status}"><span>Discrepancia</span><strong>${balance.discrepancy>0?'+':''}${fmt(balance.discrepancy)} <small>${balance.expected?`(${decimal(balance.discrepancyPct,1)}%)`:''}</small></strong></div></div>${compact?'':`<details class="balance-category-details"><summary>Ver diferencias por categoría</summary><div>${balance.categoryDifferences.slice(0,8).map((item)=>`<p><span>${esc(item.category.name)}</span><b>Esperado ${fmt(item.expected)} · observado ${fmt(item.observed)} · ${item.difference>0?'+':''}${fmt(item.difference)}</b></p>`).join('')}</div></details>`}</div>`
}

function periodEventTotalsForSurvey(survey) {
  const events = eventsForSurveyInterval(survey)
  const totals = eventTotals(events)
  if (!events.length && survey?.events) return { birth:Number(survey.events.births||0), death:Number(survey.events.deaths||0), purchase:Number(survey.events.purchases||0), sale:Number(survey.events.sales||0), reclassification:0 }
  return totals
}

function renderDashboard() {
  const survey = selectedSurvey()
  if (!survey) return renderShell('<div class="empty-state"><h2>No hay relevamientos</h2><button class="btn primary" data-start-survey>Crear el primero</button></div>', 'Resumen del campo', 'El Rosario')
  const metrics = surveyMetrics(survey)
  const prev = previousSurvey(survey)
  const prevMetrics = prev ? surveyMetrics(prev) : null
  const rainPeriod = survey.rainPeriod || monthKey(survey.date)
  const rain = rainAnalysis(rainPeriod)
  const alerts = operationalAlerts(survey)
  const eventTotalsCurrent = periodEventTotalsForSurvey(survey)
  const deltaAnimals = prevMetrics ? metrics.animals - prevMetrics.animals : null
  const resolved = LOTS.map((lot) => resolveLotCondition(survey, lot.id))
  const assumedCount = resolved.filter((item) => conditionIsAssumed(item.source)).length
  const noInfoCount = resolved.filter((item) => item.source === 'none').length
  const balance = herdBalanceForSurvey(survey)
  const cards = `<section class="kpi-grid v7">
    ${kpiCard('Ganado total', fmt(metrics.animals), deltaAnimals == null ? 'Primer relevamiento' : `${deltaAnimals >= 0 ? '+' : ''}${fmt(deltaAnimals)} vs. anterior`, KPI_ASSETS.animals, 'brown')}
    ${kpiCard('Carga del campo', `${decimal(metrics.load)} EV/ha`, `Objetivo ${decimal(TARGET_LOAD)} EV/ha`, KPI_ASSETS.load, capacityClass(metrics.load))}
    ${kpiCard('Nacimientos', fmt(eventTotalsCurrent.birth), 'Entre relevamientos', KPI_ASSETS.births, 'gold', 'data-nav="eventos" role="button" tabindex="0"')}
    ${kpiCard('Mortandad', fmt(eventTotalsCurrent.death), 'Entre relevamientos', KPI_ASSETS.deaths, eventTotalsCurrent.death ? 'red' : 'neutral', 'data-nav="eventos" role="button" tabindex="0"')}
    ${kpiCard('Compras y ventas', `${fmt(eventTotalsCurrent.purchase)} / ${fmt(eventTotalsCurrent.sale)}`, 'Compras / ventas', KPI_ASSETS.trade, 'blue', 'data-nav="eventos" role="button" tabindex="0"')}
    ${kpiCard('Lluvia en Laprida', rain.current == null ? 'Sin dato' : `${fmt(rain.current)} mm`, `${rain.status}${rain.index == null ? '' : ` · IH ${Math.round(rain.index)}%`}`, KPI_ASSETS.rain, 'blue', 'data-nav="lluvias" role="button" tabindex="0"')}
  </section>`
  const content = `${renderSurveyNavigator()}
    <section class="welcome-strip"><div><span class="eyebrow">Relevamiento seleccionado</span><h2>${dateLabel(survey.date)}</h2><p>${survey.lots.length} lotes observados · ${assumedCount} condiciones estimadas · ${noInfoCount} sin información</p></div><div class="welcome-actions"><button class="btn secondary large" data-edit-selected-survey>${icon('edit',18)} Editar relevamiento</button><button class="btn primary large" data-start-survey>${icon('plus',19)} Nuevo relevamiento</button></div></section>
    ${cards}
    <section class="dashboard-grid v7-dashboard-grid">
      <article class="panel map-panel"><div class="panel-head"><div><span class="eyebrow">Lectura visual sin etiquetas</span><h3>El Rosario</h3></div><button class="btn ghost" data-nav="mapa">Abrir mapa</button></div>${renderMap(survey,true)}<p class="map-reading-note">Terreno = condición · borde = carga · sprites = cantidad y composición.</p></article>
      <aside class="dashboard-side">
        <article class="panel alerts-panel"><div class="panel-head"><h3>Alertas resumidas</h3><span class="count-pill">${alerts.length}</span></div>${alerts.length?`<div class="alert-list">${alerts.map(renderAlert).join('')}</div>`:'<div class="empty-inline success">Sin alertas operativas.</div>'}</article>
        <article class="panel"><div class="panel-head"><h3>Composición del rodeo</h3></div>${renderCategoryBars(metrics.categories,metrics.animals)}</article>
        <article class="panel balance-panel"><div class="panel-head"><div><span class="eyebrow">Cambio entre fotografías</span><h3>Balance del rodeo</h3></div><button class="text-link" data-nav="eventos">Ver eventos</button></div>${renderBalancePanel(balance,true)}</article>
        <article class="panel rain-card interactive" data-nav="lluvias"><div class="panel-head"><h3>Lluvia · Laprida</h3><button class="text-link" data-nav="lluvias">Abrir módulo</button></div><div class="rain-hero"><strong>${rain.current==null?'—':fmt(rain.current)}</strong><span>mm · ${monthLabel(rainPeriod)}</span><b class="rain-state ${hydricClass(rain.index)}">${esc(rain.status)}</b></div><p>${esc(rain.detail)}</p></article>
      </aside>
    </section>
    ${renderLotsSummaryTable(survey)}
    <section class="bottom-grid"><article class="panel adoption-card"><div class="adoption-visual single"><img src="./assets/${UI_ASSETS.register}" alt="Registrar animales"></div><div><span class="eyebrow">Del evento a la próxima fotografía</span><h3>Registrá cambios y validá el siguiente relevamiento</h3><p>Ventas, compras, nacimientos, mortandad y recategorizaciones preparan el stock esperado.</p><div class="button-row"><button class="btn secondary" data-nav="eventos">Registrar evento</button><button class="btn primary" data-start-survey>Nuevo relevamiento</button></div></div></article><article class="panel recent-panel"><div class="panel-head"><h3>Últimos relevamientos</h3><button class="text-link" data-open-survey-history>Ver todos</button></div>${renderRecentSurveys()}</article></section>`
  return renderShell(content,'Resumen del campo','Condición, carga, rodeo, eventos y lluvia del relevamiento seleccionado')
}

function kpiCard(label, value, note, assetPath, tone, attrs = '') {
  return `<article class="kpi-card tone-${tone} ${attrs ? 'interactive' : ''}" ${attrs}><span class="kpi-icon"><img src="./assets/${assetPath}" alt=""></span><div><small>${label}</small><strong>${value}</strong><p>${note}</p></div></article>`
}

function renderAlert(alert) {
  const lotAttr = alert.lotIds?.length ? `data-alert-lots="${alert.lotIds.join(',')}"` : alert.lotId ? `data-lot="${alert.lotId}"` : ''
  return `<button class="alert-item ${alert.severity}" ${lotAttr}><span>${icon('alert', 18)}</span><div><strong>${esc(alert.title)}</strong><p>${esc(alert.text)}</p></div>${lotAttr ? icon('chevron', 17) : ''}</button>`
}

function renderCategoryBars(categories, total) {
  const families = CATEGORY_FAMILIES.map((family) => ({
    ...family,
    quantity: CATEGORIES.filter((category) => category.parent === family.id).reduce((sum, category) => sum + Number(categories[category.id] || 0), 0),
  })).filter((item) => item.quantity > 0).sort((a, b) => b.quantity - a.quantity)
  const max = Math.max(1, ...families.map((item) => item.quantity))
  return `<div class="category-bars v7-category-bars">${families.map((item) => {
    const pct = total ? item.quantity / total * 100 : 0
    return `<div class="category-row"><div><span>${esc(item.label)}</span><strong>${fmt(item.quantity)} <em>${decimal(pct, 0)}%</em></strong></div><div class="bar"><i style="width:${Math.max(3, item.quantity / max * 100)}%"></i></div></div>`
  }).join('')}</div>`
}

function lotTableData(survey, lot) {
  const metrics = surveyMetrics(survey)
  const entry = (survey.lots || []).find((item) => item.lotId === lot.id)
  const metric = metrics.byLot[lot.id]
  const condition = resolveLotCondition(survey, lot.id)
  const rollup = lotCategoryRollup(entry?.groups || [])
  return { lot, entry, metric, condition, rollup }
}

function renderLotsDataTable(survey, context = 'summary') {
  const rows = LOTS.map((lot) => {
    const { entry, metric, condition, rollup } = lotTableData(survey, lot)
    const conditionCode = `${conditionIsAssumed(condition.source) ? '≈' : ''}${conditionShortCode(condition.stateId)}`
    const loadValue = entry ? decimal(metric.load) : '—'
    const loadClass = entry ? capacityClass(metric.load) : 'empty'
    return `<div class="lot-data-row v7-one-line ${ui.selectedLotId === lot.id ? 'selected' : ''}" data-table-lot="${lot.id}">
      <button class="lot-data-main" data-table-lot="${lot.id}" aria-label="Abrir ${lot.name}">
        <span class="lot-data-cell lot-name">${lot.name.replace('ER-','')}</span>
        <span class="lot-data-cell condition"><b class="state-${condition.stateId}">${conditionCode}</b></span>
        <span class="lot-data-cell load"><i class="load-dot ${loadClass}"></i>${loadValue}</span>
        <span class="lot-data-cell total"><strong>${entry ? fmt(metric.animals) : '—'}</strong></span>
        <span class="lot-data-cell cow">${entry ? fmt(rollup.cows) : '—'}</span>
        <span class="lot-data-cell calf">${entry ? fmt(rollup.calves) : '—'}</span>
        <span class="lot-data-cell bull">${entry ? fmt(rollup.bulls) : '—'}</span>
        <span class="lot-data-cell heifer">${entry ? fmt(rollup.heifers) : '—'}</span>
        <span class="lot-data-cell steer">${entry ? fmt(rollup.steers) : '—'}</span>
      </button>
      <button class="lot-data-edit" data-edit-table-lot="${lot.id}" aria-label="Editar ${lot.name}">${icon('edit', 15)}</button>
    </div>`
  }).join('')
  return `<div class="lot-data-table v7 ${context}"><div class="lot-data-header"><span>Lote</span><span>Cond.</span><span>EV</span><span>Total</span><span>Vaca</span><span>Tern.</span><span>Toro</span><span class="heifer">Vaq.</span><span class="steer">Nov.</span><span></span></div>${rows}</div>`
}

function renderLotsSummaryTable(survey) {
  return `<section class="panel lots-summary-panel"><div class="panel-head"><div><span class="eyebrow">Comparación operativa</span><h3>Todos los lotes</h3></div><button class="btn ghost" data-open-map-table>Mapa / Tabla</button></div>${renderLotsDataTable(survey, 'summary')}<p class="table-note">MB: muy bueno · B: bueno · R: regular · M: malo · AN: anegado · ≈ estimada.</p></section>`
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
  return Math.max(1, Math.ceil(heads / 10))
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

function allocateVisualKinds(lotEntry, slotCount) {
  const totals = { cow: 0, bull: 0, calf: 0 }
  for (const group of lotEntry?.groups || []) {
    const category = categoryLookup[group.categoryId]
    if (!category) continue
    totals[category.kind] = (totals[category.kind] || 0) + Math.max(0, Number(group.quantity) || 0)
  }
  const total = Object.values(totals).reduce((sum, value) => sum + value, 0)
  if (!total || !slotCount) return []
  const raw = Object.entries(totals).filter(([, quantity]) => quantity > 0).map(([kind, quantity]) => ({ kind, exact: quantity / total * slotCount }))
  const allocations = Object.fromEntries(raw.map((item) => [item.kind, Math.floor(item.exact)]))
  let assigned = Object.values(allocations).reduce((sum, value) => sum + value, 0)
  raw.sort((a, b) => (b.exact - Math.floor(b.exact)) - (a.exact - Math.floor(a.exact)))
  for (const item of raw) {
    if (assigned >= slotCount) break
    allocations[item.kind] = (allocations[item.kind] || 0) + 1
    assigned += 1
  }
  const result = []
  for (const kind of ['cow','calf','bull']) for (let index = 0; index < (allocations[kind] || 0); index++) result.push(kind)
  while (result.length < slotCount) result.push(raw[0]?.kind || 'cow')
  return result.slice(0, slotCount)
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
  const marginX = Math.max(5, spriteWidth * .45)
  const marginY = Math.max(5, spriteWidth * .35)
  const positions = []
  const cols = Math.max(1, Math.ceil(Math.sqrt(count * Math.max(.45, width / Math.max(1, height)))))
  const rows = Math.max(1, Math.ceil(count / cols))
  const candidates = []
  for (let row = 0; row < rows + 3; row++) {
    for (let col = 0; col < cols + 3; col++) {
      const jitterX = (seededNumber(`${lot.id}-grid-x-${row}-${col}`) - .5) * .34
      const jitterY = (seededNumber(`${lot.id}-grid-y-${row}-${col}`) - .5) * .34
      const x = minX + marginX + ((col + .5 + jitterX) / (cols + 3)) * Math.max(1, width - marginX * 2)
      const y = minY + marginY + ((row + .5 + jitterY) / (rows + 3)) * Math.max(1, height - marginY * 2)
      if (pointInPolygon([x, y], polygon) && !isHouseZone(lot.id, x, y)) candidates.push({ x, y, rank: seededNumber(`${lot.id}-rank-${row}-${col}`) })
    }
  }
  for (let attempt = 0; attempt < 1500 && candidates.length < count * 5; attempt++) {
    const x = minX + marginX + seededNumber(`${lot.id}-x-${attempt}`) * Math.max(1, width - marginX * 2)
    const y = minY + marginY + seededNumber(`${lot.id}-y-${attempt}`) * Math.max(1, height - marginY * 2)
    if (pointInPolygon([x, y], polygon) && !isHouseZone(lot.id, x, y)) candidates.push({ x, y, rank: seededNumber(`${lot.id}-r-${attempt}`) })
  }
  candidates.sort((a, b) => a.rank - b.rank)
  let minDistance = Math.max(5, Math.min(spriteWidth * .72, Math.sqrt(Math.max(1, polygonArea(polygon) / Math.max(1, count))) * .42))
  for (let pass = 0; pass < 6 && positions.length < count; pass++) {
    for (const candidate of candidates) {
      if (positions.length >= count) break
      if (positions.some((point) => Math.hypot(candidate.x - point.x, candidate.y - point.y) < minDistance)) continue
      positions.push({ x: candidate.x, y: candidate.y })
    }
    minDistance *= .76
  }
  while (positions.length < count && candidates.length) positions.push(candidates[positions.length % candidates.length])
  return positions.slice(0, count)
}

function conditionShortCode(stateId) {
  return ({ 'muy-bueno': 'MB', bueno: 'B', regular: 'R', malo: 'M', anegado: 'AN', 'no-observado': '—' })[stateId] || '—'
}

function renderHerdSpritesHtml(lotEntry, lot, compact, metric, condition, surveyId) {
  const count = spriteCountForLot(lot, metric, compact)
  if (!count) return ''
  const area = polygonArea(parseLotPoints(lot))
  const calculated = Math.sqrt(Math.max(1, area / count)) * (compact ? .45 : .52)
  const spriteWidth = Math.max(compact ? 10 : 14, Math.min(compact ? 22 : 31, calculated))
  const positions = spritePositions(lot, count, spriteWidth)
  const kinds = allocateVisualKinds(lotEntry, positions.length)
  const directions = ['north', 'east', 'south', 'west']
  return positions.map((position, index) => {
    const kind = kinds[index] || 'cow'
    const direction = directions[Math.floor(seededNumber(`${lot.id}-${index}-direction-v801`) * directions.length) % directions.length]
    const variant = Math.floor(seededNumber(`${lot.id}-${index}-asset-v801`) * 4) % 4
    const asset = resolveAnimalSprite({ kind, direction, variant, state: 'idle', frame: 0 })
    const width = kind === 'calf' ? spriteWidth * .78 : kind === 'bull' ? spriteWidth * 1.08 : spriteWidth
    const height = width
    const agentId = `${surveyId || 'survey'}:${lot.id}:${kind}:${index}`
    return `<image class="map-animal-svg animated-animal ${kind} direction-${direction} state-${condition?.stateId || 'no-observado'}" href="${asset}" x="${(position.x - width / 2).toFixed(2)}" y="${(position.y - height / 2).toFixed(2)}" width="${width.toFixed(2)}" height="${height.toFixed(2)}" preserveAspectRatio="xMidYMid meet" data-animal-id="${esc(agentId)}" data-lot-id="${lot.id}" data-kind="${kind}" data-direction="${direction}" data-variant="${variant}" data-center-x="${position.x.toFixed(2)}" data-center-y="${position.y.toFixed(2)}" data-animal-width="${width.toFixed(2)}" data-animal-height="${height.toFixed(2)}" />`
  }).join('')
}


function fullMapViewBox() {
  return { x: 25, y: 22, width: 1085, height: 1305 }
}

function lotBounds(lot) {
  const points = parseLotPoints(lot)
  const xs = points.map((point) => point[0]), ys = points.map((point) => point[1])
  return { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) }
}

function clampViewBox(box) {
  const full = fullMapViewBox()
  const width = Math.max(150, Math.min(full.width, box.width))
  const height = Math.max(180, Math.min(full.height, box.height))
  return {
    x: Math.max(full.x, Math.min(full.x + full.width - width, box.x)),
    y: Math.max(full.y, Math.min(full.y + full.height - height, box.y)),
    width, height,
  }
}

function viewBoxForLot(lotId, padding = .34) {
  const lot = lotLookup[lotId] || lotLookup['ER-08-09']
  const bounds = lotBounds(lot)
  const width = Math.max(250, bounds.width * (1 + padding * 2))
  const height = Math.max(300, bounds.height * (1 + padding * 2))
  return clampViewBox({ x: bounds.x - (width - bounds.width) / 2, y: bounds.y - (height - bounds.height) / 2, width, height })
}

function currentMapViewBox() {
  if (!ui.mapViewBox) ui.mapViewBox = viewBoxForLot(ui.selectedLotId || 'ER-08-09')
  return clampViewBox(ui.mapViewBox)
}

function zoomMap(factor, anchorX = .5, anchorY = .5) {
  const box = currentMapViewBox()
  const width = box.width * factor
  const height = box.height * factor
  ui.mapViewBox = clampViewBox({ x: box.x + (box.width - width) * anchorX, y: box.y + (box.height - height) * anchorY, width, height })
}

function currentSummaryViewBox() {
  if (!ui.summaryViewBox) ui.summaryViewBox = fullMapViewBox()
  return clampViewBox(ui.summaryViewBox)
}

function zoomSummaryMap(factor, anchorX = .5, anchorY = .5) {
  const box = currentSummaryViewBox()
  const width = box.width * factor
  const height = box.height * factor
  ui.summaryViewBox = clampViewBox({ x: box.x + (box.width - width) * anchorX, y: box.y + (box.height - height) * anchorY, width, height })
}

function focusMapLot(lotId) {
  ui.selectedLotId = lotId
  ui.mapViewBox = viewBoxForLot(lotId)
  ui.mapInspectorTab = 'actual'
}

function renderMapPillSvg(lot, metric, entry, condition, selected, viewBox) {
  const shouldShow = selected || viewBox.width < 700
  if (!shouldShow) return ''
  const detailed = selected && viewBox.width < 520
  const narrow = lotBounds(lot).width < 110
  const scale = Math.max(.65, Math.min(1.45, viewBox.width / 520))
  const width = (detailed ? 142 : narrow ? 64 : 92) * scale
  const height = (detailed ? 52 : 38) * scale
  const x = lot.label[0] - width / 2
  const y = lot.label[1] - height / 2
  const total = entry ? fmt(metric.animals) : '—'
  const title = narrow && !detailed ? lot.name.replace('ER-','') : lot.name
  const second = detailed ? `${total} · ${entry ? decimal(metric.load) : '—'} EV/ha` : `${total}${conditionIsAssumed(condition.source) ? ' ≈' : ''}`
  const third = detailed ? `${conditionShortCode(condition.stateId)} · ${capacityLabel(metric.load)}` : ''
  return `<g class="map-pill-svg ${selected ? 'selected' : ''}" data-map-lot="${lot.id}" transform="translate(${x.toFixed(2)} ${y.toFixed(2)})"><rect width="${width.toFixed(2)}" height="${height.toFixed(2)}" rx="${(11*scale).toFixed(2)}"/><text x="${(width/2).toFixed(2)}" y="${(detailed?16:15)*scale}" text-anchor="middle"><tspan class="pill-title">${esc(title)}</tspan><tspan class="pill-value" x="${(width/2).toFixed(2)}" dy="${(detailed?17:15)*scale}">${esc(second)}</tspan>${third?`<tspan class="pill-meta" x="${(width/2).toFixed(2)}" dy="${12*scale}">${esc(third)}</tspan>`:''}</text></g>`
}

function renderMapHousesSvg() {
  return `<image class="map-house-svg main" data-lot-id="ER-08-09" href="./assets/buildings/building-house-main-er08-09.png" x="309" y="375" width="58" height="58" preserveAspectRatio="xMidYMid meet"/><image class="map-house-svg secondary" data-lot-id="ER-13" href="./assets/buildings/building-house-secondary-er13.png" x="586" y="719" width="48" height="48" preserveAspectRatio="xMidYMid meet"/>`
}

function renderMapLabelHtml(lot, metric, entry, condition, compact) {
  return ''
}

function renderMapHousesHtml(compact) {
  return renderMapHousesSvg()
}

function renderMap(survey, compact = false) {
  const metrics = surveyMetrics(survey)
  const selected = ui.selectedLotId
  const lotEntries = Object.fromEntries((survey.lots || []).map((entry) => [entry.lotId, entry]))
  const conditions = Object.fromEntries(LOTS.map((lot) => [lot.id, resolveLotCondition(survey, lot.id)]))
  const viewBox = compact ? currentSummaryViewBox() : currentMapViewBox()
  const patternDefs = LOTS.flatMap((lot) => FIELD_STATES.filter((item) => item.pattern).map((item) => {
    const baseSize = compact ? 34 : 46
    const tileSize = baseSize + Math.floor(seededNumber(`${lot.id}-${item.id}-tile-size-v701`) * (compact ? 8 : 12))
    const offsetX = -Math.floor(seededNumber(`${lot.id}-${item.id}-tile-x-v701`) * tileSize)
    const offsetY = -Math.floor(seededNumber(`${lot.id}-${item.id}-tile-y-v701`) * tileSize)
    return `<pattern id="condition-${item.id}-${lot.id}-${compact?'c':'f'}" patternUnits="userSpaceOnUse" x="${offsetX}" y="${offsetY}" width="${tileSize}" height="${tileSize}"><image href="./assets/conditions/${item.pattern}" x="0" y="0" width="${tileSize}" height="${tileSize}" preserveAspectRatio="xMidYMid slice" /></pattern>`
  })).join('') + `<pattern id="condition-assumed-hatch-${compact?'c':'f'}" patternUnits="userSpaceOnUse" width="18" height="18" patternTransform="rotate(32)"><rect width="18" height="18" fill="transparent"/><rect width="1.5" height="18" fill="rgba(255,255,255,.22)"/></pattern><pattern id="condition-no-info-${compact?'c':'f'}" patternUnits="userSpaceOnUse" width="22" height="22" patternTransform="rotate(35)"><rect width="22" height="22" fill="rgba(232,232,222,.05)"/><rect width="1.2" height="22" fill="rgba(255,255,255,.18)"/></pattern>`
  const conditionLayer = LOTS.map((lot) => {
    const condition = conditions[lot.id]
    if (condition.source === 'none') return `<polygon class="lot-condition source-none state-no-observado" points="${lot.points}" fill="url(#condition-no-info-${compact?'c':'f'})" />`
    return `<polygon class="lot-condition source-${condition.source} state-${condition.stateId}" points="${lot.points}" fill="url(#condition-${condition.stateId}-${lot.id}-${compact?'c':'f'})" />${conditionIsAssumed(condition.source) ? `<polygon class="condition-assumption-hatch" points="${lot.points}" fill="url(#condition-assumed-hatch-${compact?'c':'f'})" />` : ''}`
  }).join('')
  const loadHalos = LOTS.map((lot) => `<polygon class="lot-load-halo ${capacityClass(metrics.byLot[lot.id].load)}" points="${lot.points}" vector-effect="non-scaling-stroke" />`).join('')
  const loadBorders = LOTS.map((lot) => `<polygon class="lot-load-border ${capacityClass(metrics.byLot[lot.id].load)}" points="${lot.points}" vector-effect="non-scaling-stroke" />`).join('')
  const animals = (survey.lots || []).filter((entry) => metrics.byLot[entry.lotId]?.animals > 0).map((entry) => renderHerdSpritesHtml(entry, lotLookup[entry.lotId], compact, metrics.byLot[entry.lotId], conditions[entry.lotId], survey.id)).join('')
  const pills = compact ? '' : LOTS.map((lot) => renderMapPillSvg(lot, metrics.byLot[lot.id], lotEntries[lot.id], conditions[lot.id], selected === lot.id, viewBox)).join('')
  const hitAreas = LOTS.map((lot) => `<polygon class="lot-hit ${selected === lot.id ? 'selected' : ''}" data-map-lot="${lot.id}" points="${lot.points}" />`).join('')
  const svg = `<svg class="map-canvas v801-map-svg ${compact?'summary':'zoomable'}" data-map-svg="${compact?'summary':'full'}" data-selected-lot-id="${selected || ''}" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mapa interactivo de El Rosario"><defs>${patternDefs}</defs><image class="aerial-base" href="./assets/map/el-rosario-map.png" x="0" y="0" width="1154" height="1363" preserveAspectRatio="none"/><g class="condition-layer">${conditionLayer}</g><g class="load-halo-layer">${loadHalos}</g><g class="load-border-layer">${loadBorders}</g><g class="map-animal-layer">${animals}</g><g class="map-house-layer">${renderMapHousesSvg()}</g><g class="map-pill-layer">${pills}</g><g class="interaction-layer">${hitAreas}</g></svg>`
  const animationLabel = animalAnimator.isEnabled() ? 'Pausar animación' : 'Activar animación'
  const animationGlyph = animalAnimator.isEnabled() ? '⏸' : '▶'
  if (compact) return `<div class="map-zoom-shell summary-zoom-shell"><div class="ranch-map compact summary-map v801-summary-map">${svg}</div><div class="map-zoom-controls summary-map-controls"><button data-map-zoom-in="summary" title="Acercar">${icon('zoomIn',18)}</button><button data-map-zoom-out="summary" title="Alejar">${icon('zoomOut',18)}</button><button data-map-view-all="summary" title="Ver todo">Todo</button><button class="animation-toggle ${animalAnimator.isEnabled()?'active':''}" data-animation-toggle title="${animationLabel}" aria-label="${animationLabel}">${animationGlyph}</button></div></div>`
  return `<div class="map-zoom-shell"><div class="ranch-map full full-map v801-full-map">${svg}</div><div class="map-zoom-controls full-map-controls"><button data-map-zoom-in="full" title="Acercar">${icon('zoomIn',18)}</button><button data-map-zoom-out="full" title="Alejar">${icon('zoomOut',18)}</button><button data-map-focus-selected title="Volver al lote">${icon('target',18)}</button><button data-map-view-all="full" title="Ver todo">Todo</button><button class="animation-toggle ${animalAnimator.isEnabled()?'active':''}" data-animation-toggle title="${animationLabel}" aria-label="${animationLabel}">${animationGlyph}</button></div><div class="map-zoom-hint">Arrastrá para mover · rueda, gesto o botones para zoom</div></div>`
}


function renderLotHistoryChart(lotId, compact = false) {
  const series = lotHistorySeries(lotId)
  if (!series.length) return '<div class="empty-inline">No hay historial para este lote.</div>'
  const width = compact ? 430 : 620, height = compact ? 180 : 250, padX = 30, top = 22, chartBottom = compact ? 122 : 174
  const maxLoad = Math.max(1.2, TARGET_LOAD * 1.4, ...series.map((item) => item.load || 0))
  const x = (index) => series.length === 1 ? width / 2 : padX + index * (width - padX * 2) / (series.length - 1)
  const y = (value) => chartBottom - (value / maxLoad) * (chartBottom - top)
  const points = series.map((item, index) => `${x(index)},${y(item.load || 0)}`).join(' ')
  const targetY = y(TARGET_LOAD)
  const conditionY = compact ? 142 : 196
  const stripWidth = (width - padX * 2) / series.length
  return `<svg class="lot-history-chart ${compact?'compact':''}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Evolución de carga y condición"><line class="history-target" x1="${padX}" y1="${targetY}" x2="${width-padX}" y2="${targetY}"/><text class="history-target-label" x="${width-padX}" y="${targetY-5}" text-anchor="end">0,8 EV/ha</text><polyline class="history-load-line" points="${points}"/>${series.map((item,index)=>`<circle class="history-point ${capacityClass(item.load)}" cx="${x(index)}" cy="${y(item.load || 0)}" r="${compact?3.5:4.5}"><title>${compactDateLabel(item.survey.date)} · ${decimal(item.load)} EV/ha · ${item.condition.label}</title></circle>`).join('')}${series.map((item,index)=>`<rect class="history-condition state-${item.condition.stateId} source-${item.condition.source}" x="${padX+index*stripWidth+1}" y="${conditionY}" width="${Math.max(2,stripWidth-2)}" height="18" rx="3"><title>${compactDateLabel(item.survey.date)} · ${item.condition.label}${conditionIsAssumed(item.condition.source)?' estimada':''}</title></rect>`).join('')}${series.map((item,index)=>index%Math.max(1,Math.ceil(series.length/6))===0?`<text class="history-date" x="${x(index)}" y="${height-8}" text-anchor="middle">${item.survey.date.slice(5,7)}/${item.survey.date.slice(2,4)}</text>`:'').join('')}</svg>`
}

function renderLotEvents(lotId, untilDate = null) {
  const events = eventsForLot(lotId, untilDate)
  if (!events.length) return '<div class="empty-inline">No hay eventos registrados para este lote.</div>'
  return `<div class="lot-event-list">${events.map((event)=>`<article><span class="event-type-icon type-${event.type}">${eventTypeLookup[event.type]?.icon||'•'}</span><div><strong>${eventTypeLabel(event.type)} · ${fmt(event.quantity)}</strong><p>${compactDateLabel(event.date)} · ${esc(categoryLookup[event.categoryId]?.name || '')}${event.toCategoryId?` → ${esc(categoryLookup[event.toCategoryId]?.name || '')}`:''}</p>${event.notes?`<small>${esc(event.notes)}</small>`:''}</div></article>`).join('')}</div>`
}

function renderLotInspector(survey) {
  const metrics = surveyMetrics(survey)
  const lot = ui.selectedLotId ? lotLookup[ui.selectedLotId] : null
  if (!lot) return `<aside class="lot-inspector empty-inspector"><img src="./assets/${UI_ASSETS.home}"><h2>Elegí un lote</h2><p>Tocá un lote o una fila para ver su estado, evolución y eventos.</p></aside>`
  const lotEntry = (survey.lots || []).find((entry) => entry.lotId === lot.id)
  const metric = metrics.byLot[lot.id]
  const condition = resolveLotCondition(survey, lot.id)
  const loadClass = capacityClass(metric.load)
  const rollup = lotCategoryRollup(lotEntry?.groups || [])
  const index = LOTS.findIndex((item) => item.id === lot.id)
  const prevLot = LOTS[Math.max(0, index - 1)], nextLot = LOTS[Math.min(LOTS.length - 1, index + 1)]
  const tabs = `<div class="inspector-tabs"><button class="${ui.mapInspectorTab==='actual'?'active':''}" data-inspector-tab="actual">Actual</button><button class="${ui.mapInspectorTab==='evolution'?'active':''}" data-inspector-tab="evolution">Evolución</button><button class="${ui.mapInspectorTab==='events'?'active':''}" data-inspector-tab="events">Eventos</button></div>`
  const actual = `<div class="inspector-tab-content"><div class="lot-concept-grid"><div class="concept-card condition state-${condition.stateId} source-${condition.source}">${fieldStateIcon(fieldStateLookup[condition.stateId])}<div><small>Condición</small><strong>${condition.label}${conditionIsAssumed(condition.source) ? ' ≈' : ''}</strong><span>${conditionSourceLabel(condition.source)}</span></div></div><div class="concept-card load ${loadClass}"><span class="concept-dot"></span><div><small>Carga</small><strong>${lotEntry ? capacityLabel(metric.load) : 'Sin carga'}</strong><span>${lotEntry ? `${decimal(metric.load)} EV/ha · ${Math.round(metric.capacityUse * 100)}%` : 'No registrada'}</span></div></div></div><div class="lot-stat-grid"><div><small>Total</small><strong>${lotEntry ? fmt(metric.animals) : '—'}</strong></div><div><small>Vaca</small><strong>${lotEntry ? fmt(rollup.cows) : '—'}</strong></div><div><small>Tern.</small><strong>${lotEntry ? fmt(rollup.calves) : '—'}</strong></div><div><small>Toro</small><strong>${lotEntry ? fmt(rollup.bulls) : '—'}</strong></div></div><h3 class="mini-history-title">Historia de carga y condición</h3>${renderLotHistoryChart(lot.id,true)}</div>`
  const evolution = `<div class="inspector-tab-content"><div class="section-heading"><h3>Evolución del lote</h3><p>La línea representa EV/ha y la franja inferior la condición de cada relevamiento.</p></div>${renderLotHistoryChart(lot.id,false)}</div>`
  const events = `<div class="inspector-tab-content"><div class="section-heading"><h3>Eventos del lote</h3><p>Ventas, compras, nacimientos, mortandad y recategorizaciones.</p></div>${renderLotEvents(lot.id,survey.date)}<button class="btn secondary full-width" data-add-event data-event-lot="${lot.id}">${icon('plus',16)} Registrar evento</button></div>`
  const tabContent = ui.mapInspectorTab==='evolution'?evolution:ui.mapInspectorTab==='events'?events:actual
  return `<aside class="lot-inspector v7"><button class="inspector-close" data-close-lot>${icon('close',20)}</button><span class="eyebrow">Detalle del lote</span><h2>${lot.name}</h2><p>${lot.hectares} hectáreas · ${lotEntry ? 'Observado' : 'No observado en esta fecha'}</p>${tabs}${tabContent}<div class="lot-inspector-actions"><button class="btn primary" data-edit-map-lot="${lot.id}">${icon('edit',16)} ${lotEntry ? 'Editar lote' : 'Registrar lote'}</button><button class="btn secondary" data-add-event data-event-lot="${lot.id}">${icon('event',16)} Evento</button></div><div class="lot-quick-nav"><button data-select-map-lot="${prevLot.id}" ${prevLot.id===lot.id?'disabled':''}>‹ ${prevLot.name}</button><strong>${lot.name}</strong><button data-select-map-lot="${nextLot.id}" ${nextLot.id===lot.id?'disabled':''}>${nextLot.name} ›</button></div></aside>`
}

function renderMapPage() {
  const survey = selectedSurvey()
  if (!ui.selectedLotId) ui.selectedLotId = 'ER-08-09'
  if (!ui.mapViewBox) ui.mapViewBox = viewBoxForLot(ui.selectedLotId)
  const switcher = `<div class="view-switch"><button class="${ui.mapMode==='map'?'active':''}" data-map-mode="map">${icon('map',17)} Mapa</button><button class="${ui.mapMode==='table'?'active':''}" data-map-mode="table">▦ Tabla</button></div>`
  const body = ui.mapMode === 'map'
    ? `<div class="map-page-layout"><article class="panel full-map-panel">${renderMap(survey,false)}</article>${renderLotInspector(survey)}</div>`
    : `<section class="panel map-table-panel"><div class="panel-head"><div><span class="eyebrow">Comparar y gestionar</span><h3>Todos los lotes</h3></div><span>Una línea por lote. Tocá la fila para centrarlo o el lápiz para editar.</span></div>${renderLotsDataTable(survey,'management')}</section>`
  const content = `${renderSurveyNavigator()}<section class="map-toolbar"><div><span class="eyebrow">Vista de trabajo</span><h2>${ui.mapMode==='map'?'Mapa interactivo':'Tabla de lotes'}</h2></div>${switcher}</section>${body}`
  return renderShell(content,'Mapa y lotes',`Relevamiento del ${dateLabel(survey.date)}`,`<button class="btn primary" data-start-survey>${icon('plus',17)} Nuevo</button>`)
}

function startSurvey() {
  const date = todayISO()
  const projection = projectedLotsForDate(date)
  state.draft = {
    id: uid(), nombre: state.nombre || 'Muestra', mode: 'new', editingSurveyId: null, date, rainPeriod: monthKey(date),
    basedOnSurveyId: projection.base?.id || null, projectionEventIds: projection.events.map((event) => event.id), lots: projection.lots,
    events: { births: 0, deaths: 0, purchases: 0, sales: 0 }, note: '', step: 1, lastSavedAt: new Date().toISOString(),
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
  const base = draft.basedOnSurveyId ? state.surveys.find((survey) => survey.id === draft.basedOnSurveyId) : null
  return `<section class="wizard-card narrow"><div class="wizard-title"><span class="step-number">1</span><div><h2>¿Cuándo se hizo el relevamiento?</h2><p>La app precarga el estado esperado usando el último relevamiento y los eventos registrados.</p></div></div>
    ${base ? `<div class="projection-banner">${icon('balance',18)} <span><strong>Base proyectada desde ${compactDateLabel(base.date)}</strong><small>${draft.projectionEventIds?.length || 0} eventos aplicados antes de revisar el campo.</small></span></div>` : ''}
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
    return `<article class="loaded-lot-card ${lotEntry.projected ? 'projected' : ''}"><div class="lot-card-number">${lot.name.replace('ER-','')}</div><div class="loaded-lot-content"><div><h3>${lot.name}${lotEntry.projected ? '<small>Precargado</small>' : ''}</h3><p>${quantity ? `${fmt(quantity)} animales · ${lotEntry.groups.length} ${lotEntry.groups.length===1?'grupo':'grupos'}` : 'Lote observado sin animales'}</p></div><span class="field-mini ${stateInfo.tone}">${fieldStateIcon(stateInfo)}<b>${stateInfo.label}</b></span></div><div class="lot-card-actions"><button data-edit-draft-lot="${lot.id}" aria-label="Editar">${icon('edit',18)}</button><button data-remove-draft-lot="${lot.id}" aria-label="Eliminar">${icon('trash',18)}</button></div></article>`
  }).join('') : `<div class="empty-add"><img src="./assets/${UI_ASSETS.register}"><h3>No hay lotes precargados</h3><p>Agregá un lote con animales o registralo vacío para informar su condición.</p><button class="btn primary" data-add-draft-lot>${icon('plus',18)} Registrar un lote</button></div>`
  return `<section class="wizard-card wide"><div class="wizard-title"><span class="step-number">2</span><div><h2>Revisar el estado esperado</h2><p>Los eventos ayudan a preparar esta fotografía. Editá solamente lo que cambió o no coincide con lo observado.</p></div></div>
    <div class="loaded-summary"><div><small>Lotes incluidos</small><strong>${draft.lots.length}</strong></div><div><small>Stock esperado</small><strong>${fmt(total)}</strong></div><button class="btn secondary" data-add-draft-lot>${icon('plus',18)} Agregar lote</button></div>
    <div class="loaded-lots">${cards}</div>
    <div class="wizard-actions"><button class="btn ghost" data-wizard-back>${icon('back',18)} Atrás</button><button class="btn primary large" data-step-two-next>Validar balance ${icon('chevron',18)}</button></div>
  </section>`
}

function draftAsSurvey(draft) {
  const now = new Date().toISOString()
  const previous = draft.basedOnSurveyId ? state.surveys.find((survey) => survey.id === draft.basedOnSurveyId) : previousSurvey({ id: draft.id, date: draft.date, createdAt: draft.originalCreatedAt || now })
  const intervalEvents = eventsBetween(previous?.date || null, draft.date)
  const totals = eventTotals(intervalEvents)
  return {
    id: draft.id, nombre: state.nombre || 'Muestra', date: draft.date, createdAt: draft.originalCreatedAt || now,
    editedAt: draft.mode === 'edit' ? now : null, rainPeriod: draft.rainPeriod, lots: draft.lots, archived: draft.mode === 'edit' ? Boolean(state.surveys.find((item)=>item.id===draft.editingSurveyId)?.archived) : false,
    basedOnSurveyId: draft.basedOnSurveyId || previous?.id || null,
    events: { nombre: state.nombre || 'Muestra', births: totals.birth, deaths: totals.death, purchases: totals.purchase, sales: totals.sale },
    note: draft.note,
  }
}

function renderSurveyStepThree(draft) {
  const survey = draftAsSurvey(draft)
  const metrics = surveyMetrics(survey)
  const balance = herdBalanceForSurvey(survey)
  const loadAlerts = operationalAlerts(survey)
  const unobservedLots = LOTS.filter((lot) => !draft.lots.some((item) => item.lotId === lot.id))
  const conditionSummary = LOTS.map((lot) => resolveLotCondition(survey, lot.id))
  const observedConditions = conditionSummary.filter((item) => item.source === 'observed').length
  const assumedConditions = conditionSummary.filter((item) => conditionIsAssumed(item.source)).length
  const noInfoConditions = conditionSummary.filter((item) => item.source === 'none').length
  return `<section class="wizard-card wide review-card"><div class="wizard-title"><span class="step-number">3</span><div><h2>Validá el balance y guardá</h2><p>Los eventos explican el stock esperado. La discrepancia no bloquea el relevamiento, pero queda visible.</p></div></div>
    <div class="review-hero"><div><small>Fecha</small><strong>${dateLabel(draft.date)}</strong></div><div><small>Animales observados</small><strong>${fmt(metrics.animals)}</strong></div><div><small>Carga promedio</small><strong>${decimal(metrics.load)} EV/ha</strong></div><div><small>Lotes incluidos</small><strong>${draft.lots.length} / 18</strong></div></div>
    <div class="review-grid"><article class="review-section"><h3>Balance del rodeo</h3>${renderBalancePanel(balance,false)}</article><article class="review-section"><h3>Condición de los lotes</h3><div class="condition-origin-summary"><div><strong>${observedConditions}</strong><span>observadas</span></div><div><strong>${assumedConditions}</strong><span>estimadas</span></div><div><strong>${noInfoConditions}</strong><span>sin información</span></div></div>${renderFieldStateSummary(draft)}</article></div>
    <section class="review-alerts"><div class="panel-head"><h3>Alertas operativas</h3><span>${loadAlerts.length}</span></div>${loadAlerts.length?`<div class="alert-list">${loadAlerts.map(renderAlert).join('')}</div>`:'<div class="empty-inline success">No detectamos alertas de carga.</div>'}</section>
    <details class="empty-lots"><summary>${unobservedLots.length} lotes no fueron incluidos</summary><div>${unobservedLots.map((lot)=>{const condition=resolveLotCondition(survey,lot.id);return `<span>${lot.name} · ${condition.label}${conditionIsAssumed(condition.source)?' ≈':''}</span>`}).join('')}</div></details>
    <label class="field"><span>Nota general (opcional)</span><textarea id="survey-note" rows="3" placeholder="Observaciones del relevamiento">${esc(draft.note||'')}</textarea></label>
    <div class="wizard-actions"><button class="btn ghost" data-wizard-back>${icon('back',18)} Volver a editar</button><button class="btn primary large" data-save-survey>${icon('check',18)} ${draft.mode==='edit'?'Guardar cambios':'Confirmar y guardar'}</button></div>
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
  if (ui.modal.type === 'event-form') return renderEventModal()
  if (ui.modal.type === 'survey-detail') return renderSurveyDetailModal()
  if (ui.modal.type === 'survey-history') return renderSurveyHistoryModal()
  if (ui.modal.type === 'rain-manager') return renderRainModal()
  if (ui.modal.type === 'confirm-delete-survey') return `<div class="modal-backdrop"><div class="modal small"><span class="eyebrow">Eliminación permanente</span><h2>Eliminar ${compactDateLabel(ui.modal.survey?.date)}</h2><p>Esta acción recalculará comparaciones y balances. Se recomienda exportar un respaldo antes de continuar.</p><label class="confirm-input"><span>Escribí ELIMINAR para confirmar</span><input id="delete-survey-confirm" autocomplete="off"></label><div class="modal-actions"><button class="btn ghost" data-close-modal>Cancelar</button><button class="btn danger" data-confirm-delete-survey="${ui.modal.survey?.id}">Eliminar definitivamente</button></div></div></div>`
  if (ui.modal.type === 'zero-rain-confirm') return `<div class="modal-backdrop"><div class="modal small"><span class="eyebrow">Confirmación requerida</span><h2>Ingresaste 0 mm</h2><p>¿Realmente no llovió en ${monthLabel(ui.modal.period)} o querés dejar el mes sin información?</p><div class="modal-actions stacked"><button class="btn primary" data-confirm-zero-rain>Fue realmente 0 mm</button><button class="btn secondary" data-zero-rain-no-info>No hay información</button><button class="btn ghost" data-close-modal>Cancelar</button></div></div></div>`
  if (ui.modal.type === 'confirm-reset') return `<div class="modal-backdrop"><div class="modal small"><button class="modal-close" data-close-modal>${icon('close')}</button><h2>Restablecer datos de demostración</h2><p>Se eliminarán los datos guardados en este dispositivo y se volverá a cargar la muestra de 16 meses.</p><div class="modal-actions"><button class="btn ghost" data-close-modal>Cancelar</button><button class="btn danger" data-confirm-reset>Restablecer</button></div></div></div>`
  return ''
}

function renderLotFormModal() {
  const modal = ui.modal
  const model = modal.lot
  const directSurvey = modal.context === 'direct' ? state.surveys.find((survey) => survey.id === modal.surveyId) : null
  const collection = modal.context === 'direct' ? (directSurvey?.lots || []) : (state.draft?.lots || [])
  const available = LOTS.filter((lot) => lot.id === model.lotId || !collection.some((item) => item.lotId === lot.id))
  const groups = model.groups.length ? model.groups.map((group,index)=>`<div class="animal-group-row ${group.suggested?'suggested':''}" data-group-index="${index}"><div class="group-main"><label><span>Categoría${group.suggested?'<small>Sugerida por uso</small>':''}</span><select data-group-category="${index}"><option value="">Elegir categoría</option>${categoryOptionsHtml(group.categoryId)}</select></label><label class="quantity-field"><span>Cantidad</span><input type="number" inputmode="numeric" min="0" data-group-quantity="${index}" value="${esc(group.quantity)}" placeholder="0"></label><button class="icon-button remove-group" data-remove-group="${index}" aria-label="Eliminar categoría">${icon('trash',18)}</button></div><details ${group.birthYear||group.notes?'open':''}><summary>Agregar detalle opcional</summary><div class="group-details"><label><span>Año de nacimiento</span><input type="number" min="1990" max="2035" data-group-year="${index}" value="${esc(group.birthYear||'')}" placeholder="Ej. 2025"></label><label><span>Nota</span><input type="text" data-group-notes="${index}" value="${esc(group.notes||'')}" placeholder="Ej. Listas para servicio"></label></div></details></div>`).join('') : `<div class="empty-groups"><img src="./assets/${UI_ASSETS.register}" alt=""><div><strong>Sin categorías</strong><p>Agregá una categoría o guardá el lote vacío si elegís una condición.</p></div></div>`
  const contextSurvey = directSurvey || (state.draft ? draftAsSurvey(state.draft) : selectedSurvey())
  const suggestion = model.lotId ? resolveLotCondition(contextSurvey,model.lotId) : null
  const isHistorical = directSurvey && directSurvey.id !== latestSurvey()?.id
  return `<div class="modal-backdrop"><div class="modal lot-modal"><button class="modal-close" data-close-modal>${icon('close')}</button><span class="eyebrow">Registro por lote</span><h2>${modal.isEdit?'Editar lote':'Registrar lote'}</h2>${isHistorical?`<div class="historical-edit-warning">${icon('alert',17)} Estás editando el relevamiento histórico del ${compactDateLabel(directSurvey.date)}.</div>`:''}<label class="field"><span>Lote</span><select id="modal-lot-select" ${modal.isEdit||modal.context==='direct'?'disabled':''}><option value="">Elegir lote</option>${available.map((lot)=>`<option value="${lot.id}" ${model.lotId===lot.id?'selected':''}>${lot.name} · ${lot.hectares} ha</option>`).join('')}</select></label><div class="modal-section-head"><div><h3>Categorías de animales <small>(opcional)</small></h3><p>Las sugeridas aparecen en cero. Podés cambiarlas, eliminarlas o agregar otras.</p></div><button class="btn secondary small" data-add-group>${icon('plus',17)} Agregar categoría</button></div><div class="animal-groups">${groups}</div><div class="modal-section-head field-head"><div><h3>Condición del lote</h3><p>Podés registrar un lote sin animales solamente para informar su condición.</p></div></div>${suggestion&&suggestion.source!=='observed'&&suggestion.source!=='none'?`<div class="condition-suggestion"><span>≈ Sugerencia automática</span><strong>${suggestion.label}</strong><p>${esc(suggestion.explanation)}</p></div>`:''}<div class="field-state-options">${FIELD_STATES.map((item)=>`<button class="field-state-option ${normalizeFieldState(model.fieldState)===item.id?'selected':''}" data-field-state="${item.id}">${fieldStateIcon(item)}<strong>${item.label}</strong></button>`).join('')}</div><div class="modal-actions">${modal.context==='direct'&&modal.isEdit?`<button class="btn danger-outline push-left" data-remove-direct-lot="${model.lotId}">Quitar del relevamiento</button>`:''}<button class="btn ghost" data-close-modal>Cancelar</button><button class="btn primary" data-save-lot>Guardar lote</button></div></div></div>`
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
  const mode = ui.modal.rainMode || (summary.source === 'daily' ? 'daily' : 'monthly')
  const editing = summary.entries.find((entry) => entry.id === ui.modal.entryId) || null
  const defaultDate = editing?.date || (period === monthKey(todayISO()) ? todayISO() : `${period}-01`)
  const monthlyValue = summary.source === 'monthly' ? summary.millimeters : ''
  const daily = `<div class="rain-entry-list">${summary.entries.length ? summary.entries.map((entry) => `<div><span><strong>${compactDateLabel(entry.date)}</strong><small>${esc(entry.note || 'Sin nota')}</small></span><b>${decimal(entry.millimeters,1)} mm</b><button data-edit-rain-entry="${entry.id}">${icon('edit',16)}</button><button data-delete-rain-entry="${entry.id}">${icon('trash',16)}</button></div>`).join('') : '<div class="empty-inline">No hay registros por fecha.</div>'}</div><div class="rain-entry-form"><h3>${editing ? 'Editar registro' : 'Agregar lluvia por fecha'}</h3><div class="rain-form-grid"><label><span>Fecha</span><input type="date" id="rain-entry-date" value="${defaultDate}"></label><label><span>Milímetros</span><input type="number" min="0" step="0.1" inputmode="decimal" id="rain-entry-mm" value="${editing?.millimeters ?? ''}" placeholder="0"></label></div><label><span>Nota opcional</span><input type="text" id="rain-entry-note" value="${esc(editing?.note || '')}" placeholder="Ej. Lluvia fuerte durante la noche"></label><button class="btn primary" data-save-rain-entry>${editing ? 'Guardar cambios' : 'Agregar registro'}</button></div>`
  const monthly = `<div class="monthly-rain-form"><div><small>Total actual</small><strong>${summary.millimeters == null ? 'Sin información' : `${fmt(summary.millimeters)} mm`}</strong><p>${analysis.status}${analysis.index==null?'':` · Índice hídrico ${Math.round(analysis.index)}%`}</p></div><label><span>Total mensual (mm)</span><input id="rain-monthly-mm" type="number" min="0" step="0.1" inputmode="decimal" value="${monthlyValue}" placeholder="Dejar en blanco = sin información"></label><button class="btn primary" data-save-rain-monthly>Guardar total mensual</button><p class="form-help">Si cargás un total mensual, reemplazará cualquier detalle por fecha de este mes.</p></div>`
  return `<div class="modal-backdrop"><div class="modal rain-modal"><button class="modal-close" data-close-modal>${icon('close')}</button><span class="eyebrow">Registro de lluvia · ${RAIN_STATION}</span><h2>${monthLabel(period)}</h2><label class="field compact-month"><span>Cambiar mes</span><input type="month" id="rain-period-select" value="${period}"></label><div class="rain-input-tabs"><button class="${mode==='monthly'?'active':''}" data-rain-input-mode="monthly">Total mensual</button><button class="${mode==='daily'?'active':''}" data-rain-input-mode="daily">Detalle por fecha</button></div>${mode==='monthly'?monthly:daily}<div class="modal-actions"><button class="btn danger-outline push-left" data-clear-rain-month>Dejar sin información</button><button class="btn ghost" data-close-modal>Cerrar</button></div></div></div>`
}


function historicalFortnight(month, half) {
  return RAIN_HISTORICAL_FORTNIGHTS.find((item) => item.month === Number(month) && item.half === Number(half))
}
function historicalMonth(month) {
  const rows = RAIN_HISTORICAL_FORTNIGHTS.filter((item) => item.month === Number(month))
  return { average: rows.reduce((sum, item) => sum + item.average, 0), p10: rows.reduce((sum, item) => sum + item.p10, 0), p90: rows.reduce((sum, item) => sum + item.p90, 0) }
}
function hydricIndex(actual, average) { return actual == null || !average ? null : actual / average * 100 }
function hydricState(index) { if (index == null) return 'Sin información'; if (index < 70) return 'Muy seco'; if (index < 90) return 'Seco'; if (index < 110) return 'Normal'; if (index < 130) return 'Húmedo'; return 'Muy húmedo' }
function hydricClass(index) { if (index == null) return 'no-data'; if (index < 70) return 'very-dry'; if (index < 90) return 'dry'; if (index < 110) return 'normal'; if (index < 130) return 'wet'; return 'very-wet' }
function periodFor(year, month) { return `${year}-${String(month).padStart(2, '0')}` }
function addMonths(period, offset) { const d = new Date(`${period}-01T12:00:00`); d.setMonth(d.getMonth() + offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` }
function lastPeriods(endPeriod, count = 12) { return Array.from({ length: count }, (_, index) => addMonths(endPeriod, index - count + 1)) }
function fortnightActual(year, month, half) {
  const period = periodFor(year, month)
  const entries = rainEntriesForPeriod(period).filter((entry) => half === 1 ? Number(entry.date.slice(8,10)) <= 15 : Number(entry.date.slice(8,10)) > 15)
  return entries.length ? entries.reduce((sum, entry) => sum + Number(entry.millimeters || 0), 0) : null
}
function rainCoverage(endPeriod) {
  const periods = lastPeriods(endPeriod)
  const rows = periods.map((period) => ({ period, actual: monthlyRainSummary(period).millimeters, historical: historicalMonth(Number(period.slice(5,7))) }))
  let actualCumulative = 0, averageCumulative = 0, p10Cumulative = 0, p90Cumulative = 0, coverage = 0
  return { rows: rows.map((row) => { if (row.actual != null) { actualCumulative += row.actual; coverage++ } averageCumulative += row.historical.average; p10Cumulative += row.historical.p10; p90Cumulative += row.historical.p90; return { ...row, actualCumulative: row.actual == null ? null : actualCumulative, averageCumulative, p10Cumulative, p90Cumulative, index: hydricIndex(actualCumulative, averageCumulative) } }), coverage, actual: actualCumulative, average: averageCumulative, p10: p10Cumulative, p90: p90Cumulative, index: coverage ? hydricIndex(actualCumulative, rows.filter((row) => row.actual != null).reduce((sum, row) => sum + row.historical.average, 0)) : null }
}
function rainRangeBar(actual, average, p10, p90) {
  const max = Math.max(p90, average, actual || 0, 1) * 1.08
  const pct = (value) => Math.max(0, Math.min(100, value / max * 100))
  return `<div class="rain-range"><i class="rain-range-band" style="left:${pct(p10)}%;width:${Math.max(2,pct(p90)-pct(p10))}%"></i><i class="rain-range-average" style="left:${pct(average)}%"></i>${actual == null ? '' : `<b class="rain-range-current" style="left:${pct(actual)}%"></b>`}</div>`
}
function renderRainPeriodTable(year, granularity) {
  if (granularity === 'fortnight') {
    const rows = RAIN_HISTORICAL_FORTNIGHTS.map((item) => { const actual=fortnightActual(year,item.month,item.half);const index=hydricIndex(actual,item.average);return `<tr><th>${item.monthName} · Q${item.half}</th><td>${decimal(item.average,1)}</td><td>${decimal(item.p10,1)}</td><td>${decimal(item.p90,1)}</td><td class="rain-current">${actual == null ? '—' : decimal(actual,1)}</td><td>${index == null ? '—' : `${Math.round(index)}%`}</td><td><span class="hydric-state ${hydricClass(index)}">${hydricState(index)}</span>${rainRangeBar(actual,item.average,item.p10,item.p90)}</td></tr>` }).join('')
    return `<div class="rain-table-wrap"><table class="rain-data-table"><thead><tr><th>Quincena</th><th>Prom.</th><th>P10</th><th>P90</th><th>Actual</th><th>IH</th><th>Estado / banda</th></tr></thead><tbody>${rows}</tbody></table></div>`
  }
  const rows = MONTH_NAMES.map((name,index) => { const month=index+1;const hist=historicalMonth(month);const actual=monthlyRainSummary(periodFor(year,month)).millimeters;const ih=hydricIndex(actual,hist.average);return `<tr><th>${name}</th><td>${decimal(hist.average,1)}</td><td>${decimal(hist.p10,1)}</td><td>${decimal(hist.p90,1)}</td><td class="rain-current">${actual == null ? '—' : decimal(actual,1)}</td><td>${ih == null ? '—' : `${Math.round(ih)}%`}</td><td><span class="hydric-state ${hydricClass(ih)}">${hydricState(ih)}</span>${rainRangeBar(actual,hist.average,hist.p10,hist.p90)}</td></tr>` }).join('')
  return `<div class="rain-table-wrap"><table class="rain-data-table"><thead><tr><th>Mes</th><th>Prom.</th><th>P10</th><th>P90</th><th>Actual</th><th>IH</th><th>Estado / banda</th></tr></thead><tbody>${rows}</tbody></table></div>`
}
function renderRainColumns(year, granularity) {
  const items = granularity === 'fortnight' ? RAIN_HISTORICAL_FORTNIGHTS.map((item)=>({label:`${item.monthName.slice(0,3)} Q${item.half}`,average:item.average,p10:item.p10,p90:item.p90,actual:fortnightActual(year,item.month,item.half)})) : MONTH_NAMES.map((name,index)=>{const h=historicalMonth(index+1);return {label:name.slice(0,3),...h,actual:monthlyRainSummary(periodFor(year,index+1)).millimeters}})
  const max=Math.max(1,...items.flatMap((item)=>[item.p90,item.average,item.actual||0]))
  return `<div class="rain-columns ${granularity}">${items.map((item)=>{const h=(value)=>Math.max(1,value/max*100);return `<div class="rain-column"><div class="rain-column-plot"><i class="rain-column-band" style="bottom:${h(item.p10)}%;height:${Math.max(3,h(item.p90)-h(item.p10))}%"></i><i class="rain-column-average" style="bottom:${h(item.average)}%"></i>${item.actual==null?'<b class="rain-column-empty"></b>':`<b class="rain-column-current" style="height:${h(item.actual)}%"></b>`}</div><span>${item.label}</span></div>`}).join('')}</div>`
}
function renderCumulativeChart(coverage) {
  const rows=coverage.rows;const width=900,height=260,pad=30;const max=Math.max(1,...rows.map((row)=>Math.max(row.p90Cumulative,row.actualCumulative||0)))
  const x=(index)=>pad+index*(width-pad*2)/(rows.length-1);const y=(value)=>height-pad-value/max*(height-pad*2)
  const upper=rows.map((row,index)=>`${x(index)},${y(row.p90Cumulative)}`).join(' ');const lower=[...rows].reverse().map((row,index)=>`${x(rows.length-1-index)},${y(row.p10Cumulative)}`).join(' ')
  const avg=rows.map((row,index)=>`${x(index)},${y(row.averageCumulative)}`).join(' ');const actual=rows.filter((row)=>row.actualCumulative!=null).map((row)=>{const index=rows.indexOf(row);return `${x(index)},${y(row.actualCumulative)}`}).join(' ')
  return `<svg class="cumulative-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Lluvia acumulada últimos doce meses"><polygon points="${upper} ${lower}" class="cum-band"/><polyline points="${avg}" class="cum-average"/>${actual?`<polyline points="${actual}" class="cum-actual"/>`:''}${rows.map((row,index)=>`<text x="${x(index)}" y="${height-8}" text-anchor="middle">${row.period.slice(5,7)}/${row.period.slice(2,4)}</text>`).join('')}</svg>`
}
function renderCumulativeTable(coverage) {
  const rows=coverage.rows.map((row)=>`<tr><th>${monthLabel(row.period)}</th><td>${decimal(row.averageCumulative,0)}</td><td>${decimal(row.p10Cumulative,0)}</td><td>${decimal(row.p90Cumulative,0)}</td><td class="rain-current">${row.actualCumulative==null?'—':decimal(row.actualCumulative,0)}</td><td>${row.index==null?'—':`${Math.round(row.index)}%`}</td><td><span class="hydric-state ${hydricClass(row.index)}">${hydricState(row.index)}</span></td></tr>`).join('')
  return `<div class="rain-table-wrap"><table class="rain-data-table"><thead><tr><th>Mes (últimos 12)</th><th>Prom. acum.</th><th>P10</th><th>P90</th><th>Actual acum.</th><th>IH</th><th>Estado</th></tr></thead><tbody>${rows}</tbody></table></div>`
}
function renderUpcomingSection() {
  return `<section class="upcoming-section"><div class="panel-head"><div><span class="eyebrow">Hoja de ruta</span><h3>Próximamente en Campo</h3></div><span>Ideas futuras, todavía sin funciones operativas.</span></div><div class="upcoming-grid"><article><span>💉</span><div><h4>Calendario sanitario</h4><p>Vacunaciones, desparasitaciones y tratamientos.</p><b>En desarrollo</b></div></article><article><span>🌱</span><div><h4>Calendario pastoril</h4><p>Siembras, descansos, rotaciones y objetivos de pastoreo.</p><b>En desarrollo</b></div></article><article><span>↗</span><div><h4>Calendario comercial</h4><p>Compras, ventas y momentos comerciales del rodeo.</p><b>En desarrollo</b></div></article></div></section>`
}

function renderEventCard(event) {
  const type = eventTypeLookup[event.type] || { label: event.type, icon: '•' }
  const category = categoryLookup[event.categoryId]
  const destination = categoryLookup[event.toCategoryId]
  const lot = lotLookup[event.lotId]
  return `<article class="event-card type-${event.type}"><span class="event-type-icon">${type.icon}</span><div class="event-card-main"><div><small>${eventGroupLabel(event.type)} · ${compactDateLabel(event.date)}</small><strong>${type.label} · ${fmt(event.quantity)} ${category?.short || ''}</strong><p>${lot?.name || 'Sin lote'}${destination?` · ${category?.short || ''} → ${destination.short}`:''}</p>${event.notes?`<em>${esc(event.notes)}</em>`:''}</div><div class="event-card-actions"><button data-edit-event="${event.id}" aria-label="Editar">${icon('edit',16)}</button><button data-delete-event="${event.id}" aria-label="Eliminar">${icon('trash',16)}</button></div></div></article>`
}

function renderEventsPage() {
  const survey = selectedSurvey()
  const balance = herdBalanceForSurvey(survey)
  const all = activeAnimalEvents()
  const filtered = ui.eventFilter === 'all' ? all : all.filter((event) => event.type === ui.eventFilter)
  const totals = eventTotals(eventsForSurveyInterval(survey))
  const actionButtons = EVENT_TYPES.map((type)=>`<button class="event-action type-${type.id}" data-add-event="${type.id}"><span>${type.icon}</span><strong>${type.label}</strong><small>${type.group==='commercial'?'Comercial':'Cambio del rodeo'}</small></button>`).join('')
  const filters = `<div class="event-filters"><button class="${ui.eventFilter==='all'?'active':''}" data-event-filter="all">Todos</button>${EVENT_TYPES.map((type)=>`<button class="${ui.eventFilter===type.id?'active':''}" data-event-filter="${type.id}">${type.label}</button>`).join('')}</div>`
  const content = `${renderSurveyNavigator()}<section class="events-hero"><div><span class="eyebrow">Entre fotografías del campo</span><h2>Eventos del rodeo</h2><p>Los eventos preparan el stock esperado del siguiente relevamiento sin modificar una fotografía ya cerrada.</p></div><button class="btn primary" data-add-event="sale">${icon('plus',17)} Registrar evento</button></section><section class="event-summary-grid"><article><small>Nacimientos</small><strong>+${fmt(totals.birth)}</strong></article><article><small>Compras</small><strong>+${fmt(totals.purchase)}</strong></article><article><small>Ventas</small><strong>-${fmt(totals.sale)}</strong></article><article><small>Mortandad</small><strong>-${fmt(totals.death)}</strong></article><article><small>Recateg.</small><strong>${fmt(totals.reclassification)}</strong></article></section><section class="events-layout"><article class="panel"><div class="panel-head"><div><span class="eyebrow">Acciones rápidas</span><h3>Registrar cambios</h3></div></div><div class="event-action-grid">${actionButtons}</div></article><article class="panel balance-main-panel"><div class="panel-head"><div><span class="eyebrow">Mes sobre mes</span><h3>Balance del rodeo</h3></div><span>${balance?`${compactDateLabel(balance.previous.date)} → ${compactDateLabel(balance.survey.date)}`:'Sin período anterior'}</span></div>${renderBalancePanel(balance,false)}</article></section><section class="panel event-log-panel"><div class="panel-head"><div><span class="eyebrow">Registro transaccional</span><h3>Historial de eventos</h3></div><span>${filtered.length} registros</span></div>${filters}<div class="event-list">${filtered.length?filtered.map(renderEventCard).join(''):'<div class="empty-inline">No hay eventos para este filtro.</div>'}</div></section>`
  return renderShell(content,'Eventos y balance','Ventas, compras, nacimientos, mortandad y recategorizaciones',`<button class="btn primary" data-start-survey>${icon('clipboard',17)} Siguiente relevamiento</button>`)
}

function renderEventModal() {
  const modal = ui.modal
  const event = modal.event || {}
  const type = event.type || modal.eventType || 'sale'
  const isReclassification = type === 'reclassification'
  const isCommercial = ['sale','purchase'].includes(type)
  const isBirth = type === 'birth'
  const allowedBirth = ['ternero-macho','ternera-hembra','ternero-sin-definir']
  const categoryOptions = categoryOptionsHtml(event.categoryId || '', isBirth ? allowedBirth : null)
  const available = event.lotId && event.categoryId && ['sale','death','reclassification'].includes(type) ? availableCategoryQuantity(event.date || todayISO(), event.lotId, event.categoryId, event.id) : null
  return `<div class="modal-backdrop"><div class="modal event-modal"><button class="modal-close" data-close-modal>${icon('close')}</button><span class="eyebrow">${modal.isEdit?'Editar evento':'Nuevo evento'}</span><h2>${eventTypeLabel(type)}</h2><div class="event-form-grid"><label><span>Tipo</span><select id="event-type">${EVENT_TYPES.map((item)=>`<option value="${item.id}" ${type===item.id?'selected':''}>${item.label}</option>`).join('')}</select></label><label><span>Fecha</span><input type="date" id="event-date" value="${event.date || todayISO()}"></label><label><span>Lote</span><select id="event-lot"><option value="">Elegir lote</option>${LOTS.map((lot)=>`<option value="${lot.id}" ${event.lotId===lot.id?'selected':''}>${lot.name}</option>`).join('')}</select></label><label><span>${isReclassification?'Categoría de origen':'Categoría'}</span><select id="event-category"><option value="">Elegir categoría</option>${categoryOptions}</select></label>${isReclassification?`<label><span>Categoría de destino</span><select id="event-to-category"><option value="">Elegir destino</option>${categoryOptionsHtml(event.toCategoryId || '')}</select></label>`:''}<label><span>Cantidad</span><input type="number" min="1" inputmode="numeric" id="event-quantity" value="${event.quantity || ''}" placeholder="0">${available!=null?`<small>Disponible proyectado: ${fmt(available)}</small>`:''}</label></div>${isCommercial?`<details class="commercial-details" ${event.pricePerHead||event.counterparty?'open':''}><summary>Agregar datos comerciales</summary><div class="event-form-grid"><label><span>Precio por cabeza</span><input type="number" min="0" step="0.01" id="event-price" value="${event.pricePerHead || ''}"></label><label><span>${type==='sale'?'Comprador':'Vendedor'}</span><input type="text" id="event-counterparty" value="${esc(event.counterparty || '')}"></label></div></details>`:''}<label class="field"><span>Nota opcional</span><textarea id="event-notes" rows="3">${esc(event.notes || '')}</textarea></label><div class="modal-actions"><button class="btn ghost" data-close-modal>Cancelar</button><button class="btn primary" data-save-event>${modal.isEdit?'Guardar cambios':'Registrar evento'}</button></div></div></div>`
}

function renderIntroductionPage() {
  const quickLinks = `<div class="intro-quick-links"><button data-nav="eventos">${icon('event',20)} Eventos</button><button data-nav="mapa">${icon('map',20)} Mapa</button><button data-nav="lluvias">${icon('rain',20)} Lluvias</button><button data-nav="historico">${icon('history',20)} Histórico</button><button data-nav="datos">${icon('download',20)} Respaldo</button></div>`
  const content = `<section class="intro-hero"><div><span class="eyebrow">Guía de Campo v8.01</span><h2>De los eventos a la próxima fotografía</h2><p>Campo separa lo observado de lo ocurrido. El relevamiento es una fotografía; los eventos explican cómo debería evolucionar el rodeo.</p>${state.sampleMode?'<span class="sample-badge large">MODO MUESTRA · 16 MESES</span>':''}</div><img src="./assets/${UI_ASSETS.home}" alt="El Rosario"></section>${quickLinks}<section class="intro-steps"><article><i>1</i><div><h3>Revisá el resumen</h3><p>El terreno representa condición, el borde la carga y los sprites la cantidad y composición.</p></div></article><article><i>2</i><div><h3>Registrá eventos</h3><p>Ventas, compras, nacimientos, mortandad y recategorizaciones actualizan el estado esperado.</p></div></article><article><i>3</i><div><h3>Creá el siguiente relevamiento</h3><p>La app precarga el stock proyectado. Corregí lo que no coincida con lo observado.</p></div></article><article><i>4</i><div><h3>Validá el balance</h3><p>Compará stock esperado y observado; la discrepancia queda visible sin bloquear el guardado.</p></div></article></section><section class="intro-grid"><article class="panel"><h3>Conceptos básicos</h3><dl><dt>Relevamiento</dt><dd>Fotografía observada del campo en una fecha.</dd><dt>Evento</dt><dd>Cambio ocurrido entre dos relevamientos.</dd><dt>Estado esperado</dt><dd>Relevamiento anterior más los eventos.</dd><dt>Discrepancia</dt><dd>Diferencia entre stock esperado y observado.</dd><dt>Condición</dt><dd>Estado visual del terreno.</dd><dt>Carga</dt><dd>Equivalentes animales por hectárea.</dd></dl></article><article class="panel"><h3>Novedades de v8.01</h3><ul><li>Rodeos vivos con movimiento continuo.</li><li>Animación estable sin apariciones ni desapariciones.</li><li>Zoom y desplazamiento también en el resumen.</li><li>Motor desacoplado para mejorar sprites en futuras versiones.</li><li>Datos sintéticos de 16 meses preestablecidos.</li><li>Todos los eventos y balances de v7.01.</li></ul></article><article class="panel"><h3>Próximamente</h3><ul><li>Calendario de vacunación.</li><li>Calendario de pasturas.</li><li>Calendario comercial.</li><li>Movimientos entre lotes.</li><li>Sincronización con Supabase.</li></ul></article></section>`
  return renderShell(content,'Introducción','Cómo usar Campo y qué mejoras están por venir')
}

function renderRainPage() {
  const survey=selectedSurvey();const selectedPeriod=ui.rainEndPeriod||monthKey(survey?.date||todayISO());const year=Number(ui.rainYear||selectedPeriod.slice(0,4));const coverage=rainCoverage(selectedPeriod);const last=allRainPeriods().sort().at(-1);const lastSummary=last?monthlyRainSummary(last):null
  const top=`<section class="rain-kpi-grid"><article><span>☔</span><div><small>Acumulado informado</small><strong>${coverage.coverage?`${fmt(coverage.actual)} mm`:'Sin dato'}</strong><p>${coverage.coverage}/12 meses informados</p></div></article><article><span>◉</span><div><small>Índice hídrico</small><strong>${coverage.index==null?'—':`${Math.round(coverage.index)}%`}</strong><p>${hydricState(coverage.index)}</p></div></article><article><span>▣</span><div><small>Último registro</small><strong>${last?monthLabel(last):'Sin dato'}</strong><p>${lastSummary?.millimeters==null?'—':`${fmt(lastSummary.millimeters)} mm`}</p></div></article></section>`
  const tabs=`<div class="rain-main-tabs"><button class="${ui.rainTab==='period'?'active':''}" data-rain-tab="period">Lluvia del período</button><button class="${ui.rainTab==='cumulative'?'active':''}" data-rain-tab="cumulative">Acumulado 12 meses</button></div>`
  const periodView=`<section class="rain-workspace"><article class="panel"><div class="panel-head"><div><span class="eyebrow">Comparación histórica</span><h3>${ui.rainGranularity==='monthly'?'Registro mensual':'Detalle quincenal'} · ${year}</h3></div><div class="rain-controls"><select data-rain-year>${[year-2,year-1,year,year+1].map((item)=>`<option ${item===year?'selected':''}>${item}</option>`).join('')}</select><div class="mini-toggle"><button class="${ui.rainGranularity==='monthly'?'active':''}" data-rain-granularity="monthly">Mensual</button><button class="${ui.rainGranularity==='fortnight'?'active':''}" data-rain-granularity="fortnight">Quincenal</button></div><button class="btn primary small" data-open-rain="${periodFor(year,Number(selectedPeriod.slice(5,7)))}">Cargar / editar</button></div></div>${renderRainPeriodTable(year,ui.rainGranularity)}</article><article class="panel rain-chart-panel"><div class="panel-head"><div><h3>Banda histórica y registro actual</h3><p>P10–P90, promedio y lluvia actual en milímetros.</p></div></div>${renderRainColumns(year,ui.rainGranularity)}</article></section>`
  const cumulativeView=`<section class="rain-workspace"><article class="panel"><div class="panel-head"><div><span class="eyebrow">Últimos doce meses</span><h3>Acumulado hasta ${monthLabel(selectedPeriod)}</h3></div><label class="inline-control">Finaliza en <input type="month" data-rain-end-period value="${selectedPeriod}"></label></div>${renderCumulativeTable(coverage)}</article><article class="panel rain-chart-panel"><div class="panel-head"><div><h3>Curva acumulada</h3><p>Actual frente al promedio y la banda histórica aproximada.</p></div></div>${renderCumulativeChart(coverage)}</article></section>`
  return renderShell(`${top}${tabs}${ui.rainTab==='period'?periodView:cumulativeView}${renderUpcomingSection()}`,'Lluvias — Estación Laprida','Comparación histórica, índice hídrico y acumulado de los últimos doce meses',`<button class="btn primary" data-open-rain="${selectedPeriod}">${icon('plus',17)} Registrar lluvia</button>`)
}

function renderHistory() {
  const surveys = sortedSurveys(ui.historyShowArchived)
  const active = surveys.filter((survey)=>!survey.archived)
  const maxAnimals = Math.max(...active.map((survey)=>surveyMetrics(survey).animals),1)
  const rows = surveys.map((survey,index)=>{const m=surveyMetrics(survey);const prior=previousSurvey(survey);const diff=prior?m.animals-surveyMetrics(prior).animals:null;return `<article class="survey-row-card ${survey.archived?'archived':''}"><button class="survey-row-main" data-detail-survey="${survey.id}"><span class="survey-index">${surveys.length-index}</span><div><strong>${dateLabel(survey.date)}${survey.archived?' · Archivado':''}</strong><p>${survey.lots.length} lotes · ${decimal(m.load)} EV/ha</p></div><div class="survey-total"><strong>${fmt(m.animals)}</strong><small>${diff==null?'Inicial':`${diff>=0?'+':''}${fmt(diff)} vs. anterior`}</small></div></button><div class="survey-row-actions"><button data-edit-survey="${survey.id}">${icon('edit',16)} Editar</button><button data-archive-survey="${survey.id}">${icon(survey.archived?'restore':'archive',16)} ${survey.archived?'Restaurar':'Archivar'}</button><button class="danger" data-delete-survey="${survey.id}">${icon('trash',16)} Eliminar</button></div></article>`}).join('')
  const content = `<section class="history-header"><div><span class="eyebrow">Fotografías del campo</span><h2>Historial de relevamientos</h2><p>Archivar es reversible; eliminar es permanente.</p></div><div class="button-row"><label class="history-archive-toggle"><input type="checkbox" data-show-archived ${ui.historyShowArchived?'checked':''}> Mostrar archivados</label><button class="btn primary" data-start-survey>${icon('plus',18)} Nuevo relevamiento</button></div></section><section class="history-grid"><article class="panel"><div class="panel-head"><h3>Evolución de animales</h3><span>${active.length} activos</span></div><div class="survey-chart">${[...active].reverse().map((survey)=>{const m=surveyMetrics(survey);return `<button data-detail-survey="${survey.id}" title="${dateLabel(survey.date)}"><i style="height:${Math.max(8,m.animals/maxAnimals*100)}%"></i><span>${fmt(m.animals)}</span><small>${survey.date.slice(5)}</small></button>`}).join('')}</div></article><article class="panel"><div class="panel-head"><h3>Balance más reciente</h3><button class="text-link" data-nav="eventos">Abrir eventos</button></div>${renderBalancePanel(herdBalanceForSurvey(latestSurvey()),true)}</article></section><section class="panel survey-list-panel"><div class="panel-head"><h3>${ui.historyShowArchived?'Todos los registros':'Relevamientos activos'}</h3><button class="text-link" data-open-survey-history>Selector por fecha</button></div><div class="survey-list v7">${rows||'<div class="empty-inline">No hay relevamientos.</div>'}</div></section>`
  return renderShell(content,'Histórico','Editar, archivar o eliminar fotografías del campo')
}

function renderSurveyDetailModal() {
  const survey = state.surveys.find((item) => item.id === ui.modal.surveyId)
  if (!survey) return ''
  const m = surveyMetrics(survey)
  const balance = herdBalanceForSurvey(survey)
  return `<div class="modal-backdrop"><div class="modal detail-modal"><button class="modal-close" data-close-modal>${icon('close')}</button><span class="eyebrow">Relevamiento ${survey.archived?'archivado':'guardado'}</span><h2>${dateLabel(survey.date)}</h2>${survey.editedAt?`<p class="edited-note">Última edición: ${new Intl.DateTimeFormat('es-AR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(survey.editedAt))}</p>`:''}<div class="review-hero"><div><small>Animales</small><strong>${fmt(m.animals)}</strong></div><div><small>Carga</small><strong>${decimal(m.load)} EV/ha</strong></div><div><small>Lotes</small><strong>${survey.lots.length}</strong></div></div>${renderCategoryBars(m.categories,m.animals)}<h3>Balance</h3>${renderBalancePanel(balance,true)}<div class="modal-actions wrap"><button class="btn secondary" data-export-survey="${survey.id}">Exportar CSV</button><button class="btn secondary" data-edit-survey="${survey.id}">${icon('edit',16)} Editar</button><button class="btn secondary" data-archive-survey="${survey.id}">${icon(survey.archived?'restore':'archive',16)} ${survey.archived?'Restaurar':'Archivar'}</button><button class="btn danger-outline" data-delete-survey="${survey.id}">${icon('trash',16)} Eliminar</button><button class="btn primary" data-select-survey="${survey.id}" data-close-after>Ver en mapa</button></div></div></div>`
}

function renderDataPage() {
  const survey = selectedSurvey(), latest = latestSurvey()
  const content = `<section class="data-page-grid"><article class="panel data-card"><span class="data-icon">${icon('download',26)}</span><h2>Exportar datos</h2><p>Descargá relevamientos, eventos y el historial completo.</p><div class="stack-buttons"><button class="btn primary" data-export-latest>Relevamiento seleccionado CSV</button><button class="btn secondary" data-export-all>Historial completo CSV</button><button class="btn secondary" data-export-events>Eventos CSV</button></div></article><article class="panel data-card"><span class="data-icon">${icon('clipboard',26)}</span><h2>Respaldo completo</h2><p>El JSON conserva relevamientos, eventos, lluvia y configuración.</p><div class="stack-buttons"><button class="btn primary" data-export-backup>Descargar respaldo</button><label class="btn secondary file-button">Restaurar respaldo<input type="file" id="import-backup" accept="application/json"></label></div></article><article class="panel data-card version-card"><span class="data-icon"><img src="./assets/${UI_ASSETS.home}" alt=""></span><h2>Información de la app</h2><p><strong>Campo v${APP_VERSION_LABEL}</strong><br>Publicación: ${RELEASE_DATE}<br>Datos más recientes: ${latest?dateLabel(latest.date):'Sin datos'}<br>Eventos: ${(state.animalEvents||[]).length}</p><small>${state.sampleMode?'Datos sintéticos identificados como Muestra.':'Datos locales del usuario.'}</small></article><article class="panel data-card warning-card"><span class="data-icon">${icon('alert',26)}</span><h2>Datos de muestra</h2><p>Podés restablecer los 16 meses sintéticos preestablecidos para probar todas las funciones de v8.01.</p><button class="btn danger-outline" data-reset-demo>Restablecer Muestra</button></article></section>`
  return renderShell(content,'Exportar y respaldo','Protegé relevamientos, eventos y lluvia')
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

function eventsCsv() {
  const rows = [['fecha','tipo','lote','categoria_origen','categoria_destino','cantidad','precio_por_cabeza','contraparte','nota','nombre']]
  for (const event of activeAnimalEvents().sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')))) {
    rows.push([event.date,eventTypeLabel(event.type),lotLookup[event.lotId]?.name||event.lotId,categoryLookup[event.categoryId]?.name||event.categoryId,categoryLookup[event.toCategoryId]?.name||event.toCategoryId||'',event.quantity,event.pricePerHead||'',event.counterparty||'',event.notes||'',event.nombre||state.nombre||'Muestra'])
  }
  return rows.map((row)=>row.map((cell)=>`"${String(cell ?? '').replaceAll('"','""')}"`).join(',')).join('\n')
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
  if (!['resumen','relevamiento','eventos','mapa','lluvias','historico','intro','datos'].includes(ui.view)) ui.view='resumen'
  let html = ''
  if (ui.view === 'resumen') html = renderDashboard()
  if (ui.view === 'relevamiento') html = renderSurveyWizard()
  if (ui.view === 'eventos') html = renderEventsPage()
  if (ui.view === 'mapa') html = renderMapPage()
  if (ui.view === 'lluvias') html = renderRainPage()
  if (ui.view === 'historico') html = renderHistory()
  if (ui.view === 'intro') html = renderIntroductionPage()
  if (ui.view === 'datos') html = renderDataPage()
  document.getElementById('app').innerHTML = html
  bindEvents()
  animalAnimator.mount(document)
}

function bindEvents() {
  document.querySelectorAll('[data-nav]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.nav)))
  document.querySelectorAll('[data-map-mode]').forEach((button) => button.addEventListener('click', () => { ui.mapMode=button.dataset.mapMode; if(ui.mapMode==='map' && ui.selectedLotId) ui.mapViewBox=viewBoxForLot(ui.selectedLotId); render() }))
  document.querySelectorAll('[data-open-map-table]').forEach((button) => button.addEventListener('click', () => { ui.mapMode='table'; navigate('mapa') }))
  document.querySelectorAll('[data-table-lot]').forEach((button) => button.addEventListener('click', (event) => { if (event.target.closest('[data-edit-table-lot]')) return; focusMapLot(button.dataset.tableLot); ui.mapMode='map'; navigate('mapa') }))
  document.querySelectorAll('[data-select-map-lot]').forEach((button) => button.addEventListener('click', () => { focusMapLot(button.dataset.selectMapLot); render() }))
  document.querySelectorAll('[data-edit-table-lot]').forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); const survey=selectedSurvey(); const lotId=button.dataset.editTableLot; const existing=(survey.lots||[]).find((item)=>item.lotId===lotId); ui.modal={type:'lot-form',context:'direct',surveyId:survey.id,isEdit:Boolean(existing),originalLotId:lotId,lot:existing?lotFormModel(existing,true):lotFormModel({lotId,fieldState:'no-observado',conditionSource:'unobserved',groups:[]},true)}; render() }))
  document.querySelectorAll('[data-alert-lots]').forEach((button) => button.addEventListener('click', () => { focusMapLot(button.dataset.alertLots.split(',')[0]); ui.mapMode='map'; navigate('mapa') }))
  document.querySelectorAll('[data-rain-tab]').forEach((button) => button.addEventListener('click', () => { ui.rainTab=button.dataset.rainTab; render() }))
  document.querySelectorAll('[data-rain-granularity]').forEach((button) => button.addEventListener('click', () => { ui.rainGranularity=button.dataset.rainGranularity; render() }))
  document.querySelectorAll('[data-rain-year]').forEach((select) => select.addEventListener('change', () => { ui.rainYear=Number(select.value); render() }))
  document.querySelectorAll('[data-rain-end-period]').forEach((input) => input.addEventListener('change', () => { ui.rainEndPeriod=input.value; render() }))
  document.querySelectorAll('[data-start-survey]').forEach((button) => button.addEventListener('click', startSurvey))
  document.querySelectorAll('[data-edit-selected-survey]').forEach((button) => button.addEventListener('click', () => editSurvey(selectedSurvey()?.id)))
  document.querySelectorAll('[data-edit-survey]').forEach((button) => button.addEventListener('click', () => { ui.modal = null; editSurvey(button.dataset.editSurvey) }))
  document.querySelectorAll('[data-open-survey-history]').forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); ui.modal = { type: 'survey-history' }; render() }))
  document.querySelectorAll('[data-survey-older]').forEach((button) => button.addEventListener('click', () => { const target=surveyNavigation().older; if(target){state.selectedSurveyId=target.id;ui.selectedLotId=null;ui.mapViewBox=null;saveState();render()} }))
  document.querySelectorAll('[data-survey-newer]').forEach((button) => button.addEventListener('click', () => { const target=surveyNavigation().newer; if(target){state.selectedSurveyId=target.id;ui.selectedLotId=null;ui.mapViewBox=null;saveState();render()} }))
  document.querySelectorAll('[data-view-latest]').forEach((button) => button.addEventListener('click', () => { const target=latestSurvey(); if(target){state.selectedSurveyId=target.id;ui.selectedLotId=null;ui.mapViewBox=null;saveState();render()} }))
  document.querySelectorAll('[data-map-lot]').forEach((element) => element.addEventListener('click', () => { const svg=element.closest('svg[data-map-svg]'); if(svg?.dataset.suppressClick==='1') return; focusMapLot(element.dataset.mapLot); ui.mapMode='map'; if (ui.view !== 'mapa') navigate('mapa'); else render() }))
  document.querySelectorAll('[data-lot]').forEach((element) => element.addEventListener('click', () => { focusMapLot(element.dataset.lot); ui.mapMode='map'; navigate('mapa') }))
  document.querySelectorAll('[data-close-lot]').forEach((button) => button.addEventListener('click', () => { ui.selectedLotId=null; ui.mapInspectorTab='actual'; render() }))
  document.querySelectorAll('[data-edit-map-lot]').forEach((button) => button.addEventListener('click', () => {
    const survey = selectedSurvey()
    const lotId = button.dataset.editMapLot
    const existing = (survey.lots || []).find((item) => item.lotId === lotId)
    ui.modal = { type:'lot-form', context:'direct', surveyId:survey.id, isEdit:Boolean(existing), originalLotId:lotId, lot:existing ? lotFormModel(existing, true) : lotFormModel({ lotId, fieldState:'no-observado', conditionSource:'unobserved', groups:[] }, true) }
    render()
  }))
  document.querySelectorAll('[data-select-survey]').forEach((button) => button.addEventListener('click', () => { state.selectedSurveyId=button.dataset.selectSurvey; ui.selectedLotId=null; ui.mapViewBox=null; saveState(); if (button.dataset.closeAfter !== undefined) ui.modal=null; render() }))
  document.querySelectorAll('[data-detail-survey]').forEach((button) => button.addEventListener('click', () => { ui.modal={type:'survey-detail',surveyId:button.dataset.detailSurvey}; render() }))
  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => { ui.modal=null; render() }))
  document.querySelectorAll('[data-cancel-survey]').forEach((button) => button.addEventListener('click', () => { if(confirm('¿Cancelar este relevamiento? Se perderá el borrador.')) { state.draft=null; saveState(); navigate('resumen') } }))

  const dateInput = document.getElementById('survey-date')
  if (dateInput) dateInput.addEventListener('change', (event) => {
    const nextDate=event.target.value
    state.draft.date=nextDate; state.draft.rainPeriod=monthKey(nextDate)
    if(state.draft.mode==='new') { const projection=projectedLotsForDate(nextDate); state.draft.basedOnSurveyId=projection.base?.id||null; state.draft.projectionEventIds=projection.events.map((item)=>item.id); state.draft.lots=projection.lots }
    state.draft.lastSavedAt=new Date().toISOString(); saveState(); render()
  })
  document.querySelectorAll('[data-step-one-next]').forEach((button) => button.addEventListener('click', () => { if(!state.draft.date) return alert('Elegí una fecha.'); state.draft.step=2; saveState(); render() }))
  document.querySelectorAll('[data-wizard-back]').forEach((button) => button.addEventListener('click', () => { state.draft.step=Math.max(1,(state.draft.step||1)-1); saveState(); render() }))
  document.querySelectorAll('[data-step-two-next]').forEach((button) => button.addEventListener('click', () => { state.draft.step=3; saveState(); render() }))
  document.querySelectorAll('[data-add-draft-lot]').forEach((button) => button.addEventListener('click', () => { ui.modal={type:'lot-form',context:'draft',isEdit:false,lot:lotFormModel({lotId:'',fieldState:'no-observado',conditionSource:'unobserved',groups:[]}, true)}; render() }))
  document.querySelectorAll('[data-edit-draft-lot]').forEach((button) => button.addEventListener('click', () => { const existing=state.draft.lots.find((item)=>item.lotId===button.dataset.editDraftLot); ui.modal={type:'lot-form',context:'draft',isEdit:true,originalLotId:existing.lotId,lot:lotFormModel(existing, true)}; render() }))
  document.querySelectorAll('[data-remove-draft-lot]').forEach((button) => button.addEventListener('click', () => { if(confirm(`¿Eliminar ${lotLookup[button.dataset.removeDraftLot].name} del relevamiento?`)){state.draft.lots=state.draft.lots.filter((item)=>item.lotId!==button.dataset.removeDraftLot);saveState();render()} }))
  const modalLotSelect = document.getElementById('modal-lot-select')
  if (modalLotSelect) modalLotSelect.addEventListener('change', (event) => { ui.modal.lot.lotId = event.target.value; render() })
  document.querySelectorAll('[data-add-group]').forEach((button) => button.addEventListener('click', () => { ui.modal.lot.groups.push({id:uid(),categoryId:'',quantity:0,birthYear:'',notes:'',suggested:false}); render() }))
  document.querySelectorAll('[data-remove-group]').forEach((button) => button.addEventListener('click', () => { ui.modal.lot.groups.splice(Number(button.dataset.removeGroup),1); render() }))
  document.querySelectorAll('[data-field-state]').forEach((button) => button.addEventListener('click', () => { ui.modal.lot.fieldState=button.dataset.fieldState; ui.modal.lot.conditionSource=button.dataset.fieldState==='no-observado'?'unobserved':'observed'; render() }))
  document.querySelectorAll('[data-group-category],[data-group-quantity],[data-group-year],[data-group-notes]').forEach((input) => input.addEventListener('input', (event) => renderLotFormModalEventUpdate(event.target)))
  document.querySelectorAll('[data-save-lot]').forEach((button) => button.addEventListener('click', () => {
    const select=document.getElementById('modal-lot-select'); if(select) ui.modal.lot.lotId=select.value
    if(!ui.modal.lot.lotId) return alert('Elegí un lote.')
    const invalid = ui.modal.lot.groups.some((group) => Number(group.quantity) > 0 && !group.categoryId)
    if (invalid) return alert('Elegí una categoría para cada cantidad mayor que cero.')
    const validGroups=ui.modal.lot.groups.filter((group)=>group.categoryId && Number(group.quantity)>0).map((group)=>({id:group.id||uid(),categoryId:group.categoryId,quantity:Math.round(Number(group.quantity)),birthYear:group.birthYear?Number(group.birthYear):'',notes:String(group.notes||'').trim()}))
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

  document.querySelectorAll('[data-open-rain]').forEach((button)=>button.addEventListener('click',(event)=>{event.stopPropagation();ui.modal={type:'rain-manager',period:button.dataset.openRain||monthKey(selectedSurvey()?.date||todayISO()),entryId:null,rainMode:'monthly'};render()}))
  const rainPeriod=document.getElementById('rain-period-select');if(rainPeriod)rainPeriod.addEventListener('change',(event)=>{ui.modal.period=event.target.value;ui.modal.entryId=null;render()})
  document.querySelectorAll('[data-rain-input-mode]').forEach((button)=>button.addEventListener('click',()=>{ui.modal.rainMode=button.dataset.rainInputMode;ui.modal.entryId=null;render()}))
  document.querySelectorAll('[data-save-rain-monthly]').forEach((button)=>button.addEventListener('click',()=>{const raw=document.getElementById('rain-monthly-mm')?.value;const period=ui.modal.period;if(raw===''){state.rain=(state.rain||[]).filter((item)=>item.period!==period);state.rainEntries=(state.rainEntries||[]).filter((entry)=>monthKey(entry.date)!==period);saveState();ui.modal=null;showToast('Mes dejado sin información');render();return}const mm=Number(raw);if(!Number.isFinite(mm)||mm<0)return alert('Ingresá un valor válido.');if(mm===0){ui.modal={type:'zero-rain-confirm',period,value:0};render();return}state.rainEntries=(state.rainEntries||[]).filter((entry)=>monthKey(entry.date)!==period);const record={period,millimeters:mm};state.rain=(state.rain||[]).some((item)=>item.period===period)?state.rain.map((item)=>item.period===period?record:item):[...(state.rain||[]),record];saveState();ui.modal=null;showToast('Lluvia mensual actualizada');render()}))
  document.querySelectorAll('[data-confirm-zero-rain]').forEach((button)=>button.addEventListener('click',()=>{const period=ui.modal.period;state.rainEntries=(state.rainEntries||[]).filter((entry)=>monthKey(entry.date)!==period);const record={period,millimeters:0};state.rain=(state.rain||[]).some((item)=>item.period===period)?state.rain.map((item)=>item.period===period?record:item):[...(state.rain||[]),record];saveState();ui.modal=null;showToast('0 mm confirmado');render()}))
  document.querySelectorAll('[data-zero-rain-no-info]').forEach((button)=>button.addEventListener('click',()=>{const period=ui.modal.period;state.rain=(state.rain||[]).filter((item)=>item.period!==period);state.rainEntries=(state.rainEntries||[]).filter((entry)=>monthKey(entry.date)!==period);saveState();ui.modal=null;showToast('Mes marcado sin información');render()}))
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
  bindV7Interactions()
}


function eventFormValue(id) { return document.getElementById(id)?.value ?? '' }

function collectEventForm() {
  const type=eventFormValue('event-type') || ui.modal?.eventType || 'sale'
  return {
    id: ui.modal?.event?.id || uid(), nombre: state.nombre || 'Muestra', type,
    date: eventFormValue('event-date'), lotId: eventFormValue('event-lot'), categoryId: eventFormValue('event-category'),
    toCategoryId: type==='reclassification' ? eventFormValue('event-to-category') : '',
    quantity: Math.max(0,Math.round(Number(eventFormValue('event-quantity'))||0)),
    pricePerHead: ['sale','purchase'].includes(type) && eventFormValue('event-price')!=='' ? Number(eventFormValue('event-price')) : '',
    counterparty: ['sale','purchase'].includes(type) ? String(eventFormValue('event-counterparty')||'').trim() : '',
    notes: String(eventFormValue('event-notes')||'').trim(), createdAt: ui.modal?.event?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(), archived:false,
  }
}

function validateEventRecord(event) {
  if(!event.date) return 'Elegí una fecha.'
  if(!event.lotId) return 'Elegí un lote.'
  if(!event.categoryId) return 'Elegí una categoría.'
  if(!event.quantity || event.quantity < 1) return 'Ingresá una cantidad mayor que cero.'
  if(event.type==='reclassification' && (!event.toCategoryId || event.toCategoryId===event.categoryId)) return 'Elegí una categoría de destino diferente.'
  if(['sale','death','reclassification'].includes(event.type)) {
    const available=availableCategoryQuantity(event.date,event.lotId,event.categoryId,event.id)
    if(event.quantity>available) return `La cantidad supera el stock proyectado disponible (${fmt(available)}).`
  }
  return ''
}

function bindMapPanAndZoom() {
  const bindOne = (svg) => {
    const type = svg.dataset.mapSvg === 'summary' ? 'summary' : 'full'
    const readBox = () => type === 'summary' ? currentSummaryViewBox() : currentMapViewBox()
    const writeBox = (box) => { if (type === 'summary') ui.summaryViewBox = clampViewBox(box); else ui.mapViewBox = clampViewBox(box) }
    const zoom = (factor, anchorX=.5, anchorY=.5) => { if (type === 'summary') zoomSummaryMap(factor,anchorX,anchorY); else zoomMap(factor,anchorX,anchorY) }
    document.querySelectorAll(`[data-map-zoom-in="${type}"]`).forEach((button)=>button.addEventListener('click',()=>{zoom(.78);render()}))
    document.querySelectorAll(`[data-map-zoom-out="${type}"]`).forEach((button)=>button.addEventListener('click',()=>{zoom(1.28);render()}))
    document.querySelectorAll(`[data-map-view-all="${type}"]`).forEach((button)=>button.addEventListener('click',()=>{writeBox(fullMapViewBox());render()}))
    if(type==='full') document.querySelectorAll('[data-map-focus-selected]').forEach((button)=>button.addEventListener('click',()=>{ui.mapViewBox=viewBoxForLot(ui.selectedLotId||'ER-08-09');render()}))
    svg.addEventListener('wheel',(event)=>{
      event.preventDefault()
      const rect=svg.getBoundingClientRect(), ax=(event.clientX-rect.left)/rect.width, ay=(event.clientY-rect.top)/rect.height
      zoom(event.deltaY<0?.82:1.22,ax,ay); render()
    },{passive:false})

    const pointers = new Map()
    let drag = null
    let pinch = null
    let moved = false
    const applyBox = (box) => {
      const clamped=clampViewBox(box); writeBox(clamped)
      svg.setAttribute('viewBox',`${clamped.x} ${clamped.y} ${clamped.width} ${clamped.height}`)
    }
    const distance = () => {
      const values=[...pointers.values()]
      return values.length<2?0:Math.hypot(values[0].x-values[1].x,values[0].y-values[1].y)
    }
    const midpoint = () => {
      const values=[...pointers.values()]
      return values.length<2?{x:0,y:0}:{x:(values[0].x+values[1].x)/2,y:(values[0].y+values[1].y)/2}
    }
    svg.addEventListener('pointerdown',(event)=>{
      if(event.pointerType==='mouse'&&event.button!==0)return
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY})
      svg.setPointerCapture(event.pointerId)
      moved=false
      if(pointers.size===1){const box=readBox();drag={x:event.clientX,y:event.clientY,box}}
      if(pointers.size===2){pinch={distance:distance(),midpoint:midpoint(),box:readBox()};drag=null}
      svg.classList.add('dragging')
    })
    svg.addEventListener('pointermove',(event)=>{
      if(!pointers.has(event.pointerId))return
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY})
      const rect=svg.getBoundingClientRect()
      if(pointers.size>=2&&pinch){
        const nextDistance=Math.max(8,distance()), factor=pinch.distance/nextDistance
        const mid=midpoint(), ax=(pinch.midpoint.x-rect.left)/rect.width, ay=(pinch.midpoint.y-rect.top)/rect.height
        const width=pinch.box.width*factor, height=pinch.box.height*factor
        applyBox({x:pinch.box.x+(pinch.box.width-width)*ax-(mid.x-pinch.midpoint.x)*pinch.box.width/rect.width,y:pinch.box.y+(pinch.box.height-height)*ay-(mid.y-pinch.midpoint.y)*pinch.box.height/rect.height,width,height})
        moved=true
      } else if(drag){
        const dx=event.clientX-drag.x,dy=event.clientY-drag.y
        if(Math.hypot(dx,dy)>4)moved=true
        applyBox({x:drag.box.x-dx*drag.box.width/rect.width,y:drag.box.y-dy*drag.box.height/rect.height,width:drag.box.width,height:drag.box.height})
      }
    })
    const stop=(event)=>{
      pointers.delete(event.pointerId)
      try{svg.releasePointerCapture(event.pointerId)}catch{}
      if(moved){svg.dataset.suppressClick='1';setTimeout(()=>{svg.dataset.suppressClick='0'},80)}
      if(pointers.size===1){const remaining=[...pointers.values()][0];drag={x:remaining.x,y:remaining.y,box:readBox()};pinch=null}
      else if(!pointers.size){drag=null;pinch=null;svg.classList.remove('dragging')}
    }
    svg.addEventListener('pointerup',stop);svg.addEventListener('pointercancel',stop)
  }
  document.querySelectorAll('svg[data-map-svg]').forEach(bindOne)
}


function bindV7Interactions() {
  document.querySelectorAll('[data-animation-toggle]').forEach((button)=>button.addEventListener('click',()=>{animalAnimator.toggle();render()}))
  document.querySelectorAll('[data-map-inspector-tab],[data-inspector-tab]').forEach((button)=>button.addEventListener('click',()=>{ui.mapInspectorTab=button.dataset.mapInspectorTab||button.dataset.inspectorTab;render()}))
  bindMapPanAndZoom()

  document.querySelectorAll('[data-event-filter]').forEach((button)=>button.addEventListener('click',()=>{ui.eventFilter=button.dataset.eventFilter;render()}))
  document.querySelectorAll('[data-add-event]').forEach((button)=>button.addEventListener('click',()=>{ui.modal={type:'event-form',eventType:button.dataset.addEvent||'sale',isEdit:false,event:{type:button.dataset.addEvent||'sale',date:todayISO(),lotId:button.dataset.eventLot||ui.selectedLotId||'',categoryId:'',toCategoryId:'',quantity:'',pricePerHead:'',counterparty:'',notes:''}};render()}))
  document.querySelectorAll('[data-edit-event]').forEach((button)=>button.addEventListener('click',()=>{const event=(state.animalEvents||[]).find((item)=>item.id===button.dataset.editEvent);if(!event)return;ui.modal={type:'event-form',eventType:event.type,isEdit:true,event:{...event}};render()}))
  document.querySelectorAll('[data-delete-event]').forEach((button)=>button.addEventListener('click',()=>{if(!confirm('¿Eliminar este evento? El balance se recalculará.'))return;state.animalEvents=(state.animalEvents||[]).filter((item)=>item.id!==button.dataset.deleteEvent);saveState();showToast('Evento eliminado');render()}))
  const eventType=document.getElementById('event-type')
  if(eventType) eventType.addEventListener('change',()=>{const current=collectEventForm();current.type=eventType.value;ui.modal.eventType=eventType.value;ui.modal.event=current;render()})
  document.querySelectorAll('[data-save-event]').forEach((button)=>button.addEventListener('click',()=>{const event=collectEventForm();const error=validateEventRecord(event);if(error)return alert(error);const exists=(state.animalEvents||[]).some((item)=>item.id===event.id);state.animalEvents=exists?(state.animalEvents||[]).map((item)=>item.id===event.id?event:item):[...(state.animalEvents||[]),event];ui.modal=null;saveState();showToast(exists?'Evento actualizado':'Evento registrado');render()}))

  document.querySelectorAll('[data-archive-survey]').forEach((button)=>button.addEventListener('click',(e)=>{e.stopPropagation();const survey=state.surveys.find((item)=>item.id===button.dataset.archiveSurvey);if(!survey)return;survey.archived=!survey.archived;survey.editedAt=new Date().toISOString();if(survey.archived&&state.selectedSurveyId===survey.id)state.selectedSurveyId=latestSurvey()?.id||null;ui.modal=null;saveState();showToast(survey.archived?'Relevamiento archivado':'Relevamiento restaurado');render()}))
  document.querySelectorAll('[data-delete-survey]').forEach((button)=>button.addEventListener('click',(e)=>{e.stopPropagation();const survey=state.surveys.find((item)=>item.id===button.dataset.deleteSurvey);if(!survey)return;ui.modal={type:'confirm-delete-survey',survey};render()}))
  document.querySelectorAll('[data-confirm-delete-survey]').forEach((button)=>button.addEventListener('click',()=>{if(String(document.getElementById('delete-survey-confirm')?.value||'').trim().toUpperCase()!=='ELIMINAR')return alert('Escribí ELIMINAR para confirmar.');const id=button.dataset.confirmDeleteSurvey;state.surveys=state.surveys.filter((item)=>item.id!==id);if(state.selectedSurveyId===id)state.selectedSurveyId=latestSurvey()?.id||null;ui.modal=null;saveState();showToast('Relevamiento eliminado');render()}))
  const showArchived=document.querySelector('[data-show-archived]');if(showArchived)showArchived.addEventListener('change',()=>{ui.historyShowArchived=showArchived.checked;render()})

  document.querySelectorAll('[data-export-events]').forEach((button)=>button.addEventListener('click',()=>download('campo-eventos.csv',eventsCsv(),'text/csv;charset=utf-8')))
}

function editRain(existingPeriod='') {
  ui.modal = { type: 'rain-manager', period: existingPeriod || monthKey(todayISO()), entryId: null, rainMode: monthlyRainSummary(existingPeriod || monthKey(todayISO())).source === 'daily' ? 'daily' : 'monthly' }
  render()
}

window.addEventListener('hashchange',()=>{ui.view=location.hash.replace('#/','')||'resumen';render()})
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))
render()
