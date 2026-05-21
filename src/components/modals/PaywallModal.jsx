export default function PaywallModal({
  isPro,
  checkoutLoading,
  checkoutError,
  checkoutNotice,
  onClose,
  onStartCheckout,
}) {
  return (
    <div
      onClick={onClose}
      style={{position:"fixed",inset:0,background:"rgba(15,31,21,0.45)",backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",zIndex:200,display:"flex",alignItems:"flex-end",fontFamily:"'Inter',sans-serif"}}
    >
      <div
        onClick={e=>e.stopPropagation()}
        style={{background:"#ffffff",borderRadius:"28px 28px 0 0",padding:"0 24px 48px",width:"100%",maxHeight:"92vh",overflowY:"auto",boxShadow:"0 -16px 56px rgba(15,31,21,0.16)",border:"1px solid rgba(31,53,40,0.08)",borderBottom:"none"}}
      >
        {/* HANDLE */}
        <div style={{width:36,height:4,background:"#dce8df",borderRadius:2,margin:"14px auto 24px"}}/>

        {/* HEADER */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:64,height:64,borderRadius:20,background:"linear-gradient(135deg,#fef9c3,#fde68a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 16px",boxShadow:"0 8px 24px rgba(245,158,11,0.2)"}}>⭐</div>
          <div style={{fontSize:26,fontWeight:900,color:"#152118",marginBottom:8,letterSpacing:"-0.02em"}}>Unlock Pro</div>
          <div style={{fontSize:15,color:"#536257",lineHeight:1.6,maxWidth:300,margin:"0 auto"}}>
            Everything you need to build habits that actually stick.
          </div>
        </div>

        {/* PRICE */}
        <div style={{textAlign:"center",marginBottom:24,padding:"16px",borderRadius:20,background:"#f9fafb",border:"1px solid rgba(31,53,40,0.06)"}}>
          <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:4}}>
            <span style={{fontSize:42,fontWeight:900,color:"#152118",letterSpacing:"-0.03em"}}>$1.99</span>
            <span style={{fontSize:15,color:"#6d786f",fontWeight:500}}>/month</span>
          </div>
          <div style={{fontSize:13,color:"#9aad9f",marginTop:4}}>Cancel anytime · No commitment</div>
        </div>

        {/* FEATURES */}
        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
          {[
            { icon:"♾️", title:"Unlimited habits",        desc:"Track as many habits as you want" },
            { icon:"📊", title:"Full analytics & XP",     desc:"Deep insights into your progress" },
            { icon:"🤖", title:"Unlimited AI coaching",   desc:"Personalised guidance every day" },
            { icon:"🛡️", title:"Streak shield protection",desc:"Never lose your streak again" },
            { icon:"☁️", title:"Priority cloud sync",     desc:"Your data always backed up" },
          ].map(f=>(
            <div key={f.title} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",borderRadius:16,background:"#f4f8f2",border:"1px solid rgba(31,53,40,0.06)"}}>
              <div style={{width:40,height:40,borderRadius:12,background:"#eef8e9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{f.icon}</div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"#152118",marginBottom:2}}>{f.title}</div>
                <div style={{fontSize:12,color:"#6d786f"}}>{f.desc}</div>
              </div>
              <div style={{marginLeft:"auto",color:"#1f7a4d",fontSize:16,flexShrink:0}}>✓</div>
            </div>
          ))}
        </div>

        {/* NOTICES */}
        {checkoutNotice && (
          <div style={{fontSize:13,color:"#92400e",background:"#fffbeb",border:"1px solid rgba(245,158,11,0.3)",borderRadius:12,padding:"12px 14px",marginBottom:14,fontWeight:600}}>
            {checkoutNotice}
          </div>
        )}
        {checkoutError && (
          <div style={{fontSize:13,color:"#dc2626",background:"#fef2f2",border:"1px solid rgba(220,38,38,0.2)",borderRadius:12,padding:"12px 14px",marginBottom:14,fontWeight:600}}>
            {checkoutError}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={onStartCheckout}
          disabled={checkoutLoading||isPro}
          style={{width:"100%",padding:"17px",fontSize:16,fontWeight:800,borderRadius:16,border:"none",background:isPro?"#e7efe5":"#1f7a4d",color:isPro?"#6d786f":"#ffffff",boxShadow:isPro?"none":"0 8px 28px rgba(31,122,77,0.28)",cursor:checkoutLoading||isPro?"not-allowed":"pointer",opacity:checkoutLoading?0.7:1,marginBottom:12,fontFamily:"'Inter',sans-serif",letterSpacing:"-0.01em"}}
        >
          {checkoutLoading ? "Opening checkout..." : isPro ? "Pro Active ✓" : "Start Pro — $1.99/mo →"}
        </button>
        <button
          onClick={onClose}
          style={{width:"100%",padding:"14px",fontSize:14,fontWeight:600,borderRadius:16,border:"1px solid rgba(31,53,40,0.1)",background:"#ffffff",color:"#6d786f",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}
        >Maybe later</button>

      </div>
    </div>
  )
}
