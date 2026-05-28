import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getRPGs } from "../services/api"

type RPG = {
  id: number
  name: string
  description?: string
  banner_url?: string | null
}

export default function Search() {
  const [rpgs, setRpgs] = useState<RPG[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    getRPGs()
      .then(setRpgs)
      .catch(console.error)
  }, [])

  

const filteredRPGs = rpgs.filter((rpg) =>
  normalize(rpg.name).includes(
    normalize(search)
  )
)
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}
  return (
    <div className="max-w-7xl mx-auto p-6">
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

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRPGs.map((rpg) => (
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
              bg-gradient-to-br
              from-[#241216]
              to-[#12090b]
              shadow-[0_0_20px_rgba(0,0,0,0.25)]
              transition
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

              <p className="text-sm text-[#c9ada7]/70 mt-3 leading-relaxed">
                {rpg.description || "Este mundo ainda não possui descrição."}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="rpg-tag">
                  Fantasia Sombria
                </span>

                <span className="rpg-tag">
                  Política
                </span>
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
    </div>
  )
}

