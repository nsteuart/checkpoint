import GameCard from './GameCard'

export default function GameGrid({ games, userGames = [], loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-xl bg-surface-light animate-pulse" />
        ))}
      </div>
    )
  }

  if (!games?.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">No games found</p>
        <p className="text-sm mt-1">Try a different search term</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {games.map((game) => {
        const userGame = userGames.find((ug) => ug.game_id === game.id)
        return <GameCard key={game.id} game={game} userGame={userGame} />
      })}
    </div>
  )
}
