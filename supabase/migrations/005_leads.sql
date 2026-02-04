create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  created_at timestamptz default now()
);

alter table public.leads enable row level security;

-- Anyone can insert (unauthenticated visitors)
create policy "Anyone can create leads"
  on public.leads for insert
  with check (true);

-- Only admins can read leads
create policy "Admins can view leads"
  on public.leads for select
  using (public.is_admin());
