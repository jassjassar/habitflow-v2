import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

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
