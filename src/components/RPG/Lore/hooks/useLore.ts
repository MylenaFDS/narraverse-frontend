import { useEffect, useState, useRef, useCallback } from "react"
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
  const [selectedLore, setSelectedLore] =
    useState<Lore | null>(null)

  const [isOwner, setIsOwner] =
    useState<boolean | null>(null)

  const [editingId, setEditingId] =
    useState<number | null>(null)

  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  const mapRef =
    useRef<HTMLDivElement | null>(null)

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
    if (!title || !content) return

    await createLore(rpgId, {
      title,
      content,
      category,
    })

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

    selectedLore,
    setSelectedLore,

    isOwner,
    editingId,
    setEditingId,

    editTitle,
    setEditTitle,

    editContent,
    setEditContent,

    mapRef,

    handleCreate,
    handleDelete,
    load,

    uploadMapImage,
    createMapRegion,
    updateMapRegionPosition,
  }
}