export default function Particles({ active }) {
  if (!active) return null
  const colors = ["#FF6B6B","#FFD93D","#6BCB77","#4ECDC4","#A78BFA","#F472B6","#FF8E53","#45B7D1"]
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}>
      {Array.from({length:45},(_,i)=>(
        <div key={i} className="particle" style={{
          left:Math.random()*100+"%",top:"-10px",
          background:colors[i%colors.length],
          borderRadius:Math.random()>.5?"50%":"3px",
          width:5+Math.random()*9+"px",height:5+Math.random()*9+"px",
          animationDelay:Math.random()*0.7+"s",
          animationDuration:1.5+Math.random()*1.5+"s",
        }}/>
      ))}
    </div>
  )
}
