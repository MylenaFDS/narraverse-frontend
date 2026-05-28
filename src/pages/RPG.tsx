import {
  useParams,
  useLocation,
} from "react-router-dom"
import { useState, useEffect } from "react"

import Turns from "../components/RPG/Turns"
import Chat from "../components/RPG/Chat"
import Lore from "../components/RPG/Lore/Lore"
import RPGSheets from "../components/RPG/RPGSheets"
import { getRPG, uploadRPGBanner } from "../services/api"

type Tab =
  | "turns"
  | "chat"
  | "characters"
  | "lore"

type RPGType = {
  id: number
  name: string
  description?: string
  owner_id: number
  banner_url?: string | null
}
export default function RPG() {
  const { id } = useParams()
  const location = useLocation()

  const rpgId = Number(id)

  const [activeTab, setActiveTab] =
  useState<Tab>(() =>
    location.hash.startsWith("#turn-")
      ? "turns"
      : "lore"
  )

  const urlTab = new URLSearchParams(
  location.search
).get("tab")

const currentTab: Tab =
  urlTab === "chat"
    ? "chat"
    : urlTab === "lore"
      ? "lore"
      : location.hash.startsWith("#turn-")
        ? "turns"
        : activeTab
        
  const [rpg, setRpg] =
    useState<RPGType | null>(null)
  const [bannerFile, setBannerFile] =
  useState<File | null>(null)

  const isValid =
    id && !isNaN(rpgId)
  const loggedUserId = Number(
  localStorage.getItem("user_id")
)

const isOwner = rpg?.owner_id === loggedUserId
  useEffect(() => {
    if (!isValid) return

    getRPG(rpgId)
      .then(setRpg)
      .catch(() => setRpg(null))
  }, [rpgId, isValid])



  if (!isValid) {
    return <div>RPG inválido</div>
  }

  if (!rpg) {
    return <div>Carregando RPG...</div>
  }

  function tabClass(tab: Tab) {
    return `
      px-3 py-1 rounded transition
      ${
        currentTab === tab
          ? "bg-[#e0a96d] text-black"
          : "hover:bg-[#2a2a2a]"
      }
    `
  }

  async function handleUploadBanner() {
  if (!bannerFile) return

  const updated = await uploadRPGBanner(
    rpgId,
    bannerFile
  )

  setRpg(updated)
  setBannerFile(null)
}

  return (
    <div className="rpg-bg min-h-screen p-6">

      {/* HEADER */}
      <div
  className="
    rpg-panel
    max-w-5xl
    mx-auto
    mb-6
    relative
    overflow-hidden
  "
>{rpg.banner_url && (
  <div className="absolute inset-0">
    <img
      src={`http://127.0.0.1:8001/${rpg.banner_url}`}
      alt={rpg.name}
      className="
        w-full
        h-full
        object-cover
        opacity-25
        blur-sm
        scale-105
      "
    />

    <div
      className="
        absolute
        inset-0
        bg-gradient-to-b
        from-black/30
        via-[#12090b]/70
        to-[#12090b]
      "
    />
  </div>
)}
<div className="relative z-10">
        <div className="text-xl font-bold font-display text-[#e0a96d]">
          <h2>{rpg.name}</h2>
          {isOwner && (
  <div className="mt-4 flex flex-wrap gap-3 items-center">
    <label
      className="
        cursor-pointer
        rounded-xl
        border
        border-[#e0a96d]/30
        bg-black/25
        px-4
        py-2
        text-sm
        text-[#e0a96d]
        hover:bg-[#e0a96d]/10
        transition
      "
    >
      Escolher banner

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setBannerFile(
            e.target.files?.[0] ?? null
          )
        }
        className="hidden"
      />
    </label>

    {bannerFile && (
      <span className="text-xs text-[#c9ada7]/70">
        {bannerFile.name}
      </span>
    )}

    <button
      type="button"
      onClick={handleUploadBanner}
      disabled={!bannerFile}
      className="
        rpg-btn
        disabled:opacity-40
        disabled:cursor-not-allowed
      "
    >
      Salvar banner
    </button>
  </div>
)}
        </div>

        {/* ABAS */}
        <div className="flex gap-3 mt-4 text-xl font-display text-[#e0a96d]">

          <button
            onClick={() =>
              setActiveTab("lore")
            }
            className={tabClass("lore")}
          >
            Enciclopédia
          </button>

          <button
            onClick={() =>
              setActiveTab("characters")
            }
            className={tabClass(
              "characters"
            )}
          >
            Fichas
          </button>

          <button
            onClick={() =>
              setActiveTab("turns")
            }
            className={tabClass(
              "turns"
            )}
          >
            Turnos
          </button>

          <button
            onClick={() =>
              setActiveTab("chat")
            }
            className={tabClass(
              "chat"
            )}
          >
            Chat
          </button>
        </div>
</div>
      </div>

      {/* LAYOUT */}
      <div className="rpg-layout max-w-5xl mx-auto">

        <div className="rpg-panel min-w-0 overflow-hidden">

          {/* LORE */}
          <div
            style={{
              display:
                currentTab ===
                "lore"
                  ? "block"
                  : "none",
            }}
          >
            <Lore rpgId={rpgId} />
          </div>

          {/* FICHAS */}
          <div
            style={{
              display:
                currentTab ===
                "characters"
                  ? "block"
                  : "none",
            }}
          >
            <RPGSheets
              rpgId={rpgId}
            />
          </div>

          {/* TURNOS */}
          <div
            style={{
              display:
                currentTab ===
                "turns"
                  ? "block"
                  : "none",
            }}
          >
            <Turns
  rpgId={rpgId}
  rpgOwnerId={rpg.owner_id}
/>
          </div>

          {/* CHAT */}
          <div
            style={{
              display:
                currentTab ===
                "chat"
                  ? "block"
                  : "none",
            }}
          >
            <Chat rpgId={rpgId} />
          </div>

        </div>

        {/* SIDEBAR */}
        <div className="rpg-sidebar">

          <div className="rpg-panel text-xl font-display text-[#e0a96d]">
            Jogadores
          </div>

          <div className="rpg-panel text-xl font-display text-[#e0a96d]">
            Anotações
          </div>

        </div>

      </div>
    </div>
  )
}