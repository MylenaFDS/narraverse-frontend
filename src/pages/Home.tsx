import { useEffect, useState } from "react"
import { getFeed } from "../services/api"
import type { FeedResponse } from "../types/feed"
import { Link } from "react-router-dom"

export default function Home() {
  const [feed, setFeed] = useState<FeedResponse | null>(null)

  useEffect(() => {
    getFeed().then(setFeed)
  }, [])

  if (!feed) {
    return <p>Carregando...</p>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="title mb-6">Feed de RPGs</h2>

      <div className="space-y-4">
        {feed.recent.map((rpg) => (
          <Link key={rpg.id} to={`/rpg/${rpg.id}`}>
            <div className="card cursor-pointer">

              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-[#e0a96d]">
                  {rpg.name}
                </h3>

                {rpg.recent_activity && (
                  <span className="text-xs bg-green-700 px-2 py-1 rounded">
                    🔥 Ativo
                  </span>
                )}
              </div>

              <p className="text-sm text-[#c9ada7] mb-2">
                {rpg.description || "Sem descrição"}
              </p>

              <span className="text-xs text-[#9a7b75]">
                👥 {rpg.participants_count} participantes
              </span>

            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}