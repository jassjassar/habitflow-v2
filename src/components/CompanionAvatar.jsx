export default function CompanionAvatar({ mood }) {
  const face = {
    happy: "•‿•",
    sleepy: "—_—",
    excited: "★‿★",
    worried: "•︵•",
  }[mood] || "•‿•"

  return (
    <div className="companion-avatar" style={{width:62,height:62,borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"var(--text-primary,#fff)",background:"linear-gradient(135deg,#4f5d75,#6b7fa3)",boxShadow:"0 12px 32px rgba(79,93,117,0.22), inset 0 1px 0 rgba(255,255,255,0.25)",border:"1px solid rgba(79,93,117,0.2)",animation:mood==="excited"?"pulse 1.4s ease-in-out infinite":mood==="sleepy"?"float 4s ease-in-out infinite":"float 3s ease-in-out infinite"}}>
      {face}
    </div>
  )
}
