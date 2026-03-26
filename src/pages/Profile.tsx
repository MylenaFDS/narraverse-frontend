import { useEffect, useState } from "react"
import { getMe, updateProfile } from "../services/api"
import type { UserProfile } from "../types/user"

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
  const participatingFiltered =
    user.participating_rpgs?.filter(
      (p) => !user.owned_rpgs?.some((o) => o.id === p.id)
    ) || []

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl mb-4">{user.username}</h2>

      <textarea
        className="w-full p-3 bg-gray-800 rounded"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Escreva sua bio..."
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-2 bg-purple-600 px-4 py-2 rounded disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Salvar"}
      </button>

      {/* RPGs criados */}
      <h3 className="text-xl mt-6 mb-2">🎮 RPGs criados</h3>

      <div className="space-y-2">
        {user.owned_rpgs?.length ? (
          user.owned_rpgs.map((rpg) => (
            <div key={rpg.id} className="bg-gray-800 p-3 rounded">
              <p className="font-bold">{rpg.name}</p>
              <p className="text-sm text-gray-400">
                {rpg.description || "Sem descrição"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Você ainda não criou RPGs</p>
        )}
      </div>

      {/* Participando */}
      <h3 className="text-xl mt-6 mb-2">👥 Participando</h3>

      <div className="space-y-2">
        {participatingFiltered.length ? (
          participatingFiltered.map((rpg) => (
            <div key={rpg.id} className="bg-gray-800 p-3 rounded">
              <p className="font-bold">{rpg.name}</p>
              <p className="text-sm text-gray-400">
                {rpg.description || "Sem descrição"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">
            Você não participa de nenhum RPG ainda
          </p>
        )}
      </div>
    </div>
  )
}