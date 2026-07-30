const store = new Map()
globalThis.localStorage = { getItem:(key)=>store.get(key)??null, setItem:(key,value)=>store.set(key,value) }
globalThis.window = { matchMedia:()=>({matches:false}) }
globalThis.document = { hidden:false, addEventListener(){}, querySelectorAll(){return []} }
globalThis.Image = class { set src(value){ this._src=value } }
globalThis.requestAnimationFrame = () => 1
globalThis.cancelAnimationFrame = () => {}

const { animalAnimator } = await import('../animal-animation.js')

const attrs = new Map()
const element = {
  isConnected:true,
  dataset:{}, style:{},
  getAttribute:(key)=>attrs.get(key)??null,
  setAttribute:(key,value)=>attrs.set(key,String(value)),
}
let randomState=1
const random=()=>{randomState=(randomState*1664525+1013904223)>>>0;return randomState/4294967296}
const polygon={points:[[0,0],[180,0],[180,180],[0,180]],bounds:{minX:0,maxX:180,minY:0,maxY:180}}
const map={type:'full',selectedLotId:'ER-TEST',agents:[],agentsByLot:new Map()}
const agent={
  id:'test',index:0,random,x:90,y:90,homeX:90,homeY:90,targetX:90,targetY:90,
  width:18,height:18,lotId:'ER-TEST',kind:'cow',direction:'east',variant:0,state:'idle',
  frame:0,frameClock:0,bobPhase:0,currentSpeed:0,nextDecision:0,lastSeen:Date.now(),
  element,map,polygon,obstacles:[],
}
map.agents=[agent]
map.agentsByLot.set('ER-TEST',[agent])
animalAnimator.maps=[map]
animalAnimator.setMode('simfarm')
const start={x:agent.x,y:agent.y}
let now=0
for(let i=0;i<500;i+=1){now+=100;animalAnimator.updateAgent(agent,0.1,now)}
if(Math.hypot(agent.x-start.x,agent.y-start.y)<1) throw new Error('El agente no se desplazó')
if(agent.x<0||agent.x>180||agent.y<0||agent.y>180) throw new Error('El agente salió del polígono')
if(animalAnimator.getMode()!=='simfarm') throw new Error('Modo SimFarm no persistió')
animalAnimator.setMode('paused')
const paused={x:agent.x,y:agent.y}
for(let i=0;i<30;i+=1){now+=100;animalAnimator.updateAgent(agent,0.1,now)}
if(Math.hypot(agent.x-paused.x,agent.y-paused.y)>.001) throw new Error('El agente se movió en modo pausado')
console.log('PASS  Animation smoke v9.01: movimiento, contención y pausa')
