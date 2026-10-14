# Guestbook deployment

Production guestbook entries and per-IP rate limits use Supabase Postgres. Apply `migrations/20261014_guestbook.sql` to the project before deploying, then configure these server-only environment variables in the hosting provider:

- `SUPABASE_URL`: project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: service role key. Never prefix this with `NEXT_PUBLIC_` or expose it to browser code.
- `GUESTBOOK_RATE_LIMIT_SECRET`: a random secret used to HMAC client IPs before storing rate-limit keys.

The application intentionally returns `503` in production when these values are missing or storage is unavailable. Local development without Supabase uses `.data/guestbook.json`; filesystem write errors fail the request instead of falling back to memory.
