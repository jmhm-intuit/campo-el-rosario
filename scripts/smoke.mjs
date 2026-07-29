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
const source=raw+`\n;globalThis.__campoTest={render,renderDashboard,renderMap,renderMapPage,renderIntroductionPage,renderHistory,renderDataPage,renderLotsDataTable,renderLotHistoryChart,herdBalanceForSurvey,projectedLotsForDate,eventsCsv,surveyMetrics,LOTS,CATEGORIES,currentSummaryViewBox,zoomSummaryMap,demoWorkspaceInstalled,installDemoWorkspace,removeDemoWorkspace,switchWorkspace,get state(){return state},get ui(){return ui},get activeWorkspace(){return activeWorkspace}};`
vm.runInContext(source,context,{filename:'app.js'})
const api=context.__campoTest
const checks=[]
const check=(condition,message)=>{if(!condition)throw new Error(message);checks.push(message)}

check(appElement.innerHTML.includes('Campo v8.02'),'Versión visible')
check(appElement.innerHTML.includes('MODO MUESTRA'),'Nueva instalación abre la muestra')
check(api.state.surveys.length===16,'16 relevamientos disponibles')
check(api.state.animalEvents.length>=40,'Eventos sintéticos disponibles')
check(api.demoWorkspaceInstalled(),'Muestra almacenada en espacio separado')
check(store.has('campo-el-rosario-v2'),'Espacio real creado por separado')
check(store.has('campo-el-rosario-demo-v1'),'Espacio muestra creado por separado')
const survey=api.state.surveys.find(s=>s.id===api.state.selectedSurveyId)||api.state.surveys.at(-1)
const summary=api.renderMap(survey,true)
check(summary.includes('v802-summary-map'),'Resumen usa renderer v8.02')
check(summary.includes('data-map-zoom-in="summary"'),'Resumen tiene zoom')
check(summary.includes('data-animation-mode'),'Resumen tiene selector de animación')
check(summary.includes('data-animal-id'),'Sprites tienen identidad estable')
check(summary.includes('data-agent-index'),'Sprites identifican agente')
check(summary.includes('data-animal-width="16.00"'),'Resumen usa tamaño estándar')
check(!summary.includes('map-pill-svg'),'Resumen no muestra píldoras')
const full=api.renderMap(survey,false)
check(full.includes('v802-full-map'),'Mapa completo usa renderer v8.02')
check(full.includes('data-animal-width="18.00"'),'Mapa usa tamaño estándar uniforme')
check(full.includes('map-pill-svg'),'Mapa completo mantiene píldoras')
check(full.includes('SimFarm'),'Modo SimFarm visible')
const before=api.currentSummaryViewBox().width
api.zoomSummaryMap(.8)
check(api.currentSummaryViewBox().width<before,'Zoom del resumen modifica el viewBox')
api.ui.view='datos';api.render()
check(appElement.innerHTML.includes('Datos de muestra'),'Configuración de muestra visible')
check(appElement.innerHTML.includes('Restablecer Muestra'),'Muestra puede restablecerse')
check(appElement.innerHTML.includes('Eliminar Muestra'),'Muestra puede eliminarse')
check(appElement.innerHTML.includes('Movimiento de los animales'),'Configuración de movimiento visible')
api.switchWorkspace('real')
check(api.activeWorkspace==='real','Cambio a El Rosario')
check(api.state.sampleMode===false,'El Rosario no queda marcado como muestra')
check(api.state.surveys.length===0,'El Rosario vacío no fue reemplazado por la muestra')
api.switchWorkspace('demo')
check(api.state.surveys.length===16,'Regreso a muestra sin perderla')
api.ui.view='mapa';api.ui.mapMode='map';api.ui.selectedLotId='ER-08-09';api.render()
check(appElement.innerHTML.includes('Evolución'),'Historia del lote preservada')
check(api.renderLotHistoryChart('ER-08-09').includes('history-load-line'),'Gráfico del lote preservado')
check(api.herdBalanceForSurvey(survey) !== null,'Balance preservado')
check(Array.isArray(api.projectedLotsForDate('2026-07-28').lots),'Proyección preservada')
check(api.eventsCsv().includes('categoria_destino'),'CSV de eventos preservado')

console.log(`PASS  Smoke test v8.02: ${checks.length} comprobaciones`)
