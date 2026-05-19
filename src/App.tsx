import { Routes, Route, Navigate, Outlet } from "react-router-dom"

import Layout from "./components/Layout"
import PrivateRoute from "./components/PrivateRoute"

import Home from "./pages/Home"
import RPG from "./pages/RPG"
import Search from "./pages/Search"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"

// 🔥 wrapper do layout privado
function ProtectedLayout() {
  return (
    <PrivateRoute>
      <Layout>
        <Outlet />
      </Layout>
    </PrivateRoute>
  )
}

export default function App() {
  return (
    <Routes>
      {/* públicas */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* privadas */}
      <Route element={<ProtectedLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/rpg/:id" element={<RPG />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}