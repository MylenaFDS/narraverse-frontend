import { useEffect, useState, useCallback } from "react"
import axios from "axios"

import {
  getLore,
  createLore,
  createMapRegion,
  getMapRegions,
  updateMapRegionPosition,
  uploadMapImage,
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
    const token =
      localStorage.getItem("token")

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

    const catRes = await axios.get(
      `http://127.0.0.1:8001/rpg-lore/${rpgId}/categories`
    )

    setCategories(
      catRes.data || []
    )

    const res = await axios.get(
      `http://127.0.0.1:8001/rpgs/${rpgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    setWorldMap(
      res.data.world_map
        ? `http://127.0.0.1:8001/${res.data.world_map}`
        : ""
    )

    setIsOwner(res.data.is_owner)

    if (res.data.is_owner) {
  const sug = await axios.get(
    `http://127.0.0.1:8001/rpg-lore/${rpgId}/suggestions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  setSuggestions(sug.data || [])
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
    const token =
      localStorage.getItem("token")

    await axios.delete(
      `http://127.0.0.1:8001/rpg-lore/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    await load()
  }

  async function handleCreateCategory() {
  if (!newCategory.trim())
    return

  const token =
    localStorage.getItem("token")

  try {
    await axios.post(
      `http://127.0.0.1:8001/rpg-lore/${rpgId}/categories`,
      {
        name: newCategory,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const catRes =
      await axios.get(
        `http://127.0.0.1:8001/rpg-lore/${rpgId}/categories`
      )

    setCategories(
      catRes.data || []
    )

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