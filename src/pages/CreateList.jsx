import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function CreateList() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('List name is required')
      return
    }
    setLoading(true)
    setError('')

    const { data, error: insertError } = await supabase
      .from('lists')
      .insert({ user_id: user.id, name: name.trim(), description: description.trim() || null })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    if (data?.id) {
      navigate(`/list/${data.id}`)
    } else {
      setError('List created but could not redirect. Check your profile.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create a List</h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">List Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Best RPGs of 2024"
            className="w-full px-3 py-2.5 rounded-lg bg-surface-light border border-surface-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Description <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this list about?"
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg bg-surface-light border border-surface-border text-white placeholder-gray-500 focus:outline-none focus:border-accent resize-none transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark disabled:opacity-50 transition-colors"
        >
          {loading ? 'Creating…' : 'Create List'}
        </button>
      </form>
    </div>
  )
}
