import { createClient } from "@supabase/supabase-js"
import webpush from "web-push"

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || ""
  const token = authHeader.replace("Bearer ", "")

  if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const now = new Date()
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

  try {
    const { data: habits, error: habitsError } = await supabase
      .from("habits")
      .select("id,user_id,name,emoji,reminder_time")
      .eq("reminder_time", currentTime)

    if (habitsError) throw habitsError
    if (!habits?.length) return res.status(200).json({ sent: 0, currentTime })

    const userIds = [...new Set(habits.map(habit => habit.user_id).filter(Boolean))]
    const { data: subscriptions, error: subscriptionError } = await supabase
      .from("push_subscriptions")
      .select("user_id,subscription")
      .in("user_id", userIds)

    if (subscriptionError) throw subscriptionError

    const subscriptionByUser = new Map((subscriptions || []).map(item => [item.user_id, item.subscription]))
    const sends = habits.map(habit => {
      const subscription = subscriptionByUser.get(habit.user_id)
      if (!subscription) return Promise.resolve({ skipped: true })

      const payload = JSON.stringify({
        title: "HabitFlow reminder",
        body: `${habit.emoji || ""} Time for ${habit.name}`.trim(),
        icon: "/icon-192.png",
        url: process.env.APP_URL || "https://habitflow-v2.vercel.app",
      })

      return webpush.sendNotification(subscription, payload)
    })

    const results = await Promise.allSettled(sends)
    const sent = results.filter(result => result.status === "fulfilled" && !result.value?.skipped).length
    const failed = results.filter(result => result.status === "rejected").length

    return res.status(200).json({ sent, failed, currentTime })
  } catch (err) {
    console.error("Notification cron error:", err)
    return res.status(500).json({ error: "Server error" })
  }
}
