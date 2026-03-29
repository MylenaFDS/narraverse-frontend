import { useState } from "react"
import { login } from "../services/api"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleLogin() {
    const data = await login(email, password)

    if (data.access_token) {
      localStorage.setItem("token", data.access_token)
      navigate("/home")
    } else {
      alert("Erro ao fazer login")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="title mb-4">Login</h2>

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

      <button onClick={handleLogin} className="btn w-full">
        Entrar
      </button>

      <p className="mt-4 text-sm text-[#c9ada7]">
        Não tem conta?{" "}
        <Link to="/register" className="text-[#e0a96d]">
          Cadastre-se
        </Link>
      </p>
    </div>
  )
}