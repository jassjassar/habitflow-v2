function getStreak(habit, days, freezeDates = []) {
  let s = 0
  const rev = [...days].reverse()
  for (let d of rev) {
    if (habit.completions?.[d]) s++
    else if (freezeDates.includes(d)) s++
    else break
  }
  return s
}

export default function HabitsScreen({
  habits,
  todayStr,
  days,
  habitSaveError,
  onToggle,
  onEdit,
  onAdd,
  onTemplates,
}) {
  return (
    <div className="fade-up">

      {/* HEADER */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{fontSize:12,color:"#6d786f",fontWeight:750,textTransform:"uppercase",letterSpacing:.4,marginBottom:2}}>Your</div>
          <div style={{fontSize:22,fontWeight:900,color:"#152118"}}>Habits</div>
        </div>
        <button
          onClick={onAdd}
          style={{padding:"12px 20px",fontSize:14,fontWeight:800,borderRadius:999,border:"none",background:"#0891b2",color:"#ffffff",boxShadow:"0 8px 20px rgba(8,145,178,0.18)",cursor:"pointer",fontFamily:"'Inter',sans-serif",minHeight:44}}
        >+ Add</button>
      </div>

      {/* EMPTY STATE */}
      {habits.length === 0 ? (
        <div style={{padding:"40px 28px",borderRadius:24,background:"#ffffff",border:"1px solid rgba(8,28,80,0.08)",boxShadow:"0 14px 34px rgba(8,28,50,0.06)",textAlign:"center"}}>
          <div style={{fontSize:56,marginBottom:14,animation:"float 3s ease-in-out infinite"}}>🌱</div>
          <div style={{fontSize:20,fontWeight:800,color:"#152118",marginBottom:8}}>No habits yet</div>
          <div style={{color:"#607067",fontSize:14,lineHeight:1.6,marginBottom:24}}>Start with a template or create your own. Small steps build lasting change.</div>
          <button
            onClick={onTemplates}
            style={{padding:"14px 32px",fontSize:14,fontWeight:800,borderRadius:999,border:"none",background:"#0891b2",color:"#ffffff",boxShadow:"0 8px 20px rgba(8,145,178,0.18)",cursor:"pointer",fontFamily:"'Inter',sans-serif",minHeight:44}}
          >Browse Templates</button>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {habits.map((h) => {
            const done     = h.completions?.[todayStr]
            const streak   = getStreak(h, days)
            const weekDone = days.filter(d => h.completions?.[d]).length

            return (
              <div
                key={h.id}
                style={{
                  padding:"16px",
                  borderRadius:22,
                  background: done ? "#f0f9ff" : "#ffffff",
                  border:`1px solid ${done ? "rgba(8,145,178,0.16)" : "rgba(8,28,80,0.08)"}`,
                  boxShadow:"0 14px 34px rgba(8,28,50,0.06)",
                  transition:"all 0.2s ease",
                }}
              >
                <div style={{display:"flex",alignItems:"center",gap:14}}>

                  {/* ICON */}
                  <div style={{
                    width:50,height:50,borderRadius:16,
                    background:`${h.color}15`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:24,flexShrink:0,
                    border:`1px solid ${h.color}20`,
                    opacity: done ? 0.75 : 1,
                  }}>
                    {h.emoji}
                  </div>

                  {/* INFO */}
                  <div style={{flex:1,minWidth:0,opacity: done ? 0.7 : 1}}>
                    <div style={{fontSize:15,fontWeight:700,color:"#152118",marginBottom:4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                      {h.name}
                    </div>
                    <div style={{display:"flex",gap:10,fontSize:12,color:"#6d786f",flexWrap:"wrap",marginBottom:8}}>
                      <span style={{color:h.color,fontWeight:700}}>{streak} day streak</span>
                      {h.reminder_time && <span>⏰ {h.reminder_time}</span>}
                      <span>{weekDone}/7 this week</span>
                    </div>
                    {/* 7-DAY BAR */}
                    <div style={{display:"flex",gap:3}}>
                      {days.map((d,di) => (
                        <div key={di} style={{
                          flex:1,height:5,borderRadius:999,
                          background: h.completions?.[d] ? h.color : "#e0f2fe",
                          transition:"all .3s",
                        }}/>
                      ))}
                    </div>
                  </div>

                  {/* ACTIONS — minimum 44x44px touch targets */}
                  <div style={{display:"flex",flexDirection:"column",gap:8,flexShrink:0}}>
                    <button
                      onClick={() => onEdit(h)}
                      style={{
                        minWidth:44,minHeight:44,
                        padding:"10px 14px",
                        fontSize:13,fontWeight:600,
                        borderRadius:12,
                        border:"1px solid rgba(8,28,80,0.1)",
                        background:"#ffffff",color:"#1f3528",
                        cursor:"pointer",fontFamily:"'Inter',sans-serif",
                        display:"flex",alignItems:"center",justifyContent:"center",
                      }}
                    >Edit</button>
                    <button
                      onClick={() => onToggle(h.id, todayStr)}
                      style={{
                        minWidth:44,minHeight:44,
                        padding:"10px 14px",
                        fontSize:13,fontWeight:800,
                        borderRadius:999,
                        border: done ? "none" : "1px solid rgba(8,28,80,0.1)",
                        background: done ? "#0891b2" : "#ffffff",
                        color: done ? "#ffffff" : "#1f3528",
                        boxShadow: done ? "0 4px 12px rgba(8,145,178,0.2)" : "none",
                        cursor:"pointer",fontFamily:"'Inter',sans-serif",
                        transition:"all 0.2s",
                        display:"flex",alignItems:"center",justifyContent:"center",
                      }}
                    >{done ? "✓ Done" : "Log"}</button>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ERROR */}
      {habitSaveError && (
        <div style={{fontSize:13,color:"#dc2626",background:"#fef2f2",border:"1px solid rgba(220,38,38,0.2)",borderRadius:12,padding:"12px 14px",marginTop:12,fontWeight:600}}>
          {habitSaveError}
        </div>
      )}

    </div>
  )
}
