export default function AICoachModal({
  aiMsgs,
  aiInput,
  aiLoading,
  onSendAI,
  onChangeInput,
  onClose,
}) {
  return (
    <div className="overlay" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="card" style={{maxWidth:480,width:"100%",maxHeight:"88vh",display:"flex",flexDirection:"column",padding:0,overflow:"hidden",margin:"auto"}}>
        <div style={{padding:"18px 20px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:18,fontWeight:900,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🤖 AI Habit Coach</div>
          <button onClick={onClose} className="btn-glass" style={{padding:"5px 11px"}}>✕</button>
        </div>
        <div style={{flex:1,padding:16,overflowY:"auto",minHeight:200}}>
          {aiMsgs.length===0 && (
            <div style={{padding:16}}>
              <div style={{textAlign:"center",marginBottom:22}}>
                <div style={{fontSize:48,marginBottom:10,animation:"float 3s ease-in-out infinite"}}>🤖</div>
                <div style={{fontWeight:800,color:"var(--text-primary,#fff)",marginBottom:4,fontSize:16}}>Your Personal AI Coach</div>
                <div style={{fontSize:12,color:"var(--text-muted)"}}>I know your stats · Ask me anything</div>
              </div>
              <div style={{fontSize:11,fontWeight:700,color:"var(--text-muted)",letterSpacing:1,marginBottom:10,textAlign:"center",textTransform:"uppercase"}}>Suggested Questions</div>
              {[
                "How can I improve my streak?",
                "What habit should I focus on?",
                "I'm struggling to stay consistent",
                "Give me a morning routine tip",
                "How do I build better sleep habits?",
              ].map(q=>(
                <button key={q} onClick={()=>onChangeInput(q)} style={{width:"100%",padding:"10px 14px",marginBottom:8,background:"rgba(255,255,255,0.04)",border:"1px solid var(--border)",borderRadius:12,color:"var(--text-secondary)",fontSize:13,cursor:"pointer",textAlign:"left",fontFamily:"'Inter',sans-serif",transition:"all .2s"}}
                  onMouseEnter={e=>e.target.style.background="rgba(255,255,255,0.09)"}
                  onMouseLeave={e=>e.target.style.background="rgba(255,255,255,0.04)"}>
                  💬 {q}
                </button>
              ))}
            </div>
          )}
          {aiMsgs.map((m,i)=>(
            <div key={i} style={{marginBottom:12,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              <div style={{maxWidth:"82%",padding:"11px 16px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?"linear-gradient(135deg,#A78BFA,#4ECDC4)":"rgba(255,255,255,0.07)",fontSize:13,lineHeight:1.6,border:m.role==="user"?"none":"1px solid rgba(255,255,255,0.08)"}}>
                {m.content}
              </div>
            </div>
          ))}
          {aiLoading && (
            <div style={{color:"var(--text-muted)",fontSize:13,padding:8}}>🤖 Thinking...</div>
          )}
        </div>
        <div style={{padding:14,borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",gap:8}}>
          <input
            value={aiInput}
            onChange={e=>onChangeInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&onSendAI()}
            placeholder="Ask your coach..."
            className="inp"
            style={{flex:1,minWidth:0,marginBottom:0}}
          />
          <button onClick={onSendAI} disabled={aiLoading} className="btn-grad" style={{padding:"10px 18px",background:"linear-gradient(135deg,#A78BFA,#4ECDC4)"}}>Send</button>
        </div>
      </div>
    </div>
  )
}
