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

  if (invites.length === 0)
    return null

  return (
    <div
      className="
        bg-[#18181b]
        border
        border-[#2b2b31]
        rounded-2xl
        p-6
        mb-8
      "
    >
      <h2 className="text-2xl font-bold mb-4">
        🎮 Convites para RPG
      </h2>

      <div className="space-y-4">
        {invites.map((invite) => (
          <div
            key={invite.rpg_id}
            className="
              bg-[#232329]
              rounded-xl
              p-4
            "
          >
            <h3 className="font-bold text-lg">
              {invite.rpg?.name ??
                "RPG"}
            </h3>

            <p className="text-gray-400 text-sm mb-4">
              {
                invite.rpg
                  ?.description
              }
            </p>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  handleAccept(
                    invite.rpg_id
                  )
                }
                className="
                  bg-green-600
                  hover:bg-green-500
                  px-4
                  py-2
                  rounded-xl
                "
              >
                ✅ Aceitar
              </button>

              <button
                onClick={() =>
                  handleReject(
                    invite.rpg_id
                  )
                }
                className="
                  bg-red-600
                  hover:bg-red-500
                  px-4
                  py-2
                  rounded-xl
                "
              >
                ❌ Recusar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}