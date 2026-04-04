import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import {
  getCharacters,
  createCharacter,
  getCharacterSheet,
  saveCharacterSheet,
} from "../services/characters"

import { getSheetFields } from "../services/api"

import type { Character, RPGSheetField } from "../types/character"

export default function RPGSheets() {
  const { id } = useParams()
  const rpgId = Number(id)

  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  const [sheetFields, setSheetFields] = useState<RPGSheetField[]>([])
  const [sheetData, setSheetData] = useState<Record<string, string>>({})

  const [newCharacterName, setNewCharacterName] = useState("")

  const isValid = id && !isNaN(rpgId)

  // ===============================
  // 🔥 FETCH INICIAL
  // ===============================
  useEffect(() => {
    if (!isValid) return

    async function fetchAll() {
      try {
        const [chars, fields] = await Promise.all([
          getCharacters(rpgId),
          getSheetFields(rpgId),
        ])

        setCharacters(chars)
        setSheetFields(fields)
      } catch (err) {
        console.error(err)
      }
    }

    fetchAll()
  }, [rpgId, isValid])

  // ===============================
  // 🎯 SELECT CHARACTER
  // ===============================
  async function handleSelectCharacter(char: Character) {
    setSelectedCharacter(char)

    try {
      const sheet = await getCharacterSheet(char.id)
      setSheetData(sheet.data || {})
    } catch (err) {
      console.error(err)
    }
  }

  // ===============================
  // ➕ CREATE CHARACTER
  // ===============================
  async function handleCreateCharacter() {
    if (!newCharacterName.trim()) return

    try {
      const char = await createCharacter(rpgId, {
        name: newCharacterName,
      })

      setCharacters((prev) => [...prev, char])
      setNewCharacterName("")
    } catch (err) {
      console.error(err)
    }
  }

  // ===============================
  // 💾 SAVE SHEET
  // ===============================
  async function handleSaveSheet() {
    if (!selectedCharacter) return

    try {
      const payload = Object.entries(sheetData).map(
        ([key, value]) => ({
          field_name: key,
          value: String(value),
        })
      )

      await saveCharacterSheet(selectedCharacter.id, payload)
    } catch (err) {
      console.error(err)
    }
  }

  if (!isValid) return <div>RPG inválido</div>

  return (
    <div className="rpg-bg min-h-screen p-6">

      <div className="rpg-panel max-w-5xl mx-auto mb-6">
        <h2 className="text-2xl">Fichas do RPG #{rpgId}</h2>
      </div>

      <div className="rpg-layout max-w-5xl mx-auto">

        {/* ESQUERDA - FICHA */}
        <div className="rpg-panel flex-1">

          {selectedCharacter ? (
            <>
              <h3 className="text-xl mb-4">{selectedCharacter.name}</h3>

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
                className="rpg-btn mt-4"
              >
                Salvar
              </button>
            </>
          ) : (
            <p>Selecione um personagem</p>
          )}
        </div>

        {/* DIREITA - LISTA */}
        <div className="rpg-panel w-64">

          <input
            value={newCharacterName}
            onChange={(e) => setNewCharacterName(e.target.value)}
            placeholder="Novo personagem..."
            className="rpg-input mb-2"
          />

          <button
            onClick={handleCreateCharacter}
            className="rpg-btn w-full mb-4"
          >
            Criar
          </button>

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
  )
}