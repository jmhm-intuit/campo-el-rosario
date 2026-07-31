import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const appElement = { innerHTML:'' }
const noop = () => {}
const store = new Map()
const documentStub = {
  hidden:false,
  getElementById(id){ return id==='app' ? appElement : null },
  querySelectorAll(){ return [] }, querySelector(){ return null },
  createElement(){ return { click:noop, set href(v){this._href=v}, set download(v){this._download=v} } },
  addEventListener:noop,
}
const windowStub = { addEventListener:noop, scrollTo:noop, CAMPO_SAMPLE_STATE:null, matchMedia:()=>({matches:false,addEventListener:noop}) }
let animationMode='simfarm'
const animalAnimator = {
  isEnabled:()=>animationMode!=='paused', mount:noop, toggle:()=>true,
  getMode:()=>animationMode, getModeLabel:()=>({paused:'Pausada',soft:'Suave',simfarm:'SimFarm'})[animationMode],
  getModeGlyph:()=>animationMode==='paused'?'▶':'≈', cycleMode:()=>{animationMode=animationMode==='simfarm'?'paused':'simfarm';return animationMode},
  setMode:(mode)=>{animationMode=mode;return mode},
}
const resolveAnimalSprite = ({kind='cow',direction='east',variant=0}) => `./assets/animals/v601/${kind==='cowCalf'?'cow-calf':kind}/${kind==='cowCalf'?'cow-calf':kind}-${direction}-${(variant%4)+1}.png`
const context = {
  console, document:documentStub, window:windowStub, navigator:{}, location:{hash:''},
  localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
  crypto:globalThis.crypto, Intl, Date, Math, JSON, Number, String, Array, Object, Set, Map, Blob,
  URL:{createObjectURL:()=> 'blob:mock',revokeObjectURL:noop}, setTimeout:()=>0, clearTimeout:noop,
  alert:noop, confirm:()=>true, prompt:()=>null, animalAnimator, resolveAnimalSprite,
  STANDARD_ANIMAL_SIZE:{summary:16,full:18},
}
context.globalThis=context
vm.createContext(context)
vm.runInContext(fs.readFileSync(path.join(root,'data/sample-v8.js'),'utf8'),context,{filename:'sample-v8.js'})
let raw=fs.readFileSync(path.join(root,'app.js'),'utf8')
raw=raw.replace(/^import .*$/gm,'')
const source=raw+`\n;globalThis.__campoTest={render,renderDashboard,renderRegisterHub,renderReviewHub,renderFieldReview,renderHerdReview,renderBalanceReview,renderMap,renderMapPage,renderMorePage,startSurvey,herdBalanceForSurvey,fieldPerformanceSummary,herdPerformanceSummary,reviewAttentionGroups,projectedHerdTotalAt,renderLotsDataTable,renderLotHistoryChart,eventsCsv,surveyMetrics,fullMapViewBox,lotBounds,LOTS,CATEGORIES,get state(){return state},get ui(){return ui},get activeWorkspace(){return activeWorkspace}};`
vm.runInContext(source,context,{filename:'app.js'})
const api=context.__campoTest
const checks=[]
const check=(condition,message)=>{if(!condition)throw new Error(message);checks.push(message)}

check(appElement.innerHTML.includes('Campo v10.01'),'Versión visible')
check(appElement.innerHTML.includes('assets/icons/v902/64/nav-home.png'),'Navegación usa iconos v9.02')
check(appElement.innerHTML.includes('assets/icons/v902/64/kpi-animals.png'),'KPI usa iconos v9.02')
check(appElement.innerHTML.includes('Cargar el campo'),'Inicio orientado a carga de campo')
check(appElement.innerHTML.includes('Requiere atención'),'Inicio prioriza excepciones')
check(api.state.surveys.length===16,'16 relevamientos disponibles')
check(api.state.animalEvents.length>=40,'Eventos sintéticos disponibles')
const survey=api.state.surveys.find(s=>s.id===api.state.selectedSurveyId)||api.state.surveys.at(-1)

api.ui.view='registrar';api.render()
check(appElement.innerHTML.includes('assets/icons/v902/64/survey-quick.png'),'Registrar usa iconos de relevamiento')
check(appElement.innerHTML.includes('assets/icons/v902/64/event-sale.png'),'Registrar usa iconos de eventos')
check(appElement.innerHTML.includes('Cargar animales lote por lote'),'Registrar prioriza carga simple')
check(appElement.innerHTML.includes('Carga detallada'),'Registrar conserva modo detallado')
check(appElement.innerHTML.includes('Conteo desde cero'),'Registrar conserva conteo completo')
check(appElement.innerHTML.includes('Modo Gestión'),'Registrar separa análisis de carga de campo')
api.startSurvey('field')
check(api.state.draft.captureMode==='quick' && api.state.draft.simpleMode===true,'Carga simple guarda modo')
check(api.state.draft.lots.length>0,'Carga simple precarga lotes')
api.state.draft.step=2; api.render()
check(appElement.innerHTML.includes('Igual que lo esperado'),'Carga simple ofrece confirmación directa')
check(appElement.innerHTML.includes('Lote vacío'),'Carga simple ofrece lote vacío')
check(appElement.innerHTML.includes('No observado'),'Carga simple ofrece no observado')
check(appElement.innerHTML.includes('Guardar y siguiente'),'Carga simple navega lote por lote')
api.state.draft=null
api.startSurvey('full')
check(api.state.draft.captureMode==='full','Conteo completo guarda modo')
check(api.state.draft.lots.length===0,'Conteo completo comienza vacío')
api.state.draft=null

api.ui.view='revisar';api.ui.reviewTab='campo';api.render()
check(appElement.innerHTML.includes('Condición × carga'),'Revisión de campo incluye matriz')
check(appElement.innerHTML.includes('Vigencia de las observaciones'),'Revisión de campo muestra vigencia')
api.ui.reviewTab='rodeo';api.render()
check(appElement.innerHTML.includes('Composición del rodeo'),'Revisión de rodeo disponible')
check(appElement.innerHTML.includes('Ciclo reproductivo'),'Flujo reproductivo disponible')
api.ui.reviewTab='balance';api.render()
check(appElement.innerHTML.includes('Balance del rodeo'),'Balance integrado')
check(appElement.innerHTML.includes('Diferencia por categoría'),'Balance por categoría')

api.ui.view='mas';api.render()
check(appElement.innerHTML.includes('Herramientas adicionales'),'Más reúne funciones secundarias')
check(appElement.innerHTML.includes('Datos y configuración'),'Configuración accesible')

const summary=api.renderMap(survey,true)
check(summary.includes('data-animal-id'),'Animación preservada')
check(!summary.includes('map-pill-svg'),'Resumen mantiene mapa limpio')

const whole=api.fullMapViewBox()
check(api.LOTS.every((lot)=>{const b=api.lotBounds(lot);return b.x>=whole.x-0.01&&b.y>=whole.y-0.01&&b.x+b.width<=whole.x+whole.width+0.01&&b.y+b.height<=whole.y+whole.height+0.01}),'Vista completa contiene los 18 lotes')
check(summary.includes('data-summary-map-interaction'),'Mapa principal evita el bloqueo de scroll')
const field=api.fieldPerformanceSummary(survey)
check(field.lots.length===18,'Revisión de campo cubre 18 lotes')
const herd=api.herdPerformanceSummary(survey)
check(herd.metrics.animals>0,'Revisión de rodeo calcula stock')
check(Array.isArray(api.reviewAttentionGroups(survey)),'Alertas consolidadas disponibles')
check(api.projectedHerdTotalAt('2026-07-28')>0,'Stock proyectado disponible')
check(api.herdBalanceForSurvey(survey)!==null,'Balance preservado')
check(api.renderLotHistoryChart('ER-08-09').includes('history-load-line'),'Historia de lote preservada')
check(api.eventsCsv().includes('categoria_destino'),'CSV de eventos preservado')

console.log(`PASS  Smoke test v10.01: ${checks.length} comprobaciones`)
