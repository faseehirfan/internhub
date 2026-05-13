-- InternHub initial database schema.
-- Run this in the Supabase SQL editor or include it in a migration.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  location text not null,
  category text not null check (
    category in ('Social', 'Career', 'Sports', 'Food', 'Study', 'Outdoors')
  ),
  starts_at timestamptz not null,
  ends_at timestamptz,
  chat_link text,
  capacity integer check (capacity is null or capacity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('going', 'maybe', 'not_going')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create trigger set_rsvps_updated_at
before update on public.rsvps
for each row execute function public.set_updated_at();

create trigger set_comments_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.rsvps enable row level security;
alter table public.comments enable row level security;

create policy "Authenticated users can view profiles"
on public.profiles for select
to authenticated
using (true);

create policy "Users can insert their own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Authenticated users can view events"
on public.events for select
to authenticated
using (true);

create policy "Authenticated users can create events"
on public.events for insert
to authenticated
with check (auth.uid() = creator_id);

create policy "Creators can update their events"
on public.events for update
to authenticated
using (auth.uid() = creator_id)
with check (auth.uid() = creator_id);

create policy "Creators can delete their events"
on public.events for delete
to authenticated
using (auth.uid() = creator_id);

create policy "Authenticated users can view RSVPs"
on public.rsvps for select
to authenticated
using (true);

create policy "Users can RSVP for themselves"
on public.rsvps for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own RSVPs"
on public.rsvps for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own RSVPs"
on public.rsvps for delete
to authenticated
using (auth.uid() = user_id);

create policy "Authenticated users can view comments"
on public.comments for select
to authenticated
using (true);

create policy "Users can create their own comments"
on public.comments for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own comments"
on public.comments for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
on public.comments for delete
to authenticated
using (auth.uid() = user_id);
