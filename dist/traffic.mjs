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

export const ROAD_KINDS={
 street:{name:'Street',cost:60,upkeep:0,capacity:350,speed:1},
 oneway:{name:'One-way east',cost:70,upkeep:0,capacity:450,speed:1.1},
 boulevard:{name:'Boulevard',cost:140,upkeep:1,capacity:900,speed:1.3},
 pedestrian:{name:'Pedestrian',cost:90,upkeep:0,capacity:0,speed:0},
 bridge:{name:'Bridge',cost:180,upkeep:2,capacity:450,speed:1.1},
 highway:{name:'Highway',cost:400,upkeep:3,capacity:2200,speed:2.4}
};
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

// A binary heap keyed by distance.
function heap(){const k=[],v=[];return{size:()=>k.length,push(key,val){k.push(key);v.push(val);let i=k.length-1;while(i>0){const p=(i-1)>>1;if(k[p]<=k[i])break;[k[p],k[i]]=[k[i],k[p]];[v[p],v[i]]=[v[i],v[p]];i=p}},pop(){const top=v[0],kt=k[0],lk=k.pop(),lv=v.pop();if(k.length){k[0]=lk;v[0]=lv;let i=0;for(;;){const l=2*i+1,r=l+1;let m=i;if(l<k.length&&k[l]<k[m])m=l;if(r<k.length&&k[r]<k[m])m=r;if(m===i)break;[k[m],k[i]]=[k[i],k[m]];[v[m],v[i]]=[v[i],v[m]];i=m}}return[kt,top]}}}

// Shortest time from every road block to the nearest destination. Cars may leave a one-way
// street only eastward; pedestrian streets carry no cars.
function toNearest(grid,N,drivable,sources){
 const dist=new Float64Array(N*N).fill(Infinity),next=new Int32Array(N*N).fill(-1),h=heap();
 for(const r of sources)if(drivable[r]&&dist[r]>0){dist[r]=0;h.push(0,r)}
 while(h.size()){const[d,v]=h.pop();if(d>dist[v])continue;const vx=v%N,vy=(v-vx)/N,cost=1/ROAD_KINDS[roadKindOf(grid[v])].speed;
  for(const[a,b]of D4){const ux=vx-a,uy=vy-b;if(ux<0||uy<0||ux>=N||uy>=N)continue;const u=uy*N+ux;if(!drivable[u])continue;if(roadKindOf(grid[u])==='oneway'&&a!==1)continue;const nd=d+cost;if(nd<dist[u]){dist[u]=nd;next[u]=v;h.push(nd,u)}}}
 return{dist,next};
}
// Road blocks next to a block.
function sides(N,i){const x=i%N,y=(i-x)/N,out=[];for(const[a,b]of D4){const nx=x+a,ny=y+b;if(nx>=0&&ny>=0&&nx<N&&ny<N)out.push(ny*N+nx)}return out}

// Adds `amount` trips from block `origin` along the route to the nearest destination.
function load(N,route,drivable,inflow,origin,amount){if(amount<=0)return 0;let best=-1;for(const r of sides(N,origin))if(drivable[r]&&route.dist[r]<Infinity&&(best<0||route.dist[r]<route.dist[best]))best=r;if(best<0)return amount;inflow[best]+=amount;return 0}
function flowAlong(N,route,inflow,volume){const order=[];for(let i=0;i<N*N;i++)if(inflow[i]>0||route.next[i]>=0||route.dist[i]===0)if(route.dist[i]<Infinity)order.push(i);order.sort((p,q)=>route.dist[q]-route.dist[p]);for(const u of order){const f=inflow[u];if(!f)continue;volume[u]+=f;const n=route.next[u];if(n>=0)inflow[n]+=f}}

// ctx: {grid,N,jobsAt,popAt,shopAt,industryJobsAt,attractionAt,visitors,exit,exitConnected,harbors}
export function simulateTraffic(ctx){
 const{grid,N}=ctx,drivable=new Uint8Array(N*N),volume=new Float32Array(N*N),capacity=new Float32Array(N*N);
 for(let i=0;i<N*N;i++){const t=grid[i];if(t.type==='road'){const k=ROAD_KINDS[roadKindOf(t)];capacity[i]=k.capacity;if(k.capacity>0)drivable[i]=1}}
 const near=pred=>{const s=[];for(let i=0;i<N*N;i++)if(pred(i))for(const r of sides(N,i))if(drivable[r])s.push(r);return s};
 let stranded=0,trips=0;
 const run=(sources,origins)=>{if(!sources.length){for(const[,a]of origins)stranded+=a;return}const route=toNearest(grid,N,drivable,sources),inflow=new Float32Array(N*N);for(const[i,a]of origins){trips+=a;stranded+=load(N,route,drivable,inflow,i,a)}flowAlong(N,route,inflow,volume)};
 const homes=[];for(let i=0;i<N*N;i++)if(ctx.popAt[i]>0)homes.push(i);
 const workers=homes.reduce((a,i)=>a+ctx.popAt[i],0)/2,jobs=ctx.jobsAt.reduce((a,v)=>a+v,0),employed=workers?Math.min(1,jobs/workers):0;
 run(near(i=>ctx.jobsAt[i]>0),homes.map(i=>[i,ctx.popAt[i]/2*employed*TRIPS.carShare*TRIPS.commute]));
 run(near(i=>ctx.shopAt[i]>0),homes.map(i=>[i,ctx.popAt[i]*TRIPS.shopping*TRIPS.carShare]));
 const freightTo=ctx.exitConnected?[ctx.exit]:ctx.harbors.length?ctx.harbors:[];const freight=[];for(let i=0;i<N*N;i++)if(ctx.industryJobsAt[i]>0)freight.push([i,ctx.industryJobsAt[i]*TRIPS.freightPerJob]);
 if(freightTo.length)run([...near(i=>freightTo.includes(i)),...freightTo.filter(i=>drivable[i])],freight);
 if(ctx.exitConnected&&ctx.visitors>0){const at=[];let total=0;for(let i=0;i<N*N;i++)if(ctx.attractionAt[i]>0){at.push(i);total+=ctx.attractionAt[i]}if(total)run([ctx.exit,...near(i=>i===ctx.exit)],at.map(i=>[i,ctx.visitors*ctx.attractionAt[i]/total*TRIPS.visitor*TRIPS.carShare]))}
 const ratio=new Float32Array(N*N);let vol=0,slow=0,busy=0,jammed=0,roads=0;
 for(let i=0;i<N*N;i++){if(!capacity[i])continue;roads++;ratio[i]=volume[i]/capacity[i];vol+=volume[i];slow+=volume[i]*Math.max(1,ratio[i]);if(ratio[i]>=1)busy++;if(ratio[i]>=1.5)jammed++}
 const flow=vol?Math.round(vol/slow*100):100;
 return{volume,capacity,ratio,flow,vehicles:Math.round(vol),congested:busy,jammed,roads,trips:Math.round(trips),stranded:Math.round(stranded)};
}
// The busiest road beside a block (for approval and business effects).
export function worstBeside(N,ratio,grid,i){let r=0,highway=false;for(const j of sides(N,i)){if(grid[j].type!=='road')continue;if(ratio[j]>r)r=ratio[j];if(grid[j].roadKind==='highway')highway=true}return{ratio:r,highway}}
