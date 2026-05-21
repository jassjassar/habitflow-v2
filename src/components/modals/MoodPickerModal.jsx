export default function MoodPickerModal({ mood, onSaveMood, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="card modal-card" style={{maxWidth:360,width:"100%",padding:28,textAlign:"center"}}>
        <div style={{fontSize:20,fontWeight:900,marginBottom:6}}>How are you feeling? 😊</div>
        <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:24}}>Daily mood check-in</div>
        <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:16}}>
          {["😴","😐","🙂","😊","🔥"].map(m=>(
            <button key={m} onClick={()=>onSaveMood(m)} style={{width:54,height:54,borderRadius:16,border:`2px solid ${mood===m?"#A78BFA":"rgba(255,255,255,0.1)"}`,background:mood===m?"rgba(167,139,250,0.2)":"transparent",fontSize:28,cursor:"pointer",transition:"all .2s",boxShadow:mood===m?"0 0 18px rgba(167,139,250,0.4)":"none",transform:mood===m?"scale(1.12)":"scale(1)"}}>{m}</button>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--text-muted)",fontWeight:700,padding:"0 4px"}}>
          <span>Tired</span><span>Neutral</span><span>Good</span><span>Great</span><span>On fire!</span>
        </div>
      </div>
    </div>
  )
}
