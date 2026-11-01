// Blockhaven traffic.
//
// Every day the simulation routes the city's trips over the real road network:
//  - commuters drive from their homes to the nearest reachable jobs,
//  - shoppers drive to the nearest shops,
//  - trucks carry industrial goods to the regional highway (or a cargo harbor),
//  - visitors drive between the regional highway and the city's attractions.
// Trips follow the quickest route, where each road type has its own speed. The vehicles on a
// road block, divided by that road type's daily capacity, gives its congestion. Busy roads
// lower nearby residents' approval and the income of businesses on them, and the city's
// traffic flow (the share of normal speed that traffic keeps) shows on the HUD.

// Costs are per lot (a lot is half a block long). Capacity is vehicles a day through one lot.
export const ROAD_KINDS={
 street:{name:'Street',cost:30,upkeep:0,capacity:350,speed:1},
 oneway:{name:'One-way east',cost:35,upkeep:0,capacity:450,speed:1.1},
 boulevard:{name:'Boulevard',cost:70,upkeep:.5,capacity:900,speed:1.3},
 pedestrian:{name:'Pedestrian',cost:45,upkeep:0,capacity:0,speed:0},
 bridge:{name:'Bridge',cost:90,upkeep:1,capacity:450,speed:1.1},
 highway:{name:'Highway',cost:200,upkeep:1.5,capacity:2200,speed:2.4},
 ramp:{name:'Highway ramp',cost:80,upkeep:.5,capacity:1100,speed:1.6},
 roundabout:{name:'Roundabout',cost:60,upkeep:.3,capacity:1400,speed:1.2},
 elevated:{name:'Elevated highway',cost:260,upkeep:2,capacity:2200,speed:2.4}
};
// Kinds drawn at street level (the elevated highway is a deck above a lot).
export const GROUND_KINDS=Object.keys(ROAD_KINDS).filter(k=>k!=='elevated');
export const roadKindOf=t=>Object.hasOwn(ROAD_KINDS,t?.roadKind)?t.roadKind:'street';
// Share of trips made by car, and trips per resident or job each day (there and back = 2).
export const TRIPS={carShare:.7,commute:2,shopping:.5,freightPerJob:.6,visitor:2};
export const LEVELS=[[0,'Free flowing'],[.6,'Busy'],[1,'Congested'],[1.5,'Jammed']];
export const trafficLevel=r=>{let n=LEVELS[0][1];for(const[v,name]of LEVELS)if(r>=v)n=name;return n};
const D4=[[1,0],[-1,0],[0,1],[0,-1]];

// The regional highway leaves the map from one fixed land block, chosen by terrain.
export function exitIndex(N,land,terrain){
 const[ax,ay]=terrain==='river'?[N-1,N/2]:[N/2,N-1];let best=-1,bd=Infinity;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(land(x,y,terrain)){const d=(x-ax)**2+(y-ay)**2;if(d<bd){bd=d;best=y*N+x}}
 return best;
}
// The direction from the exit block toward the map edge (for drawing the highway off the map).
export const exitDirection=terrain=>terrain==='river'?[1,0]:[0,1];

// Street-level road lots that an elevated deck at lot i comes down to: the lot straight ahead
// at each end of the deck (or every side, for a single deck lot).
export function landings(grid,N,i){const x=i%N,y=(i-x)/N,out=[];let decks=0;for(const[a,b]of D4){const nx=x+a,ny=y+b;if(nx>=0&&ny>=0&&nx<N&&ny<N&&grid[ny*N+nx].over)decks++}
 for(const[a,b]of D4){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=N||ny>=N)continue;const j=ny*N+nx,t=grid[j];if(t.over||t.type!=='road')continue;const bx=x-a,by=y-b,back=bx>=0&&by>=0&&bx<N&&by<N&&!!grid[by*N+bx].over;if(back||!decks)out.push(j)}return out}
// Road nodes reachable in one step from node v. Street-level lots are 0..N*N-1 and elevated decks
// N*N+i. With any=true (road access), pedestrian streets count and one-way rules are ignored.
export function links(grid,N,v,any=false){const M=N*N,out=[];
 const ok=j=>{const t=grid[j];return t.type==='road'&&(any||ROAD_KINDS[roadKindOf(t)].capacity>0)};
 if(v<M){const t=grid[v];if(!ok(v))return out;const x=v%N,y=(v-x)/N,one=!any&&roadKindOf(t)==='oneway';
  for(const[a,b]of D4){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=N||ny>=N)continue;const j=ny*N+nx;if(!one||a===1)if(ok(j))out.push(j);if(!one&&grid[j].over&&landings(grid,N,j).includes(v))out.push(M+j)}return out}
 const i=v-M;if(!grid[i]?.over)return out;const x=i%N,y=(i-x)/N;
 for(const[a,b]of D4){const nx=x+a,ny=y+b;if(nx>=0&&ny>=0&&nx<N&&ny<N&&grid[ny*N+nx].over)out.push(M+ny*N+nx)}
 for(const j of landings(grid,N,i))if(ok(j))out.push(j);return out}

// A binary heap keyed by distance.
function heap(){const k=[],v=[];return{size:()=>k.length,push(key,val){k.push(key);v.push(val);let i=k.length-1;while(i>0){const p=(i-1)>>1;if(k[p]<=k[i])break;[k[p],k[i]]=[k[i],k[p]];[v[p],v[i]]=[v[i],v[p]];i=p}},pop(){const top=v[0],kt=k[0],lk=k.pop(),lv=v.pop();if(k.length){k[0]=lk;v[0]=lv;let i=0;for(;;){const l=2*i+1,r=l+1;let m=i;if(l<k.length&&k[l]<k[m])m=l;if(r<k.length&&k[r]<k[m])m=r;if(m===i)break;[k[m],k[i]]=[k[i],k[m]];[v[m],v[i]]=[v[i],v[m]];i=m}}return[kt,top]}}}

// Shortest time from every road node to the nearest destination, walking the links backward.
function toNearest(T,rev,cost,sources){
 const dist=new Float64Array(T).fill(Infinity),next=new Int32Array(T).fill(-1),h=heap();
 for(const r of sources)if(cost[r]>0&&dist[r]>0){dist[r]=0;h.push(0,r)}
 while(h.size()){const[d,v]=h.pop();if(d>dist[v])continue;const nd=d+cost[v];for(const u of rev[v]||[]){if(nd<dist[u]){dist[u]=nd;next[u]=v;h.push(nd,u)}}}
 return{dist,next};
}
function load(route,access,inflow,origin,amount){if(amount<=0)return 0;let best=-1;for(const r of access(origin))if(route.dist[r]<Infinity&&(best<0||route.dist[r]<route.dist[best]))best=r;if(best<0)return amount;inflow[best]+=amount;return 0}
function flowAlong(T,route,inflow,volume){const order=[];for(let i=0;i<T;i++)if(route.dist[i]<Infinity)order.push(i);order.sort((p,q)=>route.dist[q]-route.dist[p]);for(const u of order){const f=inflow[u];if(!f)continue;volume[u]+=f;const n=route.next[u];if(n>=0)inflow[n]+=f}}

// ctx: {grid,N,access,jobsAt,popAt,shopAt,industryJobsAt,attractionAt,visitors,exit,exitConnected,harbors}
// access(i) lists the lots around building i (its whole footprint).
export function simulateTraffic(ctx){
 const{grid,N}=ctx,M=N*N,T=2*M,capacity=new Float32Array(T),cost=new Float32Array(T),volume=new Float32Array(T),rev=new Array(T);
 for(let i=0;i<M;i++){const t=grid[i];if(t.type==='road'){const k=ROAD_KINDS[roadKindOf(t)];capacity[i]=k.capacity;if(k.capacity>0)cost[i]=1/k.speed}if(t.over){capacity[M+i]=ROAD_KINDS.elevated.capacity;cost[M+i]=1/ROAD_KINDS.elevated.speed}}
 for(let u=0;u<T;u++){if(!cost[u])continue;for(const v of links(grid,N,u))if(cost[v])(rev[v]??=[]).push(u)}
 const fallback=i=>{const x=i%N,y=(i-x)/N,out=[];for(const[a,b]of D4){const nx=x+a,ny=y+b;if(nx>=0&&ny>=0&&nx<N&&ny<N)out.push(ny*N+nx)}return out};
 const around=ctx.access||fallback,access=i=>around(i).filter(j=>cost[j]>0);
 const near=pred=>{const s=[];for(let i=0;i<M;i++)if(pred(i))s.push(...access(i));return s};
 let stranded=0,trips=0;
 const run=(sources,origins)=>{if(!sources.length){for(const[,a]of origins)stranded+=a;return}const route=toNearest(T,rev,cost,sources),inflow=new Float32Array(T);for(const[i,a]of origins){trips+=a;stranded+=load(route,access,inflow,i,a)}flowAlong(T,route,inflow,volume)};
 const homes=[];for(let i=0;i<M;i++)if(ctx.popAt[i]>0)homes.push(i);
 const workers=homes.reduce((a,i)=>a+ctx.popAt[i],0)/2,jobs=ctx.jobsAt.reduce((a,v)=>a+v,0),employed=workers?Math.min(1,jobs/workers):0;
 run(near(i=>ctx.jobsAt[i]>0),homes.map(i=>[i,ctx.popAt[i]/2*employed*TRIPS.carShare*TRIPS.commute]));
 run(near(i=>ctx.shopAt[i]>0),homes.map(i=>[i,ctx.popAt[i]*TRIPS.shopping*TRIPS.carShare]));
 const freightTo=ctx.exitConnected?[ctx.exit]:ctx.harbors.length?ctx.harbors:[];const freight=[];for(let i=0;i<M;i++)if(ctx.industryJobsAt[i]>0)freight.push([i,ctx.industryJobsAt[i]*TRIPS.freightPerJob]);
 if(freightTo.length)run([...near(i=>freightTo.includes(i)),...freightTo.filter(i=>cost[i]>0)],freight);
 if(ctx.exitConnected&&ctx.visitors>0){const at=[];let total=0;for(let i=0;i<M;i++)if(ctx.attractionAt[i]>0){at.push(i);total+=ctx.attractionAt[i]}if(total)run([ctx.exit,...near(i=>i===ctx.exit)],at.map(i=>[i,ctx.visitors*ctx.attractionAt[i]/total*TRIPS.visitor*TRIPS.carShare]))}
 const ratio=new Float32Array(T);let vol=0,slow=0,busy=0,jammed=0,roads=0;
 for(let i=0;i<T;i++){if(!capacity[i])continue;roads++;ratio[i]=volume[i]/capacity[i];vol+=volume[i];slow+=volume[i]*Math.max(1,ratio[i]);if(ratio[i]>=1)busy++;if(ratio[i]>=1.5)jammed++}
 const flow=vol?Math.round(vol/slow*100):100;
 return{volume,capacity,ratio,flow,vehicles:Math.round(vol),congested:busy,jammed,roads,trips:Math.round(trips),stranded:Math.round(stranded)};
}
// The busiest road beside a block (for approval and business effects).
export function worstBeside(N,ratio,grid,i){let r=0,highway=false;const x=i%N,y=(i-x)/N;for(const[a,b]of D4){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=N||ny>=N)continue;const j=ny*N+nx;if(grid[j].over){highway=true;if(ratio[N*N+j]>r)r=ratio[N*N+j]}if(grid[j].type!=='road')continue;if(ratio[j]>r)r=ratio[j];if(grid[j].roadKind==='highway')highway=true}return{ratio:r,highway}}
