type Props = {
  rpgId: number

  newCategory: string

  setNewCategory: React.Dispatch<
    React.SetStateAction<string>
  >

  handleCreateCategory: () => void

  uploadMapImage: (
    rpgId: number,
    file: File
  ) => Promise<{
    world_map: string
  }>

  setWorldMap: React.Dispatch<
    React.SetStateAction<string>
  >
}

export default function LoreAdmin({
  rpgId,
  newCategory,
  setNewCategory,
  handleCreateCategory,
  uploadMapImage,
  setWorldMap,
}: Props) {
  return (
    <div
      className="
        bg-[#18181b]
        border
        border-[#2b2b31]
        rounded-2xl
        p-5
        mb-8
      "
    >
      <h2 className="text-lg font-bold mb-4">
        ⚙️ Administração
      </h2>

      {/* 🔥 UPLOAD MAPA */}
      <div className="mb-6">
        <label className="block mb-2 text-sm text-gray-400">
          Upload do mapa do mundo
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file =
              e.target.files?.[0]

            if (!file) return

            try {
              const data =
                await uploadMapImage(
                  rpgId,
                  file
                )

              setWorldMap(
                `http://127.0.0.1:8001/${data.world_map}`
              )
            } catch (err) {
              console.error(err)
            }
          }}
        />
      </div>

      {/* ➕ CATEGORIA */}
      <div className="flex gap-3">
        <input
          placeholder="Nova categoria"
          className="
            flex-1
            bg-[#232329]
            border
            border-[#32323a]
            rounded-xl
            p-3
          "
          value={newCategory}
          onChange={(e) =>
            setNewCategory(
              e.target.value
            )
          }
        />

        <button
          onClick={
            handleCreateCategory
          }
          className="
            bg-blue-600
            hover:bg-blue-500
            transition
            px-5
            rounded-xl
            font-semibold
          "
        >
          Criar
        </button>
      </div>
    </div>
  )
}

