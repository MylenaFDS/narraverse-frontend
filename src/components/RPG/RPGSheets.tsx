import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import {
  getCharacters,
  createCharacter,
  getCharacterSheet,
  saveCharacterSheet,
  uploadCharacterImage,
} from "../../services/characters"

import {
  getSheetFields,
  createSheetField,
  updateSheetField,
  getRPG,
  getLore,
} from "../../services/api"

import type {
  Character,
  RPGSheetField,
  CharacterCreatePayload,
  CharacterSheetValue,
} from "../../types/character"

type Props = {
  rpgId: number
}
type LoreItem = {
  id: number
  title: string
  category?: string | null
}

export default function RPGSheets({ rpgId }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [characters, setCharacters] = useState<Character[]>([])
  const [sheetFields, setSheetFields] = useState<RPGSheetField[]>([])
  const [sheetData, setSheetData] = useState<Record<number, string>>({})

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  const [newCharacterName, setNewCharacterName] = useState("")
  const [newCharacterHistory, setNewCharacterHistory] =
  useState("")

const [newCharacterWorldId, setNewCharacterWorldId] = useState<number | "">("")

const [newCharacterImageFile, setNewCharacterImageFile] =
  useState<File | null>(null)

const [worldOptions, setWorldOptions] =
  useState<LoreItem[]>([])

  const [isOwner, setIsOwner] = useState(false)

  const [newFieldName, setNewFieldName] = useState("")
  const [newFieldType, setNewFieldType] = useState<"text" | "number">("text")

  const [editingFieldId, setEditingFieldId] = useState<number | null>(null)
  const [editingFieldName, setEditingFieldName] = useState("")

  const isValid = id && !isNaN(rpgId)
  const loggedUserId =
  Number(localStorage.getItem("user_id"))

const myCharacters =
  characters.filter(
    (c) => c.user_id === loggedUserId
  )

const otherCharacters =
  characters.filter(
    (c) => c.user_id !== loggedUserId
  )

  // ===============================
  // FETCH
  // ===============================
  useEffect(() => {
    if (!isValid) return

    async function fetchAll() {
      try {
        const [chars, fields, rpg, lore] = await Promise.all([
  getCharacters(rpgId),
  getSheetFields(rpgId),
  getRPG(rpgId),
  getLore(rpgId),
])

        setCharacters(chars)
        setSheetFields(fields)
        setWorldOptions(
  lore.filter(
    (item: LoreItem) =>
      item.category === "Mundo"
  )
)

        const userId = Number(localStorage.getItem("user_id"))
        setIsOwner(userId === rpg.owner_id)
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
      }
    }

    fetchAll()
  }, [rpgId, isValid])

  // ===============================
  // 🎯 SELECIONAR PERSONAGEM
  // ===============================
  async function handleSelectCharacter(char: Character) {
    setSelectedCharacter(char)

    try {
      const sheet = await getCharacterSheet(char.id)

      const formatted: Record<number, string> = {}

      sheet.forEach((item: CharacterSheetValue) => {
        formatted[item.field_id] = item.value
      })

      setSheetData(formatted)
    } catch {
      setSheetData({})
    }
  }

  // ===============================
  // ➕ CAMPO
  // ===============================
  async function handleCreateField() {
    if (!newFieldName.trim()) return

    const field = await createSheetField(rpgId, {
      name: newFieldName,
      field_type: newFieldType,
    })

    setSheetFields((prev) => [...prev, field])
    setNewFieldName("")
  }

  async function handleUpdateField(fieldId: number) {
    if (!editingFieldName.trim()) return

    const updated = await updateSheetField(fieldId, {
      name: editingFieldName,
    })

    setSheetFields((prev) =>
      prev.map((f) => (f.id === fieldId ? updated : f))
    )

    setEditingFieldId(null)
    setEditingFieldName("")
  }

  // ===============================
  // 🚀 CRIAR PERSONAGEM
  // ===============================
  async function handleCreateCharacter() {
    if (
  !newCharacterName.trim() ||
  !newCharacterHistory.trim() ||
  newCharacterWorldId === ""
) {
  return
}

    const payload: CharacterCreatePayload = {
  name: newCharacterName,
  history: newCharacterHistory,
  world_lore_id: Number(newCharacterWorldId),
  
  sheet: sheetFields.map((f) => ({
    field_id: f.id,
    value: sheetData[f.id] || "",
  })),
}

    const char = await createCharacter(rpgId, payload)
    let finalChar = char

if (newCharacterImageFile) {
  finalChar = await uploadCharacterImage(
    char.id,
    newCharacterImageFile
  )
}

    setCharacters((prev) => [...prev, finalChar])
    setNewCharacterName("")
    setNewCharacterHistory("")
setNewCharacterWorldId("")
setNewCharacterWorldId("")
setNewCharacterImageFile(null)
    setSheetData({})
  }

  // ===============================
  // 💾 SALVAR FICHA
  // ===============================
  async function handleSaveSheet() {
    if (!selectedCharacter) return

    const payload = sheetFields.map((f) => ({
      field_id: f.id,
      value: sheetData[f.id] || "",
    }))

    await saveCharacterSheet(selectedCharacter.id, payload)
  }

  function getInitial(name: string) {
  return name.charAt(0).toUpperCase()
}

function getWorldTitle(worldId?: number | null) {
  return (
    worldOptions.find(
      (w) => w.id === worldId
    )?.title ??
    "Mundo indefinido"
  )
}

function getHistoryPreview(
  history?: string | null
) {
  if (!history) {
    return "Sem história registrada."
  }

  return history.length > 80
    ? `${history.slice(0, 80)}...`
    : history
}
function openWorldLore(
  worldId?: number | null
) {
  if (!worldId) return

  navigate(
    `/rpg/${rpgId}?tab=lore#lore-${worldId}`
  )
}
function getCharacterImageUrl(
  imageUrl?: string | null
) {
  if (!imageUrl) return null

  if (imageUrl.startsWith("http")) {
    return imageUrl
  }

  return `http://127.0.0.1:8001/${imageUrl}`
}
  if (!isValid) return <div>RPG inválido</div>

  return (
  <div className="space-y-6 w-full max-w-full min-w-0 overflow-hidden text-gray-100">

    <div className="flex items-center justify-between ">
      <div>
        <h2 className="text-2xl font-display text-[#e0a96d]">
          Fichas
        </h2>

        <p className="text-sm text-[#c9ada7]/70">
          Crie, edite e acompanhe os personagens deste RPG.
        </p>
      </div>

      <div className="text-xs text-[#c9ada7]/60">
        {characters.length} personagem
        {characters.length === 1 ? "" : "s"}
      </div>
    </div>

    <div className="w-full min-w-0 space-y-6">

  {/* MAIN */}
  <div className="rpg-panel">

          {selectedCharacter ? (
            // ===============================
            // ✏️ EDITAR PERSONAGEM
            // ===============================
            <>
  <div
  className="
    relative
    overflow-hidden
    rounded-2xl
    border
    border-yellow-900/30
    bg-gradient-to-br
    from-[#241216]
    to-[#12090b]
    shadow-[0_0_25px_rgba(0,0,0,0.35)]
  "
>
  {getCharacterImageUrl(selectedCharacter.image_url) && (
    <div className="absolute inset-x-0 top-0 h-44 overflow-hidden">
      <img
        src={getCharacterImageUrl(selectedCharacter.image_url)!}
        alt={selectedCharacter.name}
        className="
          w-full
          h-full
          object-cover
          opacity-35
          blur-sm
          scale-110
        "
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#241216]/70 to-[#12090b]" />
    </div>
  )}

  <div className="relative z-10 p-6">
    {/* HEADER */}
    <div className="flex items-start gap-5 mb-8">
      <div
        className="
          w-20
          h-20
          rounded-full
          bg-gradient-to-br
          from-[#e0a96d]
          to-[#8b5e34]
          flex
          items-center
          justify-center
          text-3xl
          font-bold
          text-black
          shadow-lg
          shrink-0
          overflow-hidden
        "
      >
        {getCharacterImageUrl(selectedCharacter.image_url) ? (
  <img
    src={getCharacterImageUrl(selectedCharacter.image_url)!}
    alt={selectedCharacter.name}
    className="w-full h-full object-cover"
  />
) : (
  getInitial(selectedCharacter.name)
)}
      </div>

      <div className="min-w-0">
        <h2 className="text-3xl font-display text-[#e0a96d]">
          {selectedCharacter.name}
        </h2>

        <button
  type="button"
  onClick={() =>
    openWorldLore(
      selectedCharacter.world_lore_id
    )
  }
  className="
    inline-flex
    mt-2
    rounded-full
    border
    border-yellow-900/40
    bg-black/20
    px-3
    py-1
    text-sm
    text-[#e0a96d]
    hover:bg-yellow-900/20
    transition
  "
>
  {getWorldTitle(
    selectedCharacter.world_lore_id
  )}
</button>
      </div>
    </div>

    {/* HISTÓRIA */}
    <div
      className="
        rounded-2xl
        border
        border-[#3a1f24]
        bg-black/20
        p-5
        mb-8
      "
    >
      <div className="text-sm uppercase tracking-[0.2em] text-[#e0a96d]/70 mb-3">
        História
      </div>

      <p className="text-[#c9ada7] leading-relaxed whitespace-pre-wrap">
        {selectedCharacter.history ||
          "Sem história registrada."}
      </p>
    </div>

    {/* ATRIBUTOS */}
    <div>
      <div className="text-sm uppercase tracking-[0.2em] text-[#e0a96d]/70 mb-4">
        Atributos
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {sheetFields.map((field) => (
          <div
            key={field.id}
            className="
              rounded-xl
              border
              border-[#3a1f24]
              bg-black/15
              p-4
            "
          >
            <label className="block text-sm text-[#c9ada7]/70 mb-2">
              {field.name}
            </label>

            <input
              type={field.field_type}
              value={
                sheetData[field.id] || ""
              }
              onChange={(e) =>
                setSheetData({
                  ...sheetData,
                  [field.id]:
                    e.target.value,
                })
              }
              className="rpg-input w-full"
            />
          </div>
        ))}
      </div>
    </div>

    {/* BOTÕES */}
    <div className="flex gap-3 mt-8">
      <button
        onClick={handleSaveSheet}
        className="rpg-btn"
      >
        Salvar ficha
      </button>

      <button
        onClick={() => {
          setSelectedCharacter(null)
          setSheetData({})
        }}
        className="
          px-4 py-2
          rounded-lg
          border
          border-[#3a1f24]
          hover:bg-[#2a1519]
          transition
        "
      >
        ← Voltar
      </button>
        </div>
  </div>
</div>
</>
          ) : (
            // ===============================
            // ➕ CRIAR PERSONAGEM
            // ===============================
            <>
              <h2 className="text-xl font-display text-[#e0a96d]">
                Criar personagem
              </h2>

              <input
                placeholder="Nome do personagem"
                value={newCharacterName}
                onChange={(e) => setNewCharacterName(e.target.value)}
                className="rpg-input w-full mb-3"
              />
              <label className="text-sm text-[#c9ada7]">
  Imagem do personagem
</label>

<input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setNewCharacterImageFile(
      e.target.files?.[0] ?? null
    )
  }
  className="rpg-input w-full mb-3"
/>
              <label className="text-sm text-[#c9ada7]">
  Mundo
</label>

<select
  value={newCharacterWorldId}
  onChange={(e) =>
    setNewCharacterWorldId(
      e.target.value
        ? Number(e.target.value)
        : ""
    )
  }
  className="rpg-input w-full mb-3"
>
  <option value="">
    Selecione um mundo
  </option>

  {worldOptions.map((world) => (
    <option
      key={world.id}
      value={world.id}
    >
      {world.title}
    </option>
  ))}
</select>

<label className="text-sm text-[#c9ada7]">
  História
</label>

<textarea
  placeholder="Conte a história do personagem..."
  value={newCharacterHistory}
  onChange={(e) =>
    setNewCharacterHistory(e.target.value)
  }
  className="rpg-input w-full mb-3 min-h-[120px] resize-y"
/>
              {sheetFields.map((field) => (
                <div key={field.id} className="mb-2">
                  <label>{field.name}</label>

                  <input
                    type={field.field_type}
                    value={sheetData[field.id] || ""}
                    onChange={(e) =>
                      setSheetData({
                        ...sheetData,
                        [field.id]: e.target.value,
                      })
                    }
                    className="rpg-input w-full"
                  />
                </div>
              ))}

              <button
                onClick={handleCreateCharacter}
                className="rpg-btn w-full mt-3"
              >
                Criar personagem
              </button>

              {/* 👑 CAMPOS */}
              {isOwner && (
                <div className="mt-6 border-t pt-4">
                  <h2 className="text-xl font-display text-[#e0a96d]">
                    Campos da ficha
                  </h2>

                  <div className="flex gap-2 mb-3">
                    <input
                      placeholder="Nome do campo"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      className="rpg-input"
                    />

                    <select
                      value={newFieldType}
                      onChange={(e) =>
                        setNewFieldType(e.target.value as "text" | "number")
                      }
                      className="rpg-input"
                    >
                      <option value="text">Texto</option>
                      <option value="number">Número</option>
                    </select>

                    <button onClick={handleCreateField} className="rpg-btn">
                      +
                    </button>
                  </div>

                  {sheetFields.map((f) => (
                    <div key={f.id} className="flex gap-2">
                      {editingFieldId === f.id ? (
                        <>
                          <input
                            value={editingFieldName}
                            onChange={(e) => setEditingFieldName(e.target.value)}
                            className="rpg-input flex-1"
                          />
                          <button onClick={() => handleUpdateField(f.id)}>
                            ✔
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1">{f.name}</span>
                          <button
                            onClick={() => {
                              setEditingFieldId(f.id)
                              setEditingFieldName(f.name)
                            }}
                            className="text-[#e0a96d]"
                          >
                            Editar
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
               </div>

       
        {/* 🎠 CARROSSÉIS */}
<div className="rpg-panel space-y-8 w-full max-w-full min-w-0 overflow-hidden text-gray-100">
  <section>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-display text-[#e0a96d]">
        Meus personagens
      </h3>

      <span className="text-xs text-[#c9ada7]/50">
        {myCharacters.length}
      </span>
    </div>

    <div className="w-full max-w-full min-w-0 overflow-x-auto overflow-y-hidden pb-3">
      <div className="flex gap-4 w-max">
        {myCharacters.length === 0 ? (
          <p className="text-sm text-[#c9ada7]/60">
            Você ainda não criou personagens.
          </p>
        ) : (
          myCharacters.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCharacter(c)}
              className="
                group
                min-w-[220px]
                max-w-[220px]
                shrink-0
                rounded-2xl
                border
                border-yellow-900/40
                bg-gradient-to-br
                from-[#2a1519]
                to-[#140b0d]
                p-4
                text-left
                hover:border-[#e0a96d]/70
                hover:shadow-[0_0_18px_rgba(224,169,109,0.18)]
                transition-all
                duration-300
              "
            >
              <div className="flex items-center gap-3 mb-4">
                <div
  className="
    w-12
    h-12
    rounded-full
    overflow-hidden
    bg-gradient-to-br
    from-[#e0a96d]
    to-[#8b5e34]
    text-black
    font-bold
    text-lg
    flex
    items-center
    justify-center
    shadow
    shrink-0
  "
>
  {getCharacterImageUrl(c.image_url) ? (
    <img
      src={getCharacterImageUrl(c.image_url)!}
      alt={c.name}
      className="w-full h-full object-cover"
    />
  ) : (
    getInitial(c.name)
  )}
</div>

                <div className="min-w-0">
                  <div className="text-[#e0a96d] font-semibold truncate">
                    {c.name}
                  </div>

                  <div className="text-[11px] text-[#c9ada7]/60">
                    Sua ficha
                  </div>
                </div>
              </div>

              <div
                className="
                  inline-flex
                  max-w-full
                  rounded-full
                  border
                  border-yellow-900/40
                  bg-black/25
                  px-2
                  py-1
                  text-[11px]
                  text-[#e0a96d]
                  mb-3
                "
              >
                <span className="truncate">
                  {getWorldTitle(c.world_lore_id)}
                </span>
              </div>

              <p className="text-xs text-[#c9ada7]/70 leading-relaxed line-clamp-3">
                {getHistoryPreview(c.history)}
              </p>

              <div className="mt-4 text-[11px] text-[#e0a96d]/70 opacity-0 group-hover:opacity-100 transition">
                Abrir ficha →
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  </section>

  <section>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-display text-[#e0a96d]">
        Outros personagens
      </h3>

      <span className="text-xs text-[#c9ada7]/50">
        {otherCharacters.length}
      </span>
    </div>

    <div className="w-full max-w-full min-w-0 overflow-x-auto overflow-y-hidden pb-3">
      <div className="flex gap-4 w-max">
        {otherCharacters.length === 0 ? (
          <p className="text-sm text-[#c9ada7]/60">
            Nenhum personagem de outros usuários.
          </p>
        ) : (
          otherCharacters.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCharacter(c)}
              className="
                group
                min-w-[220px]
                max-w-[220px]
                shrink-0
                rounded-2xl
                border
                border-[#3a1f24]
                bg-gradient-to-br
                from-black/30
                to-[#1a0f12]
                p-4
                text-left
                hover:border-[#e0a96d]/50
                hover:bg-[#2a1519]
                transition-all
                duration-300
              "
            >
              <div className="flex items-center gap-3 mb-4">
                <div
  className="
    w-12
    h-12
    rounded-full
    overflow-hidden
    bg-gradient-to-br
    from-[#e0a96d]
    to-[#8b5e34]
    text-black
    font-bold
    text-lg
    flex
    items-center
    justify-center
    shadow
    shrink-0
  "
>
  {getCharacterImageUrl(c.image_url) ? (
    <img
      src={getCharacterImageUrl(c.image_url)!}
      alt={c.name}
      className="w-full h-full object-cover"
    />
  ) : (
    getInitial(c.name)
  )}
</div>

                <div className="min-w-0">
                  <div className="text-[#e0a96d] font-semibold truncate">
                    {c.name}
                  </div>

                  <div className="text-[11px] text-[#c9ada7]/60">
                    Outro jogador
                  </div>
                </div>
              </div>

              <div
                className="
                  inline-flex
                  max-w-full
                  rounded-full
                  border
                  border-[#3a1f24]
                  bg-black/25
                  px-2
                  py-1
                  text-[11px]
                  text-[#c9ada7]/70
                  mb-3
                "
              >
                <span className="truncate">
                  {getWorldTitle(c.world_lore_id)}
                </span>
              </div>

              <p className="text-xs text-[#c9ada7]/65 leading-relaxed line-clamp-3">
                {getHistoryPreview(c.history)}
              </p>

              <div className="mt-4 text-[11px] text-[#e0a96d]/70 opacity-0 group-hover:opacity-100 transition">
                Ver ficha →
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  </section>
</div>
      </div>
    </div>
  )
}