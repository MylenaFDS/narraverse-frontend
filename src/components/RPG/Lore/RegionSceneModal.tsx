import { useState } from "react"
import type { RegionScene } from "../../../services/api"
import ExplorerView from "./ExplorerView"

type Props = {
  scene: RegionScene | null
  onClose: () => void
}

export default function RegionSceneModal({
  scene,
  onClose,
}: Props) {
  const [isExploring, setIsExploring] =
    useState(false)

  if (!scene) return null

  if (isExploring) {
    return (
      <ExplorerView
        scene={scene}
        onClose={() =>
          setIsExploring(false)
        }
      />
    )
  }

  function getImageUrl(
    imageUrl?: string | null
  ) {
    if (!imageUrl) return null

    if (imageUrl.startsWith("http")) {
      return imageUrl
    }

    return `http://127.0.0.1:8001/${imageUrl}`
  }

  const imageUrl = getImageUrl(scene.image_url)

  return (
    <div
      className="
        fixed
        inset-0
        z-[80]
        bg-black/90
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-6
      "
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          w-full
          max-w-6xl
          max-h-[90vh]
          overflow-y-auto
          rounded-3xl
          border
          border-[#e0a96d]/30
          bg-[#12090b]
          shadow-[0_0_50px_rgba(0,0,0,0.8)]
        "
      >
        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-5
            top-5
            z-20
            text-[#f2e9e4]
            hover:text-[#e0a96d]
            text-xl
          "
        >
          ✕
        </button>

        {imageUrl ? (
          <div className="relative">
            <img
              src={imageUrl}
              alt={scene.title}
              className="
                w-full
                max-h-[70vh]
                object-cover
                rounded-t-3xl
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-[#12090b]
                via-transparent
                to-black/20
              "
            />
          </div>
        ) : (
          <div
            className="
              h-[420px]
              flex
              items-center
              justify-center
              text-[#c9ada7]/60
              bg-black/40
              rounded-t-3xl
            "
          >
            Nenhuma imagem adicionada a esta cena.
          </div>
        )}

        <div className="p-6">
          <h2
            className="
              text-3xl
              font-display
              text-[#e0a96d]
              mb-3
            "
          >
            🖼️ {scene.title}
          </h2>

          {scene.description && (
            <p
              className="
                text-[#c9ada7]
                leading-relaxed
                whitespace-pre-wrap
                mb-5
              "
            >
              {scene.description}
            </p>
          )}

          <div className="flex gap-3">
            <button
  type="button"
  onClick={() =>
    setIsExploring(true)
  }
  className="
    bg-[#e0a96d]
    text-black
    px-5
    py-3
    rounded-xl
    font-semibold
    hover:brightness-110
    transition
  "
>
  Explorar
</button>

            <button
              type="button"
              onClick={onClose}
              className="
                bg-red-600
                px-5
                py-3
                rounded-xl
                font-semibold
                hover:bg-red-500
                transition
              "
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 