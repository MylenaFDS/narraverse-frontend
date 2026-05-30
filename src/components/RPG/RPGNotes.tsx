import {
  useEffect,
  useState,
} from "react"

import {
  getRPGNotes,
  createRPGNote,
  updateRPGNote,
deleteRPGNote
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
    const [editingId, setEditingId] =
  useState<number | null>(null)

const [editTitle, setEditTitle] =
  useState("")

const [editContent, setEditContent] =
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

  function startEditing(note: Note) {
  setEditingId(note.id)
  setEditTitle(note.title || "")
  setEditContent(note.content || "")
}

async function handleUpdate(noteId: number) {
  const updated = await updateRPGNote(noteId, {
    title: editTitle,
    content: editContent,
  })

  setNotes((prev) =>
    prev.map((note) =>
      note.id === noteId ? updated : note
    )
  )

  setEditingId(null)
  setEditTitle("")
  setEditContent("")
}

async function handleDelete(noteId: number) {
  const confirmed = window.confirm(
    "Tem certeza que deseja excluir esta anotação?"
  )

  if (!confirmed) return

  await deleteRPGNote(noteId)

  setNotes((prev) =>
    prev.filter((note) => note.id !== noteId)
  )
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
            {editingId === note.id ? (
  <div className="space-y-2">
    <input
      value={editTitle}
      onChange={(e) =>
        setEditTitle(e.target.value)
      }
      className="rpg-input"
    />

    <textarea
      value={editContent}
      onChange={(e) =>
        setEditContent(e.target.value)
      }
      className="rpg-input"
    />

    <div className="flex gap-2">
      <button
        onClick={() => handleUpdate(note.id)}
        className="rpg-btn text-sm px-3 py-1"
      >
        Salvar
      </button>

      <button
        onClick={() => setEditingId(null)}
        className="text-sm text-[#c9ada7]"
      >
        Cancelar
      </button>
    </div>
  </div>
) : (
  <>
    <div className="font-semibold text-[#e0a96d]">
      {note.title || "Sem título"}
    </div>

    <div className="text-sm text-[#c9ada7]/80 mt-1 whitespace-pre-wrap">
      {note.content}
    </div>

    {isOwner && (
      <div className="flex gap-3 mt-3 text-xs">
        <button
          onClick={() => startEditing(note)}
          className="text-[#e0a96d]"
        >
          Editar
        </button>

        <button
          onClick={() => handleDelete(note.id)}
          className="text-red-400"
        >
          Excluir
        </button>
      </div>
    )}
  </>
)}
          </div>
        ))}
      </div>
    </div>
  )
}