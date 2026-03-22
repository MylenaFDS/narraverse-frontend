import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between">
      <h1 className="font-bold text-xl text-purple-400">
        Narraverse
      </h1>

      <div className="flex gap-4">
        <Link to="/" className="hover:text-purple-400">Home</Link>
        <Link to="/search" className="hover:text-purple-400">Buscar</Link>
      </div>
    </nav>
  )
}