export default function LevelUpBurst({ show, level }) {
  if (!show) return null
  return (
    <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998,pointerEvents:"none",background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)"}}>
      <div style={{textAlign:"center",animation:"levelUp 0.6s cubic-bezier(.34,1.56,.64,1) forwards"}}>
        <div style={{fontSize:90,filter:"drop-shadow(0 0 30px #FFD93D)"}}>{level?.icon}</div>
        <div style={{fontSize:28,fontWeight:900,color:"#FFD93D",marginTop:8,textShadow:"0 0 30px #FFD93D"}}>LEVEL UP!</div>
        <div style={{fontSize:18,color:"var(--text-secondary)",marginTop:6,fontWeight:600}}>{level?.title}</div>
      </div>
    </div>
  )
}
