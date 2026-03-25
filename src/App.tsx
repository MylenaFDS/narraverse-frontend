import { Routes, Route, useLocation, Navigate } from "react-router-dom"

import Home from "./pages/Home"
import RPG from "./pages/RPG"
import Search from "./pages/Search"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"

import Navbar from "./components/Navbar"
import PrivateRoute from "./components/PrivateRoute"

export default function App() {
  const location = useLocation()

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register"

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {!hideNavbar && <Navbar />}

      <div className="p-4">
        <Routes>
          {/* públicas */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* protegidas */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/search"
            element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            }
          />

          <Route
            path="/rpg/:id"
            element={
              <PrivateRoute>
                <RPG />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  )
}