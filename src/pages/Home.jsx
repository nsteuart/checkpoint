import { useState, useEffect, useMemo } from 'react'
import { getAllGames } from '../lib/gamesApi'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import GameGrid from '../components/GameGrid'

export default function Home() {
  const [games, setGames] = useState([])
  const [userGames, setUserGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    getAllGames()
      .then(setGames)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!user) return
    supabase
      .from('user_games')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => setUserGames(data || []))
  }, [user])

  const genres = useMemo(() => {
    const set = new Set(games.map((g) => g.genre).filter(Boolean))
    return [...set].sort()
  }, [games])

  const filtered = useMemo(() => {
    let result = games
    if (genre) result = result.filter((g) => g.genre === genre)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (g) => g.title.toLowerCase().includes(q) || g.short_description?.toLowerCase().includes(q)
      )
    }
    return result
  }, [games, search, genre])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Discover Games</h1>
        <p className="text-gray-400">Find your next adventure, track what you've played, rate your favorites.</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search games…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-light border border-surface-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-surface-light border border-surface-border text-white focus:outline-none focus:border-accent transition-colors"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Genre chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setGenre('')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            !genre ? 'bg-accent text-black' : 'bg-surface-light text-gray-400 hover:text-white'
          }`}
        >
          All
        </button>
        {genres.slice(0, 12).map((g) => (
          <button
            key={g}
            onClick={() => setGenre(genre === g ? '' : g)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              genre === g ? 'bg-accent text-black' : 'bg-surface-light text-gray-400 hover:text-white'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <GameGrid games={filtered} userGames={userGames} loading={loading} />
    </div>
  )
}
