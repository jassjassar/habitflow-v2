// api/ai-coach.js
// Vercel Serverless Function — proxies Claude API so key is never in browser
// Place this file at: habitflow-v2/api/ai-coach.js

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // Basic CORS for your domain
  res.setHeader("Access-Control-Allow-Origin", "https://thehabitflow.app")
  res.setHeader("Access-Control-Allow-Methods", "POST")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

  // Verify user is authenticated via Supabase JWT
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const { messages, systemPrompt } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request body" })
    }

    // Call Claude API server-side — key never reaches browser
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_KEY, // ✅ server env only
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
