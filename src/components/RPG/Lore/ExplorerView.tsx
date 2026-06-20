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

  useEffect(() => {
    getSceneLocations(currentScene.id)
      .then(setLocations)
      .catch(console.error)
  }, [currentScene.id])

  const imageUrl = currentScene.image_url
    ? `http://127.0.0.1:8001/${currentScene.image_url}`
    : null

  async function handleLocationClick(
    location: SceneLocation
  ) {
    if (!location.target_scene_id) return

    const nextScene =
      await getRegionSceneById(
        location.target_scene_id
      )

    setCurrentScene(nextScene)
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={currentScene.title}
          className="absolute inset-0 w-full h-full object-cover"
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
            absolute
            -translate-x-1/2
            -translate-y-1/2
            px-3
            py-2
            rounded-full
            bg-black/60
            border
            border-[#e0a96d]/50
            text-[#f2e9e4]
            text-sm
            hover:bg-[#e0a96d]
            hover:text-black
            transition
            disabled:opacity-60
            disabled:cursor-default
          "
          title={location.description || location.name}
        >
          🏠 {location.name}
        </button>
      ))}

      <div className="absolute bottom-8 left-8 right-8">
        <h1 className="text-5xl text-[#f2e9e4] font-display mb-3">
          {currentScene.title}
        </h1>

        <p className="text-lg text-[#f2e9e4]/80 max-w-3xl">
          {currentScene.description}
        </p>
      </div>

      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-2xl"
      >
        ✕
      </button>
    </div>
  )
}