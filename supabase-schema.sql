-- Run this in your Supabase SQL editor

-- Users table (extends Supabase auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  units text default 'kg',
  notif_enabled boolean default false,
  streak integer default 0,
  longest_streak integer default 0,
  last_streak_date text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Programs table (user's workout splits)
create table public.programs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  split_id text not null,
  split_name text not null,
  days jsonb not null,
  exercises jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Session log table
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  day_name text not null,
  exercises jsonb not null,
  partial boolean default false,
  logged_at timestamp with time zone default timezone('utc'::text, now())
);

-- Workout sets state (last known weights per exercise)
create table public.workout_state (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  exercise_name text not null,
  sets jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, exercise_name)
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.sessions enable row level security;
alter table public.workout_state enable row level security;

-- Policies: users can only see and edit their own data
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own programs" on public.programs for select using (auth.uid() = user_id);
create policy "Users can insert own programs" on public.programs for insert with check (auth.uid() = user_id);
create policy "Users can update own programs" on public.programs for update using (auth.uid() = user_id);
create policy "Users can delete own programs" on public.programs for delete using (auth.uid() = user_id);

create policy "Users can view own sessions" on public.sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on public.sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions" on public.sessions for update using (auth.uid() = user_id);

create policy "Users can view own workout state" on public.workout_state for select using (auth.uid() = user_id);
create policy "Users can insert own workout state" on public.workout_state for insert with check (auth.uid() = user_id);
create policy "Users can update own workout state" on public.workout_state for update using (auth.uid() = user_id);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
