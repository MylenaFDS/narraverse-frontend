import { useEffect, useState } from "react"
import { getMe, updateProfile, deleteRPG } from "../services/api"
import type { UserProfile, RPG } from "../types/user"
import CreateRPGForm from "../components/Profile/CreateRPGForm"

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

  async function handleDeleteRPG(rpgId: number) {
  const confirmed = window.confirm(
    "Tem certeza que deseja excluir este RPG?\n\nEssa ação não poderá ser desfeita."
  )

  if (!confirmed) return

  try {
    await deleteRPG(rpgId)

    const data = await getMe()
    setUser(data)
  } catch (err) {
    console.error("Erro ao excluir RPG:", err)
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
  <div className="rpg-bg min-h-screen flex items-center justify-center p-6">
    <div className="rpg-panel w-full max-w-3xl">

      <h2 className="text-2xl font-display text-accent mb-4">
        {user.username}
      </h2>

      <textarea
        className="rpg-input mb-3"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="rpg-btn"
      >
        {saving ? "Salvando..." : "Salvar"}
      </button>

      <div className="rpg-divider" />

<CreateRPGForm
  onCreated={async () => {
    const data = await getMe()
    setUser(data)
  }}
/>

      {/* RPGs criados */}
      <h3 className="text-xl font-display text-accent mb-3">
        🎮 RPGs criados
      </h3>

      <div className="space-y-3 cursor-pointer">
        {user.owned_rpgs?.length ? (
          user.owned_rpgs.map((rpg: RPG) => (
            <div key={rpg.id} className="rpg-card">
  <p className="font-bold text-accent">{rpg.name}</p>
  <p className="text-sm text-textSoft">{rpg.description}</p>

  <button
    type="button"
    onClick={() => handleDeleteRPG(rpg.id)}
    className="mt-3 text-sm text-red-400 hover:text-red-300 transition"
  >
    Excluir RPG
  </button>
</div>
          ))
        ) : (
          <p className="text-textSoft">
            Você ainda não criou RPGs
          </p>
        )}
      </div>

      <div className="rpg-divider" />

      {/* Participando */}
      <h3 className="text-xl font-display text-accent mb-3">
        👥 Participando
      </h3>

      <div className="space-y-3">
        {participatingFiltered.length ? (
          participatingFiltered.map((rpg: RPG) => (
            <div key={rpg.id} className="rpg-card">
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
  </div>
)
}



