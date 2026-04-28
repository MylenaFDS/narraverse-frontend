import { Routes, Route, Navigate } from "react-router-dom"

import Layout from "./components/Layout"
import PrivateRoute from "./components/PrivateRoute"

import Home from "./pages/Home"
import RPG from "./pages/RPG"
import Search from "./pages/Search"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"


export default function App() {
  return (
    <Layout>
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
    </Layout>
  )
}