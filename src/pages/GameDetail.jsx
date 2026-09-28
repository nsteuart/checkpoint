import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getGameDetails } from '../lib/gamesApi'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import StarRating from '../components/StarRating'

export default function GameDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [game, setGame] = useState(null)
  const [userGame, setUserGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [review, setReview] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getGameDetails(id)
      .then(setGame)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!user) return
    supabase
      .from('user_games')
      .select('*')
      .eq('user_id', user.id)
      .eq('game_id', Number(id))
      .single()
      .then(({ data }) => {
        setUserGame(data)
        if (data?.review) setReview(data.review)
      })
  }, [user, id])

  async function saveGame(status, rating) {
    if (!user) return
    setSaving(true)
    const { error } = await supabase
      .from('user_games')
      .upsert({
        user_id: user.id,
        game_id: Number(id),
        game_title: game.title,
        game_thumbnail: game.thumbnail,
        game_genre: game.genre,
        status,
        rating,
        review,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,game_id' })
    setSaving(false)
    if (!error) {
      setMessage('Saved!')
      setTimeout(() => setMessage(''), 2000)
    }
  }

  async function handleRate(rating) {
    const status = userGame?.status || 'played'
    await saveGame(status, rating)
    setUserGame((prev) => ({ ...prev, rating }))
  }

  async function handleStatus(status) {
    if (userGame?.status === status) return
    await saveGame(status, userGame?.rating || 0)
    setUserGame((prev) => ({ ...prev, status }))
  }

  async function handleRemove() {
    if (!userGame) return
    await supabase
      .from('user_games')
      .delete()
      .eq('user_id', user.id)
      .eq('game_id', Number(id))
    setUserGame(null)
    setReview('')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent" />
      </div>
    )
  }

  if (!game) {
    return <div className="text-center py-20 text-gray-400">Game not found.</div>
  }

  const screenshots = game.screenshots?.slice(0, 4) || []

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6 h-64 md:h-80">
        <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl md:text-4xl font-bold">{game.title}</h1>
          <p className="text-gray-300 mt-1">{game.genre} · {game.publisher} · {game.developer}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_280px] gap-8">
        {/* Main content */}
        <div>
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-surface-light border border-surface-border rounded-xl px-4 py-2">
              <span className="text-sm text-gray-400">Your Rating:</span>
              <StarRating value={userGame?.rating || 0} onChange={handleRate} size="lg" />
            </div>
            <button
              onClick={() => handleStatus('played')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                userGame?.status === 'played'
                  ? 'bg-accent text-black'
                  : 'bg-surface-light border border-surface-border text-gray-300 hover:text-white'
              }`}
            >
              {userGame?.status === 'played' ? '✓ Played' : 'Mark as Played'}
            </button>
            <button
              onClick={() => handleStatus('want_to_play')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                userGame?.status === 'want_to_play'
                  ? 'bg-blue-500 text-white'
                  : 'bg-surface-light border border-surface-border text-gray-300 hover:text-white'
              }`}
            >
              {userGame?.status === 'want_to_play' ? '✓ Want to Play' : 'Want to Play'}
            </button>
            {userGame && (
              <button
                onClick={handleRemove}
                className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            )}
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm">
              {message}
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-gray-400 leading-relaxed text-sm">{game.description}</p>
          </div>

          {/* Screenshots */}
          {screenshots.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Screenshots</h2>
              <div className="grid grid-cols-2 gap-3">
                {screenshots.map((ss) => (
                  <img
                    key={ss.id}
                    src={ss.image}
                    alt="Screenshot"
                    className="rounded-xl w-full aspect-video object-cover border border-surface-border"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Review */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Your Review</h2>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your thoughts…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-white placeholder-gray-500 focus:outline-none focus:border-accent resize-none transition-colors"
            />
            <button
              onClick={() => saveGame(userGame?.status || 'played', userGame?.rating || 0)}
              disabled={saving}
              className="mt-2 px-4 py-2 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dark disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save Review'}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-surface-light border border-surface-border rounded-xl p-4 space-y-3">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Release Date</span>
              <p className="text-sm text-gray-200">{game.release_date}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Platform</span>
              <p className="text-sm text-gray-200">{game.platform}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Status</span>
              <p className="text-sm text-gray-200">{game.status}</p>
            </div>
          </div>

          <a
            href={game.game_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center px-4 py-2.5 rounded-xl bg-surface-light border border-surface-border text-sm text-gray-300 hover:text-accent hover:border-accent/50 transition-colors"
          >
            Play Now ↗
          </a>

          <p className="text-xs text-gray-600 text-center">
            Game data by{' '}
            <a href="https://www.freetogame.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent">
              FreeToGame
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
