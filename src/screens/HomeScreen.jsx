export default function HomeScreen({
  activeHabits,
  doneToday,
  todayPct,
  todayStr,
  companionMood,
  companionMessage,
  companionStatus,
  pacerCopy,
  displayXP,
  currentLevel,
  nextLevel,
  xpPct,
  levelXP,
  levelXPNeeded,
  bestStreak,
  freezes,
  maxFreezes,
  daysToNextShield,
  water,
  steps,
  waterPct,
  stepsPct,
  dailyQuests,
  DAILY_QUEST_BONUS_XP,
  weeklyRecap,
  weeklyRecapLoading,
  weeklyRecapError,
  weeklySummary,
  habitSaveError,
  onToggle,
  onOpenAI,
  onSetTab,
  onAdd,
  onTemplates,
  onAddWater,
  onAddSteps,
  onWeeklyRecap,
}) {
  const face = { happy:"•‿•", sleepy:"—_—", excited:"★‿★", worried:"•︵•" }[companionMood] || "•‿•"

  return (
    <div className="fade-up">

      {/* GROWTH HERO */}
      <div style={{padding:"24px 22px",marginBottom:18,borderRadius:30,background:"var(--card-surface,#ffffff)",border:"1px solid rgba(8,28,80,0.08)",boxShadow:"0 20px 54px rgba(8,28,50,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
          <div style={{width:62,height:62,borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"var(--text-primary,#fff)",background:"linear-gradient(135deg,rgba(167,139,250,0.95),rgba(78,205,196,0.86))",boxShadow:"0 12px 32px rgba(78,205,196,0.25), inset 0 1px 0 rgba(255,255,255,0.3)",border:"1px solid rgba(255,255,255,0.2)",animation:companionMood==="excited"?"pulse 1.4s ease-in-out infinite":companionMood==="sleepy"?"float 4s ease-in-out infinite":"float 3s ease-in-out infinite"}}>
            {face}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:800,color:"#607067",letterSpacing:.4,textTransform:"uppercase",marginBottom:5}}>Growth Companion</div>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <div style={{fontSize:24,fontWeight:850,color:"#1a202c",lineHeight:1.1}}>Today feels {companionStatus.toLowerCase()}.</div>
              <div style={{fontSize:11,fontWeight:800,color:"#2e3a59",background:"#edf2f7",border:"1px solid rgba(46,58,89,0.12)",borderRadius:999,padding:"4px 8px"}}>{pacerCopy.label}</div>
            </div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:20,alignItems:"center"}}>
          <div style={{width:132,height:132,borderRadius:"50%",background:"#f6faf4",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(8,28,80,0.08)"}}>
            <div className="ring-wrap" style={{width:116,height:116}}>
              <svg width="116" height="116" viewBox="0 0 116 116" style={{position:"absolute",top:0,left:0,transform:"rotate(-90deg)",filter:"drop-shadow(0 0 12px rgba(46,58,89,0.14))"}}>
                <circle cx="58" cy="58" r="44" fill="none" stroke="#edf2f7" strokeWidth="11"/>
                <circle cx="58" cy="58" r="44" fill="none" stroke="#2e3a5922" strokeWidth="11" strokeDasharray={`${2*Math.PI*44} 0`}/>
                <circle cx="58" cy="58" r="44" fill="none" stroke="#2e3a59" strokeOpacity="0.9" strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={`${(todayPct/100)*2*Math.PI*44} ${2*Math.PI*44}`}
                  className="progress-ring"
                  style={{filter:"drop-shadow(0 0 8px #2e3a59)"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div style={{fontSize:30,fontWeight:900,color:"#1a202c",lineHeight:1}}>{Math.round(todayPct)}%</div>
                <div style={{fontSize:10,fontWeight:700,color:"#718096",letterSpacing:.8,marginTop:3,textTransform:"uppercase"}}>TODAY</div>
                <div style={{fontSize:10,color:"#718096",marginTop:1}}>{doneToday}/{activeHabits.length} done</div>
              </div>
            </div>
          </div>
          <div>
            <div style={{fontSize:42,fontWeight:850,color:"#1a202c",lineHeight:1,marginBottom:8}}>{todayPct}%</div>
            <div style={{fontSize:15,color:"#4a5568",lineHeight:1.55,fontWeight:500,marginBottom:16}}>{companionMessage}</div>
            <div style={{height:9,borderRadius:999,background:"#edf2f7",overflow:"hidden",marginBottom:8}}>
              <div style={{height:"100%",width:`${todayPct}%`,borderRadius:999,background:"linear-gradient(90deg,#4f5d75,#38bdf8)",transition:"width 0.5s ease"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#718096",fontWeight:700}}>
              <span>{doneToday}/{activeHabits.length} active habits complete</span>
              <span>{activeHabits.length ? "Keep it gentle" : "Ready when you are"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S HABITS */}
      {activeHabits.length > 0 && (
        <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{fontSize:12,color:"#718096",fontWeight:750,textTransform:"uppercase",letterSpacing:.4,marginBottom:2}}>Today</div>
              <div style={{fontSize:21,fontWeight:850,color:"#1a202c"}}>Focused habits</div>
            </div>
            <button onClick={()=>onSetTab("habits")} style={{fontSize:13,color:"#2e3a59",fontWeight:750,background:"none",border:"none",cursor:"pointer"}}>See all</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
            {activeHabits.slice(0,5).map(h=>{
              const done = h.completions?.[todayStr]
              return (
                <div key={h.id} style={{minHeight:74,padding:"13px 14px",borderRadius:20,background:"var(--card-surface,#ffffff)",border:`1px solid ${done?"rgba(46,58,89,0.18)":"rgba(8,28,80,0.08)"}`,boxShadow:"0 12px 30px rgba(8,28,50,0.05)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:13}}>
                    <div style={{width:48,height:48,borderRadius:16,background:`${h.color}16`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,border:`1px solid ${h.color}20`}}>{h.emoji}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div className="habit-name" style={{fontSize:15,fontWeight:750,color:"#1a202c",marginBottom:5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{h.name}</div>
                    </div>
                    <button onClick={()=>onToggle(h.id,todayStr)} style={{padding:"9px 15px",fontSize:13,fontWeight:800,flexShrink:0,borderRadius:999,cursor:"pointer",border:done?"1px solid rgba(46,58,89,0.16)":"1px solid rgba(8,28,80,0.1)",background:done?"#edf2f7":"#ffffff",color:done?"#2e3a59":"#1f3528",boxShadow:"0 8px 20px rgba(8,28,50,0.05)"}}>{done?"Done":"Log"}</button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {activeHabits.length === 0 && (
        <div style={{padding:"26px 22px",borderRadius:24,background:"var(--card-surface,#ffffff)",border:"1px solid rgba(8,28,80,0.08)",boxShadow:"0 14px 36px rgba(8,28,50,0.06)",textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:18,fontWeight:850,color:"#1a202c",marginBottom:8}}>Start with one tiny habit</div>
          <div style={{fontSize:14,color:"#607067",lineHeight:1.55,marginBottom:18}}>Choose a starter template or create something simple enough to repeat tomorrow.</div>
          <button onClick={onTemplates} style={{padding:"12px 18px",borderRadius:999,border:"none",background:"#2e3a59",color:"#fff",fontWeight:850,cursor:"pointer"}}>Browse Templates</button>
        </div>
      )}

      {/* COACH INSIGHT */}
      <div style={{padding:"18px 18px",marginBottom:14,borderRadius:24,background:"var(--card-surface,#ffffff)",border:"1px solid rgba(8,28,80,0.08)",boxShadow:"0 14px 36px rgba(8,28,50,0.05)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:14}}>
          <div>
            <div style={{fontSize:12,fontWeight:800,color:"#607067",letterSpacing:.4,textTransform:"uppercase",marginBottom:6}}>Coach insight</div>
            <div style={{fontSize:17,fontWeight:800,color:"#1a202c",marginBottom:6}}>{pacerCopy.label}</div>
            <div style={{fontSize:13,color:"#4a5568",lineHeight:1.55,fontWeight:500}}>{pacerCopy.detail}</div>
          </div>
          <button onClick={onOpenAI} style={{padding:"9px 12px",fontSize:12,fontWeight:800,borderRadius:999,border:"1px solid rgba(46,58,89,0.14)",background:"#edf2f7",color:"#2e3a59",whiteSpace:"nowrap",cursor:"pointer"}}>Open coach</button>
        </div>
      </div>

      {/* RECOVERY + MOMENTUM */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {[
          {label:"Recovery",value:`${freezes}/${maxFreezes}`,detail:freezes>0?"Safety net ready":`${daysToNextShield} days to shield`,color:"#38bdf8"},
          {label:"Momentum",value:`${bestStreak}d`,detail:"Best current rhythm",color:"#4f5d75"},
        ].map(item=>(
          <div key={item.label} style={{padding:"16px 15px",borderRadius:22,background:"var(--card-surface,#ffffff)",border:"1px solid rgba(8,28,80,0.08)",boxShadow:"0 12px 30px rgba(8,28,50,0.05)"}}>
            <div style={{fontSize:11,fontWeight:800,color:"#7a867d",textTransform:"uppercase",letterSpacing:.4,marginBottom:8}}>{item.label}</div>
            <div style={{fontSize:28,fontWeight:850,color:item.color,lineHeight:1,marginBottom:7}}>{item.value}</div>
            <div style={{fontSize:12,color:"#607067",fontWeight:550,lineHeight:1.35}}>{item.detail}</div>
          </div>
        ))}
      </div>

      {/* WATER + STEPS */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <div style={{padding:"16px 15px",borderRadius:22,background:"var(--card-surface,#ffffff)",border:"1px solid rgba(8,28,80,0.08)",boxShadow:"0 12px 30px rgba(8,28,50,0.05)"}}>
          <div style={{fontSize:11,fontWeight:800,color:"#7a867d",textTransform:"uppercase",letterSpacing:.4,marginBottom:8}}>Water</div>
          <div style={{fontSize:24,fontWeight:850,color:"#1a202c",marginBottom:10}}>{water}<span style={{fontSize:13,color:"#7a867d",fontWeight:600}}> / 8</span></div>
          <div style={{height:7,borderRadius:999,background:"#edf2f7",overflow:"hidden",marginBottom:10}}>
            <div style={{height:"100%",width:waterPct+"%",background:"#38bdf8",borderRadius:999}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>onAddWater(-1)} style={{flex:1,padding:"8px 0",borderRadius:999,border:"1px solid rgba(8,28,80,0.1)",background:"#fff",color:"#1f3528",fontWeight:800,cursor:"pointer"}}>−</button>
            <button onClick={()=>onAddWater(1)} style={{flex:1,padding:"8px 0",borderRadius:999,border:"none",background:"#edf2f7",color:"#2e3a59",fontWeight:800,cursor:"pointer"}}>+</button>
          </div>
        </div>
        <div style={{padding:"16px 15px",borderRadius:22,background:"var(--card-surface,#ffffff)",border:"1px solid rgba(8,28,80,0.08)",boxShadow:"0 12px 30px rgba(8,28,50,0.05)"}}>
          <div style={{fontSize:11,fontWeight:800,color:"#7a867d",textTransform:"uppercase",letterSpacing:.4,marginBottom:8}}>Steps</div>
          <div style={{fontSize:24,fontWeight:850,color:"#1a202c",marginBottom:10}}>{steps.toLocaleString()}</div>
          <div style={{height:7,borderRadius:999,background:"#edf2f7",overflow:"hidden",marginBottom:10}}>
            <div style={{height:"100%",width:stepsPct+"%",background:"#38bdf8",borderRadius:999}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>onAddSteps(500)} style={{flex:1,padding:"8px 0",borderRadius:999,border:"1px solid rgba(8,28,80,0.1)",background:"#fff",color:"#1f3528",fontWeight:800,cursor:"pointer"}}>+500</button>
            <button onClick={()=>onAddSteps(1000)} style={{flex:1,padding:"8px 0",borderRadius:999,border:"none",background:"#edf2f7",color:"#2e3a59",fontWeight:800,cursor:"pointer"}}>+1k</button>
          </div>
        </div>
      </div>

      {/* REWARDS */}
      <div style={{padding:"16px 18px",marginBottom:14,borderRadius:24,background:"var(--card-surface,#ffffff)",border:"1px solid rgba(8,28,80,0.08)",boxShadow:"0 12px 30px rgba(8,28,50,0.05)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginBottom:12}}>
          <div>
            <div style={{fontSize:12,fontWeight:800,color:"#607067",letterSpacing:.4,textTransform:"uppercase",marginBottom:4}}>Rewards</div>
            <div style={{fontSize:17,fontWeight:800,color:"#1a202c"}}>{currentLevel.title}</div>
          </div>
          <div style={{fontSize:13,color:"#2e3a59",fontWeight:800}}>{displayXP} XP</div>
        </div>
        <div style={{height:7,borderRadius:999,background:"#edf2f7",overflow:"hidden",marginBottom:8}}>
          <div style={{height:"100%",width:xpPct+"%",background:"linear-gradient(90deg,#4f5d75,#38bdf8)",transition:"width 0.8s ease",borderRadius:999}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#718096",fontWeight:650}}>
          <span>{nextLevel ? `${xpPct}% complete` : "Top level"}</span>
          <span>{nextLevel ? `${levelXP}/${levelXPNeeded}` : `${displayXP} lifetime XP`}</span>
        </div>
      </div>

      {/* DAILY QUESTS */}
      {dailyQuests.length > 0 && (
        <div style={{padding:"16px 18px",marginBottom:14,borderRadius:24,background:"var(--card-surface,#ffffff)",border:"1px solid rgba(8,28,80,0.08)",boxShadow:"0 12px 30px rgba(8,28,50,0.05)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginBottom:12}}>
            <div>
              <div style={{fontSize:12,fontWeight:800,color:"#607067",letterSpacing:.4,textTransform:"uppercase",marginBottom:4}}>Achievements</div>
              <div style={{fontSize:17,fontWeight:800,color:"#1a202c"}}>Small wins for today</div>
            </div>
            <div style={{fontSize:12,color:"#2e3a59",fontWeight:800,background:"#edf2f7",border:"1px solid rgba(46,58,89,0.12)",borderRadius:999,padding:"6px 9px"}}>+{DAILY_QUEST_BONUS_XP} XP</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {dailyQuests.map(q=>{
              const pct = Math.min(100, Math.round((q.progress/q.target)*100))
              return (
                <div key={q.id} style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10,alignItems:"center",padding:"11px 12px",borderRadius:16,background:q.awarded?"#edf2f7":"#f8f9fb",border:q.awarded?"1px solid rgba(46,58,89,0.16)":"1px solid rgba(8,28,80,0.06)"}}>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:750,color:"#1a202c",marginBottom:3}}>{q.title}</div>
                    <div style={{fontSize:11,color:"#718096",fontWeight:550,marginBottom:7,lineHeight:1.35}}>{q.awarded?"Bonus XP added. Nicely done.":q.detail}</div>
                    <div style={{height:5,borderRadius:999,background:"#edf2f7",overflow:"hidden"}}>
                      <div style={{height:"100%",width:pct+"%",borderRadius:999,background:q.complete?"#4f5d75":"#38bdf8",transition:"width 0.5s ease"}}/>
                    </div>
                  </div>
                  <div style={{fontSize:12,fontWeight:800,color:q.awarded?"#2e3a59":"#7a867d",whiteSpace:"nowrap"}}>{q.progress}/{q.target}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* WEEKLY REFLECTION */}
      {activeHabits.length > 0 && (
        <div style={{padding:"16px 18px",marginBottom:14,borderRadius:24,background:"var(--card-surface,#ffffff)",border:"1px solid rgba(8,28,80,0.08)",boxShadow:"0 12px 30px rgba(8,28,50,0.05)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:12}}>
            <div>
              <div style={{fontSize:12,fontWeight:800,color:"#607067",letterSpacing:.4,textTransform:"uppercase",marginBottom:4}}>Reflection</div>
              <div style={{fontSize:17,fontWeight:800,color:"#1a202c"}}>Your last 7 days</div>
            </div>
            <button onClick={onWeeklyRecap} disabled={weeklyRecapLoading} style={{padding:"8px 11px",fontSize:12,fontWeight:800,whiteSpace:"nowrap",borderRadius:999,border:"1px solid rgba(8,28,80,0.1)",background:"#fff",color:"#1f3528",cursor:"pointer"}}>
              {weeklyRecapLoading?"Writing...":"AI recap"}
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:weeklyRecap||weeklyRecapError?12:0}}>
            {[
              {label:"Completed",value:weeklySummary.completed},
              {label:"Missed",value:weeklySummary.missed},
              {label:"Best",value:`${weeklySummary.bestStreak}d`},
              {label:"XP",value:weeklySummary.xpGained},
            ].map(item=>(
              <div key={item.label} style={{padding:"10px 11px",borderRadius:15,background:"#f8f9fb",border:"1px solid rgba(8,28,80,0.06)"}}>
                <div style={{fontSize:10,fontWeight:750,color:"#7a867d",textTransform:"uppercase",letterSpacing:.3,marginBottom:4}}>{item.label}</div>
                <div style={{fontSize:18,fontWeight:800,color:"#1a202c"}}>{item.value}</div>
              </div>
            ))}
          </div>
          {weeklyRecap && (
            <div style={{fontSize:13,color:"#4a5568",lineHeight:1.55,fontWeight:500,padding:"12px",borderRadius:16,background:"#f8f9fb",border:"1px solid rgba(8,28,80,0.06)"}}>
              {weeklyRecap}
            </div>
          )}
          {weeklyRecapError && (
            <div style={{fontSize:11,color:"#7a867d",fontWeight:650,marginTop:8,lineHeight:1.35}}>{weeklyRecapError}</div>
          )}
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <button onClick={onTemplates} style={{padding:14,fontSize:13,fontWeight:800,background:"#ffffff",color:"#1f3528",border:"1px solid rgba(8,28,80,0.08)",borderRadius:18,boxShadow:"0 10px 26px rgba(8,28,50,0.05)",cursor:"pointer"}}>Templates</button>
        <button onClick={onAdd} style={{padding:14,fontSize:13,fontWeight:800,background:"#2e3a59",color:"#ffffff",border:"none",borderRadius:18,boxShadow:"0 12px 28px rgba(46,58,89,0.16)",cursor:"pointer"}}>New Habit</button>
      </div>

    </div>
  )
}
