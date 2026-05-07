import { useState, useEffect, useRef } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "https://ykmftbsglhoxoopzwbwd.supabase.co",
  import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbWZ0YnNnbGhveG9vcHp3YndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjI3MTAsImV4cCI6MjA5MzEzODcxMH0.L3VZxCH7ObRGkhLOuCvqxMoluEFKiKuYQo1Wnq5AR0U"
)

// ── COLORS ──
const PALETTE = [
  "#FF6B6B","#FF8E53","#FFD93D","#6BCB77","#4ECDC4","#45B7D1","#A78BFA","#F472B6"
]

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

const LEVELS = [
  { level:1, title:"Beginner",  icon:"🌱", minXP:0    },
  { level:2, title:"Explorer",  icon:"🚀", minXP:100  },
  { level:3, title:"Achiever",  icon:"⚡", minXP:250  },
  { level:4, title:"Champion",  icon:"🔥", minXP:500  },
  { level:5, title:"Master",    icon:"💎", minXP:1000 },
  { level:6, title:"Legend",    icon:"👑", minXP:2000 },
]

const getLast7 = () => Array.from({length:7},(_,i)=>{
  const d=new Date(); d.setDate(d.getDate()-(6-i)); return d.toISOString().slice(0,10)
})
const todayStr = new Date().toISOString().slice(0,10)

const calcXP = (habits, days) => {
  let xp=0
  habits.forEach(h=>{ let s=0; days.forEach(d=>{ if(h.completions?.[d]){xp+=10;s++;xp+=s*5}else s=0 }) })
  return xp
}
const getLevel = (xp) => LEVELS.slice().reverse().find(l=>xp>=l.minXP)||LEVELS[0]
const getStreak = (habit, days) => {
  let s=0; const rev=[...days].reverse()
  for(let d of rev){ if(habit.completions?.[d]) s++; else break }
  return s
}

// ── CSS ──
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',sans-serif;background:#0a0a0f;color:#fff;overflow-x:hidden}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:10px}

  @keyframes float{0%,100%{transform:translateY(0px) rotateX(0deg)}50%{transform:translateY(-8px) rotateX(2deg)}}
  @keyframes floatB{0%,100%{transform:translateY(0px) rotateX(0deg)}50%{transform:translateY(-12px) rotateX(-2deg)}}
  @keyframes floatC{0%,100%{transform:translateY(0px)}50%{transform:translateY(-6px)}}
  @keyframes spin3d{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.15);opacity:1}}
  @keyframes glow{0%,100%{box-shadow:0 0 20px currentColor}50%{box-shadow:0 0 40px currentColor,0 0 80px currentColor}}
  @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes popIn{0%{transform:scale(0) rotate(-10deg)}60%{transform:scale(1.15) rotate(5deg)}100%{transform:scale(1) rotate(0deg)}}
  @keyframes confettiFall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
  @keyframes levelUp{0%{transform:scale(1)}25%{transform:scale(1.4) rotate(-5deg)}50%{transform:scale(1.3) rotate(5deg)}75%{transform:scale(1.35) rotate(-3deg)}100%{transform:scale(1)}}
  @keyframes fireFlicker{0%,100%{transform:scaleY(1) scaleX(1)}25%{transform:scaleY(1.1) scaleX(0.95)}50%{transform:scaleY(0.95) scaleX(1.05)}75%{transform:scaleY(1.05) scaleX(0.98)}}
  @keyframes orbitA{0%{transform:rotate(0deg) translateX(120px) rotate(0deg)}100%{transform:rotate(360deg) translateX(120px) rotate(-360deg)}}
  @keyframes orbitB{0%{transform:rotate(120deg) translateX(120px) rotate(-120deg)}100%{transform:rotate(480deg) translateX(120px) rotate(-480deg)}}
  @keyframes orbitC{0%{transform:rotate(240deg) translateX(120px) rotate(-240deg)}100%{transform:rotate(600deg) translateX(120px) rotate(-600deg)}}
  @keyframes bgPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes ringFill{from{stroke-dasharray:0 283}to{stroke-dasharray:var(--dash) 283}}

  .float-a{animation:float 4s ease-in-out infinite}
  .float-b{animation:floatB 5s ease-in-out infinite}
  .float-c{animation:floatC 3.5s ease-in-out infinite}
  .su{animation:slideUp .5s ease-out forwards}
  .pop{animation:popIn .4s cubic-bezier(.34,1.56,.64,1) forwards}
  .fire{animation:fireFlicker 0.3s ease-in-out infinite}

  .card-3d{
    background:rgba(255,255,255,0.07);
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,0.12);
    border-radius:24px;
    box-shadow:
      0 8px 32px rgba(0,0,0,0.4),
      0 2px 0 rgba(255,255,255,0.08) inset,
      0 -1px 0 rgba(0,0,0,0.3) inset;
    transform-style:preserve-3d;
    transition:transform 0.3s ease, box-shadow 0.3s ease;
  }
  .card-3d:hover{
    transform:translateY(-6px) rotateX(3deg) rotateY(-1deg);
    box-shadow:
      0 20px 60px rgba(0,0,0,0.5),
      0 2px 0 rgba(255,255,255,0.12) inset,
      0 -1px 0 rgba(0,0,0,0.3) inset;
  }

  .glass-btn{
    background:rgba(255,255,255,0.1);
    backdrop-filter:blur(10px);
    border:1px solid rgba(255,255,255,0.2);
    border-radius:14px;
    color:#fff;
    font-family:'Inter',sans-serif;
    font-weight:700;
    cursor:pointer;
    transition:all 0.2s;
    transform-style:preserve-3d;
  }
  .glass-btn:hover{
    background:rgba(255,255,255,0.18);
    transform:translateY(-2px) scale(1.02);
    box-shadow:0 8px 24px rgba(0,0,0,0.3);
  }
  .glass-btn:active{transform:translateY(0) scale(0.98)}

  .color-btn{
    border:none;
    border-radius:14px;
    color:#fff;
    font-family:'Inter',sans-serif;
    font-weight:800;
    cursor:pointer;
    transition:all 0.25s cubic-bezier(.34,1.56,.64,1);
    box-shadow:0 4px 20px rgba(0,0,0,0.3),0 2px 0 rgba(255,255,255,0.2) inset;
    transform-style:preserve-3d;
  }
  .color-btn:hover{transform:translateY(-4px) scale(1.04);box-shadow:0 12px 32px rgba(0,0,0,0.4)}
  .color-btn:active{transform:translateY(-1px) scale(0.99)}

  .inp-3d{
    width:100%;
    padding:14px 18px;
    background:rgba(255,255,255,0.08);
    border:1px solid rgba(255,255,255,0.15);
    border-radius:14px;
    color:#fff;
    font-family:'Inter',sans-serif;
    font-size:14px;
    outline:none;
    margin-bottom:12px;
    box-sizing:border-box;
    backdrop-filter:blur(10px);
    transition:border-color 0.2s,box-shadow 0.2s;
  }
  .inp-3d:focus{border-color:rgba(255,255,255,0.4);box-shadow:0 0 0 3px rgba(255,255,255,0.08)}
  .inp-3d::placeholder{color:rgba(255,255,255,0.3)}

  .habit-card-3d{
    padding:18px;
    border-radius:22px;
    border:1px solid rgba(255,255,255,0.1);
    backdrop-filter:blur(20px);
    transition:all 0.35s cubic-bezier(.34,1.2,.64,1);
    transform-style:preserve-3d;
    position:relative;
    overflow:hidden;
    cursor:pointer;
  }
  .habit-card-3d::before{
    content:'';
    position:absolute;
    inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 60%);
    border-radius:inherit;
    pointer-events:none;
  }
  .habit-card-3d:hover{
    transform:translateY(-8px) rotateX(4deg) rotateY(-2deg) scale(1.02);
  }
  .habit-card-3d.done{
    box-shadow:0 0 30px currentColor, 0 8px 32px rgba(0,0,0,0.4);
  }

  .ring-container{position:relative;display:inline-flex;align-items:center;justify-content:center}
  .ring-glow{filter:drop-shadow(0 0 8px currentColor)}

  .overlay-3d{
    position:fixed;inset:0;
    background:rgba(0,0,0,0.7);
    backdrop-filter:blur(12px);
    z-index:1000;
    display:flex;align-items:center;justify-content:center;
    padding:20px;
  }
  .sheet-3d{
    background:rgba(15,15,25,0.95);
    backdrop-filter:blur(30px);
    border:1px solid rgba(255,255,255,0.12);
    border-radius:28px 28px 0 0;
    padding:24px 20px 36px;
    width:100%;
    box-shadow:0 -20px 60px rgba(0,0,0,0.5);
  }
  .bottom-sheet{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(12px);z-index:1000;display:flex;align-items:flex-end;}

  .nav-3d{
    background:rgba(10,10,20,0.85);
    backdrop-filter:blur(20px);
    border-bottom:1px solid rgba(255,255,255,0.08);
    position:sticky;top:0;z-index:50;
    padding:14px 20px;
    display:flex;align-items:center;justify-content:space-between;
  }

  .tab-bar{
    position:fixed;bottom:0;left:50%;transform:translateX(-50%);
    width:100%;max-width:480px;
    background:rgba(10,10,20,0.92);
    backdrop-filter:blur(20px);
    border-top:1px solid rgba(255,255,255,0.08);
    display:flex;align-items:center;
    z-index:50;
    padding:10px 0 24px;
  }
 .tab-item{
    flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;
    cursor:pointer;padding:4px 0;transition:all 0.2s;min-width:0;
  }
  .tab-item:hover{transform:translateY(-2px)}
  .tab-icon{font-size:20px;transition:transform 0.2s;line-height:1}
  .tab-item.active .tab-icon{transform:scale(1.2)}
  .tab-label{font-size:9px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;color:rgba(255,255,255,0.85)}
  .tab-item.active .tab-label{color:#fff}
  .tab-dot{width:4px;height:4px;border-radius:50%;background:transparent;margin-top:2px}
  .tab-item.active .tab-dot{background:#fff}

  .progress-ring{transition:stroke-dasharray 1s cubic-bezier(.4,0,.2,1)}

  /* TOOLTIPS */
  .tip{position:relative}
  .tip::after{
    content:attr(data-tip);
    position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);
    background:rgba(20,20,35,0.95);color:#fff;font-size:11px;font-weight:700;
    padding:5px 10px;border-radius:8px;white-space:nowrap;pointer-events:none;
    opacity:0;transition:opacity .2s;border:1px solid rgba(255,255,255,0.15);
    backdrop-filter:blur(10px);letter-spacing:.3px;z-index:999;
  }
  .tip:hover::after{opacity:1}

  /* SMOOTH CURSOR */
  button{cursor:pointer}
  a{cursor:pointer}

  .shimmer{
    background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0) 100%);
    background-size:200% 100%;
    animation:shimmer 2s infinite;
  }

  .particle{
    position:fixed;width:6px;height:6px;border-radius:50%;pointer-events:none;z-index:9999;
    animation:confettiFall 2s ease forwards;
  }
`

// ── FLOATING PARTICLES COMPONENT ──
function Particles({ active }) {
  if (!active) return null
  const colors = ["#FF6B6B","#FFD93D","#6BCB77","#4ECDC4","#A78BFA","#F472B6","#FF8E53","#45B7D1"]
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}>
      {Array.from({length:40},(_,i)=>(
        <div key={i} className="particle" style={{
          left:Math.random()*100+"%",
          top:"-10px",
          background:colors[i%colors.length],
          borderRadius:Math.random()>.5?"50%":"3px",
          width:6+Math.random()*8+"px",
          height:6+Math.random()*8+"px",
          animationDelay:Math.random()*0.8+"s",
          animationDuration:1.5+Math.random()*1.5+"s",
        }}/>
      ))}
    </div>
  )
}

// ── 3D RING ──
function Ring3D({ pct, size=140, color="#A78BFA", label, sublabel }) {
  const r = (size/2) - 14
  const circ = 2 * Math.PI * r
  const dash = (pct/100) * circ
  return (
    <div className="ring-container" style={{width:size,height:size}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)",filter:`drop-shadow(0 0 10px ${color}88)`}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
          className="progress-ring"
          style={{filter:`drop-shadow(0 0 6px ${color})`}}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}33`} strokeWidth="10"
          strokeDasharray={`${circ} 0`}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",transform:"rotate(0deg)"}}>
        <div style={{fontSize:size>100?28:18,fontWeight:900,color:"#fff"}}>{Math.round(pct)}%</div>
        {label && <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",letterSpacing:.5,marginTop:2}}>{label}</div>}
        {sublabel && <div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{sublabel}</div>}
      </div>
    </div>
  )
}

// ── FIRE STREAK ──
function FireStreak({ streak }) {
  if (streak === 0) return <span style={{fontSize:28}}>0🔥</span>
  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <div style={{fontSize:32,animation:"fireFlicker 0.4s ease-in-out infinite",filter:"drop-shadow(0 0 8px #FF8E53)"}}>🔥</div>
      <div style={{fontSize:28,fontWeight:900,background:"linear-gradient(135deg,#FF8E53,#FFD93D)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{streak}</div>
    </div>
  )
}

// ── LEVEL UP ANIMATION ──
function LevelUpBurst({ show, level }) {
  if (!show) return null
  return (
    <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998,pointerEvents:"none"}}>
      <div style={{textAlign:"center",animation:"levelUp 0.8s ease forwards"}}>
        <div style={{fontSize:80}}>{level?.icon}</div>
        <div style={{fontSize:24,fontWeight:900,color:"#FFD93D",marginTop:8,textShadow:"0 0 20px #FFD93D"}}>LEVEL UP!</div>
        <div style={{fontSize:16,color:"rgba(255,255,255,0.8)",marginTop:4}}>{level?.title}</div>
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState("landing")
  const [user, setUser] = useState(null)
  const [habits, setHabits] = useState([])
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("home")
  const [showAdd, setShowAdd] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [showMood, setShowMood] = useState(false)
  const [editHabit, setEditHabit] = useState(null)
  const [particles, setParticles] = useState(false)
  const [levelUpShow, setLevelUpShow] = useState(false)
  const [levelUpData, setLevelUpData] = useState(null)
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
  const [profile, setProfile] = useState(() => { try{return JSON.parse(localStorage.getItem("hf_profile")||"{}")}catch{return {}} })

  const days = getLast7()
  const prevXP = useRef(0)

  // ── Auth ──
  useEffect(() => {
    supabase.auth.getSession().then(({data:{session}}) => {
      if (session?.user) { setUser(session.user); loadHabits(session.user.id) }
      setLoading(false)
    })
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session) => {
      if (session?.user) { setUser(session.user); setPage("app"); loadHabits(session.user.id) }
      else { setUser(null); setHabits([]); setPage("landing") }
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadHabits = async (uid) => {
    const {data:hd} = await supabase.from("habits").select("*").eq("user_id",uid).order("created_at")
    const {data:cd} = await supabase.from("completions").select("*").eq("user_id",uid)
    if (hd) setHabits(hd.map(h=>({...h,completions:Object.fromEntries((cd||[]).filter(c=>c.habit_id===h.id).map(c=>[c.date,true]))})))
    const {data:p} = await supabase.from("profiles").select("is_pro").eq("id",uid).single()
    if (p) setIsPro(p.is_pro)
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

  // ── Habits ──
  const toggle = async (id, date) => {
    const h = habits.find(x=>x.id===id)
    const done = h.completions?.[date]
    if (done) {
      await supabase.from("completions").delete().eq("habit_id",id).eq("date",date)
    } else {
      await supabase.from("completions").insert({habit_id:id,user_id:user.id,date})
      triggerParticles()
      // check level up
      const newXP = calcXP([...habits.map(x=>x.id===id?{...x,completions:{...x.completions,[date]:true}}:x)], days)
      const oldLevel = getLevel(prevXP.current)
      const newLevel = getLevel(newXP)
      if (newLevel.level > oldLevel.level) { setLevelUpData(newLevel); setLevelUpShow(true); setTimeout(()=>setLevelUpShow(false),2000) }
      prevXP.current = newXP
    }
    setHabits(h=>h.map(x=>x.id===id?{...x,completions:{...x.completions,[date]:!done}}:x))
  }

  const addHabit = async () => {
    if (!newName.trim()) return
    if (!isPro && habits.length >= 3) { setShowPaywall(true); return }
    const {data} = await supabase.from("habits").insert({user_id:user.id,name:newName.trim(),emoji:newEmoji,color:newColor,reminder_time:newTime}).select().single()
    if (data) { setHabits(h=>[...h,{...data,completions:{}}]); triggerParticles() }
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

  const triggerParticles = () => { setParticles(true); setTimeout(()=>setParticles(false),2500) }

 const sendAI = async () => {
  if (!aiInput.trim() || aiLoading) return

  const userMsg = { role: "user", content: aiInput }
  const updatedMsgs = [...aiMsgs, userMsg]
  setAiMsgs(updatedMsgs)
  setAiInput("")
  setAiLoading(true)

  const habitList = habits.map(h => `${h.emoji} ${h.name} (${getStreak(h, days)} day streak)`).join(", ") || "none yet"
  const todayDoneList = habits.filter(h => h.completions?.[todayStr]).map(h => h.name).join(", ") || "none yet"

  const systemPrompt = `You are an energetic, personal AI habit coach inside the HabitFlow app. You know this user personally:
- Their habits: ${habitList}
- Habits completed today: ${todayDoneList}
- Best streak: ${bestStreak} days
- Total XP: ${xp} (Level: ${currentLevel.title} ${currentLevel.icon})
- Steps today: ${steps.toLocaleString()}
- Water today: ${water}/8 cups
- Mood today: ${mood || "not logged"}

Rules:
- NEVER give the same response twice. Always respond to their SPECIFIC message.
- Be conversational, warm, and personal. Reference their actual habits and stats.
- Keep responses under 120 words. Use 1-2 emojis max.
- If they ask about a specific habit, give specific advice for that habit.
- If they seem down, be encouraging. If they're doing well, celebrate with them.
- Give actionable tips, not generic motivation.`

  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    const res = await fetch("/api/ai-coach", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        messages: updatedMsgs.map(m => ({ role: m.role, content: m.content })),
        systemPrompt,
      }),
    })

    const data = await res.json()

    if (data.reply) {
      setAiMsgs(prev => [...prev, { role: "assistant", content: data.reply }])
    } else {
      throw new Error(data.error || "No reply")
    }

  } catch(err) {
    const fallbacks = [
      `Looking at your ${habits.length} habits — you're building something real here! What specifically can I help you improve?`,
      `${bestStreak} day streak is no joke. That takes real discipline. What's on your mind?`,
      `You've got ${doneToday}/${habits.length} habits done today. Tell me more about what you're working on!`,
    ]
    setAiMsgs(prev => [...prev, {
      role: "assistant",
      content: fallbacks[prev.length % fallbacks.length]
    }])
  }

  setAiLoading(false)
}
  const addWater = (n) => {
    const v = Math.max(0,water+n); setWater(v)
    localStorage.setItem("hf_water_"+todayStr,v)
  }
  const addSteps = (n) => {
    const v = steps+n; setSteps(v)
    localStorage.setItem("hf_steps",v)
  }
  const saveMood = (m) => {
    setMood(m); localStorage.setItem("hf_mood_"+todayStr,m); setShowMood(false)
  }

  // ── Stats ──
  const xp = calcXP(habits, days)
  const currentLevel = getLevel(xp)
  const nextLevel = LEVELS.find(l=>l.level===currentLevel.level+1)
  const xpPct = nextLevel ? Math.round(((xp-currentLevel.minXP)/(nextLevel.minXP-currentLevel.minXP))*100) : 100
  const bestStreak = habits.length ? Math.max(0,...habits.map(h=>getStreak(h,days))) : 0
  const doneToday = habits.filter(h=>h.completions?.[todayStr]).length
  const todayPct = habits.length ? Math.round((doneToday/habits.length)*100) : 0
  const stepsPct = Math.min((steps/10000)*100,100)
  const waterPct = Math.min((water/8)*100,100)

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20}}>
      <style>{css}</style>
      <div style={{fontSize:48,animation:"spin3d 1s linear infinite"}}>⚡</div>
      <div style={{fontSize:22,fontWeight:900,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>HabitFlow</div>
    </div>
  )

  // ── LANDING ──
  if (page==="landing") return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",fontFamily:"'Inter',sans-serif",overflow:"hidden"}}>
      <style>{css}</style>
      {/* BG orbs */}
      <div style={{position:"fixed",top:"10%",left:"10%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,#A78BFA33,transparent 70%)",pointerEvents:"none",animation:"bgPulse 6s ease-in-out infinite"}}/>
      <div style={{position:"fixed",bottom:"10%",right:"10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,#4ECDC433,transparent 70%)",pointerEvents:"none",animation:"bgPulse 8s ease-in-out infinite reverse"}}/>
      <div style={{position:"fixed",top:"50%",left:"50%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,#FF6B6B22,transparent 70%)",transform:"translate(-50%,-50%)",pointerEvents:"none",animation:"bgPulse 7s ease-in-out infinite"}}/>

      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 28px",position:"relative",zIndex:10}}>
        <div style={{fontSize:22,fontWeight:900,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>⚡ HabitFlow</div>
        <button onClick={()=>setPage("auth")} className="glass-btn" style={{padding:"10px 22px",fontSize:14}}>Sign In</button>
      </nav>

      <div style={{textAlign:"center",padding:"60px 24px 40px",position:"relative",zIndex:10}} className="su">
        {/* Floating 3D orbs */}
        <div style={{position:"relative",width:200,height:200,margin:"0 auto 32px"}}>
          <div style={{position:"absolute",inset:0,borderRadius:"50%",background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",boxShadow:"0 0 60px #A78BFA88, 0 0 120px #4ECDC444",animation:"float 4s ease-in-out infinite",display:"flex",alignItems:"center",justifyContent:"center",fontSize:80}}>🏆</div>
          {/* Orbiting habits */}
          {["💪","🧘","📚"].map((e,i)=>(
            <div key={i} style={{position:"absolute",top:"50%",left:"50%",width:40,height:40,borderRadius:"50%",background:`rgba(255,255,255,0.1)`,backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
              animation:`orbit${["A","B","C"][i]} ${6+i}s linear infinite`,
              transformOrigin:"-60px 0",marginLeft:-20,marginTop:-20}}>
              {e}
            </div>
          ))}
        </div>

        <h1 style={{fontSize:"clamp(36px,8vw,72px)",fontWeight:900,lineHeight:1.05,marginBottom:18,letterSpacing:-1}}>
          Build habits that<br/>
          <span style={{background:"linear-gradient(135deg,#FF6B6B,#FFD93D,#6BCB77,#4ECDC4,#A78BFA)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundSize:"200%",animation:"shimmer 3s linear infinite"}}>
            change your life
          </span>
        </h1>
        <p style={{fontSize:18,color:"rgba(255,255,255,0.6)",maxWidth:500,margin:"0 auto 40px",lineHeight:1.7}}>
          3D habit tracking with AI coaching, streaks, XP levels, and beautiful visualizations.
        </p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>setPage("auth")} className="color-btn" style={{background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",padding:"16px 40px",fontSize:17,borderRadius:16,boxShadow:"0 8px 32px #A78BFA66"}}>Start Free →</button>
          <button onClick={signInGoogle} className="glass-btn" style={{padding:"16px 28px",fontSize:15}}>🔵 Google</button>
        </div>
        <div style={{marginTop:16,fontSize:13,color:"rgba(255,255,255,0.35)"}}>Free forever · No credit card</div>
      </div>

      {/* 3D Feature Cards */}
      <div style={{maxWidth:900,margin:"40px auto",padding:"0 20px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,position:"relative",zIndex:10}}>
        {[
          {icon:"🔥",t:"Streaks & XP",d:"Level up daily",color:"#FF8E53",delay:"0s"},
          {icon:"🤖",t:"AI Coach",d:"Smart motivation",color:"#A78BFA",delay:".1s"},
          {icon:"🏆",t:"Achievements",d:"Earn badges",color:"#FFD93D",delay:".2s"},
          {icon:"📊",t:"Analytics",d:"Beautiful insights",color:"#4ECDC4",delay:".3s"},
        ].map((f,i)=>(
          <div key={i} className="card-3d float-a" style={{padding:24,textAlign:"center",animationDelay:f.delay,background:`linear-gradient(135deg,${f.color}22,${f.color}08)`}}>
            <div style={{fontSize:36,marginBottom:10,filter:`drop-shadow(0 0 10px ${f.color})`}}>{f.icon}</div>
            <div style={{fontSize:16,fontWeight:800,marginBottom:4}}>{f.t}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>{f.d}</div>
          </div>
        ))}
      </div>

      <div style={{textAlign:"center",padding:"40px 24px",position:"relative",zIndex:10}}>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.3)"}}>© 2026 HabitFlow · contact@thehabitflow.app</div>
      </div>
    </div>
  )

  // ── AUTH ──
  if (page==="auth") return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Inter',sans-serif"}}>
      <style>{css}</style>
      <div style={{position:"fixed",top:"20%",left:"15%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,#A78BFA33,transparent 70%)",pointerEvents:"none",animation:"bgPulse 5s ease-in-out infinite"}}/>
      <div style={{position:"fixed",bottom:"20%",right:"15%",width:250,height:250,borderRadius:"50%",background:"radial-gradient(circle,#4ECDC433,transparent 70%)",pointerEvents:"none",animation:"bgPulse 7s ease-in-out infinite reverse"}}/>

      <div className="card-3d" style={{maxWidth:400,width:"100%",padding:32,position:"relative",zIndex:10}} >
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:24,fontWeight:900,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:6}}>⚡ HabitFlow</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>{authMode==="login"?"Welcome back! 👋":"Join the movement 🚀"}</div>
        </div>
        <button onClick={signInGoogle} className="glass-btn" style={{width:"100%",padding:14,fontSize:14,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <span style={{fontWeight:900,color:"#4285F4"}}>G</span> Continue with Google
        </button>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{flex:1,height:1,background:"rgba(255,255,255,0.1)"}}/><span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>OR</span><div style={{flex:1,height:1,background:"rgba(255,255,255,0.1)"}}/>
        </div>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" className="inp-3d"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="inp-3d" onKeyDown={e=>e.key==="Enter"&&signInEmail()}/>
        {authErr && <div style={{fontSize:12,color:authErr.includes("✅")?"#6BCB77":"#FF6B6B",marginBottom:10,textAlign:"center"}}>{authErr}</div>}
        <button onClick={signInEmail} disabled={authLoading} className="color-btn" style={{width:"100%",padding:14,fontSize:15,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",opacity:authLoading?0.6:1,marginBottom:10}}>
          {authLoading?"Loading...":(authMode==="login"?"Sign In 🚀":"Create Account ✨")}
        </button>
        <div style={{textAlign:"center",fontSize:13,color:"rgba(255,255,255,0.4)"}}>
          {authMode==="login"?"No account? ":"Have account? "}
          <span onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthErr("")}} style={{color:"#A78BFA",cursor:"pointer",fontWeight:700}}>
            {authMode==="login"?"Sign Up":"Sign In"}
          </span>
        </div>
        <div style={{textAlign:"center",marginTop:12}}>
          <span onClick={()=>setPage("landing")} style={{fontSize:12,color:"rgba(255,255,255,0.3)",cursor:"pointer"}}>← Back</span>
        </div>
      </div>
    </div>
  )

  // ── MAIN APP ──
  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",fontFamily:"'Inter',sans-serif",color:"#fff",paddingBottom:88,maxWidth:480,margin:"0 auto",position:"relative"}}>
      <style>{css}</style>
      <Particles active={particles}/>
      <LevelUpBurst show={levelUpShow} level={levelUpData}/>

      {/* BG orbs */}
      <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,height:"100%",pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",top:"10%",left:"10%",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,#A78BFA22,transparent 70%)",animation:"bgPulse 8s ease-in-out infinite"}}/>
        <div style={{position:"absolute",bottom:"20%",right:"5%",width:250,height:250,borderRadius:"50%",background:"radial-gradient(circle,#4ECDC422,transparent 70%)",animation:"bgPulse 10s ease-in-out infinite reverse"}}/>
      </div>

      {/* NAV */}
      <div className="nav-3d" style={{position:"relative",zIndex:10}}>
        <div style={{fontSize:18,fontWeight:900,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>⚡ HabitFlow</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.6)"}}>
            {currentLevel.icon} {currentLevel.title}
          </div>
          <button onClick={()=>setShowAI(true)} className="glass-btn tip" data-tip="AI Coach" style={{padding:"6px 12px",fontSize:12,position:"relative"}}>🤖 AI</button>
          <button onClick={signOut} className="glass-btn tip" data-tip="Sign Out" style={{padding:"6px 10px",fontSize:12,position:"relative"}}>↪</button>
        </div>
      </div>

      <div style={{padding:"16px 16px 0",position:"relative",zIndex:10}}>

        {/* ── HOME TAB ── */}
        {activeTab==="home" && (
          <div className="su">
            {/* HERO: Ring + Level */}
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:14,marginBottom:14}}>
              <div className="card-3d float-a" style={{padding:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
                <Ring3D pct={todayPct} size={130} color="#A78BFA" label="TODAY" sublabel={`${doneToday}/${habits.length}`}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div className="card-3d" style={{padding:16,background:"linear-gradient(135deg,#FF6B6B22,#FF8E5322)",flex:1}}>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",letterSpacing:1,marginBottom:4}}>STREAK</div>
                  <FireStreak streak={bestStreak}/>
                </div>
                <div className="card-3d" style={{padding:16,background:"linear-gradient(135deg,#FFD93D22,#6BCB7722)",flex:1}}>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",letterSpacing:1,marginBottom:4}}>LEVEL</div>
                  <div style={{fontSize:20,fontWeight:900}}>{currentLevel.icon} {currentLevel.title}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2}}>⚡ {xp} XP</div>
                  <div style={{height:4,borderRadius:999,background:"rgba(255,255,255,0.1)",overflow:"hidden",marginTop:8}}>
                    <div style={{height:"100%",width:xpPct+"%",background:"linear-gradient(90deg,#FFD93D,#6BCB77)",transition:"width .6s"}}/>
                  </div>
                </div>
              </div>
            </div>

            {/* STATS ROW */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
              {[
                {icon:"🦶",val:steps>=1000?(steps/1000).toFixed(1)+"k":steps,lbl:"Steps",color:"#4ECDC4",pct:stepsPct},
                {icon:"💧",val:water+"/8",lbl:"Water",color:"#45B7D1",pct:waterPct,fn:()=>addWater(1)},
                {icon:"😊",val:mood||"+",lbl:"Mood",color:"#F472B6",fn:()=>setShowMood(true)},
                {icon:"🔥",val:Math.round(steps*0.04),lbl:"kcal",color:"#FF8E53"},
              ].map((s,i)=>(
                <div key={i} className="card-3d" onClick={s.fn} style={{padding:12,textAlign:"center",cursor:s.fn?"pointer":"default",background:`linear-gradient(135deg,${s.color}22,${s.color}08)`}}>
                  <div style={{fontSize:18,marginBottom:4,filter:`drop-shadow(0 0 6px ${s.color})`}}>{s.icon}</div>
                  <div style={{fontSize:14,fontWeight:900}}>{s.val}</div>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontWeight:700,textTransform:"uppercase",letterSpacing:.3}}>{s.lbl}</div>
                  {s.pct!=null && <div style={{height:3,borderRadius:999,background:"rgba(255,255,255,0.1)",overflow:"hidden",marginTop:6}}><div style={{height:"100%",width:s.pct+"%",background:s.color}}/></div>}
                </div>
              ))}
            </div>

            {/* STEPS CARD */}
            <div className="card-3d float-c" style={{padding:18,marginBottom:14,background:"linear-gradient(135deg,#4ECDC422,#45B7D122)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",letterSpacing:1}}>STEPS TODAY</div>
                  <div style={{fontSize:28,fontWeight:900,filter:"drop-shadow(0 0 8px #4ECDC4)"}}>{steps.toLocaleString()}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <button onClick={()=>addSteps(500)} className="color-btn" style={{background:"linear-gradient(135deg,#4ECDC4,#45B7D1)",padding:"6px 14px",fontSize:12}}>+500</button>
                  <button onClick={()=>addSteps(1000)} className="color-btn" style={{background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",padding:"6px 14px",fontSize:12}}>+1k</button>
                </div>
              </div>
              <div style={{height:8,borderRadius:999,background:"rgba(255,255,255,0.08)",overflow:"hidden"}}>
                <div style={{height:"100%",width:stepsPct+"%",background:"linear-gradient(90deg,#4ECDC4,#45B7D1)",borderRadius:999,boxShadow:"0 0 10px #4ECDC488",transition:"width 1s"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:11,color:"rgba(255,255,255,0.4)"}}>
                <span>0</span><span>Goal: 10,000</span>
              </div>
            </div>

            {/* WATER CARD */}
            <div className="card-3d" style={{padding:18,marginBottom:14,background:"linear-gradient(135deg,#45B7D122,#A78BFA11)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",letterSpacing:1}}>WATER TODAY</div>
                  <div style={{fontSize:24,fontWeight:900}}>{water} <span style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>/ 8 cups</span></div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>addWater(-1)} className="glass-btn" style={{padding:"8px 14px",fontSize:16}}>−</button>
                  <button onClick={()=>addWater(1)} className="color-btn" style={{background:"linear-gradient(135deg,#45B7D1,#A78BFA)",padding:"8px 14px",fontSize:14}}>+ Cup</button>
                </div>
              </div>
              <div style={{display:"flex",gap:5}}>
                {Array.from({length:8},(_,i)=>(
                  <div key={i} onClick={()=>{setWater(i+1);localStorage.setItem("hf_water_"+todayStr,i+1)}}
                    style={{flex:1,height:24,borderRadius:8,background:i<water?"linear-gradient(135deg,#45B7D1,#A78BFA)":"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer",transition:"all .2s",boxShadow:i<water?"0 0 8px #45B7D188":"none"}}/>
                ))}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:16}}>
              <button onClick={()=>setShowTemplates(true)} className="color-btn" style={{padding:14,fontSize:13,background:"linear-gradient(135deg,#FF6B6B,#FF8E53)",borderRadius:16}}>📋 Templates</button>
              <button onClick={()=>setShowAdd(true)} className="color-btn" style={{padding:14,fontSize:13,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",borderRadius:16}}>+ New Habit</button>
            </div>
          </div>
        )}

        {/* ── HABITS TAB ── */}
        {activeTab==="habits" && (
          <div className="su">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:20,fontWeight:900}}>My Habits</div>
              <button onClick={()=>setShowAdd(true)} className="color-btn" style={{padding:"9px 18px",fontSize:13,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)"}}>+ Add</button>
            </div>

            {habits.length===0 ? (
              <div className="card-3d" style={{padding:48,textAlign:"center"}}>
                <div style={{fontSize:64,marginBottom:16,animation:"float 3s ease-in-out infinite"}}>🌱</div>
                <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>No habits yet!</div>
                <div style={{color:"rgba(255,255,255,0.4)",fontSize:14,marginBottom:24}}>Start with a template or create your own</div>
                <button onClick={()=>setShowTemplates(true)} className="color-btn" style={{padding:"13px 28px",fontSize:15,background:"linear-gradient(135deg,#FF6B6B,#FF8E53)"}}>Browse Templates 🎯</button>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {habits.map((h,i) => {
                  const done = h.completions?.[todayStr]
                  const streak = getStreak(h, days)
                  const weekDone = days.filter(d=>h.completions?.[d]).length
                  return (
                    <div key={h.id} className="habit-card-3d" style={{
                      background:`linear-gradient(135deg,${h.color}22,${h.color}08)`,
                      boxShadow:done?`0 0 24px ${h.color}66,0 8px 32px rgba(0,0,0,0.4)`:"0 4px 20px rgba(0,0,0,0.3)",
                      border:`1px solid ${done?h.color+"66":"rgba(255,255,255,0.1)"}`,
                      animationDelay:i*.05+"s"
                    }}>
                      <div style={{display:"flex",alignItems:"center",gap:14}}>
                        <div style={{width:52,height:52,borderRadius:16,background:`${h.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,
                          boxShadow:`0 0 20px ${h.color}44`,
                          border:`1px solid ${h.color}44`}}>
                          {h.emoji}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{h.name}</div>
                          <div style={{display:"flex",gap:10,fontSize:12,color:"rgba(255,255,255,0.5)",flexWrap:"wrap"}}>
                            <span style={{color:h.color,fontWeight:700}}>🔥 {streak} streak</span>
                            {h.reminder_time && <span>⏰ {h.reminder_time}</span>}
                            <span>{weekDone}/7 this week</span>
                          </div>
                          {/* Week dots */}
                          <div style={{display:"flex",gap:4,marginTop:8}}>
                            {days.map((d,di)=>(
                              <div key={di} style={{width:20,height:6,borderRadius:3,
                                background:h.completions?.[d]?h.color:"rgba(255,255,255,0.1)",
                                boxShadow:h.completions?.[d]?`0 0 6px ${h.color}`:"none",
                                transition:"all .3s"}}/>
                            ))}
                          </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                          <button onClick={()=>setEditHabit(h)} className="glass-btn" style={{padding:"6px 10px",fontSize:13}}>✏️</button>
                          <button onClick={()=>toggle(h.id,todayStr)} className="color-btn" style={{
                            padding:"8px 14px",fontSize:12,fontWeight:800,
                            background:done?h.color:`linear-gradient(135deg,${h.color},${h.color}88)`,
                            boxShadow:done?`0 0 16px ${h.color}88`:"none"
                          }}>
                            {done?"✓ Done":"Log"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {activeTab==="analytics" && (
          <div className="su">
            <div style={{fontSize:20,fontWeight:900,marginBottom:14}}>Analytics</div>
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
                    {nextLevel ? `${nextLevel.minXP-xp} XP to ${nextLevel.title}` : "MAX LEVEL! 👑"}
                  </div>
                </div>

                {/* Stats grid */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                  {[
                    {lbl:"Total Completions",val:habits.reduce((s,h)=>s+Object.keys(h.completions||{}).length,0),color:"#4ECDC4"},
                    {lbl:"Best Streak",val:bestStreak+"🔥",color:"#FF8E53"},
                    {lbl:"Total XP",val:xp+"⚡",color:"#A78BFA"},
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

        {/* ── SETTINGS TAB ── */}
        {activeTab==="settings" && (
          <div className="su">
            <div style={{fontSize:20,fontWeight:900,marginBottom:14}}>Settings</div>
            <div className="card-3d" style={{padding:4,marginBottom:14,overflow:"hidden"}}>
              {[
                {icon:"⭐",lbl:isPro?"Pro Active":"Upgrade to Pro",fn:()=>setShowPaywall(true),color:"#FFD93D"},
                {icon:"🤖",lbl:"AI Coach",fn:()=>setShowAI(true),color:"#A78BFA"},
                {icon:"📋",lbl:"Templates",fn:()=>setShowTemplates(true),color:"#4ECDC4"},
                {icon:"↪",lbl:"Sign Out",fn:signOut,color:"#FF6B6B"},
              ].map((item,i,arr)=>(
                <button key={i} onClick={item.fn} className="glass-btn" style={{
                  width:"100%",padding:"16px 18px",borderRadius:0,
                  border:"none",borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.07)":"none",
                  display:"flex",alignItems:"center",gap:14,fontSize:15,
                  background:"transparent"
                }}>
                  <span style={{fontSize:22,filter:`drop-shadow(0 0 6px ${item.color})`}}>{item.icon}</span>
                  <span style={{fontWeight:600}}>{item.lbl}</span>
                  <span style={{marginLeft:"auto",color:"rgba(255,255,255,0.3)"}}>›</span>
                </button>
              ))}
            </div>
            <div style={{textAlign:"center",fontSize:12,color:"rgba(255,255,255,0.25)",padding:"10px 0"}}>
              HabitFlow v3.0 · Made with 💜<br/>contact@thehabitflow.app<br/>
            <span style={{color:"rgba(255,255,255,0.2)",fontSize:10}}>Add VITE_ANTHROPIC_KEY to Vercel env for live AI</span>
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
            <div className="tab-icon" style={{filter:activeTab===t.id?`drop-shadow(0 0 8px #A78BFA)`:"none"}}>{t.icon}</div>
            <div className="tab-label">{t.lbl}</div>
            <div className="tab-dot"/>
          </div>
        ))}
      </div>

      {/* ── ADD HABIT ── */}
      {showAdd && (
        <div className="bottom-sheet" onClick={()=>setShowAdd(false)}>
          <div className="sheet-3d" onClick={e=>e.stopPropagation()} style={{maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontSize:20,fontWeight:900}}>New Habit ✨</div>
              <button onClick={()=>setShowAdd(false)} className="glass-btn" style={{padding:"5px 11px",fontSize:14}}>✕</button>
            </div>
            <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Habit name..." className="inp-3d"/>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:1,marginBottom:8}}>EMOJI</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
              {["🏃","💧","📚","🧘","🥗","💤","✍️","🎯","🎸","🌿","🧠","🏋️","🚴","🥤","🎨","💊","🌅","🚿"].map(e=>(
                <button key={e} onClick={()=>setNewEmoji(e)} style={{width:38,height:38,borderRadius:10,
                  border:`2px solid ${newEmoji===e?"#fff":"rgba(255,255,255,0.1)"}`,
                  background:newEmoji===e?"rgba(255,255,255,0.15)":"transparent",cursor:"pointer",fontSize:18,
                  boxShadow:newEmoji===e?"0 0 12px rgba(255,255,255,0.3)":"none",transition:"all .2s"}}>
                  {e}
                </button>
              ))}
            </div>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:1,marginBottom:8}}>COLOR</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
              {PALETTE.map(c=>(
                <button key={c} onClick={()=>setNewColor(c)} style={{width:30,height:30,borderRadius:"50%",background:c,border:newColor===c?"3px solid #fff":"2px solid transparent",cursor:"pointer",boxShadow:newColor===c?`0 0 12px ${c}`:"none",transition:"all .2s"}}/>
              ))}
            </div>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:1,marginBottom:6}}>⏰ REMINDER</div>
            <input type="time" value={newTime} onChange={e=>setNewTime(e.target.value)} className="inp-3d" style={{width:"auto",marginBottom:20}}/>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setShowAdd(false)} className="glass-btn" style={{flex:1,padding:14,fontSize:14}}>Cancel</button>
              <button onClick={addHabit} className="color-btn" style={{flex:2,padding:14,fontSize:15,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)"}}>Add Habit 🚀</button>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATES */}
      {showTemplates && (
        <div className="overlay-3d" onClick={()=>setShowTemplates(false)}>
          <div onClick={e=>e.stopPropagation()} className="card-3d" style={{maxWidth:480,width:"100%",maxHeight:"85vh",overflowY:"auto",padding:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,position:"sticky",top:-24,background:"rgba(15,15,25,0.95)",paddingBottom:10,paddingTop:8,margin:"0 -4px 16px",padding:"8px 4px"}}>
              <div style={{fontSize:20,fontWeight:900}}>📋 Templates</div>
              <button onClick={()=>setShowTemplates(false)} className="glass-btn" style={{padding:"5px 11px"}}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {HABIT_TEMPLATES.map(t=>(
                <div key={t.name} onClick={()=>addFromTemplate(t)} className="habit-card-3d" style={{background:`linear-gradient(135deg,${t.color}22,${t.color}08)`,border:`1px solid ${t.color}33`,cursor:"pointer"}}>
                  <div style={{fontSize:28,marginBottom:6}}>{t.emoji}</div>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{t.name}</div>
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
        <div className="overlay-3d" onClick={()=>setEditHabit(null)}>
          <div onClick={e=>e.stopPropagation()} className="card-3d" style={{maxWidth:420,width:"100%",padding:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontSize:20,fontWeight:900}}>Edit Habit</div>
              <button onClick={()=>setEditHabit(null)} className="glass-btn" style={{padding:"5px 11px"}}>✕</button>
            </div>
            <input defaultValue={editHabit.name} id="edit-name" className="inp-3d" placeholder="Habit name"/>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
              {["🏃","💧","📚","🧘","🥗","💤","✍️","🎯","🎸","🌿","🧠","🏋️"].map(e=>(
                <button key={e} onClick={()=>setEditHabit(h=>({...h,emoji:e}))} style={{width:36,height:36,borderRadius:10,border:`2px solid ${editHabit.emoji===e?"#fff":"rgba(255,255,255,0.1)"}`,background:editHabit.emoji===e?"rgba(255,255,255,0.15)":"transparent",cursor:"pointer",fontSize:17,transition:"all .2s"}}>{e}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
              {PALETTE.map(c=>(
                <button key={c} onClick={()=>setEditHabit(h=>({...h,color:c}))} style={{width:28,height:28,borderRadius:"50%",background:c,border:editHabit.color===c?"3px solid #fff":"2px solid transparent",cursor:"pointer",boxShadow:editHabit.color===c?`0 0 10px ${c}`:"none",transition:"all .2s"}}/>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>deleteHabit(editHabit.id)} className="glass-btn" style={{flex:1,padding:13,color:"#FF6B6B",border:"1px solid #FF6B6B44"}}>🗑️ Delete</button>
              <button onClick={async()=>{ const n=document.getElementById("edit-name")?.value; if(n){ await supabase.from("habits").update({name:n,emoji:editHabit.emoji,color:editHabit.color}).eq("id",editHabit.id); setHabits(h=>h.map(x=>x.id===editHabit.id?{...x,name:n,emoji:editHabit.emoji,color:editHabit.color}:x)); setEditHabit(null) }}} className="color-btn" style={{flex:2,padding:13,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)"}}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* AI COACH */}
      {showAI && (
        <div className="overlay-3d" onClick={()=>setShowAI(false)}>
          <div onClick={e=>e.stopPropagation()} className="card-3d" style={{maxWidth:480,width:"100%",maxHeight:"80vh",display:"flex",flexDirection:"column",padding:0,overflow:"hidden"}}>
            <div style={{padding:"18px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:18,fontWeight:900,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🤖 AI Habit Coach</div>
              <button onClick={()=>setShowAI(false)} className="glass-btn" style={{padding:"5px 11px"}}>✕</button>
            </div>
            <div style={{flex:1,padding:16,overflowY:"auto",minHeight:200}}>
              {aiMsgs.length===0 && (
                <div style={{padding:16}}>
                  <div style={{textAlign:"center",marginBottom:20}}>
                    <div style={{fontSize:44,marginBottom:10,animation:"float 3s ease-in-out infinite"}}>🤖</div>
                    <div style={{fontWeight:800,color:"#fff",marginBottom:4,fontSize:16}}>Your AI Habit Coach</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>I know your stats • Ask me anything</div>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:10,textAlign:"center"}}>SUGGESTED QUESTIONS</div>
                  {[
                    "How can I improve my streak?",
                    "What habit should I focus on?",
                    "I'm struggling to stay consistent",
                    "Give me a morning routine tip",
                    "How do I build better sleep habits?",
                  ].map(q=>(
                    <button key={q} onClick={()=>{setAiInput(q)}} style={{
                      width:"100%",padding:"10px 14px",marginBottom:8,
                      background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:12,color:"rgba(255,255,255,0.7)",fontSize:13,
                      cursor:"pointer",textAlign:"left",fontFamily:"'Inter',sans-serif",
                      transition:"all .2s"
                    }}
                    onMouseEnter={e=>e.target.style.background="rgba(255,255,255,0.1)"}
                    onMouseLeave={e=>e.target.style.background="rgba(255,255,255,0.05)"}
                    >
                      💬 {q}
                    </button>
                  ))}
                </div>
              )}
              {aiMsgs.map((m,i)=>(
                <div key={i} style={{marginBottom:12,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"82%",padding:"11px 16px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
                    background:m.role==="user"?"linear-gradient(135deg,#A78BFA,#4ECDC4)":"rgba(255,255,255,0.08)",
                    fontSize:13,lineHeight:1.55,border:m.role==="user"?"none":"1px solid rgba(255,255,255,0.1)"}}>
                    {m.content}
                  </div>
                </div>
              ))}
              {aiLoading && <div style={{color:"rgba(255,255,255,0.4)",fontSize:13,padding:8}}>🤖 Thinking...</div>}
            </div>
            <div style={{padding:14,borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",gap:8}}>
              <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAI()} placeholder="Ask your coach..." className="inp-3d" style={{flex:1,marginBottom:0}}/>
              <button onClick={sendAI} disabled={aiLoading} className="color-btn" style={{padding:"10px 16px",background:"linear-gradient(135deg,#A78BFA,#4ECDC4)"}}>Send</button>
            </div>
          </div>
        </div>
      )}

      {/* MOOD PICKER */}
      {showMood && (
        <div className="overlay-3d" onClick={()=>setShowMood(false)}>
          <div onClick={e=>e.stopPropagation()} className="card-3d" style={{maxWidth:360,width:"100%",padding:28,textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:900,marginBottom:6}}>How are you feeling? 😊</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:22}}>Daily mood check-in</div>
            <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:14}}>
              {["😴","😐","🙂","😊","🔥"].map(m=>(
                <button key={m} onClick={()=>saveMood(m)} style={{width:52,height:52,borderRadius:16,
                  border:`2px solid ${mood===m?"#fff":"rgba(255,255,255,0.1)"}`,
                  background:mood===m?"rgba(255,255,255,0.15)":"transparent",
                  fontSize:28,cursor:"pointer",transition:"all .2s",
                  boxShadow:mood===m?"0 0 16px rgba(255,255,255,0.3)":"none",
                  transform:mood===m?"scale(1.15)":"scale(1)"}}>
                  {m}
                </button>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:700}}>
              <span>Tired</span><span>Okay</span><span>Good</span><span>Great</span><span>🔥</span>
            </div>
          </div>
        </div>
      )}

      {/* PRO PAYWALL */}
      {showPaywall && (
        <div className="overlay-3d" onClick={()=>setShowPaywall(false)}>
          <div onClick={e=>e.stopPropagation()} className="card-3d" style={{maxWidth:400,width:"100%",padding:32,textAlign:"center"}}>
            <div style={{fontSize:56,marginBottom:14,animation:"float 3s ease-in-out infinite"}}>⭐</div>
            <div style={{fontSize:26,fontWeight:900,marginBottom:6,background:"linear-gradient(135deg,#FFD93D,#FF8E53)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Upgrade to Pro</div>
            <div style={{fontSize:40,fontWeight:900,marginBottom:20}}>
              <span style={{background:"linear-gradient(135deg,#FFD93D,#FF8E53)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>$1.99</span>
              <span style={{fontSize:14,color:"rgba(255,255,255,0.4)",fontWeight:400}}>/month</span>
            </div>
            <div style={{textAlign:"left",background:"rgba(255,255,255,0.05)",borderRadius:16,padding:16,marginBottom:24,border:"1px solid rgba(255,255,255,0.08)"}}>
              {["♾️ Unlimited habits","📊 Full analytics & XP","🤖 AI Coach unlimited","🏆 Leaderboard access","☁️ Priority cloud sync"].map(f=>(
                <div key={f} style={{display:"flex",gap:10,marginBottom:10,fontSize:14}}>
                  <span style={{color:"#6BCB77"}}>✓</span>{f}
                </div>
              ))}
            </div>
            <button onClick={async()=>{ if(user){ await supabase.from("profiles").upsert({id:user.id,is_pro:true}); setIsPro(true); setShowPaywall(false); triggerParticles() }}}
              className="color-btn" style={{width:"100%",padding:16,fontSize:16,background:"linear-gradient(135deg,#FFD93D,#FF8E53)",marginBottom:10}}>
              Start Pro Now 🚀
            </button>
            <button onClick={()=>setShowPaywall(false)} className="glass-btn" style={{width:"100%",padding:12,fontSize:13}}>Maybe later</button>
          </div>
        </div>
      )}
    </div>
  )
}

