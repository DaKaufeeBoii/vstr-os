-- Server-only guestbook storage and atomic shared rate limiter.
create table if not exists public.guestbook_entries (
  id text primary key,
  name text not null check (char_length(name) between 1 and 40),
  role text not null check (role in ('Recruiter', 'Engineer', 'Designer', 'Visitor')),
  message text not null check (char_length(message) between 1 and 280),
  avatar_color text not null,
  created_at timestamptz not null default now()
);

create index if not exists guestbook_entries_created_at_idx
  on public.guestbook_entries (created_at desc);

alter table public.guestbook_entries enable row level security;
revoke all on public.guestbook_entries from anon, authenticated;
grant all on public.guestbook_entries to service_role;

create table if not exists public.guestbook_rate_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count >= 0)
);

alter table public.guestbook_rate_limits enable row level security;
revoke all on public.guestbook_rate_limits from anon, authenticated;
grant all on public.guestbook_rate_limits to service_role;

create or replace function public.consume_guestbook_rate_limit(
  p_ip_hash text,
  p_max_requests integer default 5,
  p_window_seconds integer default 60
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count integer;
begin
  insert into public.guestbook_rate_limits (ip_hash, window_started_at, request_count)
  values (p_ip_hash, now(), 1)
  on conflict (ip_hash) do update set
    window_started_at = case
      when guestbook_rate_limits.window_started_at + make_interval(secs => p_window_seconds) <= now() then now()
      else guestbook_rate_limits.window_started_at
    end,
    request_count = case
      when guestbook_rate_limits.window_started_at + make_interval(secs => p_window_seconds) <= now() then 1
      else guestbook_rate_limits.request_count + 1
    end
  returning request_count into current_count;

  delete from public.guestbook_rate_limits
    where window_started_at < now() - interval '1 day';

  return current_count <= greatest(1, p_max_requests);
end;
$$;

revoke all on function public.consume_guestbook_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_guestbook_rate_limit(text, integer, integer) to service_role;
