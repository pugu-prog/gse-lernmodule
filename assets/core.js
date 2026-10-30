/* GSE-Lernmodule: gemeinsame Hilfen (Zahlen, MathJax, Aufgaben prüfen). Wird von jeder Modulseite geladen. */
/* ---------- Hilfen ---------- */
let tsQueue=Promise.resolve();
function typeset(el){
  if(Array.isArray(el)){el.forEach(typeset);return}
  const mj=window.MathJax;
  if(!mj||!mj.startup||!mj.startup.promise)return;
  tsQueue=tsQueue.then(()=>mj.startup.promise).then(()=>{mj.typesetClear([el]);return mj.typesetPromise([el])}).catch(()=>{});
}
const $=id=>document.getElementById(id);
const fmt=(x,n=3)=>Number.isFinite(x)?x.toLocaleString("de-DE",{minimumFractionDigits:n,maximumFractionDigits:n}):"–";
const val=id=>parseFloat($(id).value);
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const n_=(x,d)=>fmt(x,d).replace(/,/g,"{,}").replace(/\./g,"\\,");   // Zahl für TeX
const sg=(x,d=0)=>x<0?`(${n_(x,d)})`:n_(x,d);
const parseNum=s=>parseFloat(String(s).trim().replace(/\s/g,"").replace(/\.(?=\d{3}(\D|$))/g,"").replace(",","."));
const uR="\\,\\frac{\\mathrm{m^2\\,K}}{\\mathrm{W}}", uL="\\,\\frac{\\mathrm{W}}{\\mathrm{m\\,K}}", uU="\\,\\frac{\\mathrm{W}}{\\mathrm{m^2\\,K}}", uQ="\\,\\frac{\\mathrm{W}}{\\mathrm{m^2}}";
const sR="\\,\\mathrm{m^2K/W}", sU="\\,\\mathrm{W/(m^2K)}", sC="\\,^\\circ\\mathrm{C}";
const M=(tex,cap="")=>`<div class="eq"><div class="m">\\[${tex}\\]</div>${cap?`<span class="c">${cap}</span>`:""}</div>`;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};


/* ---------- Aufgaben-Engine (alle Module) ---------- */
function checkVal(t,raw){
  if(t.kind==="sel")return +raw===t.ans;
  const x=parseNum(raw);if(!Number.isFinite(x))return null;
  return t.atol!=null?Math.abs(x-t.ans)<=t.atol:Math.abs(x-t.ans)<=t.tol*Math.abs(t.ans)+1e-9;
}
function taskHTML(t,id,num){
  const inp=t.kind==="sel"?`<select id="${id}"><option value="">wählen …</option>${t.opts.map((o,i)=>`<option value="${i}">${esc(o)}</option>`).join("")}</select>`
    :t.kind==="text"?`<textarea id="${id}" style="min-height:60px;font-family:var(--f-display);font-size:14px" aria-label="Antwort"></textarea>`:`<input id="${id}" inputmode="decimal" aria-label="Ergebnis" autocomplete="off">`;
  return `<div class="task" data-id="${id}"><div class="q">${num?`<b>${num}</b> `:""}${t.q}</div><div class="ctl">${t.kind==="text"?"":inp}<span class="unit">${t.unit||""}</span></div><div class="ctl">${t.kind==="text"?"":`<button data-chk="${id}">Prüfen</button>`}</div>${t.kind==="text"?`<div style="grid-column:1/-1">${inp}</div>`:""}<div class="fb" id="${id}-fb" aria-live="polite"></div><details><summary>${t.kind==="text"?"Musterlösung":"Lösungsweg"}</summary><div style="padding:6px 0">${t.sol}</div></details></div>`;
}
function bindTasks(root,tasks,ids,onScore){
  const done=new Set();
  const run=(i)=>{const t=tasks[i],el=$(ids[i]),fb=$(ids[i]+"-fb");const ok=checkVal(t,el.value);
    if(ok===null){fb.className="fb bad";fb.textContent="Bitte eine Zahl eingeben (Komma oder Punkt).";return}
    fb.className="fb "+(ok?"ok":"bad");
    fb.textContent=ok?"Richtig.":t.kind==="sel"?"Noch nicht richtig. Schau dir die Erklärung oder den Lösungsweg an.":`Noch nicht richtig. ${Math.abs(parseNum(el.value)*100-t.ans)<=0.03*Math.abs(t.ans)||Math.abs(parseNum(el.value)/100-t.ans)<=0.03*Math.abs(t.ans)?"Prüfe die Einheit (cm → m?).":"Prüfe Formel und Einsetzen."}`;
    if(ok)done.add(i);else done.delete(i);onScore&&onScore(done.size);};
  ids.forEach((id,i)=>{const b=root.querySelector(`[data-chk="${id}"]`);if(b)b.onclick=()=>run(i);const el=$(id);if(el&&tasks[i].kind!=="text")el.addEventListener("keydown",e=>{if(e.key==="Enter")run(i)});if(el&&tasks[i].kind==="sel")el.onchange=()=>run(i)});
}

function chips(el,state,key,onchg){el.innerHTML=TOPICS.map(([k,n])=>`<label><input type="checkbox" data-t="${k}" ${state[k]?"checked":""}> ${n}</label>`).join("");
  el.querySelectorAll("input").forEach(c=>c.onchange=()=>{state[c.dataset.t]=c.checked?1:0;store.set(key,state);onchg()})}
const ansTex=t=>`\\(${n_(t.ans,dig(t))}\\)\u202f${t.unit||""}`;
const dig=t=>/circ|cm/.test(t.unit||"")?1:Math.abs(t.ans)>=100?0:3;
const solFor=t=>t.kind==="sel"?`Richtig ist: <b>${esc(t.opts[t.ans])}</b>`:`Ergebnis: <b>${ansTex(t)}</b>`;
