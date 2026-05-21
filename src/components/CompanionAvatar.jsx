export default function CompanionAvatar({ mood }) {
  const face = {
    happy: "•‿•",
    sleepy: "—_—",
    excited: "★‿★",
    worried: "•︵•",
  }[mood] || "•‿•"

  return (
    <div style={{width:62,height:62,borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"var(--text-primary,#fff)",background:"linear-gradient(135deg,#1f7a4d,#2d9c65)",boxShadow:"0 12px 32px rgba(31,122,77,0.22), inset 0 1px 0 rgba(255,255,255,0.25)",border:"1px solid rgba(31,122,77,0.2)",animation:mood==="excited"?"pulse 1.4s ease-in-out infinite":mood==="sleepy"?"float 4s ease-in-out infinite":"float 3s ease-in-out infinite"}}>
      {face}
    </div>
  )
}
