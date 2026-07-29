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
const animalAnimator = { isEnabled:()=>true, mount:noop, toggle:()=>true }
const resolveAnimalSprite = ({kind='cow',direction='east',variant=0}) => `./assets/animals/v601/${kind==='cowCalf'?'cow-calf':kind}/${kind==='cowCalf'?'cow-calf':kind}-${direction}-${(variant%4)+1}.png`
const context = {
  console, document:documentStub, window:windowStub, navigator:{}, location:{hash:''},
  localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
  crypto:globalThis.crypto, Intl, Date, Math, JSON, Number, String, Array, Object, Set, Map, Blob,
  URL:{createObjectURL:()=> 'blob:mock',revokeObjectURL:noop}, setTimeout:()=>0, clearTimeout:noop,
  alert:noop, confirm:()=>true, prompt:()=>null, animalAnimator, resolveAnimalSprite,
}
context.globalThis=context
vm.createContext(context)
vm.runInContext(fs.readFileSync(path.join(root,'data/sample-v8.js'),'utf8'),context,{filename:'sample-v8.js'})
let raw=fs.readFileSync(path.join(root,'app.js'),'utf8')
raw=raw.replace(/^import .*$/gm,'')
const source=raw+`\n;globalThis.__campoTest={render,renderDashboard,renderMap,renderMapPage,renderIntroductionPage,renderHistory,renderLotsDataTable,renderLotHistoryChart,herdBalanceForSurvey,projectedLotsForDate,eventsCsv,surveyMetrics,state,ui,LOTS,CATEGORIES,currentSummaryViewBox,zoomSummaryMap};`
vm.runInContext(source,context,{filename:'app.js'})
const api=context.__campoTest
const checks=[]
const check=(condition,message)=>{if(!condition)throw new Error(message);checks.push(message)}

check(appElement.innerHTML.includes('Campo v8.01'),'Versión visible')
check(appElement.innerHTML.includes('MODO MUESTRA'),'Modo muestra visible')
check(api.state.surveys.length===16,'16 relevamientos preestablecidos')
check(api.state.animalEvents.length>=40,'Eventos sintéticos preestablecidos')
const survey=api.state.surveys.find(s=>s.id===api.state.selectedSurveyId)||api.state.surveys.at(-1)
const summary=api.renderMap(survey,true)
check(summary.includes('v801-summary-map'),'Resumen usa renderer v8.01')
check(summary.includes('data-map-zoom-in="summary"'),'Resumen tiene zoom')
check(summary.includes('data-animation-toggle'),'Resumen tiene control de animación')
check(summary.includes('data-animal-id'),'Sprites tienen identidad estable')
check(summary.includes('animated-animal'),'Sprites preparados para movimiento continuo')
check(!summary.includes('map-pill-svg'),'Resumen no muestra píldoras')
const full=api.renderMap(survey,false)
check(full.includes('v801-full-map'),'Mapa completo usa renderer v8.01')
check(full.includes('data-map-zoom-in="full"'),'Mapa completo mantiene zoom')
check(full.includes('map-pill-svg'),'Mapa completo mantiene píldoras')
check(full.includes('data-selected-lot-id'),'Mapa informa lote seleccionado al motor')
check(full.includes('./assets/animals/v601/'),'Se reutilizan los assets actuales')
const before=api.currentSummaryViewBox().width
api.zoomSummaryMap(.8)
check(api.currentSummaryViewBox().width<before,'Zoom del resumen modifica el viewBox')
api.ui.view='intro';api.render()
check(appElement.innerHTML.includes('Guía de Campo v8.01'),'Introducción v8.01')
check(appElement.innerHTML.includes('Rodeos vivos'),'Introducción explica movimiento')
api.ui.view='mapa';api.ui.mapMode='map';api.ui.selectedLotId='ER-08-09';api.render()
check(appElement.innerHTML.includes('Evolución'),'Historia del lote preservada')
check(appElement.innerHTML.includes('Eventos'),'Eventos del lote preservados')
check(api.renderLotHistoryChart('ER-08-09').includes('history-load-line'),'Gráfico del lote preservado')
check(api.herdBalanceForSurvey(survey) !== null,'Balance preservado')
check(Array.isArray(api.projectedLotsForDate('2026-07-28').lots),'Proyección preservada')
check(api.eventsCsv().includes('categoria_destino'),'CSV de eventos preservado')

console.log(`PASS  Smoke test v8.01: ${checks.length} comprobaciones`)
