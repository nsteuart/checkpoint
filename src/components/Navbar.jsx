import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-accent/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12l5 5L20 7" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">Checkpoint</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            Discover
          </Link>
          <Link to="/lists" className="text-sm text-gray-400 hover:text-white transition-colors">
            Lists
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="text-sm text-gray-400 hover:text-white transition-colors">
                {profile?.username || 'Profile'}
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm px-3 py-1.5 rounded-lg bg-surface-lighter text-gray-300 hover:text-white hover:bg-surface-border transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="text-sm px-3 py-1.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
