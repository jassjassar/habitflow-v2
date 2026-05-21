import { HABIT_TEMPLATES } from "../../lib/constants"

export default function TemplatesModal({ habitSaveError, onAddFromTemplate, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="card modal-card" style={{maxWidth:480,width:"100%",padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{fontSize:20,fontWeight:900}}>📋 Templates</div>
          <button onClick={onClose} className="btn-glass" style={{padding:"5px 11px"}}>✕</button>
        </div>
        <div className="template-grid">
          {HABIT_TEMPLATES.map(t=>(
            <div key={t.name} onClick={()=>onAddFromTemplate(t)} className="habit-card" style={{background:`linear-gradient(135deg,${t.color}18,${t.color}06)`,border:`1px solid ${t.color}33`,cursor:"pointer",padding:16}}>
              <div style={{fontSize:28,marginBottom:6}}>{t.emoji}</div>
              <div style={{fontSize:13,fontWeight:700,marginBottom:3}}>{t.name}</div>
              <div style={{fontSize:11,color:"var(--text-muted)"}}>⏰ {t.time}</div>
              <div style={{fontSize:10,color:t.color,marginTop:4,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>{t.category}</div>
            </div>
          ))}
        </div>
        {habitSaveError && (
          <div style={{fontSize:12,lineHeight:1.5,color:"#FFB4B4",background:"rgba(255,107,107,0.12)",border:"1px solid rgba(255,107,107,0.28)",borderRadius:12,padding:"10px 12px",marginTop:12,fontWeight:700}}>
            {habitSaveError}
          </div>
        )}
      </div>
    </div>
  )
}
