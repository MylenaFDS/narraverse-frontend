import { useState, useRef } from "react"

import type { Lore } from "../../../../types/lore"

export type MapRegion = {
  id: number
  name: string
  lore_id?: number | null
  pos_x: number
  pos_y: number
  color: string
  rpg_id: number
}

type Props = {
  lore: Lore[]
  mapRegions: MapRegion[]
  setMapRegions: React.Dispatch<
    React.SetStateAction<MapRegion[]>
  >
  updateMapRegionPosition: (
    regionId: number,
    data: {
      pos_x: number
      pos_y: number
    }
  ) => Promise<void>
}

export function useLoreMap({
  lore,
  mapRegions,
  setMapRegions,
  updateMapRegionPosition,
}: Props) {
  const mapRef =
    useRef<HTMLDivElement | null>(null)

  const [selectedLore, setSelectedLore] =
    useState<Lore | null>(null)

  const [zoom, setZoom] = useState(1.2)

  const [offset, setOffset] = useState({
    x: 0,
    y: 0,
  })

  const [isPanning, setIsPanning] =
    useState(false)

  const [panStart, setPanStart] =
    useState({
      x: 0,
      y: 0,
    })

  const [draggingRegion, setDraggingRegion] =
    useState<number | null>(null)

  const [hasMoved, setHasMoved] =
    useState(false)

  async function handleMouseMove(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    if (
      draggingRegion === null ||
      !mapRef.current
    )
      return

    setHasMoved(true)

    const rect =
      mapRef.current.getBoundingClientRect()

    const x =
      ((e.clientX - rect.left) /
        rect.width) *
      100

    const y =
      ((e.clientY - rect.top) /
        rect.height) *
      100

    const finalX = Math.max(
      5,
      Math.min(95, x)
    )

    const finalY = Math.max(
      5,
      Math.min(95, y)
    )

    setMapRegions((prev) =>
      prev.map((r) =>
        r.id === draggingRegion
          ? {
              ...r,
              pos_x: finalX,
              pos_y: finalY,
            }
          : r
      )
    )
  }

  async function handleMouseUp() {
    if (draggingRegion === null)
      return

    const region = mapRegions.find(
      (r) => r.id === draggingRegion
    )

    if (!region) return

    try {
      await updateMapRegionPosition(
        region.id,
        {
          pos_x: Math.round(region.pos_x),
          pos_y: Math.round(region.pos_y),
        }
      )
    } catch (err) {
      console.error(err)
    }

    setDraggingRegion(null)

    setTimeout(() => {
      setHasMoved(false)
    }, 0)
  }

  function handlePanStart(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    if (draggingRegion !== null)
      return

    setIsPanning(true)

    setPanStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    })
  }

  function handlePanMove(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    if (!isPanning) return

    const newX =
      e.clientX - panStart.x

    const newY =
      e.clientY - panStart.y

    const limit = 250 * (zoom - 1)

    setOffset({
      x: Math.max(
        -limit,
        Math.min(limit, newX)
      ),

      y: Math.max(
        -limit,
        Math.min(limit, newY)
      ),
    })
  }

  function handlePanEnd() {
    setIsPanning(false)
  }

  function handleWheel(
    e: React.WheelEvent<HTMLDivElement>
  ) {
    e.preventDefault()

    const delta =
      e.deltaY > 0 ? -0.1 : 0.1

    setZoom((prev) =>
      Math.min(
        3,
        Math.max(1, prev + delta)
      )
    )
  }

  function handleRegionClick(
    region: MapRegion
  ) {
    if (hasMoved) return

    if (!region.lore_id) return

    const loreItem = lore.find(
      (l) => l.id === region.lore_id
    )

    if (loreItem) {
      setSelectedLore(loreItem)
    }
  }

  return {
    mapRef,

    selectedLore,
    setSelectedLore,

    zoom,
    setZoom,

    offset,
    setOffset,

    isPanning,

    draggingRegion,
    setDraggingRegion,

    hasMoved,
    setHasMoved,

    handleMouseMove,
    handleMouseUp,

    handlePanStart,
    handlePanMove,
    handlePanEnd,

    handleWheel,

    handleRegionClick,
  }
}