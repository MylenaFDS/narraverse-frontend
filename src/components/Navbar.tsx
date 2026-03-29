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
    <div className="flex gap-4 items-center text-[#c9ada7]">

      <Link to="/search" className="hover:text-[#e0a96d] transition">
        Buscar
      </Link>

      {user && (
        <>
          <Link to="/profile" className="hover:text-[#e0a96d] transition">
            Perfil
          </Link>

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