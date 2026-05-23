import { useEffect, useState } from "react"
import { getMe, getInviteCount } from "../services/api"
import { Link, useNavigate } from "react-router-dom"
import { useNotifications } from "../contexts/useNotifications"
import type { Notification } from "../types/notification"

type User = {
  id: number
  username: string
  email: string
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const [inviteCount, setInviteCount] = useState(0)

  const { notifications, markAllAsRead } = useNotifications()

  const navigate = useNavigate()

useEffect(() => {
  let mounted = true

  async function loadUser() {
    const data = await getMe()

    if (!mounted) return

    if (!data) {
      setUser(null)
      return
    }

    setUser(data)
  }

  async function loadInvites() {
    try {
      const count =
        await getInviteCount()

      if (!mounted) return

      setInviteCount(count)
    } catch (err) {
      console.error(err)
    }
  }

  loadUser()
  loadInvites()

  return () => {
    mounted = false
  }
}, [])

  function handleLogout() {
  localStorage.removeItem("token")
  navigate("/login")
}

function handleClickNotification(n: Notification) {
  if (
    n.meta?.rpg_id !== undefined &&
    n.meta?.turn_id !== undefined
  ) {
    navigate(
      `/rpg/${n.meta.rpg_id}#turn-${n.meta.turn_id}`
    )
    setOpen(false)
    return
  }

  if (
    n.meta?.rpg_id !== undefined &&
    n.meta?.chat_message_id !== undefined
  ) {
    navigate(
      `/rpg/${n.meta.rpg_id}?tab=chat#message-${n.meta.chat_message_id}`
    )
    setOpen(false)
  }
}

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex gap-4 items-center text-[#c9ada7] relative">

      {/* LINKS */}
      <Link to="/search" className="hover:text-[#e0a96d] transition">
        Buscar
      </Link>
      <Link
  to="/home"
  className="
    hover:text-[#e0a96d]
    transition
    relative
    flex
    items-center
  "
>
  Convites

  {inviteCount > 0 && (
    <span
      className="
        ml-2
        bg-red-600
        text-white
        text-xs
        px-2
        py-1
        rounded-full
      "
    >
      {inviteCount}
    </span>
  )}
</Link>
      {user && (
        <>
          <Link to="/profile" className="hover:text-[#e0a96d] transition">
            Perfil
          </Link>

          {/* 🔔 NOTIFICAÇÕES */}
          <div className="relative">
            <button
              onClick={() => {
                setOpen(!open)
                markAllAsRead()
              }}
              className="relative text-xl"
            >
              🔔

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-2 w-72 bg-[#1f1f1f] border border-[#333] rounded shadow-lg z-50">

                {notifications.length === 0 ? (
                  <p className="p-3 text-gray-400">
                    Sem notificações
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
  key={n.id}
  onClick={() => {
  console.log("clicou", n)
  handleClickNotification(n)
}}
                      className={` cursor-pointer
                        p-3 border-b border-[#2a2a2a]
                        ${!n.read ? "bg-[#2a2a2a]" : ""}
                      `}
                    >
                      {n.message}
                    </div>
                  ))
                )}

              </div>
            )}
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="bg-[#8b1e3f] hover:bg-[#a8324a] px-3 py-1 rounded-lg transition"
          >
            Sair
          </button>
        </>
      )}
    </div>
  )
}
