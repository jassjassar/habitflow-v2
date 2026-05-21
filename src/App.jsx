import { useState, useEffect, useRef } from "react"
import { createClient } from "@supabase/supabase-js"
import { identifyUser, resetAnalytics, trackEvent } from "./analytics"
import LandingPage from './screens/LandingPage'
import AnalyticsScreen from './screens/AnalyticsScreen'
import SettingsScreen from './screens/SettingsScreen'
import HabitsScreen from './screens/HabitsScreen'
import HomeScreen from './screens/HomeScreen'
import HeatmapCalendar from './components/HeatmapCalendar'
import ModalOverlay from "./components/ModalOverlay"
import ThemeSwitcher from "./components/ThemeSwitcher"
import LevelUpBurst from "./components/LevelUpBurst"
import MilestoneToast from "./components/MilestoneToast"
import FreezeToast from "./components/FreezeToast"
import Particles from "./components/Particles"
import CompanionAvatar from "./components/CompanionAvatar"
import OnboardingQuiz from "./components/OnboardingQuiz"
import AddHabitSheet from "./components/modals/AddHabitSheet"
import TemplatesModal from "./components/modals/TemplatesModal"
import EditHabitModal from "./components/modals/EditHabitModal"
import AICoachModal from "./components/modals/AICoachModal"
import NotificationModal from "./components/modals/NotificationModal"
import PaywallModal from "./components/modals/PaywallModal"
import MoodPickerModal from "./components/modals/MoodPickerModal"

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
  aurora: { name:"Dark Aurora",    bg:"#0d0d1a", accent:"#A78BFA", card:"rgba(255,255,255,0.07)", text:"#ffffff", sub:"rgba(255,255,255,0.5)",  textSecondary:"rgba(255,255,255,0.72)", muted:"rgba(255,255,255,0.45)", border:"rgba(255,255,255,0.1)",  button:"rgba(255,255,255,0.08)", input:"rgba(255,255,255,0.07)" },
  mint:   { name:"Fresh Mint",     bg:"#f0fdf6", accent:"#10b981", card:"rgba(255,255,255,0.94)", text:"#111827", sub:"rgba(17,24,39,0.58)",   textSecondary:"rgba(17,24,39,0.74)",  muted:"rgba(17,24,39,0.52)",  border:"rgba(17,24,39,0.12)",   button:"rgba(17,24,39,0.06)",  input:"rgba(255,255,255,0.86)" },
  ocean:  { name:"Ocean Deep",     bg:"#0c1929", accent:"#0ea5e9", card:"rgba(14,165,233,0.08)",  text:"#f0f9ff", sub:"rgba(255,255,255,0.45)", textSecondary:"rgba(240,249,255,0.72)", muted:"rgba(240,249,255,0.46)", border:"rgba(240,249,255,0.1)", button:"rgba(255,255,255,0.08)", input:"rgba(255,255,255,0.07)" },
  coral:  { name:"Sunset Coral",   bg:"#fff8f5", accent:"#f97316", card:"rgba(255,255,255,0.94)", text:"#1c0a00", sub:"rgba(28,10,0,0.56)",    textSecondary:"rgba(28,10,0,0.74)",   muted:"rgba(28,10,0,0.5)",    border:"rgba(28,10,0,0.12)",    button:"rgba(28,10,0,0.06)",   input:"rgba(255,255,255,0.86)" },
  rose:   { name:"Rose Gold",      bg:"#fff5f7", accent:"#e11d48", card:"rgba(255,255,255,0.94)", text:"#1a0010", sub:"rgba(26,0,16,0.56)",    textSecondary:"rgba(26,0,16,0.74)",   muted:"rgba(26,0,16,0.5)",    border:"rgba(26,0,16,0.12)",    button:"rgba(26,0,16,0.06)",   input:"rgba(255,255,255,0.86)" },
  slate:  { name:"Midnight Slate", bg:"#0f172a", accent:"#6366f1", card:"rgba(99,102,241,0.08)",  text:"#f1f5f9", sub:"rgba(255,255,255,0.45)", textSecondary:"rgba(241,245,249,0.72)", muted:"rgba(241,245,249,0.46)", border:"rgba(241,245,249,0.1)", button:"rgba(255,255,255,0.08)", input:"rgba(255,255,255,0.07)" },
}

const THEME_REWARDS = {
  aurora: { reason:"Starter theme" },
  mint: { xp:100, reason:"Unlock at 100 XP" },
  ocean: { streak:3, reason:"Unlock with a 3-day streak" },
  coral: { xp:250, reason:"Unlock at 250 XP" },
  rose: { pro:true, reason:"Unlock with Pro" },
  slate: { xp:500, reason:"Unlock at 500 XP" },
}

const applyTheme = (themeId) => {
  const t = THEMES[themeId] || THEMES.aurora
  const r = document.documentElement
  r.style.setProperty("--bg", t.bg)
  r.style.setProperty("--accent", t.accent)
  r.style.setProperty("--card", t.card)
  r.style.setProperty("--text", t.text)
  r.style.setProperty("--sub", t.sub)
  r.style.setProperty("--text-primary", t.text)
  r.style.setProperty("--text-secondary", t.textSecondary || t.sub)
  r.style.setProperty("--text-muted", t.muted || t.sub)
  r.style.setProperty("--card-bg", t.card)
  r.style.setProperty("--border", t.border || "rgba(255,255,255,0.1)")
  r.style.setProperty("--button-bg", t.button || "rgba(255,255,255,0.08)")
  r.style.setProperty("--input-bg", t.input || "rgba(255,255,255,0.07)")
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
const DAILY_QUEST_BONUS_XP = 20
const getFreshQuestState = () => ({ date: todayStr, awardedQuestIds: [], beforeNoonHabitIds: [] })
const getStoredQuestCompletions = (userId, dates) => dates.reduce((total, date) => {
  try {
    const saved = JSON.parse(localStorage.getItem(`hf_daily_quests_${userId || "guest"}_${date}`) || "null")
    return total + (Array.isArray(saved?.awardedQuestIds) ? saved.awardedQuestIds.length : 0)
  } catch {
    return total
  }
}, 0)
const getHour = () => new Date().getHours()
const getGreeting = () => { const h=getHour(); return h<12?"Good morning":h<17?"Good afternoon":"Good evening" }

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  html,body{height:100%;overscroll-behavior:none}
  body{font-family:'Inter',sans-serif;background:var(--bg,#0d0d1a);color:var(--text-primary,#fff);overflow-x:hidden}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:var(--border,rgba(255,255,255,0.1));border-radius:10px}

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
    background:var(--card-bg,var(--card,rgba(255,255,255,0.055)));
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);
    border:1px solid var(--border,rgba(255,255,255,0.1));
    border-radius:20px;
    box-shadow:0 4px 24px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.08);
    transition:transform 0.3s ease,box-shadow 0.3s ease;
  }
  .card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.1)}
  .card-glow{box-shadow:0 0 0 1px rgba(167,139,250,0.3),0 8px 32px rgba(167,139,250,0.15),inset 0 1px 0 rgba(255,255,255,0.1)}

  /* BUTTONS */
  .btn-glass{
    background:var(--button-bg,rgba(255,255,255,0.08));
    backdrop-filter:blur(10px);
    border:1px solid var(--border,rgba(255,255,255,0.15));
    border-radius:12px;color:var(--text-primary,#fff);
    font-family:'Inter',sans-serif;font-weight:700;
    cursor:pointer;transition:all 0.2s;
  }
  .btn-glass:hover{background:color-mix(in srgb,var(--button-bg,rgba(255,255,255,0.08)) 72%,var(--accent,#A78BFA) 28%);transform:translateY(-1px)}
  .btn-glass:active{transform:scale(0.97)}

  .btn-grad{
    border:none;border-radius:14px;color:var(--text-primary,#fff);
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
    background:var(--input-bg,rgba(255,255,255,0.07));
    border:1px solid var(--border,rgba(255,255,255,0.12));
    border-radius:14px;color:var(--text-primary,#fff);
    font-family:'Inter',sans-serif;font-size:14px;
    outline:none;margin-bottom:12px;
    transition:border-color 0.2s,box-shadow 0.2s;
  }
  .inp:focus{border-color:rgba(167,139,250,0.6);box-shadow:0 0 0 3px rgba(167,139,250,0.12)}
  .inp::placeholder{color:var(--text-muted,rgba(255,255,255,0.25))}

  /* HABIT CARD */
  .habit-card{
    border-radius:18px;
    border:1px solid var(--border,rgba(255,255,255,0.08));
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
    overflow-y:auto;
  }
  .sheet{
    position:fixed;inset:0;background:rgba(0,0,0,0.75);
    backdrop-filter:blur(16px);z-index:100;
    display:flex;align-items:flex-end;
  }
  .sheet-inner{
    background:var(--card-bg,var(--card,linear-gradient(180deg,#1a1a2e,#13132a)));
    border:1px solid var(--border,rgba(255,255,255,0.1));
    border-radius:28px 28px 0 0;
    padding:8px 20px 40px;width:100%;
    max-height:92vh;overflow-y:auto;
    box-shadow:0 -20px 60px rgba(0,0,0,0.6);
  }
  .sheet-handle{width:40px;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;margin:12px auto 20px}

  /* TOP NAV */
  .top-nav{
    position:sticky;top:0;z-index:50;
    background:rgba(251,253,249,0.86);
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
    border-bottom:1px solid rgba(31,53,40,0.08);
    padding:14px 20px;
    display:flex;align-items:center;justify-content:space-between;
  }

  /* BOTTOM TAB BAR */
  .tab-bar{
    position:fixed;bottom:0;left:50%;transform:translateX(-50%);
    width:100%;max-width:480px;
    background:rgba(255,255,255,0.9);
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);
    border-top:1px solid rgba(31,53,40,0.08);
    box-shadow:0 -12px 36px rgba(24,35,29,0.08);
    display:flex;z-index:50;padding:10px 12px 24px;
  }
  .tab-item{
    flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:4px;cursor:pointer;padding:8px 0;border-radius:18px;transition:all 0.2s;color:#6d786f;
  }
  .tab-item:hover{background:rgba(31,122,77,0.05)}
  .tab-item.active{background:#eef8e9;color:#1f7a4d}
  .tab-icon{font-size:18px;line-height:1;transition:transform 0.2s}
  .tab-item.active .tab-icon{transform:scale(1.04)}
  .tab-label{font-size:10px;font-weight:750;letter-spacing:0;color:inherit;transition:color 0.2s}
  .tab-dot{display:none}
  .app-content{padding:16px 16px 116px;position:relative;z-index:5}
  .home-hero-grid{display:grid;grid-template-columns:auto 1fr;gap:14px;margin-bottom:14px}
  .modal-card{max-height:88vh;overflow-y:auto}
  .template-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}

  @media (max-width:390px){
    .top-nav{padding:12px 14px;gap:10px}
    .home-hero-grid{grid-template-columns:1fr}
    .template-grid{grid-template-columns:1fr}
    .overlay{padding:14px;align-items:flex-start}
    .modal-card{max-height:calc(100vh - 28px)}
  }

  /* PARTICLES */
  .particle{position:fixed;width:7px;height:7px;border-radius:50%;pointer-events:none;z-index:9999;animation:confettiFall 2s ease forwards}

  /* SHIMMER LOADING */
  .shimmer{background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0) 100%);background-size:200% 100%;animation:shimmer 1.8s infinite}
`

function Ring3D({ pct, size=140, color="#A78BFA", label, sublabel }) {
  const r = (size/2) - 14
  const circ = 2 * Math.PI * r
  const dash = (pct/100) * circ
  return (
    <div className="ring-wrap" style={{width:size,height:size}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)",filter:`drop-shadow(0 0 12px var(--ring-glow,${color}66))`}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--ring-track,rgba(255,255,255,0.07))" strokeWidth="11"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}22`} strokeWidth="11" strokeDasharray={`${circ} 0`}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="11"
          strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} className="progress-ring"
          style={{filter:`drop-shadow(0 0 8px var(--ring-glow,${color}))`}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <div style={{fontSize:size>100?30:20,fontWeight:900,color:"var(--text-primary,#fff)",lineHeight:1}}>{Math.round(pct)}%</div>
        {label && <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",letterSpacing:.8,marginTop:3,textTransform:"uppercase"}}>{label}</div>}
        {sublabel && <div style={{fontSize:10,color:"var(--text-muted)",marginTop:1}}>{sublabel}</div>}
      </div>
    </div>
  )
}

function FireStreak({ streak }) {
  if (streak === 0) return <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:28,opacity:0.4}}>🔥</span><span style={{fontSize:28,fontWeight:900,color:"var(--text-muted)"}}>0</span></div>
  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <div style={{fontSize:32,animation:"fireFlicker 0.4s ease-in-out infinite",filter:"drop-shadow(0 0 10px #FF8E53)"}}>🔥</div>
      <div style={{fontSize:32,fontWeight:900,background:"linear-gradient(135deg,#FF8E53,#FFD93D)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{streak}</div>
    </div>
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
  const [themeReward, setThemeReward] = useState(null)
  const [statsError, setStatsError] = useState("")
  const [dailyQuestState, setDailyQuestState] = useState(() => getFreshQuestState())
  const [authMode, setAuthMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authErr, setAuthErr] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [newName, setNewName] = useState("")
  const [newEmoji, setNewEmoji] = useState("🎯")
  const [newColor, setNewColor] = useState("#A78BFA")
  const [newTime, setNewTime] = useState("08:00")
  const [habitSaveError, setHabitSaveError] = useState("")
  const [aiMsgs, setAiMsgs] = useState([])
  const [aiInput, setAiInput] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [weeklyRecap, setWeeklyRecap] = useState("")
  const [weeklyRecapLoading, setWeeklyRecapLoading] = useState(false)
  const [weeklyRecapError, setWeeklyRecapError] = useState("")
  const [steps, setSteps] = useState(() => parseInt(localStorage.getItem("hf_steps")||"0"))
  const [water, setWater] = useState(() => parseInt(localStorage.getItem("hf_water_"+todayStr)||"0"))
  const [mood, setMood] = useState(() => localStorage.getItem("hf_mood_"+todayStr)||"")

  const days = getLast7()
  const savingCompletionKeys = useRef(new Set())
  const awardingQuestIds = useRef(new Set())
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({data:{session}}) => {
      if (session?.user) {
        identifyUser(session.user)
        setUser(session.user); loadHabits(session.user.id)
      }
      setLoading(false)
    })
    const {data:{subscription}} = supabase.auth.onAuthStateChange((event,session) => {
      if (session?.user) {
        identifyUser(session.user)
        if (event === "SIGNED_IN") trackEvent("login", { method:"supabase" })
        setUser(session.user); setPage("app"); loadHabits(session.user.id)
      }
      else {
        resetAnalytics()
        setUser(null); setHabits([]); setPage("landing")
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const dailyQuestStorageKey = `hf_daily_quests_${user?.id || "guest"}_${todayStr}`

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(dailyQuestStorageKey) || "null")
      if (saved?.date === todayStr) {
        setDailyQuestState({
          date: todayStr,
          awardedQuestIds: Array.isArray(saved.awardedQuestIds) ? saved.awardedQuestIds : [],
          beforeNoonHabitIds: Array.isArray(saved.beforeNoonHabitIds) ? saved.beforeNoonHabitIds : [],
        })
        return
      }
    } catch {}
    setDailyQuestState(getFreshQuestState())
  }, [dailyQuestStorageKey])

  useEffect(() => {
    if (!user || !supabase) return

    const params = new URLSearchParams(window.location.search)
    const checkoutResult = params.get("checkout")
    if (!checkoutResult) return

    const sessionId = params.get("session_id")
    window.history.replaceState({}, "", window.location.pathname || "/")

    if (checkoutResult === "cancel") {
      setCheckoutNotice("Checkout canceled. You can restart anytime.")
      openPaywall("checkout_cancel")
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
          openPaywall("checkout_incomplete")
          setCheckoutNotice("Checkout is not complete yet. Please try again.")
        }
      } catch (err) {
        openPaywall("checkout_error")
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

  const signInGoogle = async () => {
    trackEvent("login", { method:"google_oauth_started" })
    await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}})
  }
  const signInEmail = async () => {
    setAuthLoading(true); setAuthErr("")
    const fn = authMode==="login" ? supabase.auth.signInWithPassword : supabase.auth.signUp
    const {error} = await fn.call(supabase.auth,{email,password})
    if (error) setAuthErr(error.message)
    else if (authMode==="signup") {
      trackEvent("signup", { method:"email" })
      setAuthErr("✅ Check your email!")
    } else {
      trackEvent("login", { method:"email" })
    }
    setAuthLoading(false)
  }
  const signOut = async () => supabase.auth.signOut()

  const showMilestone = (nextMilestone) => {
    setMilestone(nextMilestone)
    setTimeout(() => setMilestone(null), 2600)
  }

  const showThemeReward = (themeName) => {
    setThemeReward(themeName)
    setTimeout(() => setThemeReward(null), 3200)
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

  const saveDailyQuestState = (updater) => {
    setDailyQuestState(prev => {
      const base = prev?.date === todayStr ? prev : getFreshQuestState()
      const next = updater(base)
      localStorage.setItem(dailyQuestStorageKey, JSON.stringify(next))
      return next
    })
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
      if (date === todayStr && getHour() < 12) {
        saveDailyQuestState(state => ({
          ...state,
          beforeNoonHabitIds: [...new Set([...(state.beforeNoonHabitIds || []), id])],
        }))
      }
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
      trackEvent("habit_completed", { date, streak:newStreak, xp_earned:xpEarned })
      }
      setHabits(h=>h.map(x=>x.id===id?{...x,completions:{...x.completions,[date]:!done}}:x))
    } finally {
      savingCompletionKeys.current.delete(completionKey)
    }
  }

  const addHabit = async () => {
    setHabitSaveError("")
    if (!newName.trim()) return
    if (!isPro && habits.length >= 3) { openPaywall("habit_limit"); return }
    const {data, error} = await supabase.from("habits").insert({user_id:user.id,name:newName.trim(),emoji:newEmoji,color:newColor,reminder_time:newTime}).select().single()
    if (error) {
      setHabitSaveError("Could not save that habit. Please try again.")
      return
    }
    if (data) {
      setHabits(h=>[...h,{...data,completions:{}}])
      triggerParticles()
      maybeOpenNotificationPrompt()
      trackEvent("habit_created", { source:"manual", has_reminder:Boolean(newTime) })
    }
    setNewName(""); setShowAdd(false)
  }

  const addFromTemplate = async (t) => {
    setHabitSaveError("")
    if (!isPro && habits.length >= 3) { openPaywall("habit_limit"); return }
    const {data, error} = await supabase.from("habits").insert({user_id:user.id,name:t.name,emoji:t.emoji,color:t.color,reminder_time:t.time}).select().single()
    if (error) {
      setHabitSaveError("Could not add that template. Please try again.")
      return
    }
    if (data) {
      setHabits(h=>[...h,{...data,completions:{}}])
      triggerParticles()
      trackEvent("habit_created", { source:"template", has_reminder:Boolean(t.time) })
    }
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

  const openAICoach = () => {
    trackEvent("ai_coach_opened", { source:"app" })
    setShowAI(true)
  }

  const openPaywall = (source) => {
    trackEvent("paywall_opened", { source })
    setShowPaywall(true)
  }

  const startCheckout = async () => {
    if (checkoutLoading) return
    trackEvent("checkout_started", { source:"paywall" })
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
      trackEvent("reminder_enabled", { source:"notification_explainer" })
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

  const generateWeeklyRecap = async () => {
    if (!user || weeklyRecapLoading) return
    setWeeklyRecapLoading(true)
    setWeeklyRecapError("")

    const systemPrompt = `You are the HabitFlow AI coach. Generate a short weekly reflection using the user's long-term memory when helpful.
Weekly summary:
- Completed habit check-ins: ${weeklySummary.completed}
- Missed habit opportunities: ${weeklySummary.missed}
- Best current streak: ${weeklySummary.bestStreak} days
- XP gained this week: ${weeklySummary.xpGained}
- Daily quests completed: ${weeklySummary.questsCompleted}
- Strongest habits: ${weeklySummary.strongHabits.join(", ") || "none yet"}
- Habits needing a gentle reset: ${weeklySummary.resetHabits.join(", ") || "none yet"}
Rules: Keep it under 90 words. Be supportive and specific. Mention one win, one gentle focus for next week, and no guilt or shame.`

    try {
      const { data:{ session } } = await supabase.auth.getSession()
      const res = await fetch("/api/ai-coach", {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${session?.access_token}`},
        body:JSON.stringify({
          messages:[{role:"user",content:"Write my supportive weekly HabitFlow recap."}],
          systemPrompt,
        })
      })
      const data = await res.json()
      if (!data.reply) throw new Error(data.error || "No weekly recap")
      setWeeklyRecap(data.reply)
      trackEvent("ai_recap_generated", { source:"weekly_reflection", fallback:false })
    } catch {
      setWeeklyRecap("This week still gave you useful signal: every check-in counted, and the missed spots are just places to make next week smaller and kinder. Pick one habit to protect first, then let the rest follow.")
      setWeeklyRecapError("AI recap had trouble connecting, so I wrote a local reflection for now.")
      trackEvent("ai_recap_generated", { source:"weekly_reflection", fallback:true })
    } finally {
      setWeeklyRecapLoading(false)
    }
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
const bestStreak = habits.length ? Math.max(0,...habits.map(h=>getStreak(h,days,freezeDates))) : 0
const maxFreezes = isPro ? 99 : 1
const shieldProgress = bestStreak > 0 ? bestStreak % 7 : 0
const daysToNextShield = shieldProgress === 0 ? 7 : 7 - shieldProgress
const lastFreezeDate = freezeDates.length ? [...freezeDates].sort().at(-1) : ""
const unlockedThemes = Object.fromEntries(Object.entries(THEMES).map(([id, theme]) => {
  const reward = THEME_REWARDS[id] || {}
  const unlocked = !reward.xp && !reward.streak && !reward.pro
    || Boolean(reward.xp && displayXP >= reward.xp)
    || Boolean(reward.streak && bestStreak >= reward.streak)
    || Boolean(reward.pro && isPro)
  return [id, {...reward, name:theme.name, unlocked, reason:unlocked?"Unlocked":reward.reason}]
}))
  useEffect(() => {
    const storageKey = `hf_unlocked_themes_seen_${user?.id || "guest"}`
    let seen = []
    try { seen = JSON.parse(localStorage.getItem(storageKey) || "[]") } catch {}
    const newlyUnlocked = Object.entries(unlockedThemes).find(([id, reward]) => reward.unlocked && id !== "aurora" && !seen.includes(id))
    if (!newlyUnlocked) return
    const nextSeen = [...new Set([...seen, newlyUnlocked[0]])]
    localStorage.setItem(storageKey, JSON.stringify(nextSeen))
    showThemeReward(newlyUnlocked[1].name)
  }, [displayXP, bestStreak, isPro, user?.id])

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

  const activeHabits = habits.filter(h => !h.archived && !h.archived_at && !h.deleted_at && h.active !== false)
  const activeHabitsCount = activeHabits.length
  const doneToday = activeHabits.filter(h=>h.completions?.[todayStr]).length
  const todayPct = activeHabitsCount ? Math.round((doneToday/activeHabitsCount)*100) : 0
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1)
  const yesterdayStr = yesterday.toISOString().slice(0,10)
  const missedYesterdayForCompanion = activeHabitsCount > 0 && activeHabits.some(h => !h.completions?.[yesterdayStr])
  const stepsPct = Math.min((steps/10000)*100,100)
  const waterPct = Math.min((water/8)*100,100)
  const userEmail = user?.email || ""
  const userName = userEmail.split("@")[0] || "there"
  const priorDays = days.filter(d => d !== todayStr)
  const streakHabitIds = activeHabits.filter(h => getStreak(h, priorDays, freezeDates) > 0).map(h => h.id)
  const beforeNoonDone = activeHabits.some(h => h.completions?.[todayStr] && dailyQuestState.beforeNoonHabitIds?.includes(h.id))
  const habitQuestTarget = Math.min(3, Math.max(1, activeHabitsCount))
  const streakQuestTarget = streakHabitIds.length ? Math.min(2, streakHabitIds.length) : 1
  const streakQuestProgress = streakHabitIds.length
    ? activeHabits.filter(h => streakHabitIds.includes(h.id) && h.completions?.[todayStr]).length
    : doneToday
  const dailyQuests = activeHabitsCount === 0 ? [] : [
    {
      id: "complete-habits",
      icon: "✅",
      title: `Complete ${habitQuestTarget} habit${habitQuestTarget===1?"":"s"}`,
      detail: habitQuestTarget === activeHabitsCount ? "Give today's whole routine a clean finish." : "A steady little run beats a perfect plan.",
      progress: Math.min(doneToday, habitQuestTarget),
      target: habitQuestTarget,
      complete: doneToday >= habitQuestTarget,
      bonusXP: DAILY_QUEST_BONUS_XP,
    },
    {
      id: "before-noon",
      icon: "🌅",
      title: "Finish one before noon",
      detail: "Start early and let the day feel lighter.",
      progress: beforeNoonDone ? 1 : 0,
      target: 1,
      complete: beforeNoonDone,
      bonusXP: DAILY_QUEST_BONUS_XP,
    },
    {
      id: "protect-streaks",
      icon: "🔥",
      title: streakHabitIds.length ? "Maintain streaks today" : "Start a streak today",
      detail: streakHabitIds.length ? "Protect the habits that already have momentum." : "One completion is enough to begin the rhythm.",
      progress: Math.min(streakQuestProgress, streakQuestTarget),
      target: streakQuestTarget,
      complete: streakQuestProgress >= streakQuestTarget,
      bonusXP: DAILY_QUEST_BONUS_XP,
    },
  ].map(q => ({...q, awarded: dailyQuestState.awardedQuestIds?.includes(q.id)}))
  const dailyQuestSignature = dailyQuests.map(q => `${q.id}:${q.progress}:${q.complete}:${q.awarded}`).join("|")
  const awardedQuestCount = dailyQuests.filter(q => q.awarded).length
  const completedQuestCount = dailyQuests.filter(q => q.complete).length
  const weeklyHabitStats = habits.map(h => {
    const completed = days.filter(d => h.completions?.[d]).length
    return {...h, weeklyCompleted: completed, weeklyMissed: days.length - completed}
  })
  const weeklyCompletedHabits = weeklyHabitStats.reduce((sum, h) => sum + h.weeklyCompleted, 0)
  const weeklyMissedHabits = weeklyHabitStats.reduce((sum, h) => sum + h.weeklyMissed, 0)
  const weeklyStrongHabits = weeklyHabitStats
    .filter(h => h.weeklyCompleted > 0)
    .sort((a,b) => b.weeklyCompleted - a.weeklyCompleted)
    .slice(0,3)
    .map(h => h.name)
  const weeklyResetHabits = weeklyHabitStats
    .filter(h => h.weeklyMissed > 0)
    .sort((a,b) => b.weeklyMissed - a.weeklyMissed)
    .slice(0,3)
    .map(h => h.name)
  const weeklyQuestCompletions = getStoredQuestCompletions(user?.id, days)
  const weeklySummary = {
    completed: weeklyCompletedHabits,
    missed: weeklyMissedHabits,
    bestStreak,
    xpGained: xp,
    questsCompleted: Math.max(weeklyQuestCompletions, awardedQuestCount),
    strongHabits: weeklyStrongHabits,
    resetHabits: weeklyResetHabits,
  }
  const dayProgress = Math.min(1, Math.max(0, (getHour() - 7) / 15))
  const expectedDoneByNow = activeHabitsCount ? Math.min(activeHabitsCount, Math.ceil(activeHabitsCount * dayProgress)) : 0
  const questMomentum = dailyQuests.length ? completedQuestCount / dailyQuests.length : 0
  const streakMomentum = bestStreak >= 7 ? 0.2 : bestStreak >= 3 ? 0.1 : 0
  const paceScore = activeHabitsCount ? (doneToday / activeHabitsCount) + (questMomentum * 0.2) + streakMomentum : 1
  const expectedPace = activeHabitsCount ? expectedDoneByNow / activeHabitsCount : 0
  const pacerState = activeHabitsCount === 0
    ? "on track"
    : paceScore >= Math.min(1, expectedPace + 0.25)
      ? "ahead"
      : paceScore + 0.15 < expectedPace
        ? "behind"
        : "on track"
  const pacerCopy = {
    behind: {
      label: "Behind today",
      detail: `A gentle reset is enough. One small habit brings you back toward the day.`,
      color: "#FFD93D",
    },
    "on track": {
      label: "On track today",
      detail: `You are moving at a kind pace. The next tiny action can keep it smooth.`,
      color: "#4ECDC4",
    },
    ahead: {
      label: "Ahead today",
      detail: `You have a little breathing room. Enjoy it, then protect the rhythm later.`,
      color: "#6BCB77",
    },
  }[pacerState]
  const companionMood = awardedQuestCount > 0 || completedQuestCount >= 2 || displayXP > 0 && displayXP % 100 < 35 || bestStreak >= 7
    ? "excited"
    : missedYesterdayForCompanion && freezes === 0
      ? "worried"
      : doneToday === 0
        ? "sleepy"
        : "happy"
  const companionMessage = {
    excited: awardedQuestCount > 0
      ? "I saw that quest land. Tiny wins like that are how momentum starts feeling real."
      : bestStreak >= 7
        ? "That streak has a heartbeat now. Keep it warm with one gentle action today."
        : "Your energy is picking up. Let’s catch one more small win while it feels easy.",
    worried: "Yesterday looked a little heavy. No shame here. Let’s make today small enough to begin.",
    sleepy: "I’m warming up with you. One easy habit is enough to wake the day up.",
    happy: "Nice, you’re moving. Keep it kind and steady; the day does not need to be perfect.",
  }[companionMood]
  const companionStatus = {
    excited: "Celebrating",
    worried: "Checking in",
    sleepy: "Waking up",
    happy: "Steady",
  }[companionMood]

  const awardDailyQuest = async (quest) => {
    if (!user || !supabase || quest.awarded || awardingQuestIds.current.has(quest.id)) return
    awardingQuestIds.current.add(quest.id)
    try {
      const {data:profileStats, error:profileStatsError} = await supabase.from("profiles").select("total_xp").eq("id",user.id).maybeSingle()
      if (profileStatsError) {
        showStatsError("Quest complete, but bonus XP did not sync. We'll try again soon.")
        return
      }

      const baseXP = Number(profileStats?.total_xp ?? totalXP ?? 0)
      const newTotalXP = baseXP + quest.bonusXP
      const {error:profileError} = await upsertProfileStats({id:user.id,total_xp:newTotalXP})
      if (profileError) {
        showStatsError("Quest complete, but bonus XP did not sync. We'll try again soon.")
        return
      }

      setTotalXP(newTotalXP)
      saveDailyQuestState(state => ({
        ...state,
        awardedQuestIds: [...new Set([...(state.awardedQuestIds || []), quest.id])],
      }))
      showMilestone({icon:quest.icon,title:`Daily quest complete +${quest.bonusXP} XP`,detail:quest.title})
      trackEvent("quest_completed", { quest_id:quest.id, bonus_xp:quest.bonusXP })
    } finally {
      awardingQuestIds.current.delete(quest.id)
    }
  }

  useEffect(() => {
    const nextQuest = dailyQuests.find(q => q.complete && !q.awarded)
    if (nextQuest) awardDailyQuest(nextQuest)
  }, [dailyQuestSignature, user?.id])

  // LOADING
  if (loading) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#fbfdf9 0%,#f4f8f2 100%)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20,fontFamily:"'Inter',sans-serif"}}>
      <style>{css}</style>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
        <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#d9f99d,#86efac 52%,#67e8f9)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 24px rgba(34,197,94,0.2)"}}>
          <div style={{width:18,height:18,borderRadius:"50%",background:"#1f7a4d"}}/>
        </div>
        <div style={{fontSize:22,fontWeight:900,color:"#152118",letterSpacing:0}}>HabitFlow</div>
      </div>
      <div style={{width:32,height:3,borderRadius:999,background:"#e7efe5",overflow:"hidden"}}>
        <div style={{height:"100%",background:"#1f7a4d",borderRadius:999,animation:"loadBar 1.4s ease-in-out infinite"}}/>
      </div>
      <style>{`@keyframes loadBar{0%{width:0%;margin-left:0}60%{width:100%;margin-left:0}100%{width:0%;margin-left:100%}}`}</style>
    </div>
  )

  if (!hasSupabaseConfig) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#f0fdf4 0%,#fbfdf9 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Inter',sans-serif"}}>
      <style>{css}</style>
      <div style={{maxWidth:420,width:"100%",padding:28,textAlign:"center",background:"#ffffff",borderRadius:24,border:"1px solid rgba(31,53,40,0.08)",boxShadow:"0 20px 48px rgba(24,35,29,0.08)"}}>
        <div style={{fontSize:46,marginBottom:14}}>⚡</div>
        <div style={{fontSize:22,fontWeight:900,marginBottom:8,color:"#152118"}}>
          HabitFlow setup needed
        </div>
        <div style={{fontSize:14,lineHeight:1.6,color:"#536257"}}>
          Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your environment, then restart the app.
        </div>
      </div>
    </div>
  )

  // LANDING PAGE
  if (page==="landing") return <LandingPage onSignIn={()=>setPage("auth")} onGoogleSignIn={signInGoogle}/>

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
          <div style={{fontSize:13,color:"var(--text-muted)"}}>{authMode==="login"?"Welcome back! 👋":"Start your journey 🚀"}</div>
        </div>
        <button onClick={signInGoogle} className="btn-glass" style={{width:"100%",padding:14,fontSize:14,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <span style={{fontWeight:900,color:"#4285F4",fontSize:16}}>G</span> Continue with Google
        </button>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{flex:1,height:1,background:"rgba(255,255,255,0.08)"}}/><span style={{fontSize:11,color:"var(--text-muted)"}}>OR</span><div style={{flex:1,height:1,background:"rgba(255,255,255,0.08)"}}/>
        </div>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email" className="inp"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="inp" onKeyDown={e=>e.key==="Enter"&&signInEmail()}/>
        {authErr && <div style={{fontSize:12,color:authErr.includes("✅")?"#6BCB77":"#FF6B6B",marginBottom:10,textAlign:"center",fontWeight:600}}>{authErr}</div>}
        <button onClick={signInEmail} disabled={authLoading} className="btn-grad" style={{width:"100%",padding:14,fontSize:15,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",opacity:authLoading?0.6:1,marginBottom:12}}>
          {authLoading?"Loading...":(authMode==="login"?"Sign In 🚀":"Create Account ✨")}
        </button>
        <div style={{textAlign:"center",fontSize:13,color:"var(--text-muted)"}}>
          {authMode==="login"?"Don't have an account? ":"Already have one? "}
          <span onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthErr("")}} style={{color:"#A78BFA",cursor:"pointer",fontWeight:700}}>
            {authMode==="login"?"Sign Up":"Sign In"}
          </span>
        </div>
        <div style={{textAlign:"center",marginTop:12}}>
          <span onClick={()=>setPage("landing")} style={{fontSize:12,color:"var(--text-muted)",cursor:"pointer"}}>← Back</span>
        </div>
      </div>
    </div>
  )

  const saveEditedHabit = async (id, name, emoji, color) => {
    if (!name) return
    await supabase.from("habits").update({ name, emoji, color }).eq("id", id)
    setHabits(h => h.map(x => x.id === id ? { ...x, name, emoji, color } : x))
    setEditHabit(null)
  }

  // MAIN APP
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#fbfdf9 0%,#f4f8f2 62%,#ffffff 100%)",color:"#152118",paddingBottom:96,maxWidth:480,margin:"0 auto",position:"relative"}}>
      <style>{css}</style>
      <Particles active={particles}/>
      <LevelUpBurst show={levelUpShow} level={levelUpData}/> 
      <MilestoneToast milestone={milestone}/>
      {themeReward && (
        <div style={{position:"fixed",top:74,left:"50%",transform:"translateX(-50%)",zIndex:9999,width:"calc(100% - 32px)",maxWidth:420,pointerEvents:"none",animation:"slideDown 0.35s ease"}}>
          <div className="card" style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:12,background:"linear-gradient(135deg,#eef8e9,#f0fdf4)",border:"1px solid var(--border)",boxShadow:"0 12px 36px rgba(24,35,29,0.10)"}}>
            <div style={{width:38,height:38,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,background:"rgba(255,255,255,0.1)",boxShadow:"0 4px 12px rgba(31,122,77,0.15)"}}>🎨</div>
            <div>
              <div style={{fontSize:13,fontWeight:900,color:"var(--text-primary,#fff)",marginBottom:2}}>New theme unlocked</div>
              <div style={{fontSize:11,color:"var(--text-secondary)",fontWeight:700}}>{themeReward} is ready in Settings.</div>
            </div>
          </div>
        </div>
      )}
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
          <div className="card" style={{padding:"12px 14px",fontSize:13,fontWeight:700,color:"var(--text-primary,#fff)",textAlign:"center",background:"rgba(107,203,119,0.16)",border:"1px solid rgba(107,203,119,0.28)"}}>
            {checkoutNotice}
          </div>
        </div>
      )}
      {showTheme && (
  <ThemeSwitcher
    current={currentTheme}
    unlockedThemes={unlockedThemes}
    onClose={()=>setShowTheme(false)}
    onSelect={async(themeId)=>{
      if (!unlockedThemes[themeId]?.unlocked) return
      setCurrentTheme(themeId)
      applyTheme(themeId)
      setShowTheme(false)
      if(user) await supabase.from("profiles").upsert({id:user.id, theme:themeId})
      trackEvent("theme_changed", { theme_id:themeId })
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
      trackEvent("onboarding_completed", { habit_count:createdHabits.length })
      createdHabits.forEach(() => trackEvent("habit_created", { source:"onboarding", has_reminder:true }))
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
        <div style={{position:"absolute",top:"-12%",left:"-16%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(34,197,94,0.08),transparent 70%)",animation:"bgMove 12s ease-in-out infinite"}}/>
        <div style={{position:"absolute",bottom:"18%",right:"-18%",width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,rgba(20,184,166,0.08),transparent 70%)",animation:"bgMove 16s ease-in-out infinite reverse"}}/>
      </div>

      {/* TOP NAV */}
      <div className="top-nav">
        <div style={{minWidth:0}}>
          <div style={{fontSize:10,fontWeight:750,color:"#7a867d",letterSpacing:1.2,textTransform:"uppercase",marginBottom:2}}>HABITFLOW</div>
          <div style={{fontSize:20,fontWeight:850,color:"#152118",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:210}}>Hello, {userName}</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{padding:"7px 11px",display:"flex",alignItems:"center",gap:6,borderRadius:999,background:"#ffffff",border:"1px solid rgba(31,53,40,0.08)",boxShadow:"0 8px 20px rgba(24,35,29,0.05)"}}>
            <span style={{fontSize:12,fontWeight:800,color:"#1f7a4d"}}>Lv {currentLevel.level}</span>
          </div>
          <button onClick={openAICoach} style={{padding:"8px 13px",fontSize:12,fontWeight:800,borderRadius:999,border:"1px solid rgba(31,122,77,0.14)",background:"#eef8e9",color:"#1f7a4d",cursor:"pointer"}}>Coach</button>
          <button onClick={signOut} style={{padding:"8px 14px",fontSize:13,fontWeight:700,borderRadius:999,border:"1px solid rgba(31,53,40,0.1)",background:"#ffffff",color:"#536257",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Out</button>
        </div>
      </div>

      <div className="app-content">

        {/* HOME TAB */}
        {activeTab==="home" && (
     <HomeScreen
       activeHabits={activeHabits}
       doneToday={doneToday}
       todayPct={todayPct}
       todayStr={todayStr}
       companionMood={companionMood}
       companionMessage={companionMessage}
       companionStatus={companionStatus}
       pacerCopy={pacerCopy}
       displayXP={displayXP}
       currentLevel={currentLevel}
       nextLevel={nextLevel}
       xpPct={xpPct}
       levelXP={levelXP}
       levelXPNeeded={levelXPNeeded}
       bestStreak={bestStreak}
       freezes={freezes}
       maxFreezes={maxFreezes}
       daysToNextShield={daysToNextShield}
       water={water}
       steps={steps}
       waterPct={waterPct}
       stepsPct={stepsPct}
       dailyQuests={dailyQuests}
       DAILY_QUEST_BONUS_XP={DAILY_QUEST_BONUS_XP}
       weeklyRecap={weeklyRecap}
       weeklyRecapLoading={weeklyRecapLoading}
       weeklyRecapError={weeklyRecapError}
       weeklySummary={weeklySummary}
       habitSaveError={habitSaveError}
       onToggle={toggle}
       onOpenAI={openAICoach}
       onSetTab={setActiveTab}
       onAdd={()=>{ setHabitSaveError(""); setShowAdd(true) }}
       onTemplates={()=>{ setHabitSaveError(""); setShowTemplates(true) }}
       onAddWater={addWater}
       onAddSteps={addSteps}
       onWeeklyRecap={generateWeeklyRecap}
     />
   )}
        {/* HABITS TAB */}
        {activeTab==="habits" && (
          <HabitsScreen
       habits={habits}
       todayStr={todayStr}
       days={days}
       habitSaveError={habitSaveError}
       onToggle={toggle}
       onEdit={setEditHabit}
       onAdd={()=>{ setHabitSaveError(""); setShowAdd(true) }}
       onTemplates={()=>{ setHabitSaveError(""); setShowTemplates(true) }}
     />
        )}

        {/* ANALYTICS TAB */}
{activeTab==="analytics" && (
     <AnalyticsScreen
       habits={habits}
       isPro={isPro}
       displayXP={displayXP}
       currentLevel={currentLevel}
       nextLevel={nextLevel}
       xpPct={xpPct}
       levelXP={levelXP}
       levelXPNeeded={levelXPNeeded}
       lifetimeCompletions={lifetimeCompletions}
       bestStreak={bestStreak}
       days={days}
       onOpenPaywall={openPaywall}
     />
   )}

        {/* SETTINGS TAB */}
        {activeTab==="settings" && (
          <SettingsScreen
       userName={userName}
       currentLevel={currentLevel}
       displayXP={displayXP}
       isPro={isPro}
       onOpenPaywall={openPaywall}
       onOpenTheme={openThemeSwitcher}
       onOpenNotifications={openNotificationExplainer}
       onOpenAI={openAICoach}
       onOpenTemplates={()=>{ setHabitSaveError(""); setShowTemplates(true) }}
       onSignOut={signOut}
     />
        )}
      </div>

      {/* TAB BAR */}
      <div className="tab-bar">
        {[
          {id:"home",icon:"⌂",lbl:"Home"},
          {id:"habits",icon:"✓",lbl:"Habits"},
          {id:"analytics",icon:"◌",lbl:"Stats"},
          {id:"settings",icon:"⚙",lbl:"Settings"},
        ].map(t=>(
          <div key={t.id} className={`tab-item ${activeTab===t.id?"active":""}`} onClick={()=>setActiveTab(t.id)}>
            <div className="tab-icon">{t.icon}</div>
            <div className="tab-label">{t.lbl}</div>
            <div className="tab-dot"/>
          </div>
        ))}
      </div>

      {/* ADD HABIT SHEET */}
      {showAdd && (
        <AddHabitSheet
          newName={newName}
          newEmoji={newEmoji}
          newColor={newColor}
          newTime={newTime}
          habitSaveError={habitSaveError}
          setNewName={setNewName}
          setNewEmoji={setNewEmoji}
          setNewColor={setNewColor}
          setNewTime={setNewTime}
          onAdd={addHabit}
          onTemplates={()=>{ setHabitSaveError(""); setShowTemplates(true) }}
          onClose={()=>setShowAdd(false)}
        />
      )}

      {/* TEMPLATES */}
      {showTemplates && (
        <TemplatesModal
          habitSaveError={habitSaveError}
          onAddFromTemplate={addFromTemplate}
          onClose={()=>setShowTemplates(false)}
        />
      )}

      {/* EDIT HABIT */}
      {editHabit && (
        <EditHabitModal
          editHabit={editHabit}
          onSave={saveEditedHabit}
          onDelete={deleteHabit}
          onClose={()=>setEditHabit(null)}
        />
      )}

      {/* AI COACH */}
      {showAI && (
        <AICoachModal
          aiMsgs={aiMsgs}
          aiInput={aiInput}
          aiLoading={aiLoading}
          onSendAI={sendAI}
          onChangeInput={setAiInput}
          onClose={()=>setShowAI(false)}
        />
      )}

      {/* MOOD PICKER */}
      {showMood && (
        <MoodPickerModal
          mood={mood}
          onSaveMood={saveMood}
          onClose={()=>setShowMood(false)}
        />
      )}

      {/* NOTIFICATION OPT-IN */}
      {showNotifications && (
        <NotificationModal
          notificationLoading={notificationLoading}
          notificationMessage={notificationMessage}
          notificationError={notificationError}
          onEnable={setupPushNotifications}
          onDismiss={dismissNotificationPrompt}
        />
      )}

      {/* PRO PAYWALL */}
      {showPaywall && (
        <PaywallModal
          isPro={isPro}
          checkoutLoading={checkoutLoading}
          checkoutError={checkoutError}
          checkoutNotice={checkoutNotice}
          onClose={()=>setShowPaywall(false)}
          onStartCheckout={startCheckout}
        />
      )}
    </div>
  )
}
