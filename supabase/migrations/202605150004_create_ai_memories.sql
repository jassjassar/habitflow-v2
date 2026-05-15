create table if not exists public.ai_memories (
  user_id uuid primary key references auth.users(id) on delete cascade,
  goals text not null default '',
  struggles text not null default '',
  streak_wins text not null default '',
  encouragement_style text not null default '',
  summary text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.ai_memories enable row level security;

drop policy if exists "Users can read their AI memory" on public.ai_memories;
create policy "Users can read their AI memory"
  on public.ai_memories
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can manage their AI memory" on public.ai_memories;
create policy "Users can manage their AI memory"
  on public.ai_memories
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
