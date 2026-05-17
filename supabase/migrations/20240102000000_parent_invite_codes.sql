create table parent_invite_codes (
  id         uuid default gen_random_uuid() primary key,
  code       char(6) not null,
  student_id uuid references profiles(id) on delete cascade not null,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  used_at    timestamptz,
  created_at timestamptz default now()
);

create index parent_invite_codes_code_idx on parent_invite_codes(code);

alter table parent_invite_codes enable row level security;
-- All access goes through service role in API routes; no direct client access needed.
