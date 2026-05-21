import { THEMES, LEVELS } from "./constants"

export const getLast7 = () =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })

export const todayStr = new Date().toISOString().slice(0, 10)

export const getHour = () => new Date().getHours()

export const getGreeting = () => {
  const h = getHour()
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"
}

export const calcXP = (habits, days) => {
  let xp = 0
  habits.forEach(h => {
    let s = 0
    days.forEach(d => {
      if (h.completions?.[d]) { xp += 10; s++; xp += s * 5 }
      else s = 0
    })
  })
  return xp
}

export const getLevel = (xp) =>
  LEVELS.slice().reverse().find(l => xp >= l.minXP) || LEVELS[0]

export const getNextLevel = (level) =>
  LEVELS.find(l => l.level === level.level + 1)

export const getLevelProgress = (xp, level, nextLevel) =>
  nextLevel
    ? Math.min(100, Math.max(0, Math.round(((xp - level.minXP) / (nextLevel.minXP - level.minXP)) * 100)))
    : 100

export const getStreak = (habit, days, freezeDates = []) => {
  let s = 0
  const rev = [...days].reverse()
  for (let d of rev) {
    if (habit.completions?.[d]) s++
    else if (freezeDates.includes(d)) s++
    else break
  }
  return s
}

export const getFreshQuestState = () => ({
  date: todayStr,
  awardedQuestIds: [],
  beforeNoonHabitIds: [],
})

export const getStoredQuestCompletions = (userId, dates) =>
  dates.reduce((total, date) => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(`hf_daily_quests_${userId || "guest"}_${date}`) || "null"
      )
      return total + (Array.isArray(saved?.awardedQuestIds) ? saved.awardedQuestIds.length : 0)
    } catch {
      return total
    }
  }, 0)

export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const normalizeVapidPublicKey = (value) => {
  let key = String(value || "").trim()
  key = key.replace(/^['"]|['"]$/g, "").trim()
  key = key.replace(/^(?:VITE_)?VAPID_PUBLIC_KEY\s*=\s*/i, "").trim()
  return key.replace(/^['"]|['"]$/g, "").trim()
}

export const applyTheme = (_themeId) => {
  // Theme is now handled automatically by prefers-color-scheme media query
  // Manual theme application disabled
}
