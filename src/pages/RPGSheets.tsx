import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { getCharacters, createCharacter } from "../services/characters"
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
} from "../types/character"

export default function RPGSheets() {
  const { id } = useParams()
  const rpgId = Number(id)

  const [characters, setCharacters] = useState<Character[]>([])
  const [sheetFields, setSheetFields] = useState<RPGSheetField[]>([])
  const [sheetData, setSheetData] = useState<Record<number, string>>({})

  const [newCharacterName, setNewCharacterName] = useState("")

  const [isOwner, setIsOwner] = useState(false)

  const [newFieldName, setNewFieldName] = useState("")
  const [newFieldType, setNewFieldType] = useState<"text" | "number">("text")

  const [editingFieldId, setEditingFieldId] = useState<number | null>(null)
  const [editingFieldName, setEditingFieldName] = useState("")

  const isValid = id && !isNaN(rpgId)

  useEffect(() => {
    if (!isValid) return

    async function fetchAll() {
      const [chars, fields, rpg] = await Promise.all([
        getCharacters(rpgId),
        getSheetFields(rpgId),
        getRPG(rpgId),
      ])

      setCharacters(chars)
      setSheetFields(fields)

      const userId = Number(localStorage.getItem("user_id"))
      setIsOwner(userId === rpg.owner_id)
    }

    fetchAll()
  }, [rpgId, isValid])

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
    const updated = await updateSheetField(fieldId, {
      name: editingFieldName,
    })

    setSheetFields((prev) =>
      prev.map((f) => (f.id === fieldId ? updated : f))
    )

    setEditingFieldId(null)
  }

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

  if (!isValid) return <div>RPG inválido</div>

  return (
    <div className="rpg-bg min-h-screen p-6">
      <div className="rpg-layout max-w-5xl mx-auto">

        {/* MAIN */}
        <div className="rpg-panel flex-1">

          <h2 className="text-xl font-display text-[#e0a96d]">
            Criar personagem
          </h2>

          <input
            placeholder="Nome"
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
            className="rpg-btn w-full mt-3 text-xl font-display text-[#e0a96d]"
          >
            Criar personagem
          </button>

          {/* OWNER */}
          {isOwner && (
            <div className="mt-6 border-t pt-4">
              <h2 className="text-xl font-display text-[#e0a96d]">
            Campos da ficha
          </h2>
              

              <div className="flex gap-2 mb-3">
                <input
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="rpg-input"
                />

                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as "text" | "number")}
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
                        onClick ={() => {
                          setEditingFieldId(f.id)
                          setEditingFieldName(f.name)
                        }}
                      className="text-xl font-display text-[#e0a96d]">
                        editar
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
       
        {/* SIDEBAR */}
        <div className="rpg-sidebar">
          <div className="rpg-panel">
            {characters.map((c) => (
              <div key={c.id}>{c.name}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}