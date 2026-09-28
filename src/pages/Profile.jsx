import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import GameGrid from '../components/GameGrid'

export default function Profile() {
  const { user, profile } = useAuth()
  const [userGames, setUserGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('played')

  useEffect(() => {
    if (!user) return
    supabase
      .from('user_games')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .then(({ data }) => {
        setUserGames(data || [])
        setLoading(false)
      })
  }, [user])

  const played = userGames.filter((g) => g.status === 'played')
  const wantToPlay = userGames.filter((g) => g.status === 'want_to_play')
  const reviewed = played.filter((g) => g.review)

  const avgRating =
    played.filter((g) => g.rating > 0).length > 0
      ? (
          played.filter((g) => g.rating > 0).reduce((s, g) => s + g.rating, 0) /
          played.filter((g) => g.rating > 0).length
        ).toFixed(1)
      : '—'

  const currentGames = tab === 'played' ? played : tab === 'want_to_play' ? wantToPlay : reviewed

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-2xl font-bold">
          {profile?.username?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile || 'Loading…'}</h1>
          <p className="text-sm text-gray-400">
            Member since {new Date(user?.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-light border border-surface-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-accent">{played.length}</p>
          <p className="text-xs text-gray-400 mt-1">Played</p>
        </div>
        <div className="bg-surface-light border border-surface-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{wantToPlay.length}</p>
          <p className="text-xs text-gray-400 mt-1">Want to Play</p>
        </div>
        <div className="bg-surface-light border border-surface-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-star">{avgRating}</p>
          <p className="text-xs text-gray-400 mt-1">Avg Rating</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-surface-light rounded-xl p-1 border border-surface-border w-fit">
        {[
          { key: 'played', label: `Played (${played.length})` },
          { key: 'want_to_play', label: `Want to Play (${wantToPlay.length})` },
          { key: 'reviews', label: `Reviews (${reviewed.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-accent text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <GameGrid
        games={currentGames.map((ug) => ({
          id: ug.game_id,
          title: ug.game_title,
          thumbnail: ug.game_thumbnail,
          genre: ug.game_genre,
        }))}
        userGames={currentGames}
        loading={loading}
      />
    </div>
  )
}
