import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ============ 6 THEMES (from your HTML) ============
const THEMES = {
  aurora: {
    name:'Dark Aurora', emoji:'🌌',
    bg:'#0f0e1a', bg2:'#1a1830', card:'#1e1c35', card2:'#252340', input:'#2a2748',
    a1:'#7c6af7', a2:'#a78bfa', a3:'#06b6d4', a4:'#f472b6', a5:'#34d399',
    text:'#ffffff', textLt:'#a0a0c0', textMt:'#6b6b8a', border:'rgba(124,106,247,0.2)',
    ringBg:'rgba(124,106,247,0.15)', progBg:'rgba(255,255,255,0.08)',
    btnGrad:'linear-gradient(135deg,#7c6af7,#a78bfa)', navBg:'#13112a',
    tagBg:'rgba(124,106,247,0.15)', tagTxt:'#a78bfa',
    streakGrad:'linear-gradient(135deg,#7c6af7,#4f46e5)', headerBg:'#0f0e1a',
    shadow:'0 8px 32px rgba(0,0,0,0.4)', cardShadow:'0 4px 20px rgba(0,0,0,0.3)',
    isDark:true
  },
  mint: {
    name:'Fresh Mint', emoji:'🌿',
    bg:'#f0fdf6', bg2:'#ecfdf5', card:'#ffffff', card2:'#f8fffe', input:'#f0fdf6',
    a1:'#10b981', a2:'#34d399', a3:'#06b6d4', a4:'#ec4899', a5:'#a3e635',
    text:'#111827', textLt:'#374151', textMt:'#9ca3af', border:'rgba(16,185,129,0.2)',
    ringBg:'#d1fae5', progBg:'#e5e7eb',
    btnGrad:'linear-gradient(135deg,#10b981,#059669)', navBg:'#ffffff',
    tagBg:'#d1fae5', tagTxt:'#059669',
    streakGrad:'linear-gradient(135deg,#10b981,#059669)', headerBg:'#ecfdf5',
    shadow:'0 8px 32px rgba(16,185,129,0.12)', cardShadow:'0 4px 20px rgba(16,185,129,0.09)',
    isDark:false
  },
  coral: {
    name:'Sunset Coral', emoji:'🌅',
    bg:'#fff8f5', bg2:'#fff0ea', card:'#ffffff', card2:'#fffaf8', input:'#fff5f0',
    a1:'#f97316', a2:'#fb923c', a3:'#ef4444', a4:'#f59e0b', a5:'#10b981',
    text:'#1c0a00', textLt:'#431407', textMt:'#9a6b50', border:'rgba(249,115,22,0.2)',
    ringBg:'#fed7aa', progBg:'#fde8d8',
    btnGrad:'linear-gradient(135deg,#f97316,#ea580c)', navBg:'#ffffff',
    tagBg:'#fed7aa', tagTxt:'#c2410c',
    streakGrad:'linear-gradient(135deg,#f97316,#dc2626)', headerBg:'#fff0ea',
    shadow:'0 8px 32px rgba(249,115,22,0.12)', cardShadow:'0 4px 20px rgba(249,115,22,0.09)',
    isDark:false
  },
  ocean: {
    name:'Ocean Deep', emoji:'🌊',
    bg:'#0c1929', bg2:'#0f2034', card:'#132740', card2:'#163049', input:'#1a3a55',
    a1:'#0ea5e9', a2:'#38bdf8', a3:'#06b6d4', a4:'#818cf8', a5:'#34d399',
    text:'#f0f9ff', textLt:'#bae6fd', textMt:'#5b8fa8', border:'rgba(14,165,233,0.2)',
    ringBg:'rgba(14,165,233,0.15)', progBg:'rgba(255,255,255,0.07)',
    btnGrad:'linear-gradient(135deg,#0ea5e9,#0284c7)', navBg:'#0a1520',
    tagBg:'rgba(14,165,233,0.15)', tagTxt:'#38bdf8',
    streakGrad:'linear-gradient(135deg,#0ea5e9,#6366f1)', headerBg:'#0c1929',
    shadow:'0 8px 32px rgba(0,0,0,0.5)', cardShadow:'0 4px 20px rgba(0,0,0,0.35)',
    isDark:true
  },
  rose: {
    name:'Rose Gold', emoji:'🌸',
    bg:'#fff5f7', bg2:'#ffeef2', card:'#ffffff', card2:'#fff9fb', input:'#fff0f4',
    a1:'#e11d48', a2:'#fb7185', a3:'#f472b6', a4:'#c084fc', a5:'#34d399',
    text:'#1a0010', textLt:'#500724', textMt:'#9f6070', border:'rgba(225,29,72,0.18)',
    ringBg:'#fecdd3', progBg:'#fde8ee',
    btnGrad:'linear-gradient(135deg,#e11d48,#be123c)', navBg:'#ffffff',
    tagBg:'#fecdd3', tagTxt:'#be123c',
    streakGrad:'linear-gradient(135deg,#e11d48,#c084fc)', headerBg:'#ffeef2',
    shadow:'0 8px 32px rgba(225,29,72,0.12)', cardShadow:'0 4px 20px rgba(225,29,72,0.09)',
    isDark:false
  },
  slate: {
    name:'Midnight Slate', emoji:'🌙',
    bg:'#0f172a', bg2:'#1e293b', card:'#1e293b', card2:'#263245', input:'#334155',
    a1:'#6366f1', a2:'#818cf8', a3:'#22d3ee', a4:'#f472b6', a5:'#4ade80',
    text:'#f1f5f9', textLt:'#cbd5e1', textMt:'#64748b', border:'rgba(99,102,241,0.2)',
    ringBg:'rgba(99,102,241,0.15)', progBg:'rgba(255,255,255,0.06)',
    btnGrad:'linear-gradient(135deg,#6366f1,#4f46e5)', navBg:'#0c1120',
    tagBg:'rgba(99,102,241,0.15)', tagTxt:'#818cf8',
    streakGrad:'linear-gradient(135deg,#6366f1,#22d3ee)', headerBg:'#0f172a',
    shadow:'0 8px 32px rgba(0,0,0,0.5)', cardShadow:'0 4px 20px rgba(0,0,0,0.3)',
    isDark:true
  },
}

const LANGS = {
  en:{hi:'Hello',hab:'Habits',add:'Add Habit',set:'Settings'},
  es:{hi:'Hola',hab:'Hábitos',add:'Añadir',set:'Ajustes'},
  hi:{hi:'नमस्ते',hab:'आदतें',add:'जोड़ें',set:'सेटिंग्स'},
  ar:{hi:'مرحبا',hab:'العادات',add:'أضف',set:'الإعدادات'},
  fr:{hi:'Bonjour',hab:'Habitudes',add:'Ajouter',set:'Paramètres'},
  zh:{hi:'你好',hab:'习惯',add:'添加',set:'设置'},
}

const TEMPLATES = [
  {name:'Drink Water',emoji:'💧',color:'#06b6d4',category:'Health'},
  {name:'Exercise',emoji:'💪',color:'#10b981',category:'Health'},
  {name:'Meditate',emoji:'🧘',color:'#8b5cf6',category:'Mind'},
  {name:'Read',emoji:'📚',color:'#f97316',category:'Mind'},
  {name:'Walk 10k Steps',emoji:'👟',color:'#84cc16',category:'Health'},
  {name:'Sleep 8 Hours',emoji:'😴',color:'#6366f1',category:'Health'},
  {name:'No Sugar',emoji:'🍎',color:'#ef4444',category:'Health'},
  {name:'Journal',emoji:'📓',color:'#ec4899',category:'Mind'},
  {name:'Learn',emoji:'🎓',color:'#3b82f6',category:'Work'},
  {name:'Practice',emoji:'🎯',color:'#eab308',category:'Work'},
  {name:'Family Time',emoji:'👨‍👩‍👧',color:'#f59e0b',category:'Personal'},
  {name:'Gratitude',emoji:'🙏',color:'#10b981',category:'Mind'},
]

const CATS = [
  {name:'Health',emoji:'💚',color:'#10b981'},
  {name:'Mind',emoji:'🧠',color:'#8b5cf6'},
  {name:'Work',emoji:'💼',color:'#06b6d4'},
  {name:'Personal',emoji:'⭐',color:'#f97316'},
]

const LEVELS = [
  {name:'Beginner',min:0,emoji:'🌱'},
  {name:'Apprentice',min:100,emoji:'🌿'},
  {name:'Skilled',min:300,emoji:'🌊'},
  {name:'Expert',min:700,emoji:'⚡'},
  {name:'Master',min:1500,emoji:'🔥'},
  {name:'Legend',min:3000,emoji:'👑'},
]

const BADGES = [
  {id:'first',name:'First Step',emoji:'🎯',desc:'Complete 1 habit',check:s=>s.tc>=1},
  {id:'week',name:'Week Warrior',emoji:'⚡',desc:'7-day streak',check:s=>s.ms>=7},
  {id:'month',name:'Monthly Master',emoji:'🏆',desc:'30-day streak',check:s=>s.ms>=30},
  {id:'hundred',name:'Century Club',emoji:'💯',desc:'100 completions',check:s=>s.tc>=100},
  {id:'collector',name:'Collector',emoji:'📚',desc:'5+ habits',check:s=>s.th>=5},
  {id:'king',name:'Consistency King',emoji:'👑',desc:'50-day streak',check:s=>s.ms>=50},
]

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [habits, setHabits] = useState([])
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [emailVal, setEmailVal] = useState('')
  const [passVal, setPassVal] = useState('')
  const [view, setView] = useState('home')
  const [isPro, setIsPro] = useState(false)
  const [showPro, setShowPro] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [showRoutes, setShowRoutes] = useState(false)
  const [showLeader, setShowLeader] = useState(false)
  const [showFriends, setShowFriends] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showLang, setShowLang] = useState(false)
  const [showThemes, setShowThemes] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editHabit, setEditHabit] = useState(null)
  const [showMilestone, setShowMilestone] = useState(null)
  const [showOnboard, setShowOnboard] = useState(false)
  const [onboardStep, setOnboardStep] = useState(0)
  const [onboardData, setOnboardData] = useState({goals:[], consistency:''})
  const [showMoodCheck, setShowMoodCheck] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [lang, setLang] = useState('en')
  const [themeName, setThemeName] = useState('mint')
  const [steps, setSteps] = useState(0)
  const [water, setWater] = useState(0)
  const [mood, setMood] = useState(null)
  const [aiMsgs, setAiMsgs] = useState([])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [routes, setRoutes] = useState([])
  const [routeForm, setRouteForm] = useState({name:'',distance:'',duration:''})
  const [friends, setFriends] = useState([])
  const [friendEmail, setFriendEmail] = useState('')
  const [profile, setProfile] = useState({name:'',age:'',weight:'',height:'',goal:'',avatar:'😊'})
  const [targets, setTargets] = useState({steps:10000,water:8,sleep:8,calories:2000})
  const [newHabit, setNewHabit] = useState({name:'',emoji:'✨',color:'#10b981',category:'Health',reminder_time:'',week_plan:''})

  const T = LANGS[lang] || LANGS.en
  const C = THEMES[themeName] || THEMES.mint
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    supabase.auth.getSession().then(({data:{session}}) => {
      if (session) {
        setUser(session.user)
        loadHabits(session.user.id)
        loadLocal(session.user.id)
        if (!localStorage.getItem('onboarded_'+session.user.id)) setShowOnboard(true)
      }
      setLoading(false)
    })
    supabase.auth.onAuthStateChange((_,session) => {
      if (session) { setUser(session.user); loadHabits(session.user.id); loadLocal(session.user.id) }
      else { setUser(null); setHabits([]) }
    })
    const sl = localStorage.getItem('lang'); if (sl) setLang(sl)
    const sth = localStorage.getItem('theme'); if (sth) setThemeName(sth)
    const ss = localStorage.getItem('steps_'+today); if (ss) setSteps(parseInt(ss))
    const sw = localStorage.getItem('water_'+today); if (sw) setWater(parseInt(sw))
    const sm = localStorage.getItem('mood_'+today); if (sm) setMood(sm)
    const sr = localStorage.getItem('routes'); if (sr) setRoutes(JSON.parse(sr))
    const sf = localStorage.getItem('friends'); if (sf) setFriends(JSON.parse(sf))
    const st = localStorage.getItem('targets'); if (st) setTargets(JSON.parse(st))
  }, [])

  function loadLocal(uid) {
    const sp = localStorage.getItem('profile_'+uid); if (sp) setProfile(JSON.parse(sp))
  }

  async function loadHabits(uid) {
    const {data} = await supabase.from('habits').select('*').eq('user_id',uid).order('created_at')
    if (data) setHabits(data)
  }

  function changeTheme(t) {
    setThemeName(t)
    localStorage.setItem('theme',t)
    setShowThemes(false)
  }

  async function signInGoogle() { await supabase.auth.signInWithOAuth({provider:'google'}) }

  async function signInEmail() {
    if (authMode==='signup') {
      const {error} = await supabase.auth.signUp({email:emailVal,password:passVal})
      if (error) alert(error.message); else alert('Check your email!')
    } else {
      const {error} = await supabase.auth.signInWithPassword({email:emailVal,password:passVal})
      if (error) alert(error.message)
    }
  }

  async function signOut() { await supabase.auth.signOut() }

  async function addHabit() {
    if (!newHabit.name.trim()) return
    if (!isPro && habits.length >= 3) { setShowPro(true); return }
    const {data,error} = await supabase.from('habits').insert([{
      user_id:user.id, name:newHabit.name, emoji:newHabit.emoji, color:newHabit.color,
      category:newHabit.category, reminder_time:newHabit.reminder_time, week_plan:newHabit.week_plan,
      streak:0, completions:[]
    }]).select()
    if (error) { alert(error.message); return }
    if (data) {
      setHabits([...habits,...data])
      setNewHabit({name:'',emoji:'✨',color:'#10b981',category:'Health',reminder_time:'',week_plan:''})
      setShowAdd(false)
    }
  }

  async function completeHabit(habit) {
    const comps = habit.completions || []
    if (comps.includes(today)) return
    const newComps = [...comps, today]
    const newStreak = (habit.streak||0)+1
    await supabase.from('habits').update({completions:newComps,streak:newStreak}).eq('id',habit.id)
    setHabits(habits.map(h => h.id===habit.id ? {...h,completions:newComps,streak:newStreak} : h))
    setConfetti(true); setTimeout(()=>setConfetti(false),2200)
    if ([3,7,14,30,100].includes(newStreak)) setShowMilestone({habit,streak:newStreak})
  }

  async function deleteHabit(id) {
    if (!confirm('Delete this habit?')) return
    await supabase.from('habits').delete().eq('id',id)
    setHabits(habits.filter(h=>h.id!==id))
  }

  async function saveEditHabit() {
    await supabase.from('habits').update({
      name:editHabit.name, emoji:editHabit.emoji, color:editHabit.color,
      category:editHabit.category, reminder_time:editHabit.reminder_time
    }).eq('id',editHabit.id)
    setHabits(habits.map(h=>h.id===editHabit.id?editHabit:h))
    setShowEdit(false); setEditHabit(null)
  }

  function addSteps(n) { const s=steps+n; setSteps(s); localStorage.setItem('steps_'+today,s) }
  function addWater(n) { const w=Math.max(0,water+n); setWater(w); localStorage.setItem('water_'+today,w) }
  function saveMood(m) { setMood(m); localStorage.setItem('mood_'+today,m); setShowMoodCheck(false) }

  function addRoute() {
    if (!routeForm.name) return
    const dist = parseFloat(routeForm.distance)||0
    const dur = parseFloat(routeForm.duration)||0
    const r = {...routeForm,distance:dist,duration:dur,calories:Math.round(dist*60),id:Date.now()}
    const updated = [...routes,r]
    setRoutes(updated); localStorage.setItem('routes',JSON.stringify(updated))
    setRouteForm({name:'',distance:'',duration:''})
  }

  function saveProfile() {
    localStorage.setItem('profile_'+user.id,JSON.stringify(profile))
    localStorage.setItem('targets',JSON.stringify(targets))
    setShowProfile(false); alert('Saved!')
  }

  function inviteFriend() {
    if (!friendEmail) return
    const f = {email:friendEmail,status:'pending',id:Date.now()}
    const updated = [...friends,f]
    setFriends(updated); localStorage.setItem('friends',JSON.stringify(updated))
    window.open(`https://wa.me/?text=${encodeURIComponent('Join me on HabitFlow! https://thehabitflow.app')}`)
    setFriendEmail('')
  }

  async function sendAI() {
    if (!aiInput.trim()) return
    const msg = {role:'user',content:aiInput}
    const msgs = [...aiMsgs,msg]
    setAiMsgs(msgs); setAiInput(''); setAiLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,messages:msgs,
          system:`You are a friendly habit coach. User has ${habits.length} habits, ${tc} completions, ${ms} day max streak. Give short encouraging advice.`})
      })
      const d = await res.json()
      setAiMsgs([...msgs,{role:'assistant',content:d.content?.map(c=>c.text||'').join('\n')||'Try again!'}])
    } catch(e) {
      setAiMsgs([...msgs,{role:'assistant',content:'Connection error. Try again!'}])
    }
    setAiLoading(false)
  }

  // stats
  const tc = habits.reduce((s,h)=>s+(h.completions?.length||0),0)
  const ms = habits.reduce((m,h)=>Math.max(m,h.streak||0),0)
  const th = habits.length
  const xp = tc*10+ms*5
  const lvl = LEVELS.slice().reverse().find(l=>xp>=l.min)||LEVELS[0]
  const nextLvl = LEVELS.find(l=>l.min>xp)
  const lvlPct = nextLvl ? ((xp-lvl.min)/(nextLvl.min-lvl.min))*100 : 100
  const doneToday = habits.filter(h=>h.completions?.includes(today)).length
  const todayPct = habits.length > 0 ? (doneToday/habits.length)*100 : 0
  const earned = BADGES.filter(b=>b.check({tc,ms,th}))
  const waterPct = Math.min((water/targets.water)*100,100)
  const stepsPct = Math.min((steps/targets.steps)*100,100)

  // Styles helpers
  const card = {background:C.card,borderRadius:20,boxShadow:C.cardShadow,border:`1px solid ${C.border}`,transition:'all .25s'}
  const inp = {width:'100%',padding:'12px 14px',background:C.input,border:`1.5px solid ${C.border}`,borderRadius:14,fontSize:15,color:C.text,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}

  const Modal = ({onClose,children,maxW=430}) => (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:300,padding:16,backdropFilter:'blur(6px)'}}>
      <div onClick={e=>e.stopPropagation()} style={{...card,padding:24,width:'100%',maxWidth:maxW,maxHeight:'92vh',overflowY:'auto'}}>
        {children}
      </div>
    </div>
  )

  const Btn = ({onClick,style={},children,disabled=false}) => (
    <button onClick={onClick} disabled={disabled} style={{cursor:disabled?'default':'pointer',fontWeight:700,border:'none',fontFamily:'inherit',transition:'all .2s',...style}}>{children}</button>
  )

  const css = `
    @keyframes confettiFall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
    @keyframes slideUp{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
    @keyframes pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.1);opacity:.9}}
    .su{animation:slideUp .45s ease-out}
    .float{animation:float 3s ease-in-out infinite}
    .pulse-blob{animation:pulse 4s ease-in-out infinite}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-thumb{background:${C.border};border-radius:10px}
    input,textarea{color:${C.text}!important}
    input::placeholder{color:${C.textMt}!important}
  `

  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:C.bg,fontFamily:'system-ui,sans-serif',color:C.text}}>
      <style>{css}</style>
      <div className="float" style={{fontSize:52}}>🌱</div>
    </div>
  )

  // ============ LANDING PAGE ============
  if (!user) return (
    <div style={{minHeight:'100vh',background:C.bg,fontFamily:'system-ui,sans-serif',color:C.text}}>
      <style>{css}</style>
      <div style={{position:'fixed',top:'6%',left:'2%',width:340,height:340,borderRadius:'50%',background:`radial-gradient(circle,${C.a1}22 0%,transparent 70%)`,pointerEvents:'none'}} className="pulse-blob"/>
      <div style={{position:'fixed',bottom:'8%',right:'2%',width:440,height:440,borderRadius:'50%',background:`radial-gradient(circle,${C.a3}18 0%,transparent 70%)`,pointerEvents:'none'}} className="pulse-blob"/>
      <div style={{position:'relative',zIndex:1,maxWidth:1100,margin:'0 auto',padding:'0 20px'}}>
        {/* NAV */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'22px 0'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:40,height:40,borderRadius:12,background:C.btnGrad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>✨</div>
            <span style={{fontSize:22,fontWeight:900,color:C.a1}}>HabitFlow</span>
          </div>
          <div style={{display:'flex',gap:10}}>
            <Btn onClick={()=>setShowThemes(true)} style={{background:C.card,border:`1.5px solid ${C.border}`,color:C.a1,padding:'9px 16px',borderRadius:12,fontSize:13}}>🎨 {C.name}</Btn>
            <Btn onClick={()=>{setShowAuth(true);setAuthMode('login')}} style={{background:C.btnGrad,color:'white',padding:'9px 20px',borderRadius:12,fontSize:13}}>Sign In</Btn>
          </div>
        </div>
        {/* HERO */}
        <div style={{textAlign:'center',padding:'50px 16px 40px'}} className="su">
          <div className="float" style={{fontSize:80,marginBottom:18}}>🌱</div>
          <h1 style={{fontSize:'clamp(32px,6vw,60px)',fontWeight:900,lineHeight:1.1,marginBottom:18,color:C.text}}>
            Build habits that<br/><span style={{background:C.btnGrad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}> change your life</span>
          </h1>
          <p style={{fontSize:18,color:C.textLt,maxWidth:560,margin:'0 auto 36px',lineHeight:1.65}}>
            Track habits, build streaks, and level up your life. Join thousands transforming themselves daily.
          </p>
          <Btn onClick={()=>{setShowAuth(true);setAuthMode('signup')}} style={{background:C.btnGrad,color:'white',padding:'17px 42px',borderRadius:16,fontSize:18,boxShadow:C.shadow}}>Start Free →</Btn>
          <p style={{marginTop:14,color:C.textMt,fontSize:13}}>Free forever · No credit card needed</p>
        </div>
        {/* FEATURES */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:18,padding:'20px 0 60px'}}>
          {[
            {icon:'🎯',t:'Track Habits',d:'Build routines that actually stick'},
            {icon:'🔥',t:'Streaks & XP',d:'Level up with every completion'},
            {icon:'🏆',t:'Achievements',d:'Earn badges as you grow'},
            {icon:'🤖',t:'AI Coach',d:'Personalized advice 24/7'},
            {icon:'🗺️',t:'Route Planner',d:'Plan walks, runs & rides'},
            {icon:'📊',t:'Analytics',d:'Beautiful progress insights'},
          ].map((f,i)=>(
            <div key={i} style={{...card,padding:26}}>
              <div style={{fontSize:36,marginBottom:10}}>{f.icon}</div>
              <h3 style={{fontSize:17,fontWeight:800,marginBottom:6,color:C.text}}>{f.t}</h3>
              <p style={{color:C.textLt,lineHeight:1.6,fontSize:14}}>{f.d}</p>
            </div>
          ))}
        </div>
        {/* PRICING */}
        <div style={{...card,padding:40,marginBottom:60,textAlign:'center'}}>
          <h2 style={{fontSize:28,fontWeight:900,marginBottom:10,color:C.text}}>Go Pro for $1.99/mo</h2>
          <p style={{color:C.textLt,marginBottom:22}}>Unlimited habits · AI coach · Analytics · Leaderboard</p>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',justifyContent:'center'}}>
            {['♾️ Unlimited habits','🤖 AI Coach','📊 Analytics','🏆 Leaderboard'].map(f=>(
              <span key={f} style={{background:C.tagBg,padding:'8px 16px',borderRadius:100,color:C.tagTxt,fontWeight:700,fontSize:13}}>{f}</span>
            ))}
          </div>
        </div>
        <div style={{textAlign:'center',padding:'30px 0',color:C.textMt,fontSize:13,borderTop:`1px solid ${C.border}`}}>
          <p>© 2025 HabitFlow · Built with 💚 · <a href="mailto:contact@thehabitflow.app" style={{color:C.a1}}>contact@thehabitflow.app</a></p>
        </div>
      </div>

      {showAuth && (
        <Modal onClose={()=>setShowAuth(false)}>
          <h2 style={{fontSize:22,fontWeight:900,marginBottom:22,color:C.text,textAlign:'center'}}>{authMode==='signup'?'Create Account':'Welcome Back'}</h2>
          <Btn onClick={signInGoogle} style={{...card,width:'100%',padding:14,fontSize:15,color:C.text,display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:14,boxSizing:'border-box'}}>
            <span style={{fontSize:20}}>🔵</span> Continue with Google
          </Btn>
          <div style={{textAlign:'center',color:C.textMt,margin:'12px 0',fontSize:12}}>OR</div>
          <input type="email" placeholder="Email" value={emailVal} onChange={e=>setEmailVal(e.target.value)} style={{...inp,marginBottom:10}}/>
          <input type="password" placeholder="Password" value={passVal} onChange={e=>setPassVal(e.target.value)} style={{...inp,marginBottom:14}}/>
          <Btn onClick={signInEmail} style={{width:'100%',padding:14,background:C.btnGrad,color:'white',borderRadius:12,fontSize:15,marginBottom:10,boxSizing:'border-box'}}>{authMode==='signup'?'Sign Up':'Sign In'}</Btn>
          <Btn onClick={()=>setAuthMode(authMode==='signup'?'login':'signup')} style={{width:'100%',padding:8,background:'transparent',color:C.a1,fontSize:14}}>
            {authMode==='signup'?'Already have an account? Sign in':"Don't have an account? Sign up"}
          </Btn>
        </Modal>
      )}

      {showThemes && (
        <Modal onClose={()=>setShowThemes(false)}>
          <h2 style={{fontSize:20,fontWeight:900,marginBottom:6,color:C.text}}>🎨 Choose Theme</h2>
          <p style={{fontSize:13,color:C.textMt,marginBottom:18}}>6 beautiful themes to match your vibe</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {Object.entries(THEMES).map(([key,th])=>(
              <Btn key={key} onClick={()=>changeTheme(key)} style={{padding:0,background:'transparent',borderRadius:18,border:`2.5px solid ${themeName===key?C.a1:'transparent'}`,overflow:'hidden',position:'relative'}}>
                <div style={{background:th.bg,padding:12,height:90,display:'flex',flexDirection:'column',gap:6}}>
                  <div style={{display:'flex',gap:5}}>
                    <div style={{width:10,height:10,borderRadius:'50%',background:th.a1}}/>
                    <div style={{width:10,height:10,borderRadius:'50%',background:th.a2}}/>
                    <div style={{width:10,height:10,borderRadius:'50%',background:th.a3}}/>
                  </div>
                  <div style={{height:6,borderRadius:999,background:th.btnGrad,width:'100%'}}/>
                  <div style={{height:6,borderRadius:999,background:th.a1+'55',width:'70%'}}/>
                  <div style={{height:6,borderRadius:999,background:th.a2+'44',width:'85%'}}/>
                </div>
                <div style={{background:th.card,padding:'6px 8px',textAlign:'center',fontSize:11,fontWeight:800,color:th.text}}>{th.emoji} {th.name}</div>
                {themeName===key && <div style={{position:'absolute',top:6,right:6,width:18,height:18,borderRadius:'50%',background:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11}}>✓</div>}
              </Btn>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )

  // ============ MAIN APP ============
  return (
    <div style={{minHeight:'100vh',background:C.bg,fontFamily:'system-ui,sans-serif',color:C.text,paddingBottom:88}}>
      <style>{css}</style>

      {/* CONFETTI */}
      {confetti && (
        <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:999}}>
          {Array.from({length:32}).map((_,i)=>(
            <div key={i} style={{position:'absolute',left:Math.random()*100+'%',top:'-12px',width:10,height:10,
              background:[C.a1,C.a2,C.a3,C.a4,C.a5,'#eab308'][i%6],
              borderRadius:Math.random()>.5?'50%':'2px',
              animation:`confettiFall ${1+Math.random()*2}s linear ${Math.random()*.5}s forwards`}}/>
          ))}
        </div>
      )}

      {/* HEADER */}
      <div style={{background:C.headerBg,padding:'14px 20px',borderBottom:`1px solid ${C.border}`,position:'sticky',top:0,zIndex:100,backdropFilter:'blur(12px)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',maxWidth:800,margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:C.btnGrad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>✨</div>
            <div>
              <div style={{fontSize:10,color:C.textMt,fontWeight:700,letterSpacing:1,textTransform:'uppercase'}}>HABITFLOW</div>
              <div style={{fontSize:15,fontWeight:900,color:C.a1}}>🌊 HabitFlow Pro</div>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <Btn onClick={()=>setShowThemes(true)} style={{background:C.card,border:`1.5px solid ${C.border}`,color:C.a1,padding:'7px 12px',borderRadius:11,fontSize:12,fontWeight:800}}>🎨 Theme</Btn>
            <Btn onClick={()=>setShowProfile(true)} style={{width:36,height:36,borderRadius:11,background:C.tagBg,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>{profile.avatar||'😊'}</Btn>
          </div>
        </div>
      </div>

      <div style={{maxWidth:800,margin:'0 auto',padding:'18px 16px'}}>

        {/* ======= HOME ======= */}
        {view==='home' && (
          <div className="su">
            {/* GREETING */}
            <div style={{marginBottom:18}}>
              <div style={{fontSize:22,fontWeight:900,color:C.text}}>{T.hi}, {profile.name||user.email?.split('@')[0]}! 👋</div>
              <div style={{fontSize:13,color:C.textMt,fontWeight:600,marginTop:2}}>{new Date().toLocaleDateString('en',{weekday:'long',month:'long',day:'numeric'})} · Let's build those habits!</div>
            </div>

            {/* HERO ROW: Ring + Level */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
              {/* Ring */}
              <div style={{...card,padding:18,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                <div style={{position:'relative',width:110,height:110}}>
                  <svg viewBox="0 0 110 110" style={{width:'100%',height:'100%',transform:'rotate(-90deg)'}}>
                    <circle cx="55" cy="55" r="44" fill="none" stroke={C.ringBg} strokeWidth="10"/>
                    <circle cx="55" cy="55" r="44" fill="none" stroke={C.a1} strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={`${todayPct*2.765} 276.5`} style={{transition:'stroke-dasharray .7s ease'}}/>
                  </svg>
                  <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                    <div style={{fontSize:22,fontWeight:900,color:C.text,lineHeight:1}}>{Math.round(todayPct)}%</div>
                    <div style={{fontSize:9,fontWeight:800,color:C.textMt,letterSpacing:.5,textTransform:'uppercase'}}>done</div>
                  </div>
                </div>
                <div style={{fontSize:10,fontWeight:800,color:C.textMt,letterSpacing:.5,textTransform:'uppercase'}}>Today</div>
                <div style={{fontSize:12,color:C.textMt,fontWeight:700}}>{doneToday}/{habits.length} habits</div>
              </div>
              {/* Level */}
              <div style={{background:C.btnGrad,borderRadius:20,padding:18,boxShadow:C.shadow,display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                <div>
                  <div style={{fontSize:10,fontWeight:800,color:'rgba(255,255,255,.7)',letterSpacing:1,textTransform:'uppercase'}}>LEVEL</div>
                  <div style={{fontSize:28,fontWeight:900,color:'white',lineHeight:1.1}}>{lvl.emoji} {lvl.name}</div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,.8)',fontWeight:700,marginTop:4}}>⚡ {xp} XP</div>
                </div>
                <div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.75)',fontWeight:700}}>🔥 {ms} best streak</div>
                  <div style={{background:'rgba(255,255,255,.2)',borderRadius:8,padding:'4px 10px',fontSize:11,fontWeight:800,color:'white',display:'inline-block',marginTop:8}}>{earned.length} badges earned</div>
                </div>
              </div>
            </div>

            {/* STATS ROW: Kcal, Water, Mood, Sleep */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:14}}>
              {[
                {icon:'🔥',val:`${Math.round(steps*0.04)}`,lbl:'kcal'},
                {icon:'💧',val:`${water}`,lbl:'cups'},
                {icon:'😊',val:mood||'—',lbl:'Mood'},
                {icon:'😴',val:'7.5h',lbl:'Sleep'},
              ].map((s,i)=>(
                <div key={i} style={{...card,padding:'12px 8px',textAlign:'center',cursor:'pointer'}}
                  onClick={i===1?()=>addWater(1):i===2?()=>setShowMoodCheck(true):undefined}>
                  <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
                  <div style={{fontSize:15,fontWeight:900,color:C.text}}>{s.val}</div>
                  <div style={{fontSize:9,color:C.textMt,fontWeight:700,textTransform:'uppercase',letterSpacing:.3}}>{s.lbl}</div>
                </div>
              ))}
            </div>

            {/* STEPS */}
            <div style={{...card,padding:'16px 18px',marginBottom:14}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:40,height:40,borderRadius:14,background:C.tagBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🦶</div>
                  <div>
                    <div style={{fontSize:10,color:C.textMt,fontWeight:700,textTransform:'uppercase',letterSpacing:.5}}>STEPS</div>
                    <div style={{fontSize:28,fontWeight:900,color:C.text,lineHeight:1}}>{steps.toLocaleString()}</div>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:12,color:C.textMt,fontWeight:700}}>/ {targets.steps.toLocaleString()}</div>
                  <div style={{fontSize:12,color:C.a1,fontWeight:800,marginTop:2}}>{Math.round(stepsPct)}%</div>
                </div>
              </div>
              <div style={{height:8,borderRadius:999,background:C.progBg,overflow:'hidden',marginBottom:12}}>
                <div style={{width:`${stepsPct}%`,height:'100%',background:C.btnGrad,borderRadius:999,transition:'width 1.2s ease'}}/>
              </div>
              <div style={{display:'flex',gap:8}}>
                {[500,1000,5000].map(n=>(
                  <Btn key={n} onClick={()=>addSteps(n)} style={{flex:1,padding:9,background:C.tagBg,color:C.tagTxt,borderRadius:10,fontSize:13}}>+{n>=1000?n/1000+'k':n}</Btn>
                ))}
                <Btn onClick={()=>{setSteps(0);localStorage.removeItem('steps_'+today)}} style={{flex:1,padding:9,background:C.isDark?'rgba(239,68,68,.2)':'#fee2e2',color:'#ef4444',borderRadius:10,fontSize:12}}>Reset</Btn>
              </div>
            </div>

            {/* WATER TRACKER */}
            <div style={{...card,padding:'16px 18px',marginBottom:14}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{fontSize:26}}>💧</div>
                  <div>
                    <div style={{fontSize:10,color:C.textMt,fontWeight:700,textTransform:'uppercase',letterSpacing:.5}}>WATER</div>
                    <div style={{fontSize:24,fontWeight:900,color:C.text}}>{water} <span style={{fontSize:13,color:C.textMt}}>/ {targets.water} cups</span></div>
                  </div>
                </div>
                <div style={{fontSize:14,color:C.a1,fontWeight:800}}>{Math.round(waterPct)}%</div>
              </div>
              <div style={{display:'flex',gap:5,marginBottom:10}}>
                {Array.from({length:targets.water}).map((_,i)=>(
                  <div key={i} onClick={()=>setWater(i+1)} style={{flex:1,height:28,borderRadius:8,background:i<water?C.a3:C.progBg,cursor:'pointer',transition:'all .2s'}}/>
                ))}
              </div>
              <div style={{display:'flex',gap:8}}>
                <Btn onClick={()=>addWater(1)} style={{flex:2,padding:9,background:C.tagBg,color:C.tagTxt,borderRadius:10,fontSize:13}}>+ Add Cup</Btn>
                <Btn onClick={()=>addWater(-1)} style={{flex:1,padding:9,background:C.progBg,color:C.textLt,borderRadius:10,fontSize:13}}>−</Btn>
              </div>
            </div>

            {/* STREAK */}
            <div style={{background:C.streakGrad,borderRadius:20,padding:'16px 18px',marginBottom:14,display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:C.shadow}}>
              <div>
                <div style={{fontSize:42,fontWeight:900,color:'white',lineHeight:1}}>{ms}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,.85)',fontWeight:700}}>Day Streak 🔥</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.6)',marginTop:3}}>Best: {ms} days</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:40}}>🏆</div>
                <div style={{background:'rgba(255,255,255,.2)',borderRadius:10,padding:'5px 12px',fontSize:12,fontWeight:800,color:'white',marginTop:8}}>+{ms*10} pts today</div>
              </div>
            </div>

            {/* LEVEL PROGRESS BAR */}
            {nextLvl && (
              <div style={{...card,padding:16,marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:12}}>
                  <span style={{fontWeight:700,color:C.textLt}}>Level · {lvl.name}</span>
                  <span style={{fontWeight:700,color:C.a1}}>{nextLvl.min-xp} XP → {nextLvl.name}</span>
                </div>
                <div style={{background:C.progBg,height:10,borderRadius:5,overflow:'hidden'}}>
                  <div style={{width:`${lvlPct}%`,height:'100%',background:C.btnGrad,borderRadius:5,transition:'width .6s'}}/>
                </div>
              </div>
            )}

            {/* QUICK ACTIONS */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:22}}>
              {[
                {icon:'🤖',label:'AI Coach',fn:()=>setShowAI(true)},
                {icon:'🗺️',label:'Routes',fn:()=>setShowRoutes(true)},
                {icon:'🏆',label:'Leaders',fn:()=>setShowLeader(true)},
                {icon:'👥',label:'Friends',fn:()=>setShowFriends(true)},
              ].map((q,i)=>(
                <Btn key={i} onClick={q.fn} style={{...card,padding:'14px 4px',display:'flex',flexDirection:'column',alignItems:'center',gap:4,fontSize:11,color:C.text,fontWeight:700}}>
                  <span style={{fontSize:26}}>{q.icon}</span>{q.label}
                </Btn>
              ))}
            </div>

            {/* HABITS */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <h2 style={{fontSize:18,fontWeight:900,color:C.text}}>My {T.hab}</h2>
              <div style={{display:'flex',gap:8}}>
                <Btn onClick={()=>setShowTemplates(true)} style={{background:C.tagBg,color:C.tagTxt,padding:'7px 13px',borderRadius:10,fontSize:12}}>📋 Templates</Btn>
                <Btn onClick={()=>setShowAdd(true)} style={{background:C.btnGrad,color:'white',padding:'7px 13px',borderRadius:10,fontSize:12}}>+ {T.add}</Btn>
              </div>
            </div>

            {habits.length===0 ? (
              <div style={{...card,padding:40,textAlign:'center'}}>
                <div style={{fontSize:52,marginBottom:14}}>🌱</div>
                <h3 style={{fontSize:17,fontWeight:800,marginBottom:8,color:C.text}}>Start your first habit!</h3>
                <p style={{color:C.textLt,marginBottom:20,fontSize:14}}>Choose from templates or create your own</p>
                <Btn onClick={()=>setShowTemplates(true)} style={{background:C.btnGrad,color:'white',padding:'12px 28px',borderRadius:12,fontSize:14}}>Browse Templates 🎯</Btn>
              </div>
            ) : (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
                {habits.map(h=>{
                  const done = h.completions?.includes(today)
                  const pct = Math.min(((h.streak||0)/30)*100,100)
                  return (
                    <div key={h.id} style={{...card,padding:14,border:done?`1.5px solid ${C.a1}`:undefined,background:done?C.card2:C.card}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                        <div style={{fontSize:22}}>{h.emoji}</div>
                        <Btn onClick={()=>{setEditHabit(h);setShowEdit(true)}} style={{background:'none',fontSize:14,color:C.textMt,padding:2}}>✏️</Btn>
                      </div>
                      <div style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:3}}>{h.name}</div>
                      <div style={{fontSize:11,color:C.a4,fontWeight:700,marginBottom:8}}>🔥 {h.streak||0} day streak</div>
                      <div style={{display:'flex',gap:6,alignItems:'center'}}>
                        <Btn onClick={()=>completeHabit(h)} disabled={done}
                          style={{flex:1,padding:'8px 4px',background:done?C.a1:C.btnGrad,color:'white',borderRadius:10,fontSize:12,fontWeight:800,opacity:done?.9:1}}>
                          {done?'✓ Done':'+ Log'}
                        </Btn>
                      </div>
                      <div style={{height:5,borderRadius:999,background:C.progBg,overflow:'hidden',marginTop:8}}>
                        <div style={{width:`${pct}%`,height:'100%',background:h.color||C.a1,borderRadius:999}}/>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* WEEKLY CHART */}
            {habits.length > 0 && (
              <div style={{...card,padding:18,marginBottom:14}}>
                <div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:14}}>This Week</div>
                <div style={{display:'flex',gap:8,alignItems:'flex-end',height:80,marginBottom:10}}>
                  {['M','T','W','T','F','S','S'].map((d,i)=>{
                    const dt=new Date(); dt.setDate(dt.getDate()-(6-i))
                    const ds=dt.toISOString().split('T')[0]
                    const cnt=habits.filter(h=>h.completions?.includes(ds)).length
                    const h=habits.length>0?(cnt/habits.length)*100:0
                    const isToday=ds===today
                    return (
                      <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,height:'100%',justifyContent:'flex-end'}}>
                        <div style={{width:'100%',borderRadius:'6px 6px 0 0',minHeight:4,background:isToday?C.btnGrad:C.a1+'55',height:`${Math.max(h,4)}%`,transition:'height 1s ease'}}/>
                        <div style={{fontSize:10,fontWeight:800,color:isToday?C.a1:C.textMt,textTransform:'uppercase'}}>{d}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* PRO BANNER */}
            {!isPro && habits.length>=2 && (
              <div style={{background:C.isDark?'linear-gradient(135deg,#7c3aed,#2563eb)':'linear-gradient(135deg,#06b6d4,#8b5cf6)',borderRadius:20,padding:22,textAlign:'center',color:'white',marginBottom:14}}>
                <div style={{fontSize:28,marginBottom:8}}>⭐</div>
                <h3 style={{fontSize:16,fontWeight:800,marginBottom:4}}>Unlock Pro</h3>
                <p style={{fontSize:13,opacity:.9,marginBottom:14}}>Unlimited habits, AI coach, analytics & more for $1.99/mo</p>
                <Btn onClick={()=>setShowPro(true)} style={{background:'white',color:'#7c3aed',padding:'10px 26px',borderRadius:10,fontSize:14}}>Upgrade Now ⚡</Btn>
              </div>
            )}
          </div>
        )}

        {/* ======= BADGES ======= */}
        {view==='badges' && (
          <div className="su">
            <h2 style={{fontSize:22,fontWeight:900,marginBottom:16,color:C.text}}>🏆 Achievements</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:12}}>
              {BADGES.map(b=>{
                const got=earned.find(e=>e.id===b.id)
                return (
                  <div key={b.id} style={{...card,padding:18,textAlign:'center',opacity:got?1:.4}}>
                    <div style={{fontSize:42,marginBottom:8,filter:got?'none':'grayscale(1)'}}>{b.emoji}</div>
                    <div style={{fontSize:13,fontWeight:800,color:C.text}}>{b.name}</div>
                    <div style={{fontSize:11,color:C.textMt,marginTop:4}}>{b.desc}</div>
                    {got && <div style={{marginTop:6,fontSize:11,color:C.a1,fontWeight:700}}>✓ Earned</div>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ======= ANALYTICS ======= */}
        {view==='analytics' && (
          <div className="su">
            <h2 style={{fontSize:22,fontWeight:900,marginBottom:16,color:C.text}}>📊 Analytics</h2>
            {!isPro ? (
              <div style={{...card,padding:36,textAlign:'center'}}>
                <div style={{fontSize:52,marginBottom:14}}>🔒</div>
                <h3 style={{fontSize:20,fontWeight:800,marginBottom:8,color:C.text}}>Pro Feature</h3>
                <p style={{color:C.textLt,marginBottom:20}}>Unlock detailed analytics with Pro</p>
                <Btn onClick={()=>setShowPro(true)} style={{background:C.btnGrad,color:'white',padding:'12px 28px',borderRadius:12,fontSize:15}}>Upgrade to Pro</Btn>
              </div>
            ) : (
              <>
                <div style={{...card,padding:22,marginBottom:12}}>
                  <h3 style={{fontSize:15,fontWeight:700,marginBottom:16,color:C.text}}>Habit Completion This Week</h3>
                  <div style={{display:'flex',gap:8,justifyContent:'space-between',alignItems:'flex-end',height:130}}>
                    {['M','T','W','T','F','S','S'].map((d,i)=>{
                      const dt=new Date(); dt.setDate(dt.getDate()-(6-i))
                      const ds=dt.toISOString().split('T')[0]
                      const cnt=habits.filter(h=>h.completions?.includes(ds)).length
                      const h=habits.length>0?(cnt/habits.length)*100:0
                      return (
                        <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                          <div style={{width:'75%',background:ds===today?C.btnGrad:C.a1+'66',borderRadius:'6px 6px 0 0',minHeight:4,height:`${Math.max(h,4)}%`,transition:'height .4s'}}/>
                          <div style={{fontSize:11,fontWeight:700,color:C.textMt}}>{d}</div>
                          <div style={{fontSize:10,color:C.textMt}}>{cnt}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                  <div style={{...card,padding:20}}>
                    <div style={{fontSize:12,color:C.textMt,marginBottom:4}}>Total Completions</div>
                    <div style={{fontSize:36,fontWeight:900,color:C.text}}>{tc}</div>
                  </div>
                  <div style={{...card,padding:20}}>
                    <div style={{fontSize:12,color:C.textMt,marginBottom:4}}>Best Streak</div>
                    <div style={{fontSize:36,fontWeight:900,color:C.text}}>{ms}🔥</div>
                  </div>
                </div>
                <div style={{...card,padding:20}}>
                  <h3 style={{fontSize:15,fontWeight:700,marginBottom:12,color:C.text}}>Goals Progress</h3>
                  {[
                    {name:'Daily Steps',val:stepsPct,color:C.a1},
                    {name:'Water Intake',val:waterPct,color:C.a3},
                    {name:'Habits Done',val:todayPct,color:C.a5},
                  ].map(g=>(
                    <div key={g.name} style={{marginBottom:14}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:13}}>
                        <span style={{fontWeight:700,color:C.text}}>{g.name}</span>
                        <span style={{fontWeight:900,color:g.color}}>{Math.round(g.val)}%</span>
                      </div>
                      <div style={{height:10,borderRadius:999,background:C.progBg,overflow:'hidden'}}>
                        <div style={{width:`${g.val}%`,height:'100%',background:g.color,borderRadius:999,transition:'width 1.4s ease'}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ======= SETTINGS ======= */}
        {view==='settings' && (
          <div className="su">
            <h2 style={{fontSize:22,fontWeight:900,marginBottom:16,color:C.text}}>{T.set}</h2>
            <div style={{...card,padding:4,marginBottom:14}}>
              {[
                {icon:'👤',label:'Profile & Targets',fn:()=>setShowProfile(true),right:'›'},
                {icon:'🎨',label:'Theme · '+C.name,fn:()=>setShowThemes(true),right:C.emoji+' ›'},
                {icon:'🌐',label:'Language',fn:()=>setShowLang(true),right:lang.toUpperCase()+' ›'},
                {icon:'⭐',label:isPro?'Pro Active':'Upgrade to Pro',fn:()=>!isPro&&setShowPro(true),right:isPro?'✓':'›'},
                {icon:'🚪',label:'Sign Out',fn:signOut,right:'›',red:true},
              ].map((item,i,arr)=>(
                <Btn key={i} onClick={item.fn} style={{width:'100%',padding:16,background:'transparent',borderRadius:0,borderBottom:i<arr.length-1?`1px solid ${C.border}`:'none',display:'flex',justifyContent:'space-between',alignItems:'center',color:item.red?'#ef4444':C.text,fontSize:15,fontWeight:600,boxSizing:'border-box'}}>
                  <span>{item.icon} {item.label}</span>
                  <span style={{color:C.textMt,fontSize:13}}>{item.right}</span>
                </Btn>
              ))}
            </div>
            <div style={{textAlign:'center',color:C.textMt,fontSize:12,padding:'10px 0'}}>
              HabitFlow v2.0 · Made with 💚<br/>
              <a href="mailto:contact@thehabitflow.app" style={{color:C.a1}}>contact@thehabitflow.app</a>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,background:C.navBg,borderTop:`1px solid ${C.border}`,zIndex:100,backdropFilter:'blur(16px)'}}>
        <div style={{maxWidth:800,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)'}}>
          {[
            {id:'home',icon:'🏠',label:'Home'},
            {id:'badges',icon:'🏆',label:'Badges'},
            {id:'analytics',icon:'📊',label:'Stats'},
            {id:'settings',icon:'⚙️',label:'Settings'},
          ].map(n=>(
            <Btn key={n.id} onClick={()=>setView(n.id)} style={{padding:'10px 4px 8px',background:'transparent',display:'flex',flexDirection:'column',alignItems:'center',gap:2,fontSize:11,color:view===n.id?C.a1:C.textMt,fontWeight:view===n.id?700:500}}>
              <span style={{fontSize:22}}>{n.icon}</span>{n.label}
              {view===n.id && <div style={{width:18,height:3,borderRadius:3,background:C.a1,marginTop:1}}/>}
            </Btn>
          ))}
        </div>
      </div>

      {/* ===== THEME PICKER ===== */}
      {showThemes && (
        <Modal onClose={()=>setShowThemes(false)}>
          <h2 style={{fontSize:20,fontWeight:900,marginBottom:6,color:C.text}}>🎨 Choose Theme</h2>
          <p style={{fontSize:13,color:C.textMt,marginBottom:18}}>6 beautiful themes to match your vibe</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {Object.entries(THEMES).map(([key,th])=>(
              <Btn key={key} onClick={()=>changeTheme(key)} style={{padding:0,background:'transparent',borderRadius:18,border:`2.5px solid ${themeName===key?C.a1:'transparent'}`,overflow:'hidden',position:'relative'}}>
                <div style={{background:th.bg,padding:12,height:90,display:'flex',flexDirection:'column',gap:6}}>
                  <div style={{display:'flex',gap:5}}>
                    <div style={{width:10,height:10,borderRadius:'50%',background:th.a1}}/>
                    <div style={{width:10,height:10,borderRadius:'50%',background:th.a2}}/>
                    <div style={{width:10,height:10,borderRadius:'50%',background:th.a3}}/>
                  </div>
                  <div style={{height:7,borderRadius:999,background:th.btnGrad}}/>
                  <div style={{height:6,borderRadius:999,background:th.a1+'55',width:'70%'}}/>
                  <div style={{height:6,borderRadius:999,background:th.a2+'44',width:'85%'}}/>
                </div>
                <div style={{background:th.card,padding:'6px 8px',textAlign:'center',fontSize:11,fontWeight:800,color:th.text}}>{th.emoji} {th.name}</div>
                {themeName===key && <div style={{position:'absolute',top:6,right:6,width:18,height:18,borderRadius:'50%',background:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11}}>✓</div>}
              </Btn>
            ))}
          </div>
          <Btn onClick={()=>setShowThemes(false)} style={{width:'100%',padding:13,background:C.tagBg,color:C.tagTxt,borderRadius:12,marginTop:16,fontSize:14}}>Done ✓</Btn>
        </Modal>
      )}

      {/* MOOD CHECK-IN */}
      {showMoodCheck && (
        <Modal onClose={()=>setShowMoodCheck(false)}>
          <h2 style={{fontSize:20,fontWeight:900,marginBottom:8,color:C.text}}>😊 How are you feeling?</h2>
          <p style={{fontSize:13,color:C.textMt,marginBottom:20}}>Daily mood check-in tracks how habits affect your wellbeing</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10}}>
            {['😴','😐','🙂','😊','🔥'].map(m=>(
              <Btn key={m} onClick={()=>saveMood(m)} style={{padding:16,background:mood===m?C.tagBg:C.progBg,borderRadius:14,fontSize:28,border:`2px solid ${mood===m?C.a1:'transparent'}`}}>{m}</Btn>
            ))}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:8,fontSize:11,color:C.textMt,fontWeight:600}}>
            <span>Tired</span><span>Okay</span><span>Good</span><span>Great</span><span>On fire!</span>
          </div>
        </Modal>
      )}

      {/* ADD HABIT */}
      {showAdd && (
        <Modal onClose={()=>setShowAdd(false)}>
          <h2 style={{fontSize:20,fontWeight:900,marginBottom:18,color:C.text}}>New Habit</h2>
          <input placeholder="Habit name" value={newHabit.name} onChange={e=>setNewHabit({...newHabit,name:e.target.value})} style={{...inp,marginBottom:12}}/>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,marginBottom:8,color:C.textMt}}>Emoji</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {['💧','💪','🧘','📚','🏃','😴','🍎','📝','🎯','✨','🌱','🔥'].map(e=>(
                <Btn key={e} onClick={()=>setNewHabit({...newHabit,emoji:e})} style={{width:40,height:40,borderRadius:10,border:`2px solid ${newHabit.emoji===e?C.a1:C.border}`,background:newHabit.emoji===e?C.tagBg:C.bg2,fontSize:20,padding:0}}>{e}</Btn>
              ))}
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,marginBottom:8,color:C.textMt}}>Color</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {['#10b981','#06b6d4','#8b5cf6','#f97316','#ec4899','#eab308','#84cc16','#3b82f6','#ef4444'].map(col=>(
                <Btn key={col} onClick={()=>setNewHabit({...newHabit,color:col})} style={{width:36,height:36,borderRadius:10,border:newHabit.color===col?'3px solid white':'none',background:col,padding:0,boxShadow:newHabit.color===col?`0 0 0 2px ${col}`:'none'}}/>
              ))}
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,marginBottom:8,color:C.textMt}}>Category</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {CATS.map(cat=>(
                <Btn key={cat.name} onClick={()=>setNewHabit({...newHabit,category:cat.name})} style={{padding:'8px 14px',borderRadius:10,border:`2px solid ${newHabit.category===cat.name?cat.color:C.border}`,background:newHabit.category===cat.name?cat.color+'22':C.bg2,fontSize:13,color:C.text}}>{cat.emoji} {cat.name}</Btn>
              ))}
            </div>
          </div>
          <input type="time" value={newHabit.reminder_time} onChange={e=>setNewHabit({...newHabit,reminder_time:e.target.value})} style={{...inp,marginBottom:14}}/>
          <div style={{display:'flex',gap:10}}>
            <Btn onClick={()=>setShowAdd(false)} style={{flex:1,padding:13,background:C.progBg,color:C.textLt,borderRadius:12}}>Cancel</Btn>
            <Btn onClick={addHabit} style={{flex:2,padding:13,background:C.btnGrad,color:'white',borderRadius:12,fontSize:15}}>Create Habit ✨</Btn>
          </div>
        </Modal>
      )}

      {/* EDIT HABIT */}
      {showEdit && editHabit && (
        <Modal onClose={()=>setShowEdit(false)}>
          <h2 style={{fontSize:20,fontWeight:900,marginBottom:18,color:C.text}}>Edit Habit</h2>
          <input value={editHabit.name} onChange={e=>setEditHabit({...editHabit,name:e.target.value})} style={{...inp,marginBottom:12}}/>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,marginBottom:8,color:C.textMt}}>Emoji</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {['💧','💪','🧘','📚','🏃','😴','🍎','📝','🎯','✨'].map(e=>(
                <Btn key={e} onClick={()=>setEditHabit({...editHabit,emoji:e})} style={{width:40,height:40,borderRadius:10,border:`2px solid ${editHabit.emoji===e?C.a1:C.border}`,background:editHabit.emoji===e?C.tagBg:C.bg2,fontSize:20,padding:0}}>{e}</Btn>
              ))}
            </div>
          </div>
          <input type="time" value={editHabit.reminder_time||''} onChange={e=>setEditHabit({...editHabit,reminder_time:e.target.value})} style={{...inp,marginBottom:14}}/>
          <div style={{display:'flex',gap:10,marginBottom:8}}>
            <Btn onClick={()=>{deleteHabit(editHabit.id);setShowEdit(false)}} style={{flex:1,padding:13,background:C.isDark?'rgba(239,68,68,.2)':'#fee2e2',color:'#ef4444',borderRadius:12}}>🗑️ Delete</Btn>
            <Btn onClick={saveEditHabit} style={{flex:2,padding:13,background:C.btnGrad,color:'white',borderRadius:12}}>Save Changes</Btn>
          </div>
          <Btn onClick={()=>setShowEdit(false)} style={{width:'100%',padding:10,background:'transparent',color:C.textMt,fontSize:13}}>Cancel</Btn>
        </Modal>
      )}

      {/* TEMPLATES */}
      {showTemplates && (
        <Modal onClose={()=>setShowTemplates(false)} maxW={500}>
          <h2 style={{fontSize:20,fontWeight:900,marginBottom:16,color:C.text}}>📋 Quick Templates</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {TEMPLATES.map((t,i)=>(
              <Btn key={i} onClick={()=>{setNewHabit(t);setShowTemplates(false);setShowAdd(true)}} style={{padding:16,background:C.isDark?t.color+'22':t.color+'18',border:`2px solid ${t.color}33`,borderRadius:14,textAlign:'left'}}>
                <div style={{fontSize:26,marginBottom:4}}>{t.emoji}</div>
                <div style={{fontSize:13,fontWeight:700,color:C.text}}>{t.name}</div>
                <div style={{fontSize:11,color:C.textMt,marginTop:2}}>{t.category}</div>
              </Btn>
            ))}
          </div>
          <Btn onClick={()=>setShowTemplates(false)} style={{width:'100%',padding:13,background:C.progBg,color:C.textLt,borderRadius:12,marginTop:16}}>Close</Btn>
        </Modal>
      )}

      {/* AI COACH */}
      {showAI && (
        <div onClick={()=>setShowAI(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:300,padding:16,backdropFilter:'blur(6px)'}}>
          <div onClick={e=>e.stopPropagation()} style={{...card,width:'100%',maxWidth:480,maxHeight:'92vh',display:'flex',flexDirection:'column'}}>
            <div style={{padding:'18px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h2 style={{fontSize:18,fontWeight:900,color:C.text}}>🤖 AI Coach</h2>
              <Btn onClick={()=>setShowAI(false)} style={{background:'transparent',fontSize:24,color:C.textMt,padding:0}}>×</Btn>
            </div>
            <div style={{flex:1,padding:16,overflowY:'auto',minHeight:200}}>
              {aiMsgs.length===0 && (
                <div style={{textAlign:'center',color:C.textMt,padding:24}}>
                  <div style={{fontSize:48,marginBottom:12}}>🤖</div>
                  <p style={{fontWeight:600,color:C.text}}>Hi! I'm your personal habit coach.</p>
                  <p style={{fontSize:13,marginTop:8}}>Ask me anything about building better habits!</p>
                </div>
              )}
              {aiMsgs.map((m,i)=>(
                <div key={i} style={{marginBottom:10,display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                  <div style={{maxWidth:'82%',padding:'10px 14px',borderRadius:14,background:m.role==='user'?C.btnGrad:C.tagBg,color:m.role==='user'?'white':C.text,fontSize:14,lineHeight:1.5}}>{m.content}</div>
                </div>
              ))}
              {aiLoading && <div style={{color:C.textMt,fontSize:13,padding:'8px 0'}}>🤖 Coach is typing...</div>}
            </div>
            <div style={{padding:14,borderTop:`1px solid ${C.border}`,display:'flex',gap:8}}>
              <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendAI()} placeholder="Ask anything..." style={{...inp,flex:1,padding:12}}/>
              <Btn onClick={sendAI} disabled={aiLoading} style={{padding:'12px 16px',background:C.btnGrad,color:'white',borderRadius:12,fontSize:14}}>Send</Btn>
            </div>
          </div>
        </div>
      )}

      {/* ROUTES */}
      {showRoutes && (
        <Modal onClose={()=>setShowRoutes(false)}>
          <h2 style={{fontSize:20,fontWeight:900,marginBottom:16,color:C.text}}>🗺️ Route Planner</h2>
          <input placeholder="Route name" value={routeForm.name} onChange={e=>setRouteForm({...routeForm,name:e.target.value})} style={{...inp,marginBottom:10}}/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
            <input placeholder="Distance (km)" type="number" value={routeForm.distance} onChange={e=>setRouteForm({...routeForm,distance:e.target.value})} style={{...inp}}/>
            <input placeholder="Duration (min)" type="number" value={routeForm.duration} onChange={e=>setRouteForm({...routeForm,duration:e.target.value})} style={{...inp}}/>
          </div>
          <Btn onClick={addRoute} style={{width:'100%',padding:13,background:C.btnGrad,color:'white',borderRadius:12,marginBottom:18,fontSize:14}}>Save Route 🗺️</Btn>
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:10,color:C.text}}>Saved Routes</h3>
          {routes.length===0 ? <p style={{color:C.textMt,textAlign:'center',padding:16,fontSize:13}}>No routes yet!</p> : routes.map(r=>(
            <div key={r.id} style={{background:C.tagBg,padding:13,borderRadius:12,marginBottom:8}}>
              <div style={{fontWeight:700,color:C.text,marginBottom:4}}>{r.name}</div>
              <div style={{fontSize:12,color:C.textMt}}>📏 {r.distance}km · ⏱️ {r.duration}min · 🔥 {r.calories} cal</div>
            </div>
          ))}
          <Btn onClick={()=>setShowRoutes(false)} style={{width:'100%',padding:13,background:C.progBg,color:C.textLt,borderRadius:12,marginTop:14}}>Close</Btn>
        </Modal>
      )}

      {/* LEADERBOARD */}
      {showLeader && (
        <Modal onClose={()=>setShowLeader(false)}>
          <h2 style={{fontSize:20,fontWeight:900,marginBottom:16,color:C.text}}>🏆 Leaderboard</h2>
          {!isPro ? (
            <div style={{textAlign:'center',padding:28}}>
              <div style={{fontSize:52,marginBottom:12}}>🔒</div>
              <p style={{color:C.textMt,marginBottom:16,fontSize:14}}>Pro feature – compete with others!</p>
              <Btn onClick={()=>{setShowLeader(false);setShowPro(true)}} style={{background:C.btnGrad,color:'white',padding:'12px 26px',borderRadius:12}}>Upgrade to Pro</Btn>
            </div>
          ) : (
            [{name:'You',xp},{name:'Sarah K.',xp:2450},{name:'Mike R.',xp:1890},{name:'Emma L.',xp:1560},{name:'David T.',xp:980}]
              .sort((a,b)=>b.xp-a.xp).map((u,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:14,background:u.name==='You'?C.btnGrad:C.tagBg,borderRadius:12,marginBottom:8,color:u.name==='You'?'white':C.text}}>
                <div style={{fontSize:22,fontWeight:900}}>{['🥇','🥈','🥉','4️⃣','5️⃣'][i]}</div>
                <div style={{flex:1,fontWeight:700}}>{u.name}</div>
                <div style={{fontWeight:800}}>{u.xp} XP</div>
              </div>
            ))
          )}
          <Btn onClick={()=>setShowLeader(false)} style={{width:'100%',padding:13,background:C.progBg,color:C.textLt,borderRadius:12,marginTop:14}}>Close</Btn>
        </Modal>
      )}

      {/* FRIENDS */}
      {showFriends && (
        <Modal onClose={()=>setShowFriends(false)}>
          <h2 style={{fontSize:20,fontWeight:900,marginBottom:16,color:C.text}}>👥 Friends</h2>
          <input placeholder="Friend's email" value={friendEmail} onChange={e=>setFriendEmail(e.target.value)} style={{...inp,marginBottom:10}}/>
          <Btn onClick={inviteFriend} style={{width:'100%',padding:13,background:C.btnGrad,color:'white',borderRadius:12,marginBottom:18,fontSize:14}}>📨 Invite via WhatsApp</Btn>
          {friends.length>0 && friends.map(f=>(
            <div key={f.id} style={{background:C.tagBg,padding:12,borderRadius:10,marginBottom:6,display:'flex',justifyContent:'space-between'}}>
              <span style={{color:C.text,fontSize:14}}>{f.email}</span>
              <span style={{color:C.textMt,fontSize:12}}>{f.status}</span>
            </div>
          ))}
          <Btn onClick={()=>setShowFriends(false)} style={{width:'100%',padding:13,background:C.progBg,color:C.textLt,borderRadius:12,marginTop:14}}>Close</Btn>
        </Modal>
      )}

      {/* PROFILE */}
      {showProfile && (
        <Modal onClose={()=>setShowProfile(false)} maxW={460}>
          <h2 style={{fontSize:20,fontWeight:900,marginBottom:16,color:C.text}}>👤 Profile & Targets</h2>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,marginBottom:8,color:C.textMt}}>Avatar</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {['😊','😎','🤓','🥳','🦁','🐯','🐸','🦊','🐼','🚀','🌟','💫'].map(a=>(
                <Btn key={a} onClick={()=>setProfile({...profile,avatar:a})} style={{width:38,height:38,borderRadius:10,border:`2px solid ${profile.avatar===a?C.a1:C.border}`,background:profile.avatar===a?C.tagBg:C.bg2,fontSize:20,padding:0}}>{a}</Btn>
              ))}
            </div>
          </div>
          <input placeholder="Name" value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} style={{...inp,marginBottom:8}}/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:8}}>
            {[['age','Age'],['weight','Weight kg'],['height','Height cm']].map(([k,ph])=>(
              <input key={k} type="number" placeholder={ph} value={profile[k]} onChange={e=>setProfile({...profile,[k]:e.target.value})} style={{...inp}}/>
            ))}
          </div>
          <input placeholder="Goal (e.g. Lose 5kg)" value={profile.goal} onChange={e=>setProfile({...profile,goal:e.target.value})} style={{...inp,marginBottom:16}}/>
          <h3 style={{fontSize:13,fontWeight:700,marginBottom:10,color:C.textMt}}>Daily Targets</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:18}}>
            {[['steps','Steps'],['water','Water (cups)'],['sleep','Sleep (hr)'],['calories','Calories']].map(([k,label])=>(
              <div key={k}>
                <div style={{fontSize:11,color:C.textMt,marginBottom:4}}>{label}</div>
                <input type="number" value={targets[k]} onChange={e=>setTargets({...targets,[k]:parseInt(e.target.value)||0})} style={{...inp}}/>
              </div>
            ))}
          </div>
          <Btn onClick={saveProfile} style={{width:'100%',padding:14,background:C.btnGrad,color:'white',borderRadius:12,fontSize:15}}>Save Profile ✅</Btn>
        </Modal>
      )}

      {/* LANGUAGE */}
      {showLang && (
        <Modal onClose={()=>setShowLang(false)}>
          <h2 style={{fontSize:20,fontWeight:900,marginBottom:16,color:C.text}}>🌐 Language</h2>
          {[['en','English','🇺🇸'],['es','Español','🇪🇸'],['hi','हिन्दी','🇮🇳'],['ar','العربية','🇸🇦'],['fr','Français','🇫🇷'],['zh','中文','🇨🇳']].map(([code,name,flag])=>(
            <Btn key={code} onClick={()=>{setLang(code);localStorage.setItem('lang',code);setShowLang(false)}} style={{width:'100%',padding:14,background:lang===code?C.tagBg:'transparent',border:`2px solid ${lang===code?C.a1:C.border}`,borderRadius:12,marginBottom:8,display:'flex',alignItems:'center',gap:12,color:C.text,fontSize:15,fontWeight:600,boxSizing:'border-box'}}>
              <span style={{fontSize:22}}>{flag}</span>{name}
              {lang===code && <span style={{marginLeft:'auto',color:C.a1}}>✓</span>}
            </Btn>
          ))}
        </Modal>
      )}

      {/* PRO */}
      {showPro && (
        <Modal onClose={()=>setShowPro(false)}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:56,marginBottom:14}}>⭐</div>
            <h2 style={{fontSize:24,fontWeight:900,marginBottom:8,color:C.text}}>Upgrade to Pro</h2>
            <div style={{fontSize:48,fontWeight:900,color:C.a1,margin:'14px 0'}}>$1.99<span style={{fontSize:16,color:C.textMt}}>/month</span></div>
            <div style={{textAlign:'left',background:C.tagBg,padding:20,borderRadius:16,marginBottom:20}}>
              {['♾️ Unlimited habits','🤖 AI Coach','📊 Advanced analytics','🏆 Leaderboard access','🎨 All 6 themes','🔔 Smart reminders'].map(f=>(
                <div key={f} style={{padding:'6px 0',color:C.text,fontWeight:600,fontSize:14}}>✓ {f}</div>
              ))}
            </div>
            <Btn onClick={()=>{setIsPro(true);setShowPro(false);alert('Welcome to Pro! 🎉')}} style={{width:'100%',padding:16,background:C.btnGrad,color:'white',borderRadius:14,fontSize:16,marginBottom:10}}>Start Pro Now 🚀</Btn>
            <Btn onClick={()=>setShowPro(false)} style={{width:'100%',padding:10,background:'transparent',color:C.textMt,fontSize:13}}>Maybe later</Btn>
          </div>
        </Modal>
      )}

      {/* ONBOARDING */}
      {showOnboard && (
        <div style={{position:'fixed',inset:0,background:C.bg,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div style={{maxWidth:400,width:'100%'}}>
            {onboardStep===0 && (
              <div style={{...card,padding:36,textAlign:'center'}} className="su">
                <div style={{fontSize:72,marginBottom:16}} className="float">👋</div>
                <h2 style={{fontSize:28,fontWeight:900,marginBottom:10,color:C.text}}>Welcome to HabitFlow!</h2>
                <p style={{color:C.textLt,marginBottom:24,lineHeight:1.6}}>Let's set you up in 30 seconds</p>
                <Btn onClick={()=>setOnboardStep(1)} style={{width:'100%',padding:16,background:C.btnGrad,color:'white',borderRadius:14,fontSize:16}}>Let's Go! 🚀</Btn>
              </div>
            )}
            {onboardStep===1 && (
              <div style={{...card,padding:28}} className="su">
                <h2 style={{fontSize:20,fontWeight:900,marginBottom:16,color:C.text}}>What are your goals?</h2>
                {['💪 Get fit','🧘 Mental wellness','📚 Learn more','😴 Better sleep','🎯 Productivity','💰 Build wealth'].map(g=>(
                  <Btn key={g} onClick={()=>setOnboardData({...onboardData,goals:onboardData.goals.includes(g)?onboardData.goals.filter(x=>x!==g):[...onboardData.goals,g]})}
                    style={{width:'100%',padding:13,background:onboardData.goals.includes(g)?C.tagBg:'transparent',border:`2px solid ${onboardData.goals.includes(g)?C.a1:C.border}`,borderRadius:12,marginBottom:8,textAlign:'left',fontSize:14,color:C.text,fontWeight:600,boxSizing:'border-box'}}>
                    {g}
                  </Btn>
                ))}
                <Btn onClick={()=>setOnboardStep(2)} style={{width:'100%',padding:13,background:C.btnGrad,color:'white',borderRadius:12,marginTop:8,fontSize:15}}>Next →</Btn>
              </div>
            )}
            {onboardStep===2 && (
              <div style={{...card,padding:28}} className="su">
                <h2 style={{fontSize:20,fontWeight:900,marginBottom:16,color:C.text}}>Also pick your vibe 🎨</h2>
                <p style={{fontSize:13,color:C.textMt,marginBottom:16}}>You can always change this later</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:16}}>
                  {Object.entries(THEMES).map(([key,th])=>(
                    <Btn key={key} onClick={()=>changeTheme(key)} style={{padding:0,background:'transparent',borderRadius:14,border:`2.5px solid ${themeName===key?C.a1:'transparent'}`,overflow:'hidden'}}>
                      <div style={{background:th.bg,padding:10,height:60,display:'flex',flexDirection:'column',gap:4}}>
                        <div style={{display:'flex',gap:3}}>
                          <div style={{width:8,height:8,borderRadius:'50%',background:th.a1}}/>
                          <div style={{width:8,height:8,borderRadius:'50%',background:th.a2}}/>
                        </div>
                        <div style={{height:5,borderRadius:999,background:th.btnGrad}}/>
                      </div>
                      <div style={{background:th.card,padding:'4px 6px',textAlign:'center',fontSize:10,fontWeight:800,color:th.text}}>{th.emoji} {th.name}</div>
                    </Btn>
                  ))}
                </div>
                <Btn onClick={()=>setOnboardStep(3)} style={{width:'100%',padding:13,background:C.btnGrad,color:'white',borderRadius:12,fontSize:15}}>Next →</Btn>
              </div>
            )}
            {onboardStep===3 && (
              <div style={{...card,padding:36,textAlign:'center'}} className="su">
                <div style={{fontSize:64,marginBottom:14}}>🎉</div>
                <h2 style={{fontSize:24,fontWeight:900,marginBottom:10,color:C.text}}>You're all set!</h2>
                <p style={{color:C.textLt,marginBottom:22,lineHeight:1.6}}>Let's start building amazing habits together!</p>
                <Btn onClick={()=>{localStorage.setItem('onboarded_'+user.id,'true');setShowOnboard(false)}} style={{width:'100%',padding:16,background:C.btnGrad,color:'white',borderRadius:14,fontSize:16}}>Start Building 🌱</Btn>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MILESTONE */}
      {showMilestone && (
        <div onClick={()=>setShowMilestone(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.65)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999,padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.streakGrad,padding:40,borderRadius:24,maxWidth:380,width:'100%',textAlign:'center',color:'white',boxShadow:C.shadow}}>
            <div style={{fontSize:72,marginBottom:14}}>🔥</div>
            <h2 style={{fontSize:32,fontWeight:900,marginBottom:8}}>{showMilestone.streak} Day Streak!</h2>
            <p style={{fontSize:18,marginBottom:24,opacity:.9}}>{showMilestone.habit.emoji} {showMilestone.habit.name}</p>
            <div style={{display:'flex',gap:10,marginBottom:14}}>
              <Btn onClick={()=>{const t=`🔥 ${showMilestone.streak}-day streak on ${showMilestone.habit.name}! Building habits 🌱 https://thehabitflow.app`;window.open(`https://wa.me/?text=${encodeURIComponent(t)}`)}} style={{flex:1,padding:13,background:'rgba(255,255,255,.2)',color:'white',border:'2px solid white',borderRadius:12}}>📱 WhatsApp</Btn>
              <Btn onClick={()=>{const t=`🔥 ${showMilestone.streak}-day streak! @habitflow #habits`;window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=https://thehabitflow.app`)}} style={{flex:1,padding:13,background:'rgba(255,255,255,.2)',color:'white',border:'2px solid white',borderRadius:12}}>𝕏 Share</Btn>
            </div>
            <Btn onClick={()=>setShowMilestone(null)} style={{width:'100%',padding:10,background:'transparent',color:'rgba(255,255,255,.7)',fontSize:13}}>Continue</Btn>
          </div>
        </div>
      )}
    </div>
  )
}
