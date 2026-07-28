import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const appElement = { innerHTML:'' }
const noop = () => {}
const store = new Map()
const documentStub = {
  getElementById(id){ return id==='app' ? appElement : null },
  querySelectorAll(){ return [] }, querySelector(){ return null },
  createElement(){ return { click:noop, set href(v){this._href=v}, set download(v){this._download=v} } },
}
const windowStub = { addEventListener:noop, scrollTo:noop, CAMPO_SAMPLE_STATE:null }
const context = {
  console, document:documentStub, window:windowStub, navigator:{}, location:{hash:''},
  localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
  crypto:globalThis.crypto, Intl, Date, Math, JSON, Number, String, Array, Object, Set, Map, Blob,
  URL:{createObjectURL:()=> 'blob:mock',revokeObjectURL:noop}, setTimeout:()=>0, clearTimeout:noop,
  alert:noop, confirm:()=>true, prompt:()=>null,
}
context.globalThis=context
vm.createContext(context)
vm.runInContext(fs.readFileSync(path.join(root,'data/sample-v7.js'),'utf8'),context,{filename:'sample-v7.js'})
const raw=fs.readFileSync(path.join(root,'app.js'),'utf8')
const source=raw+`\n;globalThis.__campoTest={render,renderDashboard,renderMap,renderMapPage,renderEventsPage,renderIntroductionPage,renderHistory,renderDataPage,renderLotsDataTable,renderLotHistoryChart,renderLotEvents,herdBalanceForSurvey,projectedLotsForDate,eventsCsv,surveyMetrics,state,ui,LOTS,CATEGORIES};`
vm.runInContext(source,context,{filename:'app.js'})
const api=context.__campoTest
const checks=[]
const check=(condition,message)=>{if(!condition)throw new Error(message);checks.push(message)}

check(appElement.innerHTML.includes('Campo v7.01'),'Versión visible')
check(appElement.innerHTML.includes('MODO MUESTRA'),'Modo muestra visible')
check(api.state.surveys.length===16,'16 relevamientos cargados')
check(api.state.animalEvents.length>=40,'Eventos detallados cargados')
check(api.CATEGORIES.every(c=>c.parent),'Taxonomía jerárquica')

const survey=api.state.surveys.find(s=>s.id===api.state.selectedSurveyId)||api.state.surveys.at(-1)
const summary=api.renderMap(survey,true)
check(summary.includes('v701-summary-map'),'Resumen usa renderer v7')
check(summary.includes('map-animal-svg'),'Resumen comunica cantidad con sprites')
check(!summary.includes('map-pill-svg'),'Resumen no muestra pills')
const full=api.renderMap(survey,false)
check(full.includes('map-zoom-controls'),'Mapa completo tiene zoom')
check(full.includes('map-pill-svg'),'Mapa completo tiene pills')
check(full.includes('assets/animals/v601/'),'Mapa usa sprites aéreos')

api.ui.view='eventos';api.render()
check(appElement.innerHTML.includes('Eventos del rodeo'),'Página Eventos')
check(appElement.innerHTML.includes('Balance del rodeo'),'Balance general')
check(appElement.innerHTML.includes('Venta')&&appElement.innerHTML.includes('Recategorización'),'Tipos de evento')
api.ui.view='intro';api.render()
check(appElement.innerHTML.includes('Guía de Campo v7.01'),'Introducción')
check(appElement.innerHTML.includes('Próximamente'),'Roadmap')
api.ui.view='mapa';api.ui.mapMode='table';api.render()
check(appElement.innerHTML.includes('lot-data-table v7'),'Tabla v7')
for (const h of ['Lote','Cond.','EV','Total','Vaca','Tern.','Toro','Vaq.','Nov.']) check(appElement.innerHTML.includes(h),`Columna ${h}`)
api.ui.mapMode='map';api.ui.selectedLotId='ER-08-09';api.render()
check(appElement.innerHTML.includes('Evolución'),'Pestaña evolución')
check(appElement.innerHTML.includes('Eventos'),'Pestaña eventos en lote')
const history=api.renderLotHistoryChart('ER-08-09')
check(history.includes('history-load-line'),'Gráfico de carga del lote')
const balance=api.herdBalanceForSurvey(survey)
check(balance && Number.isFinite(balance.expected),'Balance calculado')
const projection=api.projectedLotsForDate('2026-07-28')
check(Array.isArray(projection.lots),'Proyección de siguiente relevamiento')
check(api.eventsCsv().includes('categoria_destino'),'CSV de eventos')
api.ui.view='historico';api.render()
check(appElement.innerHTML.includes('Archivar')&&appElement.innerHTML.includes('Eliminar'),'Histórico permite archivar/eliminar')

console.log(`PASS  Smoke test v7.01: ${checks.length} comprobaciones`)
