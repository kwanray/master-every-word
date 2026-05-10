-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  role text not null default 'student', -- 'student' | 'parent'
  linked_student_id uuid references profiles(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- Automatically create a profile when a user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Vocabulary words
create table vocabulary (
  id uuid default gen_random_uuid() primary key,
  word text not null,
  pinyin text,
  meaning_en text,
  meaning_zh text,
  example_sentence text,
  difficulty int default 1 check (difficulty between 1 and 3),
  tags text[],
  created_at timestamp with time zone default now()
);

-- Questions (MCQ)
create table questions (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('vocab_mcq', 'cloze_mcq', 'compre_mcq', 'editing')),
  question_text text not null,
  passage text,
  passage_title text,
  -- options: [{"key": "A", "text": "..."}, ...]
  options jsonb not null,
  correct_answer text not null,
  explanation_en text,
  explanation_zh text,
  tested_vocab_id uuid references vocabulary(id) on delete set null,
  difficulty int default 1 check (difficulty between 1 and 3),
  -- group comprehension questions by passage
  passage_group text,
  created_at timestamp with time zone default now()
);

-- User answer attempts
create table attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  question_id uuid references questions(id) on delete cascade not null,
  selected_answer text,
  is_correct boolean not null,
  ai_explanation jsonb,
  session_date date default current_date,
  created_at timestamp with time zone default now()
);

-- Per-user vocabulary mastery tracking
create table user_vocab_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  vocab_id uuid references vocabulary(id) on delete cascade not null,
  mistake_count int default 0,
  correct_streak int default 0,
  mastery_level text default 'new' check (mastery_level in ('new', 'weak', 'improving', 'mastered')),
  last_attempt_at timestamp with time zone,
  next_review_at timestamp with time zone default now(),
  unique(user_id, vocab_id)
);

-- Daily mission sessions
create table daily_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  session_date date default current_date,
  completed boolean default false,
  total_questions int default 0,
  correct_questions int default 0,
  created_at timestamp with time zone default now(),
  unique(user_id, session_date)
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table vocabulary enable row level security;
alter table questions enable row level security;
alter table attempts enable row level security;
alter table user_vocab_progress enable row level security;
alter table daily_sessions enable row level security;

-- Profiles: users see and update only their own profile
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
-- Parents can read their linked student's profile
create policy "profiles_select_linked" on profiles for select
  using (exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and p.linked_student_id = profiles.id
  ));

-- Vocabulary: readable by all authenticated users
create policy "vocab_select_all" on vocabulary for select using (auth.role() = 'authenticated');

-- Questions: readable by all authenticated users
create policy "questions_select_all" on questions for select using (auth.role() = 'authenticated');

-- Attempts: users manage own attempts
create policy "attempts_select_own" on attempts for select using (auth.uid() = user_id);
create policy "attempts_insert_own" on attempts for insert with check (auth.uid() = user_id);

-- Parents can read their student's attempts
create policy "attempts_select_parent" on attempts for select
  using (exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and p.linked_student_id = attempts.user_id
  ));

-- Vocab progress: users manage own progress
create policy "uvp_select_own" on user_vocab_progress for select using (auth.uid() = user_id);
create policy "uvp_insert_own" on user_vocab_progress for insert with check (auth.uid() = user_id);
create policy "uvp_update_own" on user_vocab_progress for update using (auth.uid() = user_id);

-- Parents can read their student's vocab progress
create policy "uvp_select_parent" on user_vocab_progress for select
  using (exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and p.linked_student_id = user_vocab_progress.user_id
  ));

-- Daily sessions: users manage own sessions
create policy "sessions_select_own" on daily_sessions for select using (auth.uid() = user_id);
create policy "sessions_insert_own" on daily_sessions for insert with check (auth.uid() = user_id);
create policy "sessions_update_own" on daily_sessions for update using (auth.uid() = user_id);

-- Parents can read their student's daily sessions
create policy "sessions_select_parent" on daily_sessions for select
  using (exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and p.linked_student_id = daily_sessions.user_id
  ));

-- ─── Indexes ─────────────────────────────────────────────────────────────────

create index attempts_user_id_idx on attempts(user_id);
create index attempts_session_date_idx on attempts(user_id, session_date);
create index uvp_user_id_idx on user_vocab_progress(user_id);
create index uvp_next_review_idx on user_vocab_progress(user_id, next_review_at);
create index daily_sessions_user_date_idx on daily_sessions(user_id, session_date);
