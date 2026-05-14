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
        system: systemPrompt,
        messages: messages,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(response.status).json({ error: err.error?.message || "Claude API error" })
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text

    return res.status(200).json({ reply })

  } catch (err) {
    console.error("AI coach error:", err)
    return res.status(500).json({ error: "Internal server error" })
  }
}
