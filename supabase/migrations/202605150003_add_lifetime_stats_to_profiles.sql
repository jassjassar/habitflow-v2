alter table public.profiles
  add column if not exists total_xp integer not null default 0,
  add column if not exists lifetime_completed_count integer not null default 0;

alter table public.profiles
  alter column total_xp set default 0,
  alter column lifetime_completed_count set default 0;

update public.profiles
set total_xp = 0
where total_xp is null;

update public.profiles
set lifetime_completed_count = 0
where lifetime_completed_count is null;

alter table public.profiles
  alter column total_xp set not null,
  alter column lifetime_completed_count set not null;

update public.profiles profile
set
  lifetime_completed_count = greatest(
    coalesce(profile.lifetime_completed_count, 0),
    completion_counts.completed_count
  ),
  total_xp = greatest(
    coalesce(profile.total_xp, 0),
    completion_counts.completed_count * 10
  )
from (
  select user_id, count(*)::integer as completed_count
  from public.completions
  group by user_id
) completion_counts
where profile.id = completion_counts.user_id;
