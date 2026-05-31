import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getRPGs } from "../services/api"

type RPG = {
  id: number
  name: string
  description?: string
  banner_url?: string | null
  tags?: string[]
  participant_count?: number
}

export default function Search() {
  const [rpgs, setRpgs] = useState<RPG[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    getRPGs()
      .then(setRpgs)
      .catch(console.error)
  }, [])

  

const filteredRPGs = rpgs.filter((rpg) => {
  const searchText = normalize(search)

  const searchableContent = normalize(
    [
      rpg.name,
      rpg.description || "",
      ...(rpg.tags || []),
    ].join(" ")
  )

  return searchableContent.includes(searchText)
})
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

const sortedByPopularity = [...filteredRPGs].sort(
  (a, b) =>
    (b.participant_count || 0) -
    (a.participant_count || 0)
)

const featuredRPG = sortedByPopularity[0]
const popularRPGs = sortedByPopularity
  .filter(
    (rpg) =>
      (rpg.participant_count || 0) > 1
  )
  .slice(1, 4)
const otherRPGs = filteredRPGs.filter(
  (rpg) =>
    rpg.id !== featuredRPG?.id &&
    !popularRPGs.some((popular) => popular.id === rpg.id)
)

  return (
    <div
  className="
    relative
    max-w-7xl
    mx-auto
    p-6
    overflow-hidden
  "
>
  <div
  className="
    pointer-events-none
    absolute
    -top-40
    -left-40
    w-[500px]
    h-[500px]
    rounded-full
    bg-purple-900/10
    blur-3xl
    animate-pulse
  "
/>

<div
  className="
    pointer-events-none
    absolute
    top-[30%]
    right-[-120px]
    w-[400px]
    h-[400px]
    rounded-full
    bg-[#e0a96d]/5
    blur-3xl
  "
/>
      <div className="mb-8">
        <h2 className="title text-4xl">
          Explorar Mundos
        </h2>

        <p className="text-[#c9ada7]/70 mt-2">
          Descubra campanhas, universos e histórias criadas pela comunidade.
        </p>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Buscar mundos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              md:w-[420px]
              rounded-2xl
              border
              border-[#e0a96d]/20
              bg-black/20
              px-5
              py-3
              text-[#f2e9e4]
              placeholder:text-[#c9ada7]/40
              outline-none
              transition
              focus:border-[#e0a96d]/60
              focus:bg-black/30
            "
          />
        </div>
      </div>
    {featuredRPG && (
  <Link
    to={`/rpg/${featuredRPG.id}`}
    className="
      group
      block
      relative
      overflow-hidden
      rounded-3xl
      border
      border-[#e0a96d]/30
      bg-[#12090b]
      min-h-[320px]
      mb-8
      shadow-[0_0_35px_rgba(0,0,0,0.35)]
    "
  >
    {featuredRPG.banner_url && (
      <img
        src={`http://127.0.0.1:8001/${featuredRPG.banner_url}`}
        alt={featuredRPG.name}
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          opacity-45
          transition-transform
          duration-700
          group-hover:scale-105
        "
      />
    )}

    <div className="absolute inset-0 bg-gradient-to-r from-[#12090b] via-[#12090b]/70 to-transparent" />

    <div className="relative z-10 p-8 max-w-2xl">
      <p className="text-sm uppercase tracking-[0.3em] text-[#e0a96d]/70 mb-4">
        Mundo em destaque
      </p>

      <h3 className="text-4xl font-display text-[#e0a96d]">
        {featuredRPG.name}
      </h3>

      <p className="text-[#c9ada7]/80 mt-4 leading-relaxed">
        {featuredRPG.description || "Este mundo ainda não possui descrição."}
      </p>

      <div className="flex flex-wrap gap-2 mt-5">
        {featuredRPG.tags?.map((tag) => (
          <span key={tag} className="rpg-tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 text-[#e0a96d] font-display">
        Explorar mundo →
      </div>
    </div>
  </Link>
)}
{popularRPGs.length > 0 && (
  <div className="mb-8">
    <div className="mb-5">
      <h3 className="text-2xl font-display text-[#e0a96d]">
        🔥 Mais populares
      </h3>

      <p className="text-sm text-[#c9ada7]/60 mt-1">
        Mundos com mais jogadores ativos na comunidade.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-5">
      {popularRPGs.map((rpg) => (
        <Link
          key={rpg.id}
          to={`/rpg/${rpg.id}`}
          className="
            group
            rounded-2xl
            border
            border-[#e0a96d]/20
            bg-black/20
            p-4
            transition
            hover:border-[#e0a96d]/50
            hover:-translate-y-1
            line-clamp-5
          "
        >
          <h4 className="font-display text-xl text-[#e0a96d]">
            {rpg.name}
          </h4>

          <p className="text-sm text-[#c9ada7]/60 mt-2">
            👥 {rpg.participant_count || 0} jogadores
          </p>
          <p className="text-sm text-[#c9ada7]/70 mt-3 leading-relaxed line-clamp-5">
                {rpg.description || "Este mundo ainda não possui descrição."}
              </p>
        </Link>
      ))}
    </div>
  </div>
)}
{otherRPGs.length > 0 && (
  <div className="mb-5">
    <h3 className="text-2xl font-display text-[#e0a96d]">
      ✨ Novos mundos
    </h3>

    <p className="text-sm text-[#c9ada7]/60 mt-1">
      Explore campanhas recém-criadas pela comunidade.
    </p>
  </div>
)}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {otherRPGs.map((rpg) => (
          <Link
            to={`/rpg/${rpg.id}`}
            key={rpg.id}
            className="
  group
  block
  overflow-hidden
  rounded-2xl
  border
  border-yellow-900/30
  hover:border-[#e0a96d]/40
  bg-gradient-to-br
  from-[#241216]
  to-[#12090b]
  hover:bg-[#1a0d10]
  shadow-[0_0_20px_rgba(0,0,0,0.25)]
  transition
  duration-300
  hover:-translate-y-1
  hover:shadow-[0_0_30px_rgba(224,169,109,0.15)]
"
          >
            <div className="relative h-44 overflow-hidden">
              {rpg.banner_url ? (
                <img
                  src={`http://127.0.0.1:8001/${rpg.banner_url}`}
                  alt={rpg.name}
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                />
              ) : (
                <div className="w-full h-full bg-black/30" />
              )}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#12090b]
                  via-black/20
                  to-transparent
                "
              />
            </div>

            <div className="p-5">
              <h3 className="text-2xl font-display text-[#e0a96d]">
                {rpg.name}
              </h3>

              <p className="text-sm text-[#c9ada7]/70 mt-3 leading-relaxed line-clamp-5">
                {rpg.description || "Este mundo ainda não possui descrição."}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-[#c9ada7]/60">
  <span>👥</span>

  <span>
    {rpg.participant_count || 0} jogadores
  </span>
</div>
              <div className="flex flex-wrap gap-2 mt-4">
                {rpg.tags?.map((tag) => (
  <button
  key={tag}
  type="button"
  onClick={(e) => {
    e.preventDefault()
    setSearch(tag)
  }}
  className="
    rpg-tag
    hover:scale-105
    transition
  "
>
  {tag}
</button>
))}
              </div>
            </div>
          </Link>
        ))}

        {filteredRPGs.length === 0 && (
          <div
            className="
              col-span-full
              rounded-2xl
              border
              border-[#e0a96d]/10
              bg-black/20
              p-10
              text-center
            "
          >
            <h3 className="text-2xl font-display text-[#e0a96d]">
              Nenhum mundo encontrado
            </h3>

            <p className="text-[#c9ada7]/60 mt-3">
              Tente buscar por outro nome, tema ou universo.
            </p>
          </div>
        )}
      </div>
      <div
  className="
    relative
    mt-24
    rounded-[2rem]
    overflow-hidden
    border
    border-[#e0a96d]/10
    bg-gradient-to-br
    from-[#1a0d10]
    to-black/40
    p-12
    text-center
  "
>
  <div
    className="
      absolute
      inset-0
      bg-[radial-gradient(circle_at_top,rgba(224,169,109,0.08),transparent_60%)]
    "
  />

  <div className="relative z-10">
    <p className="text-sm tracking-[0.35em] uppercase text-[#e0a96d]/60">
      Narraverse
    </p>

    <h3 className="mt-4 text-4xl font-display text-[#e0a96d]">
      Todo mundo carrega uma história.
    </h3>

    <p className="mt-5 max-w-2xl mx-auto text-[#c9ada7]/70 leading-relaxed">
      Explore reinos esquecidos, romances impossíveis,
      conspirações políticas, guerras antigas e mundos
      criados pela imaginação da comunidade.
    </p>
  </div>
</div>
    </div>
  )
}

