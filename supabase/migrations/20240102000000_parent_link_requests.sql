create table parent_link_requests (
  id         uuid default gen_random_uuid() primary key,
  parent_id  uuid references profiles(id) on delete cascade not null,
  student_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(parent_id, student_id)
);

create index plr_student_idx on parent_link_requests(student_id);
create index plr_parent_idx  on parent_link_requests(parent_id);

alter table parent_link_requests enable row level security;

-- Students see requests addressed to them
create policy "plr_student_select" on parent_link_requests
  for select using (auth.uid() = student_id);

-- Parents see their own outgoing requests
create policy "plr_parent_select" on parent_link_requests
  for select using (auth.uid() = parent_id);

-- Parents can create requests
create policy "plr_parent_insert" on parent_link_requests
  for insert with check (auth.uid() = parent_id);

-- ─── Extra profile read policies ─────────────────────────────────────────────

-- Students can read the profile of a parent who sent them a request
create policy "profiles_select_requester" on profiles for select
  using (exists (
    select 1 from parent_link_requests r
    where r.parent_id = profiles.id
      and r.student_id = auth.uid()
  ));

-- Parents can read the profile of a student they sent a request to
create policy "profiles_select_requested" on profiles for select
  using (exists (
    select 1 from parent_link_requests r
    where r.student_id = profiles.id
      and r.parent_id = auth.uid()
  ));
