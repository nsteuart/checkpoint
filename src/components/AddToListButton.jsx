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
  const [creating, setCreating] = useState(false)
  const [newListName, setNewListName] = useState('')
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

  async function handleCreateList(e) {
    e.preventDefault()
    if (!newListName.trim()) return
    setCreating(true)
    const { data, error } = await supabase
      .from('lists')
      .insert({ user_id: user.id, name: newListName.trim() })
      .select()
      .single()
    setCreating(false)
    if (!error && data) {
      setLists((prev) => [data, ...prev])
      setNewListName('')
      setCreating(false)
    }
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
        <div className="absolute top-full mt-2 right-0 w-64 bg-surface-lighter border border-surface-border rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-surface-border">
            <p className="text-xs text-gray-400 font-medium">Add to list</p>
          </div>

          {/* Create new list inline */}
          <div className="p-2 border-b border-surface-border">
            {creating ? (
              <form onSubmit={handleCreateList} className="flex gap-1">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name…"
                  autoFocus
                  className="flex-1 px-2 py-1.5 rounded-lg bg-surface border border-surface-border text-white text-xs placeholder-gray-500 focus:outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  className="px-2 py-1.5 rounded-lg bg-accent text-black text-xs font-semibold"
                >
                  Create
                </button>
              </form>
            ) : (
              <button
                onClick={() => setCreating(true)}
                className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-accent hover:bg-surface-border transition-colors"
              >
                + Create new list
              </button>
            )}
          </div>

          {/* Existing lists */}
          {lists.length === 0 ? (
            <div className="p-3">
              <p className="text-xs text-gray-500">No lists yet — create one above</p>
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
