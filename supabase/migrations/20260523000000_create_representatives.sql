create table if not exists representatives (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  whatsapp text not null,
  state text not null,
  active boolean default true,
  created_at timestamptz default now()
);

alter table representatives enable row level security;

create policy "public read active representatives"
  on representatives for select
  using (active = true);

create policy "authenticated manage representatives"
  on representatives for all
  using (auth.role() = 'authenticated');
