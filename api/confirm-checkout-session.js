import Stripe from "stripe"
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

const getRequiredEnv = () => ({
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
})

export default async function handler(req, res) {
  setCorsHeaders(req, res)

  if (req.method === "OPTIONS") return res.status(204).end()
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const env = getRequiredEnv()
  if (!env.supabaseUrl || !env.serviceKey || !env.stripeSecretKey) {
    return res.status(500).json({ error: "Server configuration is incomplete" })
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const { sessionId } = req.body || {}
    if (!sessionId) return res.status(400).json({ error: "Missing checkout session" })

    const supabase = createClient(env.supabaseUrl, env.serviceKey)
    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return res.status(401).json({ error: "Invalid token" })

    const stripe = new Stripe(env.stripeSecretKey)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const sessionUserId = session.client_reference_id || session.metadata?.user_id
    if (sessionUserId !== user.id) return res.status(403).json({ error: "Checkout session does not belong to this user" })
    if (session.mode !== "subscription") return res.status(400).json({ error: "Checkout session is not a subscription" })

    const isComplete = session.status === "complete"
    const isPaid = session.payment_status === "paid" || session.payment_status === "no_payment_required"
    if (!isComplete || !isPaid) {
      return res.status(200).json({ success: false, status: session.status, paymentStatus: session.payment_status })
    }

    const stripeCustomerId = typeof session.customer === "string" ? session.customer : session.customer?.id
    const stripeSubscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id
    if (!stripeCustomerId || !stripeSubscriptionId) {
      return res.status(400).json({ error: "Checkout session is missing subscription details" })
    }

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      is_pro: true,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
    })
    if (profileError) throw profileError

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error("Checkout confirmation error:", err)
    return res.status(500).json({ error: "Could not confirm checkout" })
  }
}
