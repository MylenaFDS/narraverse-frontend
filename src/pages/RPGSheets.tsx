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
  getRPG,
} from "../services/api"

import type { Character, RPGSheetField } from "../types/character"

export default function RPGSheets() {
  const { id } = useParams()
  const rpgId = Number(id)

  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  const [sheetFields, setSheetFields] = useState<RPGSheetField[]>([])
  const [sheetData, setSheetData] = useState<Record<string, string>>({})

  const [newCharacterName, setNewCharacterName] = useState("")

  const [isOwner, setIsOwner] = useState(false)

  const [newFieldName, setNewFieldName] = useState("")
  const [newFieldType, setNewFieldType] = useState("text")

  const isValid = id && !isNaN(rpgId)

  // ===============================
  // 🔥 FETCH
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

        setCharacters(chars || [])
        setSheetFields(fields || [])

        const userId = Number(localStorage.getItem("user_id"))
        setIsOwner(userId === rpg.owner_id)
      } catch (error) {
        console.error(error)
      }
    }

    fetchAll()
  }, [rpgId, isValid])

  // ===============================
  // ➕ CRIAR CAMPO
  // ===============================
  async function handleCreateField() {
    if (!newFieldName.trim()) return

    try {
      const field = await createSheetField(rpgId, {
        name: newFieldName,
        field_type: newFieldType as "text" | "number",
      })

      setSheetFields((prev) => [...prev, field])
      setNewFieldName("")
    } catch (error) {
      console.error(error)
    }
  }

  // ===============================
  // 🎯 SELECIONAR PERSONAGEM
  // ===============================
  async function handleSelectCharacter(char: Character) {
    setSelectedCharacter(char)

    try {
      const sheet = await getCharacterSheet(char.id)
      setSheetData(sheet?.data || {})
    } catch {
      setSheetData({})
    }
  }

  // ===============================
  // 🚀 CRIAR PERSONAGEM + SALVAR FICHA
  // ===============================
  async function handleCreateCharacter() {
    if (!newCharacterName.trim()) return

    try {
      const char = await createCharacter(rpgId, {
        name: newCharacterName,
      })

      // 🔥 salva ficha automaticamente após criar
      const payload = Object.entries(sheetData).map(([key, value]) => ({
        field_name: key,
        value: String(value),
      }))

      if (payload.length > 0) {
        await saveCharacterSheet(char.id, payload)
      }

      setCharacters((prev) => [...prev, char])
      setNewCharacterName("")
      setSheetData({})
    } catch (error) {
      console.error(error)
    }
  }

  // ===============================
  // 💾 SALVAR FICHA
  // ===============================
  async function handleSaveSheet() {
    if (!selectedCharacter) return

    try {
      const payload = Object.entries(sheetData).map(([key, value]) => ({
        field_name: key,
        value: String(value),
      }))

      await saveCharacterSheet(selectedCharacter.id, payload)
    } catch (error) {
      console.error(error)
    }
  }

  if (!isValid) return <div>RPG inválido</div>

  return (
    <div className="rpg-bg min-h-screen p-6">
      <div className="rpg-layout max-w-5xl mx-auto">

        {/* 🧾 PAINEL PRINCIPAL */}
        <div className="rpg-panel flex-1">

          {/* 🔥 CRIAR PERSONAGEM */}
          <div className="mb-6">
            <h2 className="text-xl font-display text-accent mb-3">
              Criar personagem
            </h2>

            <input
              placeholder="Nome do personagem"
              value={newCharacterName}
              onChange={(e) => setNewCharacterName(e.target.value)}
              className="rpg-input w-full mb-3"
            />

            {/* 🧾 CAMPOS PARA PREENCHER */}
            {sheetFields.length > 0 && (
              <div className="space-y-3 mb-4">
                {sheetFields.map((field) => (
                  <div key={field.id}>
                    <label className="text-sm text-textSoft">
                      {field.name}
                    </label>

                    <input
                      type={field.field_type === "number" ? "number" : "text"}
                      value={sheetData[field.name] || ""}
                      onChange={(e) =>
                        setSheetData({
                          ...sheetData,
                          [field.name]: e.target.value,
                        })
                      }
                      className="rpg-input w-full"
                    />
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleCreateCharacter}
              className="rpg-btn w-full mb-4"
            >
              Criar personagem
            </button>

            {/* 👑 CRIAR CAMPOS (DONO) */}
            {isOwner && (
              <div className="border-t border-border pt-4">
                <h3 className="text-xl font-display text-accent mb-3">
                  Criar campos da ficha
                </h3>

                <div className="flex gap-2 mb-3">
                  <input
                    placeholder="Nome do campo"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    className="rpg-input flex-1"
                  />

                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value)}
                    className="rpg-input"
                  >
                    <option value="text">Texto</option>
                    <option value="number">Número</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleCreateField}
                    className="rpg-btn"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs text-textSoft">
                  {sheetFields.map((f) => (
                    <div key={f.id}>• {f.name}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 📄 EDITAR FICHA */}
          <div className="border-t border-border pt-4">
            {selectedCharacter ? (
              <>
                <h2 className="text-lg font-display text-accent mb-3">
                  {selectedCharacter.name}
                </h2>

                <div className="space-y-3">
                  {sheetFields.map((field) => (
                    <div key={field.id}>
                      <label className="text-sm text-textSoft">
                        {field.name}
                      </label>

                      <input
                        type={field.field_type === "number" ? "number" : "text"}
                        value={sheetData[field.name] || ""}
                        onChange={(e) =>
                          setSheetData({
                            ...sheetData,
                            [field.name]: e.target.value,
                          })
                        }
                        className="rpg-input w-full"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSaveSheet}
                  className="rpg-btn mt-4 w-full"
                >
                  Salvar ficha
                </button>
              </>
            ) : (
              <p className="text-textSoft text-sm">
                Selecione um personagem para editar a ficha
              </p>
            )}
          </div>
        </div>

        {/* 👥 SIDEBAR */}
        <div className="rpg-sidebar">
          <div className="rpg-panel">
            <h3 className="font-display text-accent mb-3">
              Personagens
            </h3>

            <div className="space-y-2">
              {characters.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectCharacter(c)}
                  className="cursor-pointer hover:bg-[#2b2d31] p-2 rounded"
                >
                  {c.name}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
