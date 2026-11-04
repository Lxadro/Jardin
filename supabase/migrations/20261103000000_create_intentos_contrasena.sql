create table if not exists public.intentos_contrasena (
  id bigint generated always as identity primary key,
  respuesta text not null,
  acertado boolean not null,
  creado_en timestamptz not null default now()
);

alter table public.intentos_contrasena enable row level security;
revoke all on table public.intentos_contrasena from anon, authenticated;
grant all on table public.intentos_contrasena to service_role;
revoke all on sequence public.intentos_contrasena_id_seq from anon, authenticated;
grant usage, select on sequence public.intentos_contrasena_id_seq to service_role;
