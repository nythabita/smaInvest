# Deployment Notes for Vercel

This project is a mobile-first investment education MVP built using Vue 3 and Vite, integrated with Supabase for authentication and database services.

## Configuration Details

* **Framework Preset**: Vite / Vue
* **Build Command**: `npm run build`
* **Output Directory**: `dist`

## Required Environment Variables

You need to configure the following environment variables in your Vercel Project Settings under **Environment Variables**:

| Key | Value Source / Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL (e.g., `https://xxxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Project API Anon Key |

> [!NOTE]
> Make sure `.env` files are kept ignored in Git (they are already included in `.gitignore` and have not been pushed to the remote repository).
