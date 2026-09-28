# Checkpoint

**Track your games. Rate your journey.**

Checkpoint is a Letterboxd-style web app for video games. Create an account, browse a catalog of games, rate them on a 1–5 star scale, mark them as *Played* or *Want to Play*, and write reviews — all saved to your profile.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Auth & Database | Supabase (Auth + Postgres) |
| Game Catalog | FreeToGame API |
| Hosting | Netlify |
| Routing | React Router |

## Features

- User registration, login, and logout
- Browse and search a catalog of ~400 games
- Game detail pages with screenshots and descriptions
- Rate games (1–5 stars, half-star precision)
- Mark games as **Played** or **Want to Play**
- Write and save reviews
- Personal profile with stats and game lists

## Local Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/checkpoint.git
   cd checkpoint
   ```

2. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com) and create a free project
   - In the SQL Editor, run the contents of `supabase/schema.sql`
   - Copy your **Project URL** and **anon public key** from Project Settings → API

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Then fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

4. **Install and run**
   ```bash
   npm install
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173).

## Deployment

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com) → Add new site → Import from Git
3. Select your repo, set build command to `npm run build` and publish directory to `dist`
4. Add your Supabase env vars in Site settings → Environment variables
5. Deploy!

## Project Structure

```
checkpoint/
├── index.html
├── netlify.toml
├── supabase/
│   └── schema.sql          # Database setup
├── public/
│   ├── _redirects
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── config.js
    ├── lib/
    │   ├── supabase.js
    │   └── gamesApi.js
    ├── context/
    │   └── AuthContext.jsx
    ├── components/
    │   ├── Navbar.jsx
    │   ├── GameCard.jsx
    │   ├── GameGrid.jsx
    │   ├── StarRating.jsx
    │   └── ProtectedRoute.jsx
    └── pages/
        ├── Login.jsx
        ├── Register.jsx
        ├── Home.jsx
        ├── GameDetail.jsx
        └── Profile.jsx
```

## Game Data

Game information provided by the [FreeToGame API](https://www.freetogame.com/).
