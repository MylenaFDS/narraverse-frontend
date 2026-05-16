import { useEffect, useState, useCallback } from "react"


import {
  getLore,
  createLore,
  deleteLore,
  createMapRegion,
  getMapRegions,
  updateMapRegionPosition,
  uploadMapImage,
  getRPG,
  getLoreCategories,
  createLoreCategory,
  getLoreSuggestions,
} from "../../../../services/api"

import type { Lore } from "../../../../types/lore"
import { generateRegionPosition }
from "../utils/generateRegionPosition"

type MapRegion = {
  id: number
  name: string
  lore_id?: number | null
  pos_x: number
  pos_y: number
  color: string
  rpg_id: number
}

export function useLore(rpgId: number) {
  const [lore, setLore] = useState<Lore[]>([])
  const [suggestions, setSuggestions] = useState<Lore[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [mapRegions, setMapRegions] = useState<MapRegion[]>([])

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("Mundo")

  const [search, setSearch] = useState("")
  const [newCategory, setNewCategory] = useState("")

  const [worldMap, setWorldMap] = useState("")
  

  const [isOwner, setIsOwner] =
    useState<boolean | null>(null)

  const [editingId, setEditingId] =
    useState<number | null>(null)

  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")


const load = useCallback(async () => {
  try {
    

    const loreData = await getLore(rpgId)

    setLore(
      Array.isArray(loreData)
        ? loreData
        : []
    )

    const mapData =
      await getMapRegions(rpgId)

    setMapRegions(
      Array.isArray(mapData)
        ? mapData
        : []
    )

    const catRes =
  await getLoreCategories(rpgId)

setCategories(catRes || [])
    const rpg =
  await getRPG(rpgId)
  console.log("RPG:", rpg)
console.log("IS OWNER:", rpg.is_owner)

setWorldMap(
  rpg.world_map
    ? `http://127.0.0.1:8001/${rpg.world_map}`
    : ""
)

setIsOwner(rpg.is_owner)

if (rpg.is_owner) {
  const sug =
    await getLoreSuggestions(
      rpgId
    )

  setSuggestions(sug || [])
} else {
  setSuggestions([])
}
  } catch (err) {
    console.error(err)
  }
}, [rpgId])

useEffect(() => {
  async function init() {
    await load()
  }

  init()
}, [load])


  async function handleCreate() {
  if (!title || !content)
    return

  const createdLore =
    await createLore(rpgId, {
      title,
      content,
      category,
    })

  if (category === "Mundo") {
    try {
      const {
  finalX,
  finalY,
} =
  generateRegionPosition(
    mapRegions
  )
      const colors = [
        "#a855f7",
        "#ef4444",
        "#3b82f6",
        "#22c55e",
        "#eab308",
      ]

      const color =
        colors[
          Math.floor(
            Math.random() *
              colors.length
          )
        ]

      const newRegion =
        await createMapRegion(
          rpgId,
          {
            name: title,
            lore_id:
              createdLore.id,
            pos_x: finalX,
            pos_y: finalY,
            color,
          }
        )

      setMapRegions(
        (prev) => [
          ...prev,
          newRegion,
        ]
      )
    } catch (err) {
      console.error(
        "Erro criando região:",
        err
      )
    }
  }

  setTitle("")
  setContent("")

  await load()
}


  async function handleDelete(id: number) {
    

    await deleteLore(id)

    await load()
  }

  async function handleCreateCategory() {
  if (!newCategory.trim())
    return

 

  try {
    await createLoreCategory(
  rpgId,
  newCategory
)

    const catRes =
  await getLoreCategories(rpgId)

setCategories(catRes || [])


    setNewCategory("")
  } catch (err) {
    console.error(err)
  }
}

  return {
    lore,
    setLore,

    suggestions,
    setSuggestions,

    categories,
    setCategories,

    mapRegions,
    setMapRegions,

    title,
    setTitle,

    content,
    setContent,

    category,
    setCategory,

    search,
    setSearch,

    newCategory,
    setNewCategory,

    worldMap,
    setWorldMap,


    isOwner,
    editingId,
    setEditingId,

    editTitle,
    setEditTitle,

    editContent,
    setEditContent,

    

    handleCreate,
    handleDelete,
    handleCreateCategory,
    load,

    uploadMapImage,
    createMapRegion,
    updateMapRegionPosition,
  }
}