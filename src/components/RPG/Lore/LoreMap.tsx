import type { Lore } from "../../../types/lore"
import type { MapRegion } from "./Lore"

type Props = {
  worldMap: string
  mapRegions: MapRegion[]
  lore: Lore[]

  zoom: number
  offset: {
    x: number
    y: number
  }

  isPanning: boolean
  isOwner: boolean | null
  hasMoved: boolean

  mapRef: React.RefObject<HTMLDivElement | null>

  setZoom: React.Dispatch<React.SetStateAction<number>>

  setOffset: React.Dispatch<
    React.SetStateAction<{
      x: number
      y: number
    }>
  >

  setSelectedLore: (
    lore: Lore
  ) => void

  setDraggingRegion: (
    id: number | null
  ) => void

  setHasMoved: (
    value: boolean
  ) => void

  handlePanStart: (
    e: React.MouseEvent<HTMLDivElement>
  ) => void

  handlePanMove: (
    e: React.MouseEvent<HTMLDivElement>
  ) => void

  handlePanEnd: () => void

  handleMouseMove: (
    e: React.MouseEvent<HTMLDivElement>
  ) => void

  handleMouseUp: () => void

  handleWheel: (
    e: React.WheelEvent<HTMLDivElement>
  ) => void
}

export default function LoreMap({
  worldMap,
  mapRegions,
  lore,
  zoom,
  offset,
  isPanning,
  isOwner,
  hasMoved,
  mapRef,
  setZoom,
  setSelectedLore,
  setDraggingRegion,
  setHasMoved,
  handlePanStart,
  handlePanMove,
  handlePanEnd,
  handleMouseMove,
  handleMouseUp,
  handleWheel,
}: Props) {
  return (
    <div
      className="
        mb-10
        bg-[#18181b]
        border
        border-[#2b2b31]
        rounded-2xl
        overflow-hidden
      "
    >
      <div className="p-5 border-b border-[#2b2b31]">
        <h2 className="text-2xl font-black">
          🗺️ Mapa do Mundo
        </h2>
      </div>

      <div
        className="
          relative
          h-[520px]
          bg-[#0b0b0e]
          overflow-hidden
          rounded-b-2xl
        "
        onMouseDown={handlePanStart}
        onMouseMove={(e) => {
          handlePanMove(e)
          handleMouseMove(e)
        }}
        onMouseUp={() => {
          handlePanEnd()
          handleMouseUp()
        }}
        onMouseLeave={() => {
          handlePanEnd()
          handleMouseUp()
        }}
        onWheel={handleWheel}
      >
        <div className="absolute top-4 right-4 z-40 flex gap-2">
          <button
            onClick={() =>
              setZoom((prev) =>
                Math.max(1, prev - 0.2)
              )
            }
            className="w-10 h-10 rounded-xl bg-[#18181b]/90 border border-[#2b2b31]"
          >
            −
          </button>

          <button
            onClick={() =>
              setZoom((prev) =>
                Math.min(4, prev + 0.2)
              )
            }
            className="w-10 h-10 rounded-xl bg-[#18181b]/90 border border-[#2b2b31]"
          >
            +
          </button>
        </div>

        <div
          ref={mapRef}
          className="absolute inset-0"
          style={{
            transform: `
              translate(${offset.x}px, ${offset.y}px)
              scale(${zoom})
            `,
            transformOrigin: "center center",
            transition: isPanning
              ? "none"
              : "transform 0.1s ease-out",
          }}
        >
          {worldMap && (
            <img
              src={worldMap}
              alt="Mapa"
              draggable={false}
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                pointer-events-none
              "
            />
          )}

          {mapRegions.map((region) => (
            <button
              key={region.id}
              title={region.name}
              draggable={false}
              onMouseDown={() => {
                if (isOwner) {
                  setDraggingRegion(region.id)
                  setHasMoved(false)
                }
              }}
              onClick={() => {
                if (hasMoved) return

                if (!region.lore_id)
                  return

                const loreItem =
                  lore.find(
                    (l) =>
                      l.id ===
                      region.lore_id
                  )

                if (loreItem) {
                  setSelectedLore(
                    loreItem
                  )
                }
              }}
              className="
                absolute
                rounded-full
                border-2
                border-white
                shadow-2xl
                hover:scale-125
                transition
                z-30
              "
              style={{
                top: `${region.pos_y}%`,
                left: `${region.pos_x}%`,
                width: `${18 * zoom}px`,
                height: `${18 * zoom}px`,
                backgroundColor:
                  region.color,
                transform:
                  "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}