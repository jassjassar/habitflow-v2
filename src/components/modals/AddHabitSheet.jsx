const PALETTE = ["#FF6B6B","#FF8E53","#FFD93D","#6BCB77","#4ECDC4","#45B7D1","#A78BFA","#F472B6"]

export default function AddHabitSheet({
  newName,
  newEmoji,
  newColor,
  newTime,
  habitSaveError,
  setNewName,
  setNewEmoji,
  setNewColor,
  setNewTime,
  onAdd,
  onTemplates,
  onClose,
}) {
  return (
    <div
      onClick={onClose}
      style={{position:"fixed",inset:0,background:"rgba(15,31,21,0.4)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",zIndex:100,display:"flex",alignItems:"flex-end"}}
    >
      <div
        onClick={e=>e.stopPropagation()}
        style={{background:"#ffffff",borderRadius:"28px 28px 0 0",padding:"0 20px 40px",width:"100%",maxHeight:"92vh",overflowY:"auto",boxShadow:"0 -12px 48px rgba(15,31,21,0.14)",border:"1px solid rgba(8,28,80,0.08)",borderBottom:"none",fontFamily:"'Inter',sans-serif"}}
      >
        {/* HANDLE */}
        <div style={{width:36,height:4,background:"#dce8df",borderRadius:2,margin:"14px auto 20px"}}/>

        {/* HEADER */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div>
            <div style={{fontSize:20,fontWeight:900,color:"#152118"}}>New Habit</div>
            <div style={{fontSize:13,color:"#6d786f",marginTop:2}}>Build something worth keeping.</div>
          </div>
          <button
            onClick={onClose}
            style={{width:36,height:36,borderRadius:"50%",border:"1px solid rgba(8,28,80,0.1)",background:"#f0f9ff",color:"#536257",cursor:"pointer",fontSize:16,fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",justifyContent:"center"}}
          >✕</button>
        </div>

        {/* NAME */}
        <input
          value={newName}
          onChange={e=>setNewName(e.target.value)}
          placeholder="What habit will you build?"
          style={{width:"100%",padding:"15px 16px",fontSize:15,borderRadius:16,border:"1px solid rgba(8,28,80,0.12)",background:"#fbfdf9",color:"#152118",fontFamily:"'Inter',sans-serif",outline:"none",marginBottom:20,boxSizing:"border-box"}}
          onFocus={e=>e.target.style.borderColor="#0891b2"}
          onBlur={e=>e.target.style.borderColor="rgba(8,28,80,0.12)"}
        />

        {/* EMOJI */}
        <div style={{fontSize:11,fontWeight:700,color:"#6d786f",letterSpacing:.8,marginBottom:10,textTransform:"uppercase"}}>Pick an emoji</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:22}}>
          {["🏃","💧","📚","🧘","🥗","💤","✍️","🎯","🎸","🌿","🧠","🏋️","🚴","🥤","🎨","💊","🌅","🚿"].map(e=>(
            <button
              key={e}
              onClick={()=>setNewEmoji(e)}
              style={{width:44,height:44,borderRadius:13,border:`2px solid ${newEmoji===e?"#0891b2":"rgba(8,28,80,0.08)"}`,background:newEmoji===e?"#e0f2fe":"#f0f9ff",cursor:"pointer",fontSize:20,transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center"}}
            >{e}</button>
          ))}
        </div>

        {/* COLOR */}
        <div style={{fontSize:11,fontWeight:700,color:"#6d786f",letterSpacing:.8,marginBottom:10,textTransform:"uppercase"}}>Pick a color</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:22}}>
          {PALETTE.map(c=>(
            <button
              key={c}
              onClick={()=>setNewColor(c)}
              style={{width:36,height:36,borderRadius:"50%",background:c,border:newColor===c?"3px solid #ffffff":"2px solid transparent",outline:newColor===c?`2px solid ${c}`:"none",cursor:"pointer",transition:"all .15s"}}
            />
          ))}
        </div>

        {/* TIME */}
        <div style={{fontSize:11,fontWeight:700,color:"#6d786f",letterSpacing:.8,marginBottom:10,textTransform:"uppercase"}}>Reminder time</div>
        <input
          type="time"
          value={newTime}
          onChange={e=>setNewTime(e.target.value)}
          style={{padding:"13px 16px",fontSize:15,borderRadius:16,border:"1px solid rgba(8,28,80,0.12)",background:"#fbfdf9",color:"#152118",fontFamily:"'Inter',sans-serif",outline:"none",marginBottom:8,display:"block"}}
          onFocus={e=>e.target.style.borderColor="#0891b2"}
          onBlur={e=>e.target.style.borderColor="rgba(8,28,80,0.12)"}
        />
        <div style={{fontSize:12,color:"#9aad9f",lineHeight:1.5,marginBottom:24}}>
          We'll send a gentle nudge at this time each day.
        </div>

        {/* ERROR */}
        {habitSaveError && (
          <div style={{fontSize:13,color:"#dc2626",background:"#fef2f2",border:"1px solid rgba(220,38,38,0.2)",borderRadius:12,padding:"12px 14px",marginBottom:16,fontWeight:600}}>
            {habitSaveError}
          </div>
        )}

        {/* BUTTONS */}
        <div style={{display:"flex",gap:10}}>
          <button
            onClick={onClose}
            style={{flex:1,padding:"15px",fontSize:14,fontWeight:600,borderRadius:16,border:"1px solid rgba(8,28,80,0.1)",background:"#ffffff",color:"#536257",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}
          >Cancel</button>
          <button
            onClick={onAdd}
            style={{flex:2,padding:"15px",fontSize:15,fontWeight:800,borderRadius:16,border:"none",background:"#0891b2",color:"#ffffff",boxShadow:"0 8px 24px rgba(8,145,178,0.22)",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}
          >Add Habit →</button>
        </div>

      </div>
    </div>
  )
}
