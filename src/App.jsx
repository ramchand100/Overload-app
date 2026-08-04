import { useState, useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import { useData } from "./useData";

/* ── Icons ── */
const TI = {
  home:(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>),
  progress:(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>),
  profile:(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>),
  trophy:(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h12v9a6 6 0 01-12 0V2z"/><path d="M6 7H2a2 2 0 000 4h4"/><path d="M18 7h4a2 2 0 010 4h-4"/><path d="M12 17v4"/><path d="M8 21h8"/></svg>),
  logout:(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
  mail:(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>),
  doc:(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>),
  shield:(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
  trash:(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>),
  megaphone:(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>),
  chevron:(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9,18 15,12 9,6"/></svg>),
  edit:(<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  plus:(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  bell:(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>),
  weight:(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>),
  google:(<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>),
};

/* ── Mini line graph ── */
const MiniGraph = ({ data }) => {
  if(!data||data.length<2) return <div style={{height:60,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--ink3)",fontSize:12}}>Log more sessions to see your curve</div>;
  const W=280,H=60,pad=8;
  const vals=data.map(d=>d.kg);
  const min=Math.min(...vals),max=Math.max(...vals),range=max-min||1;
  const pts=vals.map((v,i)=>[pad+(i/(vals.length-1))*(W-pad*2),H-pad-((v-min)/range)*(H-pad*2)]);
  let d=`M ${pts[0]}`;
  for(let i=1;i<pts.length;i++){const[x1,y1]=pts[i-1],[x2,y2]=pts[i];d+=` Q ${(x1+x2)/2},${y1} ${x2},${y2}`;}
  return(
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs><linearGradient id="grd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2C2C2C" stopOpacity="0.08"/><stop offset="100%" stopColor="#2C2C2C" stopOpacity="0"/></linearGradient></defs>
      <path d={d+` L ${pts[pts.length-1][0]},${H} L ${pad},${H} Z`} fill="url(#grd)"/>
      <path d={d} fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round"/>
      {pts.map(([x,y],i)=>(<g key={i}><circle cx={x} cy={y} r="3.5" fill="#2C2C2C"/><text x={x} y={y-8} textAnchor="middle" fontSize="9" fill="#666" fontFamily="Inter,sans-serif" fontWeight="700">{vals[i]}</text></g>))}
    </svg>
  );
};

/* ── Calendar ── */
const CalendarView = ({ sessionLog }) => {
  const [offset, setOffset] = useState(0);
  const [selDate, setSelDate] = useState(null);
  const ref = new Date(); ref.setMonth(ref.getMonth() + offset);
  const yr = ref.getFullYear(), mo = ref.getMonth();
  const firstDay = new Date(yr, mo, 1);
  const lastDay = new Date(yr, mo+1, 0);
  const startDow = (firstDay.getDay()+6)%7;
  const sessMap = {};
  sessionLog.forEach(s=>{
    const d=new Date(s.date);
    if(d.getFullYear()===yr&&d.getMonth()===mo){const k=d.getDate();if(!sessMap[k])sessMap[k]=[];sessMap[k].push(s);}
  });
  const cells=[];
  for(let i=0;i<startDow;i++)cells.push(null);
  for(let d=1;d<=lastDay.getDate();d++)cells.push(d);
  const monthLabel=ref.toLocaleDateString("en-GB",{month:"long",year:"numeric"});
  const selSessions=selDate?sessMap[selDate]||[]:[];
  const cellsData=cells.map((d,i)=>{
    if(!d)return{d:null,i};
    const sessions=sessMap[d]||[];
    const hasFull=sessions.some(s=>!s.partial);
    const isToday=new Date().getDate()===d&&new Date().getMonth()===mo&&new Date().getFullYear()===yr;
    const isSel=selDate===d;
    return{d,i,sessions,hasFull,isToday,isSel};
  });
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <button onClick={()=>setOffset(o=>o-1)} style={{background:"var(--surface)",border:"none",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:14,color:"var(--ch)"}}>‹</button>
        <div style={{fontSize:14,fontWeight:700,color:"var(--ch)"}}>{monthLabel}</div>
        <button onClick={()=>setOffset(o=>Math.min(o+1,0))} style={{background:"var(--surface)",border:"none",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:14,color:"var(--ch)",opacity:offset===0?.3:1}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
        {["M","T","W","T","F","S","S"].map((d,i)=><div key={i} style={{textAlign:"center",fontSize:10,fontWeight:600,color:"var(--ink3)",padding:"2px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {cellsData.map(c=>!c.d?<div key={c.i}/>:(
          <div key={c.i} onClick={()=>setSelDate(c.isSel?null:c.d)}
            style={{aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",borderRadius:8,cursor:c.sessions.length>0?"pointer":"default",background:c.isSel?"var(--ch)":c.isToday?"var(--orange-l)":"transparent"}}>
            <span style={{fontSize:12,fontWeight:c.isToday?800:500,color:c.isSel?"white":c.isToday?"var(--orange)":"var(--ink2)"}}>{c.d}</span>
            {c.sessions.length>0&&<div style={{width:6,height:6,borderRadius:"50%",background:c.isSel?"white":c.hasFull?"var(--green)":"var(--orange)",marginTop:1}}/>}
          </div>
        ))}
      </div>
      {selDate&&selSessions.length>0&&(
        <div style={{marginTop:12,background:"var(--surface)",borderRadius:12,padding:12}}>
          {selSessions.map(s=>(
            <div key={s.id} style={{marginBottom:6}}>
              <div style={{fontWeight:700,fontSize:13,color:"var(--ch)"}}>{s.dayName}{s.partial?<span style={{color:"var(--orange)",fontSize:11}}> · Partial</span>:""}</div>
              <div style={{fontSize:12,color:"var(--ink3)",marginTop:2}}>{s.exercises.map(e=>e.name).join(" · ")}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Contextual line ── */
const CtxLine = ({ text, orange }) => (
  <div className={orange?"ctx-orange u1":"ctx-line u1"}>{text}</div>
);

/* ── CSS ── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#FAFAFA;--white:#FFFFFF;--surface:#F2F2F2;--surface2:#E5E5E5;
    --ink:#1A1A1A;--ink2:#4A4A4A;--ink3:#909090;--ink4:#C0C0C0;
    --border:#E0E0E0;--border2:#CECECE;--ch:#2C2C2C;
    --orange:#E8500A;--orange-l:#FEF0EC;--orange-m:#F9C5B5;
    --green:#2D7A3A;--green-l:#EAF5EC;--green-m:#A8D9AD;
    --sh:0 1px 6px rgba(0,0,0,.05),0 2px 14px rgba(0,0,0,.04);
    --sh-md:0 2px 12px rgba(0,0,0,.08),0 4px 24px rgba(0,0,0,.05);
  }
  body{background:var(--bg);color:var(--ink);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased}
  .app{max-width:390px;margin:0 auto;min-height:100vh;min-height:100dvh;background:var(--bg);display:flex;flex-direction:column;overflow:hidden}
  @keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-50px)}to{opacity:1;transform:translateY(0)}}
  @keyframes toastOut{0%{opacity:1;transform:translate(-50%,0)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-10px)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .u0{animation:up .3s ease both}.u1{animation:up .3s .06s ease both}.u2{animation:up .3s .12s ease both}
  .u3{animation:up .3s .18s ease both}.u4{animation:up .3s .24s ease both}
  .topbar{padding:16px 20px 0;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
  .back-btn{width:34px;height:34px;border-radius:50%;background:var(--surface);border:none;display:flex;align-items:center;justify-content:center;font-size:15px;cursor:pointer;color:var(--ink);font-family:'Inter',sans-serif;font-weight:600}
  .brand{font-size:19px;font-weight:800;letter-spacing:-.5px;color:var(--ch)}
  .streak-btn{display:flex;align-items:center;gap:5px;background:var(--surface);border:none;border-radius:20px;padding:7px 13px;cursor:pointer;font-family:'Inter',sans-serif}
  .streak-num{font-size:15px;font-weight:800;color:var(--ch)}
  .lbl{font-size:11px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:1.4px;margin-bottom:8px}
  .ob-prog{padding:0 20px;margin-top:14px;flex-shrink:0}
  .ob-track{height:3px;background:var(--border);border-radius:2px;overflow:hidden}
  .ob-fill{height:100%;background:var(--ch);border-radius:2px;transition:width .35s ease}
  .btn-p{width:100%;padding:16px;background:var(--ch);color:white;border:none;border-radius:100px;font-size:15px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;transition:transform .1s,opacity .1s}
  .btn-p:active{transform:scale(.98)}.btn-p:disabled{opacity:.22;cursor:not-allowed}
  .btn-o{width:100%;padding:14px;background:transparent;color:var(--ink2);border:1.5px solid var(--border2);border-radius:100px;font-size:14px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer}
  .toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);background:var(--green);color:white;border-radius:100px;padding:10px 20px;font-size:13px;font-weight:700;font-family:'Inter',sans-serif;z-index:999;white-space:nowrap;box-shadow:var(--sh-md);animation:slideDown .3s ease both,toastOut .3s 2.3s ease forwards}
  /* Loading */
  .loading-screen{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:var(--white)}
  .spinner{width:40px;height:40px;border:3px solid var(--border);border-top-color:var(--ch);border-radius:50%;animation:spin .8s linear infinite}
  .loading-text{font-size:14px;color:var(--ink3);font-weight:500}
  /* Auth screen */
  .auth-screen{flex:1;display:flex;flex-direction:column;background:var(--white)}
  .auth-hero{flex:1;display:flex;flex-direction:column;justify-content:center;padding:40px 32px}
  .auth-logo{font-size:44px;font-weight:900;letter-spacing:-2px;color:var(--ch);margin-bottom:8px}
  .auth-tagline{font-size:16px;color:var(--ink3);font-weight:500;margin-bottom:48px}
  .auth-btns{display:flex;flex-direction:column;gap:12px;padding:0 32px 48px}
  .google-btn{width:100%;padding:15px;background:var(--white);color:var(--ch);border:1.5px solid var(--border2);border-radius:100px;font-size:15px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:var(--sh)}
  .email-form{display:flex;flex-direction:column;gap:10px}
  .auth-input{width:100%;padding:14px 16px;background:var(--surface);border:1.5px solid var(--border);border-radius:14px;font-size:15px;font-family:'Inter',sans-serif;color:var(--ch);outline:none}
  .auth-input:focus{border-color:var(--ch)}
  .auth-toggle{text-align:center;font-size:13px;color:var(--ink3);cursor:pointer}
  .auth-toggle span{color:var(--ch);font-weight:600}
  .auth-error{font-size:13px;color:#cc3333;text-align:center;padding:4px 0}
  /* SPLASH */
  .splash{flex:1;display:flex;flex-direction:column;background:var(--white)}
  .splash-space{flex:1}
  .splash-bottom{padding:20px 24px 48px;display:flex;flex-direction:column;gap:12px}
  .splash-title{font-size:32px;font-weight:800;letter-spacing:-.6px;line-height:1.15;color:var(--ch)}
  .splash-sub{font-size:15px;color:var(--ink3);line-height:1.6}
  .splash-si{text-align:center;font-size:13px;color:var(--ink3)}
  .splash-si span{color:var(--ch);font-weight:600;cursor:pointer;text-decoration:underline}
  /* OB */
  .ob-info-pg{flex:1;display:flex;flex-direction:column;padding:28px 24px 0}
  .ob-info-top{flex:1;display:flex;flex-direction:column;justify-content:center;gap:22px}
  .ob-info-bottom{padding:22px 0 44px;display:flex;flex-direction:column;gap:10px}
  .ob-q{font-size:28px;font-weight:800;line-height:1.15;letter-spacing:-.5px;color:var(--ch)}
  .ob-body{font-size:15px;color:var(--ink2);line-height:1.75}.ob-body b{color:var(--ch);font-weight:700}
  .bar-visual{display:flex;align-items:flex-end;gap:8px;height:80px;justify-content:center}
  .bv-bar{border-radius:6px 6px 0 0;background:var(--ch);opacity:.12}.bv-bar.hi{opacity:1}
  .chart2{display:flex;flex-direction:column;gap:10px;width:100%}
  .c2-row{display:flex;align-items:center;gap:10px}
  .c2-lbl{font-size:11px;font-weight:600;color:var(--ink3);width:80px;line-height:1.3}
  .c2-wrap{flex:1;height:9px;background:var(--surface);border-radius:4px;overflow:hidden}
  .c2-bar{height:100%;border-radius:4px}
  .c2-val{font-size:12px;font-weight:700;width:32px;text-align:right}
  .bridge-pg{flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:40px 24px 48px}
  .bridge-title{font-size:32px;font-weight:800;letter-spacing:-.6px;line-height:1.15;color:var(--ch);margin-bottom:12px}
  .bridge-sub{font-size:15px;color:var(--ink3);line-height:1.65}
  .ob-pg{flex:1;overflow-y:auto;padding:20px 20px 44px;display:flex;flex-direction:column;gap:20px}
  .ob-pg::-webkit-scrollbar{display:none}
  .freq-list{display:flex;flex-direction:column;gap:10px}
  .freq-opt{background:var(--white);border:1.5px solid var(--border);border-radius:16px;padding:18px 20px;cursor:pointer;transition:all .18s;display:flex;align-items:center;gap:14px;box-shadow:var(--sh)}
  .freq-opt.on{background:var(--ch);border-color:var(--ch)}
  .freq-dots{display:flex;gap:4px;flex-shrink:0}
  .freq-dot{width:9px;height:9px;border-radius:50%;background:var(--border2)}
  .freq-opt.on .freq-dot{background:rgba(255,255,255,.45)}
  .freq-title{font-size:16px;font-weight:700;color:var(--ch);transition:color .15s}
  .freq-opt.on .freq-title{color:white}
  .freq-sub{font-size:12px;color:var(--ink3);margin-top:2px;transition:color .15s}
  .freq-opt.on .freq-sub{color:rgba(255,255,255,.5)}
  .split-list{display:flex;flex-direction:column;gap:9px}
  .split-opt{background:var(--white);border:1.5px solid var(--border);border-radius:16px;padding:15px 17px;cursor:pointer;transition:all .18s;display:flex;align-items:center;gap:12px;box-shadow:var(--sh)}
  .split-opt.on{background:var(--ch);border-color:var(--ch)}
  .split-emoji{font-size:24px;flex-shrink:0}
  .split-name{font-size:15px;font-weight:700;color:var(--ch);transition:color .15s}
  .split-opt.on .split-name{color:white}
  .split-desc{font-size:12px;color:var(--ink3);margin-top:2px;transition:color .15s}
  .split-opt.on .split-desc{color:rgba(255,255,255,.5)}
  .split-chk{width:22px;height:22px;border-radius:50%;border:1.5px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:10px;color:transparent;transition:all .18s;flex-shrink:0;margin-left:auto}
  .split-opt.on .split-chk{background:white;border-color:white;color:var(--ch)}
  .ex-sel-list{display:flex;flex-direction:column;gap:7px}
  .ex-opt{background:var(--white);border:1.5px solid var(--border);border-radius:13px;padding:13px 16px;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:10px;box-shadow:var(--sh)}
  .ex-opt.on{background:var(--ch);border-color:var(--ch)}
  .ex-opt-name{flex:1;font-size:14px;font-weight:600;color:var(--ch);transition:color .15s;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .ex-opt.on .ex-opt-name{color:white}
  .ex-opt-chk{width:20px;height:20px;border-radius:6px;border:1.5px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:10px;color:transparent;transition:all .18s;flex-shrink:0}
  .ex-opt.on .ex-opt-chk{background:white;border-color:white;color:var(--ch)}
  /* TAB BAR */
  .tab-bar{background:var(--white);border-top:1px solid var(--border);display:flex;padding:8px 12px 22px;gap:4px;flex-shrink:0}
  .tab-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:8px 6px;border-radius:14px;transition:background .15s;border:none;background:transparent;font-family:'Inter',sans-serif}
  .tab-item.on{background:var(--surface)}
  .tab-icon{color:var(--ink3);transition:color .15s;display:flex}
  .tab-item.on .tab-icon{color:var(--ch)}
  .tab-label{font-size:11px;font-weight:500;color:var(--ink3);letter-spacing:-.1px}
  .tab-item.on .tab-label{color:var(--ch);font-weight:700}
  /* HOME */
  .home-scroll{flex:1;overflow-y:auto;padding:14px 18px 24px;display:flex;flex-direction:column;gap:10px}
  .home-scroll::-webkit-scrollbar{display:none}
  .ws-days{display:flex;gap:2px;padding:2px 0}
  .ws-day{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer}
  .ws-day:active{opacity:.7}
  .ws-day-name{font-size:9px;font-weight:600;color:var(--ink3);text-transform:uppercase;letter-spacing:.3px}
  .ws-ring-wrap{width:38px;height:38px;position:relative;display:flex;align-items:center;justify-content:center}
  .ws-ring-svg{position:absolute;inset:0}
  .ws-ring-inner{z-index:1;display:flex;align-items:center;justify-content:center}
  .ws-date-num{font-size:11px;font-weight:700}
  .ws-sess-lbl{font-size:8px;font-weight:700;text-align:center;max-width:38px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
  .ctx-line{font-size:12px;color:var(--ink3);padding:2px 2px;font-weight:500}
  .ctx-orange{font-size:12px;color:var(--orange);padding:2px 2px;font-weight:600}
  .past-day-banner{background:var(--surface);border-radius:12px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between}
  .pdb-text{font-size:13px;font-weight:600;color:var(--ink2)}
  .pdb-back{background:none;border:none;font-size:12px;font-weight:600;color:var(--orange);cursor:pointer;font-family:'Inter',sans-serif}
  .empty-state{background:var(--white);border:1.5px dashed var(--border2);border-radius:16px;padding:24px 20px;text-align:center}
  .empty-state-icon{font-size:32px;margin-bottom:8px}
  .empty-state-text{font-size:14px;color:var(--ink3);line-height:1.55}
  /* Day cards */
  .day-card{background:var(--white);border:1.5px solid var(--border);border-radius:17px;overflow:hidden;box-shadow:var(--sh);cursor:pointer;transition:transform .1s}
  .day-card:active{transform:scale(.99)}
  .day-card-body{padding:14px 17px}
  .dc-top{display:flex;align-items:center;justify-content:space-between}
  .dc-left{display:flex;align-items:center;gap:8px;min-width:0}
  .dc-name{font-size:19px;font-weight:800;letter-spacing:-.4px;color:var(--ch);white-space:nowrap}
  .dc-name.green{color:var(--green)}
  .dc-pill-done{background:var(--green-l);color:var(--green);border:1px solid var(--green-m);border-radius:20px;padding:2px 9px;font-size:11px;font-weight:600;white-space:nowrap;flex-shrink:0}
  .dc-right{display:flex;align-items:center;gap:6px;flex-shrink:0}
  .dc-last{font-size:11px;color:var(--ink3);font-weight:500}
  .dc-remaining{font-size:11px;color:var(--orange);font-weight:600}
  .dc-subtitle{font-size:12px;color:var(--ink3);margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .dc-bar-wrap{height:3px;background:var(--surface2)}
  .dc-bar{height:3px;transition:width .4s ease}
  .add-workout-row{background:var(--white);border:1.5px solid var(--ch);border-radius:17px;padding:14px 17px;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;font-size:14px;font-weight:600;color:var(--ch);box-shadow:var(--sh)}
  /* Session screen */
  .sess-screen{flex:1;display:flex;flex-direction:column;overflow:hidden}
  .sess-topbar{padding:16px 20px 0;display:flex;align-items:center;gap:12px;flex-shrink:0}
  .sess-title{font-size:19px;font-weight:800;letter-spacing:-.4px;color:var(--ch)}
  .sess-counter{padding:12px 20px 8px;flex-shrink:0}
  .sess-count-row{display:flex;align-items:baseline;gap:6px;margin-bottom:6px}
  .sess-count-num{font-size:17px;font-weight:800;color:var(--ch);letter-spacing:-.3px}
  .sess-count-total{font-size:13px;color:var(--ink3)}
  .sess-prog-bar-wrap{height:4px;background:var(--surface2);border-radius:2px;overflow:hidden}
  .sess-prog-bar{height:100%;border-radius:2px;transition:width .3s ease}
  .sess-scroll{flex:1;overflow-y:auto}
  .sess-scroll::-webkit-scrollbar{display:none}
  .sess-footer{padding:10px 16px 32px;border-top:1px solid var(--border);display:flex;gap:8px;flex-shrink:0;background:var(--white)}
  .sess-edit-btn{flex:1;padding:13px;background:var(--surface);border:1.5px solid var(--border);border-radius:100px;font-size:14px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;color:var(--ch);text-align:center}
  .sess-edit-btn.active{background:var(--ch);color:white;border-color:var(--ch)}
  .sess-finish-btn{flex:2;padding:13px;background:var(--ch);color:white;border:none;border-radius:100px;font-size:14px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer}
  .sess-finish-btn:disabled{opacity:.18;cursor:not-allowed}
  .sess-divider{height:1px;background:var(--border);margin:0 16px}
  /* Exercise blocks */
  .ex-block{background:var(--white);margin:8px 12px;border:1.5px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--sh)}
  .ex-block:last-of-type{margin-bottom:8px}
  .ex-hdr{padding:13px 16px 6px;display:flex;justify-content:space-between;align-items:flex-start}
  .ex-hdr-left{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1;margin-right:8px}
  .ex-name{font-size:15px;font-weight:700;color:var(--ch);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .muscle-tag{display:inline-block;background:var(--surface);color:var(--ink3);border-radius:20px;padding:2px 8px;font-size:10px;font-weight:600;width:fit-content}
  .ex-last-lbl{font-size:11px;color:var(--ink3);flex-shrink:0}
  .set-col-hdrs{display:grid;grid-template-columns:48px 52px 1fr 1fr 36px;gap:5px;padding:3px 16px 1px}
  .sch{font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.7px;text-align:center}
  .sch:first-child{text-align:left}
  .set-row{display:grid;grid-template-columns:48px 52px 1fr 1fr 36px;gap:5px;padding:7px 16px;align-items:center;border-top:1px solid var(--border)}
  .set-n{font-size:12px;font-weight:700;color:var(--ink3)}
  .set-last-num{font-size:12px;font-weight:600;color:var(--ink3);text-align:center}
  .set-inp{width:100%;background:var(--surface);border:1.5px solid var(--border2);border-radius:10px;padding:9px 0;font-size:17px;font-weight:700;font-family:'Inter',sans-serif;color:var(--ch);text-align:center;outline:none;transition:border-color .15s}
  .set-inp:focus{border-color:var(--orange);background:var(--white)}
  .set-inp.pr{border-color:var(--green);background:var(--green-l)}
  .set-tick{width:36px;height:40px;border-radius:10px;border:1.5px solid var(--border);background:var(--white);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;font-size:14px;color:transparent;font-weight:800;flex-shrink:0}
  .set-tick.on{background:var(--green);border-color:var(--green);color:white}
  .ex-footer{padding:7px 16px 10px;display:flex;justify-content:space-between}
  .add-set-btn{background:none;border:none;font-size:13px;font-weight:700;color:var(--ch);font-family:'Inter',sans-serif;cursor:pointer;padding:0}
  .rm-set-btn{background:none;border:none;font-size:12px;font-weight:600;color:var(--ink3);font-family:'Inter',sans-serif;cursor:pointer;padding:0}
  .ex-done-row{padding:11px 16px;display:flex;align-items:center;gap:10px;cursor:pointer}
  .ex-done-tick{width:22px;height:22px;border-radius:7px;background:var(--green);display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:800;flex-shrink:0}
  .ex-done-name{flex:1;font-size:14px;font-weight:600;color:var(--green);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .ex-done-detail{font-size:12px;color:var(--ink3);font-weight:500;white-space:nowrap}
  .edit-mode{padding:14px 16px;border-top:1px solid var(--border)}
  .edit-ex-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)}
  .edit-ex-row:last-child{border-bottom:none}
  .edit-ex-name{flex:1;font-size:14px;font-weight:600;color:var(--ch);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .rm-btn{background:none;border:none;font-size:15px;color:var(--ink3);cursor:pointer;padding:4px}
  .edit-add-row{display:flex;gap:8px;margin-top:10px}
  .edit-inp{flex:1;background:var(--surface);border:1.5px solid var(--border);border-radius:10px;padding:10px 12px;font-size:14px;font-family:'Inter',sans-serif;color:var(--ch);outline:none}
  .edit-add-plus{width:38px;height:38px;background:var(--ch);border:none;border-radius:10px;color:white;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .qa-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
  .qa{padding:5px 11px;background:var(--surface);border:1.5px solid var(--border);border-radius:20px;font-size:12px;font-weight:600;color:var(--ink3);cursor:pointer;white-space:nowrap}
  .delete-workout-btn{width:100%;margin-top:12px;padding:11px;background:transparent;border:1.5px solid #FFCCCC;border-radius:100px;font-size:13px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;color:#CC3333;text-align:center}
  /* PROGRESS */
  .prog-scroll{flex:1;overflow-y:auto;padding:14px 18px 24px;display:flex;flex-direction:column;gap:14px}
  .prog-scroll::-webkit-scrollbar{display:none}
  .pr-card{background:var(--ch);border-radius:18px;padding:20px;position:relative;overflow:hidden}
  .pr-blob{position:absolute;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(232,80,10,.22) 0%,transparent 65%);top:-50px;right:-50px}
  .pr-lbl{font-size:11px;color:rgba(255,255,255,.38);font-weight:700;text-transform:uppercase;letter-spacing:1.4px;margin-bottom:6px;position:relative}
  .pr-ex-name{font-size:15px;font-weight:700;color:rgba(255,255,255,.7);position:relative;margin-bottom:4px}
  .pr-nums{display:flex;align-items:baseline;gap:10px;position:relative;margin-bottom:5px}
  .pr-from{font-size:28px;font-weight:800;color:rgba(255,255,255,.45);letter-spacing:-.5px}
  .pr-arrow{font-size:18px;color:rgba(255,255,255,.4)}
  .pr-to{font-size:36px;font-weight:900;color:white;letter-spacing:-.6px}
  .pr-unit{font-size:14px;color:rgba(255,255,255,.5);font-weight:600}
  .pr-sub{font-size:12px;color:rgba(255,255,255,.38);position:relative}
  .stats-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
  .stat-mini{background:var(--white);border:1.5px solid var(--border);border-radius:14px;padding:12px 10px;box-shadow:var(--sh);text-align:center}
  .stat-mini-lbl{font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
  .stat-mini-val{font-size:22px;font-weight:800;letter-spacing:-.4px;line-height:1;color:var(--ch)}
  .stat-mini-sub{font-size:10px;color:var(--ink3);margin-top:2px}
  .split-cards-wrap{overflow-x:auto;margin:0 -18px;padding:0 18px}
  .split-cards-wrap::-webkit-scrollbar{display:none}
  .split-cards-row{display:flex;gap:10px;width:max-content}
  .split-card{background:var(--white);border:1.5px solid var(--border);border-radius:16px;padding:14px;min-width:130px;max-width:160px;box-shadow:var(--sh);flex-shrink:0}
  .split-card-name{font-size:12px;font-weight:800;color:var(--ch);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px}
  .split-card-exs{display:flex;flex-direction:column;gap:5px}
  .split-card-ex{font-size:12px;font-weight:600;color:var(--ink3);cursor:pointer;padding:3px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .split-card-ex.active{color:var(--orange);font-weight:700}
  .prog-graph-wrap{background:var(--white);border:1.5px solid var(--border);border-radius:16px;overflow:hidden;box-shadow:var(--sh)}
  .pge-top{padding:14px 16px 0;display:flex;justify-content:space-between;align-items:center}
  .pge-name{font-size:14px;font-weight:700;color:var(--ch)}
  .pge-gain{font-size:12px;font-weight:700;background:var(--green-l);color:var(--green);border-radius:20px;padding:3px 9px;border:1px solid var(--green-m)}
  .pge-graph{padding:8px 16px 2px}
  .pge-range{display:flex;justify-content:space-between;padding:8px 16px 12px;border-top:1px solid var(--border)}
  .pge-start{font-size:11px;color:var(--ink3)}
  .pge-end{font-size:12px;font-weight:700;color:var(--ch)}
  .cal-card{background:var(--white);border:1.5px solid var(--border);border-radius:16px;padding:16px;box-shadow:var(--sh)}
  .hist-sess{background:var(--white);border:1.5px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--sh);margin-bottom:7px}
  .hist-sess-hdr{padding:13px 16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer}
  .hist-sess-date{font-size:13px;font-weight:700;color:var(--ch)}
  .hist-sess-name{font-size:12px;color:var(--ink3)}
  .hist-sess-chev{font-size:11px;color:var(--ink3);transition:transform .2s;display:inline-block}
  .hist-sess-chev.open{transform:rotate(180deg)}
  .hist-sess-body{border-top:1px solid var(--border);padding:12px 16px;display:flex;flex-direction:column;gap:10px}
  .hist-ex-name{font-size:13px;font-weight:700;color:var(--ch);margin-bottom:4px}
  .hist-set-row{display:flex;gap:10px;padding:4px 0;border-bottom:1px solid var(--border)}
  .hist-set-row:last-child{border-bottom:none}
  .hist-set-n{font-size:12px;color:var(--ink3);width:40px;font-weight:600}
  .hist-set-val{font-size:12px;font-weight:600;color:var(--ch)}
  /* PROFILE */
  .profile-scroll{flex:1;overflow-y:auto;padding:0 0 44px;display:flex;flex-direction:column}
  .profile-scroll::-webkit-scrollbar{display:none}
  .profile-title{font-size:28px;font-weight:800;letter-spacing:-.5px;color:var(--ch);padding:16px 20px 12px}
  .profile-section-lbl{font-size:13px;font-weight:600;color:var(--ink3);padding:14px 20px 6px}
  .profile-group{background:var(--white);border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:4px}
  .profile-row{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .12s}
  .profile-row:last-child{border-bottom:none}.profile-row:active{background:var(--surface)}
  .profile-row-icon{width:20px;height:20px;display:flex;align-items:center;justify-content:center;color:var(--ink2);flex-shrink:0}
  .profile-row-label{flex:1;font-size:15px;font-weight:500;color:var(--ch)}
  .profile-row-value{font-size:14px;font-weight:600;color:var(--ink3);margin-right:4px}
  .profile-row-chev{color:var(--ink3);display:flex;align-items:center}
  .profile-user-card{display:flex;align-items:center;gap:14px;background:var(--white);padding:16px 20px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:4px}
  .puc-av{width:52px;height:52px;border-radius:50%;background:var(--ch);color:white;font-size:18px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .puc-name-row{display:flex;align-items:center;gap:6px;cursor:pointer}
  .puc-name{font-size:17px;font-weight:700;color:var(--ch)}
  .puc-name-inp{font-size:17px;font-weight:700;color:var(--ch);border:none;border-bottom:2px solid var(--orange);background:transparent;outline:none;font-family:'Inter',sans-serif;width:160px}
  .puc-sub{font-size:13px;color:var(--ink3);margin-top:2px}
  .puc-streak-pill{display:inline-flex;align-items:center;gap:4px;background:var(--surface);border-radius:20px;padding:3px 9px;font-size:12px;font-weight:700;color:var(--ch);margin-top:6px}
  .profile-version{text-align:center;padding:20px;font-size:12px;color:var(--ink3)}
  .units-toggle{display:flex;background:var(--surface);border-radius:100px;padding:3px;gap:2px}
  .ut-opt{padding:5px 12px;border-radius:100px;font-size:12px;font-weight:600;cursor:pointer;color:var(--ink3);font-family:'Inter',sans-serif}
  .ut-opt.on{background:var(--white);color:var(--ch);box-shadow:var(--sh)}
  .notif-toggle{width:44px;height:26px;border-radius:13px;background:var(--surface2);border:none;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0}
  .notif-toggle.on{background:var(--green)}
  .notif-knob{width:20px;height:20px;border-radius:50%;background:white;position:absolute;top:3px;left:3px;transition:left .2s;box-shadow:0 1px 4px rgba(0,0,0,.15)}
  .notif-toggle.on .notif-knob{left:21px}
  /* Achievements */
  .achieve-scroll{flex:1;overflow-y:auto;padding:0 0 44px}
  .achieve-scroll::-webkit-scrollbar{display:none}
  .achieve-hero{background:var(--ch);padding:32px 24px 28px;text-align:center;position:relative;overflow:hidden}
  .ah-blob{position:absolute;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(232,80,10,.25) 0%,transparent 65%);top:-60px;right:-60px}
  .ah-num{font-size:72px;font-weight:900;color:white;line-height:1;letter-spacing:-3px;position:relative}
  .ah-label{font-size:15px;color:rgba(255,255,255,.45);position:relative;margin-top:4px}
  .ah-best{font-size:12px;color:rgba(255,255,255,.3);position:relative;margin-top:5px}
  .badge-section-lbl{font-size:13px;font-weight:600;color:var(--ink3);padding:14px 20px 6px}
  .badge-group{background:var(--white);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
  .badge-row{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--border)}
  .badge-row:last-child{border-bottom:none}
  .badge-ico{width:42px;height:42px;border-radius:13px;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
  .badge-ico.locked{opacity:.4;filter:grayscale(1)}.badge-ico.unlocked{background:var(--green-l)}
  .badge-name{font-size:14px;font-weight:700;color:var(--ch)}.badge-desc{font-size:12px;color:var(--ink3);margin-top:2px}
  .badge-date{font-size:11px;color:var(--orange);font-weight:600;margin-top:2px}.badge-hint{font-size:11px;color:var(--ink3);margin-top:2px}
`;

/* ── DATA ── */
const EX_LIB = {
  "Push":["Bench Press","Incline DB Press","OHP","Decline Bench Press","Cable Fly","Pec Deck","Lateral Raise","Front Raise","Tricep Pushdown","Skull Crushers","Overhead Tricep Extension","Dips","Close Grip Bench","Machine Chest Press"],
  "Pull":["Pull-ups","Chin-ups","Barbell Row","Cable Row","Seated Row","Lat Pulldown","Single Arm DB Row","Face Pulls","Bicep Curl","Hammer Curl","Incline DB Curl","Preacher Curl","Cable Curl","Reverse Curl","Shrugs"],
  "Legs":["Squat","Front Squat","Romanian Deadlift","Deadlift","Leg Press","Hack Squat","Leg Curl","Leg Extension","Calf Raise","Seated Calf Raise","Hip Thrust","Bulgarian Split Squat","Lunges","Glute Kickback"],
  "Upper":["Bench Press","Incline DB Press","OHP","Pull-ups","Cable Row","Lat Pulldown","Lateral Raise","Face Pulls","Bicep Curl","Tricep Pushdown","Close Grip Bench","Seated Row","Hammer Curl","Rear Delt Fly"],
  "Lower":["Squat","Romanian Deadlift","Deadlift","Leg Press","Leg Curl","Leg Extension","Calf Raise","Hip Thrust","Bulgarian Split Squat","Lunges","Hack Squat","Glute Kickback","Seated Calf Raise","Nordic Curl"],
  "Full Body":["Squat","Bench Press","Deadlift","Pull-ups","OHP","Barbell Row","Bicep Curl","Tricep Pushdown","Leg Press","Lateral Raise","Face Pulls","Calf Raise"],
  "Chest":["Flat Bench Press","Incline DB Press","Decline Bench Press","Cable Fly","Pec Deck","Machine Chest Press","Dips","Push-ups"],
  "Back":["Deadlift","Pull-ups","Chin-ups","Barbell Row","Cable Row","Seated Row","Lat Pulldown","Single Arm DB Row","Face Pulls","Shrugs"],
  "Shoulders":["OHP","DB Shoulder Press","Lateral Raise","Front Raise","Rear Delt Fly","Arnold Press","Cable Lateral Raise","Face Pulls"],
  "Arms":["Barbell Curl","DB Curl","Hammer Curl","Preacher Curl","Cable Curl","Tricep Pushdown","Skull Crushers","Overhead Tricep Extension","Close Grip Bench","Dips","Tricep Kickback"],
  "Chest & Back":["Bench Press","Pull-ups","Incline DB Press","Barbell Row","Cable Fly","Lat Pulldown","Pec Deck","Cable Row"],
  "Shoulders & Arms":["OHP","Barbell Curl","Lateral Raise","Tricep Pushdown","Rear Delt Fly","Hammer Curl","Arnold Press","Skull Crushers"],
};
const getExLib=d=>EX_LIB[d]||EX_LIB["Push"];
const MUSCLE_TAGS={"Bench Press":"Chest","Incline DB Press":"Chest","Decline Bench Press":"Chest","Flat Bench Press":"Chest","Cable Fly":"Chest","Pec Deck":"Chest","Machine Chest Press":"Chest","Dips":"Chest/Tri","Push-ups":"Chest","OHP":"Shoulders","DB Shoulder Press":"Shoulders","Lateral Raise":"Shoulders","Front Raise":"Shoulders","Rear Delt Fly":"Rear Delts","Arnold Press":"Shoulders","Cable Lateral Raise":"Shoulders","Pull-ups":"Back/Bi","Chin-ups":"Back/Bi","Barbell Row":"Back","Cable Row":"Back","Seated Row":"Back","Lat Pulldown":"Back","Single Arm DB Row":"Back","Face Pulls":"Rear Delts","Shrugs":"Traps","Bicep Curl":"Biceps","DB Curl":"Biceps","Hammer Curl":"Biceps","Incline DB Curl":"Biceps","Preacher Curl":"Biceps","Cable Curl":"Biceps","Reverse Curl":"Biceps","Tricep Pushdown":"Triceps","Skull Crushers":"Triceps","Overhead Tricep Extension":"Triceps","Close Grip Bench":"Triceps","Tricep Kickback":"Triceps","Squat":"Quads","Front Squat":"Quads","Romanian Deadlift":"Hamstrings","Deadlift":"Back/Legs","Leg Press":"Quads","Hack Squat":"Quads","Leg Curl":"Hamstrings","Leg Extension":"Quads","Calf Raise":"Calves","Seated Calf Raise":"Calves","Hip Thrust":"Glutes","Bulgarian Split Squat":"Quads/Glutes","Lunges":"Quads/Glutes","Glute Kickback":"Glutes","Nordic Curl":"Hamstrings"};
const ALL_SPLITS=[{id:"ppl",emoji:"💪",name:"Push / Pull / Legs",desc:"Most popular. Best for 5–6 days.",days:["Push","Pull","Legs"]},{id:"ul",emoji:"🔄",name:"Upper / Lower",desc:"Great balance. Best for 4 days.",days:["Upper","Lower"]},{id:"fb",emoji:"⚡",name:"Full Body",desc:"Train everything each session.",days:["Full Body"]},{id:"bro",emoji:"🏆",name:"Bro Split",desc:"One muscle group per day.",days:["Chest","Back","Shoulders","Arms","Legs"]},{id:"arnold",emoji:"🦁",name:"Arnold Split",desc:"Chest+Back, Shoulders+Arms, Legs.",days:["Chest & Back","Shoulders & Arms","Legs"]}];
const FREQ_OPTS=[{id:"1-3",label:"1 – 3 days",sub:"Just getting started or busy schedule",dots:2},{id:"4-5",label:"4 – 5 days",sub:"Consistent trainer, solid commitment",dots:4},{id:"6-7",label:"6 – 7 days",sub:"Dedicated, advanced lifter",dots:6}];
const BADGES=[{id:"first",icon:"🔥",name:"First Session",desc:"You showed up.",req:1,type:"sessions"},{id:"week7",icon:"💪",name:"7-Day Streak",desc:"7 consecutive days.",req:7,type:"streak"},{id:"s30",icon:"⚡",name:"30 Sessions",desc:"30 sessions logged.",req:30,type:"sessions"},{id:"streak30",icon:"📈",name:"Month Streak",desc:"30 days in a row.",req:30,type:"streak"},{id:"s100",icon:"💎",name:"Century",desc:"100 sessions. Elite.",req:100,type:"sessions"}];
const DAYS_MON=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const JS_TO_MON=[6,0,1,2,3,4,5];
const today=new Date();
const todayMonIdx=JS_TO_MON[today.getDay()];
const getWeekDates=()=>{const d=[];for(let i=0;i<7;i++){const dt=new Date(today);dt.setDate(today.getDate()-todayMonIdx+i);d.push(dt.getDate());}return d;};
const weekDates=getWeekDates();
const ini=n=>n.trim()?n.trim().split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2):"U";
const fmtDate=dt=>new Date(dt).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"});
const getMonthLabel=dt=>new Date(dt).toLocaleDateString("en-GB",{month:"long",year:"numeric"});
const CIRC=2*Math.PI*16;

/* ═══════════════════════════════════════
   AUTH SCREEN
═══════════════════════════════════════ */
function AuthScreen({ onSkip }) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState('login'); // login | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmail = async () => {
    setError(''); setLoading(true);
    if (mode === 'login') {
      const { error } = await signInWithEmail(email, password);
      if (error) setError(error.message);
    } else {
      const { error } = await signUpWithEmail(email, password, name);
      if (error) setError(error.message);
      else setError('Check your email to confirm your account.');
    }
    setLoading(false);
  };

  return(
    <div className="app"><style>{S}</style>
      <div className="auth-screen">
        <div className="auth-hero">
          <div className="auth-logo">Overload</div>
          <div className="auth-tagline">Every rep counted.</div>
          <div style={{fontSize:15,color:"var(--ink3)",lineHeight:1.6}}>
            The progressive overload tracker. Your data saves to the cloud — log on any device, never lose your history.
          </div>
        </div>
        <div className="auth-btns">
          <button className="google-btn" onClick={signInWithGoogle}>
            {TI.google} Continue with Google
          </button>
          <div style={{textAlign:"center",fontSize:12,color:"var(--ink3)",margin:"4px 0"}}>or</div>
          <div className="email-form">
            {mode==='signup'&&<input className="auth-input" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/>}
            <input className="auth-input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
            <input className="auth-input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
            {error&&<div className="auth-error">{error}</div>}
            <button className="btn-p" onClick={handleEmail} disabled={loading}>
              {loading?"...":(mode==='login'?"Sign in":"Create account")}
            </button>
          </div>
          <div className="auth-toggle" onClick={()=>setMode(m=>m==='login'?'signup':'login')}>
            {mode==='login'?<>Don't have an account? <span>Sign up</span></>:<>Already have an account? <span>Sign in</span></>}
          </div>
          <button className="btn-o" onClick={onSkip}>Continue without account</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN APP
═══════════════════════════════════════ */
export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    profile, programs: dbPrograms, sessionLog: dbSessionLog,
    workoutState: dbWorkoutState, loading: dataLoading,
    saveProgram, deleteProgram, updateProgramExercises,
    saveSession, saveWorkoutState, updateProfile
  } = useData(user);

  const [skipAuth, setSkipAuth] = useState(false);
  const [screen, setScreen] = useState("splash");
  const [obFreq, setObFreq] = useState(null);
  const [obSplit, setObSplit] = useState(null);
  const [obExs, setObExs] = useState({});
  const [obExStep, setObExStep] = useState(0);
  // Local state (synced to Supabase on changes)
  const [programs, setPrograms] = useState([]);
  const [sessionLog, setSessionLog] = useState([]);
  const [wSets, setWSets] = useState({});
  const [tab, setTab] = useState("home");
  const [sessionScreen, setSessionScreen] = useState(null);
  const [editingDay, setEditDay] = useState(null);
  const [editSearch, setEditS] = useState("");
  const [collapsedDone, setCollapsedDone] = useState({});
  const [trainedDays, setTrained] = useState({});
  const [lastTs, setLastTs] = useState({});
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastStreakDate, setLastStreakDate] = useState(null);
  const [viewingDayIdx, setViewingDayIdx] = useState(null);
  const [selectedProgressEx, setSelEx] = useState(null);
  const [expandedSess, setExpS] = useState({});
  const [userName, setUserName] = useState("Athlete");
  const [editingName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [units, setUnits] = useState("kg");
  const [notifEnabled, setNotif] = useState(false);
  const [toast, setToast] = useState(null);
  const toastRef = useRef(null);

  // Sync Supabase data to local state when loaded
  useEffect(() => {
    if (!user || dataLoading) return;
    if (dbPrograms.length > 0) {
      setPrograms(dbPrograms.map(p => ({
        id: p.id, split: { id: p.split_id, name: p.split_name },
        days: p.days, exs: p.exercises
      })));
    }
    if (dbSessionLog.length > 0) setSessionLog(dbSessionLog);
    if (Object.keys(dbWorkoutState).length > 0) setWSets(dbWorkoutState);
    if (profile) {
      if (profile.name) setUserName(profile.name);
      if (profile.units) setUnits(profile.units);
      if (profile.streak) setStreak(profile.streak);
      if (profile.longest_streak) setLongestStreak(profile.longest_streak);
      if (profile.last_streak_date) setLastStreakDate(profile.last_streak_date);
      if (profile.notif_enabled !== undefined) setNotif(profile.notif_enabled);
      if (dbPrograms.length > 0 && screen === 'splash') setScreen('main');
    }
  }, [user, dataLoading, dbPrograms, dbSessionLog, dbWorkoutState, profile]);

  const showToast = msg => {
    setToast(msg);
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2800);
  };

  const toggleObEx = (day, ex) => setObExs(p => { const c = p[day]||[]; return {...p,[day]:c.includes(ex)?c.filter(e=>e!==ex):[...c,ex]}; });
  const splitDays = obSplit?.days||[];
  const curObDay = splitDays[obExStep]||"";
  const isLastDay = obExStep === splitDays.length-1;

  const addProgram = async () => {
    if (!obSplit) { setScreen("main"); return; }
    const prog = { id: Date.now(), split: obSplit, days: obSplit.days, exs: obExs };
    setPrograms(p => [...p, prog]);
    const ws = {...wSets};
    obSplit.days.forEach(d => { (obExs[d]||[]).forEach(ex => { if(!ws[ex]) ws[ex]=[{w:"",r:"",done:false,lastW:"—",lastR:"—",typed:false}]; }); });
    setWSets(ws);
    if (user) await saveProgram(prog);
    setScreen("main");
  };

  const handleDeleteWorkout = async dayName => {
    setPrograms(p => p.filter(prog => !prog.days.includes(dayName)));
    setSessionScreen(null);
    if (user) await deleteProgram(dayName);
    showToast(`${dayName} removed`);
  };

  const allDays = [...new Set(programs.flatMap(p => p.days))];
  const getDayExs = d => { for(const p of programs){ if(p.exs[d]) return p.exs[d]; } return []; };

  const addSet = ex => setWSets(p => { const sets=p[ex]||[]; const prev=sets[sets.length-1]; return {...p,[ex]:[...sets,{w:prev?.lastW!=="—"?prev.lastW:"",r:prev?.lastR!=="—"?prev.lastR:"",done:false,lastW:prev?.lastW||"—",lastR:prev?.lastR||"—",typed:false}]}; });
  const removeSet = (ex, idx) => setWSets(p => { const s=[...(p[ex]||[])]; if(s.length<=1) return p; s.splice(idx,1); return {...p,[ex]:s}; });
  const updateSet = (ex, i, f, v) => setWSets(p => { const s=[...(p[ex]||[])]; s[i]={...s[i],[f]:v,typed:true}; return {...p,[ex]:s}; });
  const tickSet = (ex, i) => setWSets(p => { const s=[...(p[ex]||[])]; s[i]={...s[i],done:!s[i].done}; const next={...p,[ex]:s}; if(!s[i].done&&s.every(set=>set.done)) setTimeout(()=>setCollapsedDone(prev=>({...prev,[ex]:true})),300); return next; });
  const removeExFromDay = (day, ex) => setPrograms(p => p.map(prog => prog.exs[day]?{...prog,exs:{...prog.exs,[day]:prog.exs[day].filter(e=>e!==ex)}}:prog));
  const addExToDay = (day, ex) => {
    if(!ex.trim()) return;
    setPrograms(p => p.map(prog => prog.exs[day]?{...prog,exs:{...prog.exs,[day]:[...(prog.exs[day]||[]),ex.trim()]}}:prog));
    if(!wSets[ex.trim()]) setWSets(pw => ({...pw,[ex.trim()]:[{w:"",r:"",done:false,lastW:"—",lastR:"—",typed:false}]}));
    setEditS("");
  };
  const isPR = (ex, si, w, typed) => { if(!typed||!w) return false; const lw=wSets[ex]?.[si]?.lastW; if(!lw||lw==="—"||lw==="BW") return false; return parseFloat(w)>parseFloat(lw); };
  const isExDone = ex => { const s=wSets[ex]||[]; return s.length>0&&s.every(s=>s.done); };
  const getBestSet = ex => { const sets=(wSets[ex]||[]).filter(s=>s.done&&s.typed&&s.w); if(!sets.length) return null; const b=sets.reduce((a,s)=>parseFloat(s.w)>parseFloat(a.w)?s:a,sets[0]); return `${b.w}${units}×${b.r}`; };

  const getSessPct = dayName => {
    const todayStr2=new Date().toDateString();
    const completedToday=sessionLog.find(s=>s.dayName===dayName&&new Date(s.date).toDateString()===todayStr2);
    if(completedToday){ const totalSaved=completedToday.exercises.reduce((a,ex)=>a+ex.sets.length,0); const totalExpected=getDayExs(dayName).reduce((a,ex)=>a+(wSets[ex]?.length||0),0); if(totalExpected===0) return 100; return Math.min(100,Math.round(totalSaved/totalExpected*100)); }
    const exs=getDayExs(dayName); const tot=exs.reduce((a,ex)=>a+(wSets[ex]?.length||0),0); const done=exs.reduce((a,ex)=>a+(wSets[ex]?.filter(s=>s.done).length||0),0); return tot>0?Math.round(done/tot*100):0;
  };
  const getSessSetCounts = dayName => { const exs=getDayExs(dayName); const tot=exs.reduce((a,ex)=>a+(wSets[ex]?.length||0),0); const done=exs.reduce((a,ex)=>a+(wSets[ex]?.filter(s=>s.done).length||0),0); return {tot,done}; };
  const anyDone = dayName => getDayExs(dayName).some(ex=>(wSets[ex]||[]).some(s=>s.done));

  const doFinish = async dayName => {
    const exNames=getDayExs(dayName);
    const untouched=exNames.filter(ex=>(wSets[ex]||[]).every(s=>!s.done));
    const isPartial=untouched.length>0;
    const sessExs=exNames.map(ex=>({name:ex,sets:(wSets[ex]||[]).filter(s=>s.typed||s.done).map(s=>({w:s.w||s.lastW,r:s.r||s.lastR}))})).filter(e=>e.sets.length>0);
    const newSession={id:Date.now(),date:Date.now(),dayName,exercises:sessExs,partial:isPartial};
    const todayStr2=new Date().toDateString();
    const existingIdx=sessionLog.findIndex(s=>s.dayName===dayName&&new Date(s.date).toDateString()===todayStr2);
    if(existingIdx>=0){ setSessionLog(p=>{const u=[...p];u[existingIdx]={...u[existingIdx],exercises:sessExs,partial:isPartial};return u;}); }
    else { setSessionLog(p=>[newSession,...p]); }
    // Save to Supabase
    if (user) await saveSession(newSession);
    setWSets(p=>{
      const next={...p};
      exNames.forEach(ex=>{
        const updatedSets=isPartial?(p[ex]||[]).map(s=>({...s,lastW:s.typed&&s.w?s.w:s.lastW,lastR:s.typed&&s.r?s.r:s.lastR})):(p[ex]||[]).map(s=>({...s,done:false,lastW:s.typed&&s.w?s.w:s.lastW,lastR:s.typed&&s.r?s.r:s.lastR,w:s.typed&&s.w?s.w:s.lastW!=="—"?s.lastW:"",r:s.typed&&s.r?s.r:s.lastR!=="—"?s.lastR:"",typed:false}));
        next[ex]=updatedSets;
        if (user) saveWorkoutState(ex, updatedSets);
      });
      return next;
    });
    const todayDateStr=today.toDateString();
    const yesterday=new Date(today); yesterday.setDate(today.getDate()-1);
    if(lastStreakDate!==todayDateStr){
      const newStreak=lastStreakDate===yesterday.toDateString()?streak+1:1;
      setStreak(newStreak); setLongestStreak(ls=>Math.max(ls,newStreak)); setLastStreakDate(todayDateStr);
      if (user) await updateProfile({ streak: newStreak, longest_streak: Math.max(longestStreak, newStreak), last_streak_date: todayDateStr });
    }
    const viewIdx=viewingDayIdx!==null?viewingDayIdx:todayMonIdx;
    setTrained(p=>({...p,[viewIdx]:[...new Set([...(p[viewIdx]||[]),dayName])]}));
    setLastTs(p=>({...p,[dayName]:Date.now()}));
    if(!isPartial){ setCollapsedDone({}); setSessionScreen(null); }
    showToast(`${dayName} logged ✓`);
  };

  const buildGraphData = exName => {
    if(!exName||!sessionLog.length) return null;
    const r=sessionLog.filter(s=>s.exercises&&s.exercises.some(e=>e.name===exName)).slice(0,8).reverse();
    if(r.length<2) return null;
    return r.map((s,i)=>{const ex=s.exercises.find(e=>e.name===exName);if(!ex||!ex.sets.length)return null;const mk=Math.max(...ex.sets.map(s=>parseFloat(s.w)||0).filter(v=>v>0));return mk>0?{w:`S${i+1}`,kg:mk}:null;}).filter(Boolean);
  };
  const buildPR = () => {
    if(!sessionLog.length) return null;
    let bEx=null,bGain=0,sKg=0,eKg=0;
    const exNames=[...new Set(sessionLog.flatMap(s=>s.exercises?s.exercises.map(e=>e.name):[]))];
    exNames.forEach(ex=>{const r=sessionLog.filter(s=>s.exercises&&s.exercises.some(e=>e.name===ex)).slice(0,20).reverse();if(r.length<2)return;const f=r[0].exercises.find(e=>e.name===ex);const l=r[r.length-1].exercises.find(e=>e.name===ex);if(!f||!l||!f.sets.length||!l.sets.length)return;const fm=Math.max(...f.sets.map(s=>parseFloat(s.w)||0));const lm=Math.max(...l.sets.map(s=>parseFloat(s.w)||0));if(lm-fm>bGain){bGain=lm-fm;bEx=ex;sKg=fm;eKg=lm;}});
    return bEx?{ex:bEx,from:sKg,to:eKg,gain:bGain}:null;
  };
  const buildWeeklyStats = () => {const tot=sessionLog.reduce((a,s)=>a+s.exercises.reduce((b,ex)=>b+ex.sets.length,0),0);const wt=sessionLog.reduce((a,s)=>a+s.exercises.reduce((b,ex)=>b+ex.sets.reduce((c,st)=>c+((parseFloat(st.w)||0)*(parseInt(st.r)||0)),0),0),0);const reps=sessionLog.reduce((a,s)=>a+s.exercises.reduce((b,ex)=>b+ex.sets.reduce((c,st)=>c+(parseInt(st.r)||0),0),0),0);return{sets:tot,weight:wt,reps};};
  const isBadgeUnlocked = b => b.type==="sessions"?sessionLog.length>=b.req:streak>=b.req;
  const isDayDone = i => (trainedDays[i]||[]).length>0;
  const getDaySessionLabel = i => (trainedDays[i]||[]).join("/").slice(0,5)||"";
  const getLastTrained = day => {const ts=lastTs[day];if(!ts)return"Never";const diff=Math.floor((Date.now()-ts)/(1000*60*60*24));if(diff===0)return"Today";if(diff===1)return"Yesterday";return`${diff}d ago`;};

  const prData = buildPR();
  const weekStats = buildWeeklyStats();
  const todaySessions = trainedDays[todayMonIdx]||[];
  let ctxText = "Tap a workout to start logging.";
  let ctxOrange = false;
  if(todaySessions.length>0){ const pct=getSessPct(todaySessions[0]); ctxText=`${todaySessions[0]} ${pct===100?"logged today ✓":`— ${pct}% today`}`; ctxOrange=pct<100; }
  else { const lastDone=Object.entries(lastTs).sort((a,b)=>b[1]-a[1])[0]; if(lastDone){const diff=Math.floor((Date.now()-lastDone[1])/(1000*60*60*24));ctxText=`${lastDone[0]} — ${diff===0?"today":diff===1?"yesterday":`${diff} days ago`}. Up next?`;ctxOrange=true;} }
  const progGraphData = selectedProgressEx?buildGraphData(selectedProgressEx):null;
  const progGraphGain = progGraphData&&progGraphData.length>=2?`+${(progGraphData[progGraphData.length-1].kg-progGraphData[0].kg).toFixed(1)}${units}`:null;
  const isViewingPast = viewingDayIdx!==null&&viewingDayIdx!==todayMonIdx;

  // Show loading screen while checking auth
  if(authLoading){ return(<div className="app"><style>{S}</style><div className="loading-screen"><div className="spinner"/><div className="loading-text">Loading Overload...</div></div></div>); }

  // Show auth screen if not logged in and not skipped
  if(!user && !skipAuth && screen==="splash"){ return <AuthScreen onSkip={()=>setSkipAuth(true)}/>; }

  /* ════ ONBOARDING ════ */
  if(screen==="splash")return(<div className="app"><style>{S}</style><div className="splash"><div className="splash-space"/><div className="splash-bottom"><div className="splash-title u0">Track every lift.<br/>Beat it next time.</div><div className="splash-sub u1">The simplest progressive overload tracker.</div><button className="btn-p u2" onClick={()=>setScreen("ob_info1")}>Get Started</button><div className="splash-si u2">Already have an account? <span onClick={()=>setScreen("main")}>Sign in</span></div></div></div></div>);
  if(screen==="ob_info1")return(<div className="app"><style>{S}</style><div className="topbar"><button className="back-btn" onClick={()=>setScreen("splash")}>←</button></div><div className="ob-prog"><div className="ob-track"><div className="ob-fill" style={{width:"5%"}}/></div></div><div className="ob-info-pg"><div className="ob-info-top"><div className="u0"><div className="ob-q">What is progressive overload?</div></div><div style={{display:"flex",justifyContent:"center"}} className="u1"><div className="bar-visual">{[{h:30},{h:44},{h:58},{h:70},{h:85}].map((b,i)=><div key={i} className={`bv-bar${i===4?" hi":""}`} style={{width:38,height:b.h}}/>)}</div></div><div className="ob-body u2">If you lift <b>slightly more each week</b> — more weight, more reps, or more sets — your muscles must keep adapting and growing.<br/><br/>It's the most proven principle in all of fitness.</div></div><div className="ob-info-bottom"><button className="btn-p u3" onClick={()=>setScreen("ob_info2")}>Next →</button></div></div></div>);
  if(screen==="ob_info2")return(<div className="app"><style>{S}</style><div className="topbar"><button className="back-btn" onClick={()=>setScreen("ob_info1")}>←</button></div><div className="ob-prog"><div className="ob-track"><div className="ob-fill" style={{width:"12%"}}/></div></div><div className="ob-info-pg"><div className="ob-info-top"><div className="u0"><div className="ob-q">Why most people stop progressing.</div></div><div className="u1"><div className="chart2">{[{lbl:"With tracking",pct:85,color:"var(--ch)"},{lbl:"Without tracking",pct:22,color:"var(--ink4)"}].map((r,i)=><div className="c2-row" key={i}><div className="c2-lbl">{r.lbl}</div><div className="c2-wrap"><div className="c2-bar" style={{width:`${r.pct}%`,background:r.color}}/></div><div className="c2-val" style={{color:r.color}}>{r.pct}%</div></div>)}</div></div><div className="ob-body u2">They train hard but <b>never write anything down.</b> Every session they're guessing the weight. Without a reference point, there's no overload.</div></div><div className="ob-info-bottom"><button className="btn-p u3" onClick={()=>setScreen("ob_bridge")}>Next →</button></div></div></div>);
  if(screen==="ob_bridge")return(<div className="app"><style>{S}</style><div className="topbar"><button className="back-btn" onClick={()=>setScreen("ob_info2")}>←</button></div><div className="ob-prog"><div className="ob-track"><div className="ob-fill" style={{width:"20%"}}/></div></div><div className="bridge-pg"><div className="u0"><div className="bridge-title">Now let's build<br/>your program.</div><div className="bridge-sub">Takes 60 seconds. Set up your split and exercises so you're ready to start tracking today.</div></div><button className="btn-p u1" onClick={()=>setScreen("ob_freq")}>Let's go →</button></div></div>);
  if(screen==="ob_freq")return(<div className="app"><style>{S}</style><div className="topbar"><button className="back-btn" onClick={()=>setScreen("ob_bridge")}>←</button></div><div className="ob-prog"><div className="ob-track"><div className="ob-fill" style={{width:"32%"}}/></div></div><div className="ob-pg"><div className="u0"><div className="ob-q">How often do<br/>you train?</div></div><div className="freq-list u1">{FREQ_OPTS.map(f=><div key={f.id} className={`freq-opt${obFreq===f.id?" on":""}`} onClick={()=>setObFreq(f.id)}><div className="freq-dots">{Array.from({length:f.dots},(_,i)=><div key={i} className="freq-dot"/>)}</div><div><div className="freq-title">{f.label}</div><div className="freq-sub">{f.sub}</div></div></div>)}</div><button className="btn-p u2" disabled={!obFreq} onClick={()=>setScreen("ob_split")}>Continue</button></div></div>);
  if(screen==="ob_split")return(<div className="app"><style>{S}</style><div className="topbar"><button className="back-btn" onClick={()=>setScreen(programs.length>0?"main":"ob_freq")}>←</button></div><div className="ob-prog"><div className="ob-track"><div className="ob-fill" style={{width:"50%"}}/></div></div><div className="ob-pg"><div className="u0"><div className="ob-q">Pick your split.</div><div style={{fontSize:14,color:"var(--ink3)",marginTop:4}}>All splits shown</div></div><div className="split-list u1">{ALL_SPLITS.map(s=><div key={s.id} className={`split-opt${obSplit?.id===s.id?" on":""}`} onClick={()=>{setObSplit(s);setObExs({});setObExStep(0);}}><div className="split-emoji">{s.emoji}</div><div style={{flex:1}}><div className="split-name">{s.name}</div><div className="split-desc">{s.desc}</div></div><div className="split-chk">✓</div></div>)}</div><button className="btn-p u2" disabled={!obSplit} onClick={()=>setScreen("ob_exercises")}>Continue</button></div></div>);
  if(screen==="ob_exercises"){const exLib=getExLib(curObDay);const curSel=obExs[curObDay]||[];const progress=50+((obExStep+1)/splitDays.length)*30;return(<div className="app"><style>{S}</style><div className="topbar"><button className="back-btn" onClick={()=>{obExStep>0?setObExStep(s=>s-1):setScreen("ob_split");}}>←</button><span style={{fontSize:12,fontWeight:600,color:"var(--ink3)"}}>{obExStep+1}/{splitDays.length}</span></div><div className="ob-prog"><div className="ob-track"><div className="ob-fill" style={{width:`${progress}%`}}/></div></div><div className="ob-pg"><div className="u0"><div className="ob-q">{curObDay} exercises.</div><div style={{fontSize:14,color:"var(--ink3)",marginTop:4}}>{curSel.length} selected</div></div><div className="ex-sel-list u1">{exLib.map(ex=>{const isOn=curSel.includes(ex);return(<div key={ex} className={`ex-opt${isOn?" on":""}`} onClick={()=>toggleObEx(curObDay,ex)}><div className="ex-opt-name" title={ex}>{ex}</div><div className="ex-opt-chk">✓</div></div>);})}</div><button className="btn-p u2" disabled={!curSel.length} onClick={()=>{if(isLastDay)addProgram();else setObExStep(i=>i+1);}}>{isLastDay?"Finish setup →":`Next — ${splitDays[obExStep+1]} →`}</button></div></div>);}

  if(screen==="achievements")return(<div className="app"><style>{S}</style><div className="topbar"><button className="back-btn" onClick={()=>setScreen("main")}>←</button></div><div className="achieve-scroll"><div className="achieve-hero"><div className="ah-blob"/><div className="ah-num">{streak}</div><div className="ah-label">Day Streak</div><div className="ah-best">Longest: {longestStreak} days</div></div><div className="badge-section-lbl">Unlocked</div><div className="badge-group">{BADGES.filter(b=>isBadgeUnlocked(b)).length===0&&<div style={{padding:"14px 20px",fontSize:13,color:"var(--ink3)"}}>Complete your first session to unlock badges.</div>}{BADGES.filter(b=>isBadgeUnlocked(b)).map(b=><div className="badge-row" key={b.id}><div className="badge-ico unlocked">{b.icon}</div><div><div className="badge-name">{b.name}</div><div className="badge-desc">{b.desc}</div><div className="badge-date">Unlocked</div></div></div>)}</div><div className="badge-section-lbl">Locked</div><div className="badge-group">{BADGES.filter(b=>!isBadgeUnlocked(b)).map(b=>{const hint=b.type==="sessions"?`${b.req-sessionLog.length} more sessions`:b.type==="streak"?`${b.req-streak} more days`:"Log a session";return<div className="badge-row" key={b.id}><div className="badge-ico locked">{b.icon}</div><div><div className="badge-name">{b.name}</div><div className="badge-desc">{b.desc}</div><div className="badge-hint">🔒 {hint} to go</div></div></div>;})}</div></div></div>);

  /* ════ SESSION SCREEN ════ */
  if(sessionScreen!==null){
    const dayName=sessionScreen;
    const exNames=getDayExs(dayName);
    const isEdit=editingDay===dayName;
    const {tot,done}=getSessSetCounts(dayName);
    const pct=tot>0?Math.round(done/tot*100):0;
    const hasAnyDone=anyDone(dayName);
    const quickAdds=getExLib(dayName).filter(e=>!exNames.includes(e)).slice(0,6);
    return(
      <div className="app"><style>{S}</style>
        {toast&&<div className="toast">{toast}</div>}
        <div className="sess-screen">
          <div className="sess-topbar">
            <button className="back-btn" onClick={()=>{setSessionScreen(null);setEditDay(null);setCollapsedDone({});}}>←</button>
            <div className="sess-title">{dayName}</div>
          </div>
          <div className="sess-counter">
            <div className="sess-count-row"><span className="sess-count-num">{done} / {tot}</span><span className="sess-count-total">sets</span></div>
            <div className="sess-prog-bar-wrap"><div className="sess-prog-bar" style={{width:`${pct}%`,background:pct===100?"var(--green)":"var(--orange)"}}/></div>
          </div>
          <div className="sess-divider"/>
          <div className="sess-scroll">
            {isEdit?(
              <div className="edit-mode">
                <div className="lbl" style={{marginBottom:10}}>Edit {dayName}</div>
                {exNames.length===0&&<div style={{fontSize:13,color:"var(--ink3)",padding:"8px 0"}}>No exercises. Add some below.</div>}
                {exNames.map(ex=><div className="edit-ex-row" key={ex}><div className="edit-ex-name" title={ex}>{ex}</div><button className="rm-btn" onClick={()=>removeExFromDay(dayName,ex)}>✕</button></div>)}
                <div className="edit-add-row"><input className="edit-inp" placeholder="Search or type exercise…" value={editSearch} onChange={e=>setEditS(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addExToDay(dayName,editSearch)}/><button className="edit-add-plus" onClick={()=>addExToDay(dayName,editSearch)}>+</button></div>
                {quickAdds.length>0&&<div className="qa-row">{quickAdds.map(s=><div key={s} className="qa" onClick={()=>addExToDay(dayName,s)} title={s}>+ {s.length>14?s.slice(0,12)+"…":s}</div>)}</div>}
                <button className="delete-workout-btn" onClick={()=>handleDeleteWorkout(dayName)}>🗑 Remove {dayName} workout</button>
              </div>
            ):(
              exNames.length===0?(
                <div style={{padding:"40px 20px",textAlign:"center"}}><div style={{fontSize:32,marginBottom:8}}>🏋️</div><div style={{fontSize:14,color:"var(--ink3)"}}>No exercises yet.<br/>Tap Edit to add some.</div></div>
              ):(
                exNames.map(ex=>{
                  const sets=wSets[ex]||[];const exDone=isExDone(ex);const isCollapsed=collapsedDone[ex]&&exDone;const muscleTag=MUSCLE_TAGS[ex];const bestStr=getBestSet(ex);
                  if(isCollapsed)return(<div key={ex} className="ex-block"><div className="ex-done-row" onClick={()=>setCollapsedDone(p=>({...p,[ex]:false}))}><div className="ex-done-tick">✓</div><div className="ex-done-name" title={ex}>{ex}</div>{bestStr&&<div className="ex-done-detail">{bestStr}</div>}</div></div>);
                  return(
                    <div key={ex} className="ex-block">
                      <div className="ex-hdr"><div className="ex-hdr-left"><div className="ex-name" title={ex}>{ex}</div>{muscleTag&&<span className="muscle-tag">{muscleTag}</span>}</div><div className="ex-last-lbl">Last</div></div>
                      {sets.length>0&&<div className="set-col-hdrs"><div className="sch">Set</div><div className="sch">Last</div><div className="sch">{units}</div><div className="sch">Reps</div><div className="sch"/></div>}
                      {sets.map((s,si)=>{const prW=isPR(ex,si,s.w,s.typed);return(
                        <div className="set-row" key={si}>
                          <div className="set-n">Set {si+1}</div>
                          <div className="set-last-num">{s.lastW!=="—"?`${s.lastW}×${s.lastR}`:"—"}</div>
                          <input className={`set-inp${prW?" pr":""}`} placeholder="0" value={s.w} onChange={e=>updateSet(ex,si,"w",e.target.value)} onFocus={e=>{if(!s.typed&&s.w)e.target.select();}} inputMode="decimal"/>
                          <input className="set-inp" placeholder="—" value={s.r} onChange={e=>updateSet(ex,si,"r",e.target.value)} onFocus={e=>{if(!s.typed&&s.r)e.target.select();}} inputMode="numeric"/>
                          <div className={`set-tick${s.done?" on":""}`} onClick={()=>tickSet(ex,si)}>✓</div>
                        </div>
                      );})}
                      <div className="ex-footer"><button className="add-set-btn" onClick={()=>addSet(ex)}>＋ Add Set</button>{sets.length>1&&<button className="rm-set-btn" onClick={()=>removeSet(ex,sets.length-1)}>− Remove Set</button>}</div>
                    </div>
                  );
                })
              )
            )}
          </div>
          <div className="sess-footer">
            <button className={`sess-edit-btn${isEdit?" active":""}`} onClick={()=>setEditDay(isEdit?null:dayName)}>{isEdit?"✓ Done":"Edit"}</button>
            {!isEdit&&<button className="sess-finish-btn" disabled={!hasAnyDone} onClick={()=>doFinish(dayName)}>Finish</button>}
          </div>
        </div>
      </div>
    );
  }

  /* ════ MAIN APP ════ */
  return(
    <div className="app"><style>{S}</style>
      {toast&&<div className="toast">{toast}</div>}
      <div className="topbar">
        <div className="brand">Overload</div>
        <button className="streak-btn" onClick={()=>setScreen("achievements")}><span style={{fontSize:16}}>🔥</span><span className="streak-num">{streak}</span></button>
      </div>

      {/* HOME */}
      {tab==="home"&&(
        <div className="home-scroll">
          <div className="ws-days u0">
            {DAYS_MON.map((_,i)=>{
              const isToday=i===todayMonIdx;const isViewing=viewingDayIdx===i;
              const done=isDayDone(i);const sessLabel=getDaySessionLabel(i);
              const trainedSess=(trainedDays[i]||[])[0];
              const todaySessEntry=trainedSess?sessionLog.find(s=>s.dayName===trainedSess&&new Date(s.date).toDateString()===new Date(today.getTime()-(todayMonIdx-i)*86400000).toDateString()):null;
              const isPartialDay=done&&todaySessEntry?.partial;
              const partialPct=isPartialDay?getSessPct(trainedSess):100;
              const filled=(partialPct/100)*CIRC;
              const dateColor=done?(isPartialDay?"var(--orange)":"var(--green)"):isToday||isViewing?"var(--orange)":"var(--ink3)";
              const dateFw=isToday||isViewing?800:done?700:600;
              return(
                <div key={i} className="ws-day" onClick={()=>{if(i<=todayMonIdx){setViewingDayIdx(i===todayMonIdx?null:i);}}}>
                  <div className="ws-day-name">{DAYS_MON[i][0]}</div>
                  <div className="ws-ring-wrap">
                    <svg className="ws-ring-svg" viewBox="0 0 38 38">
                      <circle cx="19" cy="19" r="16" fill="none" stroke="#D0D0D0" strokeWidth="1.5" strokeDasharray="4 3"/>
                      {isToday&&!done&&<circle cx="19" cy="19" r="16" fill="rgba(232,80,10,.08)" stroke="#E8500A" strokeWidth="3"/>}
                      {done&&<circle cx="19" cy="19" r="16" fill={isPartialDay?"none":"rgba(45,122,58,.07)"} stroke={isPartialDay?"var(--orange)":"var(--green)"} strokeWidth="3" strokeDasharray={isPartialDay?`${filled} ${CIRC}`:"none"} strokeDashoffset={CIRC/4} style={isPartialDay?{transform:"rotate(-90deg)",transformOrigin:"19px 19px"}:{}}/>}
                      {done&&isPartialDay&&<circle cx="19" cy="19" r="14" fill="var(--bg)"/>}
                    </svg>
                    <div className="ws-ring-inner"><span className="ws-date-num" style={{color:dateColor,fontWeight:dateFw}}>{weekDates[i]}</span></div>
                  </div>
                  <div className="ws-sess-lbl" style={{color:done?(isPartialDay?"var(--orange)":"var(--green)"):isToday||isViewing?"var(--orange)":"transparent",fontWeight:700}}>{sessLabel||"‎"}</div>
                </div>
              );
            })}
          </div>
          {isViewingPast&&(<div className="past-day-banner u1"><div className="pdb-text">📅 Viewing past day</div><button className="pdb-back" onClick={()=>setViewingDayIdx(null)}>Back to today</button></div>)}
          {!isViewingPast&&allDays.length>0&&<CtxLine text={ctxText} orange={ctxOrange}/>}
          {allDays.length===0?(
            <div className="empty-state u1"><div className="empty-state-icon">🏋️</div><div className="empty-state-text">No workouts yet.<br/>Add one below to start tracking.</div></div>
          ):(
            <div className="u1" style={{display:"flex",flexDirection:"column",gap:8}}>
              {allDays.map(dayName=>{
                const exNames=getDayExs(dayName);
                const viewIdx=viewingDayIdx!==null?viewingDayIdx:todayMonIdx;
                const isDoneToday=(trainedDays[viewIdx]||[]).includes(dayName);
                const todaySess=isDoneToday?sessionLog.find(s=>s.dayName===dayName&&new Date(s.date).toDateString()===new Date(today.getTime()-(todayMonIdx-viewIdx)*86400000).toDateString()):null;
                const isPartialToday=isDoneToday&&todaySess?.partial;
                const isFullToday=isDoneToday&&!isPartialToday;
                const pct=isDoneToday?getSessPct(dayName):0;
                const {tot,done}=getSessSetCounts(dayName);
                const inProgress=done>0&&!isDoneToday;
                const remaining=exNames.filter(ex=>(wSets[ex]||[]).every(s=>!s.done)).length;
                const barPct=isDoneToday?pct:tot>0?Math.round(done/tot*100):0;
                const showBar=barPct>0;
                const barColor=isFullToday?"var(--green)":"var(--orange)";
                const subtitle=exNames.slice(0,3).join(" · ")+(exNames.length>3?" …":"");
                return(
                  <div key={dayName} className="day-card" onClick={()=>setSessionScreen(dayName)}>
                    <div className="day-card-body">
                      <div className="dc-top">
                        <div className="dc-left">
                          <span className={`dc-name${isFullToday?" green":""}`}>{dayName}</span>
                          {isFullToday&&<span className="dc-pill-done">✓ Done</span>}
                          {isPartialToday&&<span style={{background:"var(--orange-l)",color:"var(--orange)",border:"1px solid var(--orange-m)",borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:600,whiteSpace:"nowrap",flexShrink:0}}>{pct}%</span>}
                        </div>
                        <div className="dc-right">
                          {inProgress&&remaining>0&&<span className="dc-remaining">{remaining} remaining</span>}
                          {!inProgress&&!isPartialToday&&<span className="dc-last">{getLastTrained(dayName)}</span>}
                          <div style={{color:"var(--ink3)",display:"flex"}}>{TI.chevron}</div>
                        </div>
                      </div>
                      {exNames.length>0&&<div className="dc-subtitle">{subtitle}</div>}
                    </div>
                    {showBar&&<div className="dc-bar-wrap"><div className="dc-bar" style={{width:`${barPct}%`,background:barColor}}/></div>}
                  </div>
                );
              })}
            </div>
          )}
          <div className="add-workout-row u2" onClick={()=>{setObSplit(null);setObExs({});setObExStep(0);setObFreq(null);setScreen(programs.length>0?"ob_split":"ob_freq");}}>
            <div style={{display:"flex",color:"var(--ch)"}}>{TI.plus}</div><span>Add Workout</span>
          </div>
        </div>
      )}

      {/* PROGRESS */}
      {tab==="progress"&&(
        <div className="prog-scroll">
          <div className="pr-card u0">
            <div className="pr-blob"/>
            {prData?(<><div className="pr-lbl">Your best improvement 🏆</div><div className="pr-ex-name">{prData.ex}</div><div className="pr-nums"><span className="pr-from">{prData.from}</span><span className="pr-arrow">→</span><span className="pr-to">{prData.to}</span><span className="pr-unit">{units}</span></div><div className="pr-sub">+{prData.gain}{units} improvement</div></>):(
              <><div className="pr-lbl">Your best this month 🏆</div><div style={{fontSize:14,color:"rgba(255,255,255,.45)",position:"relative",marginTop:4}}>Log sessions to see your best improvement here.</div></>
            )}
          </div>
          <div className="stats-row u1">
            <div className="stat-mini"><div className="stat-mini-lbl">Sessions</div><div className="stat-mini-val">{sessionLog.length}</div><div className="stat-mini-sub">Total</div></div>
            <div className="stat-mini"><div className="stat-mini-lbl">Streak 🔥</div><div className="stat-mini-val">{streak}</div><div className="stat-mini-sub">Days</div></div>
            <div className="stat-mini"><div className="stat-mini-lbl">Sets</div><div className="stat-mini-val">{weekStats.sets}</div><div className="stat-mini-sub">All time</div></div>
          </div>
          {allDays.length>0&&(
            <div className="u2">
              <div className="lbl">Strength Curves</div>
              <div className="split-cards-wrap"><div className="split-cards-row">
                {allDays.map(dayName=>(
                  <div className="split-card" key={dayName}>
                    <div className="split-card-name">{dayName}</div>
                    <div className="split-card-exs">{getDayExs(dayName).slice(0,6).map(ex=>(
                      <div key={ex} className={`split-card-ex${selectedProgressEx===ex?" active":""}`} title={ex} onClick={()=>setSelEx(selectedProgressEx===ex?null:ex)}>{ex.length>16?ex.slice(0,14)+"…":ex}</div>
                    ))}</div>
                  </div>
                ))}
              </div></div>
              {selectedProgressEx&&progGraphData&&(
                <div className="prog-graph-wrap" style={{marginTop:12}}>
                  <div className="pge-top"><div className="pge-name">{selectedProgressEx}</div>{progGraphGain&&parseFloat(progGraphGain)>0&&<div className="pge-gain">{progGraphGain} ↑</div>}</div>
                  <div className="pge-graph"><MiniGraph data={progGraphData}/></div>
                  {progGraphData.length>=2&&<div className="pge-range"><div className="pge-start">{progGraphData[0].kg}{units} — start</div><div className="pge-end">{progGraphData[progGraphData.length-1].kg}{units} latest</div></div>}
                </div>
              )}
            </div>
          )}
          <div className="u3">
            <div className="lbl">History</div>
            <div className="cal-card"><CalendarView sessionLog={sessionLog}/></div>
            {sessionLog.length>0&&(
              <div style={{marginTop:14}}>
                <div className="lbl">Recent Sessions</div>
                {sessionLog.slice(0,5).map(sess=>(
                  <div className="hist-sess" key={sess.id}>
                    <div className="hist-sess-hdr" onClick={()=>setExpS(p=>({...p,[sess.id]:!p[sess.id]}))}>
                      <div><div className="hist-sess-date">{fmtDate(sess.date)}</div><div className="hist-sess-name">{sess.dayName} · {sess.exercises.length} exercises{sess.partial?" · Partial":""}</div></div>
                      <span className={`hist-sess-chev${expandedSess[sess.id]?" open":""}`}>▼</span>
                    </div>
                    {expandedSess[sess.id]&&(<div className="hist-sess-body">{sess.exercises.map((ex,ei)=>(<div key={ei}><div className="hist-ex-name">{ex.name}</div>{ex.sets.map((s,si)=><div className="hist-set-row" key={si}><div className="hist-set-n">Set {si+1}</div><div className="hist-set-val">{s.w} {units} × {s.r} reps</div></div>)}</div>))}</div>)}
                  </div>
                ))}
              </div>
            )}
            {sessionLog.length===0&&<div className="empty-state" style={{marginTop:10}}><div className="empty-state-icon">📋</div><div className="empty-state-text">Your sessions will appear here.</div></div>}
          </div>
        </div>
      )}

      {/* PROFILE */}
      {tab==="profile"&&(
        <div className="profile-scroll">
          <div className="profile-title">Profile</div>
          <div className="profile-user-card">
            <div className="puc-av">{ini(userName)}</div>
            <div style={{flex:1}}>
              {editingName?(<input className="puc-name-inp" value={nameInput} onChange={e=>setNameInput(e.target.value)} autoFocus onBlur={async()=>{if(nameInput.trim()){setUserName(nameInput.trim());if(user)await updateProfile({name:nameInput.trim()});}setEditName(false);}} onKeyDown={e=>{if(e.key==="Enter"){if(nameInput.trim())setUserName(nameInput.trim());setEditName(false);}}}/>):(
                <div className="puc-name-row" onClick={()=>{setNameInput(userName);setEditName(true);}}><div className="puc-name">{userName}</div><div style={{color:"var(--ink3)",display:"flex"}}>{TI.edit}</div></div>
              )}
              <div className="puc-sub">{user?`Signed in as ${user.email}`:"Guest — data not saved"}</div>
              <div className="puc-streak-pill">🔥 {streak} day streak</div>
            </div>
          </div>
          {!user&&(
            <div style={{margin:"0 0 4px",background:"var(--orange-l)",borderTop:"1px solid var(--orange-m)",borderBottom:"1px solid var(--orange-m)",padding:"12px 20px"}}>
              <div style={{fontSize:13,color:"var(--orange)",fontWeight:700,marginBottom:4}}>You're using guest mode</div>
              <div style={{fontSize:12,color:"var(--ink3)",marginBottom:8}}>Your data is saved locally. Create an account to back it up to the cloud.</div>
              <button className="btn-p" style={{padding:"10px",fontSize:13}} onClick={()=>{ setSkipAuth(false); setScreen("splash"); }}>Create account</button>
            </div>
          )}
          <div className="profile-section-lbl">Achievements</div>
          <div className="profile-group">
            <div className="profile-row" onClick={()=>setScreen("achievements")}><div className="profile-row-icon"><span>🔥</span></div><div className="profile-row-label">Current Streak</div><div className="profile-row-value">{streak} days</div><div className="profile-row-chev">{TI.chevron}</div></div>
            <div className="profile-row" onClick={()=>setScreen("achievements")}><div className="profile-row-icon">{TI.trophy}</div><div className="profile-row-label">Badges</div><div className="profile-row-value">{BADGES.filter(b=>isBadgeUnlocked(b)).length} unlocked</div><div className="profile-row-chev">{TI.chevron}</div></div>
          </div>
          <div className="profile-section-lbl">Preferences</div>
          <div className="profile-group">
            <div className="profile-row"><div className="profile-row-icon">{TI.weight}</div><div className="profile-row-label">Units</div><div className="units-toggle"><div className={`ut-opt${units==="kg"?" on":""}`} onClick={async()=>{setUnits("kg");if(user)await updateProfile({units:"kg"});}}>kg</div><div className={`ut-opt${units==="lbs"?" on":""}`} onClick={async()=>{setUnits("lbs");if(user)await updateProfile({units:"lbs"});}}>lbs</div></div></div>
            <div className="profile-row"><div className="profile-row-icon">{TI.bell}</div><div className="profile-row-label">Training reminders</div><button className={`notif-toggle${notifEnabled?" on":""}`} onClick={async()=>{setNotif(p=>!p);if(user)await updateProfile({notif_enabled:!notifEnabled});}}><div className="notif-knob"/></button></div>
          </div>
          <div className="profile-section-lbl">Support & Legal</div>
          <div className="profile-group">
            {[{icon:TI.megaphone,label:"Request a Feature"},{icon:TI.mail,label:"Support Email"},{icon:TI.doc,label:"Terms & Conditions"},{icon:TI.shield,label:"Privacy Policy"}].map((r,i)=><div className="profile-row" key={i}><div className="profile-row-icon">{r.icon}</div><div className="profile-row-label">{r.label}</div><div className="profile-row-chev">{TI.chevron}</div></div>)}
          </div>
          <div className="profile-section-lbl">Account Actions</div>
          <div className="profile-group">
            {user&&<div className="profile-row" onClick={async()=>{await signOut();setSkipAuth(false);setScreen("splash");setPrograms([]);setSessionLog([]);setWSets({});setStreak(0);}}><div className="profile-row-icon">{TI.logout}</div><div className="profile-row-label">Logout</div><div className="profile-row-chev">{TI.chevron}</div></div>}
            <div className="profile-row"><div className="profile-row-icon">{TI.trash}</div><div className="profile-row-label" style={{color:"#cc3333"}}>Delete Account</div><div className="profile-row-chev">{TI.chevron}</div></div>
          </div>
          <div className="profile-version">VERSION 1.0.0</div>
        </div>
      )}

      <div className="tab-bar">
        {[{id:"home",icon:TI.home,label:"Home"},{id:"progress",icon:TI.progress,label:"Progress"},{id:"profile",icon:TI.profile,label:"Profile"}].map(t=>(
          <button key={t.id} className={`tab-item${tab===t.id?" on":""}`} onClick={()=>setTab(t.id)}>
            <div className="tab-icon">{t.icon}</div>
            <div className="tab-label">{t.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
