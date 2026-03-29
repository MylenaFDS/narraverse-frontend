import { useEffect, useState } from "react"
import { getMe, updateProfile } from "../services/api"
import type { UserProfile, RPG } from "../types/user"

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data = await getMe()
        setUser(data)
        setBio(data.bio || "")
      } catch (err) {
        console.error("Erro ao carregar perfil:", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  async function handleSave() {
    try {
      setSaving(true)
      const updated = await updateProfile({ bio })
      setUser(updated)
    } catch (err) {
      console.error("Erro ao salvar:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Carregando...</div>
  if (!user) return <div>Erro ao carregar perfil</div>

  // 🔥 Evita duplicação: remove RPGs criados da lista de participação
  const participatingFiltered: RPG[] =
    user.participating_rpgs?.filter(
      (p: RPG) => !user.owned_rpgs?.some((o: RPG) => o.id === p.id)
    ) || []

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="title mb-4">{user.username}</h2>

      <textarea
        className="w-full p-3 bg-surface border border-border rounded text-text"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn mt-2"
      >
        {saving ? "Salvando..." : "Salvar"}
      </button>

      {/* RPGs criados */}
      <h3 className="title mt-6 mb-2">🎮 RPGs criados</h3>

      <div className="space-y-2">
        {user.owned_rpgs && user.owned_rpgs.length > 0 ? (
          user.owned_rpgs.map((rpg: RPG) => (
            <div key={rpg.id} className="card">
              <p className="font-bold text-accent">{rpg.name}</p>
              <p className="text-sm text-textSoft">{rpg.description}</p>
            </div>
          ))
        ) : (
          <p className="text-textSoft">Você ainda não criou RPGs</p>
        )}
      </div>

      {/* Participando */}
      <h3 className="title mt-6 mb-2">👥 Participando</h3>

      <div className="space-y-2">
        {participatingFiltered.length > 0 ? (
          participatingFiltered.map((rpg: RPG) => (
            <div key={rpg.id} className="card">
              <p className="font-bold text-accent">{rpg.name}</p>
              <p className="text-sm text-textSoft">{rpg.description}</p>
            </div>
          ))
        ) : (
          <p className="text-textSoft">
            Você não participa de nenhum RPG ainda
          </p>
        )}
      </div>
    </div>
  )
}