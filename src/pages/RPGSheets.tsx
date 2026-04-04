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

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const isValid = id && !isNaN(rpgId)

  // ===============================
  // 🔥 FETCH INICIAL
  // ===============================
  useEffect(() => {
    if (!isValid) return

    async function fetchAll() {
      try {
        setLoading(true)

        const [chars, fields, rpg] = await Promise.all([
          getCharacters(rpgId),
          getSheetFields(rpgId),
          getRPG(rpgId),
        ])

        setCharacters(chars || [])
        setSheetFields(fields || [])

        const userId = Number(localStorage.getItem("user_id"))
        setIsOwner(userId === rpg.owner_id)

      } catch (err) {
        console.error("Erro ao carregar dados:", err)
      } finally {
        setLoading(false)
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
        field_type: newFieldType,
      })

      setSheetFields((prev) => [...prev, field])
      setNewFieldName("")
      setNewFieldType("text")
    } catch (err) {
      console.error("Erro ao criar campo:", err)
    }
  }

  // ===============================
  // 🎯 PERSONAGEM
  // ===============================
  async function handleSelectCharacter(char: Character) {
    try {
      setSelectedCharacter(char)

      const sheet = await getCharacterSheet(char.id)
      setSheetData(sheet?.data || {})
    } catch (err) {
      console.error("Erro ao carregar ficha:", err)
      setSheetData({})
    }
  }

  async function handleCreateCharacter() {
    if (!newCharacterName.trim()) return

    try {
      const char = await createCharacter(rpgId, {
        name: newCharacterName,
      })

      setCharacters((prev) => [...prev, char])
      setNewCharacterName("")
    } catch (err) {
      console.error("Erro ao criar personagem:", err)
    }
  }

  async function handleSaveSheet() {
    if (!selectedCharacter) return

    try {
      setSaving(true)

      const payload = Object.entries(sheetData).map(
        ([key, value]) => ({
          field_name: key,
          value: String(value),
        })
      )

      await saveCharacterSheet(selectedCharacter.id, payload)

    } catch (err) {
      console.error("Erro ao salvar ficha:", err)
    } finally {
      setSaving(false)
    }
  }

  if (!isValid) return <div>RPG inválido</div>

  if (loading) {
    return (
      <div className="rpg-bg min-h-screen flex items-center justify-center">
        <p>Carregando fichas...</p>
      </div>
    )
  }

  return (
    <div className="rpg-bg min-h-screen p-6">
      <div className="max-w-5xl mx-auto flex gap-6">

        {/* 🧾 FICHA */}
        <div className="rpg-panel flex-1">

          {/* 👑 CONFIGURAR CAMPOS */}
          {isOwner && (
            <div className="mb-6 border-b pb-4">
              <h3 className="mb-2">Configurar ficha</h3>

              <div className="flex gap-2">
                <input
                  placeholder="Nome do campo"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="rpg-input"
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
                  onClick={handleCreateField}
                  className="rpg-btn"
                >
                  Criar
                </button>
              </div>
            </div>
          )}

          {/* 📄 FICHA */}
          {selectedCharacter ? (
            <>
              <h3 className="mb-4">{selectedCharacter.name}</h3>

              {sheetFields.length === 0 && (
                <p className="text-sm opacity-70">
                  Nenhum campo definido ainda.
                </p>
              )}

              {sheetFields.map((field) => (
                <div key={field.id} className="mb-3">
                  <label className="block text-sm mb-1">
                    {field.name}
                  </label>

                  <input
                    type={field.field_type === "number" ? "number" : "text"}
                    value={sheetData[field.name] || ""}
                    onChange={(e) =>
                      setSheetData((prev) => ({
                        ...prev,
                        [field.name]: e.target.value,
                      }))
                    }
                    className="rpg-input w-full"
                  />
                </div>
              ))}

              <button
                onClick={handleSaveSheet}
                className="rpg-btn mt-3"
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar ficha"}
              </button>
            </>
          ) : (
            <p>Selecione um personagem</p>
          )}
        </div>

        {/* 👥 PERSONAGENS */}
        <div className="rpg-panel w-64">
          <input
            value={newCharacterName}
            onChange={(e) => setNewCharacterName(e.target.value)}
            placeholder="Novo personagem"
            className="rpg-input"
          />

          <button
            onClick={handleCreateCharacter}
            className="rpg-btn mt-2"
          >
            Criar
          </button>

          <div className="mt-4 space-y-2">
            {characters.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectCharacter(c)}
                className={`cursor-pointer p-1 rounded ${
                  selectedCharacter?.id === c.id
                    ? "bg-[#2b2d31]"
                    : ""
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