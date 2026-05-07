import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "https://ykmftbsglhoxoopzwbwd.supabase.co",
  import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbWZ0YnNnbGhveG9vcHp3YndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjI3MTAsImV4cCI6MjA5MzEzODcxMH0.L3VZxCH7ObRGkhLOuCvqxMoluEFKiKuYQo1Wnq5AR0U"
)

const THEMES = {
  dark:   { name:"Dark",         emoji:"🌑", bg:"#08080D", bg2:"#0F0F16", bg3:"#15151F", border:"#1E1E2A", text:"#F0EDE8", muted:"#666", gold:"#C9A84C", gold2:"#E8C96A", dark:true },
  light:  { name:"Light",        emoji:"☀️",  bg:"#F8F6F1", bg2:"#FFFFFF", bg3:"#F0EDE5", border:"#E0DDD6", text:"#1A1814", muted:"#999", gold:"#B8922A", gold2:"#C9A84C", dark:false },
  mint:   { name:"Fresh Mint",   emoji:"🌿", bg:"#f0fdf6", bg2:"#ffffff", bg3:"#ecfdf5", border:"rgba(16,185,129,0.2)", text:"#111827", muted:"#9ca3af", gold:"#10b981", gold2:"#34d399", dark:false },
  aurora: { name:"Dark Aurora",  emoji:"🌌", bg:"#0f0e1a", bg2:"#1e1c35", bg3:"#252340", border:"rgba(124,106,247,0.2)", text:"#ffffff", muted:"#6b6b8a", gold:"#7c6af7", gold2:"#a78bfa", dark:true },
  ocean:  { name:"Ocean Deep",   emoji:"🌊", bg:"#0c1929", bg2:"#132740", bg3:"#163049", border:"rgba(14,165,233,0.2)", text:"#f0f9ff", muted:"#5b8fa8", gold:"#0ea5e9", gold2:"#38bdf8", dark:true },
  coral:  { name:"Sunset Coral", emoji:"🌅", bg:"#fff8f5", bg2:"#ffffff", bg3:"#fff0ea", border:"rgba(249,115,22,0.2)", text:"#1c0a00", muted:"#9a6b50", gold:"#f97316", gold2:"#fb923c", dark:false },
  rose:   { name:"Rose Gold",    emoji:"🌸", bg:"#fff5f7", bg2:"#ffffff", bg3:"#ffeef2", border:"rgba(225,29,72,0.18)", text:"#1a0010", muted:"#9f6070", gold:"#e11d48", gold2:"#fb7185", dark:false },
  slate:  { name:"Midnight",     emoji:"🌙", bg:"#0f172a", bg2:"#1e293b", bg3:"#263245", border:"rgba(99,102,241,0.2)", text:"#f1f5f9", muted:"#64748b", gold:"#6366f1", gold2:"#818cf8", dark:true },
}

const HABIT_TEMPLATES = [
  { name:"Morning Run",    emoji:"🏃", color:"#FF6B6B", category:"health", time:"06:00" },
  { name:"Gym Workout",    emoji:"🏋️", color:"#FF6B6B", category:"health", time:"07:00" },
  { name:"Drink Water",    emoji:"💧", color:"#4ECDC4", category:"health", time:"08:00" },
  { name:"Healthy Eating", emoji:"🥗", color:"#6BCB77", category:"health", time:"12:00" },
  { name:"Sleep 8 Hours",  emoji:"💤", color:"#A78BFA", category:"health", time:"22:00" },
  { name:"Read 20 Mins",   emoji:"📚", color:"#FFD93D", category:"mind",   time:"20:00" },
  { name:"Meditate",       emoji:"🧘", color:"#A78BFA", category:"mind",   time:"07:00" },
  { name:"Journal",        emoji:"✍️", color:"#FFD93D", category:"mind",   time:"21:00" },
  { name:"Morning Planning",emoji:"📋",color:"#4ECDC4", category:"work",   time:"08:00" },
  { name:"Deep Work",      emoji:"🎯", color:"#F97316", category:"work",   time:"09:00" },
  { name:"Cold Shower",    emoji:"🚿", color:"#06B6D4", category:"personal",time:"07:00" },
  { name:"Gratitude",      emoji:"🙏", color:"#FFD93D", category:"personal",time:"21:00" },
]

const CATEGORIES = [
  { id:"health",   label:"Health",   icon:"♥",  color:"#FF6B6B" },
  { id:"mind",     label:"Mind",     icon:"✦",  color:"#A78BFA" },
  { id:"work",     label:"Work",     icon:"◈",  color:"#4ECDC4" },
  { id:"personal", label:"Personal", icon:"◉",  color:"#FFD93D" },
]

const EMOJIS = ["🏃","💧","📚","🧘","🥗","💤","✍️","🎯","🎸","🌿","🧠","🏋️","🚴","🥤","🎨","💊","🌅","🛁"]
const COLORS = ["#FF6B6B","#4ECDC4","#FFD93D","#A78BFA","#6BCB77","#F97316","#EC4899","#06B6D4"]

const BADGE_LIST = [
  { id:"first",   icon:"⭐", label:"First Step",    desc:"Complete your first habit",   check:(h,d)=>h.some(x=>Object.keys(x.completions||{}).length>0) },
  { id:"week",    icon:"🔥", label:"Week Warrior",  desc:"7-day streak on any habit",   check:(h,d)=>h.some(x=>d.every(dd=>x.completions&&x.completions[dd])) },
  { id:"five",    icon:"💎", label:"Habit Collector",desc:"Track 5 or more habits",     check:(h)=>h.length>=5 },
  { id:"perfect", icon:"👑", label:"Perfect Day",   desc:"Complete all habits today",   check:(h,d)=>{const t=d[6];return h.length>0&&h.every(x=>x.completions&&x.completions[t])} },
  { id:"hundred", icon:"💯", label:"Century Club",  desc:"100 total completions",       check:(h)=>h.reduce((s,x)=>s+Object.keys(x.completions||{}).length,0)>=100 },
]

const LEVELS = [
  { level:1, title:"Beginner",  icon:"🌱", minXP:0,    maxXP:100  },
  { level:2, title:"Explorer",  icon:"🚀", minXP:100,  maxXP:250  },
  { level:3, title:"Achiever",  icon:"⚡", minXP:250,  maxXP:500  },
  { level:4, title:"Champion",  icon:"🔥", minXP:500,  maxXP:1000 },
  { level:5, title:"Master",    icon:"💎", minXP:1000, maxXP:2000 },
  { level:6, title:"Legend",    icon:"👑", minXP:2000, maxXP:99999 },
]

const DAYS_OF_WEEK = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
const getLast7 = () => Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(6-i)); return d.toISOString().slice(0,10) })
const getTodayKey = () => ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()]
const calcXP = (habits, days) => { let xp=0; habits.forEach(h=>{ let s=0; days.forEach(d=>{ if(h.completions&&h.completions[d]){xp+=10;s++;xp+=5*s}else{s=0} }) }); return xp }
const getLevel = (xp) => LEVELS.slice().reverse().find(l=>xp>=l.minXP)||LEVELS[0]

export default function App() {
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem("hf_themekey")||"dark")
  const [page, setPage] = useState("landing")
  const [user, setUser] = useState(null)
  const [isPro, setIsPro] = useState(false)
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(false)
  const [appLoading, setAppLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("tracker")
  const [activeCategory, setActiveCategory] = useState("all")
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState("")
  const [newEmoji, setNewEmoji] = useState("🎯")
  const [newColor, setNewColor] = useState("#A78BFA")
  const [newCategory, setNewCategory] = useState("health")
  const [newTime, setNewTime] = useState("08:00")
  const [showTemplates, setShowTemplates] = useState(false)
  const [showThemePicker, setShowThemePicker] = useState(false)
  const [showBadges, setShowBadges] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showAICoach, setShowAICoach] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [showMoodPicker, setShowMoodPicker] = useState(false)
  const [editHabit, setEditHabit] = useState(null)
  const [authMode, setAuthMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [aiMessages, setAiMessages] = useState([])
  const [aiInput, setAiInput] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [emailCapture, setEmailCapture] = useState("")
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [todaySteps, setTodaySteps] = useState(() => { try { return parseInt(localStorage.getItem("hf_steps")||"0") } catch { return 0 } })
  const [waterCups, setWaterCups] = useState(() => { try { return parseInt(localStorage.getItem("hf_water_"+new Date().toISOString().slice(0,10))||"0") } catch { return 0 } })
  const [todayMood, setTodayMood] = useState(() => { try { return localStorage.getItem("hf_mood_"+new Date().toISOString().slice(0,10))||"" } catch { return "" } })
  const [profile, setProfile] = useState(() => { try { return JSON.parse(localStorage.getItem("hf_profile")||"{}") } catch { return {} } })
  const [targets, setTargets] = useState(() => { try { return JSON.parse(localStorage.getItem("hf_targets")||'{"steps":10000,"water":8,"sleep":8}') } catch { return {steps:10000,water:8,sleep:8} } })

  const T = THEMES[themeKey] || THEMES.dark
  const days = getLast7()
  const todayStr = days[6]
  const stepGoal = targets.steps || 10000
  const waterGoal = targets.water || 8

  // ── Apply theme ──
  const applyTheme = (key) => {
    setThemeKey(key)
    localStorage.setItem("hf_themekey", key)
    setShowThemePicker(false)
  }

  // ── Water + Mood ──
  const addWater = (n) => {
    const d = new Date().toISOString().slice(0,10)
    const v = Math.max(0, waterCups + n)
    setWaterCups(v)
    localStorage.setItem("hf_water_"+d, v)
  }
  const saveMood = (m) => {
    const d = new Date().toISOString().slice(0,10)
    setTodayMood(m)
    localStorage.setItem("hf_mood_"+d, m)
    setShowMoodPicker(false)
  }

  // ── Auth ──
  useEffect(() => {
    setTimeout(() => setAppLoading(false), 800)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); setPage("app"); loadHabits(session.user.id) }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) { setUser(session.user); setPage("app"); loadHabits(session.user.id) }
      else { setUser(null); setHabits([]); setPage("landing") }
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadHabits = async (uid) => {
    setLoading(true)
    const { data: hd } = await supabase.from("habits").select("*").eq("user_id", uid).order("created_at")
    const { data: cd } = await supabase.from("completions").select("*").eq("user_id", uid)
    if (hd) {
      setHabits(hd.map(h => ({ ...h, completions: Object.fromEntries((cd||[]).filter(c=>c.habit_id===h.id).map(c=>[c.date,true])) })))
    }
    const { data: p } = await supabase.from("profiles").select("is_pro").eq("id", uid).single()
    if (p) setIsPro(p.is_pro)
    setLoading(false)
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider:"google", options:{ redirectTo: window.location.origin } })
  }

  const signInWithEmail = async () => {
    setAuthLoading(true); setAuthError("")
    const fn = authMode==="login" ? supabase.auth.signInWithPassword : supabase.auth.signUp
    const { error } = await fn.call(supabase.auth, { email, password })
    if (error) setAuthError(error.message)
    else if (authMode==="signup") setAuthError("✅ Check your email to confirm!")
    setAuthLoading(false)
  }

  const signOut = async () => { await supabase.auth.signOut() }

  // ── Habits ──
  const toggle = async (habitId, date) => {
    const habit = habits.find(h => h.id===habitId)
    const done = habit.completions && habit.completions[date]
    if (done) {
      await supabase.from("completions").delete().eq("habit_id", habitId).eq("date", date)
    } else {
      await supabase.from("completions").insert({ habit_id:habitId, user_id:user.id, date })
      setShowConfetti(true); setTimeout(()=>setShowConfetti(false), 2500)
    }
    setHabits(h => h.map(x => x.id===habitId ? {...x, completions:{...x.completions,[date]:!done}} : x))
  }

  const addHabit = async () => {
    if (!newName.trim()) return
    if (!isPro && habits.length >= 3) { setShowPaywall(true); return }
    const { data } = await supabase.from("habits").insert({
      user_id:user.id, name:newName.trim(), emoji:newEmoji, color:newColor,
      category:newCategory, reminder_time:newTime
    }).select().single()
    if (data) setHabits(h => [...h, {...data, completions:{}}])
    setNewName(""); setShowAdd(false)
  }

  const addFromTemplate = async (t) => {
    if (!isPro && habits.length >= 3) { setShowPaywall(true); return }
    const { data } = await supabase.from("habits").insert({
      user_id:user.id, name:t.name, emoji:t.emoji, color:t.color,
      category:t.category, reminder_time:t.time
    }).select().single()
    if (data) setHabits(h => [...h, {...data, completions:{}}])
    setShowTemplates(false)
  }

  const deleteHabit = async (id) => {
    await supabase.from("habits").delete().eq("id", id)
    setHabits(h => h.filter(x => x.id!==id))
  }

  const updateHabit = async (id, updates) => {
    await supabase.from("habits").update(updates).eq("id", id)
    setHabits(h => h.map(x => x.id===id ? {...x,...updates} : x))
    setEditHabit(null)
  }

  const upgradeToPro = async () => {
    if (!user) return
    await supabase.from("profiles").upsert({ id:user.id, is_pro:true })
    setIsPro(true); setShowPaywall(false)
  }

  // ── AI Coach ──
  const sendAI = async () => {
    if (!aiInput.trim()) return
    const msg = { role:"user", content:aiInput }
    const msgs = [...aiMessages, msg]
    setAiMessages(msgs); setAiInput(""); setAiLoading(true)
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:300,
          system:`You are a friendly habit coach. User has ${habits.length} habits tracked. Best streak: ${getStreak()} days. Be encouraging and concise (under 120 words).`,
          messages: msgs.map(m=>({role:m.role, content:m.content}))
        })
      })
      const d = await res.json()
      setAiMessages([...msgs, { role:"assistant", content:d.content?.[0]?.text||"Keep going! 🔥" }])
    } catch {
      setAiMessages([...msgs, { role:"assistant", content:"Consistency beats perfection every time! 💪" }])
    }
    setAiLoading(false)
  }

  // ── Stats ──
  const getStreak = () => {
    if (!habits.length) return 0
    return Math.max(0, ...habits.map(h => {
      let s=0; const rev=[...days].reverse()
      for (let d of rev) { if(h.completions&&h.completions[d]) s++; else break }
      return s
    }))
  }

  const filteredHabits = activeCategory==="all" ? habits : habits.filter(h=>h.category===activeCategory)
  const todayDone = habits.filter(h=>h.completions&&h.completions[todayStr]).length
  const pct = habits.length ? Math.round((todayDone/habits.length)*100) : 0
  const totalXP = calcXP(habits, days)
  const currentLevel = getLevel(totalXP)
  const nextLevel = LEVELS.find(l=>l.level===currentLevel.level+1)
  const xpProgress = nextLevel ? Math.round(((totalXP-currentLevel.minXP)/(nextLevel.minXP-currentLevel.minXP))*100) : 100
  const earnedBadges = BADGE_LIST.filter(b=>b.check(habits,days))

  // ── Styles ──
  const S = {
    wrap: { minHeight:"100vh", background:T.bg, color:T.text, fontFamily:"'Outfit',sans-serif", transition:"background .3s,color .3s" },
    nav:  { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 24px", borderBottom:`1px solid ${T.border}`, position:"sticky", top:0, background:T.bg, zIndex:50, backdropFilter:"blur(10px)" },
    card: { background:T.bg2, border:`1px solid ${T.border}`, borderRadius:20, padding:20 },
    btn:  { padding:"10px 20px", borderRadius:10, border:"none", cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, transition:"all .2s" },
    gold: { color:T.gold },
    goldBtn: { background:T.gold, color:T.dark?"#fff":"#fff" },
    ghostBtn: { background:"transparent", border:`1px solid ${T.border}`, color:T.muted },
    inp:  { width:"100%", padding:"12px 14px", background:T.bg3, border:`1px solid ${T.border}`, borderRadius:10, color:T.text, fontSize:14, outline:"none", fontFamily:"'Outfit',sans-serif", marginBottom:10, boxSizing:"border-box" },
    overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 },
    sheet: { background:T.bg2, borderRadius:"24px 24px 0 0", padding:"24px 18px 36px", width:"100%", border:`1px solid ${T.border}` },
  }

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Outfit:wght@300;400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Outfit',sans-serif}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes fall{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
    .fade{animation:fadeIn .4s ease forwards}
    button:hover{opacity:.88}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-thumb{background:${T.border};border-radius:10px}
  `

  // ── Loading ──
  if (appLoading) return (
    <div style={{minHeight:"100vh",background:"#08080D",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{css}</style>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:"#C9A84C",letterSpacing:1}}>Habit<span style={{color:"#F0EDE8"}}>Flow</span></div>
      <div style={{fontSize:24,animation:"spin 1s linear infinite"}}>⚡</div>
    </div>
  )

  // ── Privacy ──
  if (showPrivacy) return (
    <div style={{...S.wrap,padding:"40px 28px",maxWidth:800,margin:"0 auto"}}>
      <style>{css}</style>
      <button onClick={()=>setShowPrivacy(false)} style={{...S.btn,...S.ghostBtn,marginBottom:24}}>← Back</button>
      <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,marginBottom:8}}>Privacy Policy</h1>
      <p style={{color:T.muted,marginBottom:32,fontSize:13}}>Last updated: May 1, 2026</p>
      {[
        {t:"Information We Collect",d:"We collect your email address and name when you create an account, along with habit data you enter."},
        {t:"How We Use It",d:"To provide HabitFlow services, sync your data across devices, and send important account notifications."},
        {t:"Data Storage",d:"Your data is stored securely using Supabase. All data is encrypted in transit and at rest."},
        {t:"Contact Us",d:"For privacy questions: privacy@thehabitflow.app"},
      ].map(s=>(
        <div key={s.t} style={{marginBottom:24}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:T.gold,marginBottom:8}}>{s.t}</h2>
          <p style={{color:T.muted,lineHeight:1.8,fontSize:14}}>{s.d}</p>
        </div>
      ))}
    </div>
  )

  // ── Landing ──
  if (page==="landing") return (
    <div style={S.wrap}>
      <style>{css}</style>
      <nav style={S.nav}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,cursor:"pointer",color:T.gold}}>⚡ Habit<span style={{color:T.text}}>Flow</span></div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setShowThemePicker(true)} style={{...S.btn,...S.ghostBtn,padding:"8px 12px"}}>🎨</button>
          <button onClick={()=>setPage("auth")} style={{...S.btn,...S.goldBtn}}>Get Started</button>
        </div>
      </nav>

      <div style={{maxWidth:800,margin:"0 auto",padding:"70px 24px 50px",textAlign:"center"}} className="fade">
        <div style={{display:"inline-block",background:T.gold+"22",border:`1px solid ${T.gold}44`,borderRadius:100,padding:"6px 18px",fontSize:11,color:T.gold,letterSpacing:3,textTransform:"uppercase",marginBottom:28}}>Build habits that last</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(38px,8vw,72px)",fontWeight:700,lineHeight:1.05,marginBottom:22}}>
          Your habits.<br/><span style={{color:T.gold}}>Your streaks.</span><br/>Your life.
        </h1>
        <p style={{fontSize:17,color:T.muted,lineHeight:1.8,maxWidth:480,margin:"0 auto 36px"}}>
          HabitFlow combines beautiful design, cloud sync, and AI coaching to help you become your best self.
        </p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:12}}>
          <button onClick={()=>setPage("auth")} style={{...S.btn,...S.goldBtn,padding:"15px 36px",fontSize:15}}>Start Free Today →</button>
          <button onClick={signInWithGoogle} style={{...S.btn,...S.ghostBtn,padding:"15px 24px",fontSize:14}}>G  Continue with Google</button>
        </div>
        <div style={{fontSize:12,color:T.muted}}>Free forever · Sync across all devices</div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto 60px",padding:"0 24px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
        {[
          {icon:"🔥",t:"Streaks & XP",d:"Level up with every habit"},
          {icon:"🤖",t:"AI Coach",d:"Personalized advice 24/7"},
          {icon:"📊",t:"Analytics",d:"Beautiful progress insights"},
          {icon:"🏆",t:"Achievements",d:"Earn badges as you grow"},
        ].map(f=>(
          <div key={f.t} style={{...S.card,textAlign:"center",padding:24}}>
            <div style={{fontSize:28,marginBottom:10}}>{f.icon}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,marginBottom:6}}>{f.t}</div>
            <div style={{fontSize:13,color:T.muted}}>{f.d}</div>
          </div>
        ))}
      </div>

      {/* Email capture */}
      <div style={{maxWidth:560,margin:"0 auto",padding:"50px 24px",textAlign:"center",borderTop:`1px solid ${T.border}`}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,marginBottom:8}}>Get early access updates</div>
        <div style={{color:T.muted,fontSize:14,marginBottom:22}}>Join our newsletter for tips and exclusive offers</div>
        {!emailSubmitted ? (
          <div style={{display:"flex",gap:10,maxWidth:380,margin:"0 auto"}}>
            <input value={emailCapture} onChange={e=>setEmailCapture(e.target.value)} placeholder="your@email.com" type="email" style={{...S.inp,marginBottom:0,flex:1}}/>
            <button onClick={()=>{if(emailCapture.includes("@"))setEmailSubmitted(true)}} style={{...S.btn,...S.goldBtn,padding:"12px 18px",flexShrink:0}}>Join</button>
          </div>
        ) : (
          <div style={{color:"#6BCB77",fontSize:15}}>🎉 Thanks! We'll be in touch soon!</div>
        )}
      </div>

      <div style={{textAlign:"center",padding:"40px 24px",borderTop:`1px solid ${T.border}`}}>
        <button onClick={()=>setPage("auth")} style={{...S.btn,...S.goldBtn,padding:"14px 36px",fontSize:15,marginBottom:24}}>Start Free — No Card Required</button>
        <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap"}}>
          <span onClick={()=>setShowPrivacy(true)} style={{fontSize:12,color:T.muted,cursor:"pointer"}}>Privacy Policy</span>
          <span style={{fontSize:12,color:T.muted}}>contact@thehabitflow.app</span>
          <span style={{fontSize:12,color:T.muted}}>© 2026 HabitFlow</span>
        </div>
      </div>

      {/* Theme Picker on Landing */}
      {showThemePicker && (
        <div onClick={()=>setShowThemePicker(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:2000,display:"flex",alignItems:"flex-end"}}>
          <div onClick={e=>e.stopPropagation()} style={S.sheet}>
            <div style={{fontSize:18,fontWeight:800,marginBottom:4,color:T.text}}>🎨 Choose Theme</div>
            <div style={{fontSize:12,color:T.muted,marginBottom:18}}>8 themes to match your vibe</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
              {Object.entries(THEMES).map(([key,th])=>(
                <button key={key} onClick={()=>applyTheme(key)} style={{padding:0,background:"transparent",border:`2.5px solid ${themeKey===key?T.gold:"transparent"}`,borderRadius:14,overflow:"hidden",cursor:"pointer"}}>
                  <div style={{background:th.bg,padding:10,height:52,display:"flex",flexDirection:"column",gap:4}}>
                    <div style={{display:"flex",gap:3}}><div style={{width:8,height:8,borderRadius:"50%",background:th.gold}}/><div style={{width:8,height:8,borderRadius:"50%",background:th.gold2}}/></div>
                    <div style={{height:5,borderRadius:999,background:`linear-gradient(90deg,${th.gold},${th.gold2})`}}/>
                    <div style={{height:4,borderRadius:999,background:th.gold+"44",width:"70%"}}/>
                  </div>
                  <div style={{background:th.bg2,padding:"5px 4px",textAlign:"center",fontSize:10,fontWeight:800,color:th.text}}>{th.emoji} {th.name}</div>
                </button>
              ))}
            </div>
            <button onClick={()=>setShowThemePicker(false)} style={{...S.btn,...S.goldBtn,width:"100%",padding:13,marginTop:16}}>Done ✓</button>
          </div>
        </div>
      )}
    </div>
  )

  // ── Auth ──
  if (page==="auth") return (
    <div style={{...S.wrap,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{css}</style>
      <div style={{...S.card,maxWidth:400,width:"100%",margin:20}} className="fade">
        <div style={{textAlign:"center",marginBottom:26}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,marginBottom:6,color:T.gold}}>⚡ HabitFlow</div>
          <div style={{fontSize:13,color:T.muted}}>{authMode==="login"?"Welcome back!":"Create your account"}</div>
        </div>
        <button onClick={signInWithGoogle} style={{...S.btn,width:"100%",padding:13,background:T.bg3,border:`1px solid ${T.border}`,color:T.text,fontSize:14,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <span style={{fontWeight:700,color:"#4285F4"}}>G</span> Continue with Google
        </button>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{flex:1,height:1,background:T.border}}/><span style={{fontSize:12,color:T.muted}}>or</span><div style={{flex:1,height:1,background:T.border}}/>
        </div>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email" style={S.inp}/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" style={S.inp} onKeyDown={e=>e.key==="Enter"&&signInWithEmail()}/>
        {authError && <div style={{fontSize:12,color:authError.includes("✅")?"#6BCB77":"#FF6B6B",marginBottom:10,textAlign:"center"}}>{authError}</div>}
        <button onClick={signInWithEmail} disabled={authLoading} style={{...S.btn,...S.goldBtn,width:"100%",padding:13,fontSize:14,opacity:authLoading?0.6:1}}>
          {authLoading?"Loading...":(authMode==="login"?"Sign In":"Create Account")}
        </button>
        <div style={{textAlign:"center",marginTop:14,fontSize:13,color:T.muted}}>
          {authMode==="login"?"Don't have an account? ":"Already have an account? "}
          <span onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthError("")}} style={{color:T.gold,cursor:"pointer",fontWeight:600}}>
            {authMode==="login"?"Sign Up":"Sign In"}
          </span>
        </div>
        <div style={{textAlign:"center",marginTop:10}}>
          <span onClick={()=>setPage("landing")} style={{fontSize:12,color:T.muted,cursor:"pointer"}}>← Back to home</span>
        </div>
      </div>
    </div>
  )

  // ── Main App ──
  return (
    <div style={S.wrap}>
      <style>{css}</style>

      {/* Confetti */}
      {showConfetti && (
        <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:999}}>
          {Array.from({length:30},(_,i)=>(
            <div key={i} style={{position:"absolute",left:Math.random()*100+"%",top:"-10px",width:9,height:9,
              background:["#C9A84C","#4ECDC4","#FF6B6B","#A78BFA","#6BCB77","#FFD93D"][i%6],
              borderRadius:Math.random()>.5?"50%":"2px",
              animation:`fall ${1+Math.random()*2}s ease ${Math.random()*.5}s forwards`}}/>
          ))}
        </div>
      )}

      {/* Top Nav */}
      <nav style={S.nav}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:T.gold}}>⚡ HabitFlow</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setShowThemePicker(true)} style={{...S.btn,...S.ghostBtn,padding:"6px 11px",fontSize:13}}>🎨 {T.emoji}</button>
          <button onClick={()=>setShowBadges(true)} style={{...S.btn,...S.ghostBtn,padding:"6px 11px",fontSize:13}}>🏆 {earnedBadges.length}</button>
          <button onClick={()=>setShowAICoach(true)} style={{...S.btn,...S.ghostBtn,padding:"6px 11px",fontSize:13}}>🤖</button>
          <button onClick={signOut} style={{...S.btn,...S.ghostBtn,padding:"6px 11px",fontSize:12}}>Out</button>
        </div>
      </nav>

      <div style={{maxWidth:700,margin:"0 auto",padding:"20px 20px 80px"}}>

        {/* XP Level Bar */}
        <div style={{...S.card,marginBottom:16,padding:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:28}}>{currentLevel.icon}</span>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:T.gold}}>{currentLevel.title}</div>
                <div style={{fontSize:12,color:T.muted}}>⚡ {totalXP} XP</div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:13,color:T.gold,fontWeight:700}}>🔥 {getStreak()} day streak</div>
              {nextLevel && <div style={{fontSize:11,color:T.muted}}>{nextLevel.minXP-totalXP} XP to {nextLevel.title}</div>}
            </div>
          </div>
          <div style={{height:6,borderRadius:999,background:T.bg3,overflow:"hidden"}}>
            <div style={{height:"100%",width:xpProgress+"%",background:`linear-gradient(90deg,${T.gold},${T.gold2})`,borderRadius:999,transition:"width .6s"}}/>
          </div>
        </div>

        {/* Progress Ring + Stats */}
        <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:14,marginBottom:16}}>
          <div style={{...S.card,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:18,minWidth:120}}>
            <svg width="100" height="100" viewBox="0 0 100 100" style={{transform:"rotate(-90deg)"}}>
              <circle cx="50" cy="50" r="40" fill="none" stroke={T.bg3} strokeWidth="10"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke={T.gold} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${pct*2.51} 251`} style={{transition:"stroke-dasharray .7s ease"}}/>
            </svg>
            <div style={{marginTop:-80,textAlign:"center",pointerEvents:"none"}}>
              <div style={{fontSize:20,fontWeight:900,color:T.text}}>{pct}%</div>
              <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:.5}}>done</div>
            </div>
            <div style={{marginTop:8,fontSize:11,color:T.muted}}>{todayDone}/{habits.length} today</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              {icon:"🦶",val:todaySteps.toLocaleString(),lbl:"Steps",pct:Math.min((todaySteps/stepGoal)*100,100),color:T.gold},
              {icon:"💧",val:waterCups+"/"+waterGoal,lbl:"Water",pct:Math.min((waterCups/waterGoal)*100,100),color:"#06b6d4"},
              {icon:"😊",val:todayMood||"—",lbl:"Mood",pct:null,color:T.gold2,fn:()=>setShowMoodPicker(true)},
              {icon:"😴",val:"7.5h",lbl:"Sleep",pct:null,color:T.muted},
            ].map((s,i)=>(
              <div key={i} onClick={s.fn} style={{...S.card,padding:12,cursor:s.fn?"pointer":"default"}}>
                <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
                <div style={{fontSize:16,fontWeight:800,color:T.text}}>{s.val}</div>
                <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:.3,marginBottom:s.pct!=null?6:0}}>{s.lbl}</div>
                {s.pct!=null && <div style={{height:4,borderRadius:999,background:T.bg3,overflow:"hidden"}}><div style={{height:"100%",width:s.pct+"%",background:s.color}}/></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Steps Card */}
        <div style={{...S.card,marginBottom:16,padding:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div>
              <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>STEPS TODAY</div>
              <div style={{fontSize:26,fontWeight:900,color:T.text}}>{todaySteps.toLocaleString()} <span style={{fontSize:13,color:T.muted}}>/ {stepGoal.toLocaleString()}</span></div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <button onClick={()=>{const s=todaySteps+500;setTodaySteps(s);localStorage.setItem("hf_steps",s)}} style={{...S.btn,...S.goldBtn,padding:"5px 12px",fontSize:12}}>+500</button>
              <button onClick={()=>{const s=todaySteps+1000;setTodaySteps(s);localStorage.setItem("hf_steps",s)}} style={{...S.btn,...S.ghostBtn,padding:"5px 12px",fontSize:12}}>+1k</button>
            </div>
          </div>
          <div style={{height:7,borderRadius:999,background:T.bg3,overflow:"hidden"}}>
            <div style={{height:"100%",width:Math.min((todaySteps/stepGoal)*100,100)+"%",background:`linear-gradient(90deg,${T.gold},${T.gold2})`,transition:"width 1s"}}/>
          </div>
        </div>

        {/* Water Card */}
        <div style={{...S.card,marginBottom:16,padding:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div>
              <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>WATER TODAY</div>
              <div style={{fontSize:22,fontWeight:900,color:T.text}}>{waterCups} <span style={{fontSize:13,color:T.muted}}>/ {waterGoal} cups</span></div>
            </div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>addWater(-1)} style={{...S.btn,...S.ghostBtn,padding:"6px 12px",fontSize:14}}>−</button>
              <button onClick={()=>addWater(1)} style={{...S.btn,...S.goldBtn,padding:"6px 12px",fontSize:14}}>+ Cup</button>
            </div>
          </div>
          <div style={{display:"flex",gap:5}}>
            {Array.from({length:waterGoal},(_,i)=>(
              <div key={i} onClick={()=>{const d=new Date().toISOString().slice(0,10);setWaterCups(i+1);localStorage.setItem("hf_water_"+d,i+1)}}
                style={{flex:1,height:22,borderRadius:6,background:i<waterCups?"#06b6d4":T.bg3,border:`1px solid ${T.border}`,cursor:"pointer",transition:"background .2s"}}/>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:6,marginBottom:16,background:T.bg2,padding:4,borderRadius:14,border:`1px solid ${T.border}`}}>
          {["tracker","analytics"].map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{...S.btn,flex:1,padding:10,background:activeTab===tab?T.bg3:"transparent",color:activeTab===tab?T.text:T.muted,textTransform:"capitalize",fontSize:13}}>
              {tab==="tracker"?"📋 Habits":"📊 Analytics"}
            </button>
          ))}
        </div>

        {/* TRACKER TAB */}
        {activeTab==="tracker" && (
          <div className="fade">
            {/* Category filter */}
            <div style={{display:"flex",gap:8,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
              <button onClick={()=>setActiveCategory("all")} style={{...S.btn,padding:"7px 16px",fontSize:12,flexShrink:0,background:activeCategory==="all"?T.gold:"transparent",color:activeCategory==="all"?"#fff":T.muted,border:`1px solid ${T.border}`}}>All</button>
              {CATEGORIES.map(c=>(
                <button key={c.id} onClick={()=>setActiveCategory(c.id)} style={{...S.btn,padding:"7px 14px",fontSize:12,flexShrink:0,background:activeCategory===c.id?c.color:"transparent",color:activeCategory===c.id?"#fff":T.muted,border:`1px solid ${T.border}`}}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>

            {/* Add + Templates row */}
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              <button onClick={()=>setShowTemplates(true)} style={{...S.btn,...S.ghostBtn,flex:1,padding:12}}>📋 Templates</button>
              <button onClick={()=>setShowAdd(true)} style={{...S.btn,...S.goldBtn,flex:1,padding:12}}>+ Add Habit</button>
            </div>

            {/* Habits list */}
            {loading ? (
              <div style={{textAlign:"center",padding:40,color:T.muted}}>Loading... ⚡</div>
            ) : filteredHabits.length===0 ? (
              <div style={{...S.card,textAlign:"center",padding:40}}>
                <div style={{fontSize:48,marginBottom:14}}>🌱</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:8}}>No habits yet</div>
                <div style={{color:T.muted,fontSize:14,marginBottom:20}}>Add your first habit or pick a template</div>
                <button onClick={()=>setShowTemplates(true)} style={{...S.btn,...S.goldBtn,padding:"12px 28px"}}>Browse Templates →</button>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {filteredHabits.map(h => {
                  const done = h.completions&&h.completions[todayStr]
                  const streak = (() => { let s=0; const rev=[...days].reverse(); for(let d of rev){if(h.completions&&h.completions[d])s++;else break}; return s })()
                  const weekPct = days.filter(d=>h.completions&&h.completions[d]).length / 7 * 100
                  return (
                    <div key={h.id} style={{...S.card,padding:16,border:`1px solid ${done?T.gold:T.border}`,transition:"all .2s"}}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:46,height:46,borderRadius:14,background:h.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{h.emoji}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:15,fontWeight:600,marginBottom:3}}>{h.name}</div>
                          <div style={{display:"flex",gap:10,fontSize:12,color:T.muted,flexWrap:"wrap"}}>
                            <span>🔥 {streak} streak</span>
                            <span style={{color:CATEGORIES.find(c=>c.id===h.category)?.color||T.muted}}>{CATEGORIES.find(c=>c.id===h.category)?.label||h.category}</span>
                            {h.reminder_time && <span>⏰ {h.reminder_time}</span>}
                          </div>
                          <div style={{height:4,borderRadius:999,background:T.bg3,overflow:"hidden",marginTop:8}}>
                            <div style={{height:"100%",width:weekPct+"%",background:h.color,transition:"width .5s"}}/>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:6,flexShrink:0}}>
                          <button onClick={()=>setEditHabit(h)} style={{...S.btn,...S.ghostBtn,padding:"6px 10px",fontSize:13}}>✏️</button>
                          <button onClick={()=>toggle(h.id, todayStr)} style={{...S.btn,padding:"8px 14px",fontSize:13,fontWeight:700,background:done?T.gold:h.color,color:"#fff",border:"none"}}>
                            {done?"✓":"Log"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Weekly chart */}
            {habits.length>0 && (
              <div style={{...S.card,marginTop:20,padding:18}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,marginBottom:16}}>This Week</div>
                <div style={{display:"flex",gap:8,alignItems:"flex-end",height:80}}>
                  {days.map((d,i)=>{
                    const cnt=habits.filter(h=>h.completions&&h.completions[d]).length
                    const h=habits.length?Math.max((cnt/habits.length)*100,4):4
                    const isT=d===todayStr
                    return (
                      <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,height:"100%",justifyContent:"flex-end"}}>
                        <div style={{width:"100%",borderRadius:"5px 5px 0 0",background:isT?T.gold:T.gold+"55",height:h+"%",minHeight:4,transition:"height 1s"}}/>
                        <div style={{fontSize:9,fontWeight:700,color:isT?T.gold:T.muted,textTransform:"uppercase"}}>{"MTWTFSS"[i]}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab==="analytics" && (
          <div className="fade">
            {!isPro ? (
              <div style={{...S.card,textAlign:"center",padding:48}}>
                <div style={{fontSize:48,marginBottom:14}}>🔒</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,marginBottom:8}}>Pro Feature</div>
                <div style={{color:T.muted,marginBottom:22,fontSize:14}}>Unlock detailed analytics, AI coaching, and more</div>
                <button onClick={()=>setShowPaywall(true)} style={{...S.btn,...S.goldBtn,padding:"13px 32px",fontSize:15}}>Upgrade to Pro — $1.99/mo</button>
              </div>
            ) : (
              <>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                  <div style={{...S.card,padding:20}}>
                    <div style={{fontSize:12,color:T.muted,marginBottom:4}}>Total Completions</div>
                    <div style={{fontSize:38,fontWeight:900,color:T.gold}}>{habits.reduce((s,h)=>s+Object.keys(h.completions||{}).length,0)}</div>
                  </div>
                  <div style={{...S.card,padding:20}}>
                    <div style={{fontSize:12,color:T.muted,marginBottom:4}}>Best Streak</div>
                    <div style={{fontSize:38,fontWeight:900,color:T.gold}}>{getStreak()}🔥</div>
                  </div>
                </div>
                <div style={{...S.card,padding:20,marginBottom:14}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,marginBottom:14}}>Completion Rate This Week</div>
                  {habits.map(h=>{
                    const cnt=days.filter(d=>h.completions&&h.completions[d]).length
                    return (
                      <div key={h.id} style={{marginBottom:12}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:13}}>
                          <span>{h.emoji} {h.name}</span>
                          <span style={{color:T.gold,fontWeight:700}}>{cnt}/7</span>
                        </div>
                        <div style={{height:8,borderRadius:999,background:T.bg3,overflow:"hidden"}}>
                          <div style={{height:"100%",width:(cnt/7*100)+"%",background:h.color,borderRadius:999}}/>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* THEME PICKER */}
      {showThemePicker && (
        <div onClick={()=>setShowThemePicker(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:2000,display:"flex",alignItems:"flex-end"}}>
          <div onClick={e=>e.stopPropagation()} style={S.sheet}>
            <div style={{fontSize:18,fontWeight:800,marginBottom:4,color:T.text}}>🎨 Choose Theme</div>
            <div style={{fontSize:12,color:T.muted,marginBottom:18}}>8 beautiful themes</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
              {Object.entries(THEMES).map(([key,th])=>(
                <button key={key} onClick={()=>applyTheme(key)} style={{padding:0,background:"transparent",border:`2.5px solid ${themeKey===key?T.gold:"transparent"}`,borderRadius:14,overflow:"hidden",cursor:"pointer"}}>
                  <div style={{background:th.bg,padding:10,height:52,display:"flex",flexDirection:"column",gap:4}}>
                    <div style={{display:"flex",gap:3}}><div style={{width:8,height:8,borderRadius:"50%",background:th.gold}}/><div style={{width:8,height:8,borderRadius:"50%",background:th.gold2}}/></div>
                    <div style={{height:5,borderRadius:999,background:`linear-gradient(90deg,${th.gold},${th.gold2})`}}/>
                    <div style={{height:4,borderRadius:999,background:th.gold+"44",width:"70%"}}/>
                  </div>
                  <div style={{background:th.bg2,padding:"5px 4px",textAlign:"center",fontSize:10,fontWeight:800,color:th.text}}>{th.emoji} {th.name}</div>
                </button>
              ))}
            </div>
            <button onClick={()=>setShowThemePicker(false)} style={{...S.btn,...S.goldBtn,width:"100%",padding:13,marginTop:16}}>Done ✓</button>
          </div>
        </div>
      )}

      {/* MOOD PICKER */}
      {showMoodPicker && (
        <div onClick={()=>setShowMoodPicker(false)} style={S.overlay}>
          <div onClick={e=>e.stopPropagation()} style={{...S.card,maxWidth:340,width:"100%",padding:24}} className="fade">
            <div style={{fontSize:18,fontWeight:800,marginBottom:6}}>😊 How are you feeling?</div>
            <div style={{fontSize:12,color:T.muted,marginBottom:18}}>Log today's mood</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:10}}>
              {["😴","😐","🙂","😊","🔥"].map(m=>(
                <button key={m} onClick={()=>saveMood(m)} style={{padding:14,borderRadius:12,border:`2px solid ${todayMood===m?T.gold:T.border}`,background:todayMood===m?T.bg3:"transparent",fontSize:26,cursor:"pointer"}}>
                  {m}
                </button>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.muted}}>
              <span>Tired</span><span>Okay</span><span>Good</span><span>Great</span><span>🔥</span>
            </div>
          </div>
        </div>
      )}

      {/* ADD HABIT */}
      {showAdd && (
        <div onClick={()=>setShowAdd(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"flex-end"}}>
          <div onClick={e=>e.stopPropagation()} style={S.sheet} className="fade">
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22}}>New Habit</div>
              <button onClick={()=>setShowAdd(false)} style={{...S.btn,...S.ghostBtn,padding:"4px 10px"}}>✕</button>
            </div>
            <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Habit name..." style={S.inp}/>
            <div style={{fontSize:11,color:T.muted,marginBottom:8,letterSpacing:1}}>EMOJI</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
              {EMOJIS.map(e=>(
                <button key={e} onClick={()=>setNewEmoji(e)} style={{width:36,height:36,borderRadius:9,border:`2px solid ${newEmoji===e?T.gold:T.border}`,background:newEmoji===e?T.bg3:"transparent",cursor:"pointer",fontSize:17}}>{e}</button>
              ))}
            </div>
            <div style={{fontSize:11,color:T.muted,marginBottom:8,letterSpacing:1}}>COLOR</div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {COLORS.map(c=>(
                <button key={c} onClick={()=>setNewColor(c)} style={{width:26,height:26,borderRadius:"50%",background:c,border:newColor===c?"3px solid "+T.text:"2px solid transparent",cursor:"pointer"}}/>
              ))}
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
              {CATEGORIES.map(c=>(
                <button key={c.id} onClick={()=>setNewCategory(c.id)} style={{...S.btn,padding:"6px 12px",fontSize:12,background:newCategory===c.id?c.color+"22":"transparent",color:newCategory===c.id?c.color:T.muted,border:`1px solid ${newCategory===c.id?c.color:T.border}`}}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
            <div style={{fontSize:11,color:T.muted,marginBottom:6,letterSpacing:1}}>⏰ REMINDER TIME</div>
            <input type="time" value={newTime} onChange={e=>setNewTime(e.target.value)} style={{...S.inp,width:"auto",marginBottom:16}}/>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setShowAdd(false)} style={{...S.btn,...S.ghostBtn,flex:1,padding:13}}>Cancel</button>
              <button onClick={addHabit} style={{...S.btn,...S.goldBtn,flex:2,padding:13,fontSize:15}}>Add Habit ✨</button>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATES */}
      {showTemplates && (
        <div onClick={()=>setShowTemplates(false)} style={S.overlay}>
          <div onClick={e=>e.stopPropagation()} style={{...S.card,maxWidth:500,width:"100%",maxHeight:"85vh",overflowY:"auto",padding:24}} className="fade">
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18,position:"sticky",top:0,background:T.bg2,paddingBottom:10}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22}}>Habit Templates</div>
              <button onClick={()=>setShowTemplates(false)} style={{...S.btn,...S.ghostBtn,padding:"4px 10px"}}>✕</button>
            </div>
            {CATEGORIES.map(cat=>(
              <div key={cat.id} style={{marginBottom:20}}>
                <div style={{fontSize:11,color:cat.color,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>{cat.icon} {cat.label}</div>
                {HABIT_TEMPLATES.filter(t=>t.category===cat.id).map(t=>(
                  <div key={t.name} onClick={()=>addFromTemplate(t)} style={{display:"flex",alignItems:"center",gap:12,padding:12,background:T.bg3,border:`1px solid ${T.border}`,borderRadius:12,marginBottom:8,cursor:"pointer"}}>
                    <span style={{fontSize:24,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",background:t.color+"22",borderRadius:10}}>{t.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:500}}>{t.name}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:2}}>⏰ {t.time}</div>
                    </div>
                    <span style={{color:T.gold,fontSize:20}}>+</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT HABIT */}
      {editHabit && (
        <div onClick={()=>setEditHabit(null)} style={S.overlay}>
          <div onClick={e=>e.stopPropagation()} style={{...S.card,maxWidth:440,width:"100%",padding:24}} className="fade">
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22}}>Edit Habit</div>
              <button onClick={()=>setEditHabit(null)} style={{...S.btn,...S.ghostBtn,padding:"4px 10px"}}>✕</button>
            </div>
            <input defaultValue={editHabit.name} id="edit-name" style={S.inp} placeholder="Habit name"/>
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
              {EMOJIS.map(e=>(
                <button key={e} onClick={()=>setEditHabit(h=>({...h,emoji:e}))} style={{width:34,height:34,borderRadius:8,border:`2px solid ${editHabit.emoji===e?T.gold:T.border}`,background:editHabit.emoji===e?T.bg3:"transparent",cursor:"pointer",fontSize:15}}>{e}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {COLORS.map(c=>(
                <button key={c} onClick={()=>setEditHabit(h=>({...h,color:c}))} style={{width:22,height:22,borderRadius:"50%",background:c,border:editHabit.color===c?"3px solid "+T.text:"2px solid transparent",cursor:"pointer"}}/>
              ))}
            </div>
            <div style={{display:"flex",gap:10,marginBottom:10}}>
              <button onClick={()=>deleteHabit(editHabit.id)} style={{...S.btn,flex:1,padding:13,background:"#FF6B6B22",color:"#FF6B6B",border:"1px solid #FF6B6B44"}}>🗑️ Delete</button>
              <button onClick={()=>updateHabit(editHabit.id,{name:document.getElementById("edit-name").value,emoji:editHabit.emoji,color:editHabit.color})} style={{...S.btn,...S.goldBtn,flex:2,padding:13}}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* AI COACH */}
      {showAICoach && (
        <div onClick={()=>setShowAICoach(false)} style={S.overlay}>
          <div onClick={e=>e.stopPropagation()} style={{...S.card,maxWidth:480,width:"100%",maxHeight:"80vh",display:"flex",flexDirection:"column",padding:0}} className="fade">
            <div style={{padding:"18px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20}}>🤖 AI Habit Coach</div>
              <button onClick={()=>setShowAICoach(false)} style={{...S.btn,...S.ghostBtn,padding:"4px 10px"}}>✕</button>
            </div>
            <div style={{flex:1,padding:16,overflowY:"auto",minHeight:200}}>
              {aiMessages.length===0 && (
                <div style={{textAlign:"center",color:T.muted,padding:24}}>
                  <div style={{fontSize:44,marginBottom:10}}>🤖</div>
                  <div style={{fontWeight:600,color:T.text}}>Hi! I'm your habit coach.</div>
                  <div style={{fontSize:13,marginTop:6}}>Ask me anything about building better habits!</div>
                </div>
              )}
              {aiMessages.map((m,i)=>(
                <div key={i} style={{marginBottom:10,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"80%",padding:"10px 14px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.role==="user"?T.gold:T.bg3,color:m.role==="user"?"#fff":T.text,fontSize:13,lineHeight:1.5}}>
                    {m.content}
                  </div>
                </div>
              ))}
              {aiLoading && <div style={{color:T.muted,fontSize:13}}>🤖 Typing...</div>}
            </div>
            <div style={{padding:14,borderTop:`1px solid ${T.border}`,display:"flex",gap:8}}>
              <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAI()} placeholder="Ask anything..." style={{...S.inp,flex:1,marginBottom:0}}/>
              <button onClick={sendAI} disabled={aiLoading} style={{...S.btn,...S.goldBtn,padding:"10px 16px"}}>Send</button>
            </div>
          </div>
        </div>
      )}

      {/* BADGES */}
      {showBadges && (
        <div onClick={()=>setShowBadges(false)} style={S.overlay}>
          <div onClick={e=>e.stopPropagation()} style={{...S.card,maxWidth:420,width:"100%",padding:24}} className="fade">
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22}}>🏆 Achievements</div>
              <button onClick={()=>setShowBadges(false)} style={{...S.btn,...S.ghostBtn,padding:"4px 10px"}}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
              {BADGE_LIST.map(b=>{
                const got=earnedBadges.find(e=>e.id===b.id)
                return (
                  <div key={b.id} style={{...S.card,padding:16,textAlign:"center",opacity:got?1:.35,filter:got?"none":"grayscale(1)"}}>
                    <div style={{fontSize:32,marginBottom:6}}>{b.icon}</div>
                    <div style={{fontSize:12,fontWeight:700}}>{b.label}</div>
                    <div style={{fontSize:10,color:T.muted,marginTop:3}}>{b.desc}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* PRO PAYWALL */}
      {showPaywall && (
        <div onClick={()=>setShowPaywall(false)} style={S.overlay}>
          <div onClick={e=>e.stopPropagation()} style={{...S.card,maxWidth:400,width:"100%",padding:28,textAlign:"center"}} className="fade">
            <div style={{fontSize:48,marginBottom:14}}>⭐</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,marginBottom:6,color:T.gold}}>Upgrade to Pro</div>
            <div style={{fontSize:40,fontWeight:900,color:T.gold,margin:"14px 0"}}>$1.99<span style={{fontSize:14,color:T.muted,fontWeight:400}}>/month</span></div>
            <div style={{textAlign:"left",background:T.bg3,borderRadius:14,padding:16,marginBottom:20}}>
              {["♾️ Unlimited habits","📊 Advanced analytics","🤖 AI Coach","🏆 Leaderboard","☁️ Cloud sync"].map(f=>(
                <div key={f} style={{display:"flex",gap:8,marginBottom:8,fontSize:13}}><span style={{color:T.gold}}>✓</span>{f}</div>
              ))}
            </div>
            <button onClick={upgradeToPro} style={{...S.btn,...S.goldBtn,width:"100%",padding:14,fontSize:15,marginBottom:10}}>Start Pro Now 🚀</button>
            <button onClick={()=>setShowPaywall(false)} style={{...S.btn,...S.ghostBtn,width:"100%",padding:10,fontSize:13}}>Maybe later</button>
          </div>
        </div>
      )}
    </div>
  )
}
