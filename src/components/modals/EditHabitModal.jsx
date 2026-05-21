import { useState } from "react"

const PALETTE = ["#FF6B6B","#FF8E53","#FFD93D","#6BCB77","#4ECDC4","#45B7D1","#A78BFA","#F472B6"]

export default function EditHabitModal({ editHabit, onSave, onDelete, onClose }) {
  const [name, setName] = useState(editHabit.name)
  const [emoji, setEmoji] = useState(editHabit.emoji)
  const [color, setColor] = useState(editHabit.color)

  return (
    <div className="overlay" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="card modal-card" style={{maxWidth:420,width:"100%",padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:20,fontWeight:900}}>Edit Habit</div>
          <button onClick={onClose} className="btn-glass" style={{padding:"5px 11px"}}>✕</button>
        </div>
        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          className="inp"
          placeholder="Habit name"
        />
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
          {["🏃","💧","📚","🧘","🥗","💤","✍️","🎯","🎸","🌿","🧠","🏋️"].map(e=>(
            <button key={e} onClick={()=>setEmoji(e)} style={{width:38,height:38,borderRadius:11,border:`2px solid ${emoji===e?"#A78BFA":"rgba(255,255,255,0.1)"}`,background:emoji===e?"rgba(167,139,250,0.2)":"transparent",cursor:"pointer",fontSize:18,transition:"all .2s"}}>{e}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
          {PALETTE.map(c=>(
            <button key={c} onClick={()=>setColor(c)} style={{width:30,height:30,borderRadius:"50%",background:c,border:color===c?"3px solid #fff":"2px solid transparent",cursor:"pointer",boxShadow:color===c?`0 0 12px ${c}`:"none",transition:"all .2s"}}/>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>onDelete(editHabit.id)} className="btn-glass" style={{flex:1,padding:13,color:"#FF6B6B",border:"1px solid rgba(255,107,107,0.3)"}}>🗑️ Delete</button>
          <button onClick={()=>onSave(editHabit.id, name, emoji, color)} className="btn-grad" style={{flex:2,padding:13,background:"linear-gradient(135deg,#A78BFA,#4ECDC4)"}}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}
