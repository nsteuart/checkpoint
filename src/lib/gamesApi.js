const BASE_URL = 'https://www.freetogame.com/api'

export async function getAllGames() {
  const res = await fetch(`${BASE_URL}/games`)
  if (!res.ok) throw new Error('Failed to fetch games')
  return res.json()
}

export async function getGameDetails(id) {
  const res = await fetch(`${BASE_URL}/game?id=${id}`)
  if (!res.ok) throw new Error('Failed to fetch game details')
  return res.json()
}

export function getGameImageUrl(thumbnail) {
  return thumbnail || '/favicon.svg'
}
