# habitflow-v2
HabitFlow v2 - Premium habit tracking app with XP levels, streak shields, daily planner and analytics

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in the Supabase, VAPID, Anthropic, Stripe and cron values.
3. Run `npm install`.
4. Run `npm run dev`.

Required public client values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_VAPID_PUBLIC_KEY`

Required server values:

- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `VAPID_EMAIL`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `CRON_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `APP_URL`

Stripe checkout uses `STRIPE_PRICE_ID` for the recurring Pro subscription Price. `APP_URL` is used for Checkout success and cancel redirects.

Checkout confirmation stores `stripe_customer_id` and `stripe_subscription_id` on the user's profile for later subscription management.
