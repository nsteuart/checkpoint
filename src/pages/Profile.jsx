import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import GameGrid from '../components/GameGrid'
import ListCard from '../components/ListCard'

export default function Profile() {
  const { user, profile } = useAuth()
  const [userGames, setUserGames] = useState([])
  const [lists, setLists] = useState([])
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

  useEffect(() => {
    if (!user) return
    supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          Promise.all(
            data.map(async (list) => {
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
          ).then(setLists)
        }
      })
  }, [user])

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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-2xl font-bold">
            {profile?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile?.username || 'Loading…'}</h1>
            <p className="text-sm text-gray-400">
              Member since {new Date(user?.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Link
          to="/create-list"
          className="px-4 py-2 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dark transition-colors"
        >
          + New List
        </Link>
      </div>

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
        <>
          <div className="flex justify-end mb-4">
            <Link
              to="/create-list"
              className="px-4 py-2 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dark transition-colors"
            >
              + Create New List
            </Link>
          </div>
          {lists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-3">No lists yet</p>
              <p className="text-sm text-gray-600">Create a list, then add games to it from any game page</p>
            </div>
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
          )}
        </>
      ) : (
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
      )}
    </div>
  )
}
