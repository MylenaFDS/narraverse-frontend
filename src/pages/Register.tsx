import { useState } from "react"
import { register } from "../services/api"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  async function handleRegister() {
    await register(username, email, password)
    navigate("/login")
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="title mb-4">Criar conta</h2>

      <input
        placeholder="Username"
        className="w-full p-3 mb-2 bg-[#2a1519] border border-[#3a1f24] rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Email"
        className="w-full p-3 mb-2 bg-[#2a1519] border border-[#3a1f24] rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        className="w-full p-3 mb-2 bg-[#2a1519] border border-[#3a1f24] rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister} className="btn w-full">
        Registrar
      </button>
    </div>
  )
}