import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import RPG from "./pages/RPG"
import Search from "./pages/Search"
import Navbar from "./components/Navbar"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rpg/:id" element={<RPG />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </div>
  )
}