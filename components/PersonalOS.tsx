'use client';
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const GlobalStyles = () => (
  <>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { height: 100%; background: #0e0f11; }
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-thumb { background: #2a2a2e; border-radius: 99px; }
      input, select, textarea { outline: none; font-family: inherit; }
      button { cursor: pointer; font-family: inherit; }
      ::placeholder { color: #55555f; }

      .gc {
        position: relative;
        background: linear-gradient(160deg, rgba(255,255,255,0.058) 0%, rgba(255,255,255,0.018) 45%, rgba(255,255,255,0.007) 100%);
        backdrop-filter: blur(14px) saturate(1.5);
        -webkit-backdrop-filter: blur(14px) saturate(1.5);
        border-radius: 13px;
        border: 1px solid rgba(255,255,255,0.088);
        box-shadow:
          0 1px 0 0 rgba(255,255,255,0.13) inset,
          0 -1px 0 0 rgba(0,0,0,0.28) inset,
          1px 0 0 0 rgba(255,255,255,0.035) inset,
          0 6px 28px rgba(0,0,0,0.38),
          0 1px 6px rgba(0,0,0,0.22);
        overflow: hidden;
        padding: 16px 18px;
      }
      .gc::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(255,255,255,0.038) 0%, transparent 52%);
        border-radius: 13px;
        pointer-events: none;
        z-index: 0;
      }
      .gc::after {
        content: '';
        position: absolute;
        top: 0; left: 0;
        width: 60%; height: 50%;
        background: radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.055) 0%, transparent 70%);
        pointer-events: none;
        z-index: 0;
        border-radius: 13px 0 0 0;
      }
      .gc > * { position: relative; z-index: 1; }

      .glass-nav {
        background: rgba(12,13,15,0.88);
        backdrop-filter: blur(24px) saturate(1.8);
        -webkit-backdrop-filter: blur(24px) saturate(1.8);
        border-bottom: 1px solid rgba(255,255,255,0.068);
        box-shadow: 0 1px 0 rgba(255,255,255,0.035) inset;
      }

      .glass-modal-bg {
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.58);
        backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        z-index: 1000;
      }
      .glass-modal {
        background: linear-gradient(150deg, rgba(28,29,33,0.98) 0%, rgba(18,19,22,0.98) 100%);
        backdrop-filter: blur(40px);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px;
        width: 420px;
        padding: 26px;
        box-shadow: 0 1px 0 rgba(255,255,255,0.13) inset, 0 32px 80px rgba(0,0,0,0.7);
      }

      .gi {
        display: block; width: 100%;
        background: rgba(0,0,0,0.28);
        border: 1px solid rgba(255,255,255,0.11);
        border-radius: 7px;
        color: #f0f0f4;
        padding: 9px 11px;
        font-size: 12px;
        font-family: 'Inter', sans-serif;
        margin-bottom: 9px;
        box-shadow: 0 1px 0 rgba(255,255,255,0.035) inset;
        transition: border-color 0.15s;
      }
      .gi:focus { border-color: rgba(255,255,255,0.22); }

      .gsb {
        width: 100%;
        background: linear-gradient(180deg, rgba(238,238,244,0.96) 0%, rgba(214,214,222,0.96) 100%);
        color: #0e0f11; border: none; border-radius: 8px;
        padding: 10px; font-size: 13px; font-weight: 600;
        font-family: 'Inter', sans-serif; margin-top: 4px;
        box-shadow: 0 1px 0 rgba(255,255,255,0.85) inset, 0 2px 10px rgba(0,0,0,0.32);
      }

      .secb {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.09);
        border-radius: 8px; color: #a0a0aa;
        font-size: 12px; font-weight: 500;
        font-family: 'Inter', sans-serif;
        padding: 6px 14px;
        box-shadow: 0 1px 0 rgba(255,255,255,0.055) inset;
        transition: all 0.15s;
      }
      .secb:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.13); color: #f0f0f4; }

      .tab-btn {
        background: none; border: none;
        border-bottom: 2px solid transparent;
        font-family: 'Inter', sans-serif;
        font-size: 12px; font-weight: 500;
        padding: 0 15px; height: 46px;
        color: #7a7a84; transition: color 0.15s;
      }
      .tab-btn.act { color: #f0f0f4; border-bottom-color: #4ade80; }

      .fc {
        background: transparent; border: 1px solid transparent;
        border-radius: 7px; font-family: 'Inter', sans-serif;
        font-size: 11px; font-weight: 500;
        padding: 4px 11px; color: #7a7a84;
        text-transform: capitalize; transition: all 0.15s;
      }
      .fc.act {
        background: rgba(255,255,255,0.055);
        border-color: rgba(255,255,255,0.09);
        color: #f0f0f4;
        box-shadow: 0 1px 0 rgba(255,255,255,0.055) inset;
      }

      .hc {
        border-radius: 9px;
        border: 1px solid rgba(255,255,255,0.055);
        background: linear-gradient(145deg, rgba(255,255,255,0.038) 0%, rgba(255,255,255,0.01) 100%);
        box-shadow: 0 1px 0 rgba(255,255,255,0.075) inset, 0 2px 8px rgba(0,0,0,0.18);
        padding: 10px 11px; cursor: pointer; transition: all 0.18s;
      }
      .hc:hover { border-color: rgba(255,255,255,0.09); }
      .hc.done {
        border-color: rgba(74,222,128,0.22);
        background: linear-gradient(145deg, rgba(74,222,128,0.075) 0%, rgba(74,222,128,0.028) 100%);
        box-shadow: 0 1px 0 rgba(74,222,128,0.14) inset, 0 2px 12px rgba(74,222,128,0.06);
      }
    `}</style>
  </>
);

// ── TOKENS ────────────────────────────────────────────────────────────────────
const A = "#4ade80";
const RED = "#f87171";
const ORA = "#fb923c";
const BLU = "#60a5fa";
const YEL = "#fbbf24";

const ui   = { fontFamily: "'Inter', sans-serif" };
const ser  = { fontFamily: "'Instrument Serif', serif" };
const mon  = { fontFamily: "'JetBrains Mono', monospace" };

// Text hierarchy — all contrast-tested against #1a1b1e card background
const TX  = "#f0f0f4";   // primary — headings, names, numbers
const TM  = "#a8a8b4";   // secondary — descriptions, subtitles, values
const TD  = "#888894";   // tertiary — labels, timestamps, category tags (was too dark)
const BOR = "rgba(255,255,255,0.07)";

// ── HELPERS ───────────────────────────────────────────────────────────────────
const MO = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const ML = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function pad(n: number) { return String(n).padStart(2,"0"); }
function useNow() {
  const [t,setT] = useState(new Date());
  useEffect(()=>{ const id=setInterval(()=>setT(new Date()),1000); return ()=>clearInterval(id); },[]);
  return t;
}

// ── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function Lbl({n,t,r}:{n:number,t:string,r?:React.ReactNode}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <span style={{...ui,fontSize:9,fontWeight:600,color:"#7a7a86",letterSpacing:"0.13em",textTransform:"uppercase"}}>{pad(n)} // {t}</span>
      {r&&<span style={{...ui,fontSize:9,color:TM}}>{r}</span>}
    </div>
  );
}

function Divider() {
  return <div style={{height:1,background:BOR,margin:"12px 0"}} />;
}

function Bar({pct, glow=true}:{pct:number,glow?:boolean}) {
  return (
    <div style={{height:2,background:"rgba(255,255,255,0.05)",borderRadius:99,boxShadow:"0 1px 0 rgba(0,0,0,0.3) inset"}}>
      <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:`linear-gradient(90deg,${A},#22c55e)`,borderRadius:99,boxShadow:glow?`0 0 7px rgba(74,222,128,0.38)`:""}} />
    </div>
  );
}

function Chk({on,toggle}:{on:boolean,toggle:()=>void}) {
  return (
    <div onClick={toggle} style={{width:14,height:14,borderRadius:4,flexShrink:0,marginTop:2,cursor:"pointer",border:`1px solid ${on?"rgba(74,222,128,0.55)":"rgba(255,255,255,0.11)"}`,background:on?"linear-gradient(145deg,#4ade80,#22c55e)":"rgba(255,255,255,0.03)",boxShadow:on?"0 1px 0 rgba(255,255,255,0.28) inset,0 2px 6px rgba(74,222,128,0.22)":"0 1px 0 rgba(255,255,255,0.06) inset",transition:"all 0.14s",display:"flex",alignItems:"center",justifyContent:"center"}}>
      {on&&<span style={{color:"#081208",fontSize:8,fontWeight:700,lineHeight:1}}>✓</span>}
    </div>
  );
}

function Spark({data,col=A,h=44,w=200}:{data:number[],col?:string,h?:number,w?:number}) {
  const mn=Math.min(...data), mx=Math.max(...data);
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-mn)/(mx-mn+1))*(h-4)}`).join(" ");
  const area=`0,${h} ${pts} ${w},${h}`;
  return (
    <svg width={w} height={h} style={{display:"block",overflow:"visible"}}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col} stopOpacity="0.16"/>
          <stop offset="100%" stopColor={col} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#sg)"/>
      <polyline points={pts} fill="none" stroke={col} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

function Modal({title,onClose,children}:{title:string,onClose:()=>void,children:React.ReactNode}) {
  return (
    <div className="glass-modal-bg" onClick={onClose}>
      <div className="glass-modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{...ui,fontSize:13,fontWeight:600,color:TX}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:TM,fontSize:17,lineHeight:1}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── DATA ──────────────────────────────────────────────────────────────────────
const sparkData=[600,900,800,1200,1600,1500,1900,2200,2100,2600,2900,3294];

const initTasks=[
  {id:1,title:"Follow up with All South Air — retainer proposal",cat:"BUSINESS",priority:"urgent",done:false},
  {id:2,title:"Deploy Gears of Grace site to Vercel",cat:"BUSINESS",priority:"high",done:false},
  {id:3,title:"Cold call 10 businesses in Marietta",cat:"BUSINESS",priority:"high",done:false},
  {id:4,title:"Set up Web3Forms on AMS site",cat:"BUSINESS",priority:"normal",done:false},
  {id:5,title:"Research AI chatbot upsell pricing",cat:"PERSONAL",priority:"normal",done:false},
];

const initContacts=[
  {id:1,name:"Marcus Webb",company:"All South Air",status:"negotiating",last:"2026-06-02",next:"Send retainer agreement"},
  {id:2,name:"Danny Reyes",company:"AMS Mobile Mechanic",status:"active",last:"2026-06-01",next:"Monthly check-in"},
  {id:3,name:"Pastor James Okafor",company:"Gears of Grace",status:"active",last:"2026-05-30",next:"Final site review"},
  {id:4,name:"Tony Marsh",company:"Sky Limits Hand Wash",status:"pitched",last:"2026-05-28",next:"Follow up on demo"},
  {id:5,name:"Linda Cho",company:"Cho's Korean BBQ",status:"cold",last:"2026-05-15",next:"Cold call + demo pitch"},
];

const initFinances=[
  {id:1,desc:"AMS Mobile Mechanic — retainer",type:"income",amount:150,date:"2026-06-01",cat:"Retainer"},
  {id:2,desc:"Gears of Grace — site build",type:"income",amount:800,date:"2026-06-02",cat:"Project"},
  {id:3,desc:"Vercel Pro",type:"expense",amount:20,date:"2026-06-01",cat:"Software"},
  {id:4,desc:"Namecheap domains x3",type:"expense",amount:36,date:"2026-06-03",cat:"Domains"},
  {id:5,desc:"All South Air — deposit",type:"income",amount:400,date:"2026-06-03",cat:"Project"},
];

const initHabits=[
  {id:1,name:"Cold calls (10)",cat:"Business",streak:3,target:5,done:false},
  {id:2,name:"Gym",cat:"Fitness",streak:7,target:7,done:false},
  {id:3,name:"Read 20 pages",cat:"Learning",streak:2,target:7,done:false},
  {id:4,name:"Work on IS300",cat:"Personal",streak:0,target:3,done:false},
  {id:5,name:"Guitar practice",cat:"Personal",streak:5,target:7,done:false},
  {id:6,name:"Wind-down",cat:"Health",streak:1,target:7,done:false},
];

const wGoals=["Close All South Air retainer","Get Gears of Grace live","Build 3 new demo sites"];
const mGoals=["Hit $3,000 MRR","Sign 2 new retainer clients","Launch AI chatbot upsell"];

const calEv=[
  {day:3,time:"10:00",label:"Gears of Grace final review"},
  {day:4,time:"14:00",label:"All South Air call"},
  {day:6,time:"09:00",label:"Cold call block — Marietta"},
];

const initJournal=[
  {id:1,date:"2026-06-03",mood:4,entry:"Good day. Got the Gears of Grace site 80% done. Need to push harder on cold calls this week."},
  {id:2,date:"2026-06-02",mood:3,entry:"Slow morning. Had a good call with Marcus at All South Air — he seems close to closing."},
];

const stCfg={
  cold:{label:"Cold",color:"#888894",bg:"rgba(100,100,110,0.16)"},
  pitched:{label:"Pitched",color:YEL,bg:"rgba(251,191,36,0.1)"},
  negotiating:{label:"Negotiating",color:ORA,bg:"rgba(251,146,60,0.1)"},
  closed:{label:"Closed",color:A,bg:"rgba(74,222,128,0.1)"},
  active:{label:"Active",color:A,bg:"rgba(74,222,128,0.1)"},
};
const prC={urgent:RED,high:ORA,normal:BLU,low:"#787884"};

// ═══════════════════════════════════════════════════════════════════════════════
// HOME TAB — exact layout from screenshot
// ═══════════════════════════════════════════════════════════════════════════════
function HomeTab({tasks,setTasks,now}) {
  const hr=now.getHours();
  const gr=hr<12?"Good morning,":hr<17?"Good afternoon,":"Good evening,";

  // build this week Mon–Sun
  const ws=new Date(now); ws.setDate(now.getDate()-now.getDay()+1);
  const week=Array.from({length:7},(_,i)=>{const d=new Date(ws);d.setDate(ws.getDate()+i);return d;});

  const [habits,setHabits]=useState(initHabits);
  const [cap,setCap]=useState("");

  const top5=tasks.filter(t=>!t.done)
    .sort((a,b)=>({urgent:0,high:1,normal:2,low:3}[a.priority]-{urgent:0,high:1,normal:2,low:3}[b.priority]))
    .slice(0,5);

  const togT=id=>setTasks(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t));
  const togH=id=>setHabits(p=>p.map(h=>h.id===id?{...h,done:!h.done}:h));
  const addCap=()=>{if(!cap.trim())return;setTasks(p=>[...p,{id:Date.now(),title:cap,cat:"PERSONAL",priority:"normal",done:false}]);setCap("");};
  const doneH=habits.filter(h=>h.done).length;

  // ── EXACT GRID from screenshot ─────────────────────────────────────────────
  // Cols:  ~24%        ~48%           ~28%
  // Row1:  OPERATOR    SESSION        GOALS (rowspan 2)
  // Row2:  FINANCE     HABITS         NUTRITION (rowspan 1)
  // Row3:  TODAY-KEY   CALENDAR (spans col2+col3)

  return (
    <div style={{
      padding:"10px",
      display:"grid",
      gridTemplateColumns:"23% 1fr 26%",
      gridTemplateRows:"auto auto auto",
      gap:"8px",
      minHeight:"calc(100vh - 46px)",
    }}>

      {/* ── OPERATOR  col1 row1 ── */}
      <div className="gc" style={{gridColumn:"1",gridRow:"1"}}>
        <Lbl n={1} t="Operator" r={<span style={{color:A,fontSize:9}}>● Online</span>}/>
        <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:14}}>
          <div style={{width:42,height:42,borderRadius:9,background:"linear-gradient(145deg,rgba(255,255,255,0.075),rgba(255,255,255,0.018))",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 1px 0 rgba(255,255,255,0.11) inset",flexShrink:0}}>🧑</div>
          <div>
            <div style={{...ui,fontSize:13,fontWeight:500,color:TX}}>Mitchel</div>
            <div style={{...ui,fontSize:10,color:TM,marginTop:2}}>Founder · Atlanta, GA</div>
          </div>
        </div>
        <Divider/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,paddingTop:2}}>
          <div>
            <div style={{...ui,fontSize:9,color:TM,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>Focus</div>
            <div style={{...ui,fontSize:11,color:TM,lineHeight:1.5}}>Building an empire.</div>
          </div>
          <div>
            <div style={{...ui,fontSize:9,color:TM,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>Streak</div>
            <div style={{display:"flex",alignItems:"baseline",gap:3}}>
              <span style={{...ui,fontSize:24,fontWeight:600,color:TX}}>4</span>
              <span style={{...ui,fontSize:10,color:TM}}>days</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SESSION  col2 row1 ── */}
      <div className="gc" style={{gridColumn:"2",gridRow:"1"}}>
        <Lbl n={2} t="Session" r="UTC−4"/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div>
            <div style={{fontSize:26,lineHeight:1.15,marginBottom:5}}>
              <span style={{...ui,fontWeight:300,color:TM}}>{gr} </span>
              <span style={{...ser,fontStyle:"italic",color:TX,fontSize:28}}>Mitchel.</span>
            </div>
            <div style={{...ui,fontSize:10,color:TM}}>{DL[now.getDay()]}, {ML[now.getMonth()]} {now.getDate()}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{...ui,fontSize:36,fontWeight:300,color:TX,letterSpacing:"-0.02em",lineHeight:1}}>{pad(now.getHours())}:{pad(now.getMinutes())}</div>
            <div style={{...ui,fontSize:9,color:TM,marginTop:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>Local time</div>
          </div>
        </div>
        <div style={{display:"flex",gap:7}}>
          <div style={{flex:1,display:"flex",alignItems:"center",background:"rgba(0,0,0,0.26)",border:"1px solid rgba(255,255,255,0.065)",borderRadius:8,paddingLeft:11,gap:7,boxShadow:"0 1px 0 rgba(255,255,255,0.035) inset"}}>
            <span style={{...ui,fontSize:11,color:TM}}>⌘</span>
            <input value={cap} onChange={e=>setCap(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCap()} placeholder="Capture a thought or task..." style={{background:"none",border:"none",color:TX,fontSize:12,fontFamily:"'Inter',sans-serif",flex:1,padding:"9px 0"}}/>
          </div>
          <button className="secb" onClick={addCap}>Capture</button>
        </div>
      </div>

      {/* ── GOALS  col3 row1+2 ── */}
      <div className="gc" style={{gridColumn:"3",gridRow:"1 / 3"}}>
        <Lbl n={3} t="Goals"/>
        <div style={{...ui,fontSize:9,color:TM,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>This week</div>
        {wGoals.map((g,i)=>(
          <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:9}}>
            <div style={{width:13,height:13,borderRadius:3,border:"1px solid rgba(255,255,255,0.095)",background:"rgba(255,255,255,0.028)",flexShrink:0,marginTop:1,boxShadow:"0 1px 0 rgba(255,255,255,0.055) inset"}}/>
            <span style={{...ui,fontSize:11,color:TM,lineHeight:1.5}}>{g}</span>
          </div>
        ))}
        <Divider/>
        <div style={{...ui,fontSize:9,color:TM,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>This month</div>
        {mGoals.map((g,i)=>(
          <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:9}}>
            <div style={{width:13,height:13,borderRadius:3,border:"1px solid rgba(255,255,255,0.095)",background:"rgba(255,255,255,0.028)",flexShrink:0,marginTop:1,boxShadow:"0 1px 0 rgba(255,255,255,0.055) inset"}}/>
            <span style={{...ui,fontSize:11,color:TM,lineHeight:1.5}}>{g}</span>
          </div>
        ))}
        <Divider/>
        <div style={{...ui,fontSize:9,color:TM,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7}}>MRR Progress</div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
          <span style={{...ui,fontSize:11,color:TM}}>$150</span>
          <span style={{...ui,fontSize:11,color:TM}}>$3,000</span>
        </div>
        <Bar pct={5}/>
        <div style={{...ui,fontSize:10,color:TM,marginTop:5}}>5% — $2,850 to go</div>
      </div>

      {/* ── FINANCE PULSE  col1 row2 ── */}
      <div className="gc" style={{gridColumn:"1",gridRow:"2"}}>
        <Lbl n={4} t="Finance Pulse" r={<span style={{color:A}}>+69.4%</span>}/>
        <div style={{...ui,fontSize:9,color:TM,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>Net this month</div>
        <div style={{...ui,fontSize:28,fontWeight:600,color:TX,letterSpacing:"-0.02em",marginBottom:8}}>$1,294</div>
        <Spark data={sparkData} w={180}/>
        <Divider/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div>
            <div style={{...ui,fontSize:9,color:TM,marginBottom:3}}>Daily</div>
            <div style={{...ui,fontSize:13,fontWeight:500,color:A}}>+$150</div>
          </div>
          <div>
            <div style={{...ui,fontSize:9,color:TM,marginBottom:3}}>Monthly</div>
            <div style={{...ui,fontSize:13,fontWeight:500,color:A}}>+$1,294</div>
          </div>
        </div>
      </div>

      {/* ── HABITS  col2 row2 ── */}
      <div className="gc" style={{gridColumn:"2",gridRow:"2"}}>
        <Lbl n={5} t="Habits" r={`${doneH}/${habits.length}`}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
          {(habits??[]).map(h=>(
            <div key={h.id} className={`hc ${h.done?"done":""}`} onClick={()=>togH(h.id)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div style={{width:12,height:12,borderRadius:3,border:`1px solid ${h.done?"rgba(74,222,128,0.48)":"rgba(255,255,255,0.1)"}`,background:h.done?"linear-gradient(145deg,#4ade80,#22c55e)":"rgba(255,255,255,0.028)",boxShadow:h.done?"0 1px 0 rgba(255,255,255,0.28) inset":"0 1px 0 rgba(255,255,255,0.055) inset",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {h.done&&<span style={{color:"#081208",fontSize:7,fontWeight:700}}>✓</span>}
                </div>
                <span style={{...ui,fontSize:10,color:TM}}>{h.streak}d</span>
              </div>
              <div style={{...ui,fontSize:11,fontWeight:500,color:h.done?TX:TM,lineHeight:1.3,marginBottom:3}}>{h.name}</div>
              <div style={{...ui,fontSize:10,color:TM,marginBottom:7}}>{h.cat}</div>
              <Bar pct={(h.streak/h.target)*100}/>
            </div>
          ))}
        </div>
      </div>

      {/* ── NUTRITION  col3 row2  (separate panel, stacked under goals) ── */}
      {/* NOTE: goals spans row1+2, so nutrition is NOT in col3 row2 separately.
          Looking at screenshot more carefully: right column top=GOALS, bottom=NUTRITION
          but goals does NOT span all of row2. NUTRITION is its own panel in col3 row2. 
          We handle this by making goals span row1 only and adding nutrition in row2 col3. */}

      {/* ── TODAY — KEY  col1 row3 ── */}
      <div className="gc" style={{gridColumn:"1",gridRow:"3"}}>
        <Lbl n={6} t="Today — Key" r={`${top5.length}`}/>
        {top5.map(t=>(
          <div key={t.id} style={{display:"flex",alignItems:"flex-start",gap:9,marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${BOR}`}}>
            <Chk on={t.done} toggle={()=>togT(t.id)}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{...ui,fontSize:11,color:t.done?TD:TX,textDecoration:t.done?"line-through":"none",lineHeight:1.4}}>{t.title}</div>
              <div style={{...ui,fontSize:9,color:TM,marginTop:2}}>{t.cat}</div>
            </div>
            <span style={{fontSize:6,color:prC[t.priority],flexShrink:0,marginTop:4}}>●</span>
          </div>
        ))}
      </div>

      {/* ── CALENDAR  col2+3 row3 ── */}
      <div className="gc" style={{gridColumn:"2 / 4",gridRow:"3"}}>
        <Lbl n={7} t="Calendar" r={`${ML[now.getMonth()]} ${now.getFullYear()}`}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:16}}>
          {week.map((d,i)=>{
            const isTod=d.toDateString()===now.toDateString();
            const hasEv=calEv.some(e=>e.day===i);
            return (
              <div key={i} style={{textAlign:"center"}}>
                <div style={{...ui,fontSize:9,color:TM,marginBottom:7,letterSpacing:"0.05em"}}>{"MTWTFSS"[i]}</div>
                <div style={{width:30,height:30,borderRadius:7,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",background:isTod?"linear-gradient(150deg,rgba(245,245,252,0.94),rgba(210,210,220,0.92))":"rgba(255,255,255,0.028)",border:isTod?"none":"1px solid rgba(255,255,255,0.055)",boxShadow:isTod?"0 1px 0 rgba(255,255,255,0.88) inset,0 2px 9px rgba(0,0,0,0.32)":"0 1px 0 rgba(255,255,255,0.038) inset",...ui,fontSize:12,fontWeight:isTod?600:400,color:isTod?"#0e0f11":TM}}>
                  {d.getDate()}
                </div>
                {hasEv&&<div style={{width:4,height:4,borderRadius:"50%",background:BLU,margin:"5px auto 0",boxShadow:"0 0 5px rgba(96,165,250,0.5)"}}/>}
              </div>
            );
          })}
        </div>
        <div style={{height:1,background:BOR,marginBottom:12}}/>
        <div style={{...ui,fontSize:9,color:TM,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Today</div>
        {calEv.map((e,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:9}}>
            <span style={{...mon,fontSize:10,color:TM,flexShrink:0,width:40}}>{e.time}</span>
            <div style={{flex:1,height:1,background:BOR}}/>
            <span style={{...ui,fontSize:11,color:TM}}>{e.label}</span>
          </div>
        ))}
        <div style={{display:"flex",alignItems:"center",gap:12,marginTop:4}}>
          <span style={{...mon,fontSize:10,color:A,flexShrink:0,width:40}}>Now</span>
          <div style={{flex:1,height:1,background:`linear-gradient(90deg,${A}55,${A}08)`}}/>
          <span style={{...mon,fontSize:10,color:A}}>{pad(now.getHours())}:{pad(now.getMinutes())}</span>
        </div>
      </div>

    </div>
  );
}

// ─── fix goals to row1 only and add nutrition panel ──────────────────────────
// Patch HomeTab to have the correct 4-column right panel behavior.
// The screenshot shows: right column = GOALS (row1) + NUTRITION (row2), not goals spanning both.
// Let me rewrite HomeTab with a corrected 4-area right column.

function HomeTabFixed({tasks,setTasks,now}) {
  const hr=now.getHours();
  const gr=hr<12?"Good morning,":hr<17?"Good afternoon,":"Good evening,";
  const ws=new Date(now); ws.setDate(now.getDate()-now.getDay()+1);
  const week=Array.from({length:7},(_,i)=>{const d=new Date(ws);d.setDate(ws.getDate()+i);return d;});
  const [habits,setHabits]=useState([]);
  const [cap,setCap]=useState("");
  const [cal,setCal]=useState(0);
  const [meals,setMeals]=useState([]);
  const [mealIn,setMealIn]=useState("");
  const [loading,setLoading]=useState(true);
  const [finances,setFinances]=useState([]);
  const [wGoals,setWGoals]=useState([]);
  const [mGoals,setMGoals]=useState([]);
  const [briefing,setBriefing]=useState("");
  const [briefingLoading,setBriefingLoading]=useState(true);

  const currentMonth=now.toISOString().slice(0,7);

  useEffect(()=>{
    fetch("/api/briefing")
      .then(r=>r.json())
      .then(d=>{setBriefing(d.briefing??"");setBriefingLoading(false);})
      .catch(()=>setBriefingLoading(false));
  },[]);

  useEffect(()=>{
    const fetchAll=async()=>{
      const [habitsRes,finRes,goalsRes]=await Promise.all([
        supabase.from("habits").select("*").order("id"),
        supabase.from("finances").select("*")
          .gte("date",`${currentMonth}-01`)
          .lte("date",`${currentMonth}-31`),
        supabase.from("goals").select("*").order("id"),
      ]);
      setHabits(Array.isArray(habitsRes.data)?habitsRes.data:[]);
      setFinances(Array.isArray(finRes.data)?finRes.data:[]);
      const goals=Array.isArray(goalsRes.data)?goalsRes.data:[];
      setWGoals(goals.filter(g=>g.type==="weekly").map(g=>g.title));
      setMGoals(goals.filter(g=>g.type==="monthly").map(g=>g.title));
      setLoading(false);
    };
    fetchAll();
  },[currentMonth]);

  const top5=(tasks??[]).filter(t=>!t.done)
    .sort((a,b)=>({urgent:0,high:1,normal:2,low:3}[a.priority]-{urgent:0,high:1,normal:2,low:3}[b.priority]))
    .slice(0,5);

  const togT=async(id)=>{
    setTasks(p=>(p??[]).map(t=>t.id===id?{...t,done:true}:t));
    await supabase.from("tasks").update({status:"done"}).eq("id",id);
  };
  const togH=async(id)=>{
    const h=(habits??[]).find(h=>h.id===id);
    if(!h)return;
    const next=!h.done;
    setHabits(p=>(p??[]).map(h=>h.id===id?{...h,done:next}:h));
    await supabase.from("habits").update({done:next}).eq("id",id);
  };
  const addCap=async()=>{
    if(!cap.trim())return;
    const {data}=await supabase.from("tasks").insert({title:cap.trim(),category:"PERSONAL",priority:"normal",status:"todo"}).select().single();
    if(data)setTasks(p=>[...(p??[]),{...data,cat:"PERSONAL",done:false}]);
    setCap("");
  };
  const logMeal=()=>{if(!mealIn.trim())return;setMeals(p=>[...p,mealIn]);setCal(c=>c+420);setMealIn("");};
  const doneH=(habits??[]).filter(h=>h.done).length;
  const inc=(finances??[]).filter(f=>f.type==="income").reduce((a,b)=>a+b.amount,0);
  const exp=(finances??[]).filter(f=>f.type==="expense").reduce((a,b)=>a+b.amount,0);
  const net=inc-exp;

  if(loading)return(
    <div style={{padding:"10px",display:"grid",gridTemplateColumns:"23% 1fr 26%",gridTemplateRows:"auto auto auto",gap:"8px",minHeight:"calc(100vh - 46px)"}}>
      {[...Array(6)].map((_,i)=>(
        <div key={i} className="gc" style={{opacity:0.4}}>
          <div style={{height:8,background:"rgba(255,255,255,0.07)",borderRadius:4,marginBottom:10,width:"55%"}}/>
          <div style={{height:6,background:"rgba(255,255,255,0.04)",borderRadius:4,width:"80%",marginBottom:7}}/>
          <div style={{height:6,background:"rgba(255,255,255,0.04)",borderRadius:4,width:"65%"}}/>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{padding:"10px",display:"grid",gridTemplateColumns:"23% 1fr 26%",gridTemplateRows:"auto auto auto",gap:"8px",minHeight:"calc(100vh - 46px)"}}>

      {/* col1 row1 — OPERATOR */}
      <div className="gc" style={{gridColumn:1,gridRow:1}}>
        <Lbl n={1} t="Operator" r={<span style={{color:A,fontSize:9}}>● Online</span>}/>
        <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:14}}>
          <div style={{width:42,height:42,borderRadius:9,background:"linear-gradient(145deg,rgba(255,255,255,0.075),rgba(255,255,255,0.018))",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 1px 0 rgba(255,255,255,0.11) inset",flexShrink:0}}>🧑</div>
          <div>
            <div style={{...ui,fontSize:13,fontWeight:500,color:TX}}>Mitchel</div>
            <div style={{...ui,fontSize:10,color:TM,marginTop:2}}>Founder · Atlanta, GA</div>
          </div>
        </div>
        <Divider/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,paddingTop:2}}>
          <div>
            <div style={{...ui,fontSize:9,color:TM,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>Focus</div>
            <div style={{...ui,fontSize:11,color:TM,lineHeight:1.5}}>Building an empire.</div>
          </div>
          <div>
            <div style={{...ui,fontSize:9,color:TM,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>Streak</div>
            <div style={{display:"flex",alignItems:"baseline",gap:3}}>
              <span style={{...ui,fontSize:24,fontWeight:600,color:TX}}>4</span>
              <span style={{...ui,fontSize:10,color:TM}}>days</span>
            </div>
          </div>
        </div>
      </div>

      {/* col2 row1 — SESSION */}
      <div className="gc" style={{gridColumn:2,gridRow:1}}>
        <Lbl n={2} t="Session" r="UTC−4"/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:briefing||briefingLoading?12:18}}>
          <div>
            <div style={{fontSize:26,lineHeight:1.15,marginBottom:5}}>
              <span style={{...ui,fontWeight:300,color:TM}}>{gr} </span>
              <span style={{...ser,fontStyle:"italic",color:TX,fontSize:28}}>Mitchel.</span>
            </div>
            <div style={{...ui,fontSize:10,color:TM}}>{DL[now.getDay()]}, {ML[now.getMonth()]} {now.getDate()}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{...ui,fontSize:36,fontWeight:300,color:TX,letterSpacing:"-0.02em",lineHeight:1}}>{pad(now.getHours())}:{pad(now.getMinutes())}</div>
            <div style={{...ui,fontSize:9,color:TM,marginTop:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>Local time</div>
          </div>
        </div>
        {briefingLoading&&(
          <div style={{...ui,fontSize:11,color:TM,marginBottom:14,fontStyle:"italic"}}>Generating briefing...</div>
        )}
        {!briefingLoading&&briefing&&(
          <div style={{...ui,fontSize:12,color:TM,lineHeight:1.65,marginBottom:14,paddingBottom:14,borderBottom:`1px solid rgba(255,255,255,0.06)`,whiteSpace:"pre-wrap"}}>{briefing}</div>
        )}
        <div style={{display:"flex",gap:7}}>
          <div style={{flex:1,display:"flex",alignItems:"center",background:"rgba(0,0,0,0.26)",border:"1px solid rgba(255,255,255,0.065)",borderRadius:8,paddingLeft:11,gap:7,boxShadow:"0 1px 0 rgba(255,255,255,0.035) inset"}}>
            <span style={{...ui,fontSize:11,color:TM}}>⌘</span>
            <input value={cap} onChange={e=>setCap(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCap()} placeholder="Capture a thought or task..." style={{background:"none",border:"none",color:TX,fontSize:12,fontFamily:"'Inter',sans-serif",flex:1,padding:"9px 0"}}/>
          </div>
          <button className="secb" onClick={addCap}>Capture</button>
        </div>
      </div>

      {/* col3 row1 — GOALS */}
      <div className="gc" style={{gridColumn:3,gridRow:1}}>
        <Lbl n={3} t="Goals"/>
        <div style={{...ui,fontSize:9,color:TM,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>This week</div>
        {wGoals.map((g,i)=>(
          <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:9}}>
            <div style={{width:13,height:13,borderRadius:3,border:"1px solid rgba(255,255,255,0.09)",background:"rgba(255,255,255,0.028)",flexShrink:0,marginTop:1,boxShadow:"0 1px 0 rgba(255,255,255,0.05) inset"}}/>
            <span style={{...ui,fontSize:11,color:TM,lineHeight:1.5}}>{g}</span>
          </div>
        ))}
        <Divider/>
        <div style={{...ui,fontSize:9,color:TM,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>This month</div>
        {mGoals.map((g,i)=>(
          <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:9}}>
            <div style={{width:13,height:13,borderRadius:3,border:"1px solid rgba(255,255,255,0.09)",background:"rgba(255,255,255,0.028)",flexShrink:0,marginTop:1,boxShadow:"0 1px 0 rgba(255,255,255,0.05) inset"}}/>
            <span style={{...ui,fontSize:11,color:TM,lineHeight:1.5}}>{g}</span>
          </div>
        ))}
      </div>

      {/* col1 row2 — FINANCE PULSE */}
      <div className="gc" style={{gridColumn:1,gridRow:2}}>
        <Lbl n={4} t="Finance Pulse" r={<span style={{color:net>=0?A:RED}}>{net>=0?"+":"-"}${Math.abs(net).toLocaleString()}</span>}/>
        <div style={{...ui,fontSize:9,color:TM,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>Net this month</div>
        <div style={{...ui,fontSize:28,fontWeight:600,color:net>=0?TX:RED,letterSpacing:"-0.02em",marginBottom:8}}>${net.toLocaleString()}</div>
        <Spark data={sparkData} w={180}/>
        <Divider/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div>
            <div style={{...ui,fontSize:9,color:TM,marginBottom:3}}>Income</div>
            <div style={{...ui,fontSize:13,fontWeight:500,color:A}}>+${inc.toLocaleString()}</div>
          </div>
          <div>
            <div style={{...ui,fontSize:9,color:TM,marginBottom:3}}>Expenses</div>
            <div style={{...ui,fontSize:13,fontWeight:500,color:RED}}>-${exp.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* col2 row2 — HABITS */}
      <div className="gc" style={{gridColumn:2,gridRow:2}}>
        <Lbl n={5} t="Habits" r={`${doneH}/${(habits??[]).length}`}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
          {(habits??[]).map(h=>(
            <div key={h.id} className={`hc ${h.done?"done":""}`} onClick={()=>togH(h.id)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div style={{width:12,height:12,borderRadius:3,border:`1px solid ${h.done?"rgba(74,222,128,0.48)":"rgba(255,255,255,0.1)"}`,background:h.done?"linear-gradient(145deg,#4ade80,#22c55e)":"rgba(255,255,255,0.028)",boxShadow:h.done?"0 1px 0 rgba(255,255,255,0.28) inset":"0 1px 0 rgba(255,255,255,0.055) inset",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {h.done&&<span style={{color:"#081208",fontSize:7,fontWeight:700}}>✓</span>}
                </div>
                <span style={{...ui,fontSize:10,color:TM}}>{h.streak}d</span>
              </div>
              <div style={{...ui,fontSize:11,fontWeight:500,color:h.done?TX:TM,lineHeight:1.3,marginBottom:3}}>{h.name}</div>
              <div style={{...ui,fontSize:10,color:TM,marginBottom:7}}>{h.cat}</div>
              <Bar pct={(h.streak/h.target)*100}/>
            </div>
          ))}
        </div>
      </div>

      {/* col3 row2 — NUTRITION */}
      <div className="gc" style={{gridColumn:3,gridRow:2}}>
        <Lbl n={6} t="Nutrition" r="Today"/>
        <div style={{...ui,fontSize:36,fontWeight:300,color:cal>0?TX:TD,letterSpacing:"-0.02em",marginBottom:2}}>{cal}</div>
        <div style={{...ui,fontSize:9,color:TM,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.08em"}}>kcal today</div>
        <Bar pct={(cal/2400)*100}/>
        <div style={{...ui,fontSize:9,color:TM,marginTop:8,marginBottom:12}}>0g protein · 0g carbs · 0g fat</div>
        <div style={{...ui,fontSize:9,color:TM,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Log a meal</div>
        <div style={{display:"flex",gap:6}}>
          <input value={mealIn} onChange={e=>setMealIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&logMeal()} placeholder="e.g. chicken, rice, broccoli" className="gi" style={{marginBottom:0,flex:1,fontSize:11}}/>
          <button className="secb" style={{padding:"0 10px",fontSize:16,borderRadius:7}} onClick={logMeal}>+</button>
        </div>
        {meals.length>0&&(
          <div style={{marginTop:10}}>
            {meals.map((m,i)=><div key={i} style={{...ui,fontSize:10,color:TM,marginBottom:4}}>· {m}</div>)}
          </div>
        )}
        {meals.length===0&&<div style={{...ui,fontSize:10,color:TM,marginTop:10}}>No meals logged yet.</div>}
      </div>

      {/* col1 row3 — TODAY KEY */}
      <div className="gc" style={{gridColumn:1,gridRow:3}}>
        <Lbl n={7} t="Today — Key" r={`${top5.length}`}/>
        {top5.map(t=>(
          <div key={t.id} style={{display:"flex",alignItems:"flex-start",gap:9,marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${BOR}`}}>
            <Chk on={t.done} toggle={()=>togT(t.id)}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{...ui,fontSize:11,color:t.done?TD:TX,textDecoration:t.done?"line-through":"none",lineHeight:1.4}}>{t.title}</div>
              <div style={{...ui,fontSize:9,color:TM,marginTop:2}}>{t.cat}</div>
            </div>
            <span style={{fontSize:6,color:prC[t.priority],flexShrink:0,marginTop:4}}>●</span>
          </div>
        ))}
      </div>

      {/* col2+3 row3 — CALENDAR */}
      <div className="gc" style={{gridColumn:"2 / 4",gridRow:3}}>
        <Lbl n={8} t="Calendar" r={`${ML[now.getMonth()]} ${now.getFullYear()}`}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:14}}>
          {week.map((d,i)=>{
            const isTod=d.toDateString()===now.toDateString();
            const hasEv=calEv.some(e=>e.day===i);
            return (
              <div key={i} style={{textAlign:"center"}}>
                <div style={{...ui,fontSize:9,color:TM,marginBottom:7,letterSpacing:"0.05em"}}>{"MTWTFSS"[i]}</div>
                <div style={{width:30,height:30,borderRadius:7,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",background:isTod?"linear-gradient(150deg,rgba(245,245,252,0.94),rgba(210,210,220,0.92))":"rgba(255,255,255,0.028)",border:isTod?"none":"1px solid rgba(255,255,255,0.055)",boxShadow:isTod?"0 1px 0 rgba(255,255,255,0.88) inset,0 2px 9px rgba(0,0,0,0.32)":"0 1px 0 rgba(255,255,255,0.038) inset",...ui,fontSize:12,fontWeight:isTod?600:400,color:isTod?"#0e0f11":TM}}>
                  {d.getDate()}
                </div>
                {hasEv&&<div style={{width:4,height:4,borderRadius:"50%",background:BLU,margin:"5px auto 0",boxShadow:"0 0 5px rgba(96,165,250,0.5)"}}/>}
              </div>
            );
          })}
        </div>
        <Divider/>
        <div style={{...ui,fontSize:9,color:TM,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Today</div>
        {calEv.map((e,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:9}}>
            <span style={{...mon,fontSize:10,color:TM,flexShrink:0,width:40}}>{e.time}</span>
            <div style={{flex:1,height:1,background:BOR}}/>
            <span style={{...ui,fontSize:11,color:TM}}>{e.label}</span>
          </div>
        ))}
        <div style={{display:"flex",alignItems:"center",gap:12,marginTop:4}}>
          <span style={{...mon,fontSize:10,color:A,flexShrink:0,width:40}}>Now</span>
          <div style={{flex:1,height:1,background:`linear-gradient(90deg,${A}55,${A}08)`}}/>
          <span style={{...mon,fontSize:10,color:A}}>{pad(now.getHours())}:{pad(now.getMinutes())}</span>
        </div>
      </div>

    </div>
  );
}

// ═══ CRM ══════════════════════════════════════════════════════════════════════
function CRMTab({contacts,setContacts}) {
  const blank={name:"",company:"",status:"cold",last:"",next:""};
  const [show,setShow]=useState(false);
  const [form,setForm]=useState(blank);
  const [editing,setEditing]=useState(null); // contact being edited
  const [editForm,setEditForm]=useState(blank);

  const add=async()=>{
    if(!form.name)return;
    const {data}=await supabase.from("contacts").insert({
      name:form.name,company:form.company||null,status:form.status,
      last_contact:form.last||null,next_action:form.next||null,
    }).select().single();
    if(data)setContacts(p=>[...(p??[]),{...data,last:data.last_contact,next:data.next_action}]);
    setForm(blank);
    setShow(false);
  };

  const openEdit=(c)=>{
    setEditing(c.id);
    setEditForm({name:c.name,company:c.company||"",status:c.status,last:c.last||"",next:c.next||""});
  };

  const saveEdit=async()=>{
    if(!editForm.name)return;
    const updates={
      name:editForm.name,company:editForm.company||null,status:editForm.status,
      last_contact:editForm.last||null,next_action:editForm.next||null,
    };
    const {data}=await supabase.from("contacts").update(updates).eq("id",editing).select().single();
    if(data)setContacts(p=>(p??[]).map(c=>c.id===editing?{...data,last:data.last_contact,next:data.next_action}:c));
    setEditing(null);
  };

  const formFields=[["name","Full name *"],["company","Company"],["last","Last contact (YYYY-MM-DD)"],["next","Next action"]];

  return (
    <div style={{padding:10}}>
      <div className="gc">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <Lbl n={1} t="CRM — Clients & Leads"/>
          <button className="secb" onClick={()=>setShow(true)}>+ Add Contact</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 130px 130px 1fr 32px",borderBottom:`1px solid ${BOR}`,paddingBottom:9,marginBottom:3}}>
          {["Name","Company","Status","Last Contact","Next Action",""].map(h=>(
            <div key={h} style={{...ui,fontSize:9,color:TM,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.08em"}}>{h}</div>
          ))}
        </div>
        {(contacts??[]).map(c=>{
          const cfg=stCfg[c.status]||stCfg.cold;
          return (
            <div key={c.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 130px 130px 1fr 32px",padding:"12px 0",borderBottom:`1px solid ${BOR}`,alignItems:"center"}}>
              <div style={{...ui,fontSize:13,color:TX,fontWeight:500}}>{c.name}</div>
              <div style={{...ui,fontSize:12,color:TM}}>{c.company}</div>
              <div><span style={{...ui,fontSize:10,fontWeight:500,color:cfg.color,background:cfg.bg,padding:"3px 9px",borderRadius:99,border:`1px solid ${cfg.color}22`}}>{cfg.label}</span></div>
              <div style={{...mon,fontSize:10,color:TM}}>{c.last}</div>
              <div style={{...ui,fontSize:11,color:TM}}>{c.next}</div>
              <button onClick={()=>openEdit(c)} style={{background:"none",border:"none",color:TM,fontSize:12,cursor:"pointer",padding:"2px 6px",borderRadius:5,transition:"color 0.15s"}} onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color=TX} onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color=TM}>✎</button>
            </div>
          );
        })}
        {(contacts??[]).length===0&&<div style={{...ui,fontSize:12,color:TM,padding:"20px 0",textAlign:"center"}}>No contacts yet. Add one above.</div>}
      </div>

      {show&&<Modal title="New Contact" onClose={()=>setShow(false)}>
        {formFields.map(([k,p])=>(
          <input key={k} className="gi" placeholder={p} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}/>
        ))}
        <select className="gi" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
          {["cold","pitched","negotiating","closed","active"].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <button className="gsb" onClick={add}>Add Contact</button>
      </Modal>}

      {editing&&<Modal title="Edit Contact" onClose={()=>setEditing(null)}>
        {formFields.map(([k,p])=>(
          <input key={k} className="gi" placeholder={p} value={editForm[k]} onChange={e=>setEditForm(f=>({...f,[k]:e.target.value}))}/>
        ))}
        <select className="gi" value={editForm.status} onChange={e=>setEditForm(f=>({...f,status:e.target.value}))}>
          {["cold","pitched","negotiating","closed","active"].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <button className="gsb" onClick={saveEdit}>Save Changes</button>
      </Modal>}
    </div>
  );
}

// ═══ BRAIN ════════════════════════════════════════════════════════════════════
function BrainTab() {
  const [tasks,setTasks]=useState([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("all");
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({title:"",cat:"BUSINESS",priority:"normal"});

  useEffect(()=>{
    supabase.from("tasks").select("*").order("priority")
      .then(({data})=>{
        setTasks((data??[]).map(r=>({...r,cat:r.category??'PERSONAL',done:r.status==='done'})));
        setLoading(false);
      })
      .then(undefined,()=>setLoading(false));
  },[]);

  const add=async()=>{
    if(!form.title)return;
    const {data}=await supabase.from("tasks").insert({
      title:form.title,category:form.cat,priority:form.priority,status:"todo",
    }).select().single();
    if(data)setTasks(p=>[...(p??[]),{...data,cat:form.cat,done:false}]);
    setForm({title:"",cat:"BUSINESS",priority:"normal"});
    setShow(false);
  };

  const tog=async(id)=>{
    const t=(tasks??[]).find(t=>t.id===id);
    if(!t)return;
    const next=!t.done;
    setTasks(p=>(p??[]).map(t=>t.id===id?{...t,done:next}:t));
    await supabase.from("tasks").update({status:next?"done":"todo"}).eq("id",id);
  };

  const fil=filter==="all"?(tasks??[])
    :filter==="done"?(tasks??[]).filter(t=>t.done)
    :(tasks??[]).filter(t=>!t.done&&t.priority===filter);

  if(loading)return(
    <div style={{padding:10}}>
      <div className="gc">
        <Lbl n={1} t="Brain — All Tasks"/>
        {[...Array(5)].map((_,i)=>(
          <div key={i} style={{display:"flex",gap:11,padding:"12px 0",borderBottom:`1px solid ${BOR}`,alignItems:"center"}}>
            <div style={{width:14,height:14,borderRadius:4,background:"rgba(255,255,255,0.05)",flexShrink:0}}/>
            <div style={{flex:1,height:8,background:"rgba(255,255,255,0.05)",borderRadius:4,width:`${55+i*8}%`}}/>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{padding:10}}>
      <div className="gc">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Lbl n={1} t="Brain — All Tasks"/>
            <div style={{display:"flex",gap:3,marginTop:-12}}>
              {["all","urgent","high","normal","done"].map(f=>(
                <button key={f} className={`fc ${filter===f?"act":""}`} onClick={()=>setFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
          <button className="secb" onClick={()=>setShow(true)}>+ Add Task</button>
        </div>
        {fil.length===0&&<div style={{...ui,fontSize:12,color:TM,padding:"16px 0",textAlign:"center"}}>No tasks here.</div>}
        {fil.map(t=>(
          <div key={t.id} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"12px 0",borderBottom:`1px solid ${BOR}`}}>
            <Chk on={t.done} toggle={()=>tog(t.id)}/>
            <div style={{flex:1}}>
              <div style={{...ui,fontSize:13,color:t.done?TD:TX,textDecoration:t.done?"line-through":"none",lineHeight:1.4}}>{t.title}</div>
              <div style={{...ui,fontSize:9,color:TM,marginTop:3}}>{t.cat}</div>
            </div>
            <span style={{...ui,fontSize:11,fontWeight:500,color:prC[t.priority]??TM,flexShrink:0,textTransform:"capitalize"}}>{t.priority}</span>
          </div>
        ))}
      </div>
      {show&&<Modal title="New Task" onClose={()=>setShow(false)}>
        <input className="gi" placeholder="Task title *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
        <select className="gi" value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}>
          {["BUSINESS","PERSONAL","CONTENT","LEARNING","HEALTH"].map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select className="gi" value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
          {["urgent","high","normal","low"].map(p=><option key={p} value={p}>{p}</option>)}
        </select>
        <button className="gsb" onClick={add}>Add Task</button>
      </Modal>}
    </div>
  );
}

// ═══ FINANCE ══════════════════════════════════════════════════════════════════
function FinanceTab() {
  const [fin,setFin]=useState([]);
  const [loading,setLoading]=useState(true);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({desc:"",type:"income",amount:"",cat:"Project",date:""});

  useEffect(()=>{
    supabase.from("finances").select("*").order("date",{ascending:false})
      .then(({data})=>{
        setFin((data??[]).map(r=>({...r,desc:r.description,cat:r.category})));
        setLoading(false);
      })
      .then(undefined,()=>setLoading(false));
  },[]);

  const safe=fin??[];
  const inc=safe.filter(f=>f.type==="income").reduce((a,b)=>a+b.amount,0);
  const exp=safe.filter(f=>f.type==="expense").reduce((a,b)=>a+b.amount,0);
  const add=async()=>{
    if(!form.desc||!form.amount)return;
    const {data}=await supabase.from("finances").insert({
      description:form.desc,type:form.type,amount:parseFloat(form.amount),
      category:form.cat,date:form.date||new Date().toISOString().split("T")[0],
    }).select().single();
    if(data)setFin(p=>[{...data,desc:data.description,cat:data.category},...(p??[])]);
    setForm({desc:"",type:"income",amount:"",cat:"Project",date:""});
    setShow(false);
  };
  if(loading)return <div style={{padding:10,color:TM,fontFamily:"'Inter',sans-serif",fontSize:12}}>Loading finances...</div>;
  return (
    <div style={{padding:10,display:"grid",gridTemplateColumns:"220px 1fr 270px",gap:8}}>
      <div className="gc">
        <Lbl n={1} t="Summary"/>
        <div style={{marginBottom:18}}><div style={{...ui,fontSize:9,color:TM,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>Income</div><div style={{...ui,fontSize:30,fontWeight:600,color:A,letterSpacing:"-0.02em"}}>${inc.toLocaleString()}</div></div>
        <div style={{marginBottom:18}}><div style={{...ui,fontSize:9,color:TM,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>Expenses</div><div style={{...ui,fontSize:30,fontWeight:600,color:RED,letterSpacing:"-0.02em"}}>${exp.toLocaleString()}</div></div>
        <Divider/>
        <div><div style={{...ui,fontSize:9,color:TM,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>Net Profit</div><div style={{...ui,fontSize:30,fontWeight:600,color:TX,letterSpacing:"-0.02em"}}>${(inc-exp).toLocaleString()}</div></div>
      </div>
      <div className="gc">
        <Lbl n={2} t="MRR Goal — $3,000" r="5%"/>
        <Bar pct={5}/>
        <div style={{...ui,fontSize:11,color:TM,marginBottom:20,marginTop:6}}>$150 current · $2,850 remaining</div>
        <Spark data={sparkData} h={56} w={300}/>
        <div style={{...ui,fontSize:9,color:TM,marginTop:6,marginBottom:20,textTransform:"uppercase",letterSpacing:"0.1em"}}>6-month revenue trajectory</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {[["Retainers","$150/mo"],["Projects","$1,200"],["Pipeline","$2,000+"]].map(([k,v])=>(
            <div key={k} style={{borderTop:`1px solid ${BOR}`,paddingTop:11}}>
              <div style={{...ui,fontSize:9,color:TM,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.08em"}}>{k}</div>
              <div style={{...ui,fontSize:14,fontWeight:500,color:TX}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="gc">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <Lbl n={3} t="Transactions"/>
          <button className="secb" style={{fontSize:11,padding:"4px 11px",marginTop:-3}} onClick={()=>setShow(true)}>+ Log</button>
        </div>
        {[...safe].reverse().map(f=>(
          <div key={f.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:11,paddingBottom:11,borderBottom:`1px solid ${BOR}`}}>
            <div><div style={{...ui,fontSize:11,color:TM,lineHeight:1.4}}>{f.desc}</div><div style={{...mon,fontSize:9,color:TM,marginTop:2}}>{f.date} · {f.cat}</div></div>
            <div style={{...ui,fontSize:12,fontWeight:500,color:f.type==="income"?A:RED,flexShrink:0,marginLeft:12}}>{f.type==="income"?"+":"−"}${f.amount}</div>
          </div>
        ))}
      </div>
      {show&&<Modal title="Log Transaction" onClose={()=>setShow(false)}>
        <input className="gi" placeholder="Description *" value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}/>
        <select className="gi" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}><option value="income">Income</option><option value="expense">Expense</option></select>
        <input className="gi" placeholder="Amount" type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/>
        <input className="gi" placeholder="Category" value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}/>
        <input className="gi" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
        <button className="gsb" onClick={add}>Log Transaction</button>
      </Modal>}
    </div>
  );
}

// ═══ JOURNAL ══════════════════════════════════════════════════════════════════
function JournalTab() {
  const [entries,setEntries]=useState([]);
  const [text,setText]=useState("");
  const [mood,setMood]=useState(3);
  const ME=["","😔","😐","🙂","😊","🔥"];
  const today=new Date().toISOString().split("T")[0];

  useEffect(()=>{
    supabase.from("journal").select("*").order("date",{ascending:false})
      .then(({data})=>setEntries(Array.isArray(data)?data:[]));
  },[]);

  const save=async()=>{
    if(!text.trim())return;
    const {data}=await supabase.from("journal").insert({date:today,mood,entry:text.trim()}).select().single();
    if(data)setEntries(p=>[data,...(p??[])]);
    setText("");setMood(3);
  };
  const prompts=["What's one thing that moved the needle today?","What did you avoid that you shouldn't have?","What would make tomorrow a win?","Who do you need to follow up with?","What are you grateful for today?"];
  return (
    <div style={{padding:10,display:"grid",gridTemplateColumns:"1fr 270px",gap:8,minHeight:"calc(100vh - 46px)"}}>
      <div className="gc">
        <Lbl n={1} t="Journal" r={today}/>
        <div style={{...ui,fontSize:9,color:TM,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7}}>Today's entry</div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write freely. What happened today?" className="gi" style={{height:150,resize:"none",marginBottom:12,lineHeight:1.7,fontSize:13}}/>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <span style={{...ui,fontSize:10,color:TM}}>Mood</span>
          {[1,2,3,4,5].map(m=><button key={m} onClick={()=>setMood(m)} style={{background:"none",border:"none",fontSize:18,opacity:mood===m?1:0.22,transition:"opacity 0.14s"}}>{ME[m]}</button>)}
        </div>
        <button className="gsb" style={{width:"auto",padding:"9px 26px"}} onClick={save}>Save Entry</button>
        <Divider/>
        <div style={{...ui,fontSize:9,color:TM,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>Past Entries</div>
        {(entries??[]).map(e=>(
          <div key={e.id} style={{marginBottom:18,paddingBottom:18,borderBottom:`1px solid ${BOR}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
              <span style={{...mon,fontSize:10,color:TM}}>{e.date}</span>
              <span style={{fontSize:14}}>{ME[e.mood]}</span>
            </div>
            <p style={{...ui,fontSize:12,color:TM,lineHeight:1.7}}>{e.entry}</p>
          </div>
        ))}
      </div>
      <div className="gc">
        <Lbl n={2} t="Prompts"/>
        <div style={{...ui,fontSize:9,color:TM,marginBottom:12}}>Click to add to entry</div>
        {prompts.map((p,i)=>(
          <div key={i} onClick={()=>setText(prev=>prev?prev+"\n\n"+p+"\n":p+"\n")} style={{...ui,fontSize:11,color:TM,marginBottom:11,paddingBottom:11,borderBottom:`1px solid ${BOR}`,lineHeight:1.5,cursor:"pointer"}}>
            <span style={{color:TM,marginRight:7}}>→</span>{p}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ HEALTH ═══════════════════════════════════════════════════════════════════
function HealthTab() {
  const today=new Date().toISOString().split("T")[0];
  const [cal,setCal]=useState(0);
  const [protein,setProtein]=useState(0);
  const [carbs,setCarbs]=useState(0);
  const [fat,setFat]=useState(0);
  const [meals,setMeals]=useState([]);
  const [mIn,setMIn]=useState("");
  const [estimating,setEstimating]=useState(false);
  const [sleep,setSleep]=useState(0);
  const [sIn,setSIn]=useState("");
  const [habits,setHabits]=useState([]);
  const [rowExists,setRowExists]=useState(false);

  useEffect(()=>{
    supabase.from("health_logs").select("*").eq("date",today).maybeSingle()
      .then(({data})=>{
        if(data){
          setCal(data.calories||0);
          setProtein(data.protein||0);
          setCarbs(data.carbs||0);
          setFat(data.fat||0);
          setSleep(data.sleep||0);
          setMeals(Array.isArray(data.meals)?data.meals:[]);
          setRowExists(true);
        }
      });
    supabase.from("habits").select("*").order("id")
      .then(({data})=>setHabits(Array.isArray(data)?data:[]));
  },[today]);

  const upsertHealth=async(updates)=>{
    if(rowExists){
      await supabase.from("health_logs").update(updates).eq("date",today);
    }else{
      await supabase.from("health_logs").insert({date:today,...updates});
      setRowExists(true);
    }
  };

  const logM=async()=>{
    if(!mIn.trim())return;
    const name=mIn;
    setMIn("");
    setEstimating(true);
    let addCal=0,addProtein=0,addCarbs=0,addFat=0;
    try{
      const res=await fetch("/api/nutrition",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({meal:name})});
      const n=await res.json();
      addCal=n.calories||0;addProtein=n.protein||0;addCarbs=n.carbs||0;addFat=n.fat||0;
    }catch{
      addCal=420;addProtein=32;
    }finally{
      setEstimating(false);
    }
    const newCal=cal+addCal;
    const newProtein=protein+addProtein;
    const newCarbs=carbs+addCarbs;
    const newFat=fat+addFat;
    const newMeals=[...meals,{name,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}];
    setCal(newCal);setProtein(newProtein);setCarbs(newCarbs);setFat(newFat);setMeals(newMeals);
    await upsertHealth({calories:newCal,protein:newProtein,carbs:newCarbs,fat:newFat,meals:newMeals});
  };

  const logS=async()=>{
    if(!sIn)return;
    const hours=parseFloat(sIn);
    setSleep(hours);setSIn("");
    await upsertHealth({sleep:hours});
  };
  return (
    <div style={{padding:10,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
      <div className="gc">
        <Lbl n={1} t="Nutrition" r="Today"/>
        <div style={{...ui,fontSize:40,fontWeight:300,color:cal>0?TX:TD,letterSpacing:"-0.02em",marginBottom:3}}>{cal}</div>
        <div style={{...ui,fontSize:9,color:TM,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.08em"}}>kcal today</div>
        <Bar pct={(cal/2400)*100}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,margin:"14px 0"}}>
          {[["Protein",protein+"g",A],["Carbs",carbs+"g",BLU],["Fat",fat+"g",ORA]].map(([k,v,c])=>(
            <div key={k}><div style={{...ui,fontSize:9,color:TM,marginBottom:3}}>{k}</div><div style={{...ui,fontSize:15,fontWeight:500,color:c}}>{v}</div></div>
          ))}
        </div>
        <div style={{...ui,fontSize:9,color:TM,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Log meal</div>
        <div style={{display:"flex",gap:6}}>
          <input value={mIn} onChange={e=>setMIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!estimating&&logM()} placeholder="e.g. chicken, rice, broccoli" className="gi" style={{marginBottom:0,flex:1,fontSize:11}} disabled={estimating}/>
          <button className="secb" style={{padding:"0 10px",fontSize:estimating?10:15,borderRadius:7,opacity:estimating?0.5:1}} onClick={logM} disabled={estimating}>{estimating?"…":"+"}</button>
        </div>
        {meals.length>0&&<div style={{marginTop:11}}>{meals.map((m,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{...ui,fontSize:11,color:TM}}>{m.name}</span><span style={{...mon,fontSize:9,color:TM}}>{m.time}</span></div>)}</div>}
      </div>
      <div className="gc">
        <Lbl n={2} t="Sleep" r="Last night"/>
        <div style={{...ui,fontSize:52,fontWeight:300,color:sleep>0?TX:TD,letterSpacing:"-0.03em",marginBottom:3,lineHeight:1}}>{sleep>0?sleep:"—"}</div>
        <div style={{...ui,fontSize:9,color:TM,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.08em"}}>hours</div>
        <Bar pct={(sleep/9)*100}/>
        <div style={{marginTop:16,marginBottom:6}}>
          {[["< 6h","Poor — impairs focus"],["6–7h","Below optimal"],["7–9h","Optimal ✓"],["> 9h","May cause grogginess"]].map(([r,n])=>(
            <div key={r} style={{display:"flex",gap:11,marginBottom:9}}>
              <span style={{...mon,fontSize:10,color:TM,width:36,flexShrink:0}}>{r}</span>
              <span style={{...ui,fontSize:11,color:TM}}>{n}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:6,marginTop:8}}>
          <input type="number" step="0.5" value={sIn} onChange={e=>setSIn(e.target.value)} placeholder="Hours slept" className="gi" style={{marginBottom:0,flex:1}}/>
          <button className="secb" style={{borderRadius:7}} onClick={logS}>Log</button>
        </div>
      </div>
      <div className="gc">
        <Lbl n={3} t="Habit Streaks"/>
        {(habits??[]).map(h=>(
          <div key={h.id} style={{marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${BOR}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
              <div><div style={{...ui,fontSize:12,fontWeight:500,color:TM}}>{h.name}</div><div style={{...ui,fontSize:9,color:TM,marginTop:2}}>{h.cat}</div></div>
              <span style={{...mon,fontSize:10,color:h.streak>=h.target?A:TM}}>{h.streak}/{h.target}d</span>
            </div>
            <div style={{display:"flex",gap:3}}>
              {Array.from({length:h.target},(_,i)=>(
                <div key={i} style={{flex:1,height:2,background:i<h.streak?"linear-gradient(90deg,#4ade80,#22c55e)":"rgba(255,255,255,0.05)",borderRadius:99,boxShadow:i<h.streak?"0 0 5px rgba(74,222,128,0.32)":""}}/>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ ROOT ═════════════════════════════════════════════════════════════════════
const TABS=["HOME","CRM","BRAIN","FINANCE","JOURNAL","HEALTH"];

export default function PersonalOS() {
  const now=useNow();
  const [tab,setTab]=useState("HOME");
  const [tasks,setTasks]=useState([]);
  const [contacts,setContacts]=useState([]);

  useEffect(()=>{
    supabase.from("tasks").select("*").neq("status","done").order("priority")
      .then(({data})=>setTasks((data??[]).map(r=>({...r,cat:r.category??'PERSONAL',done:false}))));
    supabase.from("contacts").select("*").order("name")
      .then(({data})=>setContacts((data??[]).map(r=>({...r,last:r.last_contact,next:r.next_action}))));
  },[]);

  return (
    <>
      <GlobalStyles/>
      <div style={{background:"#0e0f11",minHeight:"100vh",color:TX}}>
        {/* NAV */}
        <div className="glass-nav" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 18px",height:46,position:"sticky",top:0,zIndex:100}}>
          <div style={{display:"flex",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,paddingRight:18,marginRight:2,borderRight:"1px solid rgba(255,255,255,0.065)"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:A,boxShadow:`0 0 7px ${A}`}}/>
              <span style={{...ui,fontSize:12,fontWeight:600,color:TX,letterSpacing:"0.04em"}}>MITCHEL OS</span>
              <span style={{...ui,fontSize:9,color:TM}}>// V1</span>
            </div>
            <div style={{display:"flex"}}>
              {TABS.map(t=>(
                <button key={t} className={`tab-btn ${tab===t?"act":""}`} onClick={()=>setTab(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <span style={{...ui,fontSize:10,color:TM}}>{MO[now.getMonth()]} {pad(now.getDate())}, {now.getFullYear()}</span>
            <div style={{background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.22)",borderRadius:99,padding:"3px 11px",display:"flex",alignItems:"center",gap:5,boxShadow:"0 0 10px rgba(74,222,128,0.08)"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:A,boxShadow:`0 0 5px ${A}`}}/>
              <span style={{...ui,fontSize:10,fontWeight:500,color:A}}>Live</span>
            </div>
            <span style={{...ui,fontSize:14,fontWeight:300,color:TX,letterSpacing:"0.02em"}}>{pad(now.getHours())}:{pad(now.getMinutes())}</span>
            <div style={{width:26,height:26,borderRadius:7,background:"linear-gradient(145deg,rgba(255,255,255,0.075),rgba(255,255,255,0.018))",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 0 rgba(255,255,255,0.1) inset"}}>
              <span style={{...ui,fontSize:11,fontWeight:600,color:TM}}>M</span>
            </div>
          </div>
        </div>
        {tab==="HOME"    && <HomeTabFixed tasks={tasks} setTasks={setTasks} now={now}/>}
        {tab==="CRM"     && <CRMTab      contacts={contacts} setContacts={setContacts}/>}
        {tab==="BRAIN"   && <BrainTab/>}
        {tab==="FINANCE" && <FinanceTab/>}
        {tab==="JOURNAL" && <JournalTab/>}
        {tab==="HEALTH"  && <HealthTab/>}
      </div>
    </>
  );
}
