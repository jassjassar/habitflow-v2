export default function SettingsScreen({
  userName,
  currentLevel,
  displayXP,
  isPro,
  onOpenPaywall,
  onOpenNotifications,
  onOpenAI,
  onOpenTemplates,
  onSignOut,
}) {
  const menuItems = [
    { icon:"⭐", label:isPro ? "Pro Active" : "Upgrade to Pro", fn:onOpenPaywall, color:"#f59e0b", isSignOut:false },
    { icon:"🔔", label:"Reminder Notifications",  fn:onOpenNotifications, color:"#1f7a4d", isSignOut:false },
    { icon:"🤖", label:"AI Coach",                fn:onOpenAI,            color:"#1f7a4d", isSignOut:false },
    { icon:"📋", label:"Templates",               fn:onOpenTemplates,     color:"#1f7a4d", isSignOut:false },
    { icon:"↪",  label:"Sign Out",                fn:onSignOut,           color:"#dc2626", isSignOut:true  },
  ]

  return (
    <div className="fade-up">

      {/* HEADER */}
      <div style={{marginBottom:20}}>
        <div style={{fontSize:12,color:"#6d786f",fontWeight:750,textTransform:"uppercase",letterSpacing:.4,marginBottom:2}}>Your</div>
        <div style={{fontSize:22,fontWeight:900,color:"#152118"}}>Settings</div>
      </div>

      {/* PROFILE CARD */}
      <div style={{padding:"20px",marginBottom:14,borderRadius:24,background:"var(--card-surface,#ffffff)",border:"1px solid rgba(31,53,40,0.08)",boxShadow:"0 14px 34px rgba(24,35,29,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:54,height:54,borderRadius:18,background:"linear-gradient(135deg,#1f7a4d,#2d9c65)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:"#ffffff",boxShadow:"0 4px 16px rgba(31,122,77,0.2)",flexShrink:0}}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:17,fontWeight:800,color:"#152118",marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{userName}</div>
            <div style={{fontSize:12,color:"#6d786f",fontWeight:500}}>{currentLevel.icon} {currentLevel.title} · {displayXP} XP</div>
          </div>
          {isPro && (
            <div style={{background:"#f59e0b",borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:800,color:"#ffffff",flexShrink:0}}>
              PRO ⭐
            </div>
          )}
        </div>
      </div>

      {/* MENU */}
      <div style={{borderRadius:24,background:"var(--card-surface,#ffffff)",border:"1px solid rgba(31,53,40,0.08)",boxShadow:"0 14px 34px rgba(24,35,29,0.06)",overflow:"hidden",marginBottom:14}}>
        {menuItems.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); item.fn() }}
            style={{
              width:"100%",
              padding:"16px 18px",
              border:"none",
              borderBottom: i < menuItems.length - 1 ? "1px solid rgba(31,53,40,0.06)" : "none",
              borderRadius:0,
              display:"flex",
              alignItems:"center",
              gap:14,
              fontSize:15,
              background:"transparent",
              textAlign:"left",
              cursor:"pointer",
              fontFamily:"'Inter',sans-serif",
              transition:"background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background="#f7faf5"}
            onMouseLeave={e => e.currentTarget.style.background="transparent"}
          >
            <span style={{fontSize:20,color:item.color,flexShrink:0}}>{item.icon}</span>
            <span style={{fontWeight:600,color:item.isSignOut ? "#dc2626" : "#1f3528",flex:1}}>{item.label}</span>
            {!item.isSignOut && <span style={{color:"#9aad9f",fontSize:16}}>›</span>}
          </button>
        ))}
      </div>

      {/* FOOTER */}
      <div style={{textAlign:"center",fontSize:12,color:"#9aad9f",padding:"8px 0",lineHeight:1.6}}>
        HabitFlow v3.0 · Made with 💚<br/>contact@thehabitflow.app
      </div>

    </div>
  )
}
