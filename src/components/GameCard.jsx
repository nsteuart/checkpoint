import { Link } from 'react-router-dom'

export default function GameCard({ game, userGame }) {
  return (
    <Link to={`/game/${game.id}`} className="group block">
      <div className="relative rounded-xl overflow-hidden bg-surface-light border border-surface-border hover:border-accent/50 transition-all hover:scale-[1.02]">
        <div className="aspect-[3/4] relative">
          <img
            src={game.thumbnail || game.thumbnail}
            alt={game.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          {userGame?.rating > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-star text-star" stroke="currentColor" strokeWidth="1">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs font-semibold text-star">{userGame.rating}</span>
            </div>
          )}
          {userGame?.status && (
            <div className={`absolute top-2 left-2 rounded-md px-2 py-0.5 text-xs font-semibold ${
              userGame.status === 'played' ? 'bg-accent/90 text-black' : 'bg-blue-500/90 text-white'
            }`}>
              {userGame.status === 'played' ? 'Played' : 'Want to Play'}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-semibold text-sm truncate group-hover:text-accent transition-colors">
            {game.title}
          </h3>
          <p className="text-xs text-gray-400 truncate">{game.genre} · {game.publisher}</p>
        </div>
      </div>
    </Link>
  )
}
