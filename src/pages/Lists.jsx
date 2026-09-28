import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ListCard from '../components/ListCard'

export default function Lists() {
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLists() {
      const { data: listsData } = await supabase
        .from('lists')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false })
        .limit(50)

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
    fetchLists()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Lists</h1>
      <p className="text-gray-400 mb-8">Community-curated game lists</p>

      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-surface-light animate-pulse" />
          ))}
        </div>
      ) : lists.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No lists yet</p>
          <p className="text-sm mt-1">Be the first to create one!</p>
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
    </div>
  )
}
