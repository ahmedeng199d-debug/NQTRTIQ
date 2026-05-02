/* ════════════════════════════════════════════════
   NQTRT Trading Journal — app.js
   ════════════════════════════════════════════════ */

// ══ CONSTANTS ══════════════════════════════════
const ICT=['Order Block (OB)','Fair Value Gap (FVG)','Break of Structure (BOS)','Change of Character (CHoCH)','Liquidity Sweep','Buyside Liquidity','Sellside Liquidity','Optimal Trade Entry (OTE)','Breaker Block','Mitigation Block','Inducement','Premium/Discount','Killzone','Asian Range','NWOG/NDOG','Market Structure Shift','Equal Highs/Lows','Power of 3','Accumulation/Distribution','Smart Money Divergence'];
const CLASSIC=['EMA 20','EMA 50','EMA 200','SMA 200','RSI Overbought','RSI Oversold','RSI Divergence','MACD Cross','MACD Divergence','Bollinger Bands','Fibonacci Retracement','Fibonacci Extension','VWAP','Volume Spike','ATR','Stochastic','Ichimoku Cloud','Pivot Points','Support Level','Resistance Level','Trend Line','Channel Break','Head & Shoulders','Double Top','Double Bottom','Wedge Pattern','Flag Pattern','Triangle Break'];
const DEFAULT_STRATS=['Smart Money Concept','ICT Killzone','Order Block Entry','FVG Fill','BOS/CHoCH Play','Liquidity Grab','EMA Cross','RSI Divergence','Support/Resistance','Trend Follow','Reversal','News Trade','Scalp','Other'];
const MKT=[{s:'EUR/USD',p:1.1362,c:+0.22,t:'forex'},{s:'GBP/USD',p:1.3245,c:-0.14,t:'forex'},{s:'XAU/USD',p:3342.80,c:+1.12,t:'forex'},{s:'USD/JPY',p:142.45,c:+0.31,t:'forex'},{s:'BTC/USD',p:84250,c:+2.15,t:'crypto'},{s:'ETH/USD',p:1842.50,c:+1.68,t:'crypto'},{s:'SOL/USD',p:142.30,c:+3.21,t:'crypto'}];

// ══ TRANSLATIONS ═══════════════════════════════
const T={
  en:{sbSub:'Trading Journal',menuLbl:'MENU',dashboard:'Dashboard',log:'Trade Log',addtrade:'Log Trade',notebook:'Notebook',ai:'NT AI',news:'USD News',accounts:'Accounts',settings:'Settings',lightMode:'Light Mode',darkMode:'Dark Mode',arabic:'عربي',english:'English',today:'Today',addTrade:'Add Trade',back:'← Back',logATrade:'Log a Trade',todayPnl:"Today's P&L",totalPnl:'Total P&L',winRate:'Win Rate',profitFactor:'Profit Factor',bestTrade:'Best Trade',drawdown:'Drawdown',monthlyPnl:'Monthly P&L',avgWL:'Avg Win / Loss',equityCurve:'Equity Curve',pnlDay:'P&L by Day',scoreTitle:'NQTRT Score',fgTitle:'Fear & Greed',fear:'Fear',greed:'Greed',mktTitle:'Market Prices',recentTitle:'Recent Trades',dlLbl:'Daily Limit',tlLbl:'Total Limit',used:'Used',limit:'Limit',warnTotal:'ACCOUNT BLOWN — Stop trading immediately.',warnDaily:'DAILY LIMIT HIT — Stop trading for today.',warnClose:'WARNING — Approaching daily limit.',logTitle:'Trade Log',logAdd:'Add Trade',fs1:'Trade Details',fs3:'ICT Concepts',fs4:'Classic Indicators',fs5:'Trade Outcome',lf_date:'Date',lf_time:'Time',lf_pair:'Pair / Symbol',lf_mkt:'Market',lf_sess:'Session',lf_dir:'Direction',lf_tf:'Timeframe',lf_psych:'Psychology',lf_status:'Status',lf_pnl:'Actual P&L ($)',lf_rr:'R:R Ratio',lf_strat:'Strategy',lf_conf:'Confidence (1-10)',lf_notes:'Pre-Trade Notes',lf_review:'Post-Trade Review',lf_attach:'Attachments',submitTrade:'RECORD TRADE',all:'All',today2:'Today',wins:'Wins',losses:'Losses',open:'Open',forex:'Forex',crypto:'Crypto',noTrades:'No trades logged yet',noRecent:'No recent trades',buy:'▲ BUY',sell:'▼ SELL',winS:'Win',lossS:'Loss',openS:'Open',beS:'BE',nbTitle:'Notebook',nbNew:'New Entry',nbSave:'Save',aiTitle:'NT AI',aiSub:'Powered by Claude · Your Personal Trading Coach',aiClear:'Clear Chat',qp:'⚡ Quick Analysis',aiWelcome:"Hello! I'm NT AI — your NQTRT trading coach powered by Claude.\n\nI can analyze your specific trades, patterns, psychology, and help you improve your edge.\n\nWhat would you like to explore?",aiPresets:['📊 Analyze my overall performance','🔮 Review my ICT concept usage','🧠 Analyze my psychology patterns','📉 What are my worst habits?','💡 Which strategies perform best?','⚡ When do I break my rules?','💰 Forex vs Crypto results','🎯 My best trading sessions'],accTitle:'Accounts',accNew:'New Profile',active:'ACTIVE',edit:'Edit',del:'Delete',profName:'Profile Name',capital:'Capital ($)',dailyLimitPct:'Daily Limit %',totalLimitPct:'Total Limit %',apply:'Apply',cancel:'Cancel',delProf:'Delete Profile',confirmDel:'Delete this profile and ALL trades?',delete:'Delete',editProf:'Edit Profile',newProf:'New Profile',newsTitle:'USD News Calendar',stratAdd:'＋ Add',uploadTxt:'Click or drag to upload',uploadSub:'Photos · PDF · Documents (max 10MB)',addLink:'＋ Link'},
  ar:{sbSub:'سجل التداول',menuLbl:'القائمة',dashboard:'لوحة التحكم',log:'سجل الصفقات',addtrade:'تسجيل صفقة',notebook:'المفكرة',ai:'NT AI',news:'أخبار USD',accounts:'الحسابات',settings:'الإعدادات',lightMode:'الوضع الفاتح',darkMode:'الوضع الداكن',arabic:'عربي',english:'English',today:'اليوم',addTrade:'إضافة صفقة',back:'→ رجوع',logATrade:'تسجيل صفقة',todayPnl:'ربح اليوم',totalPnl:'إجمالي الربح',winRate:'نسبة الفوز',profitFactor:'معامل الربح',bestTrade:'أفضل صفقة',drawdown:'السحب',monthlyPnl:'ربح الشهر',avgWL:'متوسط ربح/خسارة',equityCurve:'منحنى رأس المال',pnlDay:'الربح اليومي',scoreTitle:'تقييم NQTRT',fgTitle:'الخوف والطمع',fear:'خوف',greed:'طمع',mktTitle:'أسعار السوق',recentTitle:'آخر الصفقات',dlLbl:'الحد اليومي',tlLbl:'الحد الكلي',used:'مستخدم',limit:'الحد',warnTotal:'تجاوزت الحد الكلي — أوقف التداول.',warnDaily:'تجاوزت الحد اليومي — توقف اليوم.',warnClose:'تحذير — اقتربت من الحد اليومي.',logTitle:'سجل الصفقات',logAdd:'إضافة صفقة',fs1:'تفاصيل الصفقة',fs3:'مفاهيم ICT',fs4:'المؤشرات الكلاسيكية',fs5:'نتيجة الصفقة',lf_date:'التاريخ',lf_time:'الوقت',lf_pair:'الزوج / الرمز',lf_mkt:'السوق',lf_sess:'الجلسة',lf_dir:'الاتجاه',lf_tf:'الإطار الزمني',lf_psych:'النفسية',lf_status:'الحالة',lf_pnl:'الربح/الخسارة ($)',lf_rr:'نسبة R:R',lf_strat:'الاستراتيجية',lf_conf:'الثقة (1-10)',lf_notes:'ملاحظات قبل الصفقة',lf_review:'مراجعة ما بعد الصفقة',lf_attach:'المرفقات',submitTrade:'تسجيل الصفقة',all:'الكل',today2:'اليوم',wins:'رابحة',losses:'خاسرة',open:'مفتوحة',forex:'فوركس',crypto:'كريبتو',noTrades:'لا توجد صفقات بعد',noRecent:'لا توجد صفقات حديثة',buy:'▲ شراء',sell:'▼ بيع',winS:'رابحة',lossS:'خاسرة',openS:'مفتوحة',beS:'تعادل',nbTitle:'المفكرة',nbNew:'إدخال جديد',nbSave:'حفظ',aiTitle:'NT AI',aiSub:'مدعوم بـ Claude · مدربك الشخصي',aiClear:'مسح المحادثة',qp:'⚡ تحليل سريع',aiWelcome:'مرحباً! أنا NT AI — مدربك بـ NQTRT مدعوم بـ Claude.\n\nأستطيع تحليل صفقاتك الخاصة وأنماطك ونفسيتك.\n\nماذا تريد أن نستعرض؟',aiPresets:['📊 حلل أدائي العام','🔮 راجع استخدامي لمفاهيم ICT','🧠 حلل أنماطي النفسية','📉 ما هي أسوأ عاداتي؟','💡 أي الاستراتيجيات تؤدي أفضل؟','⚡ متى أكسر قواعدي؟','💰 الفوركس مقابل الكريبتو','🎯 أفضل جلسات تداولي'],accTitle:'الحسابات',accNew:'بروفايل جديد',active:'نشط',edit:'تعديل',del:'حذف',profName:'اسم البروفايل',capital:'رأس المال ($)',dailyLimitPct:'الحد اليومي %',totalLimitPct:'الحد الكلي %',apply:'تطبيق',cancel:'إلغاء',delProf:'حذف البروفايل',confirmDel:'حذف هذا البروفايل وجميع صفقاته؟',delete:'حذف',editProf:'تعديل البروفايل',newProf:'بروفايل جديد',newsTitle:'تقويم أخبار USD',stratAdd:'＋ إضافة',uploadTxt:'انقر أو اسحب للرفع',uploadSub:'صور · PDF · مستندات (حد 10MB)',addLink:'＋ رابط'}
};

// ══ STATE ═══════════════════════════════════════
function loadState(){
  try{const d=JSON.parse(localStorage.getItem('nqtrt_pro')||'null');if(d)return d;}catch{}
  return{profiles:[{id:'1',name:'Main Account',capital:25000,dailyPct:5,totalPct:10,trades:[]}],active:'1',lang:'en',dark:true,notes:[],chat:[],floatChat:[],strats:[...DEFAULT_STRATS]};
}
let S=loadState();
if(!S.strats)S.strats=[...DEFAULT_STRATS];
if(!S.notes)S.notes=[];
if(!S.chat)S.chat=[];
if(!S.floatChat)S.floatChat=[];
function save(){try{localStorage.setItem('nqtrt_pro',JSON.stringify(S));}catch{}}
const getP=()=>S.profiles.find(p=>p.id===S.active)||S.profiles[0];
const isRtl=()=>S.lang==='ar';
const tx=()=>T[S.lang];
const $=id=>document.getElementById(id);
const sT=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
const sH=(id,v)=>{const e=$(id);if(e)e.innerHTML=v;};
const fmtM=n=>n===0?'$0.00':(n>0?'+':'-')+'$'+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtA=n=>'$'+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const todayStr=()=>new Date().toISOString().split('T')[0];
const nowTime=()=>new Date().toTimeString().slice(0,5);

// ══ API KEY ══════════════════════════════════════
function getAPIKey(){return localStorage.getItem('nqtrt_api_key')||'';}
function setAPIKey(k){localStorage.setItem('nqtrt_api_key',k.trim());}

// ══ STATS (FIXED) ════════════════════════════════
function getStats(prof){
  if(!prof)return{dpnl:0,mpnl:0,tpnl:0,tl:0,w:0,l:0,wr:'0%',avgW:0,avgL:0,pf:'0.00',best:0,dayLimit:0,totLimit:0,dl:0,tlo:0,dpPct:0,tpPct:0,totalTrades:0};
  const cap=prof.capital,dp=prof.dailyPct/100,tp=prof.totalPct/100;
  const cl=prof.trades.filter(t=>t.status!=='open');
  const todayISO=todayStr();
  const now=new Date();
  const curMonth=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
  // Daily P&L
  const dc=cl.filter(t=>t.date===todayISO);
  const dpnl=dc.reduce((s,t)=>s+t.pnl,0);
  // Monthly P&L — FIXED (was using dpnl before)
  const mc=cl.filter(t=>t.date.startsWith(curMonth));
  const mpnl=mc.reduce((s,t)=>s+t.pnl,0);
  // Total P&L
  const tpnl=cl.reduce((s,t)=>s+t.pnl,0);
  // Win / Loss
  const wins=cl.filter(t=>t.status==='win');
  const losses=cl.filter(t=>t.status==='loss');
  const w=wins.length,l=losses.length;
  const wr=cl.length>0?(w/cl.length*100).toFixed(1)+'%':'0%';
  // Averages
  const avgW=w>0?wins.reduce((s,t)=>s+t.pnl,0)/w:0;
  const avgL=l>0?losses.reduce((s,t)=>s+Math.abs(t.pnl),0)/l:0;
  // Profit Factor — FIXED edge cases
  let pf;
  if(w===0&&l===0)pf='0.00';
  else if(l===0)pf='∞';
  else if(w===0)pf='0.00';
  else pf=((avgW*w)/(avgL*l)).toFixed(2);
  const best=cl.length>0?Math.max(...cl.map(t=>t.pnl)):0;
  const tl=losses.reduce((s,t)=>s+Math.abs(t.pnl),0);
  const dayLimit=cap*dp,totLimit=cap*tp;
  const dl=Math.abs(Math.min(0,dpnl));
  const tlo=Math.abs(Math.min(0,tpnl));
  return{dpnl,mpnl,tpnl,tl,w,l,wr,avgW,avgL,pf,best,dayLimit,totLimit,dl,tlo,dpPct:Math.min(dl/dayLimit*100,100)||0,tpPct:Math.min(tlo/totLimit*100,100)||0,totalTrades:cl.length};
}
function calcScore(prof){
  if(!prof)return 0;
  const st=getStats(prof),cl=prof.trades.filter(t=>t.status!=='open');
  if(!cl.length)return 0;
  let s=0;
  s+=Math.min(parseFloat(st.wr)*0.3,30);
  s+=Math.min((parseFloat(st.pf)||0)*5,20);
  s+=Math.max(0,30-(st.tlo/prof.capital)*300);
  s+=Math.min(cl.length*0.5,20);
  return Math.min(Math.round(s),100);
}
function getWarn(prof){
  if(!prof)return null;const st=getStats(prof),t=tx();
  if(st.tl>=(prof.capital*prof.totalPct/100))return t.warnTotal;
  if(st.dl>=(prof.capital*prof.dailyPct/100))return t.warnDaily;
  if(st.dl>=(prof.capital*prof.dailyPct/100*.8))return t.warnClose;
  return null;
}

// ══ FORM STATE ════════════════════════════════════
let selICT=new Set(),selClassic=new Set(),selStrat=null,upFiles=[],upLinks=[],tradeDir='long';
function setDir(d){
  tradeDir=d;
  $('btn-long').className='dir-btn long'+(d==='long'?' on':'');
  $('btn-short').className='dir-btn short'+(d==='short'?' on':'');
}

// ══ INDICATOR TAGS ════════════════════════════════
function renderIndTags(){
  $('ict-tags').innerHTML=ICT.map(c=>`<button class="ind-tag ict${selICT.has(c)?' sel':''}" onclick="toggleICT('${c.replace(/'/g,"\\'")}')">${c}</button>`).join('');
  $('classic-tags').innerHTML=CLASSIC.map(c=>`<button class="ind-tag classic${selClassic.has(c)?' sel':''}" onclick="toggleClassic('${c.replace(/'/g,"\\'")}')">${c}</button>`).join('');
}
function toggleICT(c){selICT.has(c)?selICT.delete(c):selICT.add(c);renderIndTags();}
function toggleClassic(c){selClassic.has(c)?selClassic.delete(c):selClassic.add(c);renderIndTags();}

// ══ STRATEGY MANAGER ═════════════════════════════
function renderStrats(){
  const el=$('strat-chips');if(!el)return;
  el.innerHTML=S.strats.map(s=>`<div class="sc${selStrat===s?' sel':''}" onclick="selectStrat('${s.replace(/'/g,"\\'")}')"><span>${s}</span><span class="sc-del" onclick="event.stopPropagation();removeStrat('${s.replace(/'/g,"\\'")}')">✕</span></div>`).join('');
}
function selectStrat(s){selStrat=selStrat===s?null:s;renderStrats();}
function addStrategy(){
  const el=$('strat-inp');if(!el)return;
  const v=el.value.trim();if(!v)return;
  if(!S.strats.includes(v)){S.strats.push(v);save();}
  selStrat=v;renderStrats();el.value='';
}
function removeStrat(s){
  S.strats=S.strats.filter(x=>x!==s);
  if(selStrat===s)selStrat=null;
  save();renderStrats();
}

// ══ FILE UPLOAD ═══════════════════════════════════
function handleFiles(files){
  Array.from(files).forEach(f=>{
    if(f.size>10*1024*1024){alert('File too large: '+f.name+' (max 10MB)');return;}
    const reader=new FileReader();
    reader.onload=e=>{upFiles.push({name:f.name,type:f.type,data:e.target.result,size:f.size});renderUpPrev();};
    reader.readAsDataURL(f);
  });
}
function handleDrop(e){
  e.preventDefault();
  const el=$('upload-zone');if(el)el.style.borderColor='';
  handleFiles(e.dataTransfer.files);
}
function removeFile(i){upFiles.splice(i,1);renderUpPrev();}
function addLink(){
  const el=$('link-inp');if(!el)return;
  const v=el.value.trim();if(!v)return;
  try{new URL(v);}catch{alert('Please enter a valid URL');return;}
  upLinks.push(v);el.value='';renderLinksPrev();
}
function removeLink(i){upLinks.splice(i,1);renderLinksPrev();}
function renderUpPrev(){
  const el=$('upload-prev');if(!el)return;
  el.innerHTML=upFiles.map((f,i)=>`<div class="up-item"><span style="font-size:.9rem;">${f.type.startsWith('image')?'🖼️':f.type.includes('pdf')?'📄':'📎'}</span><span class="up-name">${f.name}</span><span style="font-size:.58rem;color:var(--t3);margin-right:4px;">${(f.size/1024).toFixed(0)}KB</span><button class="up-del" onclick="removeFile(${i})">✕</button></div>`).join('');
  const zone=$('upload-zone');if(zone)zone.classList.toggle('has-files',upFiles.length>0);
}
function renderLinksPrev(){
  const el=$('links-prev');if(!el)return;
  el.innerHTML=upLinks.map((l,i)=>`<div class="up-item"><span style="font-size:.9rem;">🔗</span><a href="${l}" target="_blank" style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.7rem;color:var(--blue);text-decoration:none;">${l}</a><button class="up-del" onclick="removeLink(${i})">✕</button></div>`).join('');
}

// ══ ADD TRADE ════════════════════════════════════
function addTrade(){
  const assetEl=$('f-asset');
  if(!assetEl||!assetEl.value.trim()){alert(isRtl()?'أدخل الزوج / الرمز':'Enter pair/symbol.');return;}
  const prof=getP();if(!prof)return;
  prof.trades.unshift({
    id:Date.now().toString(),
    date:$('f-date')?.value||todayStr(),
    time:$('f-time')?.value||nowTime(),
    asset:assetEl.value.trim().toUpperCase(),
    dir:tradeDir,
    market:$('f-market')?.value||'forex',
    tf:$('f-tf')?.value||'H1',
    pnl:parseFloat($('f-pnl')?.value)||0,
    status:$('f-status')?.value||'open',
    strategy:selStrat||'',
    session:$('f-session')?.value||'',
    emotion:$('f-emotion')?.value||'Calm',
    confidence:parseInt($('f-confidence')?.value)||null,
    rr:$('f-rr')?.value||'—',
    ictConcepts:[...selICT],
    classicIndicators:[...selClassic],
    notes:$('f-notes')?.value.trim()||'',
    review:$('f-review')?.value.trim()||'',
    files:upFiles.map(f=>({name:f.name,type:f.type,data:f.data})),
    links:[...upLinks]
  });
  save();
  ['f-asset','f-pnl','f-rr','f-notes','f-review'].forEach(id=>{const el=$(id);if(el)el.value='';});
  if($('f-status'))$('f-status').value='open';
  if($('f-confidence'))$('f-confidence').value='';
  selICT=new Set();selClassic=new Set();selStrat=null;
  upFiles=[];upLinks=[];
  renderIndTags();renderStrats();renderUpPrev();renderLinksPrev();
  setDir('long');
  goTo('log');
}
function delTrade(profId,tradeId){
  const p=S.profiles.find(pr=>pr.id===profId);if(!p)return;
  p.trades=p.trades.filter(t=>t.id!==tradeId);save();renderAll();
}

// ══ PROFILES ═════════════════════════════════════
function createProfile(n,c,d,t){const p={id:Date.now().toString(),name:n||'New Account',capital:+c||25000,dailyPct:+d||5,totalPct:+t||10,trades:[]};S.profiles.push(p);S.active=p.id;save();renderAll();}
function editProfile(id,n,c,d,t){const p=S.profiles.find(pr=>pr.id===id);if(!p)return;if(n)p.name=n;if(c)p.capital=+c;if(d)p.dailyPct=+d;if(t)p.totalPct=+t;save();renderAll();}
function deleteProfile(id){if(S.profiles.length<=1){alert('Cannot delete last profile.');return;}S.profiles=S.profiles.filter(p=>p.id!==id);if(S.active===id)S.active=S.profiles[0].id;save();renderAll();}
function switchProfile(id){S.active=id;save();closeModal();renderAll();}

// ══ MODAL ════════════════════════════════════════
let mType=null,mData=null;
function openModal(type,data){
  mType=type;
  try{mData=typeof data==='string'?JSON.parse(data.replace(/&quot;/g,'"')):data;}catch{mData=data;}
  const t=tx(),prof=getP();let h='';
  if(type==='new-profile'||type==='edit-profile'){
    const isN=type==='new-profile',ed=mData||{};
    h=`<div class="m-title">${isN?t.newProf:t.editProf}</div><div class="m-sub">${isN?t.profName:ed.name||''}</div>
    <div class="m-field"><label class="m-lbl">${t.profName}</label><input class="m-inp" id="m-name" value="${ed.name||''}" placeholder="e.g. Forex Live"></div>
    <div class="m-field"><label class="m-lbl">${t.capital}</label><input class="m-inp" id="m-cap" type="number" value="${ed.capital||25000}"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
      <div class="m-field"><label class="m-lbl">${t.dailyLimitPct}</label><input class="m-inp" id="m-dp" type="number" step=".5" value="${ed.dailyPct||5}"></div>
      <div class="m-field"><label class="m-lbl">${t.totalLimitPct}</label><input class="m-inp" id="m-tp" type="number" step=".5" value="${ed.totalPct||10}"></div>
    </div>
    <div class="m-field"><label class="m-lbl">Anthropic API Key (for NT AI)</label>
      <input class="m-inp" id="m-apikey" type="password" value="${getAPIKey()}" placeholder="sk-ant-..."></div>
    <div class="m-btns"><button class="mbtn" onclick="closeModal()">${t.cancel}</button><button class="mbtn cf" onclick="applyModal()">${t.apply}</button></div>`;
  }else if(type==='del-profile'){
    h=`<div class="m-title">${t.delProf}</div><div class="m-sub" style="color:var(--red)">${mData?.name||''}</div>
    <p style="font-size:.76rem;color:var(--t2);margin-bottom:18px;line-height:1.6;">${t.confirmDel}</p>
    <div class="m-btns"><button class="mbtn" onclick="closeModal()">${t.cancel}</button><button class="mbtn danger" onclick="deleteProfile('${mData?.id}');closeModal();">${t.delete}</button></div>`;
  }else if(type==='switch-profile'){
    h=`<div class="m-title">${t.settings}</div><div class="m-sub">${prof?.name||''}</div>
    <div style="margin-bottom:14px;">${S.profiles.map(p=>`<div onclick="switchProfile('${p.id}')" style="padding:10px 13px;border-radius:8px;border:1px solid ${p.id===S.active?'var(--redborder)':'var(--border)'};background:${p.id===S.active?'var(--redbg)':'transparent'};cursor:pointer;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
      <div><div style="font-weight:700;font-size:.82rem;">${p.name}</div><div style="font-size:.58rem;color:var(--t2);font-family:'JetBrains Mono',monospace;">${fmtA(p.capital)} · ${p.dailyPct}%/${p.totalPct}%</div></div>
      ${p.id===S.active?`<span style="font-size:.48rem;color:var(--red);font-family:'JetBrains Mono',monospace;font-weight:700;">${t.active}</span>`:''}
    </div>`).join('')}</div>
    <div class="m-field"><label class="m-lbl">Anthropic API Key (for NT AI)</label>
      <input class="m-inp" id="m-apikey" type="password" value="${getAPIKey()}" placeholder="sk-ant-..." style="margin-top:4px;"></div>
    <div class="m-btns"><button class="mbtn" onclick="openModal('new-profile')">${t.newProf}</button><button class="mbtn cf" onclick="applyModal()">${t.editProf}</button></div>`;
  }else if(type==='day-trades'){
    const trades=mData||[];const dp=trades.reduce((s,t)=>s+t.pnl,0);
    h=`<div class="m-title">${trades[0]?.date||''}</div>
    <div class="m-sub" style="color:${dp>=0?'var(--grn)':'var(--red)'}">${fmtM(dp)} · ${trades.length} trade${trades.length!==1?'s':''}</div>
    ${trades.map(tr=>`<div style="padding:9px 12px;border:1px solid var(--border);border-radius:var(--rs);margin-bottom:6px;background:var(--card2);">
      <div style="display:flex;justify-content:space-between;margin-bottom:3px;"><strong>${tr.asset}</strong><span class="${tr.pnl>=0?'ppos':'pneg'}">${fmtM(tr.pnl)}</span></div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;font-size:.6rem;">
        <span class="badge b-${tr.dir==='long'?'long':'short'}">${tr.dir==='long'?tx().buy:tx().sell}</span>
        ${tr.market?`<span class="badge b-${tr.market}">${tr.market}</span>`:''}
        ${tr.strategy?`<span style="color:var(--t2);">${tr.strategy}</span>`:''}
      </div>
      ${(tr.ictConcepts||[]).length?`<div style="margin-top:3px;display:flex;gap:2px;flex-wrap:wrap;">${tr.ictConcepts.map(c=>`<span style="padding:1px 4px;background:var(--purplebg);color:var(--purple);border-radius:3px;font-size:.48rem;">${c.split('(')[0].trim()}</span>`).join('')}</div>`:''}
    </div>`).join('')}
    <button class="mbtn cf" onclick="closeModal()" style="width:100%;margin-top:4px;">${isRtl()?'إغلاق':'Close'}</button>`;
  }else if(type==='view-files'){
    const tr=mData;if(!tr)return;
    h=`<div class="m-title">${tr.asset||'Trade'}</div><div class="m-sub">${tr.date||''} ${tr.time||''}</div>
    ${(tr.files||[]).map(f=>`<div style="margin-bottom:8px;">${f.type&&f.type.startsWith('image')?`<img src="${f.data}" style="width:100%;border-radius:6px;max-height:200px;object-fit:cover;margin-bottom:4px;">`:''}<div style="font-size:.65rem;color:var(--t2);">📎 ${f.name}</div></div>`).join('')}
    ${(tr.links||[]).map(l=>`<a href="${l}" target="_blank" style="display:block;padding:7px 11px;background:var(--card2);border-radius:6px;color:var(--blue);font-size:.72rem;text-decoration:none;margin-bottom:5px;">🔗 ${l.slice(0,50)}${l.length>50?'...':''}</a>`).join('')}
    <button class="mbtn cf" onclick="closeModal()" style="width:100%;margin-top:4px;">${isRtl()?'إغلاق':'Close'}</button>`;
  }
  $('modal-body').innerHTML=h;
  $('modal-ov').classList.add('open');
}
function closeModal(){$('modal-ov').classList.remove('open');mType=null;mData=null;}
function applyModal(){
  const n=$('m-name')?.value,c=$('m-cap')?.value,d=$('m-dp')?.value,t=$('m-tp')?.value;
  const k=$('m-apikey')?.value;if(k!==undefined)setAPIKey(k);
  if(mType==='new-profile')createProfile(n,c,d,t);
  else if(mType==='edit-profile')editProfile(mData?.id||getP()?.id,n,c,d,t);
  else{renderAll();}
  closeModal();
}

// ══ CALENDAR (FIXED — win/loss background) ════════
let calY=new Date().getFullYear(),calM=new Date().getMonth();
function chMo(d){calM+=d;if(calM>11){calM=0;calY++;}else if(calM<0){calM=11;calY--;}renderCal();}
function renderCal(){
  const prof=getP(),filter=$('cal-filter')?.value||'all';
  const MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const MNar=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const DN=isRtl()?['أح','إث','ثل','أر','خم','جم','سب']:['Su','Mo','Tu','We','Th','Fr','Sa'];
  sT('cal-title',(isRtl()?MNar:MN)[calM]+' '+calY);
  $('cal-dh').innerHTML=DN.map(d=>`<div class="cal-dn">${d}</div>`).join('');
  const first=new Date(calY,calM,1).getDay(),dim=new Date(calY,calM+1,0).getDate(),dipm=new Date(calY,calM,0).getDate();
  const byDate={};
  if(prof)prof.trades.forEach(tr=>{
    if(tr.status==='open')return;
    if(filter==='win'&&tr.status!=='win')return;
    if(filter==='loss'&&tr.status!=='loss')return;
    if(!byDate[tr.date])byDate[tr.date]=[];byDate[tr.date].push(tr);
  });
  const cells=[];
  for(let i=0;i<first;i++)cells.push({d:dipm-first+1+i,cur:false});
  for(let i=1;i<=dim;i++)cells.push({d:i,cur:true});
  const rem=7-cells.length%7;if(rem<7)for(let i=1;i<=rem;i++)cells.push({d:i,cur:false});
  let cellH='',wkH='',wkN=1,wkPnl=0;
  cells.forEach((c,idx)=>{
    const ds=c.cur?`${calY}-${String(calM+1).padStart(2,'0')}-${String(c.d).padStart(2,'0')}`:'';
    const isT=ds===todayStr();
    const trades=byDate[ds]||[];
    const dp=trades.reduce((s,t)=>s+t.pnl,0);
    if(c.cur)wkPnl+=dp;

    // ─── WIN / LOSS background class ───
    let dayClass='cal-cell';
    if(!c.cur)dayClass+=' other';
    if(isT)dayClass+=' today';
    if(c.cur&&trades.length>0){
      if(dp>0)dayClass+=' day-win';
      else if(dp<0)dayClass+=' day-loss';
      else dayClass+=' day-be';
    }

    const clickFn=c.cur&&trades.length?`showDay('${ds}')`:void 0;
    cellH+=`<div class="${dayClass}"${clickFn?` onclick="${clickFn}"`:''}>
      <div class="cal-d">${c.d}</div>
      ${trades.length?`<div class="cal-pnl ${dp>=0?'pos':'neg'}">${fmtM(dp)}</div><div class="cal-dots">${trades.map(tr=>`<span class="cal-dot" style="background:${tr.status==='win'?'var(--grn)':'var(--red)'}"></span>`).join('')}</div>`:''}</div>`;
    if(idx%7===6){wkH+=`<div class="cal-wr"><div class="cal-wl">Wk ${wkN++}</div><div class="cal-wp ${wkPnl>=0?'pos':'neg'}">${fmtM(wkPnl)}</div></div>`;wkPnl=0;}
  });
  sH('cal-cells',cellH);sH('cal-wk',wkH);
}
function showDay(ds){
  const prof=getP();if(!prof)return;
  const trades=prof.trades.filter(t=>t.date===ds);if(!trades.length)return;
  openModal('day-trades',trades.map(t=>({...t,date:ds})));
}

// ══ CHARTS ════════════════════════════════════════
function renderEquity(){
  const prof=getP(),svg=$('equity-svg');if(!svg)return;
  const cl=(prof?.trades||[]).filter(t=>t.status!=='open').slice().reverse();
  if(cl.length<2){svg.innerHTML=`<text x="50%" y="45%" text-anchor="middle" fill="var(--t3)" font-size="11" font-family="JetBrains Mono">No data yet</text>`;return;}
  let cum=0,pts=[];cl.forEach((tr,i)=>{cum+=tr.pnl;pts.push({x:i/(cl.length-1),y:cum});});
  const mn=Math.min(...pts.map(p=>p.y)),mx=Math.max(...pts.map(p=>p.y)),rng=mx-mn||1;
  const W=svg.clientWidth||260,H=76;
  const d=pts.map((p,i)=>`${i===0?'M':'L'}${(p.x*(W-16)+8).toFixed(1)},${(H-4-(p.y-mn)/rng*(H-8)).toFixed(1)}`).join(' ');
  const last=pts[pts.length-1],col=last.y>=0?'var(--grn)':'var(--red)';
  const fx=last.x*(W-16)+8,fy=H-4-(last.y-mn)/rng*(H-8);
  svg.innerHTML=`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${col}" stop-opacity=".2"/><stop offset="100%" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>
  <path d="${d} L${(pts[pts.length-1].x*(W-16)+8).toFixed(1)},${H} L8,${H} Z" fill="url(#g)"/>
  <path d="${d}" fill="none" stroke="${col}" stroke-width="1.8" stroke-linejoin="round"/>
  <circle cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="3.5" fill="${col}" stroke="var(--card)" stroke-width="2"/>`;
}
function renderDist(){
  const prof=getP(),el=$('dist-bars');if(!el)return;
  const cl=(prof?.trades||[]).filter(t=>t.status!=='open');
  if(!cl.length){el.innerHTML='<span style="margin:auto;font-size:.7rem;color:var(--t2)">No data</span>';return;}
  const days={};cl.forEach(t=>{if(!days[t.date])days[t.date]=0;days[t.date]+=t.pnl;});
  const vals=Object.values(days).slice(-14);const mx=Math.max(...vals.map(Math.abs))||1;
  el.innerHTML=vals.map(v=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;"><div title="${fmtM(v)}" style="width:100%;background:${v>=0?'var(--grn)':'var(--red)'};height:${Math.max(3,Math.abs(v)/mx*65)}px;border-radius:3px 3px 0 0;opacity:.85;transition:opacity .18s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.85"></div></div>`).join('');
}

// ══ SCORE ══════════════════════════════════════
function renderScore(){
  const id=$('score-sel')?.value||S.active;
  const prof=S.profiles.find(p=>p.id===id)||getP();
  const sc=calcScore(prof),st=getStats(prof);
  sT('score-val',sc);if($('score-fill'))$('score-fill').style.width=sc+'%';
  sH('score-det',`<div class="sdi"><div class="sdi-l">WIN RATE</div><div class="sdi-v" style="color:var(--grn)">${st.wr}</div></div><div class="sdi"><div class="sdi-l">P.FACTOR</div><div class="sdi-v" style="color:var(--blue)">${st.pf}</div></div><div class="sdi"><div class="sdi-l">TRADES</div><div class="sdi-v">${st.totalTrades}</div></div><div class="sdi"><div class="sdi-l">DRAWDOWN</div><div class="sdi-v" style="color:var(--red)">${fmtA(st.tl)}</div></div>`);
}

// ══ TODAY WIDGET ══════════════════════════════════
function renderTodayW(){
  const now=new Date(),t=tx();
  const MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const MNar=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const WD=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const WDar=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  sT('lbl-today',t.today);sT('today-wd',(isRtl()?WDar:WD)[now.getDay()]);
  sT('today-big',now.getDate()+' '+(isRtl()?MNar:MN)[now.getMonth()]);sT('today-sub',now.getFullYear()+'');
  const fd=new Date(now.getFullYear(),now.getMonth(),1).getDay(),dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
  const dh=isRtl()?['أ','إ','ث','أ','خ','ج','س']:['M','T','W','T','F','S','S'];
  let h=dh.map(d=>`<div style="text-align:center;font-size:.45rem;color:var(--t3);font-family:'JetBrains Mono',monospace;">${d}</div>`).join('');
  for(let i=0;i<fd;i++)h+=`<div></div>`;
  for(let i=1;i<=dim;i++)h+=`<div style="width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:.56rem;font-family:'JetBrains Mono',monospace;${i===now.getDate()?'background:var(--red);color:#fff;':'color:var(--t2);'}">${i}</div>`;
  sH('mini-cal',h);
  const sel=$('score-sel');if(sel)sel.innerHTML=S.profiles.map(p=>`<option value="${p.id}"${p.id===S.active?' selected':''}>${p.name}</option>`).join('');
}

// ══ MARKET & RECENT ═══════════════════════════════
function renderMarket(){
  sH('mkt-body',MKT.map(m=>`<div class="mkt-row"><div><div class="mkt-sym">${m.s}</div><div class="mkt-n">${m.t}</div></div><div><div class="mkt-p">${m.p.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:m.s.includes('BTC')||m.s.includes('SOL')?2:m.t==='crypto'?2:4})}</div><div class="mkt-c ${m.c>=0?'pos':'neg'}">${m.c>=0?'+':''}${m.c}%</div></div></div>`).join(''));
}
function renderRecent(){
  const prof=getP(),el=$('recent-body');if(!el)return;
  const r=(prof?.trades||[]).slice(0,6);
  el.innerHTML=!r.length?`<div class="empty" style="padding:20px;">${tx().noRecent}</div>`:
  r.map(tr=>`<div class="rec-row"><div><div style="font-size:.76rem;font-weight:700;">${tr.asset}</div><div style="font-size:.55rem;color:var(--t2);font-family:'JetBrains Mono',monospace;">${tr.date} · ${tr.session||'—'}</div></div><div style="text-align:right;"><div class="${tr.pnl>=0?'ppos':'pneg'}" style="font-size:.78rem;">${fmtM(tr.pnl)}</div><span class="badge b-${tr.dir==='long'?'long':'short'}" style="font-size:.5rem;">${tr.dir==='long'?'B':'S'}</span></div></div>`).join('');
}

// ══ TOPBAR (FIXED — monthly PnL) ══════════════════
function renderTopbar(){
  const prof=getP(),st=getStats(prof),t=tx();
  // avgW/avgL formatting
  const avgWStr=st.avgW>0?fmtA(st.avgW):'$0.00';
  const avgLStr=st.avgL>0?fmtA(st.avgL):'$0.00';
  $('tb-chips').innerHTML=[
    {l:'📅 '+t.monthlyPnl, v:fmtM(st.mpnl), c:st.mpnl>=0?'var(--grn)':'var(--red)', s:isRtl()?'هذا الشهر':'This month'},
    {l:'⚡ '+t.profitFactor, v:st.pf, c:st.pf==='∞'||parseFloat(st.pf)>=1?'var(--grn)':'var(--red)', s:st.totalTrades+' closed trades'},
    {l:'🎯 '+t.winRate, v:st.wr, c:parseFloat(st.wr)>=50?'var(--grn)':'var(--red)', s:st.w+'W / '+st.l+'L'},
    {l:'💹 '+t.avgWL, v:avgWStr+' / '+avgLStr, c:'var(--t1)', s:isRtl()?'متوسط':'Average'},
  ].map(c=>`<div class="tb-chip"><div class="tb-lbl">${c.l}</div><div class="tb-val" style="color:${c.c}">${c.v}</div><div class="tb-sub">${c.s}</div></div>`).join('');
  sT('tb-settings',t.settings);
}
function renderSidebar(){
  const t=tx();
  const pages=[
    {id:'dashboard',icon:'⊞',lbl:t.dashboard},
    {id:'log',icon:'≡',lbl:t.log},
    {id:'addtrade',icon:'＋',lbl:t.addtrade},
    {id:'notebook',icon:'📓',lbl:t.notebook},
    {id:'ai',icon:'NT',lbl:t.ai,nt:true},
    {id:'news',icon:'📅',lbl:t.news},
    {id:'accounts',icon:'◑',lbl:t.accounts}
  ];
  $('sb-nav').innerHTML=pages.map(p=>`<div class="nav-item${curPage===p.id?' active':''}" onclick="goTo('${p.id}')">
    ${p.nt?`<span class="nav-icon" style="font-size:.52rem;font-weight:900;background:var(--red);color:#fff;width:20px;height:16px;border-radius:3px;display:inline-flex;align-items:center;justify-content:center;">${p.icon}</span>`:`<span class="nav-icon">${p.icon}</span>`}
    <span>${p.lbl}</span></div>`).join('');
  sT('sb-sub',t.sbSub);sT('sb-menu-lbl',t.menuLbl);
  sT('theme-lbl',S.dark?t.lightMode:t.darkMode);sT('lang-lbl',S.lang==='en'?t.arabic:t.english);
  const prof=getP();sT('prof-chip-name',prof?.name||'—');sT('prof-chip-cap',fmtA(prof?.capital||0));
  $('prof-av').textContent=(prof?.name||'A')[0].toUpperCase();
}

// ══ WARN ═══════════════════════════════════════
function renderWarn(){
  const warn=getWarn(getP());
  ['warn-d','warn-l'].forEach(id=>{
    const el=$(id);if(!el)return;
    if(warn){el.classList.add('on');sT(id+'-t',warn);}else el.classList.remove('on');
  });
}

// ══ LOG PAGE ════════════════════════════════════
let logFilt='all';
function renderLogPage(){
  const prof=getP(),st=getStats(prof),t=tx();
  sT('lbl-log-t',t.logTitle);sT('lbl-log-add',t.logAdd);
  $('log-stats').innerHTML=[
    {l:t.todayPnl,v:fmtM(st.dpnl),c:st.dpnl>=0?'var(--grn)':'var(--red)'},
    {l:t.monthlyPnl,v:fmtM(st.mpnl),c:st.mpnl>=0?'var(--grn)':'var(--red)'},
    {l:t.totalPnl,v:fmtM(st.tpnl),c:st.tpnl>=0?'var(--grn)':'var(--red)'},
    {l:t.winRate,v:st.wr,c:'var(--gold)'},
    {l:t.profitFactor,v:st.pf,c:'var(--blue)'},
    {l:t.drawdown,v:fmtA(st.tl),c:'var(--red)'}
  ].map(s=>`<div class="stat-card"><div class="sc-lbl">${s.l}</div><div class="sc-val" style="color:${s.c}">${s.v}</div></div>`).join('');
  const dl=st.dpPct,tl=st.tpPct;
  sT('lbl-dl',`${t.dlLbl} (${prof?.dailyPct||5}%)`);sT('lbl-tl',`${t.tlLbl} (${prof?.totalPct||10}%)`);
  sT('dl-pct',Math.round(dl)+'%');sT('tl-pct',Math.round(tl)+'%');
  const dc=$('dl-fill'),tc=$('tl-fill');
  if(dc){dc.style.width=dl+'%';dc.style.background=dl>=80?'var(--red)':dl>=50?'var(--gold)':'var(--grn)';}
  if(tc){tc.style.width=tl+'%';tc.style.background=tl>=80?'var(--red)':tl>=50?'var(--gold)':'var(--grn)';}
  sT('dl-used',t.used+': '+fmtA(st.dl));sT('dl-lim',t.limit+': '+fmtA(st.dayLimit));
  sT('tl-used',t.used+': '+fmtA(st.tlo));sT('tl-lim',t.limit+': '+fmtA(st.totLimit));
  $('log-filters').innerHTML=[['all',t.all],['today',t.today2],['win',t.wins],['loss',t.losses],['open',t.open],['forex',t.forex],['crypto',t.crypto]].map(([k,v])=>`<button class="fp${logFilt===k?' on':''}" onclick="setLF('${k}')">${v}</button>`).join('');
  renderLogTable();
}
function setLF(f){logFilt=f;renderLogPage();}
function renderLogTable(){
  const prof=getP(),t=tx();let list=prof?.trades||[];
  if(logFilt==='today')list=list.filter(t=>t.date===todayStr());
  else if(logFilt==='win')list=list.filter(t=>t.status==='win');
  else if(logFilt==='loss')list=list.filter(t=>t.status==='loss');
  else if(logFilt==='open')list=list.filter(t=>t.status==='open');
  else if(logFilt==='forex')list=list.filter(t=>t.market==='forex');
  else if(logFilt==='crypto')list=list.filter(t=>t.market==='crypto');
  sT('log-count',list.length+' trades');
  $('log-thead').innerHTML='<tr>'+[t.lf_date,t.lf_time,t.lf_pair,t.lf_mkt,t.lf_dir,t.lf_status,'P&L','R:R',t.lf_strat,'ICT',t.lf_psych,'📎',''].map(h=>`<th>${h}</th>`).join('')+'</tr>';
  const ei={Calm:'😌',Confident:'💪',Anxious:'😰',FOMO:'😤',Revenge:'😡',Tired:'😴',Overconfident:'🤯'};
  const sb=s=>s==='win'?'b-win':s==='loss'?'b-loss':s==='breakeven'?'b-be':'b-open';
  const sl=s=>({win:t.winS,loss:t.lossS,breakeven:t.beS,open:t.openS})[s]||s;
  const rrc=rr=>{if(!rr||rr==='—')return'var(--t2)';const parts=rr.split(':');const n=+parts[parts.length-1];return n>=2?'var(--grn)':n>=1?'var(--gold)':'var(--red)';};
  if(!list.length){$('log-tbody').innerHTML=`<tr><td colspan="13"><div class="empty"><div class="empty-ico">📋</div>${t.noTrades}</div></td></tr>`;return;}
  $('log-tbody').innerHTML=list.map((tr,i)=>{
    const attCount=(tr.files||[]).length+(tr.links||[]).length;
    const trJson=JSON.stringify(tr).replace(/"/g,'&quot;');
    return`<tr style="animation:fadeUp .3s ${i*.015}s both">
    <td style="font-family:'JetBrains Mono',monospace;font-size:.7rem;">${tr.date}</td>
    <td style="font-family:'JetBrains Mono',monospace;font-size:.68rem;color:var(--t2)">${tr.time||'—'}</td>
    <td><strong style="color:var(--blue)">${tr.asset}</strong></td>
    <td><span class="badge b-${tr.market||'forex'}" style="font-size:.52rem;">${tr.market==='crypto'?'Crypto':'Forex'}</span></td>
    <td><span class="badge b-${tr.dir==='long'?'long':'short'}">${tr.dir==='long'?t.buy:t.sell}</span></td>
    <td><span class="badge ${sb(tr.status)}">${sl(tr.status)}</span></td>
    <td class="${tr.pnl>0?'ppos':tr.pnl<0?'pneg':''}">${tr.pnl?fmtM(tr.pnl):'—'}</td>
    <td style="font-family:'JetBrains Mono',monospace;font-size:.7rem;color:${rrc(tr.rr||'—')}">${tr.rr||'—'}</td>
    <td style="font-size:.7rem;color:var(--t2);max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${tr.strategy||'—'}</td>
    <td style="max-width:80px;">${(tr.ictConcepts||[]).slice(0,2).map(c=>`<span style="display:inline-block;padding:1px 4px;background:var(--purplebg);color:var(--purple);border-radius:3px;font-size:.46rem;white-space:nowrap;margin:1px;">${c.split('(')[0].trim()}</span>`).join('')||'—'}</td>
    <td>${ei[tr.emotion]||'😌'}</td>
    <td>${attCount>0?`<button class="btn sm" onclick="openModal('view-files',${trJson})">📎 ${attCount}</button>`:'—'}</td>
    <td><button class="del-btn" onclick="delTrade('${prof.id}','${tr.id}')">✕</button></td>
  </tr>`;}).join('');
}

// ══ NOTEBOOK ════════════════════════════════════
let selNote=null;
function newNote(){const n={id:Date.now().toString(),date:todayStr(),title:'',tags:[],body:''};S.notes.unshift(n);selNote=n.id;save();renderNb();$('nb-ed-title')?.focus();}
function saveNote(){const n=S.notes.find(x=>x.id===selNote);if(!n)return;n.title=$('nb-ed-title')?.value||'Untitled';n.body=$('nb-ta')?.value||'';n.tags=($('nb-ed-tags')?.value||'').match(/#\w+/g)||[];n.updated=todayStr();save();renderNbList();}
function deleteNote(){if(!selNote||!confirm(isRtl()?'حذف هذه الملاحظة؟':'Delete this note?'))return;S.notes=S.notes.filter(n=>n.id!==selNote);selNote=null;save();renderNb();}
function selectNote(id){
  selNote=id;const n=S.notes.find(x=>x.id===id);if(!n)return;
  if($('nb-ed-title'))$('nb-ed-title').value=n.title;
  if($('nb-ta'))$('nb-ta').value=n.body;
  if($('nb-ed-tags'))$('nb-ed-tags').value=n.tags.join(' ');
  if($('nb-date'))$('nb-date').textContent=n.date;
  const prof=getP();
  const dp=(prof?.trades||[]).filter(t=>t.date===n.date&&t.status!=='open').reduce((s,t)=>s+t.pnl,0);
  const pnlEl=$('nb-pnl');
  if(pnlEl){pnlEl.textContent=dp?fmtM(dp):'';pnlEl.style.background=dp>0?'var(--grnbg)':dp<0?'var(--redbg)':'transparent';pnlEl.style.color=dp>0?'var(--grn)':dp<0?'var(--red)':'var(--t2)';}
  sT('nb-chars',($('nb-ta')?.value||'').length+' chars');
  renderNbList();
}
function renderNbList(){
  const q=($('nb-search')?.value||'').toLowerCase();
  const list=S.notes.filter(n=>!q||n.title.toLowerCase().includes(q)||n.body.toLowerCase().includes(q)||n.tags.some(t=>t.includes(q)));
  $('nb-list').innerHTML=list.map(n=>`<div class="nb-item${n.id===selNote?' sel':''}" onclick="selectNote('${n.id}')"><div class="nb-item-dt">${n.date}</div><div class="nb-item-t">${n.title||'Untitled'}</div><div class="nb-tags">${n.tags.map(tag=>`<span class="nb-tag">${tag}</span>`).join('')}</div></div>`).join('')||`<div class="empty">${tx().noTrades}</div>`;
}
function renderNb(){renderNbList();if(selNote)selectNote(selNote);else{['nb-ed-title','nb-ta','nb-ed-tags'].forEach(id=>{const el=$(id);if(el)el.value='';});sT('nb-chars','');}}
setInterval(()=>{if(selNote)saveNote();},30000);

// ══ TRADE CONTEXT BUILDER ═══════════════════════
function buildCtx(){
  const prof=getP();if(!prof||!prof.trades.length)return'No trades logged yet.';
  const st=getStats(prof);const cl=prof.trades.filter(t=>t.status!=='open');
  const ict={},emotions={},sessions={},strategies={};
  cl.forEach(t=>{
    (t.ictConcepts||[]).forEach(c=>{ict[c]=(ict[c]||0)+1;});
    if(t.emotion)emotions[t.emotion]=(emotions[t.emotion]||0)+1;
    if(t.session)sessions[t.session]=(sessions[t.session]||0)+1;
    if(t.strategy)strategies[t.strategy]=(strategies[t.strategy]||0)+1;
  });
  const fx=cl.filter(t=>t.market==='forex'),cr=cl.filter(t=>t.market==='crypto');
  const now=new Date();
  const curMonth=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
  const mc=cl.filter(t=>t.date.startsWith(curMonth));
  return`=== TRADER PROFILE ===
Name: ${prof.name} | Capital: ${fmtA(prof.capital)} | Risk/trade: 2% = ${fmtA(prof.capital*.02)}
Daily Limit: ${prof.dailyPct}% (${fmtA(prof.capital*prof.dailyPct/100)}) | Total Limit: ${prof.totalPct}%

=== PERFORMANCE STATS ===
Win Rate: ${st.wr} | Profit Factor: ${st.pf} | Total Trades: ${st.totalTrades}
Total P&L: ${fmtM(st.tpnl)} | Monthly P&L: ${fmtM(st.mpnl)} | Today P&L: ${fmtM(st.dpnl)}
Avg Win: ${fmtA(st.avgW)} | Avg Loss: ${fmtA(st.avgL)} | Max Drawdown: ${fmtA(st.tl)}
Wins: ${st.w} | Losses: ${st.l}

=== BY MARKET ===
Forex: ${fx.length} trades → ${fmtM(fx.reduce((s,t)=>s+t.pnl,0))}
Crypto: ${cr.length} trades → ${fmtM(cr.reduce((s,t)=>s+t.pnl,0))}

=== THIS MONTH (${curMonth}) ===
Trades: ${mc.length} | P&L: ${fmtM(mc.reduce((s,t)=>s+t.pnl,0))}

=== ICT CONCEPTS USED ===
${Object.entries(ict).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v])=>`${k}: ${v}x`).join(', ')||'None'}

=== PSYCHOLOGY ===
${Object.entries(emotions).map(([k,v])=>`${k}: ${v}x`).join(', ')||'None'}

=== STRATEGIES ===
${Object.entries(strategies).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>`${k}: ${v}x`).join(', ')||'None'}

=== LAST 10 TRADES ===
${cl.slice(0,10).map(t=>`[${t.date}] ${t.asset} ${t.dir.toUpperCase()} ${t.status.toUpperCase()} ${fmtM(t.pnl)} R:R=${t.rr||'—'} Strategy:${t.strategy||'—'} ICT:${(t.ictConcepts||[]).join('+')||'—'} Psych:${t.emotion||'—'}`).join('\n')}`;
}

// ══ MAIN AI CHAT (Page) ══════════════════════════
async function sendMsg(){
  const el=$('chat-inp');const msg=el?.value.trim();if(!msg)return;
  el.value='';addMsg('user',msg);S.chat.push({role:'user',content:msg});
  const td=addTyping();
  const key=getAPIKey();
  if(!key){
    td.remove();
    addMsg('ai',isRtl()?'⚙️ يرجى إضافة مفتاح Anthropic API في الإعدادات (⚙ Settings)':'⚙️ Please add your Anthropic API key in Settings (⚙) to use NT AI.');
    return;
  }
  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:700,
        system:isRtl()
          ?`أنت NT AI مدرب تداول متخصص في الفوركس والكريبتو ومفاهيم ICT. أنت جزء من منصة NQTRT.\n\nبيانات المتداول الحالية:\n${buildCtx()}\n\nأجب بالعربية بشكل مختصر وعملي ومحدد بناءً على صفقاته الفعلية. لا تتجاوز 200 كلمة.`
          :`You are NT AI — a professional trading coach embedded in the NQTRT trading journal. You have direct access to this trader's real data.\n\nTrader's actual data:\n${buildCtx()}\n\nBe specific, reference their actual trades and patterns. Be concise (max 180 words), actionable, and professional. Speak directly to this trader based on their real performance.`,
        messages:S.chat.slice(-12)
      })
    });
    const data=await res.json();td.remove();
    if(data.error){addMsg('ai','❌ '+data.error.message);return;}
    const reply=data.content?.map(c=>c.text).join('')||'No response.';
    addMsg('ai',reply);S.chat.push({role:'assistant',content:reply});save();
  }catch(err){td.remove();addMsg('ai',isRtl()?'❌ خطأ في الاتصال. تحقق من مفتاح API.':'❌ Connection error. Check your API key in Settings.');}
}
function addMsg(role,text){
  const w=$('chat-msgs');if(!w)return null;
  const d=document.createElement('div');d.className='msg '+role;
  d.innerHTML=`<div class="msg-av ${role}">${role==='ai'?'NT':'👤'}</div><div class="bubble ${role}">${text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</div>`;
  w.appendChild(d);w.scrollTop=w.scrollHeight;return d;
}
function addTyping(){return addMsg('ai','<span class="tdot"></span><span class="tdot"></span><span class="tdot"></span>');}
function clearChat(){S.chat=[];const w=$('chat-msgs');if(w)w.innerHTML='';save();addMsg('ai',tx().aiWelcome);}
function sendPreset(msg){const el=$('chat-inp');if(el)el.value=msg;sendMsg();}
function renderAI(){
  const t=tx();sT('lbl-ai-t',t.aiTitle);sT('lbl-ai-clear',t.aiClear);sT('ai-name',t.aiTitle);sT('ai-sub',t.aiSub);sT('lbl-qp',t.qp);
  $('presets-body').innerHTML=t.aiPresets.map(p=>`<button class="preset-btn" onclick="sendPreset('${p.replace(/'/g,"\\'")}')"><span class="preset-ico">${p.slice(0,2)}</span>${p.slice(3)}</button>`).join('');
  const w=$('chat-msgs');if(w&&!w.children.length)addMsg('ai',t.aiWelcome);
}

// ══ FLOATING NT AI CHATBOT ════════════════════════
let floatOpen=false;
let floatChatHistory=[];

function toggleFloatAI(){
  floatOpen=!floatOpen;
  const panel=$('float-ai-panel');
  if(panel)panel.classList.toggle('open',floatOpen);
  if(floatOpen){
    // init messages if empty
    const msgs=$('float-msgs');
    if(msgs&&!msgs.children.length){
      addFloatMsg('ai',isRtl()?'مرحباً! أنا NT AI. أستطيع تحليل صفقاتك الخاصة. اسألني أي شيء!':'Hello! I\'m NT AI. I can analyze your specific trades and patterns. Ask me anything!');
    }
    updateFloatStats();
    setTimeout(()=>$('float-inp')?.focus(),300);
    // hide unread dot
    const dot=$('float-ai-unread');if(dot)dot.style.display='none';
  }
}
function updateFloatStats(){
  const prof=getP();if(!prof)return;
  const st=getStats(prof);
  const strip=$('float-stats-strip');if(!strip)return;
  strip.innerHTML=`
    <div class="fss-item"><div class="fss-lbl">WIN RATE</div><div class="fss-val" style="color:${parseFloat(st.wr)>=50?'var(--grn)':'var(--red)'}">${st.wr}</div></div>
    <div class="fss-item"><div class="fss-lbl">P.FACTOR</div><div class="fss-val" style="color:var(--blue)">${st.pf}</div></div>
    <div class="fss-item"><div class="fss-lbl">MTH P&L</div><div class="fss-val" style="color:${st.mpnl>=0?'var(--grn)':'var(--red)'}">${fmtM(st.mpnl)}</div></div>
    <div class="fss-item"><div class="fss-lbl">TRADES</div><div class="fss-val">${st.totalTrades}</div></div>`;
}
async function sendFloatMsg(){
  const el=$('float-inp');const msg=el?.value.trim();if(!msg)return;
  el.value='';
  addFloatMsg('user',msg);
  floatChatHistory.push({role:'user',content:msg});
  const td=addFloatTyping();
  const key=getAPIKey();
  if(!key){
    td.remove();
    addFloatMsg('ai','⚙️ '+(isRtl()?'أضف مفتاح API في الإعدادات لتفعيل NT AI':'Add your API key in Settings (⚙) to activate NT AI.'));
    return;
  }
  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:500,
        system:isRtl()
          ?`أنت NT AI مدرب تداول متخصص في NQTRT. هذا تحليل موجز.\n\nبيانات الصفقات:\n${buildCtx()}\n\nأجب بالعربية، مختصر جداً (أقل من 120 كلمة)، محدد بالصفقات الفعلية.`
          :`You are NT AI, a concise trading coach in the NQTRT journal. This is a quick floating assistant.\n\nTrader data:\n${buildCtx()}\n\nBe very concise (max 100 words), specific to their actual trades and data. No fluff.`,
        messages:floatChatHistory.slice(-8)
      })
    });
    const data=await res.json();td.remove();
    if(data.error){addFloatMsg('ai','❌ '+data.error.message);return;}
    const reply=data.content?.map(c=>c.text).join('')||'No response.';
    addFloatMsg('ai',reply);
    floatChatHistory.push({role:'assistant',content:reply});
  }catch(err){
    td.remove();
    addFloatMsg('ai',isRtl()?'❌ خطأ في الاتصال.':'❌ Connection error. Check API key.');
  }
}
function addFloatMsg(role,text){
  const w=$('float-msgs');if(!w)return null;
  const d=document.createElement('div');d.className='msg '+role;
  d.innerHTML=`<div class="msg-av ${role}">${role==='ai'?'NT':'👤'}</div><div class="bubble ${role}">${text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</div>`;
  w.appendChild(d);w.scrollTop=w.scrollHeight;return d;
}
function addFloatTyping(){return addFloatMsg('ai','<span class="tdot"></span><span class="tdot"></span><span class="tdot"></span>');}

// ══ NEWS PAGE ═══════════════════════════════════
function renderNewsPage(){
  sT('lbl-news-t',tx().newsTitle);
  const iframe=$('ff-iframe');
  if(iframe){
    setTimeout(()=>{
      try{const x=iframe.contentDocument;if(!x||!x.body.innerHTML){showFFfb();}}catch{showFFfb();}
    },3000);
  }
}
function showFFfb(){
  const iframe=$('ff-iframe'),fb=$('ff-fb');
  if(iframe)iframe.style.display='none';if(fb)fb.style.display='block';
  const events=[{d:'Mon',t:'12:30',e:'Fed Member Speech',i:'med'},{d:'Tue',t:'13:30',e:'CPI YoY',i:'high'},{d:'Tue',t:'13:30',e:'Core CPI MoM',i:'high'},{d:'Wed',t:'14:00',e:'FOMC Meeting Minutes',i:'high'},{d:'Thu',t:'13:30',e:'Initial Jobless Claims',i:'med'},{d:'Thu',t:'13:30',e:'PPI MoM',i:'high'},{d:'Fri',t:'13:30',e:'NFP',i:'high'},{d:'Fri',t:'13:30',e:'Unemployment Rate',i:'high'},{d:'Fri',t:'15:00',e:'UoM Consumer Sentiment',i:'med'}];
  const el=$('usd-events');if(!el)return;
  el.innerHTML=events.map(e=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--card2);border-radius:6px;margin-bottom:5px;border-left:3px solid ${e.i==='high'?'var(--red)':'var(--gold)'};">
    <span style="font-family:'JetBrains Mono',monospace;font-size:.6rem;color:var(--t2);width:28px;">${e.d}</span>
    <span style="font-family:'JetBrains Mono',monospace;font-size:.6rem;color:var(--t2);width:40px;">${e.t}</span>
    <span style="font-size:.72rem;font-weight:700;flex:1;">${e.e}</span>
    <span class="badge" style="background:${e.i==='high'?'var(--redbg)':'var(--goldbg)'};color:${e.i==='high'?'var(--red)':'var(--gold)'};">${e.i.toUpperCase()}</span>
  </div>`).join('');
}

// ══ ACCOUNTS PAGE ════════════════════════════════
function renderAccPage(){
  const t=tx();sT('lbl-acc-t',t.accTitle);sT('lbl-acc-new',t.accNew);
  $('accs-grid').innerHTML=S.profiles.map(prof=>{
    const st=getStats(prof),sc=calcScore(prof);
    return`<div class="acc-card${prof.id===S.active?' active':''}" onclick="switchProfile('${prof.id}')">
      ${prof.id===S.active?`<div class="acc-badge">${t.active}</div>`:''}
      <div class="acc-name">${prof.name}</div>
      <div class="acc-cap">${fmtA(prof.capital)}</div>
      <div class="acc-limits">
        <div class="acc-lim"><div class="acc-lim-l">DAILY LIMIT</div><div class="acc-lim-v" style="color:var(--gold)">${prof.dailyPct}% = ${fmtA(prof.capital*prof.dailyPct/100)}</div></div>
        <div class="acc-lim"><div class="acc-lim-l">TOTAL LIMIT</div><div class="acc-lim-v" style="color:var(--red)">${prof.totalPct}% = ${fmtA(prof.capital*prof.totalPct/100)}</div></div>
        <div class="acc-lim"><div class="acc-lim-l">RISK/TRADE</div><div class="acc-lim-v" style="color:var(--grn)">${fmtA(prof.capital*.02)}</div></div>
        <div class="acc-lim"><div class="acc-lim-l">NT SCORE</div><div class="acc-lim-v" style="color:var(--blue)">${sc}/100</div></div>
        <div class="acc-lim" style="grid-column:1/-1"><div class="acc-lim-l">RECORD</div><div class="acc-lim-v">${st.totalTrades} trades · ${st.w}W/${st.l}L · ${st.wr}</div></div>
      </div>
      <div class="acc-actions">
        <button class="btn sm" onclick="event.stopPropagation();openModal('edit-profile',${JSON.stringify(prof).replace(/"/g,'&quot;')})">${t.edit}</button>
        ${S.profiles.length>1?`<button class="btn sm" style="color:var(--red);border-color:var(--redborder)" onclick="event.stopPropagation();openModal('del-profile',${JSON.stringify({id:prof.id,name:prof.name}).replace(/"/g,'&quot;')})">${t.del}</button>`:''}
      </div>
    </div>`;
  }).join('');
}

// ══ FORM LABELS ══════════════════════════════════
function renderFormLabels(){
  const t=tx();
  const m={'fs1':t.fs1,'fs3':t.fs3,'fs4':t.fs4,'fs5':t.fs5,'lf-date':t.lf_date,'lf-time':t.lf_time,'lf-pair':t.lf_pair,'lf-mkt':t.lf_mkt,'lf-sess':t.lf_sess,'lf-dir':t.lf_dir,'lf-tf':t.lf_tf,'lf-psych':t.lf_psych,'lf-status':t.lf_status,'lf-pnl':t.lf_pnl,'lf-rr':t.lf_rr,'lf-strat':t.lf_strat,'lf-conf':t.lf_conf,'lf-notes':t.lf_notes,'lf-review':t.lf_review,'lf-attach':t.lf_attach,'lbl-submit':t.submitTrade,'lbl-at-t':t.logATrade,'lbl-back':t.back,'lbl-add':t.addTrade,'strat-add-btn':t.stratAdd,'upload-txt':t.uploadTxt,'upload-sub-t':t.uploadSub,'btn-add-link':t.addLink};
  Object.entries(m).forEach(([id,v])=>sT(id,v));
  $('btn-long').textContent=t.buy;$('btn-short').textContent=t.sell;
  renderIndTags();renderStrats();
}

// ══ THEME & LANG ═════════════════════════════════
function toggleTheme(){S.dark=!S.dark;save();document.body.classList.toggle('light',!S.dark);sT('theme-lbl',S.dark?tx().lightMode:tx().darkMode);}
function toggleLang(){S.lang=S.lang==='en'?'ar':'en';save();document.documentElement.lang=S.lang;document.documentElement.dir=isRtl()?'rtl':'ltr';document.body.className=(isRtl()?'rtl ':'')+(S.dark?'':'light');renderAll();}

// ══ RIPPLE ═══════════════════════════════════════
document.addEventListener('click',e=>{
  const el=e.target.closest('button,.nav-item,.acc-card,.fp,.nb-item,.cal-cell,.preset-btn,.sc,.mkt-row');
  if(!el)return;
  const r=document.createElement('span');r.className='rpl';
  const rect=el.getBoundingClientRect();const sz=Math.max(rect.width,rect.height)*1.5;
  r.style.cssText=`width:${sz}px;height:${sz}px;left:${e.clientX-rect.left-sz/2}px;top:${e.clientY-rect.top-sz/2}px;position:absolute;`;
  el.style.position='relative';el.style.overflow='hidden';el.appendChild(r);setTimeout(()=>r.remove(),600);
});

// ══ NAVIGATION ════════════════════════════════════
let curPage='dashboard';
function goTo(page){
  curPage=page;
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg=$('page-'+page);if(pg)pg.classList.add('active');
  $('content').scrollTop=0;
  renderSidebar();renderPageContent();
  if(page==='addtrade'){
    if($('f-date'))$('f-date').value=todayStr();
    if($('f-time'))$('f-time').value=nowTime();
    setDir('long');selICT=new Set();selClassic=new Set();selStrat=null;
    upFiles=[];upLinks=[];renderUpPrev();renderLinksPrev();
  }
  if(page==='ai'){const w=$('chat-msgs');if(w&&!w.children.length)addMsg('ai',tx().aiWelcome);}
}
function renderPageContent(){
  if(curPage==='dashboard'){renderTodayW();renderCal();renderScore();renderMarket();renderRecent();renderEquity();renderDist();}
  else if(curPage==='log')renderLogPage();
  else if(curPage==='addtrade')renderFormLabels();
  else if(curPage==='notebook')renderNb();
  else if(curPage==='ai')renderAI();
  else if(curPage==='news')renderNewsPage();
  else if(curPage==='accounts')renderAccPage();
}

// ══ RENDER ALL ════════════════════════════════════
function renderAll(){
  document.body.className=(isRtl()?'rtl ':'')+(S.dark?'':'light');
  document.documentElement.lang=S.lang;document.documentElement.dir=isRtl()?'rtl':'ltr';
  renderSidebar();renderTopbar();renderWarn();renderPageContent();
}

// ══ THREE.JS 3D BACKGROUND ════════════════════════
function initBg(){
  if(!window.THREE){console.warn('Three.js not loaded');return;}
  const canvas=document.getElementById('bg-canvas');if(!canvas)return;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,.1,1000);
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  camera.position.z=35;

  // Particles
  const COUNT=90;
  const pts=[];
  const posArr=new Float32Array(COUNT*3);
  for(let i=0;i<COUNT;i++){
    const p={x:(Math.random()-.5)*90,y:(Math.random()-.5)*65,z:(Math.random()-.5)*30,vx:(Math.random()-.5)*.025,vy:(Math.random()-.5)*.018};
    pts.push(p);posArr[i*3]=p.x;posArr[i*3+1]=p.y;posArr[i*3+2]=p.z;
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(posArr,3));
  // Mix red and cyan dots
  const colArr=new Float32Array(COUNT*3);
  for(let i=0;i<COUNT;i++){
    const isRed=Math.random()>.7;
    if(isRed){colArr[i*3]=.94;colArr[i*3+1]=.14;colArr[i*3+2]=.24;}
    else{colArr[i*3]=.25;colArr[i*3+1]=.3;colArr[i*3+2]=.5;}
  }
  geo.setAttribute('color',new THREE.BufferAttribute(colArr,3));
  const mat=new THREE.PointsMaterial({size:.45,vertexColors:true,transparent:true,opacity:.55});
  const mesh=new THREE.Points(geo,mat);
  scene.add(mesh);

  // Lines
  const lineMat=new THREE.LineBasicMaterial({color:0xef233c,transparent:true,opacity:.07});
  let lineObj=null;

  function rebuildLines(){
    if(lineObj)scene.remove(lineObj);
    const lp=[];
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y;
        if(dx*dx+dy*dy<220){lp.push(pts[i].x,pts[i].y,pts[i].z,pts[j].x,pts[j].y,pts[j].z);}
      }
    }
    const lg=new THREE.BufferGeometry();
    lg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(lp),3));
    lineObj=new THREE.LineSegments(lg,lineMat);
    scene.add(lineObj);
  }

  // Subtle floating torus rings
  const rings=[];
  for(let i=0;i<3;i++){
    const rGeo=new THREE.TorusGeometry(8+i*5,.03,8,50);
    const rMat=new THREE.MeshBasicMaterial({color:0xef233c,transparent:true,opacity:.04+i*.02,wireframe:true});
    const ring=new THREE.Mesh(rGeo,rMat);
    ring.rotation.x=Math.random()*Math.PI;
    ring.rotation.y=Math.random()*Math.PI;
    ring.position.set((Math.random()-.5)*30,(Math.random()-.5)*20,0);
    scene.add(ring);rings.push(ring);
  }

  let frame=0;
  function animate(){
    requestAnimationFrame(animate);
    frame++;
    const pa=geo.attributes.position.array;
    pts.forEach((p,i)=>{
      p.x+=p.vx;p.y+=p.vy;
      if(Math.abs(p.x)>45)p.vx*=-1;
      if(Math.abs(p.y)>32)p.vy*=-1;
      pa[i*3]=p.x;pa[i*3+1]=p.y;pa[i*3+2]=p.z;
    });
    geo.attributes.position.needsUpdate=true;
    if(frame%3===0)rebuildLines();
    rings.forEach((r,i)=>{r.rotation.x+=.002*(i+1);r.rotation.y+=.003*(i+1);});
    renderer.render(scene,camera);
  }
  animate();

  window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  });
}

// ══ PWA ═══════════════════════════════════════
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{});});}
let deferredPrompt;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;setTimeout(()=>{if(deferredPrompt)showBanner();},3000);});
function showBanner(){
  const b=document.createElement('div');b.id='install-banner';
  b.style.cssText='position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#ef233c;color:#fff;padding:12px 20px;border-radius:12px;display:flex;align-items:center;gap:12px;z-index:9999;box-shadow:0 8px 32px rgba(239,35,60,.4);font-size:13px;font-weight:600;max-width:90vw;animation:fadeUp .4s ease;';
  b.innerHTML=`<span>${isRtl()?'📱 ثبّت NQTRT كتطبيق!':'📱 Install NQTRT as an app!'}</span><button onclick="installApp()" style="background:#fff;color:#ef233c;border:none;padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;">${isRtl()?'تثبيت':'Install'}</button><button onclick="this.parentElement.remove()" style="background:transparent;border:none;color:rgba(255,255,255,.7);cursor:pointer;font-size:1rem;">✕</button>`;
  document.body.appendChild(b);
}
async function installApp(){if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;const b=document.getElementById('install-banner');if(b)b.remove();}

// ══ INIT ══════════════════════════════════════════
if(!S.dark)document.body.classList.add('light');
document.body.dir=isRtl()?'rtl':'ltr';
if(isRtl())document.body.classList.add('rtl');
renderAll();
// Start 3D background after Three.js loads
window.addEventListener('load',()=>{setTimeout(initBg,100);});
document.addEventListener('input',e=>{if(e.target.id==='nb-ta')sT('nb-chars',(e.target.value||'').length+' chars');});
document.addEventListener('keydown',e=>{
  if(e.ctrlKey&&e.key==='s'&&curPage==='notebook'){e.preventDefault();saveNote();}
  if(e.key==='Escape'&&floatOpen)toggleFloatAI();
});
