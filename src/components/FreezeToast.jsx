export default function FreezeToast({ type }) {
  if (!type) return null
  const isEarned = type === "shield_earned"
  return (
    <div style={{position:"fixed",top:74,left:"50%",transform:"translateX(-50%)",zIndex:9999,width:"calc(100% - 32px)",maxWidth:420,pointerEvents:"none",animation:"slideDown 0.35s ease"}}>
      <div className="card" style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12,background:isEarned?"linear-gradient(135deg,rgba(69,183,209,0.2),rgba(167,139,250,0.18))":"linear-gradient(135deg,rgba(255,142,83,0.2),rgba(255,217,61,0.14))",border:"1px solid var(--border)",boxShadow:"0 12px 36px rgba(0,0,0,0.35)"}}>
        <div style={{width:42,height:42,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,background:"rgba(255,255,255,0.1)",boxShadow:isEarned?"0 0 20px rgba(69,183,209,0.3)":"0 0 20px rgba(255,217,61,0.3)"}}>🛡️</div>
        <div>
          <div style={{fontSize:14,fontWeight:900,color:"var(--text-primary,#fff)",marginBottom:2}}>{isEarned?"Streak shield earned":"Your streak was protected"}</div>
          <div style={{fontSize:11,color:"var(--text-secondary)",fontWeight:700,lineHeight:1.35}}>
            {isEarned?"You reached a 7-day rhythm. One missed day can be forgiven.":"A shield covered yesterday so your streak could keep going."}
          </div>
        </div>
      </div>
    </div>
  )
}
