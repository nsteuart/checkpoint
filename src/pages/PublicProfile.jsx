import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import GameGrid from '../components/GameGrid'
import ListCard from '../components/ListCard'

export default function PublicProfile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [userGames, setUserGames] = useState([])
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('played')
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchProfile() {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (!profileData) {
        setError('User not found')
        setLoading(false)
        return
      }

      setProfile(profileData)

      const { data: gamesData } = await supabase
        .from('user_games')
        .select('*')
        .eq('user_id', profileData.id)
        .order('updated_at', { ascending: false })

      setUserGames(gamesData || [])

      const { data: listsData } = await supabase
        .from('lists')
        .select('*')
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false })

      if (listsData) {
        const listsWithCounts = await Promise.all(
          listsData.map(async (list) => {
            const { count } = await supabase
              .from('list_games')
              .select('*', { count: 'exact', head: true })
              .eq('list_id', list.id)

            const { data: games } = await supabase
              .from('list_games')
              .select('game_thumbnail')
              .eq('list_id', list.id)
              .order('position', { ascending: true })
              .limit(4)

            return {
              ...list,
              gameCount: count || 0,
              previewImages: (games || []).map((g) => g.game_thumbnail).filter(Boolean),
            }
          })
        )
        setLists(listsWithCounts)
      }

      setLoading(false)
    }
    fetchProfile()
  }, [username])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent" />
      </div>
    )
  }

  if (error || !profile) {
    return <div className="text-center py-20 text-gray-400">User not found.</div>
  }

  const played = userGames.filter((g) => g.status === 'played')
  const wantToPlay = userGames.filter((g) => g.status === 'want_to_play')
  const reviewed = played.filter((g) => g.review)
  const currentGames = tab === 'played' ? played : tab === 'want_to_play' ? wantToPlay : reviewed

  const avgRating =
    played.filter((g) => g.rating > 0).length > 0
      ? (
          played.filter((g) => g.rating > 0).reduce((s, g) => s + g.rating, 0) /
          played.filter((g) => g.rating > 0).length
        ).toFixed(1)
      : '—'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-2xl font-bold">
          {profile.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <p className="text-sm text-gray-400">
            Member since {new Date(profile.created_at).toLocaleDateString()}
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
          { key: 'lists', label: `Lists (${lists.length})` },
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

      {tab === 'lists' ? (
        lists.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No lists yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                gameCount={list.gameCount}
                previewImages={list.previewImages}
              />
            ))}
          </div>
        )
      ) : (
        <GameGrid
          games={currentGames.map((ug) => ({
            id: ug.game_id,
            title: ug.game_title,
            thumbnail: ug.game_thumbnail,
            genre: ug.game_genre,
          }))}
          userGames={currentGames}
        />
      )}
    </div>
  )
}
