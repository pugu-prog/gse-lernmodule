/* Bauphysik: Materialien (ENTEC-Formelsammlung 26/27, Tab. 5.3), U-Wert, Taupunkt, Glaser, Phasenverschiebung, Übungswände. Braucht core.js. */
/* ---------- Materialdatenbank: ENTEC-Formelsammlung, Tabelle 5.3 ---------- */
const KAT={putz:{n:"Putze und Mörtel",p:"dots",c:"#e8d9c4"},beton:{n:"Beton",p:"cross",c:"#a8adab"},mauer:{n:"Mauerwerk",p:"hatch",c:"#c96f4a"},
  daemm:{n:"Wärmedämmstoffe",p:"wave",c:"#e9d36b"},holz:{n:"Holz und Holzwerkstoffe",p:"hatch",c:"#c89a62"},sonst:{n:"Sonstige Stoffe",p:"none",c:"#cfd8dc"},
  extra:{n:"Ergänzungen",p:"none",c:"#dbeafe"},eigen:{n:"Eigene Materialien",p:"none",c:"#d9c8f0"}};
const FS=[];
const rg=v=>Array.isArray(v)?{lo:v[0],hi:v[1]}:{lo:v,hi:v};
function mat(kat,n,rho,l,mu,c,col,src="FS"){
  const r=rg(rho),lr=rg(l),m=mu==="dicht"?{lo:1e5,hi:1e5,dicht:true}:mu==null?{lo:1,hi:1,none:true}:rg(mu);
  const o={key:src+":"+FS.length,kat,n,rho:{...r,v:r.lo===r.hi?r.lo:Math.round((r.lo+r.hi)/2/5)*5},l:{...lr,v:lr.hi},mu:m,c,col:col||KAT[kat].c,src};
  FS.push(o);return o;
}
// Putze und Mörtel
mat("putz","Kalkputz / Kalkzementputz",1800,1,[15,35],960,"#f2c4a6");
mat("putz","Lehmoberputz",1775,0.91,[5,10],1000,"#cdbfa6");
mat("putz","Zementputz",2000,1.6,[15,35],1000,"#d9d4cc");
mat("putz","Gipsputz",1200,0.51,10,1000,"#ece9e3");
mat("putz","Gipskartonplatte",800,0.25,[4,10],1000,"#f1efe8");
mat("putz","Wärmedämmputz WLG 060",200,0.060,[5,20],null,"#efe6c8");
mat("putz","Wärmedämmputz WLG 080",200,0.080,[5,20],null,"#efe6c8");
// Beton
mat("beton","Normalbeton ρ 2000",2000,1.35,[60,100],1000,"#b5b9b7");
mat("beton","Beton unbewehrt ρ 2200",2200,1.65,[70,120],1000,"#adb2b0");
mat("beton","Stahlbeton ρ 2400",2400,2,[80,130],880,"#a8adab");
[[800,.39],[1000,.49],[1200,.62],[1400,.79],[1600,1.0],[1800,1.3],[2000,1.6]].forEach(([r,l])=>mat("beton",`Leichtbeton ρ ${r}`,r,l,[70,150],1000,"#c3c6c1"));
// Mauerwerk einschließlich Mörtelfugen
[[1200,.50],[1400,.58],[1600,.68],[1800,.81],[2000,.96],[2200,1.2]].forEach(([r,l])=>mat("mauer",`Vollziegel / Hochlochziegel ρ ${r}`,r,l,[5,10],840,"#c96f4a"));
[[1800,.81],[2000,.96],[2200,1.2],[2400,1.4]].forEach(([r,l])=>mat("mauer",`Vollklinker / Hochlochklinker ρ ${r}`,r,l,[50,100],900,"#a9553a"));
[[600,.28],[800,.34],[1000,.40]].forEach(([r,l])=>mat("mauer",`Hochlochziegel Lochung A/B, Leichtmörtel ρ ${r}`,r,l,[5,10],840,"#d98a62"));
[[700,.21],[800,.23],[900,.24]].forEach(([r,l])=>mat("mauer",`Leichthochlochziegel W, Leichtmörtel ρ ${r}`,r,l,[5,10],840,"#e0a27e"));
[[1000,.50],[1200,.56],[1400,.70]].forEach(([r,l])=>mat("mauer",`Kalksandstein ρ ${r}`,r,l,[5,10],880,"#d7d3c7"));
[[1600,.79],[1800,.99],[2000,1.1],[2200,1.3]].forEach(([r,l])=>mat("mauer",`Kalksandstein ρ ${r}`,r,l,[15,25],880,"#cfcabd"));
[[400,.13],[500,.16],[600,.19],[800,.25]].forEach(([r,l])=>mat("mauer",`Porenbeton-Planstein ρ ${r}`,r,l,[5,10],1050,"#e5e1d8"));
[[600,.29],[800,.35],[1000,.45],[1200,.53]].forEach(([r,l])=>mat("mauer",`Hohlblockstein Leichtbeton ρ ${r}`,r,l,[5,10],1050,"#bfc2bb"));
// Wärmedämmstoffe
[30,35,40,45,50].forEach(w=>mat("daemm",`Mineralwolle WLG 0${w}`,[15,200],w/1000,1,920,"#e9d36b"));
[32,35,40].forEach(w=>mat("daemm",`Polystyrol expandiert (EPS) WLG 0${w}`,[15,30],w/1000,[20,100],1500,"#f4f4f2"));
[30,35,40].forEach(w=>mat("daemm",`Polystyrol extrudiert (XPS) WLG 0${w}`,[25,45],w/1000,[80,250],1250,"#a8d1e7"));
[25,30].forEach(w=>mat("daemm",`Polyurethan (PUR) WLG 0${w}`,30,w/1000,[40,200],1400,"#f3e3a1"));
[40,50].forEach(w=>mat("daemm",`Schaumglas WLG 0${w}`,[100,160],w/1000,"dicht",1000,"#5c6466"));
[40,45,50].forEach(w=>mat("daemm",`Expandierter Kork WLG 0${w}`,[55,130],w/1000,[5,10],1880,"#9a6b3f"));
[40,45,50].forEach(w=>mat("daemm",`Holzfaserdämmplatte WLG 0${w}`,[120,280],w/1000,[3,10],2700,"#b98b52"));
[38,40].forEach(w=>mat("daemm",`Holzfaser-Einblasdämmung WLG 0${w}`,[35,45],w/1000,[1,3],2100,"#c9a273"));
mat("daemm","Hanf",[20,25],0.040,[1,2],1550,"#bfb27a");
mat("daemm","Zellulose",[35,70],0.040,[1,2],2100,"#d8d2c4");
mat("daemm","Stroh (Matten)",[150,400],[0.09,0.13],[2,5],2100,"#e3c770");
mat("daemm","Wolle",20,[0.034,0.040],[1,2],1300,"#ede6da");
mat("daemm","Perlit (Schüttung)",[50,100],[0.045,0.07],[2,3],900,"#e9ece9");
mat("daemm","Holzwolle-Leichtbauplatte",[360,480],[0.07,0.08],[2,5],2100,"#c7a77a");
// Holz und Holzwerkstoffe
mat("holz","Hartholz (Buche)",700,0.18,[50,200],2000,"#b07d4f");
mat("holz","Weichholz (Fichte)",500,0.13,[20,50],2700,"#d2a96e");
mat("holz","OSB-Platte",650,0.13,[30,50],2100,"#c8a060");
[[300,.09,[50,150]],[500,.13,[70,200]],[700,.17,[90,200]],[1000,.24,[110,250]]].forEach(([r,l,m])=>mat("holz",`Sperrholz ρ ${r}`,r,l,m,1900,"#d4b07c"));
[[300,.1,[10,50]],[600,.14,[15,50]],[900,.18,[20,50]]].forEach(([r,l,m])=>mat("holz",`Spanplatte ρ ${r}`,r,l,m,1800,"#c9ab82"));
// Sonstige Stoffe
mat("sonst","Keramikplatten, Fliesen",2300,1.3,"dicht",900,"#e4e0d6");
mat("sonst","Glas",2500,1,"dicht",840,"#cfe8ef");
mat("sonst","Stahl",7800,50,"dicht",500,"#8d9599");
mat("sonst","Aluminium",2700,200,"dicht",900,"#c4cacd");
mat("sonst","Kupfer",8900,380,"dicht",385,"#c4703e");
mat("sonst","Zink",7200,110,"dicht",385,"#a9b1b4");
mat("sonst","Blei",11300,35,"dicht",131,"#7c8285");
mat("sonst","Luft (ruhend)",1.293,0.025,1,1000,"#e8f1fb");
mat("sonst","Wasser",1000,0.64,null,4180,"#9cc8ef");
mat("sonst","Edelgas Krypton",3.56,0.010,1,248,"#e8f1fb");
// Ergänzung (nicht in Tabelle 5.3)
mat("extra","Luftschicht ruhend 4 cm (R = 0,18)",1.293,0.222,1,1000,"#dbeafe","EN ISO 6946");
let OWN=[];   // aus der Datenbank (db)
const allMats=()=>FS.concat(OWN);
const findMat=(pre,rho)=>FS.find(m=>m.n.startsWith(pre)&&(rho==null||m.rho.v===rho));
function layerFrom(m,d){return{mk:m.key,n:m.n.replace(/ ρ \d+$/,""),d,l:m.l.v,rho:m.rho.v,c:m.c??1000,cAss:m.c==null,mu:m.mu.lo,muLo:m.mu.lo,muHi:m.mu.hi,col:m.col,p:(KAT[m.kat]||KAT.eigen).p}}
function unfavMu(L){
  if(!L.length)return L;let k=0,rm=-1;L.forEach((s,i)=>{const r=(s.d/100)/s.l;if(r>rm){rm=r;k=i}});
  L.forEach((s,i)=>{s.mu=i<k?s.muLo:s.muHi});return L;
}
const skizze=()=>unfavMu([layerFrom(findMat("Lehmoberputz"),2),layerFrom(findMat("Vollziegel",1800),32),layerFrom(findMat("Mineralwolle WLG 040"),15),layerFrom(findMat("Kalkputz"),2)]);
const bestand=()=>unfavMu([layerFrom(findMat("Lehmoberputz"),2),layerFrom(findMat("Vollziegel",1800),32),layerFrom(findMat("Kalkputz"),2)]);

/* ---------- Physik ---------- */
const ps=th=>th>=0?610.5*Math.exp(17.269*th/(237.3+th)):610.5*Math.exp(21.875*th/(265.5+th));
function dew(pv){const lnr=Math.log(pv/610.5);return{lnr,ts:pv>=610.5?237.3*lnr/(17.269-lnr):265.5*lnr/(21.875-lnr)}}
// komplexe Zahlen als [re,im]
const cm=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]], ca=(a,b)=>[a[0]+b[0],a[1]+b[1]], cab=a=>Math.hypot(a[0],a[1]), carg=a=>Math.atan2(a[1],a[0]);
const app=(Z,v)=>[ca(cm(Z[0][0],v[0]),cm(Z[0][1],v[1])),ca(cm(Z[1][0],v[0]),cm(Z[1][1],v[1]))];
function dyn(L,rsi,rse){
  // EN ISO 13786: Wärmeübertragungsmatrizen, Periode 24 h; Zustandsvektor [θ, q], q von innen nach außen
  const P=86400;let v=[[0,0],[1,0]];const Rm=r=>[[[1,0],[-r,0]],[[0,0],[1,0]]];
  v=app(Rm(rsi),v);const tsi=v[0];const lay=[];
  L.forEach(s=>{const d=s.d/100;if(!(d>0&&s.l>0&&s.rho>0&&s.c>0)){lay.push(null);return}
    const dl=Math.sqrt(s.l*P/(Math.PI*s.rho*s.c)),x=d/dl,ch=Math.cosh(x),sh=Math.sinh(x),co=Math.cos(x),si=Math.sin(x);
    const z11=[ch*co,sh*si],k=-dl/(2*s.l),z12=[k*(sh*co+ch*si),k*(ch*si-sh*co)],k2=-s.l/dl,z21=[k2*(sh*co-ch*si),k2*(sh*co+ch*si)];
    v=app([[z11,z12],[z21,z11]],v);lay.push({delta:dl,xi:x});});
  const tse=v[0];v=app(Rm(rse),v);const te=v[0];
  const tav=cab(tsi)/cab(tse);let ph=carg(tse)-carg(tsi);ph=((ph%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
  return{tav,nu:1/tav,ph:ph*P/(2*Math.PI)/3600,Yabs:1/cab(te),lay};
}
function glaser(L,G){
  const segs=[];let sd=0,Rc=G.rsi;
  L.forEach(s=>{const d=Math.max(0,s.d)/100,sdl=s.mu*d,R=d/s.l;segs.push({sd0:sd,sd1:sd+sdl,R0:Rc,R1:Rc+R});sd+=sdl;Rc+=R});
  const RT=Rc+G.rse,sdT=sd;
  const tmp=(ti,te,Rp)=>ti-(ti-te)*Rp/RT;
  const Rat=x=>{for(const g of segs){if(x<=g.sd1+1e-12)return g.sd1-g.sd0<1e-12?g.R1:g.R0+(x-g.sd0)/(g.sd1-g.sd0)*(g.R1-g.R0)}return Rc};
  const pts=[];const N=16;
  segs.forEach(g=>{if(g.sd1-g.sd0<1e-12){pts.push({x:g.sd0,y:ps(tmp(G.ti,G.te,g.R1))});return}
    for(let k=0;k<=N;k++){const x=g.sd0+(g.sd1-g.sd0)*k/N;pts.push({x,y:ps(tmp(G.ti,G.te,g.R0+(g.R1-g.R0)*k/N))})}});
  // gleiche x zusammenfassen (kleinster p_s zählt)
  const S=[];pts.forEach(p=>{const l=S[S.length-1];if(l&&Math.abs(l.x-p.x)<1e-12)l.y=Math.min(l.y,p.y);else S.push({...p})});
  const pi=G.phii*ps(G.ti),pe=G.phie*ps(G.te),tsi=tmp(G.ti,G.te,G.rsi),psSi=ps(tsi);
  const res={segs,S,pi,pe,sdT,RT,tsi,surf:pi>=psSi,cond:false,hull:[{x:0,y:pi},{x:sdT,y:pe}],Mc:0,Mev:0};
  if(res.surf||sdT<=0||!S.length)return res;
  const all=[{x:0,y:pi},...S.filter(p=>p.x>1e-12&&p.x<sdT-1e-12),{x:sdT,y:pe}];
  const cr=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);const H=[];
  all.forEach(p=>{while(H.length>=2&&cr(H[H.length-2],H[H.length-1],p)<=0)H.pop();H.push(p)});
  res.hull=H;const inner=H.slice(1,-1);
  if(!inner.length)return res;
  res.cond=true;const x1=inner[0].x,x2=inner[inner.length-1].x,p1=inner[0].y,p2=inner[inner.length-1].y;
  const Z=s=>1.5e6*Math.max(s,1e-9);
  const gin=(pi-p1)/Z(x1),gout=(p2-pe)/Z(sdT-x2),Mc=Math.max(0,(gin-gout)*G.t);
  const t1=tmp(G.eti,G.ete,Rat(x1)),t2=tmp(G.eti,G.ete,Rat(x2));
  const pie=G.ephii*ps(G.eti),pee=G.ephie*ps(G.ete),pz1=ps(t1),pz2=ps(t2);
  const gev=(pz1-pie)/Z(x1)+(pz2-pee)/Z(sdT-x2),Mev=Math.max(0,gev*G.et);
  const li=segs.findIndex(g=>x1<=g.sd1+1e-12),lj=segs.findIndex(g=>x2<=g.sd1+1e-12);
  Object.assign(res,{x1,x2,p1,p2,gin,gout,Mc,gev,Mev,pie,pee,pz1,pz2,t1,t2,li,lj});
  return res;
}
const DEF_G={ti:20,phii:.5,te:-5,phie:.8,rsi:.25,rse:.04,t:2160,eti:20,ephii:.5,ete:12,ephie:.7,et:2160};
const DEF_P={ti:20,te:-10,rsi:.13,rse:.04,umax:.24,phi:.5,g:DEF_G,dT:3,A:120,G:3170,price:.12};
function compute(L,P){
  const R=L.map(s=>(s.d/100)/s.l),Rl=R.reduce((a,b)=>a+b,0),RT=P.rsi+Rl+P.rse,U=1/RT,q=U*(P.ti-P.te);
  const T=[P.ti];let t=P.ti-q*P.rsi;T.push(t);R.forEach(r=>{t-=q*r;T.push(t)});
  const psi=ps(P.ti),pv=P.phi*psi,{lnr,ts}=dew(pv);
  let where=null;
  if(T[1]<=ts)where={layer:0,depth:0};
  else{let x=0;for(let i=0;i<L.length;i++){const a=T[i+1],b=T[i+2],d=Math.max(0,L[i].d);if(a>ts&&b<=ts){where={layer:i+1,into:(a-ts)/(a-b)*d,depth:x+(a-ts)/(a-b)*d};break}x+=d}}
  const m=L.map(s=>s.rho*s.d/100),mTot=m.reduce((a,b)=>a+b,0);
  let kSw=0;while(kSw<L.length&&L[kSw].l>=0.1)kSw++;
  const Qs=L.map((s,i)=>m[i]*s.c*P.dT),QsW=Qs.slice(0,kSw).reduce((a,b)=>a+b,0);
  const sd=L.map(s=>s.mu*s.d/100);
  return{R,Rl,RT,U,q,T,psi,pv,lnr,ts,where,m,mTot,kSw,Qs,QsW,sd,sdT:sd.reduce((a,b)=>a+b,0),
    gl:glaser(L,P.g),dy:L.length?dyn(L,P.rsi,P.rse):null,
    Qdot:U*P.A*(P.ti-P.te),Qa:U*P.A*P.G*24/1000,cost:U*P.A*P.G*24/1000*P.price};
}

/* ---------- Aufgaben-Bausteine (Üben + Lehrkraft) ---------- */
const TOPICS=[["R","Schichtwiderstände \\(R_n\\)"],["U","\\(R_T\\) und \\(U\\)"],["T","Temperaturen \\(\\theta\\)"],["TP","Taupunkt \\(\\theta_s\\)"],["G","Glaser, \\(s_d\\)-Werte"],["S","Wärmespeicher \\(Q'\\)"],["V","Wärmeverlust \\(\\dot Q\\), \\(Q_a\\)"],["D","TAV und \\(\\varphi\\) (Text)"]];
function genWall(seed,level){
  const r=mulberry32(seed),pk=a=>a[Math.floor(r()*a.length)];
  const Ls=[];
  Ls.push(layerFrom(pk([findMat("Gipsputz"),findMat("Kalkputz"),findMat("Lehmoberputz")]),pk([1,1.5,2])));
  const zwei=level===3&&r()<0.45;
  if(zwei){
    Ls.push(layerFrom(findMat("Kalksandstein",pk([1600,1800,2000])),pk([17.5,24])));
    Ls.push(layerFrom(pk([findMat("Mineralwolle WLG 035"),findMat("Mineralwolle WLG 040")]),pk([10,12,14,16])));
    Ls.push(layerFrom(findMat("Luftschicht"),4));
    Ls.push(layerFrom(findMat("Vollklinker",pk([1800,2000])),11.5));
  }else{
    const mas=pk([findMat("Vollziegel",1800),findMat("Vollziegel",1400),findMat("Hochlochziegel Lochung",800),findMat("Kalksandstein",1800),findMat("Porenbeton",500),findMat("Stahlbeton"),findMat("Leichtbeton",1200),findMat("Hohlblockstein",800)]);
    Ls.push(layerFrom(mas,mas.kat==="beton"?pk([18,20,25]):pk([17.5,24,30,36.5])));
    if(level>=2||r()<0.35)Ls.push(layerFrom(pk([findMat("Mineralwolle WLG 035"),findMat("Mineralwolle WLG 040"),findMat("Polystyrol expandiert (EPS) WLG 035"),findMat("Holzfaserdämmplatte WLG 040"),findMat("Holzfaserdämmplatte WLG 045")]),pk([8,10,12,14,16,18,20])));
    Ls.push(layerFrom(pk([findMat("Kalkputz"),findMat("Zementputz")]),pk([1.5,2])));
  }
  unfavMu(Ls);
  const P={...DEF_P,g:{...DEF_G}};
  if(level>1){P.ti=pk([20,21,22]);P.te=pk([-5,-8,-10,-12,-15]);P.phi=pk([.45,.5,.55,.6])}
  P.A=pk([20,25,30,40,60,120]);
  return{L:Ls,P,seed,level};
}
function genTasks(W,topics,rnd){
  const r=compute(W.L,W.P),Ls=W.L,P=W.P,T=[],pk=a=>a[Math.floor(rnd()*a.length)];
  const lbl=i=>`Schicht ${i+1} (${Ls[i].n})`;
  const add=o=>T.push({tol:.02,pts:2,kind:"num",...o});
  if(topics.R)Ls.forEach((s,i)=>add({q:`Berechnen Sie den Wärmedurchlasswiderstand \\(R_{${i+1}}\\) von ${lbl(i)}.`,ans:r.R[i],unit:"\\(\\mathrm{m^2K/W}\\)",pts:1,
    sol:`\\(R_{${i+1}} = \\frac{d}{\\lambda} = \\frac{${n_(s.d/100,3)}\\,\\mathrm{m}}{${n_(s.l,3)}\\,\\mathrm{W/(m\\,K)}} = ${n_(r.R[i],3)}${sR}\\)`}));
  if(topics.U){
    add({q:`Berechnen Sie den Wärmedurchgangswiderstand \\(R_T\\) der Wand (Wärmestrom horizontal: \\(R_{si}=${n_(P.rsi,2)}\\), \\(R_{se}=${n_(P.rse,2)}\\,\\mathrm{m^2K/W}\\)).`,ans:r.RT,unit:"\\(\\mathrm{m^2K/W}\\)",
      sol:`\\(R_T = ${[n_(P.rsi,2),...r.R.map(x=>n_(x,3)),n_(P.rse,2)].join(" + ")} = ${n_(r.RT,3)}${sR}\\)`});
    add({q:`Berechnen Sie den U-Wert der Wand.`,ans:r.U,unit:"\\(\\mathrm{W/(m^2K)}\\)",sol:`\\(U = \\frac{1}{R_T} = \\frac{1}{${n_(r.RT,3)}} = ${n_(r.U,3)}${sU}\\)`});
    add({kind:"sel",q:`Erfüllt die Wand den Zielwert \\(U \\le 0{,}24\\,\\mathrm{W/(m^2K)}\\)?`,opts:["ja","nein"],ans:r.U<=0.24?0:1,pts:1,sol:`\\(${n_(r.U,3)} ${r.U<=0.24?"\\le":">"} 0{,}24\\) → ${r.U<=0.24?"ja":"nein"}`});
  }
  if(topics.T){
    add({q:`Berechnen Sie die Oberflächentemperatur innen \\(\\theta_{si}\\) bei \\(\\theta_i = ${n_(P.ti,0)}\\,^\\circ\\mathrm{C}\\) und \\(\\theta_e = ${n_(P.te,0)}\\,^\\circ\\mathrm{C}\\).`,ans:r.T[1],unit:"\\(^\\circ\\mathrm{C}\\)",atol:.2,
      sol:`\\(q = U\\cdot\\Delta\\theta = ${n_(r.U,3)} \\cdot ${n_(P.ti-P.te,0)} = ${n_(r.q,2)}\\,\\mathrm{W/m^2}\\); \\(\\theta_{si} = ${n_(P.ti,0)} - ${n_(r.q,2)} \\cdot ${n_(P.rsi,2)} = ${n_(r.T[1],1)}${sC}\\)`});
    if(Ls.length>1){const k=pk(Ls.slice(0,-1).map((_,i)=>i));const Rs=P.rsi+r.R.slice(0,k+1).reduce((a,b)=>a+b,0);
      add({q:`Berechnen Sie die Temperatur in der Grenzfläche zwischen Schicht ${k+1} und Schicht ${k+2}.`,ans:r.T[k+2],unit:"\\(^\\circ\\mathrm{C}\\)",atol:.2,
        sol:`\\(\\theta_{${k+1}} = \\theta_i - q\\cdot(R_{si}${r.R.slice(0,k+1).map((_,j)=>`+R_{${j+1}}`).join("")}) = ${n_(P.ti,0)} - ${n_(r.q,2)}\\cdot ${n_(Rs,3)} = ${n_(r.T[k+2],1)}${sC}\\)`});}
  }
  if(topics.TP){
    add({q:`Bestimmen Sie die Taupunkttemperatur \\(\\theta_s\\) der Raumluft (\\(\\theta_i = ${n_(P.ti,0)}\\,^\\circ\\mathrm{C}\\), \\(\\varphi_i = ${n_(P.phi*100,0)}\\,\\%\\)).`,ans:r.ts,unit:"\\(^\\circ\\mathrm{C}\\)",atol:.4,
      sol:`\\(p_s = ${n_(r.psi,0)}\\,\\mathrm{Pa}\\), \\(p = ${n_(P.phi,2)}\\cdot${n_(r.psi,0)} = ${n_(r.pv,0)}\\,\\mathrm{Pa}\\) → \\(\\theta_s = ${n_(r.ts,1)}${sC}\\) (Magnus-Formel oder h,x-Diagramm)`});
    const opts=[...Ls.map((s,i)=>`Schicht ${i+1} (${s.n})`),"keine Taupunktebene"];
    const a=r.where?(r.where.layer>0?r.where.layer-1:0):Ls.length;
    add({kind:"sel",q:`In welcher Schicht liegt die Taupunktebene?`,opts,ans:a,pts:1,sol:r.where&&r.where.layer?`Die Temperatur fällt in Schicht ${r.where.layer} unter \\(${n_(r.ts,1)}\\,^\\circ\\mathrm{C}\\), \\(${n_(r.where.depth,1)}\\,\\mathrm{cm}\\) von der Innenoberfläche.`:"Die Wand wird nirgends kälter als θs."});
  }
  if(topics.G){
    const k=pk(Ls.map((_,i)=>i)),s=Ls[k];
    add({q:`Berechnen Sie den \\(s_d\\)-Wert von ${lbl(k)} mit \\(\\mu = ${n_(s.mu,0)}\\).`,ans:r.sd[k],unit:"\\(\\mathrm{m}\\)",pts:1,sol:`\\(s_d = \\mu\\cdot d = ${n_(s.mu,0)}\\cdot ${n_(s.d/100,3)}\\,\\mathrm{m} = ${n_(r.sd[k],3)}\\,\\mathrm{m}\\)`});
    add({q:`Berechnen Sie den gesamten \\(s_d\\)-Wert der Wand.`,ans:r.sdT,unit:"\\(\\mathrm{m}\\)",sol:`\\(s_{d,T} = ${r.sd.map(x=>n_(x,3)).join(" + ")} = ${n_(r.sdT,3)}\\,\\mathrm{m}\\)`});
    add({kind:"sel",q:`Fällt nach dem Glaser-Verfahren (Tauperiode: innen \\(20\\,^\\circ\\mathrm{C}\\) / \\(50\\,\\%\\), außen \\(-5\\,^\\circ\\mathrm{C}\\) / \\(80\\,\\%\\), \\(R_{si} = 0{,}25\\)) Tauwasser im Bauteil aus?`,opts:["ja","nein"],ans:r.gl.cond||r.gl.surf?0:1,pts:2,
      sol:r.gl.cond?`Ja: \\(M_c = ${n_(r.gl.Mc,3)}\\,\\mathrm{kg/m^2}\\) ${r.gl.Mc<=1?"(\\(\\le 1{,}0\\,\\mathrm{kg/m^2}\\), zulässig, wenn es verdunstet)":"(\\(> 1{,}0\\,\\mathrm{kg/m^2}\\), unzulässig)"}.`:"Nein: Die Gerade \\(p_i \\to p_e\\) bleibt unter der \\(p_s\\)-Kurve."});
  }
  if(topics.S){
    const k=0,s=Ls[1]||Ls[0],ki=Ls[1]?1:0;
    add({q:`Berechnen Sie die flächenbezogene Masse \\(m'\\) von ${lbl(ki)} (\\(\\rho = ${n_(s.rho,0)}\\,\\mathrm{kg/m^3}\\)).`,ans:r.m[ki],unit:"\\(\\mathrm{kg/m^2}\\)",sol:`\\(m' = d\\cdot\\rho = ${n_(s.d/100,3)}\\cdot${n_(s.rho,0)} = ${n_(r.m[ki],1)}\\,\\mathrm{kg/m^2}\\)`});
    add({q:`Berechnen Sie die speicherwirksame Wärmemenge \\(Q'\\) aller Schichten mit \\(\\lambda \\ge 0{,}1\\) zwischen Raum und Dämmung für \\(\\Delta T = ${n_(P.dT,0)}\\,\\mathrm{K}\\).`,ans:r.QsW/1000,unit:"\\(\\mathrm{kJ/m^2}\\)",pts:3,
      sol:Ls.slice(0,r.kSw).map((s,i)=>`\\(Q'_{${i+1}} = ${n_(r.m[i],1)}\\cdot${n_(s.c,0)}\\cdot${n_(P.dT,0)} = ${n_(r.Qs[i]/1000,0)}\\,\\mathrm{kJ/m^2}\\)`).join("; ")+`; Summe \\(Q' = ${n_(r.QsW/1000,0)}\\,\\mathrm{kJ/m^2}\\)`});
  }
  if(topics.V){
    add({q:`Berechnen Sie die Verlustleistung \\(\\dot Q\\) einer Wandfläche von \\(A = ${n_(P.A,0)}\\,\\mathrm{m^2}\\) bei \\(\\theta_i = ${n_(P.ti,0)}\\,^\\circ\\mathrm{C}\\) und \\(\\theta_e = ${n_(P.te,0)}\\,^\\circ\\mathrm{C}\\).`,ans:r.Qdot,unit:"\\(\\mathrm{W}\\)",
      sol:`\\(\\dot Q = U\\cdot A\\cdot\\Delta\\theta = ${n_(r.U,3)}\\cdot${n_(P.A,0)}\\cdot${n_(P.ti-P.te,0)} = ${n_(r.Qdot,0)}\\,\\mathrm{W}\\)`});
    add({q:`Berechnen Sie den Jahreswärmeverlust dieser Fläche bei \\(G = ${n_(P.G,0)}\\,\\mathrm{Kd/a}\\).`,ans:r.Qa,unit:"\\(\\mathrm{kWh/a}\\)",
      sol:`\\(Q_a = U\\cdot A\\cdot G\\cdot 24 / 1000 = ${n_(r.U,3)}\\cdot${n_(P.A,0)}\\cdot${n_(P.G,0)}\\cdot 24/1000 = ${n_(r.Qa,0)}\\,\\mathrm{kWh/a}\\)`});
  }
  if(topics.D){
    const ins=Ls.findIndex(s=>s.l<0.1);
    T.push({kind:"text",pts:3,q:ins>=0?`Die Dämmung liegt ${ins>=Ls.length/2?"außen":"innen"}. Erklären Sie, wie sich die Lage der Dämmung auf Wärmespeicherfähigkeit, Amplitudendämpfung (TAV) und Phasenverschiebung auswirkt.`:"Erklären Sie, welche Bedeutung die Wärmespeicherfähigkeit dieser massiven Wand für den sommerlichen Wärmeschutz hat.",
      sol:`Außendämmung: Putz und Mauerwerk liegen auf der warmen Seite und speichern Wärme; große Amplitudendämpfung (kleiner TAV) und große Phasenverschiebung. Innendämmung: nur der Innenputz speichert; geringe Dämpfung und kleine Phasenverschiebung. Rechenwert dieser Wand: \\(\\varphi \\approx ${n_(r.dy.ph,1)}\\,\\mathrm{h}\\), TAV \\(\\approx ${n_(r.dy.tav,4)}\\).`});
  }
  return T;
}
function wallTable(W,cols){
  let h=`<div class="tbl"><table class="mini"><thead><tr><th>Nr.</th><th>Baustoff (innen → außen)</th><th class="r">\\(d\\) in cm</th><th class="r">\\(\\lambda\\) in \\(\\mathrm{W/(m\\,K)}\\)</th>${cols.rho?`<th class="r">\\(\\rho\\) in \\(\\mathrm{kg/m^3}\\)</th><th class="r">\\(c\\) in \\(\\mathrm{J/(kg\\,K)}\\)</th>`:""}${cols.mu?`<th class="r">\\(\\mu\\)</th>`:""}</tr></thead><tbody>`;
  W.L.forEach((s,i)=>h+=`<tr><td class="num">${i+1}</td><td>${esc(s.n)}</td><td class="r num">${fmt(s.d,1)}</td><td class="r num">${fmt(s.l,3)}</td>${cols.rho?`<td class="r num">${fmt(s.rho,0)}</td><td class="r num">${fmt(s.c,0)}</td>`:""}${cols.mu?`<td class="r num">${fmt(s.mu,0)}</td>`:""}</tr>`);
  return h+`</tbody></table></div><p class="c">Raumluft \\(\\theta_i = ${n_(W.P.ti,0)}\\,^\\circ\\mathrm{C}\\), \\(\\varphi_i = ${n_(W.P.phi*100,0)}\\,\\%\\); Außenluft \\(\\theta_e = ${n_(W.P.te,0)}\\,^\\circ\\mathrm{C}\\); \\(R_{si} = ${n_(W.P.rsi,2)}\\), \\(R_{se} = ${n_(W.P.rse,2)}\\,\\mathrm{m^2K/W}\\).</p>`;
}
