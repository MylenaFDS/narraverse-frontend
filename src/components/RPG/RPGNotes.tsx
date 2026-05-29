import {
  useEffect,
  useState,
} from "react"

import {
  getRPGNotes,
  createRPGNote,
} from "../../services/api"

type Props = {
  rpgId: number
  isOwner: boolean
}

type Note = {
  id: number
  title?: string
  content?: string
}

export default function RPGNotes({
  rpgId,
  isOwner,
}: Props) {
  const [notes, setNotes] =
    useState<Note[]>([])

  const [title, setTitle] =
    useState("")

  const [content, setContent] =
    useState("")

  useEffect(() => {
    getRPGNotes(rpgId)
      .then(setNotes)
      .catch(console.error)
  }, [rpgId])

  async function handleCreate() {
    const note =
      await createRPGNote(
        rpgId,
        {
          title,
          content,
        }
      )

    setNotes((prev) => [
      note,
      ...prev,
    ])

    setTitle("")
    setContent("")
  }

  return (
    <div className="rpg-panel">
      <h3 className="text-xl font-display text-[#e0a96d] mb-4">
        Anotações
      </h3>

      {isOwner && (
        <>
          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Título"
            className="rpg-input mb-2"
          />

          <textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            placeholder="Anotação..."
            className="rpg-input mb-2"
          />

          <button
            onClick={handleCreate}
            className="rpg-btn w-full mb-4"
          >
            Criar anotação
          </button>
        </>
      )}

      <div className="space-y-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className="
              rounded-xl
              border
              border-[#e0a96d]/10
              bg-black/20
              p-3
            "
          >
            <div className="font-semibold text-[#e0a96d]">
              {note.title}
            </div>

            <div className="text-sm text-[#c9ada7]/80 mt-1">
              {note.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}