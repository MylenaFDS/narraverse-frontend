import { useEffect, useState } from "react"
import { getMe } from "../services/api"
import { Link, useNavigate } from "react-router-dom"

type User = {
  id: number
  username: string
  email: string
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token")
      if (!token) return

      const data = await getMe()
      setUser(data)
    }

    loadUser()
  }, [])

  function handleLogout() {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="bg-gray-800 p-4 flex justify-between items-center">
      <Link to="/home" className="text-xl font-bold">
        Narraverse
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/search">Buscar</Link>

        {user && (
          <>
            <span className="text-sm text-gray-300">
              👤 {user.username}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Sair
            </button>
          </>
        )}
      </div>
    </div>
  )
}