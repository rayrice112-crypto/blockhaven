// Blockhaven economy.
//
// Every flow of money is a module in one of the registries below. A module has an id, a name,
// a budget group and a compute(ctx) function that returns dollars per day. The simulation
// (model.mjs) builds one context object per day and asks every registered module for its
// amount, so a new tax, fee, trade route, policy or building income only needs one entry here:
// the budget screen, the daily total and the saves pick it up automatically.
//
// The design follows how Cities: Skylines II runs a city's money: taxes split by resident
// income and by business sector, service fees, trade in utilities with neighboring cities,
// a government subsidy that shrinks as the city grows, budget-driven service upkeep, loans
// priced by a credit rating, and city-wide policies with costs and side effects.

export const TAX_RANGE=[0,25];
export const NEUTRAL_TAX=9;
// Residents pay by income. A home's building level decides its residents' bracket.
export const BRACKETS={
 low:{name:'Low income',level:1,perResident:.65},
 mid:{name:'Middle income',level:2,perResident:.8},
 high:{name:'High income',level:3,perResident:1}
};
export const SECTORS={shop:'Commercial',industry:'Industrial',office:'Offices'};

// Service fees are charged to every resident who receives the service. 100% is the normal
// price. Higher fees bring in more money and cost approval; lower fees win approval.
export const FEE_RANGE=[0,200];
export const FEES={
 power:{name:'Electricity',perResident:.05},
 water:{name:'Water and sewage',perResident:.06},
 garbage:{name:'Garbage collection',perResident:.03},
 health:{name:'Healthcare',perResident:.04},
 education:{name:'Education',perResident:.03}
};
export const feeApproval=f=>f>100?-(f-100)/25:(100-f)/50;

// Trade with neighboring cities through the regional grid. Spare capacity is sold every day;
// a shortage can be covered by buying from neighbors at a higher price. Prices are dollars per
// unit of the utility (MW, thousand m³ or tonnes) per day.
export const TRADE={
 power:{name:'Electricity',sell:6,buy:18},
 water:{name:'Water',sell:3,buy:9},
 sewage:{name:'Sewage treatment',sell:2,buy:8},
 garbage:{name:'Garbage processing',sell:.6,buy:2.5}
};

// City policies. approval and demand are applied by the simulation; cost and income are
// budget modules further down.
export const POLICIES={
 paidParking:{name:'Paid street parking',description:'Drivers pay to park on city streets: +$0.08 per job each day. −2 approval.',approval:-2},
 lottery:{name:'City lottery',description:'A weekly draw: +$0.12 per resident each day. −1 approval.',approval:-1},
 tourism:{name:'Tourism campaign',description:'Advertise the city: 40% more visitors. Costs $60 plus $0.02 per resident each day.'},
 festival:{name:'Festival program',description:'Year-round events: +4 approval and 10% more visitors. Costs $120 each day.',approval:4},
 smallBusiness:{name:'Small business grants',description:'Commercial demand +15 and +1 approval. Costs $0.60 per shop each day.',approval:1,demand:{shop:15}},
 freeTrade:{name:'Free trade zone',description:'Cargo harbors earn 25% more and industrial demand +10. Costs $40 each day.',demand:{industry:10}},
 techIncentives:{name:'Tech incentives',description:'Office demand +15. Costs $0.05 per office job each day.',demand:{office:15}}
};

// Loans. The rating decides the interest rate; interest is quoted per year (120 days) and
// added up front, then the total is repaid in equal daily installments.
export const LOAN_TERMS=[20,40,60];
export const MAX_LOANS=3;
export const RATINGS=[[85,'AAA',.03],[75,'AA',.04],[65,'A',.05],[55,'BBB',.065],[45,'BB',.085],[35,'B',.11],[-Infinity,'CCC',.15]];
export const QUICK_LOAN={amount:25000,total:28000,days:20,payment:1400};

// Tourism and the money buildings.
export const ATTRACTION={hall:20,park:4,plaza:12,library:8,stadium:80,church:40,belfry:60,harbor:10};
export const HOTEL_ROOMS=80,HOTEL_NIGHT=4,DAY_VISITOR=.5;
export const HARBOR={perJob:1.2,cap:260};
export const GARAGE={radius:6,perJob:.25,cap:150};
export const TAX_OFFICE={bonus:.05,max:2};

// Upkeep is grouped the way the budget screen shows it.
export const UPKEEP_GROUPS={
 roads:'Roads and bridges',power:'Electricity',water:'Water',sewage:'Sewage',garbage:'Garbage',
 parks:'Parks and landmarks',education:'Education',health:'Healthcare',fire:'Fire and rescue',
 police:'Police',post:'Post',districts:'District upkeep',economy:'Economy buildings'
};
const UPKEEP_OF={road:'roads',powerline:'power',power:'power',solar:'power',chp:'power',water:'water',intake:'water',well:'water',waterworks:'water',outfall:'sewage',septic:'sewage',ponds:'sewage',treatment:'sewage',landfill:'garbage',recycling:'garbage',incinerator:'garbage',park:'parks',plaza:'parks',stadium:'parks',church:'parks',belfry:'parks',school:'education',college:'education',library:'education',clinic:'health',hospital:'health',fire:'fire',police:'police',post:'post',home:'districts',shop:'districts',industry:'districts',office:'districts',hotel:'economy',harbor:'economy',parking:'economy',taxoffice:'economy'};
export const upkeepGroup=type=>UPKEEP_OF[type]??'districts';

const clampInt=(v,[lo,hi],d)=>Number.isInteger(v)&&v>=lo&&v<=hi?v:d;
export const taxOf=(s,key)=>{const base=s.zoneTaxes?.[key]??s.taxRate??NEUTRAL_TAX;return base};
export const bracketTax=(s,b)=>s.taxBrackets?.[b]??taxOf(s,'home');
export const feeOf=(s,k)=>clampInt(s.fees?.[k],FEE_RANGE,100);
export const policyOn=(s,k)=>s.policies?.[k]===true;
export const sells=(s,k)=>s.trade?.export?.[k]!==false;
export const buys=(s,k)=>s.trade?.import?.[k]===true;

// ---- budget modules -------------------------------------------------------------------
export const REVENUE=[];
export const EXPENSES=[];
export function registerRevenue(m){REVENUE.push(m);return m}
export function registerExpense(m){EXPENSES.push(m);return m}

registerRevenue({id:'tax-residential',group:'Taxes',name:'Residential tax',compute:c=>c.residentialTax});
for(const k of Object.keys(SECTORS))registerRevenue({id:'tax-'+k,group:'Taxes',name:SECTORS[k]+' tax',compute:c=>c.sectorIncome[k]});
registerRevenue({id:'tax-office-bonus',group:'Taxes',name:'Tax office collection',compute:c=>{const n=Math.min(TAX_OFFICE.max,c.count.taxoffice||0);return Math.floor((c.residentialTax+c.sectorIncome.shop+c.sectorIncome.industry+c.sectorIncome.office)*TAX_OFFICE.bonus*n)}});
for(const[k,f]of Object.entries(FEES))registerRevenue({id:'fee-'+k,group:'Service fees',name:f.name+' fees',compute:c=>Math.floor(c.servedResidents[k]*f.perResident*feeOf(c.s,k)/100)});
registerRevenue({id:'trade-export',group:'Trade',name:'Utility sales to neighbors',compute:c=>Math.floor(Object.values(c.exports).reduce((a,e)=>a+e.amount,0))});
registerRevenue({id:'tourism',group:'Tourism and exports',name:'Tourism (hotels and visitors)',compute:c=>Math.floor((c.tourism.stays*HOTEL_NIGHT+c.tourism.dayVisitors*DAY_VISITOR)*taxOf(c.s,'shop')/NEUTRAL_TAX)});
registerRevenue({id:'harbor',group:'Tourism and exports',name:'Cargo harbor exports',compute:c=>Math.floor(c.harborIncome)});
registerRevenue({id:'parking',group:'Fees and charges',name:'Parking',compute:c=>Math.floor(c.garageIncome+(policyOn(c.s,'paidParking')?c.jobs*.08:0))});
registerRevenue({id:'lottery',group:'Fees and charges',name:'City lottery',compute:c=>policyOn(c.s,'lottery')?Math.floor(c.pop*.12):0});
registerRevenue({id:'subsidy',group:'Government',name:'Government subsidy',compute:c=>Math.max(0,Math.round(250-c.pop/40))});

for(const[k,name]of Object.entries(UPKEEP_GROUPS))registerExpense({id:'upkeep-'+k,group:'Service upkeep',name,compute:c=>Math.round(c.upkeepBy[k]||0)});
registerExpense({id:'trade-import',group:'Trade',name:'Utilities bought from neighbors',compute:c=>Math.ceil(Object.values(c.imports).reduce((a,e)=>a+e.amount,0))});
registerExpense({id:'loans',group:'Loans',name:'Loan payments',compute:c=>c.loanPayment});
registerExpense({id:'overdraft',group:'Loans',name:'Overdraft interest',compute:c=>c.s.money<0?Math.ceil(-c.s.money*.005):0});
registerExpense({id:'policy-tourism',group:'Policies',name:'Tourism campaign',compute:c=>policyOn(c.s,'tourism')?Math.round(60+c.pop*.02):0});
registerExpense({id:'policy-festival',group:'Policies',name:'Festival program',compute:c=>policyOn(c.s,'festival')?120:0});
registerExpense({id:'policy-smallBusiness',group:'Policies',name:'Small business grants',compute:c=>policyOn(c.s,'smallBusiness')?Math.round((c.count.shop||0)*.6):0});
registerExpense({id:'policy-freeTrade',group:'Policies',name:'Free trade zone',compute:c=>policyOn(c.s,'freeTrade')?40:0});
registerExpense({id:'policy-techIncentives',group:'Policies',name:'Tech incentives',compute:c=>policyOn(c.s,'techIncentives')?Math.round(c.officeJobs*.05):0});

// Runs every module against one day's context. Each row is a whole number of dollars and the
// net income is exactly the sum of the rows.
export function evaluateBudget(ctx){
 const run=list=>list.map(m=>{const v=m.compute(ctx);return{id:m.id,group:m.group,name:m.name,amount:Number.isFinite(v)?Math.max(0,Math.round(v)):0}});
 const revenue=run(REVENUE),expenses=run(EXPENSES);
 const totalRevenue=revenue.reduce((a,r)=>a+r.amount,0),totalExpenses=expenses.reduce((a,r)=>a+r.amount,0);
 return{revenue,expenses,totalRevenue,totalExpenses,net:totalRevenue-totalExpenses};
}
export const row=(budget,id)=>budget.revenue.find(r=>r.id===id)?.amount??budget.expenses.find(r=>r.id===id)?.amount??0;

// Approval and demand effects of fees and policies.
export function approvalEffects(s){let v=0;for(const k of Object.keys(FEES))v+=feeApproval(feeOf(s,k));for(const[k,p]of Object.entries(POLICIES))if(policyOn(s,k))v+=p.approval||0;return Math.round(v)}
export function demandEffects(s){const d={home:0,shop:0,industry:0,office:0};for(const[k,p]of Object.entries(POLICIES))if(policyOn(s,k))for(const[z,v]of Object.entries(p.demand||{}))d[z]+=v;return d}
// High taxes push businesses and residents away; low taxes attract them.
export const taxDemand=rate=>rate>NEUTRAL_TAX?-(rate-NEUTRAL_TAX)*4:(NEUTRAL_TAX-rate)*2;

// ---- loans ----------------------------------------------------------------------------
export function outstanding(s){return (s.loan?.daysLeft>0?s.loan.remaining:0)+(s.loans||[]).reduce((a,l)=>a+l.remaining,0)}
export function dailyLoanPayment(s){let p=s.loan?.daysLeft>0?Math.min(s.loan.remaining,QUICK_LOAN.payment):0;for(const l of s.loans||[])p+=Math.min(l.remaining,l.payment);return p}
export function credit(s,{pop,income,happiness}){
 const limit=Math.round((15000+pop*20+Math.max(0,income)*30)/1000)*1000,owed=outstanding(s);
 let score=50+Math.max(-25,Math.min(25,income/20))+(happiness-60)/2+Math.max(-15,Math.min(15,s.money/5000))-Math.min(20,owed/Math.max(1,limit)*20);
 score=Math.max(0,Math.min(100,Math.round(score)));const[,rating,rate]=RATINGS.find(([min])=>score>=min);
 return{score,rating,rate,limit,owed,available:Math.max(0,Math.floor((limit-owed)/1000)*1000)};
}
export function loanQuote(amount,days,rate){const total=Math.round(amount*(1+rate*days/120));return{amount,days,rate,total,payment:Math.ceil(total/days),interest:total-amount}}
export function payoffOf(l){const unearned=(l.total-l.amount)*l.daysLeft/l.days;return Math.max(0,Math.ceil(l.remaining-unearned))}
