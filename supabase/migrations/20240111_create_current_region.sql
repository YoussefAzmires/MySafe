create table if not exists public.current_region (
  id integer primary key,
  name text not null,
  bounds jsonb not null,
  mapImage text not null
);

-- Add RLS policies
alter table public.current_region enable row level security;

create policy "Enable read access for all users" on public.current_region
  for select
  to authenticated
  using (true);

create policy "Enable insert/update for authenticated users" on public.current_region
  for all
  to authenticated
  using (true)
  with check (true);