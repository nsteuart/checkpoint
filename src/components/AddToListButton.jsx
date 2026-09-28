import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function AddToListButton({ game }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [lists, setLists] = useState([])
  const [open, setOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setLists(data || []))
  }, [user])

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function addToList(listId) {
    setAdding(true)
    const { count } = await supabase
      .from('list_games')
      .select('*', { count: 'exact', head: true })
      .eq('list_id', listId)

    await supabase.from('list_games').insert({
      list_id: listId,
      game_id: game.id,
      game_title: game.title,
      game_thumbnail: game.thumbnail,
      position: count || 0,
    })
    setAdding(false)
    setOpen(false)
  }

  if (!user) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="px-4 py-2 rounded-xl text-sm font-semibold bg-surface-light border border-surface-border text-gray-300 hover:text-white transition-colors"
      >
        + Add to List
      </button>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 rounded-xl text-sm font-semibold bg-surface-light border border-surface-border text-gray-300 hover:text-white transition-colors"
      >
        + Add to List
      </button>
      {open && (
        <div className="absolute top-full mt-2 right-0 w-56 bg-surface-lighter border border-surface-border rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-surface-border">
            <p className="text-xs text-gray-400 font-medium">Add to list</p>
          </div>
          {lists.length === 0 ? (
            <div className="p-3">
              <p className="text-xs text-gray-500 mb-2">No lists yet</p>
              <button
                onClick={() => navigate('/create-list')}
                className="text-xs text-accent hover:underline"
              >
                Create your first list
              </button>
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto">
              {lists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => addToList(list.id)}
                  disabled={adding}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-surface-border transition-colors"
                >
                  {list.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
