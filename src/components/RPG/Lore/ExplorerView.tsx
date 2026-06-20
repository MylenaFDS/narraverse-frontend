import { useEffect, useState } from "react"

import {
  getSceneLocations,
  getRegionSceneById,
  type RegionScene,
  type SceneLocation,
} from "../../../services/api"

type Props = {
  scene: RegionScene
  onClose: () => void
}

export default function ExplorerView({
  scene,
  onClose,
}: Props) {
  const [currentScene, setCurrentScene] =
    useState(scene)

  const [locations, setLocations] =
    useState<SceneLocation[]>([])

  const [isTransitioning, setIsTransitioning] =
    useState(false)

  const [showUI, setShowUI] =
    useState(true)

  useEffect(() => {
    getSceneLocations(currentScene.id)
      .then(setLocations)
      .catch(console.error)
  }, [currentScene.id])

  useEffect(() => {
  const showTimer = setTimeout(() => {
    setShowUI(true)
  }, 0)

  const hideTimer = setTimeout(() => {
    setShowUI(false)
  }, 3000)

  return () => {
    clearTimeout(showTimer)
    clearTimeout(hideTimer)
  }
}, [currentScene.id])

  const imageUrl = currentScene.image_url
    ? `http://127.0.0.1:8001/${currentScene.image_url}`
    : null

  async function handleLocationClick(
    location: SceneLocation
  ) {
    if (!location.target_scene_id) return

    setIsTransitioning(true)

    try {
      const nextScene =
        await getRegionSceneById(
          location.target_scene_id
        )

      setCurrentScene(nextScene)

      setTimeout(() => {
        setIsTransitioning(false)
      }, 200)
    } catch (err) {
      console.error(err)
      setIsTransitioning(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black"
      onMouseMove={() => setShowUI(true)}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={currentScene.title}
          className={`
            absolute
            inset-0
            w-full
            h-full
            object-cover
            transition-transform
            duration-700
            ${
              isTransitioning
                ? "scale-125"
                : "scale-100"
            }
          `}
        />
      ) : (
        <div className="h-full flex items-center justify-center text-white">
          Sem imagem
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {locations.map((location) => (
        <button
          key={location.id}
          type="button"
          disabled={!location.target_scene_id}
          onClick={() =>
            handleLocationClick(location)
          }
          style={{
            left: `${location.pos_x}%`,
            top: `${location.pos_y}%`,
          }}
          className="
            group
            absolute
            -translate-x-1/2
            -translate-y-1/2
            flex
            flex-col
            items-center
            gap-2
            transition
            disabled:opacity-60
            disabled:cursor-default
          "
          title={location.description || location.name}
        >
          <span className="relative flex items-center justify-center">
            <span
              className="
                absolute
                w-8
                h-8
                rounded-full
                border-2
                border-[#e0a96d]
                animate-ping
              "
            />

            <span
              className="
                relative
                w-4
                h-4
                rounded-full
                bg-[#e0a96d]
                shadow-[0_0_25px_rgba(224,169,109,1)]
                group-hover:scale-125
                transition
              "
            />
          </span>

          <span
            className="
              opacity-0
              group-hover:opacity-100
              translate-y-1
              group-hover:translate-y-0
              transition
              px-3
              py-1
              rounded-full
              bg-black/70
              border
              border-[#e0a96d]/40
              text-[#f2e9e4]
              text-xs
              whitespace-nowrap
              pointer-events-none
            "
          >
            {location.name}
          </span>
        </button>
      ))}

      <div
        className={`
          absolute
          bottom-8
          left-8
          right-8
          transition-opacity
          duration-500
          ${
            showUI
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      >
        <h1 className="text-5xl text-[#f2e9e4] font-display mb-3">
          {currentScene.title}
        </h1>

        <p className="text-lg text-[#f2e9e4]/80 max-w-3xl">
          {currentScene.description}
        </p>
      </div>

      <div
        className={`
          absolute
          inset-0
          bg-black
          pointer-events-none
          transition-opacity
          duration-300
          ${
            isTransitioning
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      />

      <button
        onClick={onClose}
        className={`
          absolute
          top-6
          right-6
          text-white
          text-2xl
          transition-opacity
          duration-500
          ${
            showUI
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      >
        ✕
      </button>
    </div>
  )
}