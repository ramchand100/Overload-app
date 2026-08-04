# Overload — Progressive Overload Tracker

Every rep counted.

## Tech Stack
- React 18 + Vite (frontend)
- Supabase (auth + database)
- Vercel (hosting)

---

## Setup Instructions

### Step 1 — Supabase

1. Go to supabase.com and create a free account
2. Create a new project (pick a name like "overload-app")
3. Wait for the project to be ready (takes ~1 minute)
4. Go to **SQL Editor** in the left sidebar
5. Copy and paste the entire contents of `supabase-schema.sql` into the editor
6. Click **Run** — this creates all your tables
7. Go to **Settings → API** in the left sidebar
8. Copy your **Project URL** and **anon public key**

### Step 2 — Environment Variables

Create a file called `.env` in this folder (copy from `.env.example`):

```
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 1.

### Step 3 — Enable Google Auth (optional)

1. In Supabase go to **Authentication → Providers**
2. Enable **Google**
3. Follow the instructions to add Google OAuth credentials
4. Add your domain to the allowed redirect URLs

### Step 4 — Run locally (to test)

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Step 5 — Deploy to Vercel

1. Create a free account at vercel.com
2. Push this folder to a GitHub repository
3. In Vercel, click "Add New Project"
4. Import your GitHub repository
5. In the Environment Variables section, add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click Deploy
7. Your app is live at a vercel.app URL

### Step 6 — Custom Domain (optional)

In Vercel project settings → Domains, add your custom domain like `overloadapp.fit`

---

## What's included

- Full onboarding flow (progressive overload education + program setup)
- Session logging with set tracking and PR detection
- Week strip with arc rings showing progress
- Progress tab with strength curves and calendar history
- Profile with achievements and badges
- Real user accounts via Supabase Auth (Google + email/password)
- Guest mode (works without an account, data stays local)
- All workout data saved to Supabase cloud database
- Data syncs across devices when logged in

---

## Folder structure

```
overload-app/
├── src/
│   ├── App.jsx          — Main app (all screens)
│   ├── main.jsx         — React entry point
│   ├── supabase.js      — Supabase client
│   ├── useAuth.js       — Auth hook (login/logout/signup)
│   └── useData.js       — Data hook (all DB operations)
├── index.html           — HTML entry point
├── package.json         — Dependencies
├── vite.config.js       — Vite config
├── supabase-schema.sql  — Run this in Supabase SQL editor
├── .env.example         — Copy to .env and fill in your keys
└── .gitignore
```
