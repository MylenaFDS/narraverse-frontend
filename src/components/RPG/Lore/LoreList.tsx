

import type { Lore } from "../../../types/lore"
import LoreCard from "./LoreCard"

type Props = {
  grouped: Record<string, Lore[]>

  filterItem: (item: Lore) => boolean

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

export default function LoreList({
  grouped,
  filterItem,
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
    <div className="space-y-10">
      {Object.keys(grouped).map(
        (cat) => (
          <div key={cat}>
            {/* HEADER DA CATEGORIA */}
            <div
              className="
                sticky
                top-0
                z-10
                bg-[#0f0f12]
                py-3
                mb-4
                border-b
                border-[#2a2a30]
              "
            >
              <h2 className="text-2xl font-black">
                📂 {cat}
              </h2>
            </div>

            {/* LISTA */}
            <div className="space-y-3">
              {grouped[cat]
                .filter(filterItem)
                .map((item) => (
                  <LoreCard
                    key={item.id}
                    item={item}
                    isOwner={isOwner}
                    editingId={editingId}
                    editTitle={editTitle}
                    editContent={editContent}
                    setEditTitle={setEditTitle}
                    setEditContent={setEditContent}
                    setEditingId={setEditingId}
                    handleSaveEdit={
                      handleSaveEdit
                    }
                    handleDelete={
                      handleDelete
                    }
                    handleDragStart={
                      handleDragStart
                    }
                    handleDrop={
                      handleDrop
                    }
                  />
                ))}
            </div>
          </div>
        )
      )}
    </div>
  )
}

