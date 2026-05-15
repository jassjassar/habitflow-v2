import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { createClient } from "@supabase/supabase-js"

const normalizeVapidPublicKey = (value) => {
  let key = String(value || "").trim()
  key = key.replace(/^['"]|['"]$/g, "").trim()
  key = key.replace(/^(?:VITE_)?VAPID_PUBLIC_KEY\s*=\s*/i, "").trim()
  return key.replace(/^['"]|['"]$/g, "").trim()
}

const PUSH_CONFIG_ERROR = "Push reminders are not configured correctly yet. Please contact support or try again later."

const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  vapidPublicKey: normalizeVapidPublicKey(import.meta.env.VITE_VAPID_PUBLIC_KEY),
}

const hasSupabaseConfig = Boolean(env.supabaseUrl && env.supabaseAnonKey)
const supabase = hasSupabaseConfig ? createClient(env.supabaseUrl, env.supabaseAnonKey) : null

const PALETTE = ["#FF6B6B","#FF8E53","#FFD93D","#6BCB77","#4ECDC4","#45B7D1","#A78BFA","#F472B6"]

const HABIT_TEMPLATES = [
  { name:"Morning Run",    emoji:"🏃", color:"#FF6B6B", category:"health", time:"06:00" },
  { name:"Drink Water",    emoji:"💧", color:"#45B7D1", category:"health", time:"08:00" },
  { name:"Gym Workout",    emoji:"🏋️", color:"#FF8E53", category:"health", time:"07:00" },
  { name:"Meditate",       emoji:"🧘", color:"#A78BFA", category:"mind",   time:"07:00" },
  { name:"Read 20 Mins",   emoji:"📚", color:"#FFD93D", category:"mind",   time:"20:00" },
  { name:"Journal",        emoji:"✍️", color:"#F472B6", category:"mind",   time:"21:00" },
  { name:"Deep Work",      emoji:"🎯", color:"#4ECDC4", category:"work",   time:"09:00" },
  { name:"Cold Shower",    emoji:"🚿", color:"#45B7D1", category:"personal",time:"07:00" },
  { name:"Sleep 8hrs",     emoji:"💤", color:"#A78BFA", category:"health", time:"22:00" },
  { name:"Healthy Eating", emoji:"🥗", color:"#6BCB77", category:"health", time:"12:00" },
  { name:"Gratitude",      emoji:"🙏", color:"#FFD93D", category:"personal",time:"21:00" },
  { name:"No Sugar",       emoji:"🍎", color:"#FF6B6B", category:"health", time:"08:00" },
] 

const ONBOARDING_HABITS = {
  health: [
    { name:"Morning Run",    emoji:"🏃", color:"#FF6B6B", time:"06:30" },
    { name:"Drink Water",    emoji:"💧", color:"#45B7D1", time:"08:00" },
    { name:"Gym Workout",    emoji:"🏋️", color:"#FF8E53", time:"07:00" },
    { name:"Healthy Eating", emoji:"🥗", color:"#6BCB77", time:"12:00" },
    { name:"Sleep 8hrs",     emoji:"💤", color:"#A78BFA", time:"22:00" },
  ],
  mind: [
    { name:"Meditate",       emoji:"🧘", color:"#A78BFA", time:"07:00" },
    { name:"Read 20 Mins",   emoji:"📚", color:"#FFD93D", time:"20:00" },
    { name:"Journal",        emoji:"✍️", color:"#F472B6", time:"21:00" },
    { name:"Gratitude",      emoji:"🙏", color:"#FFD93D", time:"08:00" },
    { name:"Deep Work",      emoji:"🎯", color:"#4ECDC4", time:"09:00" },
  ],
  work: [
    { name:"Deep Work",      emoji:"🎯", color:"#4ECDC4", time:"09:00" },
    { name:"Plan Tomorrow",  emoji:"📋", color:"#45B7D1", time:"21:00" },
    { name:"No Phone AM",    emoji:"📵", color:"#FF6B6B", time:"08:00" },
    { name:"Learn Something",emoji:"🧠", color:"#A78BFA", time:"18:00" },
    { name:"Read 20 Mins",   emoji:"📚", color:"#FFD93D", time:"20:00" },
  ],
  personal: [
    { name:"Cold Shower",    emoji:"🚿", color:"#45B7D1", time:"07:00" },
    { name:"Walk 30 Mins",   emoji:"🚶", color:"#6BCB77", time:"17:00" },
    { name:"No Sugar",       emoji:"🍎", color:"#FF6B6B", time:"08:00" },
    { name:"Gratitude",      emoji:"🙏", color:"#FFD93D", time:"21:00" },
    { name:"Sleep 8hrs",     emoji:"💤", color:"#A78BFA", time:"22:00" },
  ],
} 

const THEMES = {
  aurora: { name:"Dark Aurora",    bg:"#0d0d1a", accent:"#A78BFA", card:"rgba(255,255,255,0.07)", text:"#ffffff", sub:"rgba(255,255,255,0.5)"  },
  mint:   { name:"Fresh Mint",     bg:"#f0fdf6", accent:"#10b981", card:"rgba(255,255,255,0.9)",  text:"#111827", sub:"rgba(0,0,0,0.4)"         },
  ocean:  { name:"Ocean Deep",     bg:"#0c1929", accent:"#0ea5e9", card:"rgba(14,165,233,0.08)",  text:"#f0f9ff", sub:"rgba(255,255,255,0.45)"  },
  coral:  { name:"Sunset Coral",   bg:"#fff8f5", accent:"#f97316", card:"rgba(255,255,255,0.9)",  text:"#1c0a00", sub:"rgba(0,0,0,0.4)"         },
  rose:   { name:"Rose Gold",      bg:"#fff5f7", accent:"#e11d48", card:"rgba(255,255,255,0.9)",  text:"#1a0010", sub:"rgba(0,0,0,0.4)"         },
  slate:  { name:"Midnight Slate", bg:"#0f172a", accent:"#6366f1", card:"rgba(99,102,241,0.08)",  text:"#f1f5f9", sub:"rgba(255,255,255,0.45)"  },
}

const applyTheme = (themeId) => {
  const t = THEMES[themeId] || THEMES.aurora
  const r = document.documentElement
  r.style.setProperty("--bg", t.bg)
  r.style.setProperty("--accent", t.accent)
  r.style.setProperty("--card", t.card)
  r.style.setProperty("--text", t.text)
  r.style.setProperty("--sub", t.sub)
  localStorage.setItem("hf_theme", themeId)
}

const LEVELS = [
  { level:1, title:"Beginner",  icon:"🌱", minXP:0    },
  { level:2, title:"Explorer",  icon:"🚀", minXP:100  },
  { level:3, title:"Achiever",  icon:"⚡", minXP:250  },
  { level:4, title:"Champion",  icon:"🔥", minXP:500  },
  { level:5, title:"Master",    icon:"💎", minXP:1000 },
  { level:6, title:"Legend",    icon:"👑", minXP:2000 },
]

const getLast7 = () => Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(6-i)); return d.toISOString().slice(0,10) })
const todayStr = new Date().toISOString().slice(0,10)
const calcXP = (habits, days) => { let xp=0; habits.forEach(h=>{ let s=0; days.forEach(d=>{ if(h.completions?.[d]){xp+=10;s++;xp+=s*5}else s=0 }) }); return xp }
const getLevel = (xp) => LEVELS.slice().reverse().find(l=>xp>=l.minXP)||LEVELS[0] 
const getNextLevel = (level) => LEVELS.find(l=>l.level===level.level+1)
const getLevelProgress = (xp, level, nextLevel) => nextLevel ? Math.min(100, Math.max(0, Math.round(((xp-level.minXP)/(nextLevel.minXP-level.minXP))*100))) : 100
const getStreak = (habit, days, freezeDates=[]) => { let s=0; const rev=[...days].reverse(); for(let d of rev){ if(habit.completions?.[d]) s++; else if(freezeDates.includes(d)) s++; else break }; return s }
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const getHour = () => new Date().getHours()
const getGreeting = () => { const h=getHour(); return h<12?"Good morning":h<17?"Good afternoon":"Good evening" }

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  html,body{height:100%;overscroll-behavior:none}
  body{font-family:'Inter',sans-serif;background:#0d0d1a;color:#fff;overflow-x:hidden}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:10px}

  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
  @keyframes pulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
  @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}} 
  @keyframes slideDown{from{opacity:0;transform:translateX(-50%) translateY(-16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes confettiFall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
  @keyframes levelUp{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
  @keyframes fireFlicker{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.1) scaleX(0.95)}}
  @keyframes bgMove{0%{transform:translate(0,0)}50%{transform:translate(30px,20px)}100%{transform:translate(0,0)}}
  @keyframes orbitA{0%{transform:rotate(0deg) translateX(110px) rotate(0deg)}100%{transform:rotate(360deg) translateX(110px) rotate(-360deg)}}
  @keyframes orbitB{0%{transform:rotate(120deg) translateX(110px) rotate(-120deg)}100%{transform:rotate(480deg) translateX(110px) rotate(-480deg)}}
  @keyframes orbitC{0%{transform:rotate(240deg) translateX(110px) rotate(-240deg)}100%{transform:rotate(600deg) translateX(110px) rotate(-600deg)}}
  @keyframes ringFill{from{stroke-dasharray:0 283}to{stroke-dasharray:var(--dash) 283}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}

  .fade-up{animation:fadeUp 0.5s ease forwards}
  .float-a{animation:float 4s ease-in-out infinite}
  .float-b{animation:floatB 5s ease-in-out infinite}
  .fire{animation:fireFlicker 0.35s ease-in-out infinite}

  /* GLASSMORPHISM CARD */
  .card{
    background:rgba(255,255,255,0.055);
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);
    border:1px solid rgba(255,255,255,0.1);
    border-radius:20px;
    box-shadow:0 4px 24px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.08);
    transition:transform 0.3s ease,box-shadow 0.3s ease;
  }
  .card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.1)}
  .card-glow{box-shadow:0 0 0 1px rgba(167,139,250,0.3),0 8px 32px rgba(167,139,250,0.15),inset 0 1px 0 rgba(255,255,255,0.1)}

  /* BUTTONS */
  .btn-glass{
    background:rgba(255,255,255,0.08);
    backdrop-filter:blur(10px);
    border:1px solid rgba(255,255,255,0.15);
    border-radius:12px;color:#fff;
    font-family:'Inter',sans-serif;font-weight:700;
    cursor:pointer;transition:all 0.2s;
  }
  .btn-glass:hover{background:rgba(255,255,255,0.15);transform:translateY(-1px)}
  .btn-glass:active{transform:scale(0.97)}

  .btn-grad{
    border:none;border-radius:14px;color:#fff;
    font-family:'Inter',sans-serif;font-weight:800;
    cursor:pointer;
    box-shadow:0 4px 16px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.2);
    transition:all 0.25s;
  }
  .btn-grad:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 8px 28px rgba(0,0,0,0.4)}
  .btn-grad:active{transform:scale(0.98)}

  /* INPUTS */
  .inp{
    width:100%;padding:14px 18px;
    background:rgba(255,255,255,0.07);
    border:1px solid rgba(255,255,255,0.12);
    border-radius:14px;color:#fff;
    font-family:'Inter',sans-serif;font-size:14px;
    outline:none;margin-bottom:12px;
    transition:border-color 0.2s,box-shadow 0.2s;
  }
  .inp:focus{border-color:rgba(167,139,250,0.6);box-shadow:0 0 0 3px rgba(167,139,250,0.12)}
  .inp::placeholder{color:rgba(255,255,255,0.25)}

  /* HABIT CARD */
  .habit-card{
    border-radius:18px;
    border:1px solid rgba(255,255,255,0.08);
    backdrop-filter:blur(20px);
    transition:all 0.3s ease;
    position:relative;overflow:hidden;
  }
  .habit-card::before{
    content:'';position:absolute;inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 50%);
    pointer-events:none;border-radius:inherit;
  }
  .habit-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,0.4)}

  /* PROGRESS RING */
  .ring-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center}
  .progress-ring{transition:stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)}

  /* OVERLAYS */
  .overlay{
    position:fixed;inset:0;background:rgba(0,0,0,0.75);
    backdrop-filter:blur(16px);z-index:100;
    display:flex;align-items:center;justify-content:center;padding:20px;
  }
  .sheet{
    position:fixed;inset:0;background:rgba(0,0,0,0.75);
    backdrop-filter:blur(16px);z-index:100;
    display:flex;align-items:flex-end;
  }
  .sheet-inner{
    background:linear-gradient(180deg,#1a1a2e,#13132a);
    border:1px solid rgba(255,255,255,0.1);
    border-radius:28px 28px 0 0;
    padding:8px 20px 40px;width:100%;
    max-height:92vh;overflow-y:auto;
    box-shadow:0 -20px 60px rgba(0,0,0,0.6);
  }
  .sheet-handle{width:40px;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;margin:12px auto 20px}

  /* TOP NAV */
  .top-nav{
    position:sticky;top:0;z-index:50;
    background:rgba(13,13,26,0.85);
    backdrop-filter:blur(20px);
    border-bottom:1px solid rgba(255,255,255,0.07);
    padding:14px 20px;
    display:flex;align-items:center;justify-content:space-between;
  }

  /* BOTTOM TAB BAR */
  .tab-bar{
    position:fixed;bottom:0;left:50%;transform:translateX(-50%);
    width:100%;max-width:480px;
    background:rgba(10,10,22,0.95);
    backdrop-filter:blur(24px);
    border-top:1px solid rgba(255,255,255,0.07);
    display:flex;z-index:50;padding:10px 0 26px;
  }
  .tab-item{
    flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:3px;cursor:pointer;padding:4px 0;transition:all 0.2s;
  }
  .tab-item:hover{transform:translateY(-2px)}
  .tab-icon{font-size:20px;line-height:1;transition:transform 0.2s}
  .tab-item.active .tab-icon{transform:scale(1.15)}
  .tab-label{font-size:9px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:rgba(255,255,255,0.4);transition:color 0.2s}
  .tab-item.active .tab-label{color:#A78BFA}
  .tab-dot{width:4px;height:4px;border-radius:50%;background:transparent;margin-top:1px;transition:background 0.2s}
  .tab-item.active .tab-dot{background:#A78BFA}

  /* PARTICLES */
  .particle{position:fixed;width:7px;height:7px;border-radius:50%;pointer-events:none;z-index:9999;animation:confettiFall 2s ease forwards}

  /* SHIMMER LOADING */
  .shimmer{background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0) 100%);background-size:200% 100%;animation:shimmer 1.8s infinite}
`

function Particles({ active }) {
  if (!active) return null
  const colors = ["#FF6B6B","#FFD93D","#6BCB77","#4ECDC4","#A78BFA","#F472B6","#FF8E53","#45B7D1"]
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}>
      {Array.from({length:45},(_,i)=>(
        <div key={i} className="particle" style={{
          left:Math.random()*100+"%",top:"-10px",
          background:colors[i%colors.length],
          borderRadius:Math.random()>.5?"50%":"3px",
          width:5+Math.random()*9+"px",height:5+Math.random()*9+"px",
          animationDelay:Math.random()*0.7+"s",
          animationDuration:1.5+Math.random()*1.5+"s",
        }}/>
      ))}
    </div>
  )
}

function Ring3D({ pct, size=140, color="#A78BFA", label, sublabel }) {
  const r = (size/2) - 14
  const circ = 2 * Math.PI * r
  const dash = (pct/100) * circ
  return (
    <div className="ring-wrap" style={{width:size,height:size}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)",filter:`drop-shadow(0 0 12px ${color}66)`}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="11"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}22`} strokeWidth="11" strokeDasharray={`${circ} 0`}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="11"
          strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} className="progress-ring"
          style={{filter:`drop-shadow(0 0 8px ${color})`}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <div style={{fontSize:size>100?30:20,fontWeight:900,color:"#fff",lineHeight:1}}>{Math.round(pct)}%</div>
        {label && <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.45)",letterSpacing:.8,marginTop:3,textTransform:"uppercase"}}>{label}</div>}
        {sublabel && <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:1}}>{sublabel}</div>}
      </div>
    </div>
  )
}

function FireStreak({ streak }) {
  if (streak === 0) return <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:28,opacity:0.4}}>🔥</span><span style={{fontSize:28,fontWeight:900,color:"rgba(255,255,255,0.3)"}}>0</span></div>
  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <div style={{fontSize:32,animation:"fireFlicker 0.4s ease-in-out infinite",filter:"drop-shadow(0 0 10px #FF8E53)"}}>🔥</div>
      <div style={{fontSize:32,fontWeight:900,background:"linear-gradient(135deg,#FF8E53,#FFD93D)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{streak}</div>
    </div>
  )
}

function LevelUpBurst({ show, level }) {
  if (!show) return null
  return (
    <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998,pointerEvents:"none",background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)"}}>
      <div style={{textAlign:"center",animation:"levelUp 0.6s cubic-bezier(.34,1.56,.64,1) forwards"}}>
        <div style={{fontSize:90,filter:"drop-shadow(0 0 30px #FFD93D)"}}>{level?.icon}</div>
        <div style={{fontSize:28,fontWeight:900,color:"#FFD93D",marginTop:8,textShadow:"0 0 30px #FFD93D"}}>LEVEL UP!</div>
        <div style={{fontSize:18,color:"rgba(255,255,255,0.8)",marginTop:6,fontWeight:600}}>{level?.title}</div>
      </div>
    </div>
  )
}

function MilestoneToast({ milestone }) {
  if (!milestone) return null
  return (
    <div style={{position:"fixed",top:74,left:"50%",transform:"translateX(-50%)",zIndex:9999,width:"calc(100% - 32px)",maxWidth:420,pointerEvents:"none",animation:"slideDown 0.35s ease"}}>
      <div className="card" style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:12,background:"linear-gradient(135deg,rgba(255,217,61,0.18),rgba(167,139,250,0.16))",border:"1px solid rgba(255,255,255,0.14)",boxShadow:"0 12px 36px rgba(0,0,0,0.35)"}}>
        <div style={{width:38,height:38,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,background:"rgba(255,255,255,0.1)",boxShadow:"0 0 18px rgba(255,217,61,0.25)"}}>{milestone.icon}</div>
        <div>
          <div style={{fontSize:13,fontWeight:900,color:"#fff",marginBottom:2}}>{milestone.title}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.55)",fontWeight:700}}>{milestone.detail}</div>
        </div>
      </div>
    </div>
  )
}

function FreezeToast({ type }) {
  if (!type) return null
  const isEarned = type === "shield_earned"
  return (
    <div style={{position:"fixed",top:74,left:"50%",transform:"translateX(-50%)",zIndex:9999,width:"calc(100% - 32px)",maxWidth:420,pointerEvents:"none",animation:"slideDown 0.35s ease"}}>
      <div className="card" style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12,background:isEarned?"linear-gradient(135deg,rgba(69,183,209,0.2),rgba(167,139,250,0.18))":"linear-gradient(135deg,rgba(255,142,83,0.2),rgba(255,217,61,0.14))",border:"1px solid rgba(255,255,255,0.14)",boxShadow:"0 12px 36px rgba(0,0,0,0.35)"}}>
        <div style={{width:42,height:42,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,background:"rgba(255,255,255,0.1)",boxShadow:isEarned?"0 0 20px rgba(69,183,209,0.3)":"0 0 20px rgba(255,217,61,0.3)"}}>🛡️</div>
        <div>
          <div style={{fontSize:14,fontWeight:900,color:"#fff",marginBottom:2}}>{isEarned ? "Streak shield earned" : "Your streak was protected"}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.58)",fontWeight:700,lineHeight:1.35}}>
            {isEarned ? "You reached a 7-day rhythm. One missed day can be forgiven." : "A shield covered yesterday so your streak could keep going."}
          </div>
        </div>
      </div>
    </div>
  )
}

function OnboardingQuiz({ onComplete, onDone }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [animating, setAnimating] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const [createdHabits, setCreatedHabits] = useState([])
  const [error, setError] = useState("")
 
  const STEPS = [
    {
      id: "goal",
      emoji: "🎯",
      title: "What's your main goal?",
      subtitle: "We'll build the perfect habit set for you",
      options: [
        { id:"health",   emoji:"💪", label:"Get fit & healthy",    desc:"Exercise, nutrition, sleep" },
        { id:"mind",     emoji:"🧘", label:"Mental clarity",        desc:"Meditate, read, journal" },
        { id:"work",     emoji:"🚀", label:"Be more productive",    desc:"Deep work, focus, planning" },
        { id:"personal", emoji:"✨", label:"Personal growth",       desc:"Self-care & better habits" },
      ],
    },
    {
      id: "time",
      emoji: "⏰",
      title: "When are you most active?",
      subtitle: "We'll use this to set your starter reminder times",
      options: [
        { id:"morning",   emoji:"🌅", label:"Early bird",     desc:"I'm active before 9am" },
        { id:"afternoon", emoji:"☀️", label:"Afternoon peak",  desc:"I hit my stride after noon" },
        { id:"evening",   emoji:"🌙", label:"Night owl",       desc:"Evenings work best for me" },
        { id:"flexible",  emoji:"🎲", label:"Flexible",        desc:"No fixed preference" },
      ],
    },
    {
      id: "count",
      emoji: "📊",
      title: "How many habits to start?",
      subtitle: "Research shows starting small leads to long-term success",
      options: [
        { id:"2", emoji:"🌱", label:"Start with 2",  desc:"Easy wins, high success rate" },
        { id:"3", emoji:"⚡", label:"Go with 3",     desc:"The science-backed sweet spot" },
        { id:"5", emoji:"🔥", label:"Challenge me",  desc:"I'm ready to commit fully" },
      ],
    },
  ]
 
  const currentStep = STEPS[step]
  const totalSteps = STEPS.length
 
  const selectOption = (optId) => {
    if (completing) return
    setError("")
    setAnswers(prev => ({ ...prev, [currentStep.id]: optId }))
  }

  const goBack = () => {
    if (step === 0 || animating || completing) return
    setError("")
    setAnimating(true)
    setTimeout(() => { setStep(s => Math.max(0, s - 1)); setAnimating(false) }, 220)
  }

  const finishSetup = async (selectedHabits) => {
    if (completing) return
    setCompleting(true)
    setError("")

    try {
      const created = await onComplete(selectedHabits)
      if (!created?.length) throw new Error("No habits were created.")

      setCreatedHabits(created)
      setCelebrating(true)
      setTimeout(() => onDone?.(), 1800)
    } catch (err) {
      setError(err?.message || "We couldn't create your starter habits. Please try again.")
    } finally {
      setCompleting(false)
    }
  }
 
  const goNext = async () => {
    if (!answers[currentStep.id] || animating || completing) return
    if (step < totalSteps - 1) {
      setError("")
      setAnimating(true)
      setTimeout(() => { setStep(s => s + 1); setAnimating(false) }, 320)
    } else {
      await finishSetup(buildHabits(answers))
    }
  }
 
  const buildHabits = (ans) => {
    const pool = ONBOARDING_HABITS[ans.goal] || ONBOARDING_HABITS.health
    const count = parseInt(ans.count || "3")
    const offsets = { morning:0, afternoon:4, evening:8, flexible:0 }
    const offset = offsets[ans.time] || 0
    return pool.slice(0, count).map(h => {
      const [hh, mm] = h.time.split(":").map(Number)
      const newH = Math.min(22, hh + offset)
      return { ...h, time:`${String(newH).padStart(2,"0")}:${String(mm).padStart(2,"0")}` }
    })
  }
 
  // CELEBRATION SCREEN
  if (celebrating) {
    const habitCount = createdHabits.length
    const goalLabels = { health:"fitness", mind:"mental clarity", work:"productivity", personal:"personal growth" }
    const goal = goalLabels[answers.goal] || "your goals"
    return (
      <div style={{
        position:"fixed", inset:0, zIndex:500,
        background:"linear-gradient(135deg,#0d0d1a 0%,#1a0d2e 50%,#0d1a1a 100%)",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        padding:32, textAlign:"center",
      }}>
        <div style={{animation:"celebPop 0.6s cubic-bezier(.34,1.56,.64,1) forwards", fontSize:80, marginBottom:24}}>🎉</div>
        <div style={{fontSize:28, fontWeight:900, color:"#fff", marginBottom:10, lineHeight:1.2}}>
          You're all set!
        </div>
        <div style={{fontSize:16, color:"rgba(255,255,255,0.6)", marginBottom:32, lineHeight:1.6, maxWidth:300}}>
          We've created {habitCount} habits focused on <span style={{color:"#A78BFA", fontWeight:700}}>{goal}</span>. Your journey starts now.
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:12, width:"100%", maxWidth:280}}>
          {createdHabits.map((h, i) => (
            <div key={i} style={{
              background:`${h.color}22`, border:`1px solid ${h.color}44`,
              borderRadius:16, padding:"12px 16px",
              display:"flex", alignItems:"center", gap:12,
              animation:`slideInUp 0.4s ${i*0.1}s ease both`,
            }}>
              <div style={{fontSize:24}}>{h.emoji}</div>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:14, fontWeight:700, color:"#fff"}}>{h.name}</div>
                <div style={{fontSize:11, color:"rgba(255,255,255,0.45)"}}>⏰ {h.time}</div>
              </div>
              <div style={{marginLeft:"auto", color:h.color, fontWeight:800, fontSize:12}}>✓</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:24, fontSize:14, color:"rgba(255,255,255,0.4)"}}>
          Opening your dashboard...
        </div>
        <style>{`
          @keyframes celebPop {
            0%{transform:scale(0) rotate(-20deg);opacity:0}
            60%{transform:scale(1.2) rotate(10deg)}
            100%{transform:scale(1) rotate(0);opacity:1}
          }
          @keyframes slideInUp {
            from{opacity:0;transform:translateY(20px)}
            to{opacity:1;transform:translateY(0)}
          }
        `}</style>
      </div>
    )
  }
 
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:500,
      background:"linear-gradient(135deg,#0d0d1a 0%,#1a0d2e 60%,#0d1a1a 100%)",
      display:"flex", flexDirection:"column",
      overflowY:"auto",
    }}>
      <style>{`
        @keyframes fadeSlideIn {
          from{opacity:0;transform:translateX(24px)}
          to{opacity:1;transform:translateX(0)}
        }
        @keyframes optionPop {
          0%{transform:scale(0.94);opacity:0}
          100%{transform:scale(1);opacity:1}
        }
        .ob-option {
          transition: all 0.2s ease;
        }
        .ob-option:hover {
          transform: translateY(-2px) scale(1.01);
        }
        .ob-option:active {
          transform: scale(0.98);
        }
      `}</style>
 
      {/* HEADER */}
      <div style={{padding:"20px 24px 0", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <button
          onClick={goBack}
          disabled={step === 0 || animating || completing}
          style={{
            width:38,height:38,borderRadius:12,border:"1px solid rgba(255,255,255,0.1)",
            background:step === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.08)",
            color:step === 0 ? "rgba(255,255,255,0.18)" : "#fff",
            cursor:step === 0 || animating || completing ? "not-allowed" : "pointer",
            fontSize:18,fontWeight:800,fontFamily:"'Inter',sans-serif",
          }}
          aria-label="Back"
        >
          ←
        </button>
        <div style={{fontSize:16, fontWeight:900, background:"linear-gradient(135deg,#A78BFA,#4ECDC4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>
          ⚡ HabitFlow
        </div>
        <div style={{fontSize:12, color:"rgba(255,255,255,0.3)", fontWeight:600}}>
          {step + 1} of {totalSteps}
        </div>
      </div>
 
      {/* PROGRESS BAR */}
      <div style={{padding:"12px 24px 0"}}>
        <div style={{height:4, borderRadius:999, background:"rgba(255,255,255,0.08)", overflow:"hidden"}}>
          <div style={{
            height:"100%", borderRadius:999,
            background:"linear-gradient(90deg,#A78BFA,#4ECDC4)",
            width:`${((step + 1) / totalSteps) * 100}%`,
            transition:"width 0.4s ease",
            boxShadow:"0 0 10px rgba(167,139,250,0.5)",
          }}/>
        </div>
      </div>
 
      {/* CONTENT */}
      <div style={{
        flex:1, display:"flex", flexDirection:"column",
        padding:"32px 24px 24px",
        animation: animating ? "none" : "fadeSlideIn 0.35s ease",
        opacity: animating ? 0 : 1,
        transition: animating ? "opacity 0.2s" : "none",
      }}>
        {/* Emoji + Title */}
        <div style={{textAlign:"center", marginBottom:36}}>
          <div style={{
            fontSize:64, marginBottom:16,
            filter:"drop-shadow(0 0 20px rgba(167,139,250,0.4))",
            animation:"float 3s ease-in-out infinite",
          }}>
            {currentStep.emoji}
          </div>
          <div style={{fontSize:24, fontWeight:900, color:"#fff", marginBottom:8, lineHeight:1.25}}>
            {currentStep.title}
          </div>
          <div style={{fontSize:14, color:"rgba(255,255,255,0.45)", lineHeight:1.5}}>
            {currentStep.subtitle}
          </div>
        </div>
 
        {/* Options */}
        <div style={{display:"flex", flexDirection:"column", gap:12, marginBottom:32}}>
          {currentStep.options.map((opt, i) => {
            const isSelected = answers[currentStep.id] === opt.id
            return (
              <div
                key={opt.id}
                className="ob-option"
                onClick={() => selectOption(opt.id)}
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg,rgba(167,139,250,0.25),rgba(78,205,196,0.15))"
                    : "rgba(255,255,255,0.05)",
                  border: isSelected
                    ? "2px solid rgba(167,139,250,0.8)"
                    : "1px solid rgba(255,255,255,0.1)",
                  borderRadius:18,
                  padding:"16px 18px",
                  cursor:completing?"wait":"pointer",
                  display:"flex",
                  alignItems:"center",
                  gap:14,
                  boxShadow: isSelected ? "0 0 20px rgba(167,139,250,0.2)" : "none",
                  animation:`optionPop 0.3s ${i*0.06}s ease both`,
                }}
              >
                <div style={{
                  width:46, height:46, borderRadius:14, flexShrink:0,
                  background: isSelected ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.07)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:24,
                  border: isSelected ? "1px solid rgba(167,139,250,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  transition:"all 0.2s",
                }}>
                  {opt.emoji}
                </div>
                <div style={{flex:1}}>
                  <div style={{
                    fontSize:15, fontWeight:700,
                    color: isSelected ? "#fff" : "rgba(255,255,255,0.85)",
                    marginBottom:3,
                  }}>
                    {opt.label}
                  </div>
                  <div style={{fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:500}}>
                    {opt.desc}
                  </div>
                </div>
                <div style={{
                  width:22, height:22, borderRadius:"50%", flexShrink:0,
                  background: isSelected ? "linear-gradient(135deg,#A78BFA,#4ECDC4)" : "rgba(255,255,255,0.08)",
                  border: isSelected ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, color:"#fff",
                  transition:"all 0.2s",
                }}>
                  {isSelected ? "✓" : ""}
                </div>
              </div>
            )
          })}
        </div>

        {error && (
          <div style={{
            marginBottom:14,padding:"12px 14px",borderRadius:14,
            background:"rgba(255,107,107,0.12)",border:"1px solid rgba(255,107,107,0.28)",
            color:"#FFB4B4",fontSize:12,lineHeight:1.45,fontWeight:650,
          }}>
            {error}
          </div>
        )}
 
        {/* NEXT BUTTON */}
        <button
          onClick={goNext}
          disabled={!answers[currentStep.id] || animating || completing}
          style={{
            width:"100%", padding:"17px",
            borderRadius:18, border:"none",
            background: answers[currentStep.id] && !completing
              ? "linear-gradient(135deg,#A78BFA,#4ECDC4)"
              : "rgba(255,255,255,0.08)",
            color: answers[currentStep.id] && !completing ? "#fff" : "rgba(255,255,255,0.3)",
            fontSize:16, fontWeight:800,
            cursor: answers[currentStep.id] && !completing ? "pointer" : "not-allowed",
            transition:"all 0.25s",
            boxShadow: answers[currentStep.id] && !completing ? "0 8px 28px rgba(167,139,250,0.35)" : "none",
            transform: answers[currentStep.id] && !completing ? "none" : "scale(0.98)",
            fontFamily:"'Inter',sans-serif",
          }}
        >
          {completing ? "Creating your habits..." : step === totalSteps - 1 ? "Build My Habits 🚀" : "Continue →"}
        </button>
 
        {/* SKIP */}
        {step === 0 && (
          <div
            onClick={() => finishSetup(ONBOARDING_HABITS.health.slice(0,3))}
            style={{
              textAlign:"center", marginTop:16, fontSize:12,
              color:completing?"rgba(255,255,255,0.16)":"rgba(255,255,255,0.32)",
              cursor:completing?"wait":"pointer", fontWeight:700,
            }}
          >
            Use starter setup instead →
          </div>
        )}
      </div>
 
      {/* BG ORBS */}
      <div style={{position:"fixed", top:"15%", left:"10%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(167,139,250,0.08),transparent 70%)", pointerEvents:"none", animation:"bgPulse 8s ease-in-out infinite"}}/>
      <div style={{position:"fixed", bottom:"20%", right:"5%", width:250, height:250, borderRadius:"50%", background:"radial-gradient(circle,rgba(78,205,196,0.06),transparent 70%)", pointerEvents:"none", animation:"bgPulse 11s ease-in-out infinite reverse"}}/>
    </div>
  )
} 

 function HeatmapCalendar({ habits }) {
  const [tooltip, setTooltip] = useState(null)
  const [selectedHabit, setSelectedHabit] = useState("all")
 
  // Build 90 days of data
  const buildDays = () => {
    const days = []
    const today = new Date()
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      const dayHabits = selectedHabit === "all" ? habits : habits.filter(h => h.id === selectedHabit)
      const total = dayHabits.length
      const done = dayHabits.filter(h => h.completions?.[dateStr]).length
      const pct = total > 0 ? done / total : 0
      days.push({ dateStr, done, total, pct, date: d })
    }
    return days
  }
 
  const days = buildDays()
 
  // Group into weeks
  const weeks = []
  let week = []
  // Pad start
  const firstDay = days[0].date.getDay()
  for (let i = 0; i < firstDay; i++) week.push(null)
  days.forEach((d, i) => {
    week.push(d)
    if (week.length === 7) { weeks.push(week); week = [] }
  })
  if (week.length > 0) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
 
  // Color based on completion %
  const getColor = (pct, isToday) => {
    if (isToday) return "rgba(167,139,250,0.9)"
    if (pct === 0) return "rgba(255,255,255,0.06)"
    if (pct <= 0.25) return "rgba(16,185,129,0.25)"
    if (pct <= 0.5)  return "rgba(16,185,129,0.45)"
    if (pct <= 0.75) return "rgba(16,185,129,0.65)"
    return "rgba(16,185,129,0.9)"
  }
 
  const todayStr = new Date().toISOString().slice(0, 10)
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const DAYS = ["S","M","T","W","T","F","S"]
 
  // Get month labels
  const monthLabels = []
  weeks.forEach((week, wi) => {
    const firstReal = week.find(d => d !== null)
    if (firstReal && firstReal.date.getDate() <= 7) {
      monthLabels.push({ wi, label: MONTHS[firstReal.date.getMonth()] })
    }
  })
 
  // Stats
  const totalDone = days.filter(d => d.pct === 1).length
  const currentStreak = (() => {
    let s = 0
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].pct === 1) s++
      else break
    }
    return s
  })()
  const longestStreak = (() => {
    let max = 0, cur = 0
    days.forEach(d => { if (d.pct === 1) { cur++; max = Math.max(max, cur) } else cur = 0 })
    return max
  })()
 
  return (
    <div style={{
      background:"rgba(255,255,255,0.04)",
      border:"1px solid rgba(255,255,255,0.08)",
      borderRadius:20,
      padding:"18px 16px",
      marginBottom:14,
    }}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>Activity</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontWeight:600}}>Last 90 days</div>
      </div>
 
      {/* Habit filter */}
      {habits.length > 1 && (
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          <button
            onClick={() => setSelectedHabit("all")}
            style={{
              padding:"4px 10px",fontSize:11,fontWeight:700,borderRadius:8,border:"none",cursor:"pointer",
              background:selectedHabit==="all"?"linear-gradient(135deg,#A78BFA,#4ECDC4)":"rgba(255,255,255,0.07)",
              color:selectedHabit==="all"?"#fff":"rgba(255,255,255,0.5)",
              fontFamily:"'Inter',sans-serif",transition:"all .2s",
            }}
          >All</button>
          {habits.map(h => (
            <button
              key={h.id}
              onClick={() => setSelectedHabit(h.id)}
              style={{
                padding:"4px 10px",fontSize:11,fontWeight:700,borderRadius:8,border:"none",cursor:"pointer",
                background:selectedHabit===h.id?h.color:"rgba(255,255,255,0.07)",
                color:selectedHabit===h.id?"#fff":"rgba(255,255,255,0.5)",
                fontFamily:"'Inter',sans-serif",transition:"all .2s",
              }}
            >{h.emoji} {h.name}</button>
          ))}
        </div>
      )}
 
      {/* Month labels */}
      <div style={{display:"flex",marginBottom:4,marginLeft:18}}>
        {weeks.map((_, wi) => {
          const label = monthLabels.find(m => m.wi === wi)
          return (
            <div key={wi} style={{width:14,fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:700,flexShrink:0,marginRight:2}}>
              {label ? label.label : ""}
            </div>
          )
        })}
      </div>
 
      {/* Grid */}
      <div style={{display:"flex",gap:2}}>
        {/* Day labels */}
        <div style={{display:"flex",flexDirection:"column",gap:2,marginRight:4}}>
          {DAYS.map((d,i) => (
            <div key={i} style={{height:12,fontSize:9,color:"rgba(255,255,255,0.25)",fontWeight:700,lineHeight:"12px"}}>
              {i % 2 === 1 ? d : ""}
            </div>
          ))}
        </div>
 
        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} style={{display:"flex",flexDirection:"column",gap:2}}>
            {week.map((day, di) => {
              if (!day) return <div key={di} style={{width:12,height:12}}/>
              const isToday = day.dateStr === todayStr
              const color = getColor(day.pct, isToday)
              return (
                <div
                  key={di}
                  onMouseEnter={() => setTooltip(day)}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    width:12, height:12, borderRadius:3,
                    background:color,
                    cursor:"pointer",
                    transition:"transform .15s",
                    border:isToday?"1px solid rgba(167,139,250,0.8)":"none",
                    transform:tooltip?.dateStr===day.dateStr?"scale(1.4)":"scale(1)",
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>
 
      {/* Legend */}
      <div style={{display:"flex",alignItems:"center",gap:6,marginTop:10,justifyContent:"flex-end"}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:600}}>Less</div>
        {[0.06, 0.25, 0.45, 0.65, 0.9].map((o,i) => (
          <div key={i} style={{width:10,height:10,borderRadius:2,background:`rgba(16,185,129,${o})`}}/>
        ))}
        <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:600}}>More</div>
      </div>
 
      {/* Tooltip */}
      {tooltip && (
        <div style={{
          marginTop:10,padding:"8px 12px",
          background:"rgba(255,255,255,0.08)",
          borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",
          fontSize:12,color:"rgba(255,255,255,0.8)",fontWeight:600,
          textAlign:"center",
        }}>
          {tooltip.dateStr === todayStr ? "Today" : tooltip.date.toLocaleDateString("en",{month:"short",day:"numeric",year:"numeric"})}
          {" · "}
          {tooltip.total === 0 ? "No habits yet" :
           tooltip.done === 0 ? "No habits completed" :
           tooltip.done === tooltip.total ? `All ${tooltip.total} habits ✓` :
           `${tooltip.done}/${tooltip.total} habits`}
        </div>
      )}
 
      {/* Quick stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:14}}>
        {[
          {lbl:"Perfect Days",val:totalDone,color:"#10b981"},
          {lbl:"Current Streak",val:currentStreak+"🔥",color:"#FF8E53"},
          {lbl:"Longest Streak",val:longestStreak+"⚡",color:"#A78BFA"},
        ].map(s=>(
          <div key={s.lbl} style={{
            background:"rgba(255,255,255,0.04)",borderRadius:12,
            padding:"10px 8px",textAlign:"center",
            border:"1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{fontSize:18,fontWeight:900,color:s.color,filter:`drop-shadow(0 0 6px ${s.color})`}}>{s.val}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",fontWeight:700,marginTop:3,textTransform:"uppercase",letterSpacing:.5}}>{s.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  )
} 

function ModalOverlay({ children, onClose, zIndex = 200 }) {
  if (typeof document === "undefined") return null

  return createPortal(
    <div
      className="overlay"
      onClick={e => {
        if (e.target === e.currentTarget) onClose?.()
      }}
      style={{zIndex}}
    >
      {children}
    </div>,
    document.body
  )
}

function ThemeSwitcher({ current, onSelect, onClose }) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className="card" style={{maxWidth:400,width:"100%",padding:24,margin:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:18,fontWeight:900}}>🎨 Choose Theme</div>
          <button onClick={onClose} className="btn-glass" style={{padding:"5px 11px"}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {Object.entries(THEMES).map(([id, t]) => (
            <div key={id} onClick={()=>onSelect(id)} style={{
              borderRadius:16, overflow:"hidden",
              border: current===id ? `2px solid ${t.accent}` : "2px solid transparent",
              cursor:"pointer", transition:"all .2s",
              transform: current===id ? "scale(1.03)" : "scale(1)",
              boxShadow: current===id ? `0 0 20px ${t.accent}44` : "none",
            }}>
              <div style={{background:t.bg, padding:14, height:70, display:"flex", flexDirection:"column", gap:6}}>
                <div style={{display:"flex",gap:5}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:t.accent}}/>
                  <div style={{width:8,height:8,borderRadius:"50%",background:t.accent,opacity:.6}}/>
                </div>
                <div style={{height:5,borderRadius:3,background:t.accent,width:"70%"}}/>
                <div style={{height:5,borderRadius:3,background:t.accent,width:"50%",opacity:.6}}/>
              </div>
              <div style={{
                background: t.text==="#ffffff"||t.text==="#f0f9ff"||t.text==="#f1f5f9" ? "#1a1a2e" : "#f9fafb",
                color: t.text==="#ffffff"||t.text==="#f0f9ff"||t.text==="#f1f5f9" ? "#fff" : "#374151",
                padding:"8px 10px", fontSize:11, fontWeight:800, textAlign:"center"
              }}>
                {current===id ? "✓ " : ""}{t.name}
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="btn-glass" style={{width:"100%",marginTop:16,padding:12,fontSize:14}}>Done</button>
      </div>
    </ModalOverlay>
  )
}
export default function App() {
  const [page, setPage] = useState("landing")
  const [user, setUser] = useState(null)
  const [habits, setHabits] = useState([])
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true) 
  const [totalXP, setTotalXP] = useState(0)
  const [lifetimeCompletedCount, setLifetimeCompletedCount] = useState(0)
  const [currentTheme, setCurrentTheme] = useState(() => {
  const saved = localStorage.getItem("hf_theme") || "aurora"
  applyTheme(saved)
  return saved
})
const [showTheme, setShowTheme] = useState(false)
  const [freezes, setFreezes] = useState(() => parseInt(localStorage.getItem("hf_freezes")||"0"))
  const [freezeToast, setFreezeToast] = useState(false)
  const [freezeDates, setFreezeDates] = useState(() => { try { return JSON.parse(localStorage.getItem("hf_freeze_dates")||"[]") } catch { return [] } }) 
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [showAdd, setShowAdd] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationLoading, setNotificationLoading] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationError, setNotificationError] = useState("")
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState("")
  const [checkoutNotice, setCheckoutNotice] = useState("")
  const [showMood, setShowMood] = useState(false)
  const [editHabit, setEditHabit] = useState(null)
  const [particles, setParticles] = useState(false)
  const [levelUpShow, setLevelUpShow] = useState(false)
  const [levelUpData, setLevelUpData] = useState(null)
  const [milestone, setMilestone] = useState(null)
  const [statsError, setStatsError] = useState("")
  const [authMode, setAuthMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authErr, setAuthErr] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [newName, setNewName] = useState("")
  const [newEmoji, setNewEmoji] = useState("🎯")
  const [newColor, setNewColor] = useState("#A78BFA")
  const [newTime, setNewTime] = useState("08:00")
  const [aiMsgs, setAiMsgs] = useState([])
  const [aiInput, setAiInput] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [steps, setSteps] = useState(() => parseInt(localStorage.getItem("hf_steps")||"0"))
  const [water, setWater] = useState(() => parseInt(localStorage.getItem("hf_water_"+todayStr)||"0"))
  const [mood, setMood] = useState(() => localStorage.getItem("hf_mood_"+todayStr)||"")

  const days = getLast7()
  const savingCompletionKeys = useRef(new Set())
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({data:{session}}) => {
      if (session?.user) { setUser(session.user); loadHabits(session.user.id) }
      setLoading(false)
    })
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session) => {
      if (session?.user) { setUser(session.user); setPage("app"); loadHabits(session.user.id) }
      else { setUser(null); setHabits([]); setPage("landing") }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!user || !supabase) return

    const params = new URLSearchParams(window.location.search)
    const checkoutResult = params.get("checkout")
    if (!checkoutResult) return

    const sessionId = params.get("session_id")
    window.history.replaceState({}, "", window.location.pathname || "/")

    if (checkoutResult === "cancel") {
      setCheckoutNotice("Checkout canceled. You can restart anytime.")
      setShowPaywall(true)
      return
    }

    if (checkoutResult !== "success" || !sessionId) return

    const confirmCheckout = async () => {
      setCheckoutLoading(true)
      setCheckoutError("")
      setCheckoutNotice("Confirming your subscription...")

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.access_token) throw new Error("Please sign in again to confirm checkout.")

        const res = await fetch("/api/confirm-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ sessionId }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Checkout confirmation failed.")

        if (data.success) {
          setIsPro(true)
          setShowPaywall(false)
          setCheckoutNotice("You're Pro now. Welcome aboard.")
          triggerParticles()
        } else {
          setShowPaywall(true)
          setCheckoutNotice("Checkout is not complete yet. Please try again.")
        }
      } catch (err) {
        setShowPaywall(true)
        setCheckoutError(err?.message || "Could not confirm checkout.")
      } finally {
        setCheckoutLoading(false)
      }
    }

    confirmCheckout()
  }, [user])

  const loadHabits = async (uid) => { 
    const {data:hd} = await supabase.from("habits").select("*").eq("user_id",uid).order("created_at")
    const {data:cd} = await supabase.from("completions").select("*").eq("user_id",uid)
    const loadedHabits = (hd||[]).map(h=>({...h,completions:Object.fromEntries((cd||[]).filter(c=>c.habit_id===h.id).map(c=>[c.date,true]))}))
    if (hd) setHabits(loadedHabits)
    const {data:p, error:profileError} = await supabase.from("profiles").select("is_pro, total_xp, lifetime_completed_count, theme, onboarding_completed").eq("id",uid).maybeSingle()
    let profile = p

    if (profileError?.message?.includes("onboarding_completed") || profileError?.message?.includes("lifetime_completed_count")) {
      const {data:fallbackProfile} = await supabase.from("profiles").select("is_pro, total_xp, theme").eq("id",uid).maybeSingle()
      profile = fallbackProfile
    }

if (profile) {
  setIsPro(profile.is_pro)
  setTotalXP(Number(profile.total_xp || 0))
  setLifetimeCompletedCount(Number(profile.lifetime_completed_count ?? cd?.length ?? 0))
  if (profile.theme) { setCurrentTheme(profile.theme); applyTheme(profile.theme) }
} else {
  setTotalXP(calcXP(loadedHabits, days))
  setLifetimeCompletedCount(cd?.length || 0)
}
    const hasExistingHabits = Boolean(hd?.length)
    const hasCompletedOnboarding = profile?.onboarding_completed === true || hasExistingHabits
    setShowOnboarding(!hasCompletedOnboarding)
  }

  const signInGoogle = async () => await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}})
  const signInEmail = async () => {
    setAuthLoading(true); setAuthErr("")
    const fn = authMode==="login" ? supabase.auth.signInWithPassword : supabase.auth.signUp
    const {error} = await fn.call(supabase.auth,{email,password})
    if (error) setAuthErr(error.message)
    else if (authMode==="signup") setAuthErr("✅ Check your email!")
    setAuthLoading(false)
  }
  const signOut = async () => supabase.auth.signOut()

  const showMilestone = (nextMilestone) => {
    setMilestone(nextMilestone)
    setTimeout(() => setMilestone(null), 2600)
  }

  const showStatsError = (message) => {
    setStatsError(message)
    setTimeout(() => setStatsError(""), 4000)
  }

  const upsertProfileStats = async (stats) => {
    let lastError = null
    for (let attempt = 0; attempt < 2; attempt++) {
      const {error} = await supabase.from("profiles").upsert(stats)
      if (!error) return {error:null}
      lastError = error
      if (attempt === 0) await wait(300)
    }
    return {error:lastError}
  }

  const toggle = async (id, date) => {
    const h = habits.find(x=>x.id===id)
    if (!h || !user) return
    const completionKey = `${id}:${date}`
    if (savingCompletionKeys.current.has(completionKey)) return
    savingCompletionKeys.current.add(completionKey)
    setStatsError("")
    const done = h.completions?.[date]
    try {
      if (done) {
        const {error} = await supabase.from("completions").delete().eq("habit_id",id).eq("date",date)
        if (error) {
          showStatsError("Could not update that habit. Please try again.")
          return
        }
      } else {
      const {error:completionError} = await supabase.from("completions").insert({habit_id:id,user_id:user.id,date})
      if (completionError) {
        showStatsError("Could not save that completion. Please try again.")
        return
      }
      triggerParticles() 
      const nextHabit = {...h, completions:{...h.completions,[date]:true}}
      const newStreak = getStreak(nextHabit, days, freezeDates)
      const streakBonus = newStreak * 5
      const xpEarned = 10 + streakBonus
      const {data:profileStats, error:profileStatsError} = await supabase.from("profiles").select("total_xp, lifetime_completed_count").eq("id",user.id).maybeSingle()
      if (profileStatsError) {
        await supabase.from("completions").delete().eq("habit_id",id).eq("user_id",user.id).eq("date",date)
        showStatsError("Could not sync XP, so the completion was not saved. Please try again.")
        return
      }
      const baseXP = Number(profileStats?.total_xp ?? totalXP ?? 0)
      const baseLifetimeCount = Number(profileStats?.lifetime_completed_count ?? lifetimeCompletedCount ?? 0)
      const newTotalXP = baseXP + xpEarned
      const newLifetimeCount = baseLifetimeCount + 1
      const {error:profileError} = await upsertProfileStats({
        id:user.id,
        total_xp:newTotalXP,
        lifetime_completed_count:newLifetimeCount,
      })
      if (profileError) {
        await supabase.from("completions").delete().eq("habit_id",id).eq("user_id",user.id).eq("date",date)
        showStatsError("Could not sync XP, so the completion was rolled back. Please try again.")
        return
      }
      setTotalXP(newTotalXP)
      setLifetimeCompletedCount(newLifetimeCount)
if (newStreak > 0 && newStreak % 7 === 0) {
  const maxFreezes = isPro ? 99 : 1
  if (freezes < maxFreezes) {
    const newFreezes = freezes + 1
    setFreezes(newFreezes)
    localStorage.setItem("hf_freezes", newFreezes)
    setFreezeToast("shield_earned")
    setTimeout(() => setFreezeToast(false), 3000)
  }
} 
      const oldLevel = getLevel(baseXP)
      const newLevel = getLevel(newTotalXP)
      if (newLevel.level > oldLevel.level) { setLevelUpData(newLevel); setLevelUpShow(true); setTimeout(()=>setLevelUpShow(false),2500) }
      else if (Math.floor(baseXP / 100) < Math.floor(newTotalXP / 100)) showMilestone({icon:"⚡",title:`${Math.floor(newTotalXP / 100) * 100} XP reached`,detail:"Your lifetime progress is saved"})
      else if (newStreak > 0 && newStreak % 7 === 0) showMilestone({icon:"🔥",title:`${newStreak}-day streak`,detail:`+${xpEarned} XP earned today`})
      }
      setHabits(h=>h.map(x=>x.id===id?{...x,completions:{...x.completions,[date]:!done}}:x))
    } finally {
      savingCompletionKeys.current.delete(completionKey)
    }
  }

  const addHabit = async () => {
    if (!newName.trim()) return
    if (!isPro && habits.length >= 3) { setShowPaywall(true); return }
    const {data} = await supabase.from("habits").insert({user_id:user.id,name:newName.trim(),emoji:newEmoji,color:newColor,reminder_time:newTime}).select().single()
    if (data) {
      setHabits(h=>[...h,{...data,completions:{}}])
      triggerParticles()
      maybeOpenNotificationPrompt()
    }
    setNewName(""); setShowAdd(false)
  }

  const addFromTemplate = async (t) => {
    if (!isPro && habits.length >= 3) { setShowPaywall(true); return }
    const {data} = await supabase.from("habits").insert({user_id:user.id,name:t.name,emoji:t.emoji,color:t.color,reminder_time:t.time}).select().single()
    if (data) setHabits(h=>[...h,{...data,completions:{}}])
    setShowTemplates(false)
  }

  const deleteHabit = async (id) => {
    await supabase.from("habits").delete().eq("id",id)
    setHabits(h=>h.filter(x=>x.id!==id)); setEditHabit(null)
  }

  const canUsePushNotifications = () => (
    Boolean(env.vapidPublicKey) &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  )

  const maybeOpenNotificationPrompt = () => {
    if (!canUsePushNotifications()) return
    if (localStorage.getItem("hf_notifications_prompt_dismissed") === "true") return
    if (Notification.permission === "default") setShowNotifications(true)
  }

  const dismissNotificationPrompt = () => {
    localStorage.setItem("hf_notifications_prompt_dismissed", "true")
    setShowNotifications(false)
  }

  const openThemeSwitcher = () => {
    setShowNotifications(false)
    setShowTheme(true)
  }

  const openNotificationExplainer = () => {
    setNotificationError("")
    setNotificationMessage("")
    setShowTheme(false)
    setShowNotifications(true)
  }

  const startCheckout = async () => {
    if (checkoutLoading) return
    setCheckoutLoading(true)
    setCheckoutError("")
    setCheckoutNotice("")

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) throw new Error("Please sign in before upgrading.")

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not start checkout.")
      if (!data.url) throw new Error("Checkout did not return a redirect URL.")

      window.location.href = data.url
    } catch (err) {
      setCheckoutError(err?.message || "Could not start checkout.")
      setCheckoutLoading(false)
    }
  }

  const triggerParticles = () => { setParticles(true); setTimeout(()=>setParticles(false),2500) }

  const setupPushNotifications = async () => {
    if (!canUsePushNotifications()) {
      setNotificationError("Reminders are not supported on this browser yet.")
      return false
    }

    setNotificationLoading(true)
    setNotificationError("")
    setNotificationMessage("")

    try {
      const applicationServerKey = urlBase64ToUint8Array(env.vapidPublicKey)
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        setNotificationLoading(false)
        setNotificationError("Notifications were not enabled. You can turn them on later from Settings.")
        return false
      }

      const registration = await navigator.serviceWorker.ready
      const existingSubscription = await registration.pushManager.getSubscription()
      const subscription = existingSubscription || await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })

      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) throw new Error("Please sign in again to enable reminders.")

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ subscription }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not save your reminder settings.")

      setNotificationMessage("Reminders are on. We'll nudge you at your habit times.")
      return true
    } catch (err) {
      setNotificationError(err?.message || "Could not enable reminders.")
      return false
    } finally {
      setNotificationLoading(false)
    }
  }

  const urlBase64ToUint8Array = (base64String) => {
    const key = normalizeVapidPublicKey(base64String)
    if (!key) throw new Error(PUSH_CONFIG_ERROR)
    if (/\s/.test(key) || !/^[A-Za-z0-9_-]+={0,2}$/.test(key)) throw new Error(PUSH_CONFIG_ERROR)

    const unpaddedKey = key.replace(/=+$/, "")
    const padding = "=".repeat((4 - unpaddedKey.length % 4) % 4)
    const base64 = (unpaddedKey + padding).replace(/-/g, "+").replace(/_/g, "/")
    let rawData = ""

    try {
      rawData = window.atob(base64)
    } catch {
      throw new Error(PUSH_CONFIG_ERROR)
    }

    if (rawData.length !== 65) throw new Error(PUSH_CONFIG_ERROR)
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
  }

  const sendAI = async () => {
    if (!aiInput.trim() || aiLoading) return
    const userMsg = { role:"user", content:aiInput }
    const updatedMsgs = [...aiMsgs, userMsg]
    setAiMsgs(updatedMsgs); setAiInput(""); setAiLoading(true)
    const habitList = habits.map(h=>`${h.emoji} ${h.name} (${getStreak(h,days)} day streak)`).join(", ")||"none yet"
    const todayDoneList = habits.filter(h=>h.completions?.[todayStr]).map(h=>h.name).join(", ")||"none yet"
    const systemPrompt = `You are an energetic, personal AI habit coach inside the HabitFlow app. You know this user personally:
- Their habits: ${habitList}
- Habits completed today: ${todayDoneList}
- Best streak: ${bestStreak} days
- Total XP: ${displayXP} (Level: ${currentLevel.title} ${currentLevel.icon})
- Steps today: ${steps.toLocaleString()}
- Water today: ${water}/8 cups
- Mood today: ${mood||"not logged"}
Rules: Be conversational, warm, personal. Keep under 120 words. Use 1-2 emojis. Give actionable tips.`
    try {
      const { data:{ session } } = await supabase.auth.getSession()
      const res = await fetch("/api/ai-coach", {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${session?.access_token}`},
        body:JSON.stringify({messages:updatedMsgs.map(m=>({role:m.role,content:m.content})),systemPrompt})
      })
      const data = await res.json()
      if (data.reply) setAiMsgs(prev=>[...prev,{role:"assistant",content:data.reply}])
      else throw new Error("No reply")
    } catch(err) {
      const fallbacks = [
        `You have ${habits.length} habits tracked! What specifically can I help you improve?`,
        `${bestStreak} day streak is solid. What's on your mind?`,
        `${doneToday}/${habits.length} habits done today — keep pushing! 💪`,
      ]
      setAiMsgs(prev=>[...prev,{role:"assistant",content:fallbacks[prev.length%fallbacks.length]}])
    }
    setAiLoading(false)
  }

  const addWater = (n) => { const v=Math.max(0,water+n); setWater(v); localStorage.setItem("hf_water_"+todayStr,v) }
  const addSteps = (n) => { const v=steps+n; setSteps(v); localStorage.setItem("hf_steps",v) }
  const saveMood = (m) => { setMood(m); localStorage.setItem("hf_mood_"+todayStr,m); setShowMood(false) }

  const xp = calcXP(habits, days)
const displayXP = totalXP > 0 ? totalXP : xp
const currentLevel = getLevel(displayXP)
const nextLevel = getNextLevel(currentLevel)
const xpPct = getLevelProgress(displayXP, currentLevel, nextLevel)
const levelXP = displayXP - currentLevel.minXP
const levelXPNeeded = nextLevel ? nextLevel.minXP - currentLevel.minXP : currentLevel.minXP
const lifetimeCompletions = Math.max(lifetimeCompletedCount, habits.reduce((s,h)=>s+Object.keys(h.completions||{}).length,0))
const maxFreezes = isPro ? 99 : 1
const shieldProgress = bestStreak > 0 ? bestStreak % 7 : 0
const daysToNextShield = shieldProgress === 0 ? 7 : 7 - shieldProgress
const lastFreezeDate = freezeDates.length ? [...freezeDates].sort().at(-1) : ""
  useEffect(() => {
  if (habits.length === 0 || freezes === 0) return
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1)
  const yesterdayStr = yesterday.toISOString().slice(0,10)
  const missedYesterday = habits.some(h => !h.completions?.[yesterdayStr])
  const alreadyFroze = freezeDates.includes(yesterdayStr)
  if (missedYesterday && !alreadyFroze) {
    const newDates = [...freezeDates, yesterdayStr]
    setFreezeDates(newDates)
    localStorage.setItem("hf_freeze_dates", JSON.stringify(newDates))
    const newFreezes = Math.max(0, freezes - 1)
    setFreezes(newFreezes)
    localStorage.setItem("hf_freezes", newFreezes)
    setFreezeToast("shield_used")
    setTimeout(() => setFreezeToast(false), 4000)
  }
}, [habits])

const bestStreak = habits.length ? Math.max(0,...habits.map(h=>getStreak(h,days,freezeDates))) : 0
  const doneToday = habits.filter(h=>h.completions?.[todayStr]).length
  const todayPct = habits.length ? Math.round((doneToday/habits.length)*100) : 0
  const stepsPct = Math.min((steps/10000)*100,100)
  const waterPct = Math.min((water/8)*100,100)
  const userEmail = user?.email || ""
  const userName = userEmail.split("@")[0] || "there"

  // LOADING
  if (loading) return (
    <div style={{minHeight:"100vh",background:"#0d0d1a",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{css}</style>
      <div style={{fontSize:52,animation:"spin 1s linear infinite"}}>⚡</div>
      <div style={{fontSize:20,fontWeight:900,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>HabitFlow</div>
    </div>
  )

  if (!hasSupabaseConfig) return (
    <div style={{minHeight:"100vh",background:"#0d0d1a",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Inter',sans-serif"}}>
      <style>{css}</style>
      <div className="card" style={{maxWidth:420,width:"100%",padding:28,textAlign:"center"}}>
        <div style={{fontSize:46,marginBottom:14}}>⚡</div>
        <div style={{fontSize:22,fontWeight:900,marginBottom:8,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          HabitFlow setup needed
        </div>
        <div style={{fontSize:14,lineHeight:1.6,color:"rgba(255,255,255,0.55)"}}>
          Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your environment, then restart the app.
        </div>
      </div>
    </div>
  )

  // LANDING PAGE
  if (page==="landing") return (
    <div style={{minHeight:"100vh",background:"#0d0d1a",fontFamily:"'Inter',sans-serif",overflow:"hidden"}}>
      <style>{css}</style>
      <div style={{position:"fixed",top:"5%",left:"5%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,#A78BFA1a,transparent 70%)",pointerEvents:"none",animation:"bgMove 10s ease-in-out infinite"}}/>
      <div style={{position:"fixed",bottom:"5%",right:"5%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,#4ECDC41a,transparent 70%)",pointerEvents:"none",animation:"bgMove 14s ease-in-out infinite reverse"}}/>
      <div style={{position:"fixed",top:"40%",left:"40%",width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,#FF6B6B12,transparent 70%)",pointerEvents:"none",animation:"bgMove 12s ease-in-out infinite"}}/>

      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 28px",position:"relative",zIndex:10}}>
        <div style={{fontSize:20,fontWeight:900,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>⚡ HabitFlow</div>
        <button onClick={()=>setPage("auth")} className="btn-glass" style={{padding:"9px 20px",fontSize:14}}>Sign In</button>
      </nav>

      <div style={{textAlign:"center",padding:"50px 24px 40px",position:"relative",zIndex:10}} className="fade-up">
        <div style={{position:"relative",width:180,height:180,margin:"0 auto 36px"}}>
          <div style={{position:"absolute",inset:0,borderRadius:"50%",background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",boxShadow:"0 0 80px #A78BFA44,0 0 140px #4ECDC422",animation:"float 4s ease-in-out infinite",display:"flex",alignItems:"center",justifyContent:"center",fontSize:76}}>🏆</div>
          {["💪","🧘","📚"].map((e,i)=>(
            <div key={i} style={{position:"absolute",top:"50%",left:"50%",width:42,height:42,borderRadius:"50%",background:"rgba(255,255,255,0.08)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,animation:`orbit${["A","B","C"][i]} ${7+i}s linear infinite`,transformOrigin:"-55px 0",marginLeft:-21,marginTop:-21}}>{e}</div>
          ))}
        </div>

        <h1 style={{fontSize:"clamp(34px,8vw,68px)",fontWeight:900,lineHeight:1.08,marginBottom:20,letterSpacing:-1.5}}>
          Build habits that<br/>
          <span style={{background:"linear-gradient(135deg,#FF6B6B,#FFD93D,#6BCB77,#4ECDC4,#A78BFA)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundSize:"200%",animation:"shimmer 3s linear infinite"}}>
            change your life
          </span>
        </h1>
        <p style={{fontSize:17,color:"rgba(255,255,255,0.55)",maxWidth:480,margin:"0 auto 40px",lineHeight:1.75}}>
          AI-powered habit tracking with 3D visuals, streaks, XP levels, and your personal coach.
        </p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:16}}>
          <button onClick={()=>setPage("auth")} className="btn-grad" style={{background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",padding:"16px 44px",fontSize:16,borderRadius:16,boxShadow:"0 8px 32px #A78BFA44"}}>Start Free →</button>
          <button onClick={signInGoogle} className="btn-glass" style={{padding:"16px 28px",fontSize:15}}>🔵 Google</button>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>Free forever · No credit card needed</div>
      </div>

      <div style={{maxWidth:860,margin:"0 auto",padding:"0 20px 60px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14,position:"relative",zIndex:10}}>
        {[
          {icon:"🔥",t:"Streaks & XP",d:"Level up every day",color:"#FF8E53"},
          {icon:"🤖",t:"AI Coach",d:"Personal motivation",color:"#A78BFA"},
          {icon:"🏆",t:"Achievements",d:"Earn real badges",color:"#FFD93D"},
          {icon:"📊",t:"Analytics",d:"Beautiful insights",color:"#4ECDC4"},
        ].map((f,i)=>(
          <div key={i} className="card float-a" style={{padding:22,textAlign:"center",animationDelay:i*.1+"s",background:`linear-gradient(135deg,${f.color}18,${f.color}06)`}}>
            <div style={{fontSize:34,marginBottom:10,filter:`drop-shadow(0 0 12px ${f.color})`}}>{f.icon}</div>
            <div style={{fontSize:15,fontWeight:800,marginBottom:4}}>{f.t}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>{f.d}</div>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",paddingBottom:32,fontSize:12,color:"rgba(255,255,255,0.2)"}}>© 2026 HabitFlow · contact@thehabitflow.app</div>
    </div>
  )

  // AUTH PAGE
  if (page==="auth") return (
    <div style={{minHeight:"100vh",background:"#0d0d1a",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{css}</style>
      <div style={{position:"fixed",top:"15%",left:"10%",width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,#A78BFA1a,transparent 70%)",pointerEvents:"none",animation:"bgMove 8s ease-in-out infinite"}}/>
      <div style={{position:"fixed",bottom:"15%",right:"10%",width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,#4ECDC41a,transparent 70%)",pointerEvents:"none",animation:"bgMove 11s ease-in-out infinite reverse"}}/>
      <div className="card" style={{maxWidth:400,width:"100%",padding:32,position:"relative",zIndex:10}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:42,marginBottom:8}}>⚡</div>
          <div style={{fontSize:22,fontWeight:900,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:6}}>HabitFlow</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>{authMode==="login"?"Welcome back! 👋":"Start your journey 🚀"}</div>
        </div>
        <button onClick={signInGoogle} className="btn-glass" style={{width:"100%",padding:14,fontSize:14,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <span style={{fontWeight:900,color:"#4285F4",fontSize:16}}>G</span> Continue with Google
        </button>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{flex:1,height:1,background:"rgba(255,255,255,0.08)"}}/><span style={{fontSize:11,color:"rgba(255,255,255,0.25)"}}>OR</span><div style={{flex:1,height:1,background:"rgba(255,255,255,0.08)"}}/>
        </div>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email" className="inp"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="inp" onKeyDown={e=>e.key==="Enter"&&signInEmail()}/>
        {authErr && <div style={{fontSize:12,color:authErr.includes("✅")?"#6BCB77":"#FF6B6B",marginBottom:10,textAlign:"center",fontWeight:600}}>{authErr}</div>}
        <button onClick={signInEmail} disabled={authLoading} className="btn-grad" style={{width:"100%",padding:14,fontSize:15,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",opacity:authLoading?0.6:1,marginBottom:12}}>
          {authLoading?"Loading...":(authMode==="login"?"Sign In 🚀":"Create Account ✨")}
        </button>
        <div style={{textAlign:"center",fontSize:13,color:"rgba(255,255,255,0.4)"}}>
          {authMode==="login"?"Don't have an account? ":"Already have one? "}
          <span onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthErr("")}} style={{color:"#A78BFA",cursor:"pointer",fontWeight:700}}>
            {authMode==="login"?"Sign Up":"Sign In"}
          </span>
        </div>
        <div style={{textAlign:"center",marginTop:12}}>
          <span onClick={()=>setPage("landing")} style={{fontSize:12,color:"rgba(255,255,255,0.25)",cursor:"pointer"}}>← Back</span>
        </div>
      </div>
    </div>
  )

  // MAIN APP
  return (
    <div style={{minHeight:"100vh",background:"#0d0d1a",color:"#fff",paddingBottom:96,maxWidth:480,margin:"0 auto",position:"relative"}}>
      <style>{css}</style>
      <Particles active={particles}/>
      <LevelUpBurst show={levelUpShow} level={levelUpData}/> 
      <MilestoneToast milestone={milestone}/>
      <FreezeToast type={freezeToast}/>
      {statsError && (
        <div style={{position:"fixed",top:76,left:"50%",transform:"translateX(-50%)",zIndex:130,width:"calc(100% - 32px)",maxWidth:440}}>
          <div className="card" style={{padding:"12px 14px",fontSize:13,fontWeight:700,color:"#FFB4B4",textAlign:"center",background:"rgba(255,107,107,0.14)",border:"1px solid rgba(255,107,107,0.28)"}}>
            {statsError}
          </div>
        </div>
      )}
      {checkoutNotice && !showPaywall && (
        <div style={{position:"fixed",top:76,left:"50%",transform:"translateX(-50%)",zIndex:120,width:"calc(100% - 32px)",maxWidth:440}}>
          <div className="card" style={{padding:"12px 14px",fontSize:13,fontWeight:700,color:"#fff",textAlign:"center",background:"rgba(107,203,119,0.16)",border:"1px solid rgba(107,203,119,0.28)"}}>
            {checkoutNotice}
          </div>
        </div>
      )}
      {showTheme && (
  <ThemeSwitcher
    current={currentTheme}
    onClose={()=>setShowTheme(false)}
    onSelect={async(themeId)=>{
      setCurrentTheme(themeId)
      applyTheme(themeId)
      setShowTheme(false)
      if(user) await supabase.from("profiles").upsert({id:user.id, theme:themeId})
    }}
  />
)}

      {showOnboarding && (
  <OnboardingQuiz
    onComplete={async (selectedHabits) => {
      const rows = selectedHabits.map(h => ({
          user_id: user.id,
          name: h.name,
          emoji: h.emoji,
          color: h.color,
          reminder_time: h.time,
      }))

      const {data, error} = await supabase.from("habits").insert(rows).select()
      if (error) throw error

      const createdHabits = (data || []).map(h => ({...h, completions:{}}))

      if (createdHabits.length === 0) throw new Error("No habits were created.")
      const {error:profileError} = await supabase.from("profiles").upsert({id:user.id,onboarding_completed:true})
      if (profileError) throw profileError

      setHabits(prev => [...prev, ...createdHabits])
      triggerParticles()
      return createdHabits
    }}
    onDone={() => {
      setShowOnboarding(false)
      maybeOpenNotificationPrompt()
    }}
  />
)}

      {/* BG */}
      <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,height:"100%",pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-10%",left:"-10%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,#A78BFA18,transparent 70%)",animation:"bgMove 12s ease-in-out infinite"}}/>
        <div style={{position:"absolute",bottom:"15%",right:"-10%",width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,#4ECDC418,transparent 70%)",animation:"bgMove 16s ease-in-out infinite reverse"}}/>
      </div>

      {/* TOP NAV */}
      <div className="top-nav">
        <div>
          <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.35)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:2}}>HABITFLOW</div>
          <div style={{fontSize:20,fontWeight:900}}>Hello, {userName} 👋</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div className="card" style={{padding:"6px 12px",display:"flex",alignItems:"center",gap:6,borderRadius:12}}>
            <span style={{fontSize:14}}>{currentLevel.icon}</span>
            <span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.7)"}}>Lv {currentLevel.level}</span>
          </div>
          <button onClick={()=>setShowAI(true)} className="btn-grad" style={{padding:"7px 14px",fontSize:12,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)"}}>🤖 AI</button>
          <button onClick={signOut} className="btn-glass" style={{padding:"7px 11px",fontSize:13}}>↪</button>
        </div>
      </div>

      <div style={{padding:"16px 16px 0",position:"relative",zIndex:5}}>

        {/* HOME TAB */}
        {activeTab==="home" && (
          <div className="fade-up">

            {/* HERO ROW: Ring + Stats */}
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:14,marginBottom:14}}>
              {/* Ring Card */}
              <div className="card float-a" style={{padding:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,minWidth:160}}>
                <Ring3D pct={todayPct} size={130} color="#A78BFA" label="TODAY'S PROGRESS" sublabel={`${doneToday}/${habits.length} done`}/>
              </div>

              {/* Right stats */}
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {/* Level Card */}
                <div className="card" style={{padding:"14px 16px",background:"linear-gradient(135deg,rgba(255,215,0,0.12),rgba(107,203,119,0.08))"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>LEVEL</div>
                  <div style={{fontSize:22,fontWeight:900,marginBottom:2}}>{currentLevel.icon} {currentLevel.title}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginBottom:8}}>⚡ {displayXP} XP · {nextLevel?`${nextLevel.minXP-displayXP} to next`:"MAX!"}</div>
                  <div style={{height:5,borderRadius:999,background:"rgba(255,255,255,0.08)",overflow:"hidden"}}>
                    <div style={{height:"100%",width:xpPct+"%",background:"linear-gradient(90deg,#FFD93D,#6BCB77)",transition:"width 0.8s ease",borderRadius:999}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,0.32)",fontWeight:700,marginTop:6}}>
                    <span>{nextLevel ? `${xpPct}% complete` : "Top level"}</span>
                    <span>{nextLevel ? `${levelXP}/${levelXPNeeded}` : `${displayXP} lifetime XP`}</span>
                  </div>
                </div>

                {/* Streak Card */}
<div className="card" style={{padding:"14px 16px",background:"linear-gradient(135deg,rgba(255,142,83,0.15),rgba(255,107,107,0.08))"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:8}}>
    <div>
      <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>PROTECTED STREAK</div>
      <FireStreak streak={bestStreak}/>
    </div>
    <div style={{textAlign:"right",minWidth:70}}>
      <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",fontWeight:700,marginBottom:4}}>SHIELDS</div>
      <div style={{fontSize:20,fontWeight:900,color:freezes>0?"#4ECDC4":"rgba(255,255,255,0.32)",filter:freezes>0?"drop-shadow(0 0 8px rgba(78,205,196,0.45))":"none"}}>{freezes}/{maxFreezes}</div>
    </div>
  </div>
  <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.45,fontWeight:600,marginBottom:10}}>
    {freezes>0 ? "You have a safety net if life interrupts a habit day." : "Reach 7 streak days to earn a shield for one missed day."}
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:8}}>
    {Array.from({length:7},(_,i)=>(
      <div key={i} style={{height:5,borderRadius:999,background:i<shieldProgress||bestStreak>0&&shieldProgress===0?"linear-gradient(90deg,#4ECDC4,#A78BFA)":"rgba(255,255,255,0.08)",boxShadow:i<shieldProgress||bestStreak>0&&shieldProgress===0?"0 0 8px rgba(78,205,196,0.35)":"none"}}/>
    ))}
  </div>
  <div style={{display:"flex",justifyContent:"space-between",gap:8,fontSize:10,color:"rgba(255,255,255,0.36)",fontWeight:700,lineHeight:1.35}}>
    <span>{bestStreak>0 && shieldProgress===0 ? "Shield earned at this milestone" : `${daysToNextShield} day${daysToNextShield===1?"":"s"} to next shield`}</span>
    {lastFreezeDate && <span>Last used {lastFreezeDate}</span>}
  </div>
</div>
</div>
</div>

            {/* STEPS CARD */}
            <div className="card" style={{padding:"16px 18px",marginBottom:14,background:"linear-gradient(135deg,rgba(78,205,196,0.12),rgba(69,183,209,0.06))"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,#4ECDC4,#45B7D1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 4px 16px rgba(78,205,196,0.4)"}}>🦶</div>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:1,textTransform:"uppercase"}}>STEPS</div>
                    <div style={{fontSize:30,fontWeight:900,lineHeight:1,background:"linear-gradient(135deg,#4ECDC4,#45B7D1)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{steps.toLocaleString()}</div>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:6}}>/ 10,000</div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>addSteps(500)} className="btn-grad" style={{padding:"5px 10px",fontSize:11,background:"linear-gradient(135deg,#4ECDC4,#45B7D1)"}}>+500</button>
                    <button onClick={()=>addSteps(1000)} className="btn-grad" style={{padding:"5px 10px",fontSize:11,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)"}}>+1k</button>
                  </div>
                </div>
              </div>
              <div style={{height:8,borderRadius:999,background:"rgba(255,255,255,0.07)",overflow:"hidden"}}>
                <div style={{height:"100%",width:stepsPct+"%",background:"linear-gradient(90deg,#4ECDC4,#45B7D1)",borderRadius:999,boxShadow:"0 0 10px rgba(78,205,196,0.5)",transition:"width 1s ease"}}/>
              </div>
            </div>

            {/* QUICK STATS ROW */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
              {[
                {icon:"💧",val:water+"/8",lbl:"Water",color:"#45B7D1",pct:waterPct,fn:()=>addWater(1)},
                {icon:"😊",val:mood||"—",lbl:"Mood",color:"#F472B6",fn:()=>setShowMood(true)},
                {icon:"🔥",val:Math.round(steps*0.04),lbl:"kcal",color:"#FF8E53"},
                {icon:"✅",val:doneToday+"/"+habits.length,lbl:"Done",color:"#6BCB77"},
              ].map((s,i)=>(
                <div key={i} className="card" onClick={s.fn} style={{padding:"12px 8px",textAlign:"center",cursor:s.fn?"pointer":"default",background:`linear-gradient(135deg,${s.color}18,${s.color}06)`}}>
                  <div style={{fontSize:20,marginBottom:4,filter:`drop-shadow(0 0 6px ${s.color})`}}>{s.icon}</div>
                  <div style={{fontSize:13,fontWeight:900,marginBottom:2}}>{s.val}</div>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",fontWeight:700,textTransform:"uppercase",letterSpacing:.3}}>{s.lbl}</div>
                  {s.pct!=null && <div style={{height:3,borderRadius:999,background:"rgba(255,255,255,0.08)",overflow:"hidden",marginTop:6}}><div style={{height:"100%",width:s.pct+"%",background:s.color,borderRadius:999}}/></div>}
                </div>
              ))}
            </div>

            {/* WATER CARD */}
            <div className="card" style={{padding:"16px 18px",marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>WATER TODAY</div>
                  <div style={{fontSize:22,fontWeight:900}}>{water} <span style={{fontSize:13,color:"rgba(255,255,255,0.35)",fontWeight:400}}>/ 8 cups</span></div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>addWater(-1)} className="btn-glass" style={{padding:"8px 14px",fontSize:16}}>−</button>
                  <button onClick={()=>addWater(1)} className="btn-grad" style={{background:"linear-gradient(135deg,#45B7D1,#A78BFA)",padding:"8px 16px",fontSize:13}}>+ Cup</button>
                </div>
              </div>
              <div style={{display:"flex",gap:5}}>
                {Array.from({length:8},(_,i)=>(
                  <div key={i} onClick={()=>{setWater(i+1);localStorage.setItem("hf_water_"+todayStr,i+1)}}
                    style={{flex:1,height:28,borderRadius:9,background:i<water?"linear-gradient(135deg,#45B7D1,#A78BFA)":"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",cursor:"pointer",transition:"all .25s",boxShadow:i<water?"0 0 8px rgba(69,183,209,0.5)":"none"}}/>
                ))}
              </div>
            </div>

            {/* TODAY'S HABITS */}
            {habits.length > 0 && (
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontSize:15,fontWeight:800}}>Habits</div>
                  <button onClick={()=>setActiveTab("habits")} style={{fontSize:12,color:"#A78BFA",fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>See all →</button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
                  {habits.slice(0,3).map(h=>{
                    const done = h.completions?.[todayStr]
                    const streak = getStreak(h, days)
                    return (
                      <div key={h.id} className="habit-card" style={{background:`linear-gradient(135deg,${h.color}18,${h.color}06)`,border:`1px solid ${done?h.color+"44":"rgba(255,255,255,0.08)"}`,padding:"14px 16px",boxShadow:done?`0 0 20px ${h.color}22`:"none"}}>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <div style={{width:46,height:46,borderRadius:14,background:`${h.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0,border:`1px solid ${h.color}33`,boxShadow:`0 0 16px ${h.color}22`}}>{h.emoji}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:14,fontWeight:700,marginBottom:3}}>{h.name}</div>
                            <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:600}}>🔥 {streak} streak · {days.filter(d=>h.completions?.[d]).length}/7 this week</div>
                          </div>
                          <button onClick={()=>toggle(h.id,todayStr)} className="btn-grad" style={{
                            padding:"8px 16px",fontSize:12,flexShrink:0,
                            background:done?`linear-gradient(135deg,${h.color},${h.color}cc)`:`linear-gradient(135deg,${h.color},${h.color}88)`,
                            boxShadow:done?`0 0 16px ${h.color}66`:"none",
                          }}>{done?"✓ Done":"+ Log"}</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* QUICK ACTIONS */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              <button onClick={()=>setShowTemplates(true)} className="btn-grad" style={{padding:14,fontSize:13,background:"linear-gradient(135deg,#FF6B6B,#FF8E53)",borderRadius:16}}>📋 Templates</button>
              <button onClick={()=>setShowAdd(true)} className="btn-grad" style={{padding:14,fontSize:13,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",borderRadius:16}}>+ New Habit</button>
            </div>
          </div>
        )}

        {/* HABITS TAB */}
        {activeTab==="habits" && (
          <div className="fade-up">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:22,fontWeight:900}}>My Habits</div>
              <button onClick={()=>setShowAdd(true)} className="btn-grad" style={{padding:"9px 18px",fontSize:13,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)"}}>+ Add</button>
            </div>
            {habits.length===0 ? (
              <div className="card" style={{padding:48,textAlign:"center"}}>
                <div style={{fontSize:64,marginBottom:16,animation:"float 3s ease-in-out infinite"}}>🌱</div>
                <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>No habits yet!</div>
                <div style={{color:"rgba(255,255,255,0.4)",fontSize:14,marginBottom:24}}>Start with a template or create your own</div>
                <button onClick={()=>setShowTemplates(true)} className="btn-grad" style={{padding:"13px 28px",fontSize:15,background:"linear-gradient(135deg,#FF6B6B,#FF8E53)"}}>Browse Templates 🎯</button>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {habits.map((h,i)=>{
                  const done = h.completions?.[todayStr]
                  const streak = getStreak(h, days)
                  const weekDone = days.filter(d=>h.completions?.[d]).length
                  return (
                    <div key={h.id} className="habit-card" style={{padding:"16px 18px",background:`linear-gradient(135deg,${h.color}18,${h.color}06)`,border:`1px solid ${done?h.color+"55":"rgba(255,255,255,0.08)"}`,boxShadow:done?`0 0 24px ${h.color}22,0 4px 20px rgba(0,0,0,0.3)`:"0 4px 20px rgba(0,0,0,0.25)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:14}}>
                        <div style={{width:52,height:52,borderRadius:16,background:`${h.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,boxShadow:`0 0 20px ${h.color}33`,border:`1px solid ${h.color}33`}}>{h.emoji}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:15,fontWeight:700,marginBottom:5}}>{h.name}</div>
                          <div style={{display:"flex",gap:10,fontSize:11,color:"rgba(255,255,255,0.45)",flexWrap:"wrap",marginBottom:8}}>
                            <span style={{color:h.color,fontWeight:700}}>🔥 {streak} streak</span>
                            {h.reminder_time && <span>⏰ {h.reminder_time}</span>}
                            <span>{weekDone}/7 this week</span>
                          </div>
                          <div style={{display:"flex",gap:4}}>
                            {days.map((d,di)=>(
                              <div key={di} style={{flex:1,height:6,borderRadius:3,background:h.completions?.[d]?h.color:"rgba(255,255,255,0.08)",boxShadow:h.completions?.[d]?`0 0 6px ${h.color}`:"none",transition:"all .3s"}}/>
                            ))}
                          </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:7,flexShrink:0}}>
                          <button onClick={()=>setEditHabit(h)} className="btn-glass" style={{padding:"6px 10px",fontSize:13}}>✏️</button>
                          <button onClick={()=>toggle(h.id,todayStr)} className="btn-grad" style={{padding:"8px 14px",fontSize:12,fontWeight:800,background:done?h.color:`linear-gradient(135deg,${h.color},${h.color}88)`,boxShadow:done?`0 0 16px ${h.color}66`:"none"}}>{done?"✓ Done":"Log"}</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab==="analytics" && (
  <div className="su">
    <div style={{fontSize:20,fontWeight:900,marginBottom:14}}>Analytics</div>
 
    {/* HEATMAP — visible to ALL users */}
    <HeatmapCalendar habits={habits}/>
 
    {!isPro ? (
      <div className="card-3d float-a" style={{padding:40,textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:14}}>🔒</div>
        <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>Pro Feature</div>
        <div style={{color:"rgba(255,255,255,0.4)",fontSize:14,marginBottom:22}}>Unlock detailed analytics and more</div>
        <button onClick={()=>setShowPaywall(true)} className="color-btn" style={{padding:"13px 28px",fontSize:15,background:"linear-gradient(135deg,#FFD93D,#FF8E53)"}}>Upgrade to Pro ⭐</button>
      </div>
    ) : (
      <>
        {/* XP Ring */}
        <div className="card-3d float-b" style={{padding:24,textAlign:"center",marginBottom:14,background:"linear-gradient(135deg,#A78BFA22,#4ECDC422)"}}>
          <Ring3D pct={xpPct} size={160} color="#A78BFA" label="LEVEL PROGRESS" sublabel={currentLevel.title}/>
          <div style={{marginTop:12,fontSize:13,color:"rgba(255,255,255,0.5)"}}>
            {nextLevel ? `${nextLevel.minXP-displayXP} XP to ${nextLevel.title}` : "MAX LEVEL! 👑"}
          </div>
          <div style={{marginTop:6,fontSize:11,color:"rgba(255,255,255,0.34)",fontWeight:700}}>
            {nextLevel ? `${levelXP}/${levelXPNeeded} XP in Level ${currentLevel.level}` : `${displayXP} lifetime XP saved`}
          </div>
        </div>
 
        {/* Stats grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          {[
            {lbl:"Lifetime Completions",val:lifetimeCompletions,color:"#4ECDC4"},
            {lbl:"Best Streak",val:bestStreak+"🔥",color:"#FF8E53"},
            {lbl:"Total XP",val:displayXP+"⚡",color:"#A78BFA"},
            {lbl:"Habits Tracked",val:habits.length,color:"#F472B6"},
          ].map(s=>(
            <div key={s.lbl} className="card-3d" style={{padding:18,background:`linear-gradient(135deg,${s.color}22,${s.color}08)`}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginBottom:6,fontWeight:700,letterSpacing:.5}}>{s.lbl}</div>
              <div style={{fontSize:28,fontWeight:900,filter:`drop-shadow(0 0 8px ${s.color})`}}>{s.val}</div>
            </div>
          ))}
        </div>
 
        {/* Habit completion bars */}
        <div className="card-3d" style={{padding:20,marginBottom:14}}>
          <div style={{fontSize:15,fontWeight:800,marginBottom:16}}>This Week</div>
          {habits.map(h=>{
            const cnt = days.filter(d=>h.completions?.[d]).length
            return (
              <div key={h.id} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13}}>
                  <span>{h.emoji} {h.name}</span>
                  <span style={{color:h.color,fontWeight:700}}>{cnt}/7</span>
                </div>
                <div style={{height:8,borderRadius:999,background:"rgba(255,255,255,0.08)",overflow:"hidden"}}>
                  <div style={{height:"100%",width:(cnt/7*100)+"%",background:h.color,borderRadius:999,boxShadow:`0 0 8px ${h.color}88`,transition:"width 1s"}}/>
                </div>
              </div>
            )
          })}
        </div>
      </>
    )}
  </div>
)}
 

        {/* SETTINGS TAB */}
        {activeTab==="settings" && (
          <div className="fade-up">
            <div style={{fontSize:22,fontWeight:900,marginBottom:16}}>Settings</div>

            {/* Profile Card */}
            <div className="card" style={{padding:"18px 20px",marginBottom:14,background:"linear-gradient(135deg,rgba(167,139,250,0.12),rgba(78,205,196,0.06))"}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:56,height:56,borderRadius:18,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,boxShadow:"0 4px 20px rgba(167,139,250,0.4)"}}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{fontSize:17,fontWeight:800,marginBottom:2}}>{userName}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{currentLevel.icon} {currentLevel.title} · {displayXP} XP</div>
                </div>
                <div style={{marginLeft:"auto",textAlign:"right"}}>
                  {isPro && <div style={{background:"linear-gradient(135deg,#FFD93D,#FF8E53)",borderRadius:8,padding:"3px 10px",fontSize:11,fontWeight:800}}>PRO ⭐</div>}
                </div>
              </div>
            </div>

            <div className="card" style={{padding:4,marginBottom:14,overflow:"hidden"}}>
              {[
  {icon:"⭐",lbl:isPro?"Pro Active ✓":"Upgrade to Pro",fn:()=>setShowPaywall(true),color:"#FFD93D"},
  {icon:"🎨",lbl:"Change Theme",fn:openThemeSwitcher,color:"#A78BFA"},
  {icon:"🔔",lbl:"Reminder Notifications",fn:openNotificationExplainer,color:"#4ECDC4"},
  {icon:"🤖",lbl:"AI Coach",fn:()=>setShowAI(true),color:"#A78BFA"},
  {icon:"📋",lbl:"Templates",fn:()=>setShowTemplates(true),color:"#4ECDC4"},
  {icon:"↪",lbl:"Sign Out",fn:signOut,color:"#FF6B6B"},
              ].map((item,i,arr)=>(
                <button key={i} type="button" onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); item.fn() }} className="btn-glass" style={{width:"100%",padding:"16px 18px",borderRadius:0,border:"none",borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.06)":"none",display:"flex",alignItems:"center",gap:14,fontSize:14,background:"transparent",textAlign:"left"}}>
                  <span style={{fontSize:22,filter:`drop-shadow(0 0 6px ${item.color})`}}>{item.icon}</span>
                  <span style={{fontWeight:600}}>{item.lbl}</span>
                  <span style={{marginLeft:"auto",color:"rgba(255,255,255,0.25)"}}>›</span>
                </button>
              ))}
            </div>

            <div style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.2)",padding:"10px 0"}}>
              HabitFlow v3.0 · Made with 💜<br/>contact@thehabitflow.app
            </div>
          </div>
        )}
      </div>

      {/* TAB BAR */}
      <div className="tab-bar">
        {[
          {id:"home",icon:"🏠",lbl:"Home"},
          {id:"habits",icon:"✅",lbl:"Habits"},
          {id:"analytics",icon:"📊",lbl:"Stats"},
          {id:"settings",icon:"⚙️",lbl:"Settings"},
        ].map(t=>(
          <div key={t.id} className={`tab-item ${activeTab===t.id?"active":""}`} onClick={()=>setActiveTab(t.id)}>
            <div className="tab-icon" style={{filter:activeTab===t.id?"drop-shadow(0 0 8px #A78BFA)":"none"}}>{t.icon}</div>
            <div className="tab-label">{t.lbl}</div>
            <div className="tab-dot"/>
          </div>
        ))}
      </div>

      {/* ADD HABIT SHEET */}
      {showAdd && (
        <div className="sheet" onClick={()=>setShowAdd(false)}>
          <div className="sheet-inner" onClick={e=>e.stopPropagation()}>
            <div className="sheet-handle"/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontSize:20,fontWeight:900}}>New Habit ✨</div>
              <button onClick={()=>setShowAdd(false)} className="btn-glass" style={{padding:"5px 11px",fontSize:14}}>✕</button>
            </div>
            <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Habit name..." className="inp"/>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:8,textTransform:"uppercase"}}>Pick Emoji</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
              {["🏃","💧","📚","🧘","🥗","💤","✍️","🎯","🎸","🌿","🧠","🏋️","🚴","🥤","🎨","💊","🌅","🚿"].map(e=>(
                <button key={e} onClick={()=>setNewEmoji(e)} style={{width:40,height:40,borderRadius:11,border:`2px solid ${newEmoji===e?"#A78BFA":"rgba(255,255,255,0.1)"}`,background:newEmoji===e?"rgba(167,139,250,0.2)":"transparent",cursor:"pointer",fontSize:19,transition:"all .2s",boxShadow:newEmoji===e?"0 0 12px rgba(167,139,250,0.4)":"none"}}>{e}</button>
              ))}
            </div>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:8,textTransform:"uppercase"}}>Pick Color</div>
            <div style={{display:"flex",gap:9,flexWrap:"wrap",marginBottom:16}}>
              {PALETTE.map(c=>(
                <button key={c} onClick={()=>setNewColor(c)} style={{width:32,height:32,borderRadius:"50%",background:c,border:newColor===c?"3px solid #fff":"2px solid transparent",cursor:"pointer",boxShadow:newColor===c?`0 0 14px ${c}`:"none",transition:"all .2s"}}/>
              ))}
            </div>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:6,textTransform:"uppercase"}}>⏰ Reminder Time</div>
            <input type="time" value={newTime} onChange={e=>setNewTime(e.target.value)} className="inp" style={{width:"auto",marginBottom:20}}/>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.38)",lineHeight:1.5,marginTop:-12,marginBottom:18}}>
              We'll ask before turning on notifications, then use this time for daily reminders.
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setShowAdd(false)} className="btn-glass" style={{flex:1,padding:14,fontSize:14}}>Cancel</button>
              <button onClick={addHabit} className="btn-grad" style={{flex:2,padding:14,fontSize:15,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)"}}>Add Habit 🚀</button>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATES */}
      {showTemplates && (
        <div className="overlay" onClick={()=>setShowTemplates(false)}>
          <div onClick={e=>e.stopPropagation()} className="card" style={{maxWidth:480,width:"100%",maxHeight:"88vh",overflowY:"auto",padding:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div style={{fontSize:20,fontWeight:900}}>📋 Templates</div>
              <button onClick={()=>setShowTemplates(false)} className="btn-glass" style={{padding:"5px 11px"}}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {HABIT_TEMPLATES.map(t=>(
                <div key={t.name} onClick={()=>addFromTemplate(t)} className="habit-card" style={{background:`linear-gradient(135deg,${t.color}18,${t.color}06)`,border:`1px solid ${t.color}33`,cursor:"pointer",padding:16}}>
                  <div style={{fontSize:28,marginBottom:6}}>{t.emoji}</div>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:3}}>{t.name}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>⏰ {t.time}</div>
                  <div style={{fontSize:10,color:t.color,marginTop:4,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>{t.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EDIT HABIT */}
      {editHabit && (
        <div className="overlay" onClick={()=>setEditHabit(null)}>
          <div onClick={e=>e.stopPropagation()} className="card" style={{maxWidth:420,width:"100%",padding:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontSize:20,fontWeight:900}}>Edit Habit</div>
              <button onClick={()=>setEditHabit(null)} className="btn-glass" style={{padding:"5px 11px"}}>✕</button>
            </div>
            <input defaultValue={editHabit.name} id="edit-name" className="inp" placeholder="Habit name"/>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
              {["🏃","💧","📚","🧘","🥗","💤","✍️","🎯","🎸","🌿","🧠","🏋️"].map(e=>(
                <button key={e} onClick={()=>setEditHabit(h=>({...h,emoji:e}))} style={{width:38,height:38,borderRadius:11,border:`2px solid ${editHabit.emoji===e?"#A78BFA":"rgba(255,255,255,0.1)"}`,background:editHabit.emoji===e?"rgba(167,139,250,0.2)":"transparent",cursor:"pointer",fontSize:18,transition:"all .2s"}}>{e}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
              {PALETTE.map(c=>(
                <button key={c} onClick={()=>setEditHabit(h=>({...h,color:c}))} style={{width:30,height:30,borderRadius:"50%",background:c,border:editHabit.color===c?"3px solid #fff":"2px solid transparent",cursor:"pointer",boxShadow:editHabit.color===c?`0 0 12px ${c}`:"none",transition:"all .2s"}}/>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>deleteHabit(editHabit.id)} className="btn-glass" style={{flex:1,padding:13,color:"#FF6B6B",border:"1px solid rgba(255,107,107,0.3)"}}>🗑️ Delete</button>
              <button onClick={async()=>{ const n=document.getElementById("edit-name")?.value; if(n){ await supabase.from("habits").update({name:n,emoji:editHabit.emoji,color:editHabit.color}).eq("id",editHabit.id); setHabits(h=>h.map(x=>x.id===editHabit.id?{...x,name:n,emoji:editHabit.emoji,color:editHabit.color}:x)); setEditHabit(null) }}} className="btn-grad" style={{flex:2,padding:13,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)"}}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* AI COACH */}
      {showAI && (
        <div className="overlay" onClick={()=>setShowAI(false)}>
          <div onClick={e=>e.stopPropagation()} className="card" style={{maxWidth:480,width:"100%",maxHeight:"85vh",display:"flex",flexDirection:"column",padding:0,overflow:"hidden"}}>
            <div style={{padding:"18px 20px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:18,fontWeight:900,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🤖 AI Habit Coach</div>
              <button onClick={()=>setShowAI(false)} className="btn-glass" style={{padding:"5px 11px"}}>✕</button>
            </div>
            <div style={{flex:1,padding:16,overflowY:"auto",minHeight:200}}>
              {aiMsgs.length===0 && (
                <div style={{padding:16}}>
                  <div style={{textAlign:"center",marginBottom:22}}>
                    <div style={{fontSize:48,marginBottom:10,animation:"float 3s ease-in-out infinite"}}>🤖</div>
                    <div style={{fontWeight:800,color:"#fff",marginBottom:4,fontSize:16}}>Your Personal AI Coach</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>I know your stats · Ask me anything</div>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.25)",letterSpacing:1,marginBottom:10,textAlign:"center",textTransform:"uppercase"}}>Suggested Questions</div>
                  {["How can I improve my streak?","What habit should I focus on?","I'm struggling to stay consistent","Give me a morning routine tip","How do I build better sleep habits?"].map(q=>(
                    <button key={q} onClick={()=>setAiInput(q)} style={{width:"100%",padding:"10px 14px",marginBottom:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:"rgba(255,255,255,0.65)",fontSize:13,cursor:"pointer",textAlign:"left",fontFamily:"'Inter',sans-serif",transition:"all .2s"}}
                    onMouseEnter={e=>e.target.style.background="rgba(255,255,255,0.09)"}
                    onMouseLeave={e=>e.target.style.background="rgba(255,255,255,0.04)"}>💬 {q}</button>
                  ))}
                </div>
              )}
              {aiMsgs.map((m,i)=>(
                <div key={i} style={{marginBottom:12,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"82%",padding:"11px 16px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?"linear-gradient(135deg,#A78BFA,#4ECDC4)":"rgba(255,255,255,0.07)",fontSize:13,lineHeight:1.6,border:m.role==="user"?"none":"1px solid rgba(255,255,255,0.08)"}}>{m.content}</div>
                </div>
              ))}
              {aiLoading && <div style={{color:"rgba(255,255,255,0.35)",fontSize:13,padding:8}}>🤖 Thinking...</div>}
            </div>
            <div style={{padding:14,borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",gap:8}}>
              <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAI()} placeholder="Ask your coach..." className="inp" style={{flex:1,marginBottom:0}}/>
              <button onClick={sendAI} disabled={aiLoading} className="btn-grad" style={{padding:"10px 18px",background:"linear-gradient(135deg,#A78BFA,#4ECDC4)"}}>Send</button>
            </div>
          </div>
        </div>
      )}

      {/* MOOD PICKER */}
      {showMood && (
        <div className="overlay" onClick={()=>setShowMood(false)}>
          <div onClick={e=>e.stopPropagation()} className="card" style={{maxWidth:360,width:"100%",padding:28,textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:900,marginBottom:6}}>How are you feeling? 😊</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:24}}>Daily mood check-in</div>
            <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:16}}>
              {["😴","😐","🙂","😊","🔥"].map(m=>(
                <button key={m} onClick={()=>saveMood(m)} style={{width:54,height:54,borderRadius:16,border:`2px solid ${mood===m?"#A78BFA":"rgba(255,255,255,0.1)"}`,background:mood===m?"rgba(167,139,250,0.2)":"transparent",fontSize:28,cursor:"pointer",transition:"all .2s",boxShadow:mood===m?"0 0 18px rgba(167,139,250,0.4)":"none",transform:mood===m?"scale(1.12)":"scale(1)"}}>{m}</button>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,0.25)",fontWeight:700,padding:"0 4px"}}>
              <span>Tired</span><span>Neutral</span><span>Good</span><span>Great</span><span>On fire!</span>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION OPT-IN */}
      {showNotifications && (
        <ModalOverlay onClose={dismissNotificationPrompt}>
          <div className="card" style={{maxWidth:390,width:"100%",padding:28,textAlign:"center"}}>
            <div style={{fontSize:54,marginBottom:14,animation:"float 3s ease-in-out infinite"}}>🔔</div>
            <div style={{fontSize:23,fontWeight:900,marginBottom:8,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              Stay on track gently
            </div>
            <div style={{fontSize:14,color:"rgba(255,255,255,0.52)",lineHeight:1.65,marginBottom:18}}>
              HabitFlow can send reminders at the times you choose for each habit. We will only show the browser permission prompt after you tap enable.
            </div>
            <div style={{textAlign:"left",background:"rgba(255,255,255,0.04)",borderRadius:16,padding:16,marginBottom:18,border:"1px solid rgba(255,255,255,0.07)"}}>
              {[
                "Daily nudges use your habit reminder times",
                "You can change each habit's time anytime",
                "No reminder is sent until notifications are enabled",
              ].map(f=>(
                <div key={f} style={{display:"flex",gap:10,marginBottom:10,fontSize:13,color:"rgba(255,255,255,0.72)",lineHeight:1.4}}>
                  <span style={{color:"#6BCB77"}}>✓</span>{f}
                </div>
              ))}
            </div>
            {notificationMessage && (
              <div style={{fontSize:12,lineHeight:1.5,color:"#B9F7CB",background:"rgba(107,203,119,0.12)",border:"1px solid rgba(107,203,119,0.25)",borderRadius:12,padding:"10px 12px",marginBottom:12,fontWeight:700}}>
                {notificationMessage}
              </div>
            )}
            {notificationError && (
              <div style={{fontSize:12,lineHeight:1.5,color:"#FFB4B4",background:"rgba(255,107,107,0.12)",border:"1px solid rgba(255,107,107,0.28)",borderRadius:12,padding:"10px 12px",marginBottom:12,fontWeight:700}}>
                {notificationError}
              </div>
            )}
            <button onClick={async()=>{ const ok = await setupPushNotifications(); if(ok) setTimeout(()=>setShowNotifications(false), 900) }} disabled={notificationLoading} className="btn-grad" style={{width:"100%",padding:15,fontSize:15,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",marginBottom:10,opacity:notificationLoading?0.65:1}}>
              {notificationLoading ? "Turning on reminders..." : "Enable Reminders"}
            </button>
            <button onClick={dismissNotificationPrompt} className="btn-glass" style={{width:"100%",padding:12,fontSize:13}}>Maybe later</button>
          </div>
        </ModalOverlay>
      )}

      {/* PRO PAYWALL */}
      {showPaywall && (
        <div className="overlay" onClick={()=>setShowPaywall(false)}>
          <div onClick={e=>e.stopPropagation()} className="card" style={{maxWidth:400,width:"100%",padding:32,textAlign:"center"}}>
            <div style={{fontSize:60,marginBottom:14,animation:"float 3s ease-in-out infinite"}}>⭐</div>
            <div style={{fontSize:26,fontWeight:900,marginBottom:6,background:"linear-gradient(135deg,#FFD93D,#FF8E53)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Upgrade to Pro</div>
            <div style={{fontSize:42,fontWeight:900,marginBottom:22}}>
              <span style={{background:"linear-gradient(135deg,#FFD93D,#FF8E53)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>$1.99</span>
              <span style={{fontSize:14,color:"rgba(255,255,255,0.35)",fontWeight:400}}>/month</span>
            </div>
            {checkoutNotice && (
              <div style={{fontSize:12,lineHeight:1.5,color:"#FFD93D",background:"rgba(255,217,61,0.1)",border:"1px solid rgba(255,217,61,0.22)",borderRadius:12,padding:"10px 12px",marginBottom:14,fontWeight:700}}>
                {checkoutNotice}
              </div>
            )}
            {checkoutError && (
              <div style={{fontSize:12,lineHeight:1.5,color:"#FFB4B4",background:"rgba(255,107,107,0.12)",border:"1px solid rgba(255,107,107,0.28)",borderRadius:12,padding:"10px 12px",marginBottom:14,fontWeight:700}}>
                {checkoutError}
              </div>
            )}
            <div style={{textAlign:"left",background:"rgba(255,255,255,0.04)",borderRadius:16,padding:16,marginBottom:24,border:"1px solid rgba(255,255,255,0.07)"}}>
              {["♾️ Unlimited habits","📊 Full analytics & XP","🤖 AI Coach unlimited","🏆 Leaderboard access","☁️ Priority cloud sync"].map(f=>(
                <div key={f} style={{display:"flex",gap:10,marginBottom:10,fontSize:14}}>
                  <span style={{color:"#6BCB77"}}>✓</span>{f}
                </div>
              ))}
            </div>
            <button onClick={startCheckout} disabled={checkoutLoading || isPro} className="btn-grad" style={{width:"100%",padding:16,fontSize:16,background:"linear-gradient(135deg,#FFD93D,#FF8E53)",marginBottom:10,opacity:checkoutLoading || isPro?0.65:1}}>
              {checkoutLoading ? "Opening checkout..." : isPro ? "Pro Active ✓" : "Start Pro Now 🚀"}
            </button>
            <button onClick={()=>setShowPaywall(false)} className="btn-glass" style={{width:"100%",padding:12,fontSize:13}}>Maybe later</button>
          </div>
        </div>
      )}
    </div>
  )
}
