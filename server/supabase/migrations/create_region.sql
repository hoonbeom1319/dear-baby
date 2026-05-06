create table if not exists public.regions (
  code char(8) primary key,
  level smallint not null check (level in (1, 2)),
  parent_code char(8) null references public.regions(code) on delete restrict,
  display_name text not null
);

create index if not exists regions_level_idx on public.regions(level);

create index if not exists regions_parent_code_idx on public.regions(parent_code);

alter table public.regions enable row level security;

create policy "regions_select_public"
on public.regions
for select
to public
using (true);