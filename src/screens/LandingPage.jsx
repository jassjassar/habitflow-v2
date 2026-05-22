export default function LandingPage({ onSignIn, onGoogleSignIn }) {
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#f0fdf4 0%,#fbfdf9 40%,#f0f9ff 100%)",fontFamily:"'Inter',sans-serif",color:"#1a202c",overflowX:"hidden"}}>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:20,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px clamp(20px,5vw,48px)",background:"rgba(251,253,249,0.88)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid rgba(31,53,40,0.07)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,fontSize:18,fontWeight:900,color:"#1a202c"}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#d9f99d,#86efac 52%,#4ade80)",display:"inline-flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(34,197,94,0.25)"}}>
            <div style={{width:12,height:12,borderRadius:"50%",background:"#2e3a59"}}/>
          </div>
          HabitFlow
        </div>
        <button onClick={onSignIn} style={{padding:"9px 20px",fontSize:14,fontWeight:700,borderRadius:999,border:"1px solid rgba(31,53,40,0.14)",background:"#ffffff",color:"#1f3528",cursor:"pointer",fontFamily:"'Inter',sans-serif",boxShadow:"0 2px 8px rgba(26,32,44,0.06)"}}>Sign In</button>
      </nav>

      {/* HERO */}
      <main style={{padding:"52px clamp(20px,5vw,48px) 0",maxWidth:520,margin:"0 auto"}}>

        {/* BADGE */}
        <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"7px 14px",borderRadius:999,background:"#edf2f7",border:"1px solid rgba(46,58,89,0.15)",marginBottom:28}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#2e3a59",animation:"pulse 2s ease-in-out infinite"}}/>
          <span style={{fontSize:13,fontWeight:700,color:"#2e3a59"}}>Your growth starts here</span>
        </div>

        {/* HEADLINE */}
        <h1 style={{fontSize:"clamp(38px,8vw,58px)",fontWeight:900,lineHeight:1.06,letterSpacing:"-0.02em",color:"#0f1f15",marginBottom:20}}>
          Build the habits of<br/>
          <span style={{color:"#2e3a59"}}>your future self.</span>
        </h1>

        <p style={{fontSize:"clamp(16px,2vw,18px)",color:"#536257",lineHeight:1.7,marginBottom:36,maxWidth:440}}>
          A calm, intelligent companion that helps you stay consistent — without pressure, guilt, or burnout.
        </p>

        {/* CTA BUTTONS */}
        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20,maxWidth:360}}>
          <button onClick={onSignIn} style={{padding:"17px 28px",fontSize:16,fontWeight:800,borderRadius:16,border:"none",background:"#2e3a59",color:"#fff",boxShadow:"0 8px 28px rgba(46,58,89,0.28)",cursor:"pointer",fontFamily:"'Inter',sans-serif",letterSpacing:"-0.01em"}}>
            Start your growth journey →
          </button>
          <button onClick={onGoogleSignIn} style={{padding:"15px 22px",fontSize:15,fontWeight:600,borderRadius:16,border:"1px solid rgba(31,53,40,0.12)",background:"#ffffff",color:"#1f3528",cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:"0 2px 8px rgba(26,32,44,0.06)"}}>
            <span style={{fontWeight:900,color:"#4285F4",fontSize:16}}>G</span>
            Continue with Google
          </button>
        </div>

        <p style={{fontSize:13,color:"#9aad9f",fontWeight:500,marginBottom:52}}>Free to start · No credit card · Cancel anytime</p>

        {/* PREVIEW CARD */}
        <div style={{borderRadius:28,background:"#ffffff",border:"1px solid rgba(31,53,40,0.08)",boxShadow:"0 24px 64px rgba(26,32,44,0.10)",padding:"24px",marginBottom:0,overflow:"hidden"}}>

          {/* CARD TOP */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <div style={{width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,#2e3a59,#4f5d75)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 4px 12px rgba(46,58,89,0.2)"}}>•‿•</div>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:"#1a202c",marginBottom:2}}>Growth Companion</div>
              <div style={{fontSize:12,color:"#6d786f"}}>Today feels steady. Keep going.</div>
            </div>
            <div style={{marginLeft:"auto",background:"#edf2f7",borderRadius:999,padding:"5px 12px",fontSize:12,fontWeight:700,color:"#2e3a59"}}>On track</div>
          </div>

          {/* PROGRESS */}
          <div style={{marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:13,fontWeight:600,color:"#1a202c"}}>Today's habits</span>
              <span style={{fontSize:13,fontWeight:700,color:"#2e3a59"}}>3 / 4</span>
            </div>
            <div style={{height:8,borderRadius:999,background:"#e7efe5",overflow:"hidden"}}>
              <div style={{height:"100%",width:"75%",borderRadius:999,background:"linear-gradient(90deg,#2e3a59,#22c55e)"}}/>
            </div>
          </div>

          {/* HABIT LIST */}
          {[
            {emoji:"🧘",name:"Morning meditation",done:true},
            {emoji:"📚",name:"Read 20 minutes",done:true},
            {emoji:"💧",name:"Drink 8 glasses",done:true},
            {emoji:"🚶",name:"Evening walk",done:false},
          ].map((h,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<3?"1px solid rgba(31,53,40,0.05)":"none"}}>
              <div style={{width:36,height:36,borderRadius:11,background:h.done?"#edf2f7":"#f4f8f2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,border:`1px solid ${h.done?"rgba(46,58,89,0.15)":"rgba(31,53,40,0.06)"}`}}>{h.emoji}</div>
              <span style={{flex:1,fontSize:14,fontWeight:600,color:h.done?"#1a202c":"#9aad9f"}}>{h.name}</span>
              <div style={{width:22,height:22,borderRadius:"50%",background:h.done?"#2e3a59":"#e7efe5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#ffffff",fontWeight:800}}>{h.done?"✓":""}</div>
            </div>
          ))}

          {/* STREAK ROW */}
          <div style={{marginTop:16,padding:"12px 14px",borderRadius:14,background:"linear-gradient(135deg,#f0fdf4,#f0f9ff)",border:"1px solid rgba(31,53,40,0.06)",display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:22}}>🔥</div>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:"#1a202c"}}>14-day streak</div>
              <div style={{fontSize:11,color:"#6d786f",fontWeight:500}}>Shield earned · Keep it going</div>
            </div>
            <div style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:"#2e3a59",background:"#edf2f7",padding:"4px 10px",borderRadius:999}}>+45 XP</div>
          </div>
        </div>

        {/* SOCIAL PROOF */}
        <div style={{padding:"32px 0 24px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <div style={{display:"flex"}}>
            {["🧑","👩","🧔","👧","🧑‍🦱"].map((f,i)=>(
              <div key={i} style={{width:30,height:30,borderRadius:"50%",background:`hsl(${140+i*15},40%,${75+i*3}%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginLeft:i>0?-8:0,border:"2px solid #fbfdf9"}}>{f}</div>
            ))}
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#1a202c"}}>2,400+ people growing daily</div>
            <div style={{fontSize:12,color:"#6d786f"}}>Average 68% habit completion rate</div>
          </div>
        </div>

        {/* FEATURES */}
        <div style={{display:"flex",flexDirection:"column",gap:12,paddingBottom:100}}>
          {[
            {icon:"🤖",title:"AI Growth Coach",desc:"Personalized guidance that adapts to your patterns and energy."},
            {icon:"🛡️",title:"Gentle Recovery",desc:"Miss a day? Your streak is protected. No shame, just momentum."},
            {icon:"📈",title:"Momentum Tracking",desc:"Visual progress that makes consistency feel rewarding, not stressful."},
          ].map(f=>(
            <div key={f.title} style={{display:"flex",gap:14,padding:"16px",borderRadius:18,background:"#ffffff",border:"1px solid rgba(31,53,40,0.07)",boxShadow:"0 4px 16px rgba(26,32,44,0.04)"}}>
              <div style={{width:40,height:40,borderRadius:12,background:"#edf2f7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{f.icon}</div>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:"#1a202c",marginBottom:4}}>{f.title}</div>
                <div style={{fontSize:13,color:"#536257",lineHeight:1.55}}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* STICKY BOTTOM CTA */}
        <div style={{position:"sticky",bottom:0,background:"linear-gradient(0deg,#fbfdf9 70%,transparent)",padding:"20px 0 32px",marginTop:-32}}>
          <button onClick={onSignIn} style={{width:"100%",padding:"17px",fontSize:16,fontWeight:800,borderRadius:16,border:"none",background:"#1a202c",color:"#fff",cursor:"pointer",fontFamily:"'Inter',sans-serif",boxShadow:"0 8px 24px rgba(15,31,21,0.2)",letterSpacing:"-0.01em"}}>
            Begin your transformation →
          </button>
        </div>

      </main>

      <style>{`
        @keyframes pulse {
          0%,100%{opacity:0.6;transform:scale(1)}
          50%{opacity:1;transform:scale(1.3)}
        }
      `}</style>
    </div>
  )
}
