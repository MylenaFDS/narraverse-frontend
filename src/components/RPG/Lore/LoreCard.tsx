import type { Lore } from "../../../types/lore"

type Props = {
  item: Lore

  isOwner: boolean

  editingId: number | null

  editTitle: string
  editContent: string

  setEditTitle: React.Dispatch<
    React.SetStateAction<string>
  >

  setEditContent: React.Dispatch<
    React.SetStateAction<string>
  >

  setEditingId: React.Dispatch<
    React.SetStateAction<number | null>
  >

  handleSaveEdit: (id: number) => void

  handleDelete: (id: number) => void

  handleDragStart: (id: number) => void

  handleDrop: (id: number) => void
}

export default function LoreCard({
  item,
  isOwner,
  editingId,
  editTitle,
  editContent,
  setEditTitle,
  setEditContent,
  setEditingId,
  handleSaveEdit,
  handleDelete,
  handleDragStart,
  handleDrop,
}: Props) {
  return (
    <div
      id={`lore-${item.id}`}
      draggable={isOwner || false}
      onDragStart={() =>
        handleDragStart(item.id)
      }
      onDragOver={(e) =>
        e.preventDefault()
      }
      onDrop={() =>
        handleDrop(item.id)
      }
      className="
        group
        bg-[#18181b]
        border
        border-[#26262c]
        hover:border-[#3a3a45]
        rounded-2xl
        p-5
        transition
      "
    >
      {editingId === item.id ? (
        <>
          <input
            value={editTitle}
            onChange={(e) =>
              setEditTitle(
                e.target.value
              )
            }
            className="
              w-full
              bg-[#232329]
              border
              border-[#32323a]
              rounded-lg
              p-2
              mb-3
              text-xl
              font-bold
            "
          />

          <textarea
            value={editContent}
            onChange={(e) =>
              setEditContent(
                e.target.value
              )
            }
            className="
              w-full
              bg-[#232329]
              border
              border-[#32323a]
              rounded-lg
              p-3
              min-h-[160px]
            "
          />

          <div className="flex gap-2 mt-4">
            <button
              onClick={() =>
                handleSaveEdit(item.id)
              }
              className="
                bg-green-600
                hover:bg-green-500
                px-4
                py-2
                rounded-lg
              "
            >
              Salvar
            </button>

            <button
              onClick={() =>
                setEditingId(null)
              }
              className="
                bg-gray-700
                hover:bg-gray-600
                px-4
                py-2
                rounded-lg
              "
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-3">
              {item.title}
            </h3>

            <p
              className="
                text-gray-300
                whitespace-pre-wrap
                leading-relaxed
              "
            >
              {item.content}
            </p>
          </div>

          {isOwner && (
            <div
              className="
                mt-5
                pt-4
                border-t
                border-[#2a2a30]
                opacity-0
                group-hover:opacity-100
                transition-all
                duration-200
                flex
                items-center
                gap-2
              "
            >
              {/* EDITAR */}
              <button
                onClick={() => {
                  setEditingId(item.id)

                  setEditTitle(
                    item.title
                  )

                  setEditContent(
                    item.content
                  )
                }}
                className="
                  flex
                  items-center
                  gap-2
                  bg-[#232329]
                  hover:bg-yellow-500/15
                  border
                  border-[#34343c]
                  hover:border-yellow-500/40
                  text-gray-300
                  hover:text-yellow-300
                  px-3
                  py-2
                  rounded-xl
                  transition-all
                  duration-200
                  shadow-sm
                  hover:shadow-yellow-500/10
                "
              >
                <span className="text-sm">
                  ✏️
                </span>

                <span className="text-sm font-medium">
                  Editar
                </span>
              </button>

              {/* DELETAR */}
              <button
                onClick={() =>
                  handleDelete(item.id)
                }
                className="
                  flex
                  items-center
                  gap-2
                  bg-[#232329]
                  hover:bg-red-500/15
                  border
                  border-[#34343c]
                  hover:border-red-500/40
                  text-gray-300
                  hover:text-red-300
                  px-3
                  py-2
                  rounded-xl
                  transition-all
                  duration-200
                  shadow-sm
                  hover:shadow-red-500/10
                "
              >
                <span className="text-sm">
                  🗑️
                </span>

                <span className="text-sm font-medium">
                  Excluir
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}