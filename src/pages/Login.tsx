import { useState } from "react"
import { login } from "../services/api"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

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
    <div className="max-w-md mx-auto mt-20 text-white">
      <h2 className="text-2xl mb-4">Login</h2>

      <input
        placeholder="Email"
        className="w-full p-2 mb-2 bg-gray-800 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        className="w-full p-2 mb-2 bg-gray-800 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="w-full bg-purple-600 py-2 rounded"
      >
        Entrar
      </button>
      <p className="mt-4 text-sm text-gray-400">
  Não tem conta?{" "}
  <Link to="/register" className="text-purple-400">
    Cadastre-se
  </Link>
</p>
<p className="mt-2 text-sm text-gray-400 cursor-pointer">
  Esqueceu a senha?
</p>
    </div>
  )
}