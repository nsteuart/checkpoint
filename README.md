# Checkpoint

**Track your games. Rate your journey.**

Checkpoint is a Letterboxd-style web app for video games. Browse a catalog of games, rate them on a 1–5 star scale, mark them as *Played* or *Want to Play*, write reviews, and create curated lists — all saved to your profile.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Auth & Database | Supabase (Auth + Postgres) |
| Game Catalog | FreeToGame API |
| Hosting | Netlify |
| Routing | React Router |

## Features

- **Public browsing** — browse games, view community ratings and reviews without an account
- **User accounts** — register, login, and logout
- **Game catalog** — search and filter ~400 games by genre
- **Game detail pages** — screenshots, descriptions, community ratings and reviews
- **Rate games** — 1–5 stars with half-star precision
- **Track your games** — mark as *Played* or *Want to Play*
- **Write reviews** — share your thoughts on any game
- **Create lists** — curate lists like "Best RPGs of 2024" and share them
- **Public profiles** — view other users' ratings, reviews, and lists

## Local Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/nsteuart/checkpoint.git
   cd checkpoint
   ```

2. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com) and create a free project
   - In the SQL Editor, run the contents of `supabase/schema.sql`
   - Then run the contents of `supabase/add-lists.sql`
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
4. Add your Supabase env vars in Site settings → Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

## Project Structure

```
checkpoint/
├── index.html
├── netlify.toml
├── supabase/
│   ├── schema.sql           # Initial database setup
│   └── add-lists.sql        # Lists feature migration
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
    │   ├── ListCard.jsx
    │   ├── AddToListButton.jsx
    │   └── ProtectedRoute.jsx
    └── pages/
        ├── Login.jsx
        ├── Register.jsx
        ├── Home.jsx
        ├── GameDetail.jsx
        ├── Profile.jsx
        ├── PublicProfile.jsx
        ├── Lists.jsx
        ├── ListDetail.jsx
        └── CreateList.jsx
```

## Game Data

Game information provided by the [FreeToGame API](https://www.freetogame.com/).
