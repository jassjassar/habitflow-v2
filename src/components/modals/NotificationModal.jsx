import ModalOverlay from "../ModalOverlay"

export default function NotificationModal({
  notificationLoading,
  notificationMessage,
  notificationError,
  onEnable,
  onDismiss,
}) {
  return (
    <ModalOverlay onClose={onDismiss}>
      <div className="card modal-card" style={{maxWidth:390,width:"100%",padding:28,textAlign:"center"}}>
        <div style={{fontSize:54,marginBottom:14,animation:"float 3s ease-in-out infinite"}}>🔔</div>
        <div style={{fontSize:23,fontWeight:900,marginBottom:8,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          Stay on track gently
        </div>
        <div style={{fontSize:14,color:"var(--text-secondary)",lineHeight:1.65,marginBottom:18}}>
          HabitFlow can send reminders at the times you choose for each habit. We will only show the browser permission prompt after you tap enable.
        </div>
        <div style={{textAlign:"left",background:"rgba(255,255,255,0.04)",borderRadius:16,padding:16,marginBottom:18,border:"1px solid var(--border)"}}>
          {[
            "Daily nudges use your habit reminder times",
            "You can change each habit's time anytime",
            "No reminder is sent until notifications are enabled",
          ].map(f=>(
            <div key={f} style={{display:"flex",gap:10,marginBottom:10,fontSize:13,color:"var(--text-secondary)",lineHeight:1.4}}>
              <span style={{color:"#6BCB77"}}>✓</span>{f}
            </div>
          ))}
        </div>
        {notificationMessage && (
          <div style={{fontSize:12,lineHeight:1.5,color:"#B9F7CB",background:"rgba(107,203,119,0.12)",border:"1px solid rgba(107,203,119,0.25)",borderRadius:12,padding:"10px 12px",marginBottom:12,fontWeight:700}}>
            {notificationMessage}
          </div>
        )}
        {notificationError && (
          <div style={{fontSize:12,lineHeight:1.5,color:"#FFB4B4",background:"rgba(255,107,107,0.12)",border:"1px solid rgba(255,107,107,0.28)",borderRadius:12,padding:"10px 12px",marginBottom:12,fontWeight:700}}>
            {notificationError}
          </div>
        )}
        <button
          onClick={async()=>{ const ok = await onEnable(); if(ok) setTimeout(()=>onDismiss(), 900) }}
          disabled={notificationLoading}
          className="btn-grad"
          style={{width:"100%",padding:15,fontSize:15,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)",marginBottom:10,opacity:notificationLoading?0.65:1}}
        >
          {notificationLoading?"Turning on reminders...":"Enable Reminders"}
        </button>
        <button onClick={onDismiss} className="btn-glass" style={{width:"100%",padding:12,fontSize:13}}>Maybe later</button>
      </div>
    </ModalOverlay>
  )
}
