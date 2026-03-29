import type { ReactNode } from "react"
import Navbar from "./Navbar"
import { Link } from "react-router-dom"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#1a0f12] text-[#f5e9e2]">

      {/* HEADER */}
      <header className="border-b border-[#3a1f24] bg-[#2a1519] px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-display text-[#e0a96d]">
          <Link to="/home">Narraverse</Link>
        </h1>

        <Navbar />
      </header>

      {/* CONTEÚDO */}
      <main className="p-6 max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  )
}