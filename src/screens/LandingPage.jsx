/**
 * src/screens/LandingPage.jsx
 *
 * Extracted verbatim from App.jsx — the `if (page==="landing") return (...)` block.
 *
 * EXTRACTION NOTES:
 *   - Zero JSX changes. Zero copy changes. Zero style changes.
 *   - <style>{css}</style> removed here — css is rendered by App.jsx
 *     loading/auth/main branches which always run first, so CSS is
 *     already in the DOM before this component mounts.
 *   - setPage('auth') → replaced with onSignIn() prop call (3 occurrences)
 *   - signInGoogle → replaced with onGoogleSignIn prop (1 occurrence)
 *
 * PROPS:
 *   onSignIn        () => void   navigate to auth screen
 *   onGoogleSignIn  () => void   trigger Google OAuth
 */
export default function LandingPage({ onSignIn, onGoogleSignIn }) {
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#fbfdf9 0%,#f4f8f2 58%,#ffffff 100%)",fontFamily:"'Inter',sans-serif",color:"#18231d",overflow:"hidden"}}>
      <nav style={{position:"sticky",top:0,zIndex:20,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px clamp(20px,5vw,64px)",background:"rgba(251,253,249,0.82)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",borderBottom:"1px solid rgba(24,35,29,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,fontSize:19,fontWeight:900,color:"#1f3528",letterSpacing:0}}>
          <span style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#d9f99d,#86efac 52%,#67e8f9)",display:"inline-flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 24px rgba(34,197,94,0.16)"}}>
            <span style={{width:14,height:14,borderRadius:"50%",background:"#1f7a4d",display:"block"}}/>
          </span>
          HabitFlow
        </div>
        <button onClick={onSignIn} style={{padding:"10px 18px",fontSize:14,fontWeight:800,borderRadius:999,border:"1px solid rgba(31,53,40,0.14)",background:"#ffffff",color:"#1f3528",boxShadow:"0 8px 24px rgba(24,35,29,0.06)",cursor:"pointer"}}>Sign In</button>
      </nav>

      <main style={{position:"relative",zIndex:1,padding:"44px clamp(20px,5vw,64px) 36px"}}>
        <section className="fade-up" style={{maxWidth:1120,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:44,alignItems:"center"}}>
          <div style={{maxWidth:560}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:999,background:"#eef8e9",border:"1px solid rgba(47,102,72,0.12)",color:"#2f6648",fontSize:13,fontWeight:800,marginBottom:24}}>
              AI-powered habit growth
            </div>
            <h1 style={{fontSize:"clamp(42px,7vw,76px)",fontWeight:900,lineHeight:1.02,marginBottom:22,letterSpacing:0,color:"#152118"}}>
              Build habits that feel sustainable.
            </h1>
            <p style={{fontSize:"clamp(17px,2vw,20px)",color:"#536257",maxWidth:520,margin:"0 0 30px",lineHeight:1.65}}>
              An AI-powered growth companion that helps you stay consistent without pressure.
            </p>
            <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap",marginBottom:14}}>
              <button onClick={onSignIn} style={{padding:"16px 28px",fontSize:16,fontWeight:900,borderRadius:999,border:"none",background:"#1f7a4d",color:"#fff",boxShadow:"0 18px 36px rgba(31,122,77,0.22)",cursor:"pointer"}}>Start Free</button>
              <button onClick={onGoogleSignIn} style={{padding:"15px 22px",fontSize:15,fontWeight:850,borderRadius:999,border:"1px solid rgba(24,35,29,0.12)",background:"#ffffff",color:"#1f3528",boxShadow:"0 12px 28px rgba(24,35,29,0.07)",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:10}}>
                <span style={{fontWeight:900,color:"#4285F4",fontSize:16}}>G</span>
                Continue with Google
              </button>
            </div>
            <div style={{fontSize:13,color:"#6d786f",fontWeight:700,marginBottom:22}}>Free to start · No credit card needed</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {["5 focused habits","Gentle recovery","Adaptive coaching"].map(pill=>(
                <span key={pill} style={{padding:"9px 12px",borderRadius:999,background:"rgba(255,255,255,0.72)",border:"1px solid rgba(31,53,40,0.09)",color:"#375240",fontSize:13,fontWeight:800,boxShadow:"0 8px 24px rgba(24,35,29,0.04)"}}>{pill}</span>
              ))}
            </div>
          </div>

          <div style={{display:"flex",justifyContent:"center"}}>
            <div style={{position:"relative",width:"min(78vw,390px)",aspectRatio:"1/1",borderRadius:"50%",background:"linear-gradient(145deg,#ffffff,#eef7eb)",boxShadow:"0 28px 80px rgba(47,102,72,0.14), inset 0 1px 0 rgba(255,255,255,0.9)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(47,102,72,0.08)"}}>
              <svg viewBox="0 0 260 260" style={{position:"absolute",inset:"8%",transform:"rotate(-90deg)"}} aria-hidden="true">
                <circle cx="130" cy="130" r="106" fill="none" stroke="#e7efe5" strokeWidth="18"/>
                <circle cx="130" cy="130" r="106" fill="none" stroke="url(#growthGradient)" strokeWidth="18" strokeLinecap="round" strokeDasharray="468 666"/>
                <defs>
                  <linearGradient id="growthGradient" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#84cc16"/>
                    <stop offset="52%" stopColor="#22c55e"/>
                    <stop offset="100%" stopColor="#14b8a6"/>
                  </linearGradient>
                </defs>
              </svg>
              <div style={{position:"relative",width:"58%",aspectRatio:"1/1",borderRadius:"50%",background:"#ffffff",boxShadow:"inset 0 0 0 1px rgba(31,53,40,0.08),0 18px 40px rgba(24,35,29,0.08)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
                <div style={{fontSize:48,fontWeight:900,color:"#1f7a4d",lineHeight:1}}>68%</div>
                <div style={{fontSize:13,fontWeight:850,color:"#607067",marginTop:8}}>steady growth</div>
              </div>
              <div style={{position:"absolute",right:"3%",top:"18%",padding:"12px 14px",borderRadius:18,background:"#ffffff",boxShadow:"0 14px 34px rgba(24,35,29,0.1)",border:"1px solid rgba(31,53,40,0.08)"}}>
                <div style={{fontSize:11,fontWeight:900,color:"#7a867d",marginBottom:5}}>TODAY</div>
                <div style={{fontSize:18,fontWeight:900,color:"#1f3528"}}>1 habit</div>
              </div>
              <div style={{position:"absolute",left:"0%",bottom:"15%",padding:"13px 15px",borderRadius:18,background:"#ffffff",boxShadow:"0 14px 34px rgba(24,35,29,0.1)",border:"1px solid rgba(31,53,40,0.08)"}}>
                <div style={{fontSize:11,fontWeight:900,color:"#7a867d",marginBottom:5}}>PACE</div>
                <div style={{fontSize:18,fontWeight:900,color:"#1f3528"}}>gentle</div>
              </div>
            </div>
          </div>
        </section>

        <section style={{maxWidth:1120,margin:"54px auto 0",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:16}}>
          {[
            {t:"Focused Habits",d:"Keep your routine simple and achievable."},
            {t:"Gentle Coaching",d:"Get supportive guidance when momentum drops."},
            {t:"Growth Companion",d:"Watch progress feel alive without pressure."},
          ].map(feature=>(
            <div key={feature.t} style={{padding:24,borderRadius:22,background:"rgba(255,255,255,0.78)",border:"1px solid rgba(31,53,40,0.09)",boxShadow:"0 18px 44px rgba(24,35,29,0.06)"}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#dcfce7,#ccfbf1)",marginBottom:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{width:14,height:14,borderRadius:"50%",background:"#22c55e",display:"block"}}/>
              </div>
              <div style={{fontSize:18,fontWeight:900,color:"#1f3528",marginBottom:8}}>{feature.t}</div>
              <div style={{fontSize:14,lineHeight:1.6,color:"#5d6b62",fontWeight:650}}>{feature.d}</div>
            </div>
          ))}
        </section>

        <section style={{maxWidth:1120,margin:"18px auto 0",padding:"30px 0 46px",textAlign:"center"}}>
          <button onClick={onSignIn} style={{padding:"16px 28px",fontSize:16,fontWeight:900,borderRadius:999,border:"none",background:"#152118",color:"#fff",boxShadow:"0 18px 40px rgba(21,33,24,0.18)",cursor:"pointer"}}>
            Start with one habit today.
          </button>
        </section>
      </main>
    </div>
  )
}
