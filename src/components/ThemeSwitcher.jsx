import ModalOverlay from "./ModalOverlay"

const THEMES = {
  aurora: { name:"Dark Aurora",    bg:"#0d0d1a", accent:"#A78BFA", card:"rgba(255,255,255,0.07)", text:"#ffffff" },
  mint:   { name:"Fresh Mint",     bg:"#f0fdf6", accent:"#10b981", card:"rgba(255,255,255,0.94)", text:"#111827" },
  ocean:  { name:"Ocean Deep",     bg:"#0c1929", accent:"#0ea5e9", card:"rgba(14,165,233,0.08)",  text:"#f0f9ff" },
  coral:  { name:"Sunset Coral",   bg:"#fff8f5", accent:"#f97316", card:"rgba(255,255,255,0.94)", text:"#1c0a00" },
  rose:   { name:"Rose Gold",      bg:"#fff5f7", accent:"#e11d48", card:"rgba(255,255,255,0.94)", text:"#1a0010" },
  slate:  { name:"Midnight Slate", bg:"#0f172a", accent:"#6366f1", card:"rgba(99,102,241,0.08)",  text:"#f1f5f9" },
}

export default function ThemeSwitcher({ current, unlockedThemes, onSelect, onClose }) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className="card modal-card" style={{maxWidth:400,width:"100%",padding:24,margin:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:18,fontWeight:900}}>🎨 Choose Theme</div>
          <button onClick={onClose} className="btn-glass" style={{padding:"5px 11px"}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {Object.entries(THEMES).map(([id, t]) => {
            const reward = unlockedThemes[id] || {}
            const locked = !reward.unlocked
            return (
              <div key={id} onClick={()=>!locked&&onSelect(id)} style={{
                borderRadius:16,overflow:"hidden",
                border:current===id?`2px solid ${t.accent}`:"2px solid transparent",
                cursor:locked?"not-allowed":"pointer",transition:"all .2s",
                transform:current===id?"scale(1.03)":"scale(1)",
                boxShadow:current===id?`0 0 20px ${t.accent}44`:"none",
                opacity:locked?0.58:1,
                position:"relative",
              }}>
                {locked && (
                  <div style={{position:"absolute",inset:0,zIndex:2,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.28)",fontSize:22}}>🔒</div>
                )}
                <div style={{background:t.bg,padding:14,height:70,display:"flex",flexDirection:"column",gap:6}}>
                  <div style={{display:"flex",gap:5}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:t.accent}}/>
                    <div style={{width:8,height:8,borderRadius:"50%",background:t.accent,opacity:.6}}/>
                  </div>
                  <div style={{height:5,borderRadius:3,background:t.accent,width:"70%"}}/>
                  <div style={{height:5,borderRadius:3,background:t.accent,width:"50%",opacity:.6}}/>
                </div>
                <div style={{
                  background:t.text==="#ffffff"||t.text==="#f0f9ff"||t.text==="#f1f5f9"?"#1a1a2e":"#f9fafb",
                  color:t.text==="#ffffff"||t.text==="#f0f9ff"||t.text==="#f1f5f9"?"#fff":"#374151",
                  padding:"8px 10px",fontSize:11,fontWeight:800,textAlign:"center",
                }}>
                  <div>{current===id?"✓ ":locked?"🔒 ":""}{t.name}</div>
                  <div style={{fontSize:9,fontWeight:700,opacity:.62,marginTop:2,lineHeight:1.25}}>{locked?reward.reason:"Unlocked"}</div>
                </div>
              </div>
            )
          })}
        </div>
        <button onClick={onClose} className="btn-glass" style={{width:"100%",marginTop:16,padding:12,fontSize:14}}>Done</button>
      </div>
    </ModalOverlay>
  )
}
