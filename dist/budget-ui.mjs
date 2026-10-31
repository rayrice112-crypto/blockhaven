// City report: budget, taxes, fees and trade, loans and policies. The tabs are built once and
// refreshed in place, so a slider keeps working while it is being dragged. Rows come straight
// from the economy registries, so a new module appears here without changes to this file.
import * as E from './economy.mjs';

const cash=v=>(v<0?'−':'')+'$'+Math.abs(Math.round(v)).toLocaleString();
const signed=v=>(v>=0?'+':'−')+'$'+Math.abs(Math.round(v)).toLocaleString();
const pct=v=>Math.round(v*1000)/10+'%';
const HINTS={
 'tax-office-bonus':'Build a tax office to collect 5% more of every tax.',
 'fee-garbage':'Collect garbage to charge garbage fees.',
 'fee-health':'Clinics and hospitals let you charge healthcare fees.',
 'fee-education':'Schools and colleges let you charge education fees.',
 'trade-export':'Build more power, water, sewage or garbage capacity than you use and sell the rest.',
 tourism:'Visitors come for landmarks, stadiums, squares and parks. Hotels let them stay the night.',
 harbor:'Build a cargo harbor on the shore to export your industry’s goods.',
 parking:'Build parking garages near jobs, or turn on Paid street parking.',
 lottery:'Turn on the City lottery policy.',
 subsidy:'The subsidy ends as the city grows past 10,000 residents.'
};

export function mountEconomy(api){
 const $=id=>document.getElementById(id),q=(root,sel)=>root.querySelector(sel),qa=(root,sel)=>[...root.querySelectorAll(sel)];
 const [lo,hi]=E.TAX_RANGE,[flo,fhi]=E.FEE_RANGE;
 const slider=(attr,key,min,max,step=1)=>`<input type="range" ${attr}="${key}" min="${min}" max="${max}" step="${step}">`;

 $('reportBudget').innerHTML=`<div class="econ-cards"><div><small>Treasury</small><strong data-e="treasury"></strong></div><div><small>Income / day</small><strong data-e="rev" class="positive"></strong></div><div><small>Expenses / day</small><strong data-e="exp" class="negative"></strong></div><div><small>Net / day</small><strong data-e="net"></strong></div><div><small>Credit rating</small><strong data-e="rating"></strong></div></div>
 <div class="econ-split"><div><h2>Income</h2><div data-e="revenueRows" class="econ-rows"></div></div><div><h2>Expenses</h2><div data-e="expenseRows" class="econ-rows"></div></div></div>
 <details class="econ-ideas"><summary>Ways to earn more <span data-e="ideaCount"></span></summary><div data-e="ideas"></div></details>
 <h2>Income and expenses, last 30 days</h2><svg data-e="chart" class="econ-chart" viewBox="0 0 400 120" role="img" aria-label="Daily income and expenses"></svg><p class="econ-legend"><i class="rev"></i>Income <i class="exp"></i>Expenses</p>`;

 $('reportTaxes').innerHTML=`<p class="help-note">Taxes run from ${lo}% to ${hi}%. Above ${E.NEUTRAL_TAX}%, each extra point costs residents 4 approval points and cuts demand for that kind of building by 4. Below ${E.NEUTRAL_TAX}%, each point lower adds 2 demand.</p>
 <div class="econ-sliders one"><label><span>Set every tax at once <output data-e="allOut"></output></span>${slider('data-tax-all','all',lo,hi)}<em>Moves all seven rates below to the same value.</em></label></div>
 <h2>Residents by income</h2><p class="help-note">A home’s level sets its residents’ income. Level 1 homes are low income, level 2 middle, level 3 high. Richer residents pay more per point of tax.</p>
 <div class="econ-sliders">${Object.entries(E.BRACKETS).map(([k,b])=>`<label><span>${b.name} <output></output></span>${slider('data-bracket',k,lo,hi)}<em data-e="bp-${k}"></em></label>`).join('')}</div>
 <h2>Businesses</h2><div class="econ-sliders">${Object.entries(E.SECTORS).map(([k,n])=>`<label><span>${n} <output></output></span>${slider('data-sector',k,lo,hi)}<em data-e="sec-${k}"></em></label>`).join('')}</div>
 <h2>Demand for development</h2><div data-e="demand"></div>`;

 $('reportFees').innerHTML=`<p class="help-note">Fees are charged to every resident who gets the service. 100% is the normal price. Each 25 points above it costs 1 approval point; each 50 points below it adds one.</p>
 <div class="econ-sliders">${Object.entries(E.FEES).map(([k,f])=>`<label><span>${f.name} <output></output></span>${slider('data-fee',k,flo,fhi,10)}<em data-e="fee-${k}"></em></label>`).join('')}</div>
 <h2>Trade with neighboring cities</h2><p class="help-note">Spare capacity is sold to neighbors every day. Buying covers every block beside your main street network that a shortage leaves without service, at a higher price.</p>
 <div class="trade-table"><div class="trade-head"><span>Utility</span><span>Spare / short</span><span>Sell</span><span>Buy</span><span>Per day</span></div>${Object.entries(E.TRADE).map(([k,t])=>`<div><span>${t.name}<small>sell $${t.sell} · buy $${t.buy} per unit</small></span><span data-e="tr-${k}"></span><label class="tog"><input type="checkbox" data-sell="${k}"><i></i></label><label class="tog"><input type="checkbox" data-buy="${k}"><i></i></label><b data-e="trv-${k}"></b></div>`).join('')}</div>`;

 $('reportLoans').innerHTML=`<div class="credit-card"><div><small>Credit rating</small><strong data-e="cRating"></strong><span data-e="cScore"></span></div><div class="credit-bar"><i data-e="cBar"></i></div><div class="credit-facts"><span>Interest <b data-e="cRate"></b> per year</span><span>Credit limit <b data-e="cLimit"></b></span><span>Owed <b data-e="cOwed"></b></span><span>Available <b data-e="cAvail"></b></span></div><p class="help-note">Your rating improves with positive daily income, high approval and cash in the bank, and drops as you borrow more of your limit. A year is 120 days.</p></div>
 <h2>New loan</h2><div class="loan-form"><label class="loan-amt"><span>Amount <output data-e="lAmountOut"></output></span><input type="range" data-e="lAmount" min="5000" step="1000"></label><label class="field-label">Term<select data-e="lTerm">${E.LOAN_TERMS.map(d=>`<option value="${d}"${d===40?' selected':''}>${d} days</option>`).join('')}</select></label></div><p data-e="lQuote" class="loan-quote"></p><button class="primary" data-e="lBorrow">Borrow</button>
 <h2>Active loans</h2><div data-e="loanRows"></div>
 <h2>Emergency loan</h2><p class="help-note">$25,000 at once, no credit check. Repay $28,000 over 20 days at $1,400 a day.</p><p data-e="qStatus" class="help-note"></p><button data-e="qTake" class="secondary">Take emergency loan</button>`;

 $('reportPolicies').innerHTML=`<p class="help-note">Policies apply to the whole city and take effect the next day. Their income and costs appear on the Budget tab.</p><div class="policy-cards">${Object.entries(E.POLICIES).map(([k,p])=>`<label class="policy-card"><input type="checkbox" data-policy="${k}"><span><b>${p.name}</b><small>${p.description}</small></span></label>`).join('')}</div>`;

 const dialog=$('reportDialog'),E_=k=>q(dialog,`[data-e="${k}"]`);
 const commit=()=>{api.onChange();refresh()};
 const city=()=>api.city();
 const fullBrackets=c=>c.taxBrackets??=Object.fromEntries(Object.keys(E.BRACKETS).map(b=>[b,E.bracketTax(c,b)]));
 const fullTaxes=c=>c.zoneTaxes??=Object.fromEntries(['home','shop','industry','office'].map(k=>[k,c.taxRate??E.NEUTRAL_TAX]));

 q(dialog,'[data-tax-all]').oninput=e=>{const c=city(),v=Number(e.target.value);c.taxRate=v;fullTaxes(c);for(const k of Object.keys(c.zoneTaxes))c.zoneTaxes[k]=v;c.taxBrackets=Object.fromEntries(Object.keys(E.BRACKETS).map(b=>[b,v]));commit()};
 qa(dialog,'[data-bracket]').forEach(i=>i.oninput=()=>{const c=city();fullBrackets(c)[i.dataset.bracket]=Number(i.value);commit()});
 qa(dialog,'[data-sector]').forEach(i=>i.oninput=()=>{const c=city();fullTaxes(c)[i.dataset.sector]=Number(i.value);commit()});
 qa(dialog,'[data-fee]').forEach(i=>i.oninput=()=>{const c=city();(c.fees??={})[i.dataset.fee]=Number(i.value);commit()});
 qa(dialog,'[data-sell],[data-buy]').forEach(i=>i.onchange=()=>{const c=city(),d=i.dataset.sell?'export':'import',k=i.dataset.sell||i.dataset.buy;c.trade??={};(c.trade[d]??={})[k]=i.checked;commit()});
 qa(dialog,'[data-policy]').forEach(i=>i.onchange=()=>{const c=city();(c.policies??={})[i.dataset.policy]=i.checked;commit();api.toast(E.POLICIES[i.dataset.policy].name+(i.checked?' is now in effect.':' has ended.'))});
 E_('lAmount').oninput=()=>refresh();E_('lTerm').onchange=()=>refresh();
 E_('lBorrow').onclick=()=>{const r=api.borrow(city(),Number(E_('lAmount').value),Number(E_('lTerm').value));if(r.error){api.toast(r.error);return}api.toast(`Loan received: ${cash(r.amount)} at ${pct(r.rate)} (${r.rating}). ${cash(r.payment)} a day for ${r.days} days.`);commit()};
 E_('loanRows').onclick=e=>{const b=e.target.closest('[data-repay]');if(!b)return;const r=api.repayLoan(city(),b.dataset.repay==='quick'?'quick':Number(b.dataset.repay));if(r.error){api.toast(r.error);return}api.toast('Loan paid off for '+cash(r.cost)+'.');commit()};
 E_('qTake').onclick=()=>{const r=api.takeLoan(city());if(r.error){api.toast(r.error);return}api.toast('Emergency loan received. $1,400 will be repaid each day for 20 days.');commit()};

 const setVal=(input,v)=>{if(document.activeElement!==input)input.value=v};
 const rows=(list,kind)=>{const groups=new Map();for(const r of list)if(r.amount>0||r.group==='Taxes'){if(!groups.has(r.group))groups.set(r.group,[]);groups.get(r.group).push(r)}const max=Math.max(1,...list.map(r=>r.amount));return [...groups].map(([g,rs])=>`<div class="econ-group"><b>${g}</b><span>${cash(rs.reduce((a,r)=>a+r.amount,0))}</span></div>`+rs.map(r=>`<div class="econ-row"><span>${r.name}</span><i style="width:${Math.max(1,r.amount/max*100)}%" class="${kind}"></i><b>${cash(r.amount)}</b></div>`).join('')).join('')||'<p class="help-note">Nothing yet.</p>'};

 function refresh(){
  const c=city(),m=api.metrics(),b=m.budget,cr=m.credit;
  E_('treasury').textContent=cash(c.money);E_('rev').textContent=cash(b.totalRevenue);E_('exp').textContent=cash(b.totalExpenses);E_('net').textContent=signed(b.net);E_('net').className=b.net>=0?'positive':'negative';E_('rating').textContent=cr.rating;
  E_('revenueRows').innerHTML=rows(b.revenue,'rev');E_('expenseRows').innerHTML=rows(b.expenses,'exp');
  const idle=b.revenue.filter(r=>r.amount===0&&HINTS[r.id]);E_('ideaCount').textContent=idle.length?`(${idle.length} not earning yet)`:'';E_('ideas').innerHTML=idle.map(r=>`<p class="advisor-note"><b>${r.name}.</b> ${HINTS[r.id]}</p>`).join('')+'<p class="advisor-note"><b>Upgrades.</b> Level 2 and 3 buildings pay more tax, and level 3 homes house high-income residents.</p><p class="advisor-note"><b>Policies.</b> Paid parking and the lottery raise money at a small cost in approval.</p>';
  const h=(c.history||[]).slice(-30);if(h.length>1){const vals=h.flatMap(x=>[x.revenue??Math.max(0,x.income),x.expenses??Math.max(0,-x.income)]),max=Math.max(1,...vals),pt=(v,i)=>`${10+i/(h.length-1)*380},${112-v/max*100}`;E_('chart').innerHTML=`<polyline points="${h.map((x,i)=>pt(x.revenue??Math.max(0,x.income),i)).join(' ')}" fill="none" class="rev" stroke-width="2.5"/><polyline points="${h.map((x,i)=>pt(x.expenses??Math.max(0,-x.income),i)).join(' ')}" fill="none" class="exp" stroke-width="2.5"/><text x="10" y="10" font-size="9" class="axis">${cash(max)} / day</text>`}else E_('chart').innerHTML='<text x="20" y="62" font-size="11" class="axis">Let time run to record the city’s money.</text>';
  const rates=[...Object.keys(E.BRACKETS).map(k=>E.bracketTax(c,k)),...Object.keys(E.SECTORS).map(k=>E.taxOf(c,k))],all=q(dialog,'[data-tax-all]');setVal(all,Math.round(rates.reduce((a,v)=>a+v,0)/rates.length));E_('allOut').textContent=(new Set(rates).size===1?'':'avg ')+all.value+'%';
  qa(dialog,'[data-bracket]').forEach(i=>{const k=i.dataset.bracket;setVal(i,E.bracketTax(c,k));i.parentNode.querySelector('output').textContent=i.value+'%';E_('bp-'+k).textContent=m.bracketPop[k].toLocaleString()+' residents'});
  qa(dialog,'[data-sector]').forEach(i=>{const k=i.dataset.sector;setVal(i,E.taxOf(c,k));i.parentNode.querySelector('output').textContent=i.value+'%';E_('sec-'+k).textContent=cash(m.sectorIncome[k])+' / day'});
  E_('demand').innerHTML=Object.entries(m.demand).map(([k,v])=>`<div class="demand-row">${{home:'Residential',shop:'Commercial',industry:'Industrial',office:'Offices'}[k]}<span>${v}%</span><div class="demand-track"><i style="width:${v}%"></i></div></div>`).join('');
  qa(dialog,'[data-fee]').forEach(i=>{const k=i.dataset.fee,f=E.feeOf(c,k),a=E.feeApproval(f);setVal(i,f);i.parentNode.querySelector('output').textContent=`${f}%`;E_('fee-'+k).textContent=`${cash(E.row(b,'fee-'+k))} / day · ${(m.servedResidents?.[k]??0).toLocaleString()} residents served · approval ${a>=0?'+':'−'}${Math.abs(Math.round(a*10)/10)}`});
  for(const k of Object.keys(E.TRADE)){const u=m.utilities[k],x=m.exports[k],im=m.imports[k],unit=api.units[k];q(dialog,`[data-sell="${k}"]`).checked=E.sells(c,k);q(dialog,`[data-buy="${k}"]`).checked=E.buys(c,k);E_('tr-'+k).innerHTML=u.shortfall>0?`<em class="negative">short ${u.shortfall} ${unit}</em>`:im.units>0?`buying ${im.units} ${unit}`:`${x.spare} ${unit} spare`;const v=x.amount-im.amount;E_('trv-'+k).textContent=v?signed(v):'$0';E_('trv-'+k).className=v>0?'positive':v<0?'negative':''}
  E_('cRating').textContent=cr.rating;E_('cScore').textContent=`score ${cr.score} / 100`;E_('cBar').style.width=cr.score+'%';E_('cRate').textContent=pct(cr.rate);E_('cLimit').textContent=cash(cr.limit);E_('cOwed').textContent=cash(cr.owed);E_('cAvail').textContent=cash(cr.available);
  const amt=E_('lAmount'),full=(c.loans?.length||0)>=E.MAX_LOANS;amt.max=Math.max(5000,cr.available);if(Number(amt.value)>cr.available)amt.value=Math.max(5000,cr.available);const days=Number(E_('lTerm').value),qt=E.loanQuote(Number(amt.value),days,cr.rate);E_('lAmountOut').textContent=cash(qt.amount);
  E_('lQuote').innerHTML=full?`The city already has ${E.MAX_LOANS} loans. Pay one off to borrow again.`:cr.available<5000?'Your credit limit is used up. Grow the city, raise approval or repay a loan.':`Repay <b>${cash(qt.total)}</b> as <b>${cash(qt.payment)} a day</b> for ${days} days. Interest: ${cash(qt.interest)}.`;E_('lBorrow').disabled=full||cr.available<5000;amt.disabled=E_('lBorrow').disabled;
  const loans=(c.loans||[]).map((l,i)=>`<div class="loan-row"><span><b>${cash(l.amount)}</b> at ${pct(l.rate)} · ${l.daysLeft} of ${l.days} days left<small>${cash(l.payment)} a day · ${cash(l.remaining)} still to repay</small></span><button data-repay="${i}">Pay off ${cash(E.payoffOf(l))}</button></div>`);
  if(c.loan?.daysLeft>0)loans.push(`<div class="loan-row"><span><b>Emergency loan</b> · ${c.loan.daysLeft} of 20 days left<small>$1,400 a day · ${cash(c.loan.remaining)} still to repay</small></span><button data-repay="quick">Pay off ${cash(E.payoffOf({...E.QUICK_LOAN,daysLeft:c.loan.daysLeft,remaining:c.loan.remaining}))}</button></div>`);
  E_('loanRows').innerHTML=loans.join('')||'<p class="help-note">No loans. Paying a loan off early skips the interest you have not yet been charged.</p>';
  E_('qStatus').textContent=c.loan?.daysLeft>0?`Active: ${cash(c.loan.remaining)} remaining over ${c.loan.daysLeft} days.`:'';E_('qTake').disabled=!!(c.loan?.daysLeft>0);
  qa(dialog,'[data-policy]').forEach(i=>i.checked=E.policyOn(c,i.dataset.policy));
 }
 return{refresh};
}
