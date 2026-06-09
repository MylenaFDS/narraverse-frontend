import {
  useParams,
  useLocation,
} from "react-router-dom"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Turns from "../components/RPG/Turns"
import Chat from "../components/RPG/Chat"
import Lore from "../components/RPG/Lore/Lore"
import RPGSheets from "../components/RPG/RPGSheets"
import PublicCharacterOverlay from "../components/RPG/PublicCharacterOverlay"
import RPGNotes
from "../components/RPG/RPGNotes"
import { getRPG, uploadRPGBanner, getRPGPlayers, getRPGStats, getPendingRequests, updateParticipantStatus, requestToJoinRPG,getSentInvites,
cancelSentInvite,} from "../services/api"
import {getPublicRPGCharacters} from "../services/characters"

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
  tags?: string[]
}

type JoinRequest = {
  user_id: number
  username?: string
  status: string
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
  const [players, setPlayers] = useState<
  {
    id: number
    username: string
    is_owner?: boolean
  }[]
>([])
const [onlineUsers, setOnlineUsers] =
  useState<number[]>([])

  const [stats, setStats] = useState({
  players: 0,
  turns: 0,
  lore: 0,
  characters: 0,
})

const [joinRequests, setJoinRequests] =
  useState<JoinRequest[]>([])
  const [joinRequested, setJoinRequested] =
  useState(false)
  const [publicCharacters, setPublicCharacters] =
  useState<
    {
      id: number
      name: string
      image_url?: string | null
      user_id: number
    }[]
  >([])

  const [publicCharacterId, setPublicCharacterId] =
  useState<number | null>(null)

  type SentInvite = {
  id: number
  status: string

  user: {
    id: number
    username: string
  }
}

const [sentInvites, setSentInvites] =
  useState<SentInvite[]>([])

  const isValid =
    id && !isNaN(rpgId)
  const loggedUserId = Number(
  localStorage.getItem("user_id")
)

const isOwner = rpg?.owner_id === loggedUserId
  useEffect(() => {
  if (!isValid) return

  getRPG(rpgId)
    .then((data) => {
      setRpg(data)

      if (data.is_owner) {
        getSentInvites(rpgId)
          .then(setSentInvites)
          .catch(console.error)
      }
    })
    .catch(() => setRpg(null))

}, [rpgId, isValid])

useEffect(() => {
  if (!isValid) return

  getRPGPlayers(rpgId)
    .then((data) => {
      setPlayers(data)

      const loggedUserId = Number(
        localStorage.getItem("user_id")
      )

      setOnlineUsers([loggedUserId])
    })
    .catch(console.error)

  getRPGStats(rpgId)
    .then((data) => {
      setStats(
        data ?? {
          players: 0,
          turns: 0,
          lore: 0,
          characters: 0,
        }
      )
    })
    .catch(console.error)
}, [rpgId, isValid])

  useEffect(() => {
  if (!isValid || !isOwner) return

  getPendingRequests(rpgId)
    .then(setJoinRequests)
    .catch(console.error)

}, [rpgId, isValid, isOwner])

useEffect(() => {
  if (!isValid) return

  getPublicRPGCharacters(rpgId)
    .then(setPublicCharacters)
    .catch(console.error)

}, [rpgId, isValid])

  if (!isValid) {
    return <div>RPG inválido</div>
  }

  if (!rpg) {
    return <div>Carregando RPG...</div>
  }

  console.log(rpg)

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

async function handleRequest(
  userId: number,
  status: "accepted" | "rejected"
) {
  await updateParticipantStatus(
    rpgId,
    userId,
    status
  )

  setJoinRequests((prev) =>
    prev.filter((request) =>
      request.user_id !== userId
    )
  )

  getRPGPlayers(rpgId)
    .then(setPlayers)
    .catch(console.error)
}

async function handleRequestToJoin() {
  try {
    await requestToJoinRPG(rpgId)
    setJoinRequested(true)
  } catch (err) {
    console.error(err)
  }
}

const isParticipant = players.some(
  (player) => player.id === loggedUserId
)

const canRequestJoin =
  !isOwner && !isParticipant

  async function handleCancelInvite(
  userId: number
) {
  await cancelSentInvite(
    rpgId,
    userId
  )

  setSentInvites((prev) =>
    prev.filter(
      (invite) =>
        invite.user.id !== userId
    )
  )
}

  return (
    <div className="rpg-bg min-h-screen p-6">

      {/* HERO DO RPG */}
<div
  className="
    relative
    max-w-5xl
    mx-auto
    mb-8
    min-h-[320px]
    overflow-hidden
    rounded-3xl
    border
    border-[#e0a96d]/25
    bg-[#12090b]
    shadow-[0_0_35px_rgba(0,0,0,0.35)]
  "
>{rpg.banner_url && (
  <img
    src={`http://127.0.0.1:8001/${rpg.banner_url}`}
    alt={rpg.name}
    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
      opacity-40
    "
  />
)}

<div
  className="
    absolute
    inset-0
    bg-gradient-to-r
    from-[#12090b]
    via-[#12090b]/75
    to-transparent
  "
/>

<div
  className="
    absolute
    inset-0
    bg-gradient-to-t
    from-[#12090b]
    via-transparent
    to-transparent
  "
/>
<div className="relative z-10 p-8">
  <p className="text-xs uppercase tracking-[0.35em] text-[#e0a96d]/60 mb-4">
    Mundo narrativo
  </p>
        <div className="text-xl font-bold font-display text-[#e0a96d]">
          <h1 className="text-4xl font-display text-[#e0a96d]">
    {rpg.name}
  </h1>
  {rpg.description && (
  <p
  className="
    mt-4
    max-w-2xl
    text-sm md:text-base
    text-[#c9ada7]/80
    leading-relaxed
    line-clamp-3
  "
>
  {rpg.description}
</p>
)}

{rpg.tags && rpg.tags.length > 0 && (
  <div className="flex flex-wrap gap-2 mt-5">
    {rpg.tags.map((tag) => (
      <span
        key={tag}
        className="
  px-3 py-1
  rounded-full
  border
  border-[#e0a96d]/20
  bg-black/35
  text-xs
  text-[#f2e9e4]/90
  backdrop-blur-sm
"
      >
        {tag}
      </span>
    ))}
  </div>
)}
{canRequestJoin && (
  <button
    type="button"
    onClick={handleRequestToJoin}
    disabled={joinRequested}
    className="rpg-btn mt-5 disabled:opacity-50"
  >
    {joinRequested
      ? "Pedido enviado"
      : "Pedir entrada"}
  </button>
)}
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
            <Lore
  rpgId={rpgId}
  setPublicCharacterId={setPublicCharacterId}
/>
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

          <div className="rpg-panel">
  <h3 className="text-xl font-display text-[#e0a96d] mb-4">
    Jogadores
  </h3>

  {players.length > 0 ? (
    <div className="space-y-2">
      {players.map((player) => (
        <div
  key={player.id}
  className="
  rounded-xl
  border
  border-[#e0a96d]/10
  bg-black/20
  px-3
  py-2
  text-[#f2e9e4]
  flex
  items-center
  justify-between
"
>
   <div className="flex items-center gap-2">
  <span
    className={`
      w-2
      h-2
      rounded-full
      ${
        onlineUsers.includes(player.id)
          ? "bg-green-400"
          : "bg-[#c9ada7]/30"
      }
    `}
  />

  {player.is_owner && (
    <span className="text-yellow-400">
      👑
    </span>
  )}

  <Link
  to={`/profile/${player.id}`}
  className="
    hover:text-[#e0a96d]
    transition
  "
>
  {player.username}
</Link>
</div>
</div>
      ))}
    </div>
  ) : (
    <p className="text-[#c9ada7]/60">
      Nenhum jogador encontrado.
    </p>
  )}
</div>
<div className="rpg-panel">
  <h3 className="text-xl font-display text-[#e0a96d] mb-4">
    Personagens
  </h3>

  {publicCharacters.length > 0 ? (
    <div className="space-y-2">
      {publicCharacters.slice(0, 6).map((char) => (
        <div
          key={char.id}
          className="
            rounded-xl
            border
            border-[#e0a96d]/10
            bg-black/20
            px-3
            py-2
            text-[#f2e9e4]
          "
        >
          <button
  type="button"
  onClick={() =>
    setPublicCharacterId(char.id)
  }
  className="
    hover:text-[#e0a96d]
    transition
  "
>
  {char.name}
</button>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-[#c9ada7]/60">
      Nenhum personagem criado ainda.
    </p>
  )}
</div>
{isOwner && (
  <div className="rpg-panel">
    <h3 className="text-xl font-display text-[#e0a96d] mb-4">
      Pedidos de entrada
    </h3>

    {joinRequests.length > 0 ? (
      <div className="space-y-3">
        {joinRequests.map((request) => (
          <div
            key={request.user_id}
            className="
              rounded-xl
              border
              border-[#e0a96d]/10
              bg-black/20
              p-3
            "
          >
            <p className="text-[#f2e9e4] mb-3">
              {request.username || `Usuário #${request.user_id}`}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  handleRequest(
                    request.user_id,
                    "accepted"
                  )
                }
                className="rpg-btn text-sm px-3 py-1"
              >
                Aceitar
              </button>

              <button
                type="button"
                onClick={() =>
                  handleRequest(
                    request.user_id,
                    "rejected"
                  )
                }
                className="
                  rounded-lg
                  border
                  border-red-900/40
                  px-3
                  py-1
                  text-sm
                  text-red-300
                  hover:bg-red-950/30
                  transition
                "
              >
                Recusar
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-[#c9ada7]/60">
        Nenhum pedido pendente.
      </p>
      
    )}
        <div className="mt-6 border-t border-[#e0a96d]/10 pt-4">
      <h4 className="text-lg font-display text-[#e0a96d] mb-3">
        Convites enviados
      </h4>

      {sentInvites.length > 0 ? (
        <div className="space-y-3">
          {sentInvites.map((invite) => (
            <div
              key={invite.id}
              className="
                rounded-xl
                border
                border-[#e0a96d]/10
                bg-black/20
                p-3
              "
            >
              <p className="text-[#f2e9e4]">
                👤 {invite.user.username}
              </p>

              <p className="text-xs text-[#c9ada7]/60 mt-1">
                ⏳ Aguardando resposta
              </p>

              <button
                type="button"
                onClick={() =>
                  handleCancelInvite(
                    invite.user.id
                  )
                }
                className="
                  mt-3
                  rounded-lg
                  border
                  border-red-900/40
                  px-3
                  py-1
                  text-xs
                  text-red-300
                  hover:bg-red-950/30
                  transition
                "
              >
                Cancelar convite
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#c9ada7]/60">
          Nenhum convite enviado.
        </p>
      )}
    </div>
  </div>
)}
<div className="rpg-panel">
  <h3 className="text-xl font-display text-[#e0a96d] mb-4">
    Estatísticas
  </h3>

  <div className="space-y-2 text-[#f2e9e4]">
    <p>👥 {stats?.players ?? 0} jogadores</p>
<p>📝 {stats?.turns ?? 0} turnos</p>
<p>📚 {stats?.lore ?? 0} artigos</p>
<p>🧙 {stats?.characters ?? 0} personagens</p>
  </div>
</div>
          <RPGNotes
  rpgId={rpgId}
  isOwner={isOwner}
/>

        </div>

      </div>
      {publicCharacterId && (
  <PublicCharacterOverlay
    characterId={publicCharacterId}
    onClose={() =>
      setPublicCharacterId(null)
    }
  />
)}
    </div>
  )
}