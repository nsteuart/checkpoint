import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ListDetail() {
  const { id } = useParams()
  const [list, setList] = useState(null)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchList() {
      const { data: listData } = await supabase
        .from('lists')
        .select('*, profiles(username)')
        .eq('id', id)
        .single()

      if (listData) {
        setList(listData)
        const { data: gamesData } = await supabase
          .from('list_games')
          .select('*')
          .eq('list_id', id)
          .order('position', { ascending: true })
        setGames(gamesData || [])
      }
      setLoading(false)
    }
    fetchList()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent" />
      </div>
    )
  }

  if (!list) {
    return <div className="text-center py-20 text-gray-400">List not found.</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/lists" className="text-sm text-gray-400 hover:text-accent transition-colors">
        ← Back to Lists
      </Link>

      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold">{list.name}</h1>
        {list.description && <p className="text-gray-400 mt-2">{list.description}</p>}
        <p className="text-sm text-gray-500 mt-2">
          by{' '}
          <Link to={`/user/${list.profiles?.username}`} className="text-accent hover:underline">
            {list.profiles?.username || 'unknown'}
          </Link>
        </p>
      </div>

      {games.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No games in this list yet.</p>
      ) : (
        <div className="space-y-3">
          {games.map((game, index) => (
            <Link
              key={game.id}
              to={`/game/${game.game_id}`}
              className="flex items-center gap-4 bg-surface-light border border-surface-border rounded-xl p-3 hover:border-accent/50 transition-all group"
            >
              <span className="text-2xl font-bold text-gray-600 w-8 text-center">{index + 1}</span>
              <img
                src={game.game_thumbnail}
                alt={game.game_title}
                className="w-16 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold group-hover:text-accent transition-colors">
                  {game.game_title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
