import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const appElement = { innerHTML: '' }
const noop = () => {}
const store = new Map()
const documentStub = {
  getElementById(id){ return id === 'app' ? appElement : null },
  querySelectorAll(){ return [] }, querySelector(){ return null },
  addEventListener: noop,
  createElement(){ return { click:noop, set href(v){this._href=v}, set download(v){this._download=v} } },
}
const context = {
  console, document:documentStub,
  window:{addEventListener:noop,scrollTo:noop}, navigator:{}, location:{hash:''},
  localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
  crypto:globalThis.crypto, Intl, Date, Math, JSON, Number, String, Array, Object, Set, Map, Blob,
  URL:{createObjectURL:()=> 'blob:mock', revokeObjectURL:noop},
  setTimeout:()=>0, clearTimeout:noop, alert:noop, confirm:()=>true, prompt:()=>null,
}
context.globalThis=context
vm.createContext(context)
const source = fs.readFileSync(path.join(root,'app.js'),'utf8') + `\n;globalThis.__test={
 render,renderDashboard,renderMap,renderMapPage,renderRainPage,renderRainModal,
 renderMapLotsTable,renderCategoryBars,aggregatedOperationalAlerts,
 rainComparisonRows,cumulativeRainRows,monthlyHistorical,hydricIndex,hydricStatus,
 selectedSurvey,surveyMetrics,state,ui,LOTS,FIELD_STATES,CATEGORIES
};`
vm.runInContext(source,context,{filename:'app.js'})
const api=context.__test
const checks=[]
const check=(condition,message)=>{if(!condition)throw new Error(message);checks.push(message)}

check(appElement.innerHTML.includes('Campo v6.01'),'La versión 6.01 aparece en la interfaz')
check(appElement.innerHTML.includes('kpi-grid v2 v601'),'Los KPI usan la grilla protegida v6.01')
check(appElement.innerHTML.includes('summary-map'),'El resumen incluye el mapa simplificado')
check(!api.renderMap(api.selectedSurvey(),true).includes('map-animal-html aerial'),'El resumen no muestra animales ni sobrecarga visual')
check(api.renderMap(api.selectedSurvey(),true).includes('v601-summary'),'El resumen usa solo etiquetas de cabezas')
const fullMap=api.renderMap(api.selectedSurvey(),false)
check(fullMap.includes('map-animal-html aerial'),'El mapa detallado utiliza sprites aéreos')
check(fullMap.includes('animals/aerial/'),'Los sprites provienen de los assets recortados')

const mapPage=api.renderMapPage()
check(mapPage.includes('data-map-mode="map"') && mapPage.includes('data-map-mode="table"'),'Mapa y tabla se pueden alternar')
api.ui.mapMode='table'
check(api.renderMapPage().includes('map-lots-table'),'La vista tabla se renderiza')
check(api.renderMapLotsTable(api.selectedSurvey()).includes('Vaca') && api.renderMapLotsTable(api.selectedSurvey()).includes('Tern.') && api.renderMapLotsTable(api.selectedSurvey()).includes('Toro'),'Encabezados explícitos de categorías')

const bars=api.renderCategoryBars(api.surveyMetrics(api.selectedSurvey()).categories,api.surveyMetrics(api.selectedSurvey()).animals)
check(bars.includes('%') && bars.includes('width:100%'),'Composición muestra porcentajes y normaliza la categoría mayor')
const alerts=api.aggregatedOperationalAlerts(api.selectedSurvey())
check(alerts.length <= 2,'Las alertas están resumidas en un máximo de dos grupos')
check(alerts.every(item=>item.text.includes('ER-')),'Las alertas describen los lotes involucrados')

const monthly=api.rainComparisonRows(2026,'monthly')
const fortnight=api.rainComparisonRows(2026,'fortnight')
check(monthly.length===12,'Comparación mensual tiene 12 filas')
check(fortnight.length===24,'Comparación quincenal tiene 24 filas')
check(api.monthlyHistorical(1).average===88.8,'Promedio mensual suma correctamente las dos quincenas')
const cumulative=api.cumulativeRainRows('2026-07')
check(cumulative.length===12,'Acumulado cubre los últimos 12 meses')
check(api.renderRainPage().includes('Índice hídrico') && api.renderRainPage().includes('Próximamente en Campo'),'Módulo lluvia e ideas futuras se renderizan')

api.ui.modal={type:'rain-manager',period:'2026-07',rainMode:'monthly',pendingZero:{mode:'monthly',millimeters:0}}
check(api.renderRainModal().includes('Fue 0 mm') && api.renderRainModal().includes('No hay información'),'Cero milímetros requiere confirmación explícita')
api.ui.modal=null

for (const view of ['resumen','mapa','lluvias','historico','datos']) {
  api.ui.view=view; api.render(); check(appElement.innerHTML.length>1000,`Vista ${view} renderizada`)
}
console.log(`Smoke test Campo v6.01 aprobado (${checks.length} comprobaciones).`)
