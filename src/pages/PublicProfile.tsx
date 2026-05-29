import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getPublicProfile } from "../services/api"

type RPG = {
  id: number
  name: string
  description?: string
  banner_url?: string | null
}

type Profile = {
  id: number
  username: string
  bio?: string
  owned_rpgs: RPG[]
  participating_rpgs: RPG[]
}

export default function PublicProfile() {
  const { id } = useParams()

  const [profile, setProfile] =
    useState<Profile | null>(null)

  useEffect(() => {
    if (!id) return

    getPublicProfile(Number(id))
      .then(setProfile)
      .catch(console.error)
  }, [id])

  if (!profile) {
    return (
      <div className="rpg-bg min-h-screen p-6">
        Carregando perfil...
      </div>
    )
  }

  return (
    <div className="rpg-bg min-h-screen p-6">
      <div className="max-w-5xl mx-auto">

        <div className="rpg-panel mb-6">
          <h1 className="text-4xl font-display text-[#e0a96d]">
            {profile.username}
          </h1>

          <p className="mt-4 text-[#c9ada7]/80">
            {profile.bio ||
              "Este usuário ainda não possui biografia."}
          </p>
        </div>

        <div className="rpg-panel mb-6">
          <h2 className="text-2xl font-display text-[#e0a96d] mb-4">
            🎮 RPGs criados
          </h2>

          <div className="space-y-3">
            {profile.owned_rpgs.map((rpg) => (
              <Link
                key={rpg.id}
                to={`/rpg/${rpg.id}`}
                className="rpg-card block"
              >
                <p className="font-bold text-[#e0a96d]">
                  {rpg.name}
                </p>

                <p className="text-sm text-[#c9ada7]/70">
                  {rpg.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rpg-panel">
          <h2 className="text-2xl font-display text-[#e0a96d] mb-4">
            👥 Participando
          </h2>

          <div className="space-y-3">
            {profile.participating_rpgs.map((rpg) => (
              <Link
                key={rpg.id}
                to={`/rpg/${rpg.id}`}
                className="rpg-card block"
              >
                <p className="font-bold text-[#e0a96d]">
                  {rpg.name}
                </p>

                <p className="text-sm text-[#c9ada7]/70">
                  {rpg.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}