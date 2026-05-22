import HeatmapCalendar from '../components/HeatmapCalendar'

export default function AnalyticsScreen({
  habits,
  isPro,
  displayXP,
  currentLevel,
  nextLevel,
  xpPct,
  levelXP,
  levelXPNeeded,
  lifetimeCompletions,
  bestStreak,
  days,
  onOpenPaywall,
}) {
  return (
    <div className="fade-up">

      {/* HEADER */}
      <div style={{marginBottom:20}}>
        <div style={{fontSize:12,color:"#6d786f",fontWeight:750,textTransform:"uppercase",letterSpacing:.4,marginBottom:2}}>Your</div>
        <div style={{fontSize:22,fontWeight:900,color:"#152118"}}>Stats</div>
      </div>

      {/* HEATMAP */}
      <HeatmapCalendar habits={habits}/>

      {!isPro ? (
        <div style={{padding:"40px 28px",borderRadius:24,background:"#ffffff",border:"1px solid rgba(31,53,40,0.08)",boxShadow:"0 14px 34px rgba(24,35,29,0.06)",textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:48,marginBottom:14}}>📊</div>
          <div style={{fontSize:20,fontWeight:800,color:"#152118",marginBottom:8}}>Unlock Full Analytics</div>
          <div style={{color:"#6d786f",fontSize:14,lineHeight:1.6,marginBottom:24}}>See your XP progress, lifetime stats, and detailed habit performance with Pro.</div>
          <button
            onClick={()=>onOpenPaywall("stats")}
            style={{padding:"13px 28px",fontSize:14,fontWeight:800,borderRadius:999,border:"none",background:"#0891b2",color:"#ffffff",boxShadow:"0 8px 20px rgba(8,145,178,0.2)",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}
          >
            Upgrade to Pro
          </button>
        </div>
      ) : (
        <>
          {/* XP PROGRESS CARD */}
          <div style={{padding:"24px",borderRadius:24,background:"#ffffff",border:"1px solid rgba(31,53,40,0.08)",boxShadow:"0 14px 34px rgba(24,35,29,0.06)",marginBottom:14,textAlign:"center"}}>
            <div style={{fontSize:12,fontWeight:750,color:"#6d786f",textTransform:"uppercase",letterSpacing:.4,marginBottom:16}}>Level Progress</div>
            <div style={{position:"relative",width:140,height:140,margin:"0 auto 16px"}}>
              <svg width="140" height="140" viewBox="0 0 140 140" style={{transform:"rotate(-90deg)"}}>
                <circle cx="70" cy="70" r="58" fill="none" stroke="#e0f2fe" strokeWidth="10"/>
                <circle cx="70" cy="70" r="58" fill="none" stroke="#0891b2" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(xpPct/100)*2*Math.PI*58} ${2*Math.PI*58}`}
                  style={{transition:"stroke-dasharray 1s ease",filter:"drop-shadow(0 0 6px rgba(8,145,178,0.3))"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div style={{fontSize:28,fontWeight:900,color:"#152118",lineHeight:1}}>{Math.round(xpPct)}%</div>
                <div style={{fontSize:11,fontWeight:700,color:"#6d786f",marginTop:4}}>{currentLevel.title}</div>
              </div>
            </div>
            <div style={{fontSize:14,color:"#536257",fontWeight:500}}>
              {nextLevel ? `${nextLevel.minXP - displayXP} XP to ${nextLevel.title}` : "Maximum level reached 👑"}
            </div>
            <div style={{fontSize:12,color:"#9aad9f",marginTop:4}}>
              {nextLevel ? `${levelXP} / ${levelXPNeeded} XP in Level ${currentLevel.level}` : `${displayXP} lifetime XP`}
            </div>
          </div>

          {/* STAT GRID */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            {[
              {lbl:"Completions", val:lifetimeCompletions, color:"#0891b2", bg:"#eef8e9"},
              {lbl:"Best Streak",  val:`${bestStreak} days`,  color:"#ea580c", bg:"#fff7ed"},
              {lbl:"Total XP",     val:displayXP,             color:"#7c3aed", bg:"#f5f3ff"},
              {lbl:"Habits",       val:habits.length,         color:"#0369a1", bg:"#f0f9ff"},
            ].map(s=>(
              <div key={s.lbl} style={{padding:"18px 16px",borderRadius:20,background:"#ffffff",border:"1px solid rgba(31,53,40,0.08)",boxShadow:"0 8px 20px rgba(24,35,29,0.05)"}}>
                <div style={{fontSize:11,color:"#6d786f",marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:.4}}>{s.lbl}</div>
                <div style={{fontSize:26,fontWeight:900,color:s.color}}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* WEEKLY BARS */}
          <div style={{padding:"20px",borderRadius:24,background:"#ffffff",border:"1px solid rgba(31,53,40,0.08)",boxShadow:"0 14px 34px rgba(24,35,29,0.06)",marginBottom:14}}>
            <div style={{fontSize:15,fontWeight:800,color:"#152118",marginBottom:16}}>This Week</div>
            {habits.map(h => {
              const cnt = days.filter(d => h.completions?.[d]).length
              return (
                <div key={h.id} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13}}>
                    <span style={{color:"#152118",fontWeight:600}}>{h.emoji} {h.name}</span>
                    <span style={{color:"#0891b2",fontWeight:700}}>{cnt}/7</span>
                  </div>
                  <div style={{height:7,borderRadius:999,background:"#e0f2fe",overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(cnt/7)*100}%`,background:"#0891b2",borderRadius:999,transition:"width 1s ease"}}/>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
