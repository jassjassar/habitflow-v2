import { useState } from "react"

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
    { name:"Deep Work",       emoji:"🎯", color:"#4ECDC4", time:"09:00" },
    { name:"Plan Tomorrow",   emoji:"📋", color:"#45B7D1", time:"21:00" },
    { name:"No Phone AM",     emoji:"📵", color:"#FF6B6B", time:"08:00" },
    { name:"Learn Something", emoji:"🧠", color:"#A78BFA", time:"18:00" },
    { name:"Read 20 Mins",    emoji:"📚", color:"#FFD93D", time:"20:00" },
  ],
  personal: [
    { name:"Cold Shower",    emoji:"🚿", color:"#45B7D1", time:"07:00" },
    { name:"Walk 30 Mins",   emoji:"🚶", color:"#6BCB77", time:"17:00" },
    { name:"No Sugar",       emoji:"🍎", color:"#FF6B6B", time:"08:00" },
    { name:"Gratitude",      emoji:"🙏", color:"#FFD93D", time:"21:00" },
    { name:"Sleep 8hrs",     emoji:"💤", color:"#A78BFA", time:"22:00" },
  ],
}

const STEPS = [
  {
    id:"goal", emoji:"🎯", title:"What's your main goal?", subtitle:"We'll build the perfect habit set for you",
    options:[
      { id:"health",   emoji:"💪", label:"Get fit & healthy",   desc:"Exercise, nutrition, sleep" },
      { id:"mind",     emoji:"🧘", label:"Mental clarity",       desc:"Meditate, read, journal" },
      { id:"work",     emoji:"🚀", label:"Be more productive",   desc:"Deep work, focus, planning" },
      { id:"personal", emoji:"✨", label:"Personal growth",      desc:"Self-care & better habits" },
    ],
  },
  {
    id:"time", emoji:"⏰", title:"When are you most active?", subtitle:"We'll use this to set your starter reminder times",
    options:[
      { id:"morning",   emoji:"🌅", label:"Early bird",    desc:"I'm active before 9am" },
      { id:"afternoon", emoji:"☀️", label:"Afternoon peak", desc:"I hit my stride after noon" },
      { id:"evening",   emoji:"🌙", label:"Night owl",      desc:"Evenings work best for me" },
      { id:"flexible",  emoji:"🎲", label:"Flexible",       desc:"No fixed preference" },
    ],
  },
  {
    id:"count", emoji:"📊", title:"How many habits to start?", subtitle:"Research shows starting small leads to long-term success",
    options:[
      { id:"2", emoji:"🌱", label:"Start with 2", desc:"Easy wins, high success rate" },
      { id:"3", emoji:"⚡", label:"Go with 3",    desc:"The science-backed sweet spot" },
      { id:"5", emoji:"🔥", label:"Challenge me", desc:"I'm ready to commit fully" },
    ],
  },
]

export default function OnboardingQuiz({ onComplete, onDone }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [animating, setAnimating] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const [createdHabits, setCreatedHabits] = useState([])
  const [error, setError] = useState("")

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

  const finishSetup = async (selectedHabits) => {
    if (completing) return
    setCompleting(true)
    setError("")
    try {
      const created = await onComplete(selectedHabits)
      if (!created?.length) throw new Error("No habits were created.")
      setCreatedHabits(created)
      setCelebrating(true)
      // no auto-redirect — user controls entry
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

  if (celebrating) {
    const habitCount = createdHabits.length
    const goalLabels = { health:"fitness", mind:"mental clarity", work:"productivity", personal:"personal growth" }
    const goal = goalLabels[answers.goal] || "your goals"
    return (
      <div style={{position:"fixed",inset:0,zIndex:500,background:"linear-gradient(180deg,#fbfdf9 0%,#f8f9fb 60%,#ffffff 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,textAlign:"center",fontFamily:"'Inter',sans-serif"}}>
        <div style={{animation:"celebPop 0.6s cubic-bezier(.34,1.56,.64,1) forwards",fontSize:80,marginBottom:24}}>🎉</div>
        <div style={{fontSize:28,fontWeight:900,color:"#152118",marginBottom:10,lineHeight:1.2}}>You're all set!</div>
        <div style={{fontSize:16,color:"#536257",marginBottom:32,lineHeight:1.6,maxWidth:300}}>
          We've created {habitCount} habits focused on <span style={{color:"#4f5d75",fontWeight:700}}>{goal}</span>. Your journey starts now.
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12,width:"100%",maxWidth:280}}>
          {createdHabits.map((h,i) => (
            <div key={i} style={{background:"#ffffff",border:`1px solid ${h.color}30`,borderRadius:16,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 4px 12px rgba(24,35,29,0.06)",animation:`slideInUp 0.4s ${i*0.1}s ease both`}}>
              <div style={{fontSize:24}}>{h.emoji}</div>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:14,fontWeight:700,color:"#152118"}}>{h.name}</div>
                <div style={{fontSize:11,color:"#6d786f"}}>⏰ {h.time}</div>
              </div>
              <div style={{marginLeft:"auto",color:"#4f5d75",fontWeight:800,fontSize:12}}>✓</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => onDone?.()}
          style={{
            marginTop:32,
            width:"100%",
            maxWidth:280,
            padding:"17px 28px",
            fontSize:16,
            fontWeight:800,
            borderRadius:16,
            border:"none",
            background:"#4f5d75",
            color:"#ffffff",
            boxShadow:"0 8px 28px rgba(79,93,117,0.28)",
            cursor:"pointer",
            fontFamily:"'Inter',sans-serif",
            letterSpacing:"-0.01em",
          }}
        >
          Enter my space →
        </button>
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

  const hasSelection = Boolean(answers[currentStep.id])

  return (
    <div style={{position:"fixed",inset:0,zIndex:500,background:"linear-gradient(180deg,#fbfdf9 0%,#f8f9fb 60%,#ffffff 100%)",display:"flex",flexDirection:"column",overflowY:"auto",fontFamily:"'Inter',sans-serif"}}>
      <style>{`
        @keyframes fadeSlideIn { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes optionPop { 0%{transform:scale(0.94);opacity:0} 100%{transform:scale(1);opacity:1} }
        .ob-option { transition: all 0.2s ease; }
        .ob-option:hover { transform: translateY(-2px) scale(1.01); }
        .ob-option:active { transform: scale(0.98); }
      `}</style>

      {/* HEADER */}
      <div style={{padding:"20px 24px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button
          onClick={goBack}
          disabled={step===0||animating||completing}
          style={{width:38,height:38,borderRadius:12,border:"1px solid rgba(31,53,40,0.1)",background:step===0?"#f8f9fb":"#ffffff",color:step===0?"#9aad9f":"#1f3528",cursor:step===0||animating||completing?"not-allowed":"pointer",fontSize:18,fontWeight:800,fontFamily:"'Inter',sans-serif"}}
          aria-label="Back"
        >←</button>
        <div style={{display:"flex",alignItems:"center",gap:8,fontSize:17,fontWeight:900,color:"#1f3528"}}>
          <span style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#d9f99d,#86efac 52%,#67e8f9)",display:"inline-flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(34,197,94,0.16)"}}>
            <span style={{width:11,height:11,borderRadius:"50%",background:"#4f5d75",display:"block"}}/>
          </span>
          HabitFlow
        </div>
        <div style={{fontSize:12,color:"#6d786f",fontWeight:600}}>{step+1} of {totalSteps}</div>
      </div>

      {/* PROGRESS BAR */}
      <div style={{padding:"12px 24px 0"}}>
        <div style={{height:4,borderRadius:999,background:"#edf2f7",overflow:"hidden"}}>
          <div style={{height:"100%",borderRadius:999,background:"linear-gradient(90deg,#4f5d75,#6b7fa3)",width:`${((step+1)/totalSteps)*100}%`,transition:"width 0.4s ease"}}/>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,display:"flex",flexDirection:"column",padding:"32px 24px 24px",animation:animating?"none":"fadeSlideIn 0.35s ease",opacity:animating?0:1,transition:animating?"opacity 0.2s":"none"}}>

        {/* STEP HEADER */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:60,marginBottom:14,filter:"drop-shadow(0 4px 12px rgba(79,93,117,0.2))",animation:"float 3s ease-in-out infinite"}}>
            {currentStep.emoji}
          </div>
          <div style={{fontSize:24,fontWeight:900,color:"#152118",marginBottom:8,lineHeight:1.25}}>
            {currentStep.title}
          </div>
          <div style={{fontSize:14,color:"#6d786f",lineHeight:1.5}}>
            {currentStep.subtitle}
          </div>
        </div>

        {/* OPTIONS */}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
          {currentStep.options.map((opt,i) => {
            const isSelected = answers[currentStep.id] === opt.id
            return (
              <div
                key={opt.id}
                className="ob-option"
                onClick={() => selectOption(opt.id)}
                style={{
                  background: isSelected ? "#edf2f7" : "#ffffff",
                  border: isSelected ? "1.5px solid rgba(79,93,117,0.4)" : "1px solid rgba(31,53,40,0.08)",
                  borderRadius:18,
                  padding:"14px 16px",
                  cursor:completing?"wait":"pointer",
                  display:"flex",
                  alignItems:"center",
                  gap:12,
                  boxShadow: isSelected ? "0 4px 16px rgba(79,93,117,0.1)" : "0 2px 8px rgba(24,35,29,0.04)",
                  animation:`optionPop 0.3s ${i*0.06}s ease both`,
                }}
              >
                <div style={{width:44,height:44,borderRadius:14,flexShrink:0,background:isSelected?"#dcfce7":"#f8f9fb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,border:isSelected?"1px solid rgba(79,93,117,0.2)":"1px solid rgba(31,53,40,0.06)",transition:"all 0.2s"}}>
                  {opt.emoji}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:700,color:"#152118",marginBottom:2}}>{opt.label}</div>
                  <div style={{fontSize:12,color:"#6d786f",fontWeight:500}}>{opt.desc}</div>
                </div>
                <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,background:isSelected?"#4f5d75":"#edf2f7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#ffffff",transition:"all 0.2s"}}>
                  {isSelected ? "✓" : ""}
                </div>
              </div>
            )
          })}
        </div>

        {/* ERROR */}
        {error && (
          <div style={{marginBottom:14,padding:"12px 14px",borderRadius:14,background:"#fef2f2",border:"1px solid rgba(220,38,38,0.2)",color:"#dc2626",fontSize:12,lineHeight:1.45,fontWeight:600}}>
            {error}
          </div>
        )}

        {/* CTA BUTTON */}
        <button
          onClick={goNext}
          disabled={!hasSelection||animating||completing}
          style={{width:"100%",padding:"16px",borderRadius:999,border:"none",background:hasSelection&&!completing?"#4f5d75":"#edf2f7",color:hasSelection&&!completing?"#ffffff":"#9aad9f",fontSize:16,fontWeight:800,cursor:hasSelection&&!completing?"pointer":"not-allowed",transition:"all 0.25s",boxShadow:hasSelection&&!completing?"0 12px 28px rgba(79,93,117,0.22)":"none",fontFamily:"'Inter',sans-serif"}}
        >
          {completing?"Creating your habits...":step===totalSteps-1?"Build My Habits 🚀":"Continue →"}
        </button>

        {/* SKIP */}
        {step===0 && (
          <div
            onClick={()=>!completing&&finishSetup(ONBOARDING_HABITS.health.slice(0,3))}
            style={{textAlign:"center",marginTop:16,fontSize:12,color:completing?"#c4d1c8":"#6d786f",cursor:completing?"wait":"pointer",fontWeight:600}}
          >
            Use starter setup instead →
          </div>
        )}
      </div>

      {/* SUBTLE BG ORBS */}
      <div style={{position:"fixed",top:"10%",right:"5%",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(79,93,117,0.04),transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"fixed",bottom:"15%",left:"0%",width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(34,197,94,0.04),transparent 70%)",pointerEvents:"none"}}/>
    </div>
  )
}
