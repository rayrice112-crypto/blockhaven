// Map side in blocks. Version-1 saves without a size are 32 x 32; new cities can be larger.
export const MAP_SIZES=[32,48,64];
export let N=32;
export function setMapSize(n){if(!MAP_SIZES.includes(n))throw Error('Invalid map size');N=n}
export const STYLES={
 heritage:{name:'Old town',wall:'#cebda5',roof:'#835343',floors:3,roofType:'gable'},
 coastal:{name:'Coastal',wall:'#e3ddc9',roof:'#b97854',floors:2,roofType:'gable'},
 modern:{name:'Modern',wall:'#c5c9c3',roof:'#59676b',floors:5,roofType:'flat'},
 brick:{name:'Warehouse',wall:'#a67559',roof:'#636b69',floors:4,roofType:'flat'},
 nordic:{name:'Nordic',wall:'#aa6251',roof:'#48545c',floors:2,roofType:'gable'},
 japanese:{name:'Japanese',wall:'#d1c9b4',roof:'#535c60',floors:2,roofType:'pagoda'},
 mediterranean:{name:'Mediterranean',wall:'#dfcbb1',roof:'#ac6545',floors:3,roofType:'gable'},
 artdeco:{name:'Art deco',wall:'#d7c8a6',roof:'#6e7d78',floors:6,roofType:'stepped'},
 glass:{name:'Glass district',wall:'#73929a',roof:'#415762',floors:8,roofType:'flat'},
 garden:{name:'Garden city',wall:'#b7c0aa',roof:'#637553',floors:3,roofType:'garden'},
 industrial:{name:'Industrial',wall:'#a18d75',roof:'#596668',floors:4,roofType:'flat'},
 neon:{name:'Neon district',wall:'#647382',roof:'#374958',floors:7,roofType:'flat',neon:true}
};
export const TERRAINS={coast:'Peninsula',island:'Island',river:'River valley'};
// Build-bar categories, in the order the reference game's bottom bar shows them.
export const GROUPS={roads:'Roads',utilities:'Utilities',housing:'Housing',jobs:'Jobs',services:'Services',parks:'Parks',landmarks:'Landmarks'};
// Utility units: power in MW, water and sewage in thousand m³, garbage in tonnes per day.
export const UTILITIES={power:{name:'Electricity',unit:'MW'},water:{name:'Water',unit:'K m³'},sewage:{name:'Sewage',unit:'K m³'},garbage:{name:'Garbage',unit:'t/day'}};
export const FUNDING=['road','power','water','sewage','garbage','park','school','clinic','fire','police','post'];
export const CATALOG={
 road:{name:'Road',cost:60,upkeep:1,group:'roads',description:'Connect blocks to the Town Hall road network. Pipes and cables run under every street.',key:'1',color:'#798087'},
 powerline:{name:'Power line',cost:40,upkeep:0,group:'roads',fund:'power',description:'Carries electricity across open land to join separate street networks.',color:'#8d9690'},
 home:{name:'Homes',cost:320,upkeep:2,group:'housing',description:'Homes fill with residents when connected to roads, power and water, and when there are jobs.',key:'2',color:'#c18362'},
 shop:{name:'Shops',cost:650,upkeep:6,jobs:32,group:'jobs',description:'Local businesses create 32 jobs (up to 64 when upgraded) and bring in tax revenue.',key:'3',color:'#71939a'},
 industry:{name:'Workshop',cost:900,upkeep:9,jobs:55,group:'jobs',description:'Create 55 jobs (up to 110). Keep workshops away from homes.',key:'4',color:'#a38b72'},
 office:{name:'Offices',cost:1800,upkeep:16,jobs:90,group:'jobs',description:'Offices create 90 professional jobs (up to 180) and grow faster with schools nearby.',key:'O',color:'#7896a0'},
 park:{name:'Park',cost:250,upkeep:3,radius:5,service:'park',group:'parks',description:'Green space improves approval within 5 blocks and cleans the air.',key:'5',color:'#719768'},
 power:{name:'Wind turbine',cost:4000,upkeep:20,utility:'power',capacity:4,group:'utilities',description:'4 MW of clean electricity for every building on its street network.',key:'6',color:'#a4b9b6'},
 solar:{name:'Solar farm',cost:9000,upkeep:30,utility:'power',capacity:12,group:'utilities',description:'12 MW of clean electricity for its street network.',color:'#5d7480'},
 chp:{name:'CHP plant',cost:22000,upkeep:85,utility:'power',capacity:60,pollution:4,group:'utilities',description:'60 MW of electricity and heat. Pollutes the air within 4 blocks.',color:'#8a8478'},
 water:{name:'Water tower',cost:3500,upkeep:15,utility:'water',capacity:12,group:'utilities',description:'Stores 12K m³ of fresh water for its street network. Needs electricity.',key:'7',color:'#80a4b3'},
 intake:{name:'Water intake',cost:6500,upkeep:20,utility:'water',capacity:40,shore:true,group:'utilities',description:'Draws 40K m³ of water. Build on the shore. Needs electricity.',color:'#6e9aa5'},
 well:{name:'Artesian well',cost:7000,upkeep:22,utility:'water',capacity:20,group:'utilities',description:'Pumps 20K m³ of groundwater anywhere on land. Needs electricity.',color:'#7b9a8f'},
 waterworks:{name:'Waterworks',cost:26000,upkeep:70,utility:'water',capacity:100,group:'utilities',description:'Treats 100K m³ of water for a large city. Needs electricity.',color:'#7aa2a8'},
 outfall:{name:'Sewage outfall',cost:3000,upkeep:8,utility:'sewage',capacity:20,shore:true,pollution:4,group:'utilities',description:'Releases 20K m³ of untreated sewage into the sea. Cheap, but pollutes the shore.',color:'#857862'},
 septic:{name:'Small treatment plant',cost:6000,upkeep:18,utility:'sewage',capacity:20,group:'utilities',description:'Cleans 20K m³ of sewage. Needs electricity.',color:'#8f9a88'},
 ponds:{name:'Treatment ponds',cost:9000,upkeep:20,utility:'sewage',capacity:60,pollution:2,group:'utilities',description:'Natural ponds treat 60K m³ of sewage. A mild smell within 2 blocks.',color:'#6d8f7a'},
 treatment:{name:'Sewage treatment plant',cost:16000,upkeep:45,utility:'sewage',capacity:90,group:'utilities',description:'Treats 90K m³ of sewage cleanly. Needs electricity.',color:'#8aa09c'},
 landfill:{name:'Landfill',cost:6000,upkeep:18,utility:'garbage',capacity:90,pollution:4,group:'utilities',description:'Takes 90 tonnes of garbage a day. Pollutes within 4 blocks.',color:'#8c7d5d'},
 recycling:{name:'Recycling center',cost:14000,upkeep:35,utility:'garbage',capacity:25,group:'utilities',description:'Recycles 25 tonnes a day without pollution. Needs electricity.',color:'#6f9273'},
 incinerator:{name:'Incinerator',cost:30000,upkeep:75,utility:'garbage',capacity:100,pollution:3,group:'utilities',description:'Burns 100 tonnes a day. Smoke pollutes within 3 blocks.',color:'#7d7469'},
 school:{name:'School',cost:2200,upkeep:25,radius:8,service:'education',serves:1500,group:'services',description:'Education within 8 blocks for up to 1,500 residents.',key:'8',color:'#c9aa75'},
 college:{name:'Collège',cost:6500,upkeep:55,radius:12,service:'education',serves:3500,fund:'school',group:'services',description:'Secondary education within 12 blocks for 3,500 residents. Attracts offices.',color:'#b48d64'},
 library:{name:'Library',cost:3000,upkeep:18,radius:8,service:'library',serves:5000,fund:'school',group:'services',description:'Books and study rooms improve approval within 8 blocks.',color:'#b9a97d'},
 clinic:{name:'Clinic',cost:2400,upkeep:28,radius:8,service:'health',serves:2000,group:'services',description:'Healthcare within 8 blocks for up to 2,000 residents.',key:'9',color:'#d6d9cb'},
 hospital:{name:'Hospital',cost:12000,upkeep:95,radius:15,service:'health',serves:8000,fund:'clinic',group:'services',description:'Healthcare within 15 blocks for 8,000 residents.',color:'#e0ddd0'},
 fire:{name:'Fire station',cost:2000,upkeep:23,radius:8,service:'fire',serves:5000,group:'services',description:'Puts out fires within 8 blocks and lowers the risk of new ones.',key:'F',color:'#b76e52'},
 police:{name:'Police',cost:1900,upkeep:22,radius:8,service:'police',serves:4000,group:'services',description:'Neighborhood safety within 8 blocks improves approval.',key:'P',color:'#788f9e'},
 post:{name:'Post office',cost:2600,upkeep:16,radius:10,service:'post',serves:6000,group:'services',description:'Mail delivery within 10 blocks. Shops do better with post nearby.',color:'#c3a35a'},
 plaza:{name:'Fountain square',cost:1200,upkeep:6,radius:6,service:'park',fund:'park',group:'parks',description:'A paved square with a fountain. Improves approval within 6 blocks.',color:'#b5ad95'},
 stadium:{name:'Neighborhood stadium',cost:9000,upkeep:40,radius:12,service:'park',fund:'park',group:'parks',description:'Sports and events improve approval within 12 blocks.',color:'#8fa47c'},
 church:{name:'Parish church',cost:5000,upkeep:10,radius:9,service:'landmark',group:'landmarks',fund:'park',description:'A landmark that raises approval within 9 blocks.',color:'#c9c0a8'},
 belfry:{name:'Clock belfry',cost:8000,upkeep:12,radius:11,service:'landmark',group:'landmarks',fund:'park',description:'A tall clock tower. Raises approval within 11 blocks.',color:'#b9aa8a'},
 demolish:{name:'Bulldoze',cost:0,description:'Remove a building and reclaim 25% of its cost.',key:'B',color:'#bd915b'}
};
export const ZONED=['home','shop','industry','office'];
export const LEVEL_MULT=[1,1.5,2];
export const MAX_LEVEL=3;
export const GRANTS={750:3000,1500:3000,2500:3000,5000:6000,10000:12000};
export const TIERS=[[0,'Village'],[750,'Small town'],[1500,'Town'],[2500,'City'],[5000,'Large city'],[10000,'Metropolis']];
export const REQUESTS={park:'a park nearby',education:'a school nearby',health:'healthcare nearby',sewage:'sewage service',garbage:'garbage collection',jobs:'more jobs'};
const D4=[[1,0],[-1,0],[0,1],[0,-1]];
export function hash(x,y,s=0){const n=Math.sin(x*127.1+y*311.7+s*74.7)*43758.5453;return n-Math.floor(n)}
export function land(x,y,terrain='coast'){
 const k=32/N;x*=k;y*=k;
 if(x<2||y<2||x>=30||y>=30)return false;
 if(terrain==='island')return ((x-15.5)/14)**2+((y-15.5)/13.5)**2<1;
 if(terrain==='river'){const bank=6+Math.round(Math.sin(y*.24));return !(x>=4&&x<=bank)}
 return x>=3&&y>=3&&x<29&&y<28&&x+y<49&&!(x>23&&y>15)&&!(x<6&&y>22)&&!(y<5&&x>22);
}
export function shore(x,y,terrain='coast'){return land(x,y,terrain)&&D4.some(([a,b])=>x+a>=0&&y+b>=0&&x+a<N&&y+b<N&&!land(x+a,y+b,terrain))}
export function tierName(pop){let name=TIERS[0][1];for(const[p,n]of TIERS)if(pop>=p)name=n;return name}
export function newCity(terrain='coast',size=32){
 if(!Object.hasOwn(TERRAINS,terrain))terrain='coast';setMapSize(size);const o=(N-32)>>1;
 const s={version:1,name:'New Port',terrain,taxRate:9,day:1,money:32000,history:[],grid:Array.from({length:N*N},(_,i)=>({type:null,pop:0,age:0,seed:hash(i%N,Math.floor(i/N)),style:'heritage',zone:null})),grants:[],happiness:75};if(N!==32)s.size=N;
 const put=(x,y,type,pop=0)=>{x+=o;y+=o;if(land(x,y,terrain))Object.assign(s.grid[y*N+x],{type,pop,age:8,style:['heritage','coastal','brick','modern'][Math.floor(hash(x,y,44)*4)]})};
 for(let x=5;x<25;x++)for(const y of [10,15,20])put(x,y,'road');
 for(let y=6;y<24;y++)for(const x of [8,13,18,23])put(x,y,'road');
 put(15,14,'hall');put(16,14,'park');put(15,13,'park');
 for(let y=7;y<23;y++)for(let x=7;x<24;x++){
  const t=s.grid[(y+o)*N+x+o];if(t.type||!land(x+o,y+o,terrain))continue;
  if(D4.some(([a,b])=>at(s,x+o+a,y+o+b)?.type==='road')&&hash(x,y,3)>.38){const v=hash(x,y,7);put(x,y,v<.64?'home':v<.87?'shop':'park',v<.64?6+Math.floor(hash(x,y,8)*7):0)}
 }
 put(14,14,'power');put(14,13,'water');put(21,21,'industry');put(22,21,'industry');put(19,19,'school');put(17,14,'clinic');put(18,18,'fire');put(12,14,'police');put(19,22,'landfill');put(22,22,'septic');return s;
}
export function at(s,x,y){return Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x<N&&y<N?s.grid[y*N+x]:null}
export function connected(s){const set=new Set(),queue=[];s.grid.forEach((t,i)=>{if(t.type==='hall'){const x=i%N,y=Math.floor(i/N);for(const[a,b]of D4)if(at(s,x+a,y+b)?.type==='road')queue.push((y+b)*N+x+a)}});while(queue.length){const i=queue.pop();if(set.has(i))continue;set.add(i);const x=i%N,y=Math.floor(i/N);for(const[a,b]of D4)if(at(s,x+a,y+b)?.type==='road'&&!set.has((y+b)*N+x+a))queue.push((y+b)*N+x+a)}return set}
export function level(t){return Math.max(1,Math.min(MAX_LEVEL,t?.level||1))}
export function capacity(t){const base=t?.density==='low'?16:t?.density==='high'?96:t?.seed>.7?48:28;return Math.round(base*LEVEL_MULT[level(t)-1])}
export function jobsOf(t){return Math.round((CATALOG[t?.type]?.jobs||0)*LEVEL_MULT[level(t)-1])}
const fundKey=type=>CATALOG[type]?.fund??type;
const fundingOf=(s,type)=>{const v=s.funding?.[fundKey(type)];return Number.isFinite(v)?Math.max(0,Math.min(150,v)):100};
// Daily use of each utility by one block. Residents use about 0.8 kW, 6 m³ of water and 1.2 kg of garbage.
export function usage(kind,t){
 if(!t?.type||t.enabled===false||['road','powerline','park','plaza'].includes(t.type)||CATALOG[t.type]?.utility===kind)return 0;
 if(t.type==='home')return {power:.0008,water:.006,sewage:.006,garbage:.0012}[kind]*t.pop;
 const L=level(t),per={shop:{power:.05,water:.1,sewage:.1,garbage:.2},industry:{power:.3,water:.3,sewage:.3,garbage:.5},office:{power:.25,water:.2,sewage:.2,garbage:.3}}[t.type];
 if(per)return per[kind]*L;
 return {power:.08,water:.1,sewage:.1,garbage:.1}[kind];
}
function label(s,pred){const comp=new Int32Array(N*N).fill(-1);let n=0;for(let i=0;i<N*N;i++){if(comp[i]>=0||!pred(s.grid[i]))continue;const stack=[i];comp[i]=n;while(stack.length){const j=stack.pop(),x=j%N,y=(j-x)/N;for(const[a,b]of D4){const nx=x+a,ny=y+b,k=ny*N+nx;if(nx>=0&&ny>=0&&nx<N&&ny<N&&comp[k]<0&&pred(s.grid[k])){comp[k]=n;stack.push(k)}}}n++}return{comp,n}}
function adjacent(net,i){const out=[],x=i%N,y=(i-x)/N;for(const[a,b]of D4){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=N||ny>=N)continue;const c=net.comp[ny*N+nx];if(c>=0&&!out.includes(c))out.push(c)}return out}
// Utilities flow along street networks (and power lines for electricity). Each network pools its
// providers' output; if demand is higher, the blocks furthest from a provider lose service first.
function distribute(s,kind,net,powered){
 const g=s.grid,parent=Array.from({length:net.n},(_,i)=>i),find=a=>{while(parent[a]!==a)a=parent[a]=parent[parent[a]];return a};const providers=[];
 g.forEach((t,i)=>{const c=CATALOG[t.type];if(c?.utility!==kind||t.enabled===false||t.fire>0)return;if(powered&&!powered[i])return;const out=c.capacity*Math.min(120,fundingOf(s,t.type))/100;if(out<=0)return;const comps=adjacent(net,i);for(const k of comps.slice(1))parent[find(k)]=find(comps[0]);providers.push({i,out,comps})});
 const supply=new Map(),sources=new Map();for(const p of providers){if(!p.comps.length)continue;const r=find(p.comps[0]);supply.set(r,(supply.get(r)||0)+p.out);if(!sources.has(r))sources.set(r,[]);sources.get(r).push(p.i)}
 const served=new Uint8Array(N*N),rootOf=new Int32Array(N*N).fill(-1),list=[];let demand=0,disconnected=0;
 g.forEach((t,i)=>{let root=-1;for(const k of adjacent(net,i)){const r=find(k);if(supply.has(r)){root=r;break}}const use=usage(kind,t);if(root<0){disconnected+=use;return}rootOf[i]=root;if(use<=0){served[i]=1;return}demand+=use;const x=i%N,y=(i-x)/N;let d=1e9;for(const j of sources.get(root))d=Math.min(d,Math.abs(j%N-x)+Math.abs((j-j%N)/N-y));list.push({i,use,root,d})});
 list.sort((a,b)=>a.d-b.d||a.i-b.i);const left=new Map(supply);let used=0;for(const c of list){const l=left.get(c.root);if(l+1e-9>=c.use){left.set(c.root,l-c.use);served[c.i]=1;used+=c.use}}
 const headroom=new Float32Array(N*N);for(let i=0;i<N*N;i++)if(rootOf[i]>=0)headroom[i]=left.get(rootOf[i]);
 let capacity=0;for(const v of supply.values())capacity+=v;
 return{served,headroom,capacity:Math.round(capacity*100)/100,demand:Math.round(demand*100)/100,disconnected:Math.round(disconnected*100)/100,used:Math.round(used*100)/100,shortfall:Math.max(0,Math.round((demand-used)*100)/100)};
}
const cache=new WeakMap();
function signature(s){let k=[s.day,s.terrain,s.taxRate,JSON.stringify(s.zoneTaxes||0),JSON.stringify(s.funding||0),JSON.stringify(s.loan||0),JSON.stringify(s.mood||0),s.disasters].join('|')+'|';for(const t of s.grid)k+=(t.type||'')+'.'+(t.enabled===false?0:1)+(t.pop||0)+'.'+(t.level||1)+(t.roadKind||'')+(t.density||'')+(t.fire||0)+(t.zone||'')+(t.seed>.7?1:0)+',';return k}
export function analyze(s){const key=signature(s),hit=cache.get(s);if(hit&&hit.key===key)return hit.a;const a=compute(s);cache.set(s,{key,a});return a}
function compute(s){
 const g=s.grid,roads=connected(s),road=new Uint8Array(N*N);
 for(let i=0;i<N*N;i++){const x=i%N,y=(i-x)/N;road[i]=D4.some(([a,b])=>x+a>=0&&x+a<N&&y+b>=0&&y+b<N&&roads.has((y+b)*N+x+a))?1:0}
 const streets=label(s,t=>t.type==='road'),grid=label(s,t=>t.type==='road'||t.type==='powerline');
 const util={power:distribute(s,'power',grid,null)};for(const k of ['water','sewage','garbage'])util[k]=distribute(s,k,streets,util.power.served);
 const cover={},capacityOf={};for(const k of ['park','education','library','health','fire','police','post','landmark'])cover[k]=new Uint8Array(N*N);
 const poll=new Uint8Array(N*N),mark=(arr,i,r)=>{const x0=i%N,y0=(i-x0)/N,R=Math.ceil(r);for(let y=Math.max(0,y0-R);y<=Math.min(N-1,y0+R);y++)for(let x=Math.max(0,x0-R);x<=Math.min(N-1,x0+R);x++)if(Math.hypot(x-x0,y-y0)<=r)arr[y*N+x]=1};
 g.forEach((t,i)=>{const c=CATALOG[t.type];if(!c||t.enabled===false)return;
  if(t.type==='industry'||c.pollution)mark(poll,i,t.type==='industry'?3:c.pollution);
  if(!c.radius||t.fire>0)return;const f=fundingOf(s,t.type);if(f<=0)return;
  if(!['park','plaza'].includes(t.type)&&(!road[i]||!util.power.served[i]))return;
  mark(cover[c.service],i,c.radius*Math.sqrt(f/100));if(c.serves)capacityOf[c.service]=(capacityOf[c.service]||0)+c.serves*Math.min(1,f/100)});
 g.forEach((t,j)=>{if((t.type==='park'||t.type==='plaza')&&t.enabled!==false){const x=j%N,y=(j-x)/N;poll[j]=0;for(const[a,b]of D4)if(x+a>=0&&y+b>=0&&x+a<N&&y+b<N)poll[(y+b)*N+x+a]=0}});
 const ok=i=>road[i]&&util.power.served[i]&&util.water.served[i];
 let pop=0,jobs=0,upkeep=0,good=0,homes=0,housing=0,eduHomes=0,ready=0;const sectorIncome={home:0,shop:0,industry:0,office:0},taxRate=s.taxRate??9,tax=k=>s.zoneTaxes?.[k]??taxRate;
 for(const t of g)if(t.type==='home')pop+=t.pop||0;
 const quality=k=>capacityOf[k]?Math.min(1,capacityOf[k]/Math.max(1,pop)):0;
 g.forEach((t,i)=>{const c=CATALOG[t.type];if(t.enabled!==false&&c){const base=(c.upkeep||0)+(t.type==='road'&&t.roadKind==='bridge'?2:0)+(t.type==='road'&&t.roadKind==='boulevard'?1:0);upkeep+=base*LEVEL_MULT[level(t)-1]*fundingOf(s,t.type)/100}
  if(t.type==='home'){homes++;housing+=capacity(t);if(cover.education[i])eduHomes++;good+=30+15*road[i]+12*util.power.served[i]+12*util.water.served[i]+9*cover.park[i]+7*cover.education[i]*quality('education')+7*cover.health[i]*quality('health')+4*cover.police[i]+4*cover.fire[i]+3*cover.library[i]+2*cover.post[i]+4*cover.landmark[i]-15*poll[i]-(util.sewage.served[i]?0:8)-(util.garbage.served[i]?0:6)-(t.fire>0?20:0)}
  if(c?.jobs&&t.enabled!==false&&!(t.fire>0)&&ok(i)){jobs+=jobsOf(t);sectorIncome[t.type]+=(t.type==='office'?110:t.type==='shop'?45:65)*LEVEL_MULT[level(t)-1]*tax(t.type)/9*(t.type==='shop'&&cover.post[i]?1.1:1)}});
 const mood=s.mood?.days>0?s.mood.value:0;
 const happiness=Math.max(10,Math.min(99,Math.round((homes?good/homes:70)-(pop>jobs*2?10:0)-Math.max(0,tax('home')-9)*4+mood)));upkeep=Math.round(upkeep);
 const residentialTax=Math.floor(pop*.65*tax('home')/9);sectorIncome.home=residentialTax;for(const k of ['shop','industry','office'])sectorIncome[k]=Math.floor(sectorIncome[k]);const businessTax=sectorIncome.shop+sectorIncome.industry+sectorIncome.office;
 const loanPayment=s.loan?.daysLeft>0?Math.min(s.loan.remaining,1400):0,pct=v=>Math.max(0,Math.min(100,Math.round(v))),eduShare=homes?eduHomes/homes:0;
 const demand={home:pct((jobs*2-pop)/Math.max(100,jobs*2)*100),shop:pct(pop/Math.max(1,jobs*2)*100),industry:pct(pop/Math.max(1,jobs*2)*90),office:pct(pop/Math.max(1,jobs*2)*100*eduShare)};
 g.forEach((t,i)=>{if(upgradeReady(s,i,{road,util,happiness,demand}))ready++});
 const metrics={sectorIncome,loanPayment,pop,jobs,upkeep,happiness,residentialTax,businessTax,income:residentialTax+businessTax-upkeep-loanPayment,roads,homes,housing,demand,utilities:Object.fromEntries(Object.entries(util).map(([k,u])=>[k,{capacity:u.capacity,demand:u.demand,used:u.used,shortfall:u.shortfall,disconnected:u.disconnected}])),services:Object.fromEntries(Object.keys(cover).map(k=>[k,{capacity:Math.round(capacityOf[k]||0),quality:Math.round(quality(k)*100)}])),upgradesReady:ready,workers:Math.floor(pop/2),jobsNeeded:Math.max(0,Math.ceil(pop/2)-jobs)};
 return{road,roads,util,cover,poll,metrics,ok};
}
function upgradeReady(s,i,a){const t=s.grid[i];if(!ZONED.includes(t.type)||level(t)>=MAX_LEVEL||t.enabled===false||t.fire>0)return false;if(!a.road[i]||!a.util.power.served[i]||!a.util.water.served[i])return false;if(t.age<10*level(t)||a.happiness<55)return false;const next={...t,level:level(t)+1};for(const k of ['power','water'])if(a.util[k].headroom[i]+1e-9<usage(k,next)-usage(k,t))return false;return t.type==='home'?t.pop>=capacity(t)*.9:a.demand[t.type]>=50}
export function serviced(s,x,y,type){const a=analyze(s),i=y*N+x,svc=CATALOG[type]?.service;if(!at(s,x,y))return false;if(type==='industry')return !!a.poll[i];if(a.util[type])return !!a.util[type].served[i];return svc?!!a.cover[svc][i]:false}
export function status(s,x,y){const a=analyze(s),i=y*N+x,t=at(s,x,y);if(!t)return{road:false,power:false,water:false,sewage:false,garbage:false,park:false,school:false,clinic:false,fire:false,police:false,library:false,post:false,landmark:false,polluted:false,capacity:0};return{road:!!a.road[i],power:!!a.util.power.served[i],water:!!a.util.water.served[i],sewage:!!a.util.sewage.served[i],garbage:!!a.util.garbage.served[i],park:!!a.cover.park[i],school:!!a.cover.education[i],clinic:!!a.cover.health[i],fire:!!a.cover.fire[i],police:!!a.cover.police[i],library:!!a.cover.library[i],post:!!a.cover.post[i],landmark:!!a.cover.landmark[i],polluted:!!a.poll[i],capacity:capacity(t),upgrade:upgradeReady(s,i,{...a,happiness:a.metrics.happiness,demand:a.metrics.demand})}}
export function metrics(s){return analyze(s).metrics}
export function zone(s,x,y,type,style='heritage',options={}){const t=at(s,x,y);if(!t||!land(x,y,s.terrain))return{error:'Zone dry land beside a connected road.'};if(!['home','shop','industry','office',null].includes(type))return{error:'Unknown district type.'};if(t.type)return{error:'Zone open blocks. Clear existing buildings first.'};if(type&&s.money<20)return{error:'Zoning costs $20 per block.'};if(t.zone===type)return{error:'This block already has that zone.'};t.zone=type;t.density=['low','medium','high'].includes(options.density)?options.density:'medium';t.style=Object.hasOwn(STYLES,style)?style:'heritage';if(type)s.money-=20;return{ok:true}}
export function upgradeCost(t){return Math.floor((CATALOG[t?.type]?.cost||0)*.6*level(t))}
export function upgrade(s,x,y){const t=at(s,x,y);if(!t||!ZONED.includes(t.type))return{error:'Only homes, shops, workshops and offices can be upgraded.'};if(level(t)>=MAX_LEVEL)return{error:'This building is already at its highest level.'};const a=analyze(s),i=y*N+x;if(!a.road[i]||!a.util.power.served[i]||!a.util.water.served[i])return{error:'Connect a road, electricity and water before upgrading.'};if(t.fire>0)return{error:'Put out the fire first.'};const cost=upgradeCost(t);if(s.money<cost)return{error:'Treasury is too low for this upgrade.'};const next={...t,level:level(t)+1};for(const k of ['power','water'])if(a.util[k].headroom[i]+1e-9<usage(k,next)-usage(k,t))return{error:`Not enough ${UTILITIES[k].name.toLowerCase()} on this network. Build more supply first.`};s.money-=cost;t.level=level(t)+1;t.paid=(t.paid??CATALOG[t.type].cost)+cost;return{ok:true,cost}}
function makeRequest(s,a,m){if(s.requests?.length||s.day%9!==0||m.homes<4)return null;const homes=s.grid.map((t,i)=>t.type==='home'&&t.pop>0?i:-1).filter(i=>i>=0).sort((p,q)=>hash(p,s.day,5)-hash(q,s.day,5));
 for(const i of homes){const x=i%N,y=Math.floor(i/N);for(const kind of ['park','education','health','sewage','garbage']){const has=a.util[kind]?a.util[kind].served[i]:a.cover[kind][i];if(!has)return{kind,x,y,due:s.day+12}}}
 if(m.pop>=m.jobs*1.9)return{kind:'jobs',x:-1,y:-1,due:s.day+15,target:m.jobs+60};return null}
function requestMet(s,r,a,m){if(r.kind==='jobs')return m.jobs>=r.target;const i=r.y*N+r.x;return a.util[r.kind]?!!a.util[r.kind].served[i]:!!a.cover[r.kind]?.[i]}
export function tick(s){const a=analyze(s),m=a.metrics;s.day++;s.money+=m.income;if(s.loan?.daysLeft>0){s.loan.remaining-=m.loanPayment;s.loan.daysLeft--;if(s.loan.daysLeft===0)s.loan=null}s.happiness=m.happiness;
 const changed=[],events=[],status=i=>({road:a.road[i],power:a.util.power.served[i],water:a.util.water.served[i]});let available=Math.max(0,m.jobs*2-m.pop),bonus=0;
 if(s.mood?.days>0){s.mood.days--;if(!s.mood.days)s.mood=null}
 s.grid.forEach((t,i)=>{const x=i%N,y=Math.floor(i/N);if(t.type)t.age++;
  if(s.disasters!==false&&t.type&&!['road','powerline','park','plaza','hall'].includes(t.type)){
   if(t.fire>0){if(a.cover.fire[i]){t.fire=0;events.push({kind:'extinguished',i});changed.push(i)}else if(++t.fire>3){events.push({kind:'burned',i,type:t.type});Object.assign(t,{type:null,zone:ZONED.includes(t.type)?t.type:t.zone,pop:0,age:0,level:undefined,fire:0,paid:undefined});changed.push(i);return}}
   else if(hash(x,y,s.day*1.37+.21)<.0006*(a.cover.fire[i]?.3:1)*(a.util.garbage.served[i]?1:1.6)){t.fire=1;events.push({kind:'fire',i});changed.push(i)}}
  if(t.zone&&!t.type&&s.day%3===0&&hash(x,y,s.day)>.55){const st=status(i);if(st.road&&st.power&&st.water&&m.demand[t.zone]>0&&a.util.power.headroom[i]>=.3&&a.util.water.headroom[i]>=.3){t.type=t.zone;t.age=0;t.pop=0;t.enabled=true;t.level=undefined;changed.push(i)}}
  if(upgradeReady(s,i,{road:a.road,util:a.util,happiness:m.happiness,demand:m.demand})&&hash(x,y,s.day+.5)>.9){t.level=level(t)+1;events.push({kind:'upgrade',i});if(!changed.includes(i))changed.push(i)}
  if(t.type!=='home')return;const st=status(i),old=t.pop;
  if(t.fire>0)t.pop=Math.floor(t.pop*.75);
  else if(st.road&&st.power&&st.water&&m.happiness>45&&available>0){const n=Math.min(available,Math.max(0,capacity(t)-t.pop),2+Math.floor(t.seed*3));t.pop+=n;available-=n}
  else if(!st.road||!st.power||!st.water)t.pop=Math.max(0,t.pop-2);
  if(t.pop>capacity(t))t.pop=capacity(t);
  if(Math.floor(old/18)!==Math.floor(t.pop/18)&&!changed.includes(i))changed.push(i)});
 s.requests=(s.requests||[]).filter(r=>{if(requestMet(s,r,a,m)){bonus+=1500;s.money+=1500;s.mood={value:6,days:10};events.push({kind:'request-done',request:r});return false}if(s.day>r.due){s.mood={value:-6,days:10};events.push({kind:'request-failed',request:r});return false}return true});
 const req=makeRequest(s,a,m);if(req){s.requests.push(req);events.push({kind:'request',request:req})}
 const n=metrics(s);for(const goal of Object.keys(GRANTS).map(Number))if(n.pop>=goal&&!s.grants.includes(goal)){s.grants.push(goal);s.money+=GRANTS[goal];bonus+=GRANTS[goal];changed.grant=goal;events.push({kind:'grant',goal})}
 for(const k of Object.keys(UTILITIES))if(n.utilities[k].shortfall>0&&!(m.utilities[k].shortfall>0))events.push({kind:'shortage',utility:k});
 (s.history??=[]).push({day:s.day,pop:n.pop,money:Math.floor(s.money),income:n.income});s.history=s.history.slice(-120);changed.events=events;changed.bonus=bonus;return changed}
export function build(s,x,y,type,style='heritage',options={}){if(!Object.hasOwn(CATALOG,type))return{error:'Choose a building tool first.'};const t=at(s,x,y);if(!t||(!land(x,y,s.terrain)&&!(type==='road'&&options.roadKind==='bridge')))return{error:'Build on dry land, or use the Bridge road type to cross water.'};if(t.type==='hall')return{error:'Town Hall is the heart of your city. Keep it connected.'};if(type==='demolish'){if(!t.type&&!t.zone)return{error:'This block is already empty.'};s.money+=Math.floor((t.paid??CATALOG[t.type]?.cost??0)*.25);Object.assign(t,{type:null,zone:null,pop:0,age:0,enabled:true,level:undefined,fire:0});return{ok:true}}if(t.type)return{error:t.type===type?'Already built here.':'This block is occupied. Clear it with the bulldozer first.'};if(CATALOG[type].shore&&!shore(x,y,s.terrain))return{error:CATALOG[type].name+' must be built on the shore, next to water.'};const roadKind=['street','boulevard','oneway','pedestrian','bridge'].includes(options.roadKind)?options.roadKind:'street',cost=type==='road'?{street:60,boulevard:140,oneway:70,pedestrian:90,bridge:180}[roadKind]:CATALOG[type].cost;if(s.money<cost)return{error:'Treasury is too low. Let tax income build up first.'};s.money-=cost;Object.assign(t,{enabled:true,paid:cost,roadKind:type==='road'?roadKind:null,density:['low','medium','high'].includes(options.density)?options.density:'medium',type,pop:0,age:0,zone:null,level:undefined,fire:0,style:Object.hasOwn(STYLES,style)?style:'heritage'});return{ok:true}}
const int=(v,lo,hi)=>Number.isInteger(v)&&v>=lo&&v<=hi;
// Validation runs at the save's own map size and leaves the current size unchanged;
// call setMapSize(city.size ?? 32) when the validated city becomes the active one.
export function validateCity(s){const previous=N;try{setMapSize(s?.size??32);const city=checkCity(s);if(N!==32)city.size=N;return city}finally{N=previous}}
function checkCity(s){
 if(!s||s.version!==1||typeof s.name!=='string'||!s.name.trim()||s.name.length>28||!Number.isFinite(s.money)||Math.abs(s.money)>1e12||!Number.isInteger(s.day)||s.day<1||s.day>1e8||!Array.isArray(s.grid)||s.grid.length!==N*N||!Array.isArray(s.grants)||new Set(s.grants).size!==s.grants.length||s.grants.some(n=>!Object.hasOwn(GRANTS,n)))throw Error('Invalid city file');
 const terrain=s.terrain??'coast';if(!Object.hasOwn(TERRAINS,terrain)||!Number.isFinite(s.taxRate??9)||(s.taxRate??9)<5||(s.taxRate??9)>18)throw Error('Invalid city settings');let halls=0;
 const grid=s.grid.map((t,i)=>{if(!t||!(t.type===null||t.type==='hall'||(Object.hasOwn(CATALOG,t.type)&&t.type!=='demolish'))||!Number.isFinite(t.seed)||t.seed<0||t.seed>=1||!Number.isInteger(t.pop)||t.pop<0||t.pop>200||!Number.isInteger(t.age)||t.age<0||t.age>1e8||((t.type||t.zone)&&!land(i%N,Math.floor(i/N),terrain)&&!(t.type==='road'&&t.roadKind==='bridge'))||(t.type!=='home'&&t.pop!==0)||![null,undefined,'home','shop','industry','office'].includes(t.zone)||(t.style!==undefined&&!Object.hasOwn(STYLES,t.style))||(t.density!==undefined&&!['low','medium','high'].includes(t.density))||(t.roadKind!==undefined&&t.roadKind!==null&&!['street','boulevard','oneway','pedestrian','bridge'].includes(t.roadKind))||(t.paid!==undefined&&(!Number.isFinite(t.paid)||t.paid<0||t.paid>1e6))||(t.enabled!==undefined&&typeof t.enabled!=='boolean')||(t.level!==undefined&&t.level!==null&&!int(t.level,1,MAX_LEVEL))||(t.fire!==undefined&&!int(t.fire,0,3)))throw Error('Invalid block');if(t.type==='hall')halls++;
  const tile={type:t.type,pop:t.pop,age:t.age,seed:t.seed,zone:t.zone??null,enabled:t.enabled!==false,style:t.style??'heritage',density:t.density,roadKind:t.roadKind,paid:t.paid};if(ZONED.includes(t.type)&&t.level>1)tile.level=t.level;if(t.fire>0&&t.type)tile.fire=t.fire;return tile});
 if(halls!==1)throw Error('City needs one Town Hall');const zoneTaxes={},funding={};for(const k of ['home','shop','industry','office']){const v=s.zoneTaxes?.[k]??s.taxRate??9;if(!int(v,5,18))throw Error('Invalid sector tax');zoneTaxes[k]=v}for(const k of FUNDING){const v=s.funding?.[k]??100;if(!int(v,0,150))throw Error('Invalid service funding');funding[k]=v}let loan=null;if(s.loan){if(!int(s.loan.daysLeft,1,20)||!Number.isInteger(s.loan.remaining)||s.loan.remaining!==s.loan.daysLeft*1400)throw Error('Invalid loan');loan={daysLeft:s.loan.daysLeft,remaining:s.loan.remaining}}
 const history=Array.isArray(s.history)?s.history.slice(-120).filter(h=>h&&['day','pop','money','income'].every(k=>Number.isFinite(h[k]))):[];
 const requests=Array.isArray(s.requests)?s.requests.slice(0,3).filter(r=>r&&Object.hasOwn(REQUESTS,r.kind)&&int(r.due,1,1e8)&&(r.kind==='jobs'?int(r.target,0,1e7):int(r.x,0,N-1)&&int(r.y,0,N-1))).map(r=>r.kind==='jobs'?{kind:r.kind,x:-1,y:-1,due:r.due,target:r.target}:{kind:r.kind,x:r.x,y:r.y,due:r.due}):[];
 const mood=s.mood&&int(s.mood.value,-10,10)&&int(s.mood.days,1,30)?{value:s.mood.value,days:s.mood.days}:null;
 return{version:1,zoneTaxes,funding,loan,name:s.name.trim(),money:s.money,day:s.day,terrain,taxRate:s.taxRate??9,history,grid,grants:[...s.grants],happiness:Number.isFinite(s.happiness)?s.happiness:75,requests,mood,disasters:s.disasters!==false};
}

export function takeLoan(s){if(s.loan?.daysLeft>0)return{error:'Repay the current city loan first.'};s.loan={remaining:28000,daysLeft:20};s.money+=25000;return{ok:true}}
export function toggleBuilding(s,x,y){const t=at(s,x,y);if(!t?.type||['road','hall','home'].includes(t.type))return{error:'This building cannot be switched off.'};t.enabled=t.enabled===false;return{ok:true}}
