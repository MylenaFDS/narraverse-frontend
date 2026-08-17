import {
  useEffect,
  useState,
  type MouseEvent,
} from "react"

import {
  getSceneLocations,
  getRegionSceneById,
  createSceneLocation,
  getRegionScenes,
  createRegionScene,
  updateSceneLocation,
  uploadRegionSceneImage,
  type RegionScene,
  type SceneLocation,
} from "../../../services/api"

import { ExplorerAI } from "../../../engine/explorer/ExplorerAI"

import {
  ExplorationMemoryEngine,
} from "../../../engine/explorer/ExplorationMemory"

import {
  ExplorationStateEngine,
} from "../../../engine/explorer/ExplorationStateEngine"

type Props = {
  scene: RegionScene
  onClose: () => void
}

type ExplorerLocation = SceneLocation & {
  entity_id?: string | null
  entityId?: string | null
}

export default function ExplorerView({
  scene,
  onClose,
}: Props) {
  // ============================================================
  // CENA ATUAL
  // ============================================================

  const [currentScene, setCurrentScene] =
    useState(scene)

  const [sceneHistory, setSceneHistory] =
    useState<RegionScene[]>([])

  // ============================================================
  // HOTSPOTS
  // ============================================================

  const [locations, setLocations] =
    useState<SceneLocation[]>([])

  const [
    selectedHotspot,
    setSelectedHotspot,
  ] = useState<ExplorerLocation | null>(null)

  const [isTransitioning, setIsTransitioning] =
    useState(false)

  // ============================================================
  // UI
  // ============================================================

  const [showUI, setShowUI] =
    useState(true)

  const [isEditing, setIsEditing] =
    useState(false)

  // ============================================================
  // CRIAÇÃO / EDIÇÃO DE HOTSPOT
  // ============================================================

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

  const [editingLocation, setEditingLocation] =
    useState<SceneLocation | null>(null)

  // ============================================================
  // CENAS DISPONÍVEIS
  // ============================================================

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

  const [
    newSceneDescription,
    setNewSceneDescription,
  ] = useState("")

  // ============================================================
  // IMAGEM
  // ============================================================

  const [imageFile, setImageFile] =
    useState<File | null>(null)

  // ============================================================
  // DRAG DE HOTSPOT
  // ============================================================

  const [
    draggingLocation,
    setDraggingLocation,
  ] = useState<SceneLocation | null>(null)

  // ============================================================
  // INICIALIZAÇÃO DO EXPLORADOR
  // ============================================================

  useEffect(() => {
    ExplorationStateEngine.start(
      scene.id,
    )

    return () => {
      ExplorationStateEngine.stop()
    }
  }, [scene.id])

  // ============================================================
  // CARREGAR HOTSPOTS DA CENA
  // ============================================================

  useEffect(() => {
    async function loadLocations() {
      try {
        const result =
          await getSceneLocations(
            currentScene.id,
          )

        setLocations(result)

        ExplorationStateEngine.setHotspots(
          result,
        )
      } catch (error) {
        console.error(
          "Erro ao carregar hotspots:",
          error,
        )
      }
    }


    void loadLocations()
  }, [currentScene.id])

  // ============================================================
  // CARREGAR CENAS DA REGIÃO
  // ============================================================

  useEffect(() => {
    async function loadScenes() {
      try {
        const scenes =
          await getRegionScenes(
            currentScene.lore_id,
          )

        setAvailableScenes(scenes)
      } catch (error) {
        console.error(
          "Erro ao carregar cenas:",
          error,
        )
      }
    }

    void loadScenes()
  }, [currentScene.lore_id])

  // ============================================================
  // ESCONDER INTERFACE APÓS ALGUNS SEGUNDOS
  // ============================================================

  useEffect(() => {
    const showTimer =
      setTimeout(() => {
        setShowUI(true)
      }, 0)

    const hideTimer =
      setTimeout(() => {
        setShowUI(false)
      }, 3000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [currentScene.id])

  // ============================================================
  // URL DA IMAGEM
  // ============================================================

  const imageUrl =
    currentScene.image_url
      ? currentScene.image_url.startsWith(
          "http",
        )
        ? currentScene.image_url
        : `http://127.0.0.1:8001/${currentScene.image_url}`
      : null

  // ============================================================
  // IDENTIFICAR ENTITY ID
  // ============================================================

  function getEntityId(
    location: SceneLocation,
  ): string | null {
    const item =
      location as ExplorerLocation

    return (
      item.entity_id ??
      item.entityId ??
      null
    )
  }

  // ============================================================
  // TIPO DO HOTSPOT
  // ============================================================

  function getHotspotType(
    location: SceneLocation,
  ) {
    const entityId =
      getEntityId(location)

    if (
      entityId?.startsWith(
        "secret-",
      )
    ) {
      return {
        icon: "🔮",
        label: "Segredo",
      }
    }

    if (location.target_scene_id) {
      return {
        icon: "🗺️",
        label: "Passagem",
      }
    }

    if (entityId) {
      return {
        icon: "✨",
        label: "Interação",
      }
    }

    return {
      icon: "🔎",
      label: "Ponto de interesse",
    }
  }

// ============================================================
// INTERAÇÃO COM HOTSPOT
// ============================================================

async function handleLocationClick(
  location: SceneLocation,
) {
  if (isTransitioning) {
    return
  }

  const explorerLocation =
    location as ExplorerLocation

  const entityId =
    getEntityId(location)

  // ========================================================
  // REGISTRAR DESCOBERTA
  // ========================================================

  if (entityId) {
    ExplorationMemoryEngine
      .discoverEntity(
        entityId,
      )

    ExplorationMemoryEngine
      .interact(
        entityId,
      )

    // ======================================================
    // SEGREDO
    // ======================================================

    if (
      entityId.startsWith(
        "secret-",
      )
    ) {
      ExplorationMemoryEngine
        .discoverSecret(
          entityId,
        )
    }
  }

  // ========================================================
  // SEM DESTINO
  //
  // O hotspot continua selecionado.
  // Apenas não ocorre transição.
  // ========================================================

  if (
    !location.target_scene_id
  ) {
    setSelectedHotspot(
      explorerLocation,
    )

    return
  }

  // ========================================================
  // TRANSIÇÃO PARA OUTRA CENA
  // ========================================================

  setSelectedHotspot(null)

  setIsTransitioning(true)

  ExplorationStateEngine.beginTransition()

  try {
    const nextScene =
      await getRegionSceneById(
        location.target_scene_id,
      )

    setSceneHistory(
      (prev) => [
        ...prev,
        currentScene,
      ],
    )

    setCurrentScene(
      nextScene,
    )

    ExplorationStateEngine.enterScene(
      nextScene.id,
    )

    setTimeout(() => {
      setIsTransitioning(false)

      ExplorationStateEngine.finishTransition()
    }, 350)

  } catch (err) {
    console.error(
      "Erro ao entrar na cena:",
      err,
    )

    setIsTransitioning(false)

    ExplorationStateEngine.finishTransition()

    alert(
      "Não foi possível entrar nesta cena.",
    )
  }
}

  // ============================================================
  // VOLTAR
  // ============================================================

  function handleBack() {
    const previousScene =
      sceneHistory[
        sceneHistory.length - 1
      ]

    if (!previousScene) {
      return
    }

    setSelectedHotspot(null)

    ExplorationStateEngine.beginTransition()

    setCurrentScene(
      previousScene,
    )

    ExplorationStateEngine.enterScene(
      previousScene.id,
    )

    setSceneHistory(
      (prev) =>
        prev.slice(0, -1),
    )

    setIsTransitioning(true)

    setTimeout(() => {
      setIsTransitioning(false)

      ExplorationStateEngine.finishTransition()
    }, 350)
  }

  // ============================================================
  // CAMINHO DA CENA
  // ============================================================

  const scenePath = [
    ...sceneHistory,
    currentScene,
  ]

  // ============================================================
  // CLIQUE NA CENA PARA CRIAR HOTSPOT
  // ============================================================

  function handleSceneClick(
    e: MouseEvent<HTMLDivElement>,
  ) {
    if (!isEditing) {
      return
    }

    const rect =
      e.currentTarget.getBoundingClientRect()

    const x =
      ((e.clientX - rect.left) /
        rect.width) *
      100

    const y =
      ((e.clientY - rect.top) /
        rect.height) *
      100

    setNewLocationPos({
      x,
      y,
    })

    setEditingLocation(null)

    console.log(
      "NOVO HOTSPOT",
      x,
      y,
    )
  }

  // ============================================================
  // SALVAR HOTSPOT
  // ============================================================

  async function handleSaveLocation() {
    try {
      if (!newLocationPos) {
        return
      }

      if (!newLocationName.trim()) {
        alert(
          "Digite um nome para o hotspot.",
        )

        return
      }

      let targetSceneId:
        number | null = null

      // ======================================================
      // CRIAR NOVA CENA
      // ======================================================

      if (
        selectedTargetSceneId ===
        "new"
      ) {
        if (
          !newSceneTitle.trim()
        ) {
          alert(
            "Digite o título da nova cena.",
          )

          return
        }

        const newScene =
          await createRegionScene(
            currentScene.lore_id,
            {
              title:
                newSceneTitle.trim(),

              description:
                newSceneDescription,
            },
          )

        targetSceneId =
          newScene.id

        setAvailableScenes(
          (prev) => [
            ...prev,
            newScene,
          ],
        )
      } else {
        targetSceneId =
          selectedTargetSceneId
      }

      // ======================================================
      // EDITAR HOTSPOT
      // ======================================================

      if (editingLocation) {
        await updateSceneLocation(
          editingLocation.id,
          {
            name:
              newLocationName.trim(),

            description:
              newLocationDescription,

            pos_x:
              Math.round(
                newLocationPos.x,
              ),

            pos_y:
              Math.round(
                newLocationPos.y,
              ),

            target_scene_id:
              targetSceneId,
          },
        )
      }

      // ======================================================
      // CRIAR HOTSPOT
      // ======================================================

      else {
        await createSceneLocation(
          currentScene.id,
          {
            name:
              newLocationName.trim(),

            description:
              newLocationDescription,

            entity_id:
              null,

            pos_x:
              Math.round(
                newLocationPos.x,
              ),

            pos_y:
              Math.round(
                newLocationPos.y,
              ),

            target_scene_id:
              targetSceneId,
          },
        )
      }

      // ======================================================
      // RECARREGAR HOTSPOTS
      // ======================================================

      const updatedLocations =
        await getSceneLocations(
          currentScene.id,
        )

      setLocations(
        updatedLocations,
      )

      ExplorationStateEngine.setHotspots(
        updatedLocations,
      )

      // ======================================================
      // LIMPAR FORMULÁRIO
      // ======================================================

      setEditingLocation(null)

      setNewLocationPos(null)

      setNewLocationName("")

      setNewLocationDescription("")

      setSelectedTargetSceneId(
        null,
      )

      setCreateNewScene(false)

      setNewSceneTitle("")

      setNewSceneDescription("")

      setIsEditing(false)
    } catch (error) {
      console.error(
        "Erro ao salvar hotspot:",
        error,
      )

      alert(
        "Erro ao salvar hotspot.",
      )
    }
  }

  // ============================================================
  // CANCELAR EDIÇÃO
  // ============================================================

  function handleCancelEditing() {
    setNewLocationPos(null)

    setNewLocationName("")

    setNewLocationDescription("")

    setSelectedTargetSceneId(
      null,
    )

    setCreateNewScene(false)

    setNewSceneTitle("")

    setNewSceneDescription("")

    setEditingLocation(null)

    setIsEditing(false)
  }

  // ============================================================
  // UPLOAD DE IMAGEM
  // ============================================================

  async function handleUploadImage() {
    if (!imageFile) {
      return
    }

    try {
      const updatedScene =
        await uploadRegionSceneImage(
          currentScene.id,
          imageFile,
        )

      setCurrentScene(
        updatedScene,
      )

      setImageFile(null)
    } catch (err) {
      console.error(
        "Erro ao enviar imagem:",
        err,
      )

      alert(
        "Erro ao enviar imagem.",
      )
    }
  }

  // ============================================================
  // SALVAR POSIÇÃO DO HOTSPOT
  // ============================================================

  async function saveLocationPosition(
    location: SceneLocation,
  ) {
    try {
      await updateSceneLocation(
        location.id,
        {
          name:
            location.name,

          description:
            location.description ||
            "",

          pos_x:
            location.pos_x,

          pos_y:
            location.pos_y,

          target_scene_id:
            location.target_scene_id,
        },
      )
    } catch (error) {
      console.error(
        "Erro ao salvar posição:",
        error,
      )
    }
  }

  // ============================================================
  // GERAR HOTSPOTS COM IA
  // ============================================================

  async function handleGenerateHotspots() {
    try {
      const hotspots =
        ExplorerAI.generateHotspots(
          currentScene.id,
          currentScene.title,
          currentScene.description ??
            "",
        )

      // ======================================================
      // NENHUM HOTSPOT
      // ======================================================

      if (!hotspots.length) {
        alert(
          "A IA não encontrou elementos suficientes para sugerir hotspots nesta cena.",
        )

        return
      }

      // ======================================================
      // HOTSPOTS EXISTENTES
      // ======================================================

      const existingNames =
        new Set(
          locations.map(
            (location) =>
              location.name
                .toLowerCase()
                .trim(),
          ),
        )

      // ======================================================
      // APENAS NOVOS
      // ======================================================

      const newHotspots =
        hotspots.filter(
          (hotspot) =>
            !existingNames.has(
              hotspot.name
                .toLowerCase()
                .trim(),
            ),
        )

      if (!newHotspots.length) {
        alert(
          "Os hotspots identificados já existem nesta cena.",
        )

        return
      }

      // ======================================================
      // CRIAR HOTSPOTS
      // ======================================================

      for (
        const hotspot
        of newHotspots
      ) {
        await createSceneLocation(
          currentScene.id,
          {
            name:
              hotspot.name,

            description:
              hotspot.description,

            entity_id:
              hotspot.entityId,

            pos_x:
              Math.round(
                hotspot.position.x,
              ),

            pos_y:
              Math.round(
                hotspot.position.y,
              ),

            target_scene_id:
              null,
          },
        )
      }

      // ======================================================
      // RECARREGAR
      // ======================================================

      const updated =
        await getSceneLocations(
          currentScene.id,
        )

      setLocations(
        updated,
      )

      ExplorationStateEngine.setHotspots(
        updated,
      )
    } catch (err) {
      console.error(
        "Erro ao gerar hotspots:",
        err,
      )

      alert(
        "Erro ao gerar hotspots.",
      )
    }
  }

  // ============================================================
  // EDITAR HOTSPOT EXISTENTE
  // ============================================================

  function handleEditLocation(
    location: SceneLocation,
  ) {
    setEditingLocation(
      location,
    )

    setNewLocationName(
      location.name,
    )

    setNewLocationDescription(
      location.description ||
        "",
    )

    setSelectedTargetSceneId(
      location.target_scene_id ??
        null,
    )

    setCreateNewScene(false)

    setNewLocationPos({
      x: location.pos_x,
      y: location.pos_y,
    })

    setIsEditing(true)

    setSelectedHotspot(null)
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        bg-black
        overflow-hidden
      "
      onClick={handleSceneClick}
      onMouseMove={(e) => {
        setShowUI(true)

        if (!draggingLocation) {
          return
        }

        const rect =
          e.currentTarget.getBoundingClientRect()

        const x =
          ((e.clientX - rect.left) /
            rect.width) *
          100

        const y =
          ((e.clientY - rect.top) /
            rect.height) *
          100

        setLocations(
          (prev) =>
            prev.map((loc) =>
              loc.id ===
              draggingLocation.id
                ? {
                    ...loc,
                    pos_x:
                      Math.round(
                        x,
                      ),
                    pos_y:
                      Math.round(
                        y,
                      ),
                  }
                : loc,
            ),
        )
      }}
      onMouseUp={async () => {
        if (draggingLocation) {
          const location =
            locations.find(
              (item) =>
                item.id ===
                draggingLocation.id,
            )

          if (location) {
            await saveLocationPosition(
              location,
            )
          }
        }

        setDraggingLocation(
          null,
        )
      }}
    >
      {/* ========================================================
          IMAGEM DA CENA
          ======================================================== */}

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
        <div
          className="
            relative
            z-[300]
            h-full
            flex
            flex-col
            items-center
            justify-center
            gap-4
            text-white
          "
        >
          <p>
            Esta cena ainda não possui
            imagem
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(
                e.target.files?.[0] ??
                  null,
              )
            }
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              void handleUploadImage()
            }}
            disabled={!imageFile}
            className="
              px-4
              py-2
              rounded-xl
              bg-[#e0a96d]
              text-black
              font-semibold
              disabled:opacity-50
            "
          >
            Enviar imagem
          </button>
        </div>
      )}

      {/* ========================================================
          GRADIENTE
          ======================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/70
          via-transparent
          to-black/30
          pointer-events-none
        "
      />

      {/* ========================================================
          MARCADOR DE NOVO HOTSPOT
          ======================================================== */}

      {isEditing &&
        newLocationPos && (
          <div
            style={{
              left:
                `${newLocationPos.x}%`,
              top:
                `${newLocationPos.y}%`,
            }}
            className="
              absolute
              -translate-x-1/2
              -translate-y-1/2
              z-[90]
              pointer-events-none
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
                shadow-[0_0_20px_rgba(74,222,128,1)]
              "
            />
          </div>
        )}

      {/* ========================================================
          FORMULÁRIO DO HOTSPOT
          ======================================================== */}

      {isEditing &&
        newLocationPos && (
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
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
              shadow-[0_0_40px_rgba(0,0,0,0.7)]
            "
          >
            <h3
              className="
                text-[#e0a96d]
                font-display
                mb-3
              "
            >
              {editingLocation
                ? "Editar Hotspot"
                : "Novo Hotspot"}
            </h3>

            <input
              value={newLocationName}
              onChange={(e) =>
                setNewLocationName(
                  e.target.value,
                )
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
              value={
                newLocationDescription
              }
              onChange={(e) =>
                setNewLocationDescription(
                  e.target.value,
                )
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
              value={
                selectedTargetSceneId ??
                ""
              }
              onChange={(e) => {
                if (
                  e.target.value ===
                  "new"
                ) {
                  setSelectedTargetSceneId(
                    "new",
                  )

                  setCreateNewScene(
                    true,
                  )

                  return
                }

                setCreateNewScene(
                  false,
                )

                setSelectedTargetSceneId(
                  e.target.value
                    ? Number(
                        e.target.value,
                      )
                    : null,
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
                .filter(
                  (item) =>
                    item.id !==
                    currentScene.id,
                )
                .map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                    className="
                      bg-[#12090b]
                      text-[#f2e9e4]
                    "
                  >
                    {item.title}
                  </option>
                ))}

              <option value="new">
                ➕ Criar nova cena
              </option>
            </select>

            {/* ==================================================
                NOVA CENA
                ================================================== */}

            {createNewScene && (
              <div
                className="
                  mt-3
                  space-y-3
                "
              >
                <input
                  value={newSceneTitle}
                  onChange={(e) =>
                    setNewSceneTitle(
                      e.target.value,
                    )
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
                  value={
                    newSceneDescription
                  }
                  onChange={(e) =>
                    setNewSceneDescription(
                      e.target.value,
                    )
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

            {/* ==================================================
                BOTÕES
                ================================================== */}

            <div
              className="
                flex
                gap-2
                mt-4
              "
            >
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
                  hover:brightness-110
                  transition
                "
              >
                Salvar
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()

                  handleCancelEditing()
                }}
                className="
                  flex-1
                  bg-red-600
                  text-white
                  py-2
                  rounded-xl
                  hover:bg-red-500
                  transition
                "
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

      {/* ========================================================
          HOTSPOTS
          ======================================================== */}

      {locations.map(
        (location) => {
          const hotspotType =
            getHotspotType(
              location,
            )

          const hasDestination =
            Boolean(
              location.target_scene_id,
            )

          return (
            <button
              key={location.id}
              type="button"
              onMouseDown={(e) => {
                if (!isEditing) {
                  return
                }

                e.stopPropagation()

                setDraggingLocation(
                  location,
                )
              }}
              onClick={(e) => {
                e.stopPropagation()

                // ----------------------------------------------
                // MODO EDIÇÃO
                // ----------------------------------------------

                if (isEditing) {
                  handleEditLocation(
                    location,
                  )

                  return
                }

                // ----------------------------------------------
                // MODO EXPLORAÇÃO
                // ----------------------------------------------

                void handleLocationClick(
                  location,
                )
              }}
              style={{
                left:
                  `${location.pos_x}%`,
                top:
                  `${location.pos_y}%`,
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
                cursor-pointer
              "
              title={
                location.description ||
                location.name
              }
            >
              {/* =================================================
                  PONTO
                  ================================================= */}

              <span
                className="
                  relative
                  flex
                  items-center
                  justify-center
                "
              >
                <span
                  className="
                    absolute
                    w-9
                    h-9
                    rounded-full
                    border-2
                    border-[#e0a96d]
                    animate-ping
                    opacity-60
                  "
                />

                <span
                  className="
                    relative
                    w-5
                    h-5
                    rounded-full
                    bg-[#e0a96d]
                    border-2
                    border-white/70
                    shadow-[0_0_25px_rgba(224,169,109,1)]
                    group-hover:scale-125
                    transition
                  "
                />
              </span>

              {/* =================================================
                  NOME
                  ================================================= */}

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
                  bg-black/80
                  border
                  border-[#e0a96d]/40
                  text-[#f2e9e4]
                  text-xs
                  whitespace-nowrap
                  pointer-events-none
                "
              >
                {hotspotType.icon}{" "}
                {location.name}
              </span>

              {/* =================================================
                  INDICADOR DE PASSAGEM
                  ================================================= */}

              {hasDestination && (
                <span
                  className="
                    absolute
                    -top-7
                    opacity-0
                    group-hover:opacity-100
                    transition
                    text-[10px]
                    text-[#e0a96d]
                    whitespace-nowrap
                    pointer-events-none
                  "
                >
                  Entrar →
                </span>
              )}
            </button>
          )
        },
      )}

      {/* ========================================================
          PAINEL DO HOTSPOT
          ======================================================== */}

      {selectedHotspot && (
        <div
          onClick={(e) =>
            e.stopPropagation()
          }
          className="
            absolute
            left-1/2
            bottom-8
            -translate-x-1/2
            z-[150]
            w-[min(420px,90vw)]
            rounded-2xl
            border
            border-[#e0a96d]/30
            bg-[#12090b]/95
            backdrop-blur-md
            shadow-[0_0_50px_rgba(0,0,0,0.8)]
            p-5
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div>
              <div
                className="
                  text-xs
                  uppercase
                  tracking-widest
                  text-[#e0a96d]/70
                  mb-1
                "
              >
                {
                  getHotspotType(
                    selectedHotspot,
                  ).label
                }
              </div>

              <h2
                className="
                  text-2xl
                  text-[#e0a96d]
                  font-display
                "
              >
                {
                  getHotspotType(
                    selectedHotspot,
                  ).icon
                }{" "}
                {selectedHotspot.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedHotspot(
                  null,
                )
              }
              className="
                text-[#c9ada7]
                hover:text-white
                text-lg
              "
            >
              ✕
            </button>
          </div>

          {selectedHotspot.description && (
            <p
              className="
                mt-4
                text-[#c9ada7]
                leading-relaxed
                whitespace-pre-wrap
              "
            >
              {
                selectedHotspot.description
              }
            </p>
          )}

          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <span
              className="
                text-xs
                text-[#c9ada7]/50
              "
            >
              {selectedHotspot.pos_x.toFixed(
                0,
              )}
              % ×{" "}
              {selectedHotspot.pos_y.toFixed(
                0,
              )}
              %
            </span>

            <button
              type="button"
              onClick={() =>
                setSelectedHotspot(
                  null,
                )
              }
              className="
                px-4
                py-2
                rounded-xl
                bg-[#e0a96d]
                text-black
                font-semibold
                hover:brightness-110
                transition
              "
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          TÍTULO E DESCRIÇÃO
          ======================================================== */}

      <div
        className={`
          absolute
          bottom-8
          left-8
          right-8
          transition-opacity
          duration-500
          pointer-events-none
          ${
            showUI
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      >
        <h1
          className="
            text-5xl
            text-[#f2e9e4]
            font-display
            mb-3
          "
        >
          {currentScene.title}
        </h1>

        <p
          className="
            text-lg
            text-[#f2e9e4]/80
            max-w-3xl
          "
        >
          {currentScene.description}
        </p>
      </div>

      {/* ========================================================
          TRANSIÇÃO
          ======================================================== */}

      <div
        className={`
          absolute
          inset-0
          z-[140]
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

      {/* ========================================================
          BREADCRUMB
          ======================================================== */}

      <div
        className={`
          absolute
          top-6
          left-1/2
          -translate-x-1/2
          z-[110]
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
        {scenePath.map(
          (item, index) => (
            <span key={item.id}>
              {index > 0 && (
                <span className="text-[#e0a96d]/70">
                  {" > "}
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  if (
                    item.id ===
                    currentScene.id
                  ) {
                    return
                  }

                  const targetIndex =
                    scenePath.findIndex(
                      (sceneItem) =>
                        sceneItem.id ===
                        item.id,
                    )

                  if (
                    targetIndex <
                    0
                  ) {
                    return
                  }

                  const targetPath =
                    scenePath.slice(
                      0,
                      targetIndex,
                    )

                  setSceneHistory(
                    targetPath,
                  )

                  setSelectedHotspot(
                    null,
                  )

                  setCurrentScene(
                    item,
                  )
                }}
                className="
                  hover:text-[#e0a96d]
                  transition
                "
              >
                {item.title}
              </button>
            </span>
          ),
        )}
      </div>

      {/* ========================================================
          VOLTAR
          ======================================================== */}

      {sceneHistory.length >
        0 && (
        <button
          type="button"
          onClick={handleBack}
          className={`
            absolute
            top-6
            left-6
            z-[110]
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
            hover:bg-black/70
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

      {/* ========================================================
          BOTÃO EDITAR
          ======================================================== */}

      <button
        type="button"
        onClick={() =>
          setIsEditing(
            (prev) => !prev,
          )
        }
        className="
          absolute
          top-6
          right-24
          z-[110]
          bg-black/50
          border
          border-white/20
          px-4
          py-2
          rounded-full
          text-white
          hover:bg-black/70
          transition
        "
      >
        ✏️{" "}
        {isEditing
          ? "Sair da edição"
          : "Editar"}
      </button>

      {/* ========================================================
          IA
          ======================================================== */}

      <button
        type="button"
        onClick={() =>
          void handleGenerateHotspots()
        }
        className="
          absolute
          top-6
          right-56
          z-[110]
          bg-[#6d4cff]
          border
          border-white/20
          px-4
          py-2
          rounded-full
          text-white
          hover:brightness-110
          transition
        "
      >
        ✨ IA
      </button>

      {/* ========================================================
          DEBUG
          ======================================================== */}

      <pre
        className="
          absolute
          bottom-4
          right-4
          z-[200]
          max-w-[400px]
          max-h-[300px]
          overflow-auto
          bg-black/80
          text-green-300
          text-xs
          p-4
          rounded-xl
        "
      >
        {JSON.stringify(
          ExplorationStateEngine.getState(),
          null,
          2,
        )}
      </pre>

      {/* ========================================================
          FECHAR
          ======================================================== */}

      <button
        type="button"
        onClick={onClose}
        className={`
          absolute
          top-6
          right-6
          z-[110]
          text-white
          text-2xl
          transition-opacity
          duration-500
          hover:text-[#e0a96d]
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