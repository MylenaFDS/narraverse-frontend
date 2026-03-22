import { useEffect, useState } from "react"
import { getFeed } from "../services/api"
import type { FeedResponse } from "../types/feed"

export default function Home() {
  const [feed, setFeed] = useState<FeedResponse | null>(null)

  useEffect(() => {
    getFeed().then(setFeed)
  }, [])

  if (!feed) {
    return <p>Carregando...</p>
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">Feed de RPGs</h2>

      <div className="space-y-4">
        {feed.recent.map((rpg) => (
          <div
            key={rpg.id}
            className="bg-gray-800 p-4 rounded-xl shadow"
          >
            <h3 className="text-xl font-bold">{rpg.name}</h3>
            <p className="text-gray-400">{rpg.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}