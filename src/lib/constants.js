export const PALETTE = ["#FF6B6B","#FF8E53","#FFD93D","#6BCB77","#4ECDC4","#45B7D1","#A78BFA","#F472B6"]

export const HABIT_TEMPLATES = [
  { name:"Morning Run",    emoji:"🏃", color:"#FF6B6B", category:"health",   time:"06:00" },
  { name:"Drink Water",    emoji:"💧", color:"#45B7D1", category:"health",   time:"08:00" },
  { name:"Gym Workout",    emoji:"🏋️", color:"#FF8E53", category:"health",   time:"07:00" },
  { name:"Meditate",       emoji:"🧘", color:"#A78BFA", category:"mind",     time:"07:00" },
  { name:"Read 20 Mins",   emoji:"📚", color:"#FFD93D", category:"mind",     time:"20:00" },
  { name:"Journal",        emoji:"✍️", color:"#F472B6", category:"mind",     time:"21:00" },
  { name:"Deep Work",      emoji:"🎯", color:"#4ECDC4", category:"work",     time:"09:00" },
  { name:"Cold Shower",    emoji:"🚿", color:"#45B7D1", category:"personal", time:"07:00" },
  { name:"Sleep 8hrs",     emoji:"💤", color:"#A78BFA", category:"health",   time:"22:00" },
  { name:"Healthy Eating", emoji:"🥗", color:"#6BCB77", category:"health",   time:"12:00" },
  { name:"Gratitude",      emoji:"🙏", color:"#FFD93D", category:"personal", time:"21:00" },
  { name:"No Sugar",       emoji:"🍎", color:"#FF6B6B", category:"health",   time:"08:00" },
]

export const ONBOARDING_HABITS = {
  health: [
    { name:"Morning Run",    emoji:"🏃", color:"#FF6B6B", time:"06:30" },
    { name:"Drink Water",    emoji:"💧", color:"#45B7D1", time:"08:00" },
    { name:"Gym Workout",    emoji:"🏋️", color:"#FF8E53", time:"07:00" },
    { name:"Healthy Eating", emoji:"🥗", color:"#6BCB77", time:"12:00" },
    { name:"Sleep 8hrs",     emoji:"💤", color:"#A78BFA", time:"22:00" },
  ],
  mind: [
    { name:"Meditate",       emoji:"🧘", color:"#A78BFA", time:"07:00" },
    { name:"Read 20 Mins",   emoji:"📚", color:"#FFD93D", time:"20:00" },
    { name:"Journal",        emoji:"✍️", color:"#F472B6", time:"21:00" },
    { name:"Gratitude",      emoji:"🙏", color:"#FFD93D", time:"08:00" },
    { name:"Deep Work",      emoji:"🎯", color:"#4ECDC4", time:"09:00" },
  ],
  work: [
    { name:"Deep Work",       emoji:"🎯", color:"#4ECDC4", time:"09:00" },
    { name:"Plan Tomorrow",   emoji:"📋", color:"#45B7D1", time:"21:00" },
    { name:"No Phone AM",     emoji:"📵", color:"#FF6B6B", time:"08:00" },
    { name:"Learn Something", emoji:"🧠", color:"#A78BFA", time:"18:00" },
    { name:"Read 20 Mins",    emoji:"📚", color:"#FFD93D", time:"20:00" },
  ],
  personal: [
    { name:"Cold Shower",    emoji:"🚿", color:"#45B7D1", time:"07:00" },
    { name:"Walk 30 Mins",   emoji:"🚶", color:"#6BCB77", time:"17:00" },
    { name:"No Sugar",       emoji:"🍎", color:"#FF6B6B", time:"08:00" },
    { name:"Gratitude",      emoji:"🙏", color:"#FFD93D", time:"21:00" },
    { name:"Sleep 8hrs",     emoji:"💤", color:"#A78BFA", time:"22:00" },
  ],
}

export const THEMES = {
  aurora: { name:"Dark Aurora",    bg:"#0d0d1a", accent:"#A78BFA", card:"rgba(255,255,255,0.07)", text:"#ffffff", sub:"rgba(255,255,255,0.5)",  textSecondary:"rgba(255,255,255,0.72)", muted:"rgba(255,255,255,0.45)", border:"rgba(255,255,255,0.1)",  button:"rgba(255,255,255,0.08)", input:"rgba(255,255,255,0.07)" },
  mint:   { name:"Fresh Mint",     bg:"#f0fdf6", accent:"#10b981", card:"rgba(255,255,255,0.94)", text:"#111827", sub:"rgba(17,24,39,0.58)",   textSecondary:"rgba(17,24,39,0.74)",  muted:"rgba(17,24,39,0.52)",  border:"rgba(17,24,39,0.12)",   button:"rgba(17,24,39,0.06)",  input:"rgba(255,255,255,0.86)" },
  ocean:  { name:"Ocean Deep",     bg:"#0c1929", accent:"#0ea5e9", card:"rgba(14,165,233,0.08)",  text:"#f0f9ff", sub:"rgba(255,255,255,0.45)", textSecondary:"rgba(240,249,255,0.72)", muted:"rgba(240,249,255,0.46)", border:"rgba(240,249,255,0.1)", button:"rgba(255,255,255,0.08)", input:"rgba(255,255,255,0.07)" },
  coral:  { name:"Sunset Coral",   bg:"#fff8f5", accent:"#f97316", card:"rgba(255,255,255,0.94)", text:"#1c0a00", sub:"rgba(28,10,0,0.56)",    textSecondary:"rgba(28,10,0,0.74)",   muted:"rgba(28,10,0,0.5)",    border:"rgba(28,10,0,0.12)",    button:"rgba(28,10,0,0.06)",   input:"rgba(255,255,255,0.86)" },
  rose:   { name:"Rose Gold",      bg:"#fff5f7", accent:"#e11d48", card:"rgba(255,255,255,0.94)", text:"#1a0010", sub:"rgba(26,0,16,0.56)",    textSecondary:"rgba(26,0,16,0.74)",   muted:"rgba(26,0,16,0.5)",    border:"rgba(26,0,16,0.12)",    button:"rgba(26,0,16,0.06)",   input:"rgba(255,255,255,0.86)" },
  slate:  { name:"Midnight Slate", bg:"#0f172a", accent:"#6366f1", card:"rgba(99,102,241,0.08)",  text:"#f1f5f9", sub:"rgba(255,255,255,0.45)", textSecondary:"rgba(241,245,249,0.72)", muted:"rgba(241,245,249,0.46)", border:"rgba(241,245,249,0.1)", button:"rgba(255,255,255,0.08)", input:"rgba(255,255,255,0.07)" },
}

export const THEME_REWARDS = {
  aurora: { reason:"Starter theme" },
  mint:   { xp:100,    reason:"Unlock at 100 XP" },
  ocean:  { streak:3,  reason:"Unlock with a 3-day streak" },
  coral:  { xp:250,    reason:"Unlock at 250 XP" },
  rose:   { pro:true,  reason:"Unlock with Pro" },
  slate:  { xp:500,    reason:"Unlock at 500 XP" },
}

export const LEVELS = [
  { level:1, title:"Beginner",  icon:"🌱", minXP:0    },
  { level:2, title:"Explorer",  icon:"🚀", minXP:100  },
  { level:3, title:"Achiever",  icon:"⚡", minXP:250  },
  { level:4, title:"Champion",  icon:"🔥", minXP:500  },
  { level:5, title:"Master",    icon:"💎", minXP:1000 },
  { level:6, title:"Legend",    icon:"👑", minXP:2000 },
]

export const DAILY_QUEST_BONUS_XP = 20

export const PUSH_CONFIG_ERROR = "Push reminders are not configured correctly yet. Please contact support or try again later."
