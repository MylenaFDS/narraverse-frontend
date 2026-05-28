import { useState } from "react"
import { login, getMe } from "../services/api"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleLogin() {
  try {
    // 🔥 limpa sessão antiga ANTES de logar
    localStorage.clear()

    const data = await login(email, password)

    if (!data.access_token) {
      alert("Login falhou")
      return
    }

    // ✅ salva tokens
    localStorage.setItem("token", data.access_token)
    localStorage.setItem("refresh_token", data.refresh_token)

    const user = await getMe()

    if (!user) {
      throw new Error("Erro ao buscar usuário")
    }

    localStorage.setItem("user_id", String(user.id))

    console.log("USER LOGADO:", user.id)

    navigate("/search")
  } catch (err) {
    console.error(err)
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