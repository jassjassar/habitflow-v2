export default function AuthPage({
  authMode,
  email,
  password,
  authErr,
  authLoading,
  setEmail,
  setPassword,
  onToggleMode,
  onSignInEmail,
  onGoogleSignIn,
  onBack,
}) {
  return (
    <div className="auth-page-wrapper" style={{minHeight:"100vh",background:"linear-gradient(160deg,#f0fdf4 0%,#fbfdf9 50%,#f0f9ff 100%)","--bg":"#fbfdf9","--card":"rgba(255,255,255,0.98)","--card-bg":"rgba(255,255,255,0.98)","--text":"#1a202c","--text-primary":"#1a202c","--text-secondary":"#536257","--text-muted":"#6d786f","--border":"rgba(46,58,89,0.10)","--button-bg":"rgba(46,58,89,0.06)","--input-bg":"#fbfdf9",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px",fontFamily:"'Inter',sans-serif"}}>

      {/* LOGO */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:36}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#d9f99d,#86efac 52%,#4ade80)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(34,197,94,0.25)"}}>
          <div style={{width:14,height:14,borderRadius:"50%",background:"#2e3a59"}}/>
        </div>
        <span className="auth-logo-text" style={{fontSize:20, fontWeight:900, color:"#1a202c"}}>HabitFlow</span>
      </div>

      {/* CARD */}
      <div style={{width:"100%",maxWidth:400,background:"#ffffff",borderRadius:28,border:"1px solid rgba(46,58,89,0.08)",boxShadow:"0 24px 64px rgba(8,28,50,0.10)",padding:"32px 28px"}}>

        {/* HEADING */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:24,fontWeight:900,color:"#1a202c",marginBottom:6}}>
            {authMode==="login" ? "Welcome back" : "Start growing"}
          </div>
          <div style={{fontSize:14,color:"#6d786f",fontWeight:500}}>
            {authMode==="login" ? "Sign in to continue your journey." : "Create your free account today."}
          </div>
        </div>

        {/* GOOGLE */}
        <button
          onClick={onGoogleSignIn}
          style={{width:"100%",padding:"13px 20px",fontSize:14,fontWeight:700,borderRadius:14,border:"1px solid rgba(46,58,89,0.12)",background:"#ffffff",color:"#1f3528",cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:20,boxShadow:"0 2px 8px rgba(8,28,50,0.06)",transition:"all 0.15s"}}
        >
          <span style={{fontWeight:900,color:"#4285F4",fontSize:17}}>G</span>
          Continue with Google
        </button>

        {/* DIVIDER */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{flex:1,height:1,background:"rgba(46,58,89,0.08)"}}/>
          <span style={{fontSize:12,color:"#9aad9f",fontWeight:600}}>or</span>
          <div style={{flex:1,height:1,background:"rgba(46,58,89,0.08)"}}/>
        </div>

        {/* INPUTS */}
        <input
          value={email}
          onChange={e=>setEmail(e.target.value)}
          placeholder="Email address"
          type="email"
          style={{width:"100%",padding:"13px 16px",fontSize:14,borderRadius:14,border:"1px solid rgba(46,58,89,0.12)",background:"#fbfdf9",color:"#1a202c",fontFamily:"'Inter',sans-serif",outline:"none",marginBottom:12,boxSizing:"border-box",transition:"border-color 0.2s"}}
          onFocus={e=>e.target.style.borderColor="#2e3a59"}
          onBlur={e=>e.target.style.borderColor="rgba(46,58,89,0.12)"}
        />
        <input
          value={password}
          onChange={e=>setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          style={{width:"100%",padding:"13px 16px",fontSize:14,borderRadius:14,border:"1px solid rgba(46,58,89,0.12)",background:"#fbfdf9",color:"#1a202c",fontFamily:"'Inter',sans-serif",outline:"none",marginBottom:20,boxSizing:"border-box",transition:"border-color 0.2s"}}
          onFocus={e=>e.target.style.borderColor="#2e3a59"}
          onBlur={e=>e.target.style.borderColor="rgba(46,58,89,0.12)"}
          onKeyDown={e=>e.key==="Enter"&&onSignInEmail()}
        />

        {/* ERROR */}
        {authErr && (
          <div style={{fontSize:13,color:authErr.includes("✅")?"#2e3a59":"#dc2626",marginBottom:16,textAlign:"center",fontWeight:600,padding:"10px 14px",borderRadius:12,background:authErr.includes("✅")?"#edf2f7":"#fef2f2",border:`1px solid ${authErr.includes("✅")?"rgba(46,58,89,0.2)":"rgba(220,38,38,0.2)"}`}}>
            {authErr}
          </div>
        )}

        {/* SUBMIT */}
        <button
          onClick={onSignInEmail}
          disabled={authLoading}
          style={{width:"100%",padding:"15px 20px",fontSize:15,fontWeight:800,borderRadius:14,border:"none",background:"#2e3a59",color:"#ffffff",boxShadow:"0 8px 24px rgba(46,58,89,0.22)",cursor:authLoading?"not-allowed":"pointer",opacity:authLoading?0.7:1,marginBottom:20,fontFamily:"'Inter',sans-serif",letterSpacing:"-0.01em"}}
        >
          {authLoading ? "Loading..." : authMode==="login" ? "Sign In →" : "Create Account →"}
        </button>

        {/* TOGGLE */}
        <div style={{textAlign:"center",fontSize:13,color:"#6d786f"}}>
          {authMode==="login" ? "Don't have an account? " : "Already have one? "}
          <span onClick={onToggleMode} style={{color:"#2e3a59",cursor:"pointer",fontWeight:700}}>
            {authMode==="login" ? "Sign Up" : "Sign In"}
          </span>
        </div>
      </div>

      {/* BACK */}
      <div style={{marginTop:20}}>
        <span onClick={onBack} style={{fontSize:13,color:"#9aad9f",cursor:"pointer",fontWeight:600}}>← Back to home</span>
      </div>

    </div>
  )
}
