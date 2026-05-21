export default function MilestoneToast({ milestone }) {
  if (!milestone) return null
  return (
    <div style={{position:"fixed",top:74,left:"50%",transform:"translateX(-50%)",zIndex:9999,width:"calc(100% - 32px)",maxWidth:420,pointerEvents:"none",animation:"slideDown 0.35s ease"}}>
      <div className="card" style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:12,background:"linear-gradient(135deg,rgba(255,217,61,0.18),rgba(167,139,250,0.16))",border:"1px solid var(--border)",boxShadow:"0 12px 36px rgba(0,0,0,0.35)"}}>
        <div style={{width:38,height:38,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,background:"rgba(255,255,255,0.1)",boxShadow:"0 0 18px rgba(255,217,61,0.25)"}}>{milestone.icon}</div>
        <div>
          <div style={{fontSize:13,fontWeight:900,color:"var(--text-primary,#fff)",marginBottom:2}}>{milestone.title}</div>
          <div style={{fontSize:11,color:"var(--text-secondary)",fontWeight:700}}>{milestone.detail}</div>
        </div>
      </div>
    </div>
  )
}
