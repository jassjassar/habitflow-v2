const posthogKey = import.meta.env.VITE_POSTHOG_KEY
const posthogHost = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com"

export const analyticsEnabled = Boolean(posthogKey)

let posthogClient = null
let posthogPromise = null
let pendingCalls = []

export const initAnalytics = () => {
  if (!analyticsEnabled || typeof window === "undefined" || posthogPromise) return

  posthogPromise = import("posthog-js").then(({ default: posthog }) => {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true,
      person_profiles: "identified_only",
      loaded: client => {
        posthogClient = client
        pendingCalls.forEach(call => call(client))
        pendingCalls = []
        if (import.meta.env.DEV) client.debug(false)
      },
    })
  }).catch(() => {
    pendingCalls = []
  })
}

const withPostHog = (callback) => {
  if (!analyticsEnabled || typeof window === "undefined") return
  if (posthogClient) {
    callback(posthogClient)
    return
  }

  pendingCalls.push(callback)
  initAnalytics()
}

export const identifyUser = (user) => {
  if (!analyticsEnabled || !user?.id) return
  withPostHog(client => client.identify(user.id))
}

export const resetAnalytics = () => {
  if (!analyticsEnabled) return
  withPostHog(client => client.reset())
}

export const trackEvent = (eventName, properties = {}) => {
  if (!analyticsEnabled) return
  withPostHog(client => client.capture(eventName, properties))
}
