import { useEffect, useState } from "react"
import { getFeed } from "../services/api"
import type { FeedResponse } from "../types/feed"
import { Link } from "react-router-dom"

export default function Home() {
  const [feed, setFeed] = useState<FeedResponse | null>(null)

  useEffect(() => {
  getFeed().then((data) => {
    console.log("FEED FRONT:", data)
    setFeed(data)
  })
}, [])

  if (!feed) {
    return <p className="p-4">Carregando...</p>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl mb-6 font-bold">Feed de RPGs</h2>

      <div className="space-y-4">
        {feed.recent.map((rpg) => (
          <Link key={rpg.id} to={`/rpg/${rpg.id}`}>
            <div className="bg-gray-800 p-4 rounded-xl shadow hover:bg-gray-700 transition cursor-pointer">

              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{rpg.name}</h3>

                {rpg.recent_activity && (
                  <span className="text-xs bg-green-600 px-2 py-1 rounded">
                    🔥 Ativo
                  </span>
                )}
              </div>

              <p className="text-gray-400 mb-2">
                {rpg.description || "Sem descrição"}
              </p>

              <span className="text-sm text-gray-500">
                👥 {rpg.participants_count} participantes
              </span>

            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}