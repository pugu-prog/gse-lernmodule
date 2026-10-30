/* Speichermodell für Schicht- und Solarspeicher: senkrechter Zylinder in N Wasserschichten (Index 0 = unten).
   Physik: Auftrieb (wärmere Schicht unter kälterer mischt sofort), Wärmeleitung zwischen Schichten,
   Wärmeverlust über die Dämmung, Pfropfenströmung beim Zapfen und Laden. Braucht core.js. */
const RHO_C=4190;   // J/(kg·K), 1 kg pro Liter (Formelsammlung/Skript: c = 4190 J/(kg·K))
class Tank{
  constructor(V,o={}){
    this.V=V;this.N=o.N||40;this.v=V/this.N;this.Tk=o.Tk??10;this.Tamb=o.Tamb??18;this.U=o.U??0.35;this.lam=o.lam??1.2;
    const D=Math.cbrt(4*V/1000/(Math.PI*2.4));this.D=D;this.H=2.4*D;this.dz=this.H/this.N;
    this.Ax=Math.PI*D*D/4;this.Aside=Math.PI*D*this.dz;this.C=this.v*RHO_C;
    this.T=new Float64Array(this.N).fill(o.T0??this.Tk);this.Qloss=0;
  }
  set(f){for(let i=0;i<this.N;i++)this.T[i]=f(i/(this.N-1));return this}
  mean(){return this.T.reduce((a,b)=>a+b,0)/this.N}
  energy(Tref=this.Tk){return this.T.reduce((a,t)=>a+this.C*(t-Tref),0)}            // J
  hotVolume(Tmin=45){let n=0;for(let i=this.N-1;i>=0&&this.T[i]>=Tmin;i--)n++;return n*this.v}   // Liter ≥ Tmin von oben
  mixedVolume(Tz=45){let s=0;for(const t of this.T)if(t>=Tz)s+=this.v*(t-this.Tk)/(Tz-this.Tk);return s} // Liter mit Tz nach Mischventil
  stabilize(){ // Auftrieb: wärmeres Wasser steigt als Strömung auf, bis es auf gleich warmes trifft (Schichten nach Temperatur ordnen)
    for(let i=1;i<this.N;i++)if(this.T[i-1]>this.T[i]+1e-9){this.T.sort();return}
  }
  conduct(dt){ // Wärmeleitung (Wasser + Behälterwand) und Verluste
    const T=this.T,N=this.N,g=this.lam*this.Ax/this.dz,q=new Float64Array(N);
    for(let i=0;i<N-1;i++){const f=g*(T[i+1]-T[i]);q[i]+=f;q[i+1]-=f}
    let loss=0;for(let i=0;i<N;i++){let A=this.Aside;if(i===0||i===N-1)A+=this.Ax;const l=this.U*A*(T[i]-this.Tamb);q[i]-=l;loss+=l}
    for(let i=0;i<N;i++)T[i]+=q[i]*dt/this.C;this.Qloss+=loss*dt;
  }
  heat(z0,z1,P,dt,Tmax=95){ // Wärme in die Schichten der Höhe z0..z1 (0..1), z. B. Rohrwärmetauscher
    const i0=Math.floor(z0*(this.N-1)),i1=Math.ceil(z1*(this.N-1)),n=i1-i0+1;
    for(let i=i0;i<=i1;i++)this.T[i]=Math.min(Tmax,this.T[i]+P*dt/(this.C*n));
    this.stabilize();
  }
  _shift(lo,hi,vol,Tin,up){ // Pfropfenströmung im Bereich lo..hi, Eintritt unten (up) oder oben
    let out=0,rest=vol;const T=this.T;
    while(rest>1e-9){const s=Math.min(rest,this.v),f=s/this.v;
      if(up){out+=s*T[hi];for(let i=hi;i>lo;i--)T[i]+=f*(T[i-1]-T[i]);T[lo]+=f*(Tin-T[lo])}
      else{out+=s*T[lo];for(let i=lo;i<hi;i++)T[i]+=f*(T[i+1]-T[i]);T[hi]+=f*(Tin-T[hi])}
      rest-=s}
    return vol>0?out/vol:Tin;   // mittlere Austrittstemperatur
  }
  draw(vol){const t=this._shift(0,this.N-1,vol,this.Tk,true);this.stabilize();return t}       // Zapfen oben, Kaltwasser unten
  chargeTop(vol,Tin){const t=this._shift(0,this.N-1,vol,Tin,false);this.stabilize();return t} // Laden oben, Rücklauf unten
  lance(vol,Tin){ // Schichtenlanze: Eintritt in der Schicht mit passender Temperatur, Rücklauf unten
    let k=0;for(let i=0;i<this.N;i++)if(this.T[i]<=Tin)k=i;
    const t=this._shift(0,k,vol,Tin,false);this.stabilize();return t}
  mixAll(){const m=this.mean();this.T.fill(m)}
}
/* Farbe für Wassertemperatur 10 … 75 °C */
function wcol(t){const x=Math.max(0,Math.min(1,(t-10)/65)),s=[[37,99,235],[125,180,230],[245,206,120],[226,96,40],[176,32,24]];
  const p=x*(s.length-1),i=Math.min(s.length-2,Math.floor(p)),f=p-i;return`rgb(${s[i].map((k,j)=>Math.round(k+(s[i+1][j]-k)*f)).join(",")})`}
/* Speicher als SVG zeichnen. o: {x,y,w,h, sensors:[z...], labels:true} -> SVG-String */
function tankSVG(tank,o){
  const{x,y,w,h}=o,N=tank.N,lh=h/N;let s=`<rect x="${x-6}" y="${y-6}" width="${w+12}" height="${h+12}" rx="${w/3}" fill="var(--line)"/>`;
  s+=`<clipPath id="tc${o.id||0}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w/3.4}"/></clipPath><g clip-path="url(#tc${o.id||0})">`;
  for(let i=0;i<N;i++)s+=`<rect x="${x}" y="${(y+h-(i+1)*lh).toFixed(2)}" width="${w}" height="${(lh+.6).toFixed(2)}" fill="${wcol(tank.T[i])}"/>`;
  s+=`</g>`;
  (o.sensors||[]).forEach(z=>{const i=Math.round(z*(N-1)),yy=y+h-(i+.5)*lh;s+=`<line x1="${x+w}" x2="${x+w+14}" y1="${yy}" y2="${yy}" stroke="var(--ink)"/><text x="${x+w+18}" y="${yy+4}" font-size="12" fill="var(--ink)">${fmt(tank.T[i],1)} °C</text>`});
  return s;
}
function colorScaleSVG(x,y,w){let s="";for(let i=0;i<=40;i++)s+=`<rect x="${x+i*w/41}" y="${y}" width="${w/41+.5}" height="8" fill="${wcol(10+65*i/40)}"/>`;
  return s+`<text x="${x}" y="${y+22}" font-size="10" fill="var(--muted)">10 °C</text><text x="${x+w}" y="${y+22}" text-anchor="end" font-size="10" fill="var(--muted)">75 °C</text>`}
