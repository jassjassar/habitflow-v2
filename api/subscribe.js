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

const getSupabaseClient = () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceKey) return null
  return createClient(supabaseUrl, serviceKey)
}

export default async function handler(req, res) {
  setCorsHeaders(req, res)

  if (req.method === "OPTIONS") return res.status(204).end()
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const supabase = getSupabaseClient()
  if (!supabase) return res.status(500).json({ error: "Server configuration is incomplete" })

  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" })

  try {
    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return res.status(401).json({ error: "Invalid token" })

    const { subscription } = req.body
    if (!subscription) return res.status(400).json({ error: "No subscription" })

    // Delete old subscription for this user
    await supabase.from("push_subscriptions").delete().eq("user_id", user.id)

    // Save new subscription
    const { error: insertError } = await supabase.from("push_subscriptions").insert({
      user_id: user.id,
      subscription,
    })

    if (insertError) throw insertError

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error("Subscribe error:", err)
    return res.status(500).json({ error: "Server error" })
  }
}
