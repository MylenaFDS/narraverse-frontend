import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import {
  getCharacters,
  createCharacter,
  getCharacterSheet,
  saveCharacterSheet,
} from "../services/characters"

import {
  getSheetFields,
  createSheetField,
  updateSheetField,
  getRPG,
} from "../services/api"

import type {
  Character,
  RPGSheetField,
  CharacterCreatePayload,
  CharacterSheetValue,
} from "../types/character"

export default function RPGSheets() {
  const { id } = useParams()
  const rpgId = Number(id)

  const [characters, setCharacters] = useState<Character[]>([])
  const [sheetFields, setSheetFields] = useState<RPGSheetField[]>([])
  const [sheetData, setSheetData] = useState<Record<number, string>>({})

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  const [newCharacterName, setNewCharacterName] = useState("")

  const [isOwner, setIsOwner] = useState(false)

  const [newFieldName, setNewFieldName] = useState("")
  const [newFieldType, setNewFieldType] = useState<"text" | "number">("text")

  const [editingFieldId, setEditingFieldId] = useState<number | null>(null)
  const [editingFieldName, setEditingFieldName] = useState("")

  const isValid = id && !isNaN(rpgId)

  // ===============================
  // FETCH
  // ===============================
  useEffect(() => {
    if (!isValid) return

    async function fetchAll() {
      try {
        const [chars, fields, rpg] = await Promise.all([
          getCharacters(rpgId),
          getSheetFields(rpgId),
          getRPG(rpgId),
        ])

        setCharacters(chars)
        setSheetFields(fields)

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
    if (!newCharacterName.trim()) return

    const payload: CharacterCreatePayload = {
      name: newCharacterName,
      sheet: sheetFields.map((f) => ({
        field_id: f.id,
        value: sheetData[f.id] || "",
      })),
    }

    const char = await createCharacter(rpgId, payload)

    setCharacters((prev) => [...prev, char])
    setNewCharacterName("")
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

  if (!isValid) return <div>RPG inválido</div>

  return (
    <div className="rpg-bg min-h-screen p-6">
      <div className="rpg-layout max-w-5xl mx-auto">

        {/* MAIN */}
        <div className="rpg-panel flex-1">

          {selectedCharacter ? (
            // ===============================
            // ✏️ EDITAR PERSONAGEM
            // ===============================
            <>
              <h2 className="text-xl font-display text-[#e0a96d] mb-3">
                {selectedCharacter.name}
              </h2>

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
                onClick={handleSaveSheet}
                className="rpg-btn w-full mt-3"
              >
                Salvar ficha
              </button>

              <button
                onClick={() => {
                  setSelectedCharacter(null)
                  setSheetData({})
                }}
                className="text-sm mt-3 text-[#c9ada7]"
              >
                ← Voltar
              </button>
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

        {/* SIDEBAR */}
        <div className="rpg-sidebar">
          <div className="rpg-panel">
            <h2 className="text-xl font-display text-[#e0a96d]">
              Personagens
            </h2>

            {characters.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectCharacter(c)}
                className={`cursor-pointer p-2 rounded ${
                  selectedCharacter?.id === c.id
                    ? "bg-[#3a1f24]"
                    : "hover:bg-[#2b2d31]"
                }`}
              >
                {c.name}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}