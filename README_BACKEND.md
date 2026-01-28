
# Backend & Deployment Guide

## 1. Environment Setup

### Supabase
1. Create a new Supabase project.
2. Run the following SQL in Supabase SQL Editor to create the table:

```sql
create table game_results (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  duration_ms bigint not null,
  completed boolean not null default false,
  created_at timestamp with time zone default now()
);

-- Optional: Enable Row Level Security (RLS) if you want to restrict direct access
-- alter table game_results enable row level security;
```

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Link project: `vercel link`
3. Add Environment Variables (in Vercel Dashboard > Settings > Environment Variables, and pull locally with `vercel env pull`):

| Variable Name | Description |
|--------------|-------------|
| `SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key (secret!) |
| `ADMIN_PASSWORD` | Password for the Admin Dashboard |

**Note**: Do NOT use the Anon Key. We use Service Role Key because the backend needs full access to upsert/check without user authentication.

## 2. Running Locally

To run both the Vite frontend and the Serverless API functions locally, use `vercel dev`:

```bash
vercel dev
```

This will start the development server (usually at http://localhost:3000) with API routes available at `/api/*`.

## 3. Verification Steps

### A. New User Flow
1. Open the game (e.g., http://localhost:3000).
2. You should see the "Email Collection Modal".
3. Enter a valid email (e.g., `test@example.com`).
4. Click confirm. Modal should close.
5. Click "Start Game". Play through all questions.
6. Upon winning (Trophy Screen), check Supabase table. You should see a new record with `completed: true`.

### B. Duplicate Prevention
1. Refresh the page.
2. Enter the SAME email (`test@example.com`).
3. You should see an alert: "你已完成本次挑战...".
4. The game should NOT let you proceed.

### C. Admin Dashboard
1. Go to `/admin.html` (e.g., http://localhost:3000/admin.html).
2. Enter the `ADMIN_PASSWORD` you set in env vars.
3. You should see the table with your result.
4. Click "Download CSV" to test the export.

## 4. File Structure Changes

- `api/` - Serverless functions (Backend)
- `src/components/EmailModal.tsx` - New email collection component
- `src/admin.tsx` - Admin Dashboard logic
- `admin.html` - Admin Dashboard entry point
- `App.tsx` - Modified to integrate flow
- `vite.config.ts` - Updated for multi-page build
