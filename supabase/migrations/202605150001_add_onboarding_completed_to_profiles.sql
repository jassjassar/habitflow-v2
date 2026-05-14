alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false;

update public.profiles profile
set onboarding_completed = true
where onboarding_completed = false
  and exists (
    select 1
    from public.habits habit
    where habit.user_id = profile.id
  );
