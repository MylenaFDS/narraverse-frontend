import { useEffect, useState } from "react"

import {
  getMyInvites,
  acceptInvite,
  rejectInvite,
} from "../../services/api"

type Invite = {
  id: number
  rpg_id: number
  status: string

  rpg?: {
    id: number
    name: string
    description?: string
    banner_url?: string | null
  }
}

export default function RPGInvites() {
  const [invites, setInvites] =
    useState<Invite[]>([])

  

  useEffect(() => {
  let mounted = true

  async function init() {
    try {
      const data =
        await getMyInvites()

      if (mounted) {
        setInvites(data || [])
      }
    } catch (err) {
      console.error(
        "Erro ao buscar convites:",
        err
      )
    }
  }

  void init()

  return () => {
    mounted = false
  }
}, [])

  async function handleAccept(
    rpgId: number
  ) {
    try {
      await acceptInvite(rpgId)

      setInvites((prev) =>
        prev.filter(
          (i) => i.rpg_id !== rpgId
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  async function handleReject(
    rpgId: number
  ) {
    try {
      await rejectInvite(rpgId)

      setInvites((prev) =>
        prev.filter(
          (i) => i.rpg_id !== rpgId
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  if (invites.length === 0) {
  return (
    <div className="rpg-bg min-h-screen p-6">
      <div className="rpg-panel max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-display text-[#e0a96d]">
          Nenhum convite
        </h1>

        <p className="text-[#c9ada7]/70 mt-3">
          Você ainda não recebeu convites para RPGs.
        </p>
      </div>
    </div>
  )
}

  return (
  <div className="rpg-bg min-h-screen p-6">
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="title text-4xl">
          Convites
        </h1>

        <p className="text-[#c9ada7]/70 mt-2">
          Mundos que convidaram você para participar.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {invites.map((invite) => (
          <div
            key={invite.rpg_id}
            className="
              rounded-3xl
              border
              border-[#e0a96d]/20
              bg-gradient-to-br
              from-[#2a1519]
              to-[#12090b]
              p-6
              shadow-[0_0_25px_rgba(0,0,0,0.35)]
            "
          >
            {invite.rpg?.banner_url && (
  <div className="
  relative
  h-52
  -m-6
  mb-5
  overflow-hidden
  rounded-t-3xl
  border-b
  border-[#e0a96d]/10
">
    <img
      src={`http://127.0.0.1:8001/${invite.rpg.banner_url}`}
      alt={invite.rpg.name}
      className="
  w-full
  h-full
  object-cover
  opacity-80
  transition
"
    />
  </div>
)}
            <p
  className="
    inline-flex
    rounded-full
    border
    border-[#e0a96d]/30
    bg-black/30
    px-3
    py-1
    text-xs
    uppercase
    tracking-[0.25em]
    text-[#e0a96d]
  "
>
  Convite recebido
</p>

            <h2 className="text-2xl font-display text-[#e0a96d]">
              {invite.rpg?.name ?? "RPG"}
            </h2>

            <p className="text-sm text-[#c9ada7]/70 mt-3 leading-relaxed line-clamp-5">
              {invite.rpg?.description ||
                "Este RPG ainda não possui descrição."}
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() =>
                  handleAccept(invite.rpg_id)
                }
                className="rpg-btn"
              >
                Aceitar
              </button>

              <button
                onClick={() =>
                  handleReject(invite.rpg_id)
                }
                className="
  rounded-xl
  border
  border-red-900/50
  px-4
  py-2
  text-red-300
  hover:bg-red-950/40
  transition
"
              >
                Recusar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)
}