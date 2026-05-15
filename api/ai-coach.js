import { createClient } from "@supabase/supabase-js"

const allowedOrigins = new Set([
  "https://thehabitflow.app",
  process.env.APP_URL,
].filter(Boolean))

const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
  }
  res.setHeader("Vary", "Origin")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

const getRequiredEnv = () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_KEY

  return { supabaseUrl, serviceKey, anthropicKey }
}

const clip = (value, max = 260) => String(value || "").replace(/\s+/g, " ").trim().slice(0, max)

const appendMemory = (current, addition, max = 360) => {
  const next = clip(addition)
  if (!next) return clip(current, max)
  const existing = clip(current, max)
  if (existing.toLowerCase().includes(next.toLowerCase())) return existing
  return clip([existing, next].filter(Boolean).join(" | "), max)
}

const getMemoryContext = (memory) => {
  if (!memory) return ""

  const lines = [
    memory.goals && `Goals: ${clip(memory.goals, 220)}`,
    memory.struggles && `Struggles: ${clip(memory.struggles, 220)}`,
    memory.streak_wins && `Streak wins: ${clip(memory.streak_wins, 220)}`,
    memory.encouragement_style && `Preferred encouragement: ${clip(memory.encouragement_style, 160)}`,
    memory.summary && `Summary: ${clip(memory.summary, 240)}`,
  ].filter(Boolean)

  if (!lines.length) return ""
  return `\n\nLong-term user memory. Keep this private, use it only to personalize coaching, and do not recite it back unless useful:\n${lines.join("\n")}`
}

const inferEncouragementStyle = (text) => {
  const lower = text.toLowerCase()
  if (/\b(gentle|kind|soft|supportive|encouraging|patient)\b/.test(lower)) return "Respond with gentle, patient encouragement."
  if (/\b(tough|strict|direct|push me|call me out|accountability)\b/.test(lower)) return "Respond with direct, accountable motivation."
  if (/\b(fun|hype|energetic|excited|pump)\b/.test(lower)) return "Respond with upbeat, high-energy encouragement."
  return ""
}

const getMemoryPatch = ({ currentMemory, userText, replyText }) => {
  const text = clip(userText, 260)
  const lower = text.toLowerCase()
  const patch = {}

  if (/\b(goal|want to|trying to|working on|build|improve|get better|focus on)\b/.test(lower)) {
    patch.goals = appendMemory(currentMemory?.goals, text)
  }

  if (/\b(struggle|hard|difficult|stuck|can't|cannot|keep failing|inconsistent|missed|problem)\b/.test(lower)) {
    patch.struggles = appendMemory(currentMemory?.struggles, text)
  }

  if (/\b(streak|consistent|completed|done|hit|win|proud|crushed)\b/.test(lower)) {
    patch.streak_wins = appendMemory(currentMemory?.streak_wins, text)
  }

  const style = inferEncouragementStyle(text)
  if (style) patch.encouragement_style = style

  patch.summary = appendMemory(
    currentMemory?.summary,
    `Recent: user said "${text}"; coach replied "${clip(replyText, 180)}"`,
    420
  )

  return patch
}

export default async function handler(req, res) {
  setCorsHeaders(req, res)

  if (req.method === "OPTIONS") return res.status(204).end()
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const { supabaseUrl, serviceKey, anthropicKey } = getRequiredEnv()
  if (!supabaseUrl || !serviceKey || !anthropicKey) {
    return res.status(500).json({ error: "Server configuration is incomplete" })
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const supabase = createClient(supabaseUrl, serviceKey)
    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return res.status(401).json({ error: "Invalid token" })

    const { messages, systemPrompt } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request body" })
    }

    const { data: memory } = await supabase
      .from("ai_memories")
      .select("goals, struggles, streak_wins, encouragement_style, summary")
      .eq("user_id", user.id)
      .maybeSingle()

    const systemWithMemory = `${systemPrompt || ""}${getMemoryContext(memory)}`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: systemWithMemory,
        messages: messages,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(response.status).json({ error: err.error?.message || "Claude API error" })
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text

    const lastUserMessage = [...messages].reverse().find(message => message?.role === "user")?.content
    if (reply && lastUserMessage) {
      const memoryPatch = getMemoryPatch({ currentMemory: memory, userText: lastUserMessage, replyText: reply })
      if (Object.keys(memoryPatch).length) {
        const { error: memoryError } = await supabase.from("ai_memories").upsert({
          user_id: user.id,
          ...memoryPatch,
          updated_at: new Date().toISOString(),
        })
        if (memoryError) console.error("AI memory update error:", memoryError)
      }
    }

    return res.status(200).json({ reply })

  } catch (err) {
    console.error("AI coach error:", err)
    return res.status(500).json({ error: "Internal server error" })
  }
}
