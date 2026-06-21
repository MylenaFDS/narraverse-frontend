import { useEffect, useState } from "react"

import {
  getSceneLocations,
  getRegionSceneById,
  createSceneLocation,
  getRegionScenes,
  createRegionScene,
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

  const [sceneHistory, setSceneHistory] =
  useState<RegionScene[]>([])

  const [locations, setLocations] =
    useState<SceneLocation[]>([])

  const [isTransitioning, setIsTransitioning] =
    useState(false)

  const [showUI, setShowUI] =
    useState(true)

  const [isEditing, setIsEditing] =
  useState(false)

  const [newLocationPos, setNewLocationPos] =
  useState<{
    x: number
    y: number
  } | null>(null)

  const [newLocationName, setNewLocationName] =
  useState("")

const [
  newLocationDescription,
  setNewLocationDescription,
] = useState("")

const [availableScenes, setAvailableScenes] =
  useState<RegionScene[]>([])

const [
  selectedTargetSceneId,
  setSelectedTargetSceneId,
] = useState<number | "new" | null>(null)

  const [createNewScene, setCreateNewScene] =
  useState(false)

const [newSceneTitle, setNewSceneTitle] =
  useState("")

const [newSceneDescription, setNewSceneDescription] =
  useState("")

  useEffect(() => {
  getSceneLocations(currentScene.id)
    .then(setLocations)
    .catch(console.error)
}, [currentScene.id])

useEffect(() => {
  async function loadScenes() {
    const scenes =
      await getRegionScenes(
        currentScene.lore_id
      )

    setAvailableScenes(scenes)
  }

  loadScenes()
}, [currentScene.lore_id])

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

      setSceneHistory((prev) => [
  ...prev,
  currentScene,
])

      setCurrentScene(nextScene)

      setTimeout(() => {
        setIsTransitioning(false)
      }, 200)
    } catch (err) {
      console.error(err)
      setIsTransitioning(false)
    }
  }
function handleBack() {
  const previousScene =
    sceneHistory[sceneHistory.length - 1]

  if (!previousScene) return

  setCurrentScene(previousScene)

  setSceneHistory((prev) =>
    prev.slice(0, -1)
  )
}
const scenePath = [
  ...sceneHistory,
  currentScene,
]

function handleSceneClick(
  e: React.MouseEvent<HTMLDivElement>
) {
  if (!isEditing) return

  const rect =
    e.currentTarget.getBoundingClientRect()

  const x =
    ((e.clientX - rect.left)
      / rect.width) * 100

  const y =
    ((e.clientY - rect.top)
      / rect.height) * 100
  setNewLocationPos({
  x,
  y,
})
  console.log(
    "NOVO HOTSPOT",
    x,
    y
  )
}

async function handleSaveLocation() {
  let targetSceneId: number | null = null

if (selectedTargetSceneId === "new") {
  if (!newSceneTitle.trim()) {
    alert("Digite o título da nova cena.")
    return
  }

  const newScene = await createRegionScene(
    currentScene.lore_id,
    {
      title: newSceneTitle,
      description: newSceneDescription,
    }
  )

  targetSceneId = newScene.id

  setAvailableScenes((prev) => [
    ...prev,
    newScene,
  ])
} else {
  targetSceneId = selectedTargetSceneId
}
  if (!newLocationPos) return

  if (!newLocationName.trim()) {
    alert("Digite um nome para o hotspot.")
    return
  }

  const created = await createSceneLocation(
    currentScene.id,
    {
      name: newLocationName,
      description: newLocationDescription,
      pos_x: Math.round(newLocationPos.x),
      pos_y: Math.round(newLocationPos.y),
      target_scene_id:
  targetSceneId,
    }
  )

  setLocations((prev) => [
    ...prev,
    created,
  ])

  setNewLocationPos(null)
setNewLocationName("")
setNewLocationDescription("")

setSelectedTargetSceneId(null)

setCreateNewScene(false)
setNewSceneTitle("")
setNewSceneDescription("")

setIsEditing(false)
}

  return (
    <div
  className="fixed inset-0 z-[100] bg-black"
  onClick={handleSceneClick}
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
{isEditing &&
 newLocationPos && (
  <div
    style={{
      left: `${newLocationPos.x}%`,
      top: `${newLocationPos.y}%`,
    }}
    className="
      absolute
      -translate-x-1/2
      -translate-y-1/2
      z-50
    "
  >
    <div
      className="
        w-6
        h-6
        rounded-full
        bg-green-400
        border-2
        border-white
      "
    />
  </div>
)}
{isEditing &&
 newLocationPos && (
  <div
  onClick={(e) => e.stopPropagation()}
  className="
    absolute
    bottom-8
    right-8
    z-[120]
    bg-[#12090b]
    border
    border-[#e0a96d]/30
    rounded-2xl
    p-4
    w-[320px]
  "
>
    <h3 className="text-[#e0a96d] font-display mb-3">
      Novo Hotspot
    </h3>

    <input
      value={newLocationName}
      onChange={(e) =>
        setNewLocationName(e.target.value)
      }
      placeholder="Nome"
      className="
        w-full
        mb-3
        bg-black/40
        border
        border-[#e0a96d]/20
        rounded-xl
        p-3
        text-sm
        text-[#f2e9e4]
        outline-none
      "
    />

    <textarea
      value={newLocationDescription}
      onChange={(e) =>
        setNewLocationDescription(e.target.value)
      }
      placeholder="Descrição"
      className="
        w-full
        min-h-[90px]
        bg-black/40
        border
        border-[#e0a96d]/20
        rounded-xl
        p-3
        text-sm
        text-[#f2e9e4]
        outline-none
      "
    />
    <select
  value={selectedTargetSceneId ?? ""}
  onChange={(e) => {
  if (e.target.value === "new") {
    setSelectedTargetSceneId("new")
    setCreateNewScene(true)
    return
  }

  setCreateNewScene(false)

  setSelectedTargetSceneId(
    e.target.value
      ? Number(e.target.value)
      : null
  )
}}
  className="
    w-full
    mt-3
    bg-[#12090b]
    border
    border-[#e0a96d]/20
    rounded-xl
    p-3
    text-sm
    text-[#f2e9e4]
    outline-none
  "
>
  <option value="">
    Nenhum destino
  </option>
  
  {availableScenes
    .filter((scene) => scene.id !== currentScene.id)
    .map((scene) => (
      <option
        key={scene.id}
        value={scene.id}
        className="bg-[#12090b] text-[#f2e9e4]"
      >
        {scene.title}
      </option>

      
    ))}

  <option value="new">
  ➕ Criar nova cena
</option>
</select>
{createNewScene && (
  <div className="mt-3 space-y-3">
    <input
      value={newSceneTitle}
      onChange={(e) =>
        setNewSceneTitle(e.target.value)
      }
      placeholder="Título da nova cena"
      className="
        w-full
        bg-black/40
        border
        border-[#e0a96d]/20
        rounded-xl
        p-3
        text-sm
        text-[#f2e9e4]
        outline-none
      "
    />

    <textarea
      value={newSceneDescription}
      onChange={(e) =>
        setNewSceneDescription(e.target.value)
      }
      placeholder="Descrição da nova cena"
      className="
        w-full
        min-h-[80px]
        bg-black/40
        border
        border-[#e0a96d]/20
        rounded-xl
        p-3
        text-sm
        text-[#f2e9e4]
        outline-none
      "
    />
  </div>
)}
    <div className="flex gap-2 mt-4">
  <button
  type="button"
  onClick={(e) => {
    e.stopPropagation()
    void handleSaveLocation()
  }}
    className="
      flex-1
      bg-[#e0a96d]
      text-black
      py-2
      rounded-xl
      font-semibold
    "
  >
    Salvar
  </button>

  <button
  type="button"
  onClick={(e) => {
  e.stopPropagation()

  setNewLocationPos(null)
  setNewLocationName("")
  setNewLocationDescription("")

  setSelectedTargetSceneId(null)
  setCreateNewScene(false)

  setNewSceneTitle("")
  setNewSceneDescription("")

  setIsEditing(false)
}}
  className="
    flex-1
    bg-red-600
    text-white
    py-2
    rounded-xl
  "
>
  Cancelar
</button>
</div>
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
            z-[80]
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
      <div
  className={`
    absolute
    top-6
    left-1/2
    -translate-x-1/2
    bg-black/50
    border
    border-white/20
    px-4
    py-2
    rounded-full
    text-sm
    text-[#f2e9e4]
    max-w-[80vw]
    truncate
    transition-opacity
    duration-500
    ${
      showUI
        ? "opacity-100"
        : "opacity-0"
    }
  `}
>
  {scenePath.map((item, index) => (
    <span key={item.id}>
      {index > 0 && (
        <span className="text-[#e0a96d]/70">
          {" > "}
        </span>
      )}
      <button
  onClick={() => {
    const targetPath =
      scenePath.slice(0, index)

    setSceneHistory(targetPath)

    setCurrentScene(item)
  }}
  className="
    hover:text-[#e0a96d]
    transition
  "
>
  {item.title}
</button>
    </span>
  ))}
</div>
      {sceneHistory.length > 0 && (

        
  <button
    onClick={handleBack}
    className={`
      absolute
      top-6
      left-6
      text-white
      text-sm
      bg-black/50
      border
      border-white/20
      px-4
      py-2
      rounded-full
      transition-opacity
      duration-500
      ${
        showUI
          ? "opacity-100"
          : "opacity-0"
      }
    `}
  >
    
    ← Voltar
  </button>
)}
<button
  onClick={() =>
    setIsEditing(
      (prev) => !prev
    )
  }
  className="
    absolute
    top-6
    right-24
    bg-black/50
    border
    border-white/20
    px-4
    py-2
    rounded-full
    text-white
  "
>
  ✏️ Editar
</button>
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