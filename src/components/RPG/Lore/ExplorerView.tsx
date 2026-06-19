import type { RegionScene } from "../../../services/api"

type Props = {
  scene: RegionScene
  onClose: () => void
}

export default function ExplorerView({
  scene,
  onClose,
}: Props) {
  const imageUrl = scene.image_url
    ? `http://127.0.0.1:8001/${scene.image_url}`
    : null

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        bg-black
      "
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={scene.title}
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
          "
        />
      ) : (
        <div
          className="
            h-full
            flex
            items-center
            justify-center
            text-white
          "
        >
          Sem imagem
        </div>
      )}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/70
          via-transparent
          to-black/30
        "
      />

      <div
        className="
          absolute
          bottom-8
          left-8
          right-8
        "
      >
        <h1
          className="
            text-5xl
            text-[#f2e9e4]
            font-display
            mb-3
          "
        >
          {scene.title}
        </h1>

        <p
          className="
            text-lg
            text-[#f2e9e4]/80
            max-w-3xl
          "
        >
          {scene.description}
        </p>
      </div>

      <button
        onClick={onClose}
        className="
          absolute
          top-6
          right-6
          text-white
          text-2xl
        "
      >
        ✕
      </button>
    </div>
  )
}