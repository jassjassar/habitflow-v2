import { useState } from "react"

export default function HeatmapCalendar({ habits }) {
  const [tooltip, setTooltip] = useState(null)
  const [selectedHabit, setSelectedHabit] = useState("all")

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
  const weeks = []
  let week = []
  const firstDay = days[0].date.getDay()
  for (let i = 0; i < firstDay; i++) week.push(null)
  days.forEach(d => {
    week.push(d)
    if (week.length === 7) { weeks.push(week); week = [] }
  })
  if (week.length > 0) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }

  const todayStr = new Date().toISOString().slice(0, 10)
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const DAYS = ["S","M","T","W","T","F","S"]

  const getColor = (pct, isToday) => {
    if (isToday) return "#4f5d75"
    if (pct === 0) return "#edf2f7"
    if (pct <= 0.25) return "#c3d1e8"
    if (pct <= 0.5)  return "#8fa3c8"
    if (pct <= 0.75) return "#6b7fa3"
    return "#2e3a59"
  }

  const monthLabels = []
  weeks.forEach((week, wi) => {
    const firstReal = week.find(d => d !== null)
    if (firstReal && firstReal.date.getDate() <= 7) {
      monthLabels.push({ wi, label: MONTHS[firstReal.date.getMonth()] })
    }
  })

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
    <div style={{background:"#ffffff",border:"1px solid rgba(31,53,40,0.08)",borderRadius:24,padding:"20px 16px",marginBottom:14,boxShadow:"0 14px 34px rgba(24,35,29,0.06)"}}>

      {/* HEADER */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div style={{fontSize:15,fontWeight:800,color:"#152118"}}>Activity</div>
        <div style={{fontSize:11,color:"#9aad9f",fontWeight:600}}>Last 90 days</div>
      </div>

      {/* HABIT FILTER */}
      {habits.length > 1 && (
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          <button
            onClick={() => setSelectedHabit("all")}
            style={{padding:"5px 12px",fontSize:12,fontWeight:700,borderRadius:999,border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s",background:selectedHabit==="all"?"#4f5d75":"#f4f8f2",color:selectedHabit==="all"?"#ffffff":"#6d786f"}}
          >All</button>
          {habits.map(h => (
            <button
              key={h.id}
              onClick={() => setSelectedHabit(h.id)}
              style={{padding:"5px 12px",fontSize:12,fontWeight:700,borderRadius:999,border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s",background:selectedHabit===h.id?"#4f5d75":"#f4f8f2",color:selectedHabit===h.id?"#ffffff":"#6d786f"}}
            >{h.emoji} {h.name}</button>
          ))}
        </div>
      )}

      {/* MONTH LABELS */}
      <div style={{display:"flex",marginBottom:4,marginLeft:18}}>
        {weeks.map((_, wi) => {
          const label = monthLabels.find(m => m.wi === wi)
          return <div key={wi} style={{width:14,fontSize:9,color:"#9aad9f",fontWeight:600,flexShrink:0,marginRight:2}}>{label ? label.label : ""}</div>
        })}
      </div>

      {/* GRID */}
      <div style={{display:"flex",gap:2}}>
        <div style={{display:"flex",flexDirection:"column",gap:2,marginRight:4}}>
          {DAYS.map((d,i) => (
            <div key={i} style={{height:12,fontSize:9,color:"#9aad9f",fontWeight:600,lineHeight:"12px"}}>{i % 2 === 1 ? d : ""}</div>
          ))}
        </div>
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
                  style={{width:12,height:12,borderRadius:3,background:color,cursor:"pointer",transition:"transform .15s",border:isToday?"2px solid #4f5d75":"none",transform:tooltip?.dateStr===day.dateStr?"scale(1.4)":"scale(1)"}}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* LEGEND */}
      <div style={{display:"flex",alignItems:"center",gap:5,marginTop:10,justifyContent:"flex-end"}}>
        <div style={{fontSize:9,color:"#9aad9f",fontWeight:600}}>Less</div>
        {["#edf2f7","#c3d1e8","#8fa3c8","#6b7fa3","#2e3a59"].map((c,i) => (
          <div key={i} style={{width:10,height:10,borderRadius:2,background:c}}/>
        ))}
        <div style={{fontSize:9,color:"#9aad9f",fontWeight:600}}>More</div>
      </div>

      {/* TOOLTIP */}
      {tooltip && (
        <div style={{marginTop:10,padding:"8px 12px",background:"#f4f8f2",borderRadius:10,border:"1px solid rgba(31,53,40,0.08)",fontSize:12,color:"#536257",fontWeight:600,textAlign:"center"}}>
          {tooltip.dateStr === todayStr ? "Today" : tooltip.date.toLocaleDateString("en",{month:"short",day:"numeric",year:"numeric"})}
          {" · "}
          {tooltip.total === 0 ? "No habits yet" : tooltip.done === 0 ? "No habits completed" : tooltip.done === tooltip.total ? `All ${tooltip.total} habits ✓` : `${tooltip.done}/${tooltip.total} habits`}
        </div>
      )}

      {/* QUICK STATS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:14}}>
        {[
          {lbl:"Perfect Days", val:totalDone,              color:"#4f5d75", bg:"#eef8e9"},
          {lbl:"Current Streak",val:`${currentStreak}🔥`,  color:"#ea580c", bg:"#fff7ed"},
          {lbl:"Longest Streak",val:`${longestStreak}⚡`,  color:"#7c3aed", bg:"#f5f3ff"},
        ].map(s=>(
          <div key={s.lbl} style={{background:s.bg,borderRadius:14,padding:"10px 8px",textAlign:"center",border:"1px solid rgba(31,53,40,0.06)"}}>
            <div style={{fontSize:18,fontWeight:900,color:s.color}}>{s.val}</div>
            <div style={{fontSize:9,color:"#6d786f",fontWeight:700,marginTop:3,textTransform:"uppercase",letterSpacing:.4}}>{s.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
