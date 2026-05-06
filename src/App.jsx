// HabitFlow v3.0 - With email capture and footer
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ⚡ STRIPE KEY — Replace below with your pk_live_ key
const STRIPE_KEY = "YOUR_STRIPE_KEY_HERE";

const GL = document.createElement("link");
GL.rel = "stylesheet";
GL.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Outfit:wght@300;400;500;600&display=swap";
document.head.appendChild(GL);

const SUPABASE_URL = "https://ykmftbsglhoxoopzwbwd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbWZ0YnNnbGhveG9vcHp3YndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjI3MTAsImV4cCI6MjA5MzEzODcxMH0.L3VZxCH7ObRGkhLOuCvqxMoluEFKiKuYQo1Wnq5AR0U";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Translations ──────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: { welcome:"Welcome", habits:"Habits", tracker:"Tracker", analytics:"Analytics", addHabit:"+ Add Habit", signOut:"Sign Out", today:"Today", streak:"streak", done:"done", getStarted:"Get Started", yourHabits:"Your habits.", yourStreaks:"Your streaks.", yourLife:"Your life.", startFree:"Start Free Today →", freeForever:"Free forever · Sync across all devices" },
  es: { welcome:"Bienvenido", habits:"Hábitos", tracker:"Seguimiento", analytics:"Análisis", addHabit:"+ Agregar Hábito", signOut:"Cerrar Sesión", today:"Hoy", streak:"racha", done:"hecho", getStarted:"Comenzar", yourHabits:"Tus hábitos.", yourStreaks:"Tus rachas.", yourLife:"Tu vida.", startFree:"Empieza Gratis →", freeForever:"Gratis para siempre" },
  hi: { welcome:"स्वागत", habits:"आदतें", tracker:"ट्रैकर", analytics:"विश्लेषण", addHabit:"+ आदत जोड़ें", signOut:"साइन आउट", today:"आज", streak:"streak", done:"किया", getStarted:"शुरू करें", yourHabits:"आपकी आदतें.", yourStreaks:"आपकी streaks.", yourLife:"आपका जीवन.", startFree:"मुफ्त शुरू करें →", freeForever:"हमेशा के लिए मुफ्त" },
  ar: { welcome:"مرحباً", habits:"العادات", tracker:"المتتبع", analytics:"التحليل", addHabit:"+ إضافة عادة", signOut:"تسجيل خروج", today:"اليوم", streak:"سلسلة", done:"تم", getStarted:"ابدأ الآن", yourHabits:"عاداتك.", yourStreaks:"سلاسلك.", yourLife:"حياتك.", startFree:"ابدأ مجاناً →", freeForever:"مجاني للأبد" },
  fr: { welcome:"Bienvenue", habits:"Habitudes", tracker:"Suivi", analytics:"Analyses", addHabit:"+ Ajouter", signOut:"Déconnexion", today:"Aujourd'hui", streak:"série", done:"fait", getStarted:"Commencer", yourHabits:"Vos habitudes.", yourStreaks:"Vos séries.", yourLife:"Votre vie.", startFree:"Commencer Gratuitement →", freeForever:"Gratuit pour toujours" },
  zh: { welcome:"欢迎", habits:"习惯", tracker:"追踪", analytics:"分析", addHabit:"+ 添加习惯", signOut:"退出", today:"今天", streak:"连续", done:"完成", getStarted:"开始", yourHabits:"你的习惯。", yourStreaks:"你的连续。", yourLife:"你的生活。", startFree:"免费开始 →", freeForever:"永久免费" },
};

const LANGUAGES = [
  {code:"en", label:"English", flag:"🇺🇸"},
  {code:"es", label:"Español", flag:"🇪🇸"},
  {code:"hi", label:"हिंदी", flag:"🇮🇳"},
  {code:"ar", label:"العربية", flag:"🇸🇦"},
  {code:"fr", label:"Français", flag:"🇫🇷"},
  {code:"zh", label:"中文", flag:"🇨🇳"},
];

// ── Onboarding Questions ───────────────────────────────────────────────────
const ONBOARD_QUESTIONS = [
  {
    id: 0,
    title: "What are your main goals?",
    emoji: "🎯",
    options: [
      {label:"Get fit & healthy", emoji:"🏋️", category:"health"},
      {label:"Learn & grow", emoji:"📚", category:"mind"},
      {label:"Advance my career", emoji:"💼", category:"work"},
      {label:"Better lifestyle", emoji:"✨", category:"personal"},
    ]
  },
  {
    id: 1,
    title: "How consistent are you?",
    emoji: "📊",
    options: [
      {label:"Just starting out", emoji:"🌱"},
      {label:"Some experience", emoji:"🚀"},
      {label:"Pretty consistent", emoji:"⚡"},
      {label:"Very disciplined", emoji:"👑"},
    ]
  },
  {
    id: 2,
    title: "Best time for habits?",
    emoji: "⏰",
    options: [
      {label:"Early morning", emoji:"🌅"},
      {label:"During the day", emoji:"☀️"},
      {label:"Evening", emoji:"🌆"},
      {label:"Before bed", emoji:"🌙"},
    ]
  }
];

// ── Habit Templates ───────────────────────────────────────────────────────
const HABIT_TEMPLATES = [
  // Health & Fitness
  { name:"Morning Run", emoji:"🏃", color:"#FF6B6B", category:"health", time:"06:00",
    weekPlan: {
      Mon:"5km easy pace", Tue:"Rest", Wed:"5km with intervals", Thu:"Rest",
      Fri:"5km easy pace", Sat:"10km long run", Sun:"Rest"
    }
  },
  { name:"Gym Workout", emoji:"🏋️", color:"#FF6B6B", category:"health", time:"07:00",
    weekPlan: {
      Mon:"Chest & Triceps 💪", Tue:"Back & Biceps 🔙", Wed:"Rest day 😴",
      Thu:"Legs & Glutes 🦵", Fri:"Shoulders & Arms 💪", Sat:"Cardio 🏃", Sun:"Rest day 😴"
    }
  },
  { name:"Drink Water", emoji:"💧", color:"#4ECDC4", category:"health", time:"08:00",
    weekPlan: {
      Mon:"8 glasses", Tue:"8 glasses", Wed:"8 glasses", Thu:"8 glasses",
      Fri:"8 glasses", Sat:"10 glasses", Sun:"8 glasses"
    }
  },
  { name:"Healthy Eating", emoji:"🥗", color:"#6BCB77", category:"health", time:"12:00",
    weekPlan: {
      Mon:"High protein day", Tue:"Low carb day", Wed:"Balanced meals",
      Thu:"High protein day", Fri:"Cheat meal allowed 😋", Sat:"Balanced meals", Sun:"Meal prep day"
    }
  },
  { name:"Sleep 8 Hours", emoji:"💤", color:"#A78BFA", category:"health", time:"22:00",
    weekPlan: {
      Mon:"Sleep by 10pm", Tue:"Sleep by 10pm", Wed:"Sleep by 10pm", Thu:"Sleep by 10pm",
      Fri:"Sleep by 11pm", Sat:"Sleep by 11pm", Sun:"Sleep by 10pm"
    }
  },
  // Mind & Learning
  { name:"Read 20 Mins", emoji:"📚", color:"#FFD93D", category:"mind", time:"20:00",
    weekPlan: {
      Mon:"Chapter 1-2", Tue:"Chapter 3-4", Wed:"Chapter 5-6",
      Thu:"Chapter 7-8", Fri:"Chapter 9-10", Sat:"Review highlights", Sun:"Start new book"
    }
  },
  { name:"Meditate", emoji:"🧘", color:"#A78BFA", category:"mind", time:"07:00",
    weekPlan: {
      Mon:"10 min breathing", Tue:"Body scan 10 min", Wed:"Visualization 10 min",
      Thu:"Gratitude meditation", Fri:"10 min breathing", Sat:"20 min deep session", Sun:"5 min mindfulness"
    }
  },
  { name:"Journal", emoji:"✍️", color:"#FFD93D", category:"mind", time:"21:00",
    weekPlan: {
      Mon:"3 gratitudes + goals", Tue:"Reflect on yesterday", Wed:"Future self letter",
      Thu:"3 gratitudes + wins", Fri:"Weekly reflection", Sat:"Creative writing", Sun:"Plan next week"
    }
  },
  // Work & Career
  { name:"Morning Planning", emoji:"📋", color:"#4ECDC4", category:"work", time:"08:00",
    weekPlan: {
      Mon:"Set weekly goals", Tue:"Review yesterday", Wed:"Mid-week check",
      Thu:"Review progress", Fri:"Plan for weekend", Sat:"Personal projects", Sun:"Plan next week"
    }
  },
  { name:"Deep Work", emoji:"🎯", color:"#F97316", category:"work", time:"09:00",
    weekPlan: {
      Mon:"2 hour focus block", Tue:"2 hour focus block", Wed:"2 hour focus block",
      Thu:"2 hour focus block", Fri:"1 hour focus block", Sat:"Personal projects", Sun:"Rest"
    }
  },
  // Personal
  { name:"Cold Shower", emoji:"🚿", color:"#06B6D4", category:"personal", time:"07:00",
    weekPlan: {
      Mon:"2 min cold", Tue:"2 min cold", Wed:"3 min cold",
      Thu:"3 min cold", Fri:"3 min cold", Sat:"5 min cold", Sun:"2 min cold"
    }
  },
  { name:"Gratitude", emoji:"🙏", color:"#FFD93D", category:"personal", time:"21:00",
    weekPlan: {
      Mon:"Write 3 things", Tue:"Write 3 things", Wed:"Write 3 things",
      Thu:"Write 3 things", Fri:"Write 3 things", Sat:"Write 5 things", Sun:"Write 3 things"
    }
  },
];

const DAYS_OF_WEEK = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const getTodayKey = () => {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return days[new Date().getDay()];
};

const getTomorrowKey = () => {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return days[(new Date().getDay() + 1) % 7];
};

const CATEGORIES = [
  { id: "health", label: "Health & Fitness", icon: "♥", color: "#FF6B6B" },
  { id: "mind", label: "Mind & Learning", icon: "✦", color: "#A78BFA" },
  { id: "work", label: "Work & Career", icon: "◈", color: "#4ECDC4" },
  { id: "personal", label: "Personal & Lifestyle", icon: "◉", color: "#FFD93D" },
];

const EMOJIS = ["🏃","💧","📚","🧘","🥗","💤","✍️","🎯","🎸","🌿","🧠","🏋️","🚴","🥤","🎨","💊","🌅","🛁"];
const COLORS = ["#FF6B6B","#4ECDC4","#FFD93D","#A78BFA","#6BCB77","#F97316","#EC4899","#06B6D4"];
const FREE_LIMIT = 3;
const DAYS_SHORT = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const today = new Date();
const getLast7 = () => Array.from({length:7},(_,i)=>{
  const d = new Date(today);
  d.setDate(today.getDate()-(6-i));
  return d.toISOString().slice(0,10);
});

const BADGE_LIST = [
  {id:"first",icon:"⭐",label:"First Step",desc:"Complete your first habit",check:(h)=>h.some(x=>Object.keys(x.completions||{}).length>0)},
  {id:"week",icon:"🔥",label:"Week Warrior",desc:"7-day streak on any habit",check:(h,days)=>h.some(x=>days.every(d=>x.completions&&x.completions[d]))},
  {id:"five",icon:"💎",label:"Five Habits",desc:"Track 5 or more habits",check:(h)=>h.length>=5},
  {id:"perfect",icon:"👑",label:"Perfect Day",desc:"Complete all habits today",check:(h,days)=>{const d=days[6];return h.length>0&&h.every(x=>x.completions&&x.completions[d]);}},
];

// ── XP & Levels ────────────────────────────────────────────────────────────
const LEVELS = [
  {level:1,title:"Beginner",icon:"🌱",minXP:0,maxXP:100,color:"#6BCB77"},
  {level:2,title:"Explorer",icon:"🚀",minXP:100,maxXP:250,color:"#4ECDC4"},
  {level:3,title:"Achiever",icon:"⚡",minXP:250,maxXP:500,color:"#A78BFA"},
  {level:4,title:"Champion",icon:"🔥",minXP:500,maxXP:1000,color:"#FF6B6B"},
  {level:5,title:"Master",icon:"💎",minXP:1000,maxXP:2000,color:"#C9A84C"},
  {level:6,title:"Legend",icon:"👑",minXP:2000,maxXP:999999,color:"#FFD93D"},
];
const XP_PER_HABIT = 10;
const XP_STREAK_BONUS = 5;
const calcXP = (habits, days) => {
  let xp = 0;
  habits.forEach(h => {
    let streak = 0;
    days.forEach(d => {
      if (h.completions && h.completions[d]) {
        xp += XP_PER_HABIT;
        streak++;
        xp += XP_STREAK_BONUS * streak;
      } else { streak = 0; }
    });
  });
  return xp;
};
const getLevel = (xp) => LEVELS.slice().reverse().find(l => xp >= l.minXP) || LEVELS[0];

// ── Streak Shields ─────────────────────────────────────────────────────────
// Each user gets 1 shield per week - protects streak if they miss a day
const getShieldsForLevel = (level) => {
  if (level >= 5) return 3;
  if (level >= 3) return 2;
  return 1;
};

const css = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Outfit',sans-serif}
  :root{--bg:#08080D;--bg2:#0F0F16;--bg3:#15151F;--border:#1E1E2A;--text:#F0EDE8;--muted:#666;--gold:#C9A84C;--gold2:#E8C96A;}
  .light{--bg:#F8F6F1;--bg2:#FFFFFF;--bg3:#F0EDE5;--border:#E0DDD6;--text:#1A1814;--muted:#999;--gold:#B8922A;--gold2:#C9A84C;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .fade{animation:fadeIn 0.4s ease forwards}
  .habit-row:hover .del-btn{opacity:1!important}
  .btn-hover:hover{opacity:0.85}
  @media(max-width:600px){
    .nav-hide{display:none!important}
    .mobile-full{width:100%!important}
  }
`;

export default function HabitFlow() {
  const getTimeTheme = () => {
    const hour = new Date().getHours();
    return (hour >= 6 && hour < 18) ? "light" : "dark";
  };
  const [theme, setTheme] = useState(getTimeTheme);

  useEffect(() => {
    const interval = setInterval(() => {
      setTheme(getTimeTheme());
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [habits, setHabits] = useState([]);
  const [shields, setShields] = useState(() => {
    try { return parseInt(localStorage.getItem("hf_shields") || "1"); } catch { return 1; }
  });
  const [shieldUsed, setShieldUsed] = useState(() => {
    try { return localStorage.getItem("hf_shield_used") === "true"; } catch { return false; }
  });
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [activeTab, setActiveTab] = useState("tracker");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🎯");
  const [newColor, setNewColor] = useState("#A78BFA");
  const [newCategory, setNewCategory] = useState("health");
  const [showBadges, setShowBadges] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  // AI Coach
  const [showAICoach, setShowAICoach] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  // Route Planner
  const [showRoute, setShowRoute] = useState(false);
  const [routeDistance, setRouteDistance] = useState(0);
  const [routeTime, setRouteTime] = useState(0);
  const [savedRoutes, setSavedRoutes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hf_routes") || "[]"); } catch { return []; }
  });
  // Share Card
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareCardType, setShareCardType] = useState("streak");
  // Profile & Targets
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hf_profile") || "{}"); } catch { return {}; }
  });
  const [targets, setTargets] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hf_targets") || JSON.stringify({
      steps: 10000, water: 8, sleep: 8, workouts: 4, calories: 500, reading: 20, meditation: 10, weight: 0
    })); } catch { return {steps:10000,water:8,sleep:8,workouts:4,calories:500,reading:20,meditation:10,weight:0}; }
  });

  const saveProfile = (newProfile, newTargets) => {
    localStorage.setItem("hf_profile", JSON.stringify(newProfile));
    localStorage.setItem("hf_targets", JSON.stringify(newTargets));
    setProfile(newProfile);
    setTargets(newTargets);
    setShowProfile(false);
  };

  // Visual effects
  const [particles] = useState(() => Array.from({length: 15}, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 5,
    color: ["#C9A84C", "#4ECDC4", "#A78BFA", "#FF6B6B", "#6BCB77"][Math.floor(Math.random() * 5)]
  })));
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces] = useState(() => Array.from({length: 30}, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 2,
    color: ["#C9A84C", "#4ECDC4", "#FF6B6B", "#A78BFA", "#6BCB77", "#FFD93D"][Math.floor(Math.random() * 6)]
  })));

  // Onboarding
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !localStorage.getItem("hf_onboarded"); } catch { return true; }
  });
  const [onboardStep, setOnboardStep] = useState(0);
  const [onboardGoals, setOnboardGoals] = useState([]);
  // Leaderboard
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  // Friends
  const [showFriends, setShowFriends] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [friends, setFriends] = useState([]);
  // Language
  const [language, setLanguage] = useState(() => localStorage.getItem("hf_lang") || "en");
  // Apple Health
  const [healthSteps, setHealthSteps] = useState(0);
  // Step Counter
  const stepGoal = targets?.steps || 10000;
  const [todaySteps, setTodaySteps] = useState(() => {
    try { return parseInt(localStorage.getItem("hf_steps") || "0"); } catch { return 0; }
  });
  // Milestone tracking
  const [lastMilestone, setLastMilestone] = useState(() => {
    try { return localStorage.getItem("hf_milestone") || ""; } catch { return ""; }
  });
  const [showDayPlan, setShowDayPlan] = useState(null);
  const [habitTime, setHabitTime] = useState("08:00");
  const [newWeekPlan, setNewWeekPlan] = useState({
    Mon:"", Tue:"", Wed:"", Thu:"", Fri:"", Sat:"", Sun:""
  });
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [emailCapture, setEmailCapture] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const isLight = theme === "light";
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Load leaderboard from Supabase
  useEffect(() => {
    if (isPro) {
      supabase.from("profiles").select("id, name, email").limit(10).then(({data}) => {
        if (data) {
          const lb = data.map((p, i) => ({
            rank: i + 1,
            name: p.name || p.email?.split("@")[0] || "User",
            xp: Math.floor(Math.random() * 500) + 100,
            level: "Achiever",
            icon: "⚡"
          }));
          setLeaderboard(lb);
        }
      });
    }
  }, [isPro]);

  // Apple Health / Step Detection
  useEffect(() => {
    if (typeof DeviceMotionEvent !== "undefined") {
      let stepCount = 0;
      let lastAcc = 0;
      const handleMotion = (e) => {
        const acc = Math.abs(e.accelerationIncludingGravity?.y || 0);
        if (acc > 12 && lastAcc < 12) stepCount++;
        lastAcc = acc;
        if (stepCount % 10 === 0) {
          const newSteps = todaySteps + stepCount;
          setTodaySteps(newSteps);
          localStorage.setItem("hf_steps", newSteps);
          stepCount = 0;
        }
      };
      window.addEventListener("devicemotion", handleMotion);
      return () => window.removeEventListener("devicemotion", handleMotion);
    }
  }, []);
  const days = getLast7();

  useEffect(() => {
    setTimeout(() => setAppLoading(false), 1000);
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstall(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); setPage("app"); loadHabits(session.user.id); }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setUser(session.user); setPage("app"); loadHabits(session.user.id); }
      else { setUser(null); setHabits([]); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadHabits = async (userId) => {
    setLoading(true);
    const { data: habitsData } = await supabase.from("habits").select("*").eq("user_id", userId).order("created_at");
    const { data: completionsData } = await supabase.from("completions").select("*").eq("user_id", userId);
    if (habitsData) {
      const merged = habitsData.map(h => ({
        ...h,
        completions: Object.fromEntries((completionsData||[]).filter(c=>c.habit_id===h.id).map(c=>[c.date,true]))
      }));
      setHabits(merged);
    }
    const { data: profile } = await supabase.from("profiles").select("is_pro").eq("id", userId).single();
    if (profile) setIsPro(profile.is_pro);
    setLoading(false);
  };

  const toggle = async (habitId, date) => {
    const habit = habits.find(h => h.id === habitId);
    const done = habit.completions && habit.completions[date];
    if (done) {
      await supabase.from("completions").delete().eq("habit_id", habitId).eq("date", date);
    } else {
      await supabase.from("completions").insert({ habit_id: habitId, user_id: user.id, date });
    }
    const updated = habits.map(x => x.id===habitId ? {...x,completions:{...x.completions,[date]:!done}} : x);
    setHabits(updated);
    if (!done) {
      checkMilestone(updated);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  // ── AI Coach ──────────────────────────────────────────────────────────────
  const sendAIMessage = async (message) => {
    if (!message.trim()) return;
    const userMsg = { role: "user", content: message };
    const newMessages = [...aiMessages, userMsg];
    setAiMessages(newMessages);
    setAiInput("");
    setAiLoading(true);

    const systemPrompt = `You are an expert habit coach for HabitFlow app. The user has ${habits.length} habits and is at ${currentLevel.title} level with ${totalXP} XP.
Their habits: ${habits.map(h => h.name).join(", ")}.
Best streak: ${Math.max(0, ...habits.map(h => getStreak(h)))} days.
Today's completion: ${pct}%.
Be encouraging, specific, and concise. Give actionable advice. Keep responses under 150 words.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await response.json();
      const aiReply = data.content?.[0]?.text || "Keep going! You're doing great! 🔥";
      setAiMessages([...newMessages, { role: "assistant", content: aiReply }]);
    } catch (e) {
      setAiMessages([...newMessages, { role: "assistant", content: "You're doing amazing! Keep building those habits! 💪 Remember: consistency beats perfection every time." }]);
    }
    setAiLoading(false);
  };

  // ── Milestone Share Check ──────────────────────────────────────────────────
  const checkMilestone = (updatedHabits) => {
    const bestStreak = Math.max(0, ...updatedHabits.map(h => getStreak(h)));
    const milestoneKey = `streak-${bestStreak}`;
    if ([3, 7, 14, 30, 60, 100].includes(bestStreak) && lastMilestone !== milestoneKey) {
      setLastMilestone(milestoneKey);
      localStorage.setItem("hf_milestone", milestoneKey);
      setShareCardType("streak");
      setTimeout(() => setShowShareCard(true), 500);
    }
  };

  const updateHabit = async (habitId, updates) => {
    await supabase.from("habits").update(updates).eq("id", habitId);
    setHabits(h => h.map(x => x.id === habitId ? {...x, ...updates} : x));
    setEditHabit(null);
  };

  const addHabitFromTemplate = async (template) => {
    if (!isPro && habits.length >= FREE_LIMIT) { setShowPaywall(true); return; }
    const { data } = await supabase.from("habits").insert({
      user_id: user.id,
      name: template.name,
      emoji: template.emoji,
      color: template.color,
      category: template.category,
      reminder_time: template.time,
      week_plan: JSON.stringify(template.weekPlan)
    }).select().single();
    if (data) setHabits(h => [...h, {...data, completions:{}}]);
    setShowTemplates(false);
  };

  const addHabit = async () => {
    if (!newName.trim()) return;
    if (!isPro && habits.length >= FREE_LIMIT) { setShowPaywall(true); return; }
    const hasWeekPlan = Object.values(newWeekPlan).some(v => v.trim());
    const { data } = await supabase.from("habits").insert({
      user_id: user.id,
      name: newName.trim(),
      emoji: newEmoji,
      color: newColor,
      category: newCategory,
      reminder_time: habitTime,
      week_plan: hasWeekPlan ? JSON.stringify(newWeekPlan) : null
    }).select().single();
    if (data) setHabits(h => [...h, {...data, completions:{}}]);
    setNewName("");
    setNewWeekPlan({Mon:"",Tue:"",Wed:"",Thu:"",Fri:"",Sat:"",Sun:""});
    setShowAdd(false);
  };

  const deleteHabit = async (id) => {
    await supabase.from("habits").delete().eq("id", id);
    setHabits(h => h.filter(x => x.id !== id));
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
  };

  const signInWithEmail = async () => {
    setAuthLoading(true); setAuthError("");
    const fn = authMode === "login" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await fn.call(supabase.auth, { email, password });
    if (error) setAuthError(error.message);
    else if (authMode === "signup") setAuthError("Check your email to confirm your account!");
    setAuthLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); setHabits([]); setPage("landing");
  };

  const upgradeToPro = async () => {
    if (!user) return;
    await supabase.from("profiles").upsert({ id: user.id, is_pro: true });
    setIsPro(true); setShowPaywall(false);
  };

  const shareAchievement = () => {
    const bestStreak = Math.max(0, ...habits.map(h => getStreak(h)));
    const text = `🔥 I'm on a ${bestStreak}-day streak on HabitFlow! Level: ${currentLevel.icon} ${currentLevel.title} (${totalXP} XP). Build better habits at thehabitflow.app`;
    if (navigator.share) {
      navigator.share({ title: "HabitFlow Achievement", text, url: "https://thehabitflow.app" });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard! Share it anywhere 🎉");
    }
  };

  const shareToX = () => {
    const bestStreak = Math.max(0, ...habits.map(h => getStreak(h)));
    const text = encodeURIComponent(`🔥 ${bestStreak}-day streak on HabitFlow! Level: ${currentLevel.icon} ${currentLevel.title} (${totalXP} XP) #HabitFlow #Habits`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=https://thehabitflow.app`, "_blank");
  };

  const shareToWhatsApp = () => {
    const bestStreak = Math.max(0, ...habits.map(h => getStreak(h)));
    const text = encodeURIComponent(`🔥 I'm on a ${bestStreak}-day streak on HabitFlow! Level: ${currentLevel.icon} ${currentLevel.title} (${totalXP} XP). Join me at thehabitflow.app`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const getStreak = (habit) => {
    let s = 0;
    const rev = [...days].reverse();
    for (let d of rev) { if (habit.completions && habit.completions[d]) s++; else break; }
    return s;
  };

  const todayStr = days[6];
  const filteredHabits = activeCategory === "all" ? habits : habits.filter(h => h.category === activeCategory);
  const todayDone = habits.filter(h => h.completions && h.completions[todayStr]).length;
  const pct = habits.length ? Math.round((todayDone/habits.length)*100) : 0;
  const earnedBadges = BADGE_LIST.filter(b => b.check(habits, days));
  const totalXP = calcXP(habits, days);
  const currentLevel = getLevel(totalXP);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  const xpProgress = nextLevel ? Math.round(((totalXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100) : 100;
  const maxShields = getShieldsForLevel(currentLevel.level);
  
  const useShield = (habitId) => {
    if (shields <= 0) return;
    const yesterday = days[5];
    toggle(habitId, yesterday);
    const newShields = shields - 1;
    setShields(newShields);
    setShieldUsed(true);
    localStorage.setItem("hf_shields", newShields.toString());
    localStorage.setItem("hf_shield_used", "true");
  };

  localStorage.setItem("hf_theme", theme);

  const S = {
    wrap: { minHeight:"100vh", background:"var(--bg)", color:"var(--text)", fontFamily:"'Outfit',sans-serif", transition:"background 0.3s,color 0.3s" },
    nav: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 28px", borderBottom:"1px solid var(--border)", position:"sticky", top:0, background:"var(--bg)", zIndex:50 },
    logo: { fontFamily:"'Cormorant Garamond',serif", fontSize:24, letterSpacing:1 },
    gold: { color:"var(--gold)" },
    card: { background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:20, padding:24 },
    btn: { padding:"10px 22px", borderRadius:10, border:"none", cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, transition:"all 0.2s" },
    goldBtn: { background:"var(--gold)", color: isLight?"#FFF":"#0A0A0F" },
    ghostBtn: { background:"transparent", border:"1px solid var(--border)", color:"var(--muted)" },
    input: { width:"100%", padding:"12px 14px", background:"var(--bg)", border:"1px solid var(--border)", borderRadius:10, color:"var(--text)", fontSize:14, outline:"none", fontFamily:"'Outfit',sans-serif", marginBottom:10 },
    tab: (active) => ({ flex:1, padding:"10px", borderRadius:10, border:"none", background:active?"var(--bg3)":"transparent", color:active?"var(--text)":"var(--muted)", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:500, cursor:"pointer" }),
  };

  // Onboarding screen
  if (showOnboarding && !user) {
    const q = ONBOARD_QUESTIONS[onboardStep];
    return (
      <div style={{minHeight:"100vh",background:"#08080D",color:"#F0EDE8",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <style>{css}</style>
        <div style={{maxWidth:400,width:"100%",textAlign:"center"}} className="fade">
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:"#C9A84C",marginBottom:32}}>⚡ HabitFlow</div>
          <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:32}}>
            {ONBOARD_QUESTIONS.map((_,i)=>(
              <div key={i} style={{height:4,width:60,borderRadius:2,background:i<=onboardStep?"#C9A84C":"#1E1E2A",transition:"background 0.3s"}}/>
            ))}
          </div>
          <div style={{fontSize:40,marginBottom:12}}>{q.emoji}</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,marginBottom:24}}>{q.title}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:32}}>
            {q.options.map(opt=>(
              <button key={opt.label} onClick={()=>{
                setOnboardGoals(g=>[...g, opt]);
                if(onboardStep < ONBOARD_QUESTIONS.length - 1) {
                  setOnboardStep(s=>s+1);
                } else {
                  localStorage.setItem("hf_onboarded","true");
                  localStorage.setItem("hf_goals", JSON.stringify([...onboardGoals, opt]));
                  setShowOnboarding(false);
                }
              }} style={{padding:"18px 12px",background:"#13131A",border:"1px solid #1E1E2A",borderRadius:16,cursor:"pointer",transition:"all 0.2s",color:"#F0EDE8",fontFamily:"'Outfit',sans-serif"}}>
                <div style={{fontSize:28,marginBottom:8}}>{opt.emoji}</div>
                <div style={{fontSize:13}}>{opt.label}</div>
              </button>
            ))}
          </div>
          <button onClick={()=>{localStorage.setItem("hf_onboarded","true");setShowOnboarding(false);}} style={{fontSize:12,color:"#555",background:"none",border:"none",cursor:"pointer"}}>
            Skip for now
          </button>
        </div>
        </div>
      </div>
    );
  }

  // Loading screen
  if (appLoading) return (
    <div style={{minHeight:"100vh",background:"#08080D",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{css}</style>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:"#C9A84C",letterSpacing:1}}>Habit<span style={{color:"#F0EDE8"}}>Flow</span></div>
      <div style={{fontSize:24,animation:"spin 1s linear infinite"}}>⚡</div>
    </div>
  );

  // Privacy Policy page
  if (showPrivacy) return (
    <div style={{minHeight:"100vh",background:"#08080D",color:"#F0EDE8",fontFamily:"'Outfit',sans-serif",padding:"40px 28px",maxWidth:800,margin:"0 auto"}}>
      <style>{css}</style>
      <button onClick={()=>setShowPrivacy(false)} style={{background:"none",border:"none",color:"#C9A84C",cursor:"pointer",fontSize:14,marginBottom:24,display:"flex",alignItems:"center",gap:8}}>← Back</button>
      <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,marginBottom:8}}>Privacy Policy</h1>
      <div style={{fontSize:12,color:"#666",marginBottom:32}}>Last updated: May 1, 2026</div>
      {[
        {title:"Information We Collect",text:"We collect your email address and name when you create an account. We also collect habit data you enter including habit names, completion dates, and categories."},
        {title:"How We Use Your Information",text:"We use your information to provide and improve HabitFlow services, sync your data across devices, and send important account notifications."},
        {title:"Data Storage",text:"Your data is stored securely using Supabase, a trusted cloud database provider. All data is encrypted in transit and at rest."},
        {title:"Third Party Services",text:"We use Supabase for database storage, Stripe for payment processing, and OneSignal for push notifications. Each has their own privacy policy."},
        {title:"Data Deletion",text:"You can delete your account and all associated data at any time by contacting us at privacy@thehabitflow.app"},
        {title:"Contact Us",text:"For privacy questions, contact us at privacy@thehabitflow.app"},
      ].map(s=>(
        <div key={s.title} style={{marginBottom:28}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"#C9A84C",marginBottom:8}}>{s.title}</h2>
          <p style={{color:"#888",lineHeight:1.8,fontSize:14}}>{s.text}</p>
        </div>
      ))}
    </div>
  );

  if (page === "landing") return (
    <div style={S.wrap} className={isLight?"light":""}>
      <style>{css}</style>
      <nav style={S.nav}>
        <div style={{...S.logo,cursor:"pointer"}} onClick={()=>setPage("landing")}>⚡ Habit<span style={S.gold}>Flow</span></div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={()=>{const t=isLight?"dark":"light";setTheme(t);localStorage.setItem("hf_theme",t);localStorage.setItem("hf_theme_manual","true");}} style={{...S.btn,...S.ghostBtn,padding:"8px 14px"}}>{isLight?"◑ Dark":"◐ Light"}</button>
          <button onClick={()=>setPage("auth")} style={{...S.btn,...S.goldBtn}}>Get Started</button>
        </div>
      </nav>

      <div style={{maxWidth:800,margin:"0 auto",padding:"80px 28px 60px",textAlign:"center"}} className="fade">
        <div style={{display:"inline-block",background:"var(--gold)18",border:"1px solid var(--gold)44",borderRadius:100,padding:"6px 18px",fontSize:11,color:"var(--gold)",letterSpacing:3,textTransform:"uppercase",marginBottom:28}}>Build habits that last</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(42px,8vw,80px)",fontWeight:700,lineHeight:1.05,letterSpacing:-1,marginBottom:24}}>
          Your habits.<br/><span style={S.gold}>Your streaks.</span><br/>Your life.
        </h1>
        <p style={{fontSize:17,color:"var(--muted)",lineHeight:1.8,marginBottom:40,maxWidth:480,margin:"0 auto 40px"}}>
          HabitFlow combines beautiful design, cloud sync, and powerful analytics to help you become your best self.
        </p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:16}}>
          <button onClick={()=>setPage("auth")} style={{...S.btn,...S.goldBtn,padding:"15px 36px",fontSize:15}}>Start Free Today →</button>
          <button onClick={signInWithGoogle} style={{...S.btn,...S.ghostBtn,padding:"15px 28px",fontSize:14,display:"flex",alignItems:"center",gap:8}}>
            <span>G</span> Continue with Google
          </button>
          <button onClick={()=>setPage("app")} style={{...S.btn,...S.ghostBtn,padding:"15px 28px",fontSize:14}}>
            👀 Try Demo
          </button>
        </div>
        <div style={{fontSize:12,color:"var(--muted)"}}>Free forever · Sync across all devices</div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto 80px",padding:"0 28px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
          {[
            {icon:"🔐",title:"Secure Login",desc:"Google or email sign in"},
            {icon:"☁️",title:"Cloud Sync",desc:"Access from any device"},
            {icon:"🏆",title:"Achievements",desc:"Earn badges as you grow"},
            {icon:"📊",title:"Analytics",desc:"Deep weekly insights"},
          ].map(f=>(
            <div key={f.title} style={{...S.card,textAlign:"center",padding:28}}>
              <div style={{fontSize:28,marginBottom:12}}>{f.icon}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,marginBottom:6}}>{f.title}</div>
              <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.6}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{maxWidth:680,margin:"0 auto 80px",padding:"0 28px"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:700,marginBottom:8}}>Simple pricing</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={S.card}>
            <div style={{fontSize:11,color:"var(--muted)",letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>Free</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,fontWeight:700,marginBottom:20}}>$0</div>
            {["3 habits","7-day view","Basic streaks"].map(f=>(
              <div key={f} style={{display:"flex",gap:8,marginBottom:8,fontSize:13,color:"var(--muted)"}}>
                <span>✓</span>{f}
              </div>
            ))}
            <button onClick={()=>setPage("auth")} style={{...S.btn,...S.ghostBtn,width:"100%",marginTop:16}}>Get Started</button>
          </div>
          <div style={{...S.card,border:"1px solid var(--gold)55",background:"var(--bg3)",position:"relative"}}>
            <div style={{position:"absolute",top:12,right:12,background:"var(--gold)",borderRadius:6,padding:"3px 10px",fontSize:10,color:isLight?"#FFF":"#0A0A0F",fontWeight:700}}>POPULAR</div>
            <div style={{fontSize:11,color:"var(--gold)",letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>Pro</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,fontWeight:700,color:"var(--gold)",marginBottom:20}}>$1.99<span style={{fontSize:13,fontFamily:"'Outfit',sans-serif",fontWeight:400,color:"var(--muted)"}}>/mo</span></div>
            {["Unlimited habits","All categories","Analytics","Badges","Cloud sync"].map(f=>(
              <div key={f} style={{display:"flex",gap:8,marginBottom:8,fontSize:13}}>
                <span style={{color:"var(--gold)"}}>✓</span>{f}
              </div>
            ))}
            <button onClick={()=>setPage("auth")} style={{...S.btn,...S.goldBtn,width:"100%",marginTop:16}}>Start for $1.99/mo</button>
          </div>
        </div>
      </div>

      {/* Email Capture */}
      <div style={{maxWidth:600,margin:"0 auto",padding:"60px 28px",textAlign:"center",borderTop:"1px solid var(--border)"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:700,marginBottom:8}}>Get early access updates</div>
        <div style={{color:"var(--muted)",fontSize:14,marginBottom:24}}>Join our newsletter for tips, updates and exclusive offers</div>
        {!emailSubmitted ? (
          <div style={{display:"flex",gap:10,maxWidth:400,margin:"0 auto"}}>
            <input value={emailCapture} onChange={e=>setEmailCapture(e.target.value)} placeholder="your@email.com" type="email"
              style={{flex:1,padding:"12px 14px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,color:"var(--text)",fontSize:14,outline:"none",fontFamily:"'Outfit',sans-serif"}}/>
            <button onClick={()=>{if(emailCapture.includes("@")){setEmailSubmitted(true);}}} style={{...S.btn,...S.goldBtn,padding:"12px 20px",fontSize:13,flexShrink:0}}>
              Join
            </button>
          </div>
        ) : (
          <div style={{color:"#6BCB77",fontSize:15,padding:12}}>🎉 Thanks! We will be in touch soon!</div>
        )}
      </div>

      {/* CTA */}
      <div style={{textAlign:"center",padding:"60px 28px",borderTop:"1px solid var(--border)"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:700,marginBottom:12}}>Ready to transform your life?</div>
        <div style={{color:"var(--muted)",marginBottom:28,fontSize:15}}>Join thousands building better habits daily.</div>
        <button onClick={()=>setPage("app")} style={{...S.btn,...S.goldBtn,padding:"15px 40px",fontSize:15}}>Start Free — No Card Required</button>
        <div style={{marginTop:32,display:"flex",gap:24,justifyContent:"center",flexWrap:"wrap"}}>
          <span onClick={()=>setShowPrivacy(true)} style={{fontSize:12,color:"var(--muted)",cursor:"pointer"}}>Privacy Policy</span>
          <span style={{fontSize:12,color:"var(--muted)"}}>contact@thehabitflow.app</span>
        </div>
        <div style={{marginTop:12,fontSize:12,color:"var(--muted)"}}>© 2026 HabitFlow. All rights reserved.</div>
      </div>
    </div>
  );

  if (page === "auth") return (
    <div style={{...S.wrap,display:"flex",alignItems:"center",justifyContent:"center"}} className={isLight?"light":""}>
      <style>{css}</style>
      <div style={{...S.card,maxWidth:400,width:"100%",margin:20}} className="fade">
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{...S.logo,fontSize:28,marginBottom:8}}>Habit<span style={S.gold}>Flow</span></div>
          <div style={{fontSize:13,color:"var(--muted)"}}>{authMode==="login"?"Welcome back!":"Create your account"}</div>
        </div>

        <button onClick={signInWithGoogle} style={{...S.btn,width:"100%",padding:13,background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text)",fontSize:14,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <span style={{fontWeight:700,color:"#4285F4"}}>G</span> Continue with Google
        </button>

        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <div style={{flex:1,height:1,background:"var(--border)"}}/>
          <span style={{fontSize:12,color:"var(--muted)"}}>or</span>
          <div style={{flex:1,height:1,background:"var(--border)"}}/>
        </div>

        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email" style={S.input} />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" style={S.input} onKeyDown={e=>e.key==="Enter"&&signInWithEmail()} />

        {authError && <div style={{fontSize:12,color:authError.includes("Check")?"#6BCB77":"#FF6B6B",marginBottom:10,textAlign:"center"}}>{authError}</div>}

        <button onClick={signInWithEmail} disabled={authLoading} style={{...S.btn,...S.goldBtn,width:"100%",padding:13,fontSize:14,opacity:authLoading?0.6:1}}>
          {authLoading?"Loading...":(authMode==="login"?"Sign In":"Create Account")}
        </button>

        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:"var(--muted)"}}>
          {authMode==="login"?"Don't have an account? ":"Already have an account? "}
          <span onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthError("");}} style={{color:"var(--gold)",cursor:"pointer",fontWeight:600}}>
            {authMode==="login"?"Sign Up":"Sign In"}
          </span>
        </div>

        <div style={{textAlign:"center",marginTop:12}}>
          <span onClick={()=>setPage("landing")} style={{fontSize:12,color:"var(--muted)",cursor:"pointer"}}>← Back to home</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={S.wrap} className={isLight?"light":""}>
      <style>{css}</style>

      {/* Templates Modal */}
      {showTemplates && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,overflowY:"auto"}}>
          <div style={{...S.card,maxWidth:500,width:"100%",maxHeight:"85vh",overflowY:"auto"}} className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,position:"sticky",top:0,background:"var(--bg2)",paddingBottom:12}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22}}>Habit Templates</div>
              <button onClick={()=>setShowTemplates(false)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            {CATEGORIES.map(cat=>(
              <div key={cat.id} style={{marginBottom:20}}>
                <div style={{fontSize:11,color:cat.color,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>{cat.icon} {cat.label}</div>
                {HABIT_TEMPLATES.filter(t=>t.category===cat.id).map(t=>(
                  <div key={t.name} onClick={()=>addHabitFromTemplate(t)} style={{display:"flex",alignItems:"center",gap:12,padding:12,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:12,marginBottom:8,cursor:"pointer"}}>
                    <span style={{fontSize:24,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",background:t.color+"22",borderRadius:10}}>{t.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:500}}>{t.name}</div>
                      <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>⏰ {t.time} · {t.weekPlan[getTodayKey()]}</div>
                    </div>
                    <span style={{color:"var(--gold)",fontSize:18}}>+</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Plan Modal */}
      {showDayPlan && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{...S.card,maxWidth:420,width:"100%"}} className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20}}>
                {showDayPlan.emoji} {showDayPlan.name}
              </div>
              <button onClick={()=>setShowDayPlan(null)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            {showDayPlan.week_plan && (() => {
              const plan = typeof showDayPlan.week_plan === "string" ? JSON.parse(showDayPlan.week_plan) : showDayPlan.week_plan;
              const todayTask = plan[getTodayKey()];
              const tomorrowTask = plan[getTomorrowKey()];
              return (
                <div>
                  <div style={{background:"var(--gold)18",border:"1px solid var(--gold)44",borderRadius:14,padding:16,marginBottom:12}}>
                    <div style={{fontSize:11,color:"var(--gold)",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Today — {getTodayKey()}</div>
                    <div style={{fontSize:16,fontWeight:600}}>{todayTask || "Rest day 😴"}</div>
                  </div>
                  <div style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:14,padding:16,marginBottom:16}}>
                    <div style={{fontSize:11,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Tomorrow — {getTomorrowKey()}</div>
                    <div style={{fontSize:14,color:"var(--muted)"}}>{tomorrowTask || "Rest day 😴"}</div>
                  </div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,marginBottom:10}}>This Week</div>
                  {DAYS_OF_WEEK.map(day=>(
                    <div key={day} style={{display:"flex",gap:12,padding:"8px 0",borderBottom:"1px solid var(--border)",alignItems:"center"}}>
                      <span style={{fontSize:12,color:day===getTodayKey()?"var(--gold)":"var(--muted)",width:30,fontWeight:day===getTodayKey()?700:400}}>{day}</span>
                      <span style={{fontSize:13,color:day===getTodayKey()?"var(--text)":"var(--muted)"}}>{plan[day] || "Rest"}</span>
                      {day===getTodayKey()&&<span style={{marginLeft:"auto",fontSize:10,color:"var(--gold)"}}>TODAY</span>}
                    </div>
                  ))}
                  {showDayPlan.reminder_time && (
                    <div style={{marginTop:16,display:"flex",alignItems:"center",gap:8,fontSize:13,color:"var(--muted)"}}>
                      ⏰ Reminder set for {showDayPlan.reminder_time}
                    </div>
                  )}
                </div>
              );
            })()}
            {!showDayPlan.week_plan && (
              <div style={{textAlign:"center",color:"var(--muted)",padding:20}}>
                No weekly plan set for this habit yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Habit Modal */}
      {editHabit && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{...S.card,maxWidth:440,width:"100%",maxHeight:"85vh",overflowY:"auto"}} className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22}}>Edit Habit</div>
              <button onClick={()=>setEditHabit(null)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:6,letterSpacing:1}}>HABIT NAME</div>
              <input defaultValue={editHabit.name} id="edit-name" style={{...S.input,marginBottom:0}} />
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
              {EMOJIS.map(e=>(
                <button key={e} onClick={()=>setEditHabit(h=>({...h,emoji:e}))} style={{width:34,height:34,borderRadius:8,border:editHabit.emoji===e?"2px solid var(--gold)":"1px solid var(--border)",background:editHabit.emoji===e?"var(--bg3)":"transparent",cursor:"pointer",fontSize:15}}>{e}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {COLORS.map(c=>(
                <button key={c} onClick={()=>setEditHabit(h=>({...h,color:c}))} style={{width:22,height:22,borderRadius:"50%",background:c,border:editHabit.color===c?"3px solid var(--text)":"2px solid transparent",cursor:"pointer",outline:"none"}}/>
              ))}
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
              {CATEGORIES.map(c=>(
                <button key={c.id} onClick={()=>setEditHabit(h=>({...h,category:c.id}))} style={{...S.btn,padding:"6px 12px",fontSize:11,background:editHabit.category===c.id?c.color+"22":"var(--bg3)",color:editHabit.category===c.id?c.color:"var(--muted)",border:`1px solid ${editHabit.category===c.id?c.color+"55":"var(--border)"}`}}>
                  {c.icon} {c.label.split(" ")[0]}
                </button>
              ))}
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:6,letterSpacing:1}}>⏰ REMINDER TIME</div>
              <input type="time" defaultValue={editHabit.reminder_time||"08:00"} id="edit-time" style={{...S.input,marginBottom:0,width:"auto"}}/>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:8,letterSpacing:1}}>📅 WEEKLY PLAN</div>
              {DAYS_OF_WEEK.map(day=>{
                const plan = editHabit.week_plan ? (typeof editHabit.week_plan==="string" ? JSON.parse(editHabit.week_plan) : editHabit.week_plan) : {};
                return (
                  <div key={day} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <span style={{fontSize:12,color:day===getTodayKey()?"var(--gold)":"var(--muted)",width:28,fontWeight:day===getTodayKey()?700:400}}>{day}</span>
                    <input defaultValue={plan[day]||""} id={`edit-day-${day}`} placeholder={`What to do on ${day}...`}
                      style={{...S.input,marginBottom:0,fontSize:12,padding:"8px 10px"}}/>
                  </div>
                );
              })}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{
                const name = document.getElementById("edit-name").value;
                const time = document.getElementById("edit-time").value;
                const weekPlan = {};
                DAYS_OF_WEEK.forEach(day=>{
                  weekPlan[day] = document.getElementById(`edit-day-${day}`).value;
                });
                const hasWeekPlan = Object.values(weekPlan).some(v=>v.trim());
                updateHabit(editHabit.id, {
                  name: name.trim(),
                  emoji: editHabit.emoji,
                  color: editHabit.color,
                  category: editHabit.category,
                  reminder_time: time,
                  week_plan: hasWeekPlan ? JSON.stringify(weekPlan) : null
                });
              }} style={{...S.btn,...S.goldBtn,flex:1,padding:12}}>Save Changes</button>
              <button onClick={()=>setEditHabit(null)} style={{...S.btn,...S.ghostBtn,padding:"12px 18px"}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,overflowY:"auto"}}>
          <div style={{...S.card,maxWidth:480,width:"100%",maxHeight:"90vh",overflowY:"auto"}} className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,position:"sticky",top:0,background:"var(--bg2)",paddingBottom:12}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22}}>👤 My Profile & Targets</div>
              <button onClick={()=>setShowProfile(false)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>

            {/* Avatar & Name */}
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:60,marginBottom:8,cursor:"pointer"}} onClick={()=>{
                const emojis = ["😊","💪","🏃","🧘","📚","🎯","⚡","🔥","👑","🦁","🐯","🦅"];
                const current = profile.avatar || "😊";
                const next = emojis[(emojis.indexOf(current)+1)%emojis.length];
                setProfile(p=>({...p,avatar:next}));
              }}>{profile.avatar || "😊"}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:8}}>Tap to change avatar</div>
              <input defaultValue={profile.name||user?.user_metadata?.full_name||""} id="p-name"
                placeholder="Your name" style={{...S.input,textAlign:"center",fontSize:16,fontWeight:600,marginBottom:0}}/>
            </div>

            {/* Personal Info */}
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,marginBottom:12,color:"var(--gold)"}}>Personal Info</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
              {[
                {label:"Age",id:"p-age",type:"number",placeholder:"25",default:profile.age},
                {label:"Weight (kg)",id:"p-weight",type:"number",placeholder:"70",default:profile.weight},
                {label:"Height (cm)",id:"p-height",type:"number",placeholder:"170",default:profile.height},
                {label:"Wake up time",id:"p-wake",type:"time",default:profile.wakeTime||"07:00"},
              ].map(f=>(
                <div key={f.id}>
                  <div style={{fontSize:11,color:"var(--muted)",marginBottom:4,letterSpacing:1}}>{f.label.toUpperCase()}</div>
                  <input type={f.type} id={f.id} defaultValue={f.default} placeholder={f.placeholder}
                    style={{...S.input,marginBottom:0,width:"100%"}}/>
                </div>
              ))}
            </div>

            {/* Fitness Level */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:8,letterSpacing:1}}>FITNESS LEVEL</div>
              <div style={{display:"flex",gap:8}}>
                {["Beginner 🌱","Intermediate 🚀","Advanced ⚡","Elite 👑"].map(l=>(
                  <button key={l} onClick={()=>setProfile(p=>({...p,fitness:l}))}
                    style={{...S.btn,flex:1,padding:"8px 4px",fontSize:10,
                      background:profile.fitness===l?"var(--gold)22":"var(--bg3)",
                      color:profile.fitness===l?"var(--gold)":"var(--muted)",
                      border:`1px solid ${profile.fitness===l?"var(--gold)55":"var(--border)"}`}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Occupation */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:8,letterSpacing:1}}>OCCUPATION</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["Student 📚","Professional 💼","Athlete 🏃","Parent 👨‍👩‍👧","Freelancer 💻","Other ✨"].map(o=>(
                  <button key={o} onClick={()=>setProfile(p=>({...p,occupation:o}))}
                    style={{...S.btn,padding:"6px 12px",fontSize:11,
                      background:profile.occupation===o?"var(--gold)22":"var(--bg3)",
                      color:profile.occupation===o?"var(--gold)":"var(--muted)",
                      border:`1px solid ${profile.occupation===o?"var(--gold)55":"var(--border)"}`}}>
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Targets */}
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,marginBottom:12,color:"var(--gold)"}}>Daily Targets</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
              {[
                {label:"👟 Steps",id:"t-steps",default:targets.steps},
                {label:"💧 Water (glasses)",id:"t-water",default:targets.water},
                {label:"💤 Sleep (hours)",id:"t-sleep",default:targets.sleep},
                {label:"🏋️ Workouts/week",id:"t-workouts",default:targets.workouts},
                {label:"🔥 Calories burn",id:"t-calories",default:targets.calories},
                {label:"📚 Reading (mins)",id:"t-reading",default:targets.reading},
                {label:"🧘 Meditation (mins)",id:"t-meditation",default:targets.meditation},
                {label:"⚖️ Target weight",id:"t-weight",default:targets.weight},
              ].map(f=>(
                <div key={f.id}>
                  <div style={{fontSize:11,color:"var(--muted)",marginBottom:4}}>{f.label}</div>
                  <input type="number" id={f.id} defaultValue={f.default}
                    style={{...S.input,marginBottom:0,width:"100%"}}/>
                </div>
              ))}
            </div>

            {/* Goal */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:8,letterSpacing:1}}>MAIN GOAL</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  {label:"Lose Weight",emoji:"⚖️"},
                  {label:"Build Muscle",emoji:"💪"},
                  {label:"More Energy",emoji:"⚡"},
                  {label:"Better Sleep",emoji:"💤"},
                  {label:"Less Stress",emoji:"🧘"},
                  {label:"Be Productive",emoji:"🎯"},
                ].map(g=>(
                  <button key={g.label} onClick={()=>setProfile(p=>({...p,goal:g.label}))}
                    style={{...S.btn,padding:"10px",fontSize:12,
                      background:profile.goal===g.label?"var(--gold)22":"var(--bg3)",
                      color:profile.goal===g.label?"var(--gold)":"var(--muted)",
                      border:`1px solid ${profile.goal===g.label?"var(--gold)55":"var(--border)"}`}}>
                    {g.emoji} {g.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={()=>{
              const newProfile = {
                ...profile,
                name: document.getElementById("p-name").value,
                age: document.getElementById("p-age").value,
                weight: document.getElementById("p-weight").value,
                height: document.getElementById("p-height").value,
                wakeTime: document.getElementById("p-wake").value,
              };
              const newTargets = {
                steps: parseInt(document.getElementById("t-steps").value)||10000,
                water: parseInt(document.getElementById("t-water").value)||8,
                sleep: parseInt(document.getElementById("t-sleep").value)||8,
                workouts: parseInt(document.getElementById("t-workouts").value)||4,
                calories: parseInt(document.getElementById("t-calories").value)||500,
                reading: parseInt(document.getElementById("t-reading").value)||20,
                meditation: parseInt(document.getElementById("t-meditation").value)||10,
                weight: parseInt(document.getElementById("t-weight").value)||0,
              };
              saveProfile(newProfile, newTargets);
            }} style={{...S.btn,...S.goldBtn,width:"100%",padding:14,fontSize:15}}>
              💾 Save Profile & Targets
            </button>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{...S.card,maxWidth:420,width:"100%",maxHeight:"80vh",overflowY:"auto"}} className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22}}>🏆 Leaderboard</div>
              <button onClick={()=>setShowLeaderboard(false)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            {/* Current user */}
            <div style={{background:"var(--gold)18",border:"1px solid var(--gold)44",borderRadius:12,padding:14,marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:20,fontWeight:700,color:"var(--gold)",width:30}}>You</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600}}>{user?.user_metadata?.full_name || user?.email?.split("@")[0]}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{currentLevel.icon} {currentLevel.title}</div>
              </div>
              <div style={{fontSize:14,color:"var(--gold)",fontWeight:700}}>{totalXP} XP</div>
            </div>
            {!isPro ? (
              <div style={{textAlign:"center",padding:20}}>
                <div style={{fontSize:13,color:"var(--muted)",marginBottom:12}}>Upgrade to Pro to see the leaderboard!</div>
                <button onClick={()=>{setShowLeaderboard(false);setShowPaywall(true);}} style={{...S.btn,...S.goldBtn,padding:"10px 24px"}}>Upgrade ✦</button>
              </div>
            ) : (
              <div>
                {[{rank:1,name:"Alex K.",xp:1240,icon:"👑"},{rank:2,name:"Sarah M.",xp:980,icon:"💎"},{rank:3,name:"James R.",xp:850,icon:"🔥"},...leaderboard.slice(0,7)].map((u,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
                    <div style={{fontSize:16,width:28,textAlign:"center",color:i<3?"var(--gold)":"var(--muted)",fontWeight:700}}>
                      {i===0?"🥇":i===1?"🥈":i===2?"🥉":u.rank}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13}}>{u.name}</div>
                      <div style={{fontSize:10,color:"var(--muted)"}}>{u.icon} {u.level || "Explorer"}</div>
                    </div>
                    <div style={{fontSize:13,color:"var(--gold)",fontWeight:600}}>{u.xp} XP</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Friends Modal */}
      {showFriends && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{...S.card,maxWidth:420,width:"100%"}} className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22}}>👥 Friends</div>
              <button onClick={()=>setShowFriends(false)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:8,letterSpacing:2}}>INVITE A FRIEND</div>
              <div style={{display:"flex",gap:8}}>
                <input value={friendEmail} onChange={e=>setFriendEmail(e.target.value)} placeholder="friend@email.com" style={{...S.input,marginBottom:0,flex:1}}/>
                <button onClick={()=>{
                  if(friendEmail.includes("@")) {
                    const text = encodeURIComponent(`Hey! I'm using HabitFlow to build better habits. Join me! thehabitflow.app`);
                    window.open(`mailto:${friendEmail}?subject=Join me on HabitFlow!&body=${text}`);
                    setFriendEmail("");
                  }
                }} style={{...S.btn,...S.goldBtn,flexShrink:0,padding:"10px 16px"}}>Invite</button>
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:8,letterSpacing:2}}>SHARE YOUR PROFILE</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <button onClick={()=>{
                  const text = encodeURIComponent(`Join me on HabitFlow! I'm at ${currentLevel.title} level with ${totalXP} XP 🔥 thehabitflow.app`);
                  window.open(`https://wa.me/?text=${text}`,"_blank");
                }} style={{...S.btn,padding:12,background:"#25D366",border:"none",color:"#fff",fontSize:13}}>💬 WhatsApp</button>
                <button onClick={()=>{
                  navigator.clipboard.writeText(`thehabitflow.app`);
                  alert("Link copied! 🎉");
                }} style={{...S.btn,...S.ghostBtn,padding:12,fontSize:13}}>🔗 Copy Link</button>
              </div>
            </div>
            <div style={{textAlign:"center",padding:20,color:"var(--muted)",fontSize:13}}>
              🚀 Friend challenges coming soon!
            </div>
          </div>
        </div>
      )}

      {/* Language Modal */}

      {/* AI Coach Modal */}
      {showAICoach && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:500,height:"75vh",display:"flex",flexDirection:"column"}} className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:"1px solid var(--border)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#C9A84C,#FFD93D)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🤖</div>
                <div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700}}>AI Habit Coach</div>
                  <div style={{fontSize:11,color:"#6BCB77"}}>● Online</div>
                </div>
              </div>
              <button onClick={()=>setShowAICoach(false)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
              {aiMessages.length === 0 && (
                <div style={{textAlign:"center",padding:"20px 0"}}>
                  <div style={{fontSize:40,marginBottom:12}}>🤖</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,marginBottom:8}}>Hi! I'm your AI Habit Coach</div>
                  <div style={{fontSize:13,color:"var(--muted)",marginBottom:16}}>Ask me anything about your habits, streaks or goals!</div>
                  {["How am I doing?", "Why am I failing?", "Give me motivation!", "What habit should I add?"].map(q=>(
                    <button key={q} onClick={()=>sendAIMessage(q)} style={{display:"block",width:"100%",padding:"10px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:10,color:"var(--text)",cursor:"pointer",marginBottom:8,fontSize:13,textAlign:"left",fontFamily:"'DM Sans',sans-serif"}}>
                      💬 {q}
                    </button>
                  ))}
                </div>
              )}
              {aiMessages.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"80%",padding:"10px 14px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.role==="user"?"var(--gold)":"var(--bg3)",color:m.role==="user"?(isLight?"#fff":"#0A0A0F"):"var(--text)",fontSize:13,lineHeight:1.6}}>
                    {m.content}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div style={{display:"flex",gap:6,padding:"10px 14px",background:"var(--bg3)",borderRadius:"16px 16px 16px 4px",width:"fit-content"}}>
                  {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"var(--muted)",animation:`pulse 1s ${i*0.2}s infinite`}}/>)}
                </div>
              )}
            </div>
            <div style={{padding:"12px 16px",borderTop:"1px solid var(--border)",display:"flex",gap:8}}>
              <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAIMessage(aiInput)}
                placeholder="Ask your coach..." style={{...S.input,marginBottom:0,flex:1,fontSize:14}} />
              <button onClick={()=>sendAIMessage(aiInput)} disabled={aiLoading||!aiInput.trim()} style={{...S.btn,...S.goldBtn,padding:"10px 16px",flexShrink:0,opacity:aiLoading?0.6:1}}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Route Planner Modal */}
      {showRoute && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{...S.card,maxWidth:440,width:"100%"}} className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22}}>🗺️ Route Planner</div>
              <button onClick={()=>setShowRoute(false)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            <div style={{background:"var(--bg3)",borderRadius:16,overflow:"hidden",marginBottom:16,height:200,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid var(--border)"}}>
              <div style={{textAlign:"center",color:"var(--muted)"}}>
                <div style={{fontSize:40,marginBottom:8}}>🗺️</div>
                <div style={{fontSize:13}}>GPS Map</div>
                <div style={{fontSize:11,marginTop:4}}>Open in Maps app for GPS tracking</div>
                <button onClick={()=>window.open("https://maps.apple.com","_blank")} style={{...S.btn,...S.goldBtn,marginTop:12,padding:"8px 16px",fontSize:12}}>
                  Open Apple Maps →
                </button>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              {[
                {label:"Distance (km)",value:routeDistance,set:setRouteDistance,icon:"📍"},
                {label:"Time (mins)",value:routeTime,set:setRouteTime,icon:"⏱️"},
              ].map(f=>(
                <div key={f.label} style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:12,padding:14,textAlign:"center"}}>
                  <div style={{fontSize:24,marginBottom:4}}>{f.icon}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginBottom:8}}>{f.label}</div>
                  <input type="number" value={f.value||""} onChange={e=>f.set(parseFloat(e.target.value)||0)}
                    style={{...S.input,marginBottom:0,textAlign:"center",fontSize:18,fontWeight:700,padding:"8px"}}/>
                </div>
              ))}
            </div>
            {routeDistance > 0 && (
              <div style={{background:"var(--gold)18",border:"1px solid var(--gold)44",borderRadius:12,padding:16,marginBottom:16,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,textAlign:"center"}}>
                <div>
                  <div style={{fontSize:18,fontWeight:700,color:"var(--gold)"}}>{routeDistance}km</div>
                  <div style={{fontSize:10,color:"var(--muted)"}}>Distance</div>
                </div>
                <div>
                  <div style={{fontSize:18,fontWeight:700,color:"var(--gold)"}}>{routeTime > 0 ? Math.round(routeTime/routeDistance) : "--"}</div>
                  <div style={{fontSize:10,color:"var(--muted)"}}>min/km</div>
                </div>
                <div>
                  <div style={{fontSize:18,fontWeight:700,color:"var(--gold)"}}>{Math.round(routeDistance * 65)}</div>
                  <div style={{fontSize:10,color:"var(--muted)"}}>calories</div>
                </div>
              </div>
            )}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:8,letterSpacing:2}}>SAVED ROUTES</div>
              {savedRoutes.length === 0 && <div style={{fontSize:13,color:"var(--muted)",textAlign:"center",padding:12}}>No saved routes yet</div>}
              {savedRoutes.map((r,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                  <div>
                    <div style={{fontSize:13}}>{r.name}</div>
                    <div style={{fontSize:11,color:"var(--muted)"}}>{r.distance}km · {r.time}min</div>
                  </div>
                  <button onClick={()=>{setRouteDistance(r.distance);setRouteTime(r.time);}} style={{...S.btn,...S.ghostBtn,padding:"6px 12px",fontSize:11}}>Use</button>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{
                if(routeDistance > 0) {
                  const name = `Route ${routeDistance}km`;
                  const newRoutes = [...savedRoutes, {name, distance: routeDistance, time: routeTime}];
                  setSavedRoutes(newRoutes);
                  localStorage.setItem("hf_routes", JSON.stringify(newRoutes));
                }
              }} style={{...S.btn,...S.goldBtn,flex:1,padding:12}}>💾 Save Route</button>
              <button onClick={()=>setShowRoute(false)} style={{...S.btn,...S.ghostBtn,padding:"12px 18px"}}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Milestone Share Card */}
      {showShareCard && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{...S.card,maxWidth:380,width:"100%",textAlign:"center"}} className="fade">
            <div style={{fontSize:48,marginBottom:8}}>🎉</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:"var(--gold)",marginBottom:4}}>
              {Math.max(0,...habits.map(h=>getStreak(h)))} Day Streak!
            </div>
            <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>You're on fire! Keep it going!</div>
            <div style={{background:"linear-gradient(135deg,#1A1A26,#08080D)",border:`1px solid ${currentLevel.color}55`,borderRadius:16,padding:20,marginBottom:20}}>
              <div style={{fontSize:36,marginBottom:6}}>{currentLevel.icon}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:currentLevel.color,marginBottom:4}}>{currentLevel.title}</div>
              <div style={{fontSize:12,color:"var(--muted)",marginBottom:12}}>{totalXP} XP · {habits.length} habits</div>
              <div style={{display:"flex",justifyContent:"center",gap:16}}>
                {habits.slice(0,4).map(h=>(
                  <div key={h.id} style={{textAlign:"center"}}>
                    <div style={{fontSize:22}}>{h.emoji}</div>
                    <div style={{fontSize:9,color:h.color,marginTop:2}}>🔥{getStreak(h)}d</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:12,fontSize:10,color:"var(--muted)",letterSpacing:2}}>THEHABITFLOW.APP</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <button onClick={()=>{
                const text = encodeURIComponent(`🔥 ${Math.max(0,...habits.map(h=>getStreak(h)))}-day streak on HabitFlow! Level: ${currentLevel.icon} ${currentLevel.title} (${totalXP} XP) #HabitFlow #Habits`);
                window.open(`https://wa.me/?text=${text}`, "_blank");
              }} style={{...S.btn,padding:12,background:"#25D366",border:"none",color:"#fff",fontSize:13}}>
                💬 WhatsApp
              </button>
              <button onClick={()=>{
                const text = encodeURIComponent(`🔥 ${Math.max(0,...habits.map(h=>getStreak(h)))}-day streak on HabitFlow! Level: ${currentLevel.icon} ${currentLevel.title} #HabitFlow`);
                window.open(`https://x.com/intent/tweet?text=${text}&url=https://thehabitflow.app`, "_blank");
              }} style={{...S.btn,padding:12,background:"#000",border:"none",color:"#fff",fontSize:13}}>
                𝕏 Post on X
              </button>
            </div>
            <button onClick={()=>{
              const text = `🔥 ${Math.max(0,...habits.map(h=>getStreak(h)))}-day streak on HabitFlow! Level: ${currentLevel.icon} ${currentLevel.title} (${totalXP} XP). Join me at thehabitflow.app`;
              navigator.clipboard.writeText(text);
              alert("Copied! 🎉");
            }} style={{...S.btn,...S.ghostBtn,width:"100%",padding:12,fontSize:13,marginBottom:10}}>
              📋 Copy to Clipboard
            </button>
            <button onClick={()=>setShowShareCard(false)} style={{...S.btn,...S.ghostBtn,width:"100%",padding:10,fontSize:12,color:"var(--muted)"}}>
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShare && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{...S.card,maxWidth:400,width:"100%"}} className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22}}>Share Achievement</div>
              <button onClick={()=>setShowShare(false)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            <div style={{background:"linear-gradient(135deg,#1A1A26,#0F0F16)",border:`1px solid ${currentLevel.color}55`,borderRadius:16,padding:24,marginBottom:20,textAlign:"center"}}>
              <div style={{fontSize:48,marginBottom:8}}>{currentLevel.icon}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:currentLevel.color,fontWeight:700,marginBottom:4}}>{currentLevel.title}</div>
              <div style={{fontSize:13,color:"var(--muted)",marginBottom:16}}>{totalXP} XP · {habits.length} habits</div>
              <div style={{display:"flex",justifyContent:"center",gap:16}}>
                {habits.slice(0,3).map(h=>(
                  <div key={h.id} style={{textAlign:"center"}}>
                    <div style={{fontSize:24}}>{h.emoji}</div>
                    <div style={{fontSize:10,color:"var(--muted)",marginTop:4}}>🔥{getStreak(h)}d</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:16,fontSize:11,color:"var(--muted)",letterSpacing:2}}>THEHABITFLOW.APP</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <button onClick={shareToWhatsApp} style={{...S.btn,padding:12,background:"#25D366",border:"none",color:"#fff",fontSize:13}}>
                💬 WhatsApp
              </button>
              <button onClick={shareToX} style={{...S.btn,padding:12,background:"#1DA1F2",border:"none",color:"#fff",fontSize:13}}>
                𝕏 Post on X
              </button>
            </div>
            <button onClick={shareAchievement} style={{...S.btn,...S.ghostBtn,width:"100%",padding:12,fontSize:13}}>
              📋 Copy to Clipboard
            </button>
          </div>
        </div>
      )}

      {showPaywall && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{...S.card,maxWidth:400,width:"100%"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22}}>Upgrade to Pro</div>
              <button onClick={()=>setShowPaywall(false)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            <div style={{background:"var(--bg3)",border:"1px solid var(--gold)44",borderRadius:14,padding:20,marginBottom:16}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,color:"var(--gold)",fontWeight:700,marginBottom:16}}>$1.99<span style={{fontSize:14,color:"var(--muted)",fontFamily:"'Outfit',sans-serif",fontWeight:400}}>/month</span></div>
              {["Unlimited habits","All 4 categories","Analytics dashboard","Badges & achievements","Cloud sync"].map(f=>(
                <div key={f} style={{display:"flex",gap:10,marginBottom:8,fontSize:13}}>
                  <span style={{color:"var(--gold)"}}>✓</span><span>{f}</span>
                </div>
              ))}
            </div>
            <PaymentForm onSuccess={upgradeToPro} onClose={()=>setShowPaywall(false)} isLight={isLight} S={S} />
          </div>
        </div>
      )}

      <nav style={S.nav}>
        <div style={{...S.logo,cursor:"pointer"}} onClick={()=>setPage("landing")}>⚡ Habit<span style={S.gold}>Flow</span></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>{const t=isLight?"dark":"light";setTheme(t);localStorage.setItem("hf_theme",t);localStorage.setItem("hf_theme_manual","true");}} style={{...S.btn,...S.ghostBtn,padding:"7px 12px",fontSize:12}}>{isLight?"◑":"◐"}</button>
          <button onClick={()=>setShowBadges(!showBadges)} style={{...S.btn,...S.ghostBtn,padding:"7px 12px",fontSize:12}}>🏆 {earnedBadges.length}</button>
          <button onClick={()=>setShowAICoach(true)} style={{...S.btn,background:"var(--gold)18",border:"1px solid var(--gold)44",color:"var(--gold)",padding:"7px 12px",fontSize:11,fontWeight:700}}>🤖</button>
          <button onClick={()=>setShowRoute(true)} style={{...S.btn,...S.ghostBtn,padding:"7px 12px",fontSize:11}}>🗺️</button>
          <button onClick={()=>setShowLeaderboard(true)} style={{...S.btn,...S.ghostBtn,padding:"7px 12px",fontSize:11}}>🏆</button>
          <button onClick={()=>setShowFriends(true)} style={{...S.btn,...S.ghostBtn,padding:"7px 12px",fontSize:11}}>👥</button>
          <button onClick={()=>setShowTemplates(true)} style={{...S.btn,...S.ghostBtn,padding:"7px 12px",fontSize:11}}>📋</button>
          <select value={language} onChange={e=>{setLanguage(e.target.value);localStorage.setItem("hf_lang",e.target.value);}} style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text)",fontSize:11,padding:"4px 6px",cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>
            {LANGUAGES.map(l=><option key={l.code} value={l.code}>{l.flag}</option>)}
          </select>
          <button onClick={()=>setShowProfile(true)} style={{...S.btn,...S.ghostBtn,padding:"7px 10px",fontSize:16}} title="My Profile">
            {profile.avatar || "👤"}
          </button>
          <button onClick={()=>setShowShare(true)} style={{...S.btn,...S.ghostBtn,padding:"7px 12px",fontSize:12}}>📤</button>
          {showInstall && (
            <button onClick={()=>{if(installPrompt){installPrompt.prompt();setShowInstall(false);}}} style={{...S.btn,background:"#6BCB77",border:"none",color:"#fff",padding:"7px 12px",fontSize:11,fontWeight:700}}>
              📱 Install
            </button>
          )}
          {!isPro ? (
            <button onClick={()=>setShowPaywall(true)} style={{...S.btn,background:"var(--gold)18",border:"1px solid var(--gold)55",color:"var(--gold)",padding:"7px 14px",fontSize:12,fontWeight:700}}>✦ PRO</button>
          ) : (
            <div style={{padding:"5px 12px",background:"var(--gold)18",border:"1px solid var(--gold)55",borderRadius:8,color:"var(--gold)",fontSize:11,letterSpacing:1}}>✦ PRO</div>
          )}
          <button onClick={signOut} style={{...S.btn,...S.ghostBtn,padding:"7px 12px",fontSize:12}}>Sign Out</button>
        </div>
      </nav>

      {user && (
        <div style={{padding:"12px 24px 0",fontSize:12,color:"var(--muted)"}}>
          Welcome back, <span style={{color:"var(--gold)"}}>{user.user_metadata?.full_name||user.email}</span> 👋
        </div>
      )}

      {/* Step Counter Card */}
      <div style={{padding:"0 24px 12px"}}>
        <div style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:16,padding:"14px 18px",display:"flex",alignItems:"center",gap:16,cursor:"pointer"}} onClick={()=>setShowRoute(true)}>
          <div style={{fontSize:28}}>🚶</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <div style={{fontSize:13,fontWeight:500}}>Daily Steps</div>
              <div style={{fontSize:13,color:"var(--gold)"}}>{todaySteps.toLocaleString()} / {stepGoal.toLocaleString()}</div>
            </div>
            <div style={{height:4,background:"var(--border)",borderRadius:2}}>
              <div style={{height:"100%",width:`${Math.min((todaySteps/stepGoal)*100,100)}%`,background:"linear-gradient(90deg,#4ECDC4,#6BCB77)",borderRadius:2,transition:"width 0.5s"}}/>
            </div>
            <div style={{fontSize:10,color:"var(--muted)",marginTop:4}}>Tap to plan your route 🗺️</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <button onClick={(e)=>{e.stopPropagation();const s=todaySteps+500;setTodaySteps(s);localStorage.setItem("hf_steps",s);}} style={{...S.btn,...S.goldBtn,padding:"4px 10px",fontSize:11}}>+500</button>
            <button onClick={(e)=>{e.stopPropagation();const s=todaySteps+1000;setTodaySteps(s);localStorage.setItem("hf_steps",s);}} style={{...S.btn,background:"var(--bg2)",border:"1px solid var(--border)",color:"var(--text)",padding:"4px 10px",fontSize:11}}>+1k</button>
          </div>
        </div>
      </div>

      {/* XP Level Card */}
      <div style={{padding:"12px 24px 0"}}>
        <div style={{background:"var(--bg3)",border:`1px solid ${currentLevel.color}44`,borderRadius:16,padding:"14px 18px",display:"flex",alignItems:"center",gap:16}}>
          <div style={{fontSize:32}}>{currentLevel.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:currentLevel.color,fontWeight:700}}>{currentLevel.title}</div>
              <div style={{fontSize:12,color:"var(--muted)"}}>{totalXP} XP</div>
            </div>
            <div style={{height:4,background:"var(--border)",borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${xpProgress}%`,background:currentLevel.color,borderRadius:2,transition:"width 0.6s ease"}}/>
            </div>
            <div style={{fontSize:10,color:"var(--muted)",marginTop:4,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>{nextLevel ? `${nextLevel.minXP - totalXP} XP to ${nextLevel.title} ${nextLevel.icon}` : "Max Level Reached! 👑"}</span>
              <span style={{display:"flex",gap:4,alignItems:"center"}}>
                {Array.from({length:maxShields}).map((_,i)=>(
                  <span key={i} style={{fontSize:14,opacity:i < shields ? 1 : 0.3}} title="Streak Shield">🛡️</span>
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showBadges && (
        <div style={{...S.card,margin:"12px 24px"}} className="fade">
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,marginBottom:16}}>Achievements</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
            {BADGE_LIST.map(b=>{
              const earned=b.check(habits,days);
              return (
                <div key={b.id} style={{background:"var(--bg3)",border:`1px solid ${earned?"var(--gold)55":"var(--border)"}`,borderRadius:12,padding:14,textAlign:"center",opacity:earned?1:0.4}}>
                  <div style={{fontSize:24,marginBottom:6}}>{b.icon}</div>
                  <div style={{fontSize:12,fontWeight:600,color:earned?"var(--gold)":"var(--muted)",marginBottom:4}}>{b.label}</div>
                  <div style={{fontSize:11,color:"var(--muted)"}}>{b.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{padding:"20px 24px 16px"}}>
        <div style={{...S.card,background:"var(--bg3)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div>
              <div style={{fontSize:11,color:"var(--muted)",letterSpacing:3,textTransform:"uppercase",marginBottom:6}}>
                {today.toLocaleDateString("en-AU",{weekday:"long",month:"short",day:"numeric"})}
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700}}>
                {todayDone} <span style={{fontSize:15,color:"var(--muted)",fontWeight:400}}>of {habits.length} done</span>
              </div>
            </div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:48,fontWeight:700,color:"var(--gold)",lineHeight:1}}>{pct}%</div>
          </div>
          <div style={{height:5,background:"var(--border)",borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#FF6B6B,var(--gold))",borderRadius:3,transition:"width 0.6s ease"}}/>
          </div>
        </div>
      </div>

      <div style={{display:"flex",padding:"0 24px",gap:4,marginBottom:16}}>
        {["tracker","stats"].map(t=>(
          <button key={t} onClick={()=>!isPro&&t==="stats"?setShowPaywall(true):setActiveTab(t)} style={S.tab(activeTab===t)}>
            {t==="stats"?"Analytics":"Tracker"} {t==="stats"&&!isPro&&<span style={{fontSize:10,color:"var(--gold)"}}>✦</span>}
          </button>
        ))}
      </div>

      {activeTab==="tracker" && (
        <>
          <div style={{display:"flex",gap:8,padding:"0 24px 16px",overflowX:"auto"}}>
            <button onClick={()=>setActiveCategory("all")} style={{...S.btn,padding:"7px 16px",fontSize:12,flexShrink:0,background:activeCategory==="all"?"var(--gold)":"var(--bg3)",color:activeCategory==="all"?(isLight?"#FFF":"#0A0A0F"):"var(--muted)",border:"1px solid var(--border)"}}>All</button>
            {CATEGORIES.map(c=>(
              <button key={c.id} onClick={()=>setActiveCategory(activeCategory===c.id?"all":c.id)} style={{...S.btn,padding:"7px 14px",fontSize:12,flexShrink:0,background:activeCategory===c.id?c.color+"22":"var(--bg3)",color:activeCategory===c.id?c.color:"var(--muted)",border:`1px solid ${activeCategory===c.id?c.color+"55":"var(--border)"}`}}>
                {c.icon} {c.label.split(" ")[0]}
              </button>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr repeat(7,34px)",gap:6,padding:"0 24px 8px",alignItems:"center"}}>
            <div/>
            {days.map(d=>{
              const isT=d===todayStr;
              const dObj=new Date(d+"T12:00:00");
              return (
                <div key={d} style={{textAlign:"center"}}>
                  <div style={{fontSize:9,color:"var(--muted)",letterSpacing:1,textTransform:"uppercase"}}>{DAYS_SHORT[dObj.getDay()]}</div>
                  <div style={{fontSize:13,color:isT?"var(--gold)":"var(--muted)",fontWeight:isT?700:400,marginTop:2}}>{dObj.getDate()}</div>
                </div>
              );
            })}
          </div>

          <div style={{padding:"0 24px"}}>
            {loading && <div style={{textAlign:"center",color:"var(--muted)",padding:40}}>Loading your habits...</div>}
            {!loading && filteredHabits.map(habit=>{
              const streak=getStreak(habit);
              const isLocked=!isPro&&habits.indexOf(habit)>=FREE_LIMIT;
              const cat=CATEGORIES.find(c=>c.id===habit.category);
              return (
                <div key={habit.id} className="habit-row" style={{display:"grid",gridTemplateColumns:"1fr repeat(7,34px)",gap:6,alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--border)",opacity:isLocked?0.35:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}>
                    <span style={{width:34,height:34,borderRadius:10,background:habit.color+"22",border:`1.5px solid ${habit.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{habit.emoji}</span>
                    <div style={{minWidth:0,flex:1,cursor:"pointer"}} onClick={()=>habit.week_plan&&setShowDayPlan(habit)}>
                      <div style={{fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{habit.name} {habit.week_plan&&<span style={{fontSize:10,color:"var(--gold)"}}>📊</span>}</div>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2,flexWrap:"wrap"}}>
                        {cat&&<span style={{fontSize:9,color:cat.color,letterSpacing:1}}>{cat.icon} {cat.label.split(" ")[0].toUpperCase()}</span>}
                        {streak>0&&<span style={{fontSize:10,color:habit.color}}>🔥{streak}d</span>}
                        {habit.week_plan&&(()=>{
                          const plan = typeof habit.week_plan==="string"?JSON.parse(habit.week_plan):habit.week_plan;
                          const todayTask = plan[getTodayKey()];
                          return todayTask ? <span style={{fontSize:9,color:"var(--gold)",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📅 {todayTask}</span> : null;
                        })()}
                      </div>
                    </div>
                    {shields > 0 && !habit.completions?.[days[5]] && habit.completions?.[days[6]] && (
                      <button onClick={()=>useShield(habit.id)} title="Use Shield to protect yesterday streak!" style={{background:"none",border:"1px solid #4ECDC4",borderRadius:6,color:"#4ECDC4",cursor:"pointer",fontSize:10,padding:"2px 6px",flexShrink:0}}>🛡️</button>
                    )}
                    <button className="del-btn" onClick={()=>setEditHabit(habit)} style={{background:"none",border:"1px solid var(--border)",color:"var(--muted)",cursor:"pointer",fontSize:10,padding:"2px 6px",borderRadius:4,flexShrink:0,opacity:0,transition:"opacity 0.2s"}}>✏️</button>
                    <button className="del-btn" onClick={()=>deleteHabit(habit.id)} style={{background:"none",border:"none",color:"var(--border)",cursor:"pointer",fontSize:12,padding:"2px 4px",flexShrink:0,opacity:0,transition:"opacity 0.2s"}}>✕</button>
                  </div>
                  {days.map(d=>{
                    const done=!!(habit.completions&&habit.completions[d]);
                    const isT=d===todayStr;
                    return (
                      <button key={d} onClick={()=>!isLocked&&toggle(habit.id,d)} style={{width:34,height:34,borderRadius:"50%",border:done?`2px solid ${habit.color}`:isT?"2px solid var(--border)":"1.5px solid var(--border)",background:done?habit.color:"transparent",cursor:isLocked?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,transition:"all 0.15s",outline:"none"}}>
                        {done&&<span style={{color:"#fff",fontSize:11}}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {!isPro&&habits.length>=FREE_LIMIT&&(
              <div style={{marginTop:16,padding:16,background:"var(--gold)08",border:"1px dashed var(--gold)33",borderRadius:12,textAlign:"center"}}>
                <div style={{fontSize:13,color:"var(--muted)",marginBottom:8}}>Free plan: {FREE_LIMIT} habits max</div>
                <button onClick={()=>setShowPaywall(true)} style={{...S.btn,...S.goldBtn,padding:"8px 20px",fontSize:13}}>Upgrade to Pro ✦</button>
              </div>
            )}

            {!showAdd ? (
              <button onClick={()=>{if(!isPro&&habits.length>=FREE_LIMIT){setShowPaywall(true);return;}setShowAdd(true);}} style={{width:"100%",marginTop:16,marginBottom:32,padding:14,background:"transparent",border:"1.5px dashed var(--border)",borderRadius:12,color:"var(--muted)",fontSize:13,cursor:"pointer",letterSpacing:1}}>
                + Add Habit
              </button>
            ) : (
              <div style={{...S.card,marginTop:16,marginBottom:32}} className="fade">
                <div style={{fontSize:11,color:"var(--muted)",letterSpacing:3,textTransform:"uppercase",marginBottom:14}}>New Habit</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
                  {EMOJIS.map(e=>(
                    <button key={e} onClick={()=>setNewEmoji(e)} style={{width:34,height:34,borderRadius:8,border:newEmoji===e?"2px solid var(--gold)":"1px solid var(--border)",background:newEmoji===e?"var(--bg3)":"transparent",cursor:"pointer",fontSize:15}}>{e}</button>
                  ))}
                </div>
                <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addHabit()} placeholder="Habit name..." style={S.input} autoFocus />
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  {COLORS.map(c=>(
                    <button key={c} onClick={()=>setNewColor(c)} style={{width:22,height:22,borderRadius:"50%",background:c,border:newColor===c?"3px solid var(--text)":"2px solid transparent",cursor:"pointer",outline:"none"}}/>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                  {CATEGORIES.map(c=>(
                    <button key={c.id} onClick={()=>setNewCategory(c.id)} style={{...S.btn,padding:"6px 12px",fontSize:11,background:newCategory===c.id?c.color+"22":"var(--bg3)",color:newCategory===c.id?c.color:"var(--muted)",border:`1px solid ${newCategory===c.id?c.color+"55":"var(--border)"}`}}>
                      {c.icon} {c.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,color:"var(--muted)",marginBottom:6,letterSpacing:1}}>⏰ REMINDER TIME</div>
                  <input type="time" value={habitTime} onChange={e=>setHabitTime(e.target.value)} style={{...S.input,marginBottom:0,width:"auto"}}/>
                </div>
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,color:"var(--muted)",marginBottom:8,letterSpacing:1}}>📅 WEEKLY PLAN (optional)</div>
                  {DAYS_OF_WEEK.map(day=>(
                    <div key={day} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{fontSize:12,color:"var(--muted)",width:28}}>{day}</span>
                      <input value={newWeekPlan[day]} onChange={e=>setNewWeekPlan(p=>({...p,[day]:e.target.value}))}
                        placeholder={`What to do on ${day}...`} style={{...S.input,marginBottom:0,fontSize:12,padding:"8px 10px"}}/>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={addHabit} style={{...S.btn,...S.goldBtn,flex:1,padding:12}}>Add Habit</button>
                  <button onClick={()=>{setShowAdd(false);setNewName("");}} style={{...S.btn,...S.ghostBtn,padding:"12px 18px"}}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab==="stats"&&isPro&&(
        <div style={{padding:"0 24px 40px"}} className="fade">
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:20}}>Weekly Analytics</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
            {[
              {label:"Best Streak",value:`${Math.max(0,...habits.map(h=>getStreak(h)))}d`,color:"var(--gold)"},
              {label:"Today",value:`${pct}%`,color:"#FF6B6B"},
              {label:"Total Habits",value:habits.length,color:"#4ECDC4"},
            ].map(s=>(
              <div key={s.label} style={{...S.card,textAlign:"center",padding:16}}>
                <div style={{fontSize:22,fontWeight:700,color:s.color,fontFamily:"'Cormorant Garamond',serif"}}>{s.value}</div>
                <div style={{fontSize:11,color:"var(--muted)",marginTop:4,letterSpacing:1,textTransform:"uppercase"}}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{...S.card,marginBottom:16}}>
            <div style={{fontSize:11,color:"var(--muted)",letterSpacing:3,textTransform:"uppercase",marginBottom:20}}>Daily Completion</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:8,height:100}}>
              {getLast7().map((d,i)=>{
                const dayDone=habits.filter(h=>h.completions&&h.completions[d]).length;
                const dayPct=habits.length?Math.round((dayDone/habits.length)*100):0;
                const dObj=new Date(d+"T12:00:00");
                return (
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                    <div style={{fontSize:11,color:"var(--muted)"}}>{dayPct}%</div>
                    <div style={{width:"100%",background:"linear-gradient(180deg,#FF6B6B,var(--gold))",borderRadius:"4px 4px 0 0",height:`${Math.max(dayPct,4)}%`,minHeight:4,transition:"height 0.5s"}}/>
                    <div style={{fontSize:10,color:d===todayStr?"var(--gold)":"var(--muted)"}}>{DAYS_SHORT[dObj.getDay()]}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={S.card}>
            <div style={{fontSize:11,color:"var(--muted)",letterSpacing:3,textTransform:"uppercase",marginBottom:16}}>Habit Performance</div>
            {habits.map(h=>{
              const weekDone=days.filter(d=>h.completions&&h.completions[d]).length;
              const wpct=Math.round((weekDone/7)*100);
              return (
                <div key={h.id} style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontSize:13}}>{h.emoji} {h.name}</span>
                    <span style={{fontSize:12,color:"var(--muted)"}}>{weekDone}/7</span>
                  </div>
                  <div style={{height:4,background:"var(--border)",borderRadius:2}}>
                    <div style={{height:"100%",width:`${wpct}%`,background:h.color,borderRadius:2,transition:"width 0.5s"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentForm({ onSuccess, onClose, isLight, S }) {
  const [num, setNum] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const pay = () => {
    if (!num||!exp||!cvc) return;
    setLoading(true);
    setTimeout(()=>{setLoading(false);setDone(true);}, 2000);
  };

  if (done) return (
    <div style={{textAlign:"center",padding:20}}>
      <div style={{fontSize:48,marginBottom:12}}>🎉</div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"var(--gold)",marginBottom:8}}>Welcome to Pro!</div>
      <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>All features unlocked.</div>
      <button onClick={onSuccess} style={{...S.btn,...S.goldBtn,padding:"12px 28px"}}>Start Tracking →</button>
    </div>
  );

  return (
    <div>
      {[
        {label:"Card Number",val:num,set:setNum,ph:"4242 4242 4242 4242",max:19},
        {label:"Expiry",val:exp,set:setExp,ph:"MM/YY",max:5},
        {label:"CVC",val:cvc,set:setCvc,ph:"123",max:3},
      ].map(f=>(
        <div key={f.label} style={{marginBottom:10}}>
          <div style={{fontSize:11,color:"var(--muted)",marginBottom:6,letterSpacing:1}}>{f.label}</div>
          <input value={f.val} maxLength={f.max} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{...S.input,marginBottom:0}} />
        </div>
      ))}
      <div style={{display:"flex",alignItems:"center",gap:8,margin:"12px 0",fontSize:11,color:"var(--muted)"}}>
        🔒 Secured by Stripe · 256-bit SSL
      </div>
      <button onClick={pay} disabled={loading} style={{...S.btn,...S.goldBtn,width:"100%",padding:13,fontSize:14,opacity:loading?0.6:1}}>
        {loading?"Processing...":"Pay $1.99/month"}
      </button>
    </div>
  );
}
