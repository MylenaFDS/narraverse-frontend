export default function Search() {
  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="mb-8">
        <h2 className="title text-4xl">
          Explorar Mundos
        </h2>

        <p className="text-[#c9ada7]/70 mt-2">
          Descubra campanhas, universos e histórias criadas pela comunidade.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        <div
          className="
          group
            overflow-hidden
            rounded-2xl
            border
            border-yellow-900/30
            bg-gradient-to-br
            from-[#241216]
            to-[#12090b]
            shadow-[0_0_20px_rgba(0,0,0,0.25)]
          "
        >

          <div className="relative h-44 overflow-hidden">

  <img
    src="URL_DO_BANNER"
    alt="Império das Sombras"
    className="
      w-full
      h-full
      object-cover
      transition-transform
      duration-500
      group-hover:scale-105
    "
  />

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
              Império das Sombras
            </h3>

            <p className="text-sm text-[#c9ada7]/70 mt-3 leading-relaxed">
              Um reino mergulhado em conspirações,
              magia proibida e guerras silenciosas.
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
        </div>

      </div>
    </div>
  )
}

