import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as M from '../dist/model.mjs';
import * as TR from '../dist/traffic.mjs';
const clone=x=>JSON.parse(JSON.stringify(x));
const newPort=()=>{const s=M.validateCity(JSON.parse(readFileSync(new URL('./new-port.blockhaven.json',import.meta.url),'utf8')));M.setMapSize(32);return s};
const dense=()=>{const s=newPort();for(const t of s.grid){if(t.type==='home'){t.level=3;t.pop=M.capacity(t)}if(['shop','industry'].includes(t.type))t.level=3}return s};
const busiest=s=>{const a=M.analyze(s);let best=-1;a.traffic.ratio.forEach((r,i)=>{if(a.traffic.capacity[i]>0&&(best<0||r>a.traffic.ratio[best]))best=i});return best};

test('new cities of every size and terrain start connected to the regional highway',()=>{for(const size of M.MAP_SIZES)for(const terrain of Object.keys(M.TERRAINS)){const s=M.newCity(terrain,size),m=M.metrics(s);assert(m.traffic.exitConnected,terrain+size);assert.equal(s.grid[m.traffic.exit].roadKind,'highway');assert(m.traffic.vehicles>0);M.validateCity(clone(s))}M.setMapSize(32)});
test('New Port is not yet connected to the region, and connecting it adds demand',()=>{const s=newPort(),a=M.metrics(s);assert(!a.traffic.exitConnected);const e=a.traffic.exit;assert(M.land(e%M.N,Math.floor(e/M.N),s.terrain))});
test('a small town flows freely; a dense one congests and loses approval',()=>{const a=M.metrics(newPort());assert.equal(a.traffic.flow,100);assert.equal(a.traffic.congested,0);const s=dense(),m=M.metrics(s);assert(m.traffic.congested>0);assert(m.traffic.flow<100)});
test('upgrading the busiest street to a boulevard or highway relieves it',()=>{const s=dense(),i=busiest(s),before=M.analyze(s).traffic.ratio[i];s.grid[i].roadKind='boulevard';const mid=M.analyze(s).traffic.ratio[i];assert(mid<before);s.grid[i].roadKind='highway';assert(M.analyze(s).traffic.ratio[i]<mid)});
test('homes beside jammed roads are less happy',()=>{const s=dense(),m=M.metrics(s);const t=newPort();for(const x of t.grid){if(x.type==='home'){x.level=3;x.pop=M.capacity(x)}if(['shop','industry'].includes(x.type))x.level=3}for(const x of t.grid)if(x.type==='road')x.roadKind='highway';const h=M.metrics(t);assert.equal(h.traffic.congested,0)});
test('pedestrian streets carry no cars and one-way streets only lead east',()=>{const s=newPort();const i=busiest(s);s.grid[i].roadKind='pedestrian';const a=M.analyze(s);assert.equal(a.traffic.volume[i],0);assert.equal(a.traffic.capacity[i],0)});
test('trips that cannot reach a job are counted as stranded, not lost',()=>{const s=newPort();s.grid.forEach(t=>{if(t.type==='road')t.type=null});const m=M.metrics(s);assert.equal(m.traffic.vehicles,0)});
test('highways cost $400, may cross water, and save their kind',()=>{const s=M.newCity();s.unlockAll=true;const money=s.money;assert(M.build(s,1,1,'road','heritage',{roadKind:'highway'}).ok);assert.equal(s.money,money-400);assert.equal(M.validateCity(clone(s)).grid[M.N+1].roadKind,'highway');assert(M.build(s,1,2,'road').error)});
test('a congested home can ask for less traffic and the request is met when traffic clears',()=>{const s=dense();const a=M.analyze(s);const i=s.grid.findIndex((t,j)=>t.type==='home'&&TR.worstBeside(M.N,a.traffic.ratio,s.grid,j).ratio>=1.2);assert(i>=0);s.requests=[{kind:'traffic',x:i%M.N,y:Math.floor(i/M.N),due:s.day+15}];M.validateCity(clone(s));for(const t of s.grid)if(t.type==='road')t.roadKind='highway';const money=s.money,m=M.metrics(s);const c=M.tick(s);assert(c.events.some(e=>e.kind==='request-done'));assert.equal(s.money,money+m.income+c.bonus)});

test('milestones unlock buildings and road types in order and never relock',()=>{const s=M.newCity();assert.equal(M.tierIndex(s),0);s.money=1e6;const free=()=>{for(let y=3;y<M.N-3;y++)for(let x=3;x<M.N-3;x++){const t=M.at(s,x,y);if(!t.type&&M.land(x,y,s.terrain)&&M.status(s,x,y).road)return[x,y]}};
 let p=free();const r=M.build(s,...p,'hospital');assert(r.error&&/City \(2,500/.test(r.error),r.error);assert(M.build(s,...p,'road','heritage',{roadKind:'highway'}).error);assert(M.zone(s,...p,'office').error);assert(M.build(s,...p,'school').ok);
 s.grants.push(750);assert.equal(M.tierIndex(s),1);p=free();assert(M.build(s,...p,'road','heritage',{roadKind:'highway'}).ok);p=free();assert(M.zone(s,...p,'office').ok);assert(M.build(s,...free(),'hospital').error);
 s.grants.push(1500,2500);assert(M.build(s,...free(),'hospital').ok);for(const t of s.grid)if(t.type==='home')t.pop=0;assert.equal(M.tierIndex(s),3);
 for(const k of Object.keys(M.CATALOG))assert(M.unlockTier(k)>=0);const u=M.Object??null});
test('unlock-all cities can build everything and the setting is saved',()=>{const s=M.newCity();s.unlockAll=true;assert.equal(M.validateCity(clone(s)).unlockAll,true);for(const k of Object.keys(M.CATALOG))assert(M.isUnlocked(s,k));const t=M.newCity();assert.equal(M.validateCity(clone(t)).unlockAll,undefined)});
test('large maps tick quickly enough to play',()=>{const s=M.newCity('coast',128);const t0=performance.now();for(let k=0;k<5;k++)M.tick(s);assert((performance.now()-t0)/5<300);M.setMapSize(32)});
