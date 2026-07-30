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
const source=raw+`\n;globalThis.__campoTest={render,renderDashboard,renderRegisterHub,renderReviewHub,renderFieldReview,renderHerdReview,renderBalanceReview,renderMap,renderMapPage,renderMorePage,startSurvey,herdBalanceForSurvey,fieldPerformanceSummary,herdPerformanceSummary,reviewAttentionGroups,projectedHerdTotalAt,renderLotsDataTable,renderLotHistoryChart,eventsCsv,surveyMetrics,LOTS,CATEGORIES,get state(){return state},get ui(){return ui},get activeWorkspace(){return activeWorkspace}};`
vm.runInContext(source,context,{filename:'app.js'})
const api=context.__campoTest
const checks=[]
const check=(condition,message)=>{if(!condition)throw new Error(message);checks.push(message)}

check(appElement.innerHTML.includes('Campo v9.01'),'Versión visible')
check(appElement.innerHTML.includes('¿Qué necesitás hacer hoy?'),'Inicio orientado a acciones')
check(appElement.innerHTML.includes('Requiere atención'),'Inicio prioriza excepciones')
check(api.state.surveys.length===16,'16 relevamientos disponibles')
check(api.state.animalEvents.length>=40,'Eventos sintéticos disponibles')
const survey=api.state.surveys.find(s=>s.id===api.state.selectedSurveyId)||api.state.surveys.at(-1)

api.ui.view='registrar';api.render()
check(appElement.innerHTML.includes('Revisión rápida'),'Registrar ofrece revisión rápida')
check(appElement.innerHTML.includes('Conteo completo'),'Registrar ofrece conteo completo')
check(appElement.innerHTML.includes('Eventos del rodeo'),'Registrar unifica eventos')
api.startSurvey('quick')
check(api.state.draft.captureMode==='quick','Revisión rápida guarda modo')
check(api.state.draft.lots.length>0,'Revisión rápida precarga lotes')
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
const field=api.fieldPerformanceSummary(survey)
check(field.lots.length===18,'Revisión de campo cubre 18 lotes')
const herd=api.herdPerformanceSummary(survey)
check(herd.metrics.animals>0,'Revisión de rodeo calcula stock')
check(Array.isArray(api.reviewAttentionGroups(survey)),'Alertas consolidadas disponibles')
check(api.projectedHerdTotalAt('2026-07-28')>0,'Stock proyectado disponible')
check(api.herdBalanceForSurvey(survey)!==null,'Balance preservado')
check(api.renderLotHistoryChart('ER-08-09').includes('history-load-line'),'Historia de lote preservada')
check(api.eventsCsv().includes('categoria_destino'),'CSV de eventos preservado')

console.log(`PASS  Smoke test v9.01: ${checks.length} comprobaciones`)
