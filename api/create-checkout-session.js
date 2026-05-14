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
  stripePriceId: process.env.STRIPE_PRICE_ID,
})

const getAppUrl = (req) => {
  const configuredUrl = process.env.APP_URL || req.headers.origin
  if (configuredUrl) return configuredUrl.replace(/\/$/, "")
  return `https://${req.headers.host}`
}

export default async function handler(req, res) {
  setCorsHeaders(req, res)

  if (req.method === "OPTIONS") return res.status(204).end()
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const env = getRequiredEnv()
  if (!env.supabaseUrl || !env.serviceKey || !env.stripeSecretKey || !env.stripePriceId) {
    return res.status(500).json({ error: "Server configuration is incomplete" })
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const supabase = createClient(env.supabaseUrl, env.serviceKey)
    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return res.status(401).json({ error: "Invalid token" })

    const stripe = new Stripe(env.stripeSecretKey)
    const appUrl = getAppUrl(req)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      client_reference_id: user.id,
      line_items: [
        {
          price: env.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
        },
      },
      success_url: `${appUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?checkout=cancel`,
    })

    if (!session.url) return res.status(500).json({ error: "Checkout session did not include a redirect URL" })
    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error("Checkout session error:", err)
    return res.status(500).json({ error: "Could not start checkout" })
  }
}
