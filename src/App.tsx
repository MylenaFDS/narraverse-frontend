import { Routes, Route, Navigate } from "react-router-dom"

import Layout from "./components/Layout"
import PrivateRoute from "./components/PrivateRoute"


import RPG from "./pages/RPG"
import Search from "./pages/Search"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import PublicProfile from "./pages/PublicProfile"

export default function App() {
  return (
    <Routes>
      {/* públicas */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* privadas */}
      <Route element={<PrivateRoute />}>
        {/* layout persistente */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Navigate
                to="/home"
                replace
              />
            }
          />

         

          <Route
            path="/search"
            element={<Search />}
          />

          <Route
            path="/rpg/:id"
            element={<RPG />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />
          <Route
            path="/profile/:id"
            element={<PublicProfile />}
          />
        </Route>
      </Route>
    </Routes>
  )
}