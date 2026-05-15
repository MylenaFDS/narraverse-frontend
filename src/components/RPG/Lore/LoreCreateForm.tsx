type Props = {
  isOwner: boolean

  title: string
  content: string
  category: string

  categories: string[]

  setTitle: React.Dispatch<
    React.SetStateAction<string>
  >

  setContent: React.Dispatch<
    React.SetStateAction<string>
  >

  setCategory: React.Dispatch<
    React.SetStateAction<string>
  >

  handleCreate: () => void
}

export default function LoreCreateForm({
  isOwner,
  title,
  content,
  category,
  categories,
  setTitle,
  setContent,
  setCategory,
  handleCreate,
}: Props) {
  return (
    <div
      className="
        bg-[#18181b]
        border
        border-[#2b2b31]
        rounded-2xl
        p-6
        mb-10
      "
    >
      <h2 className="text-xl font-bold mb-4">
        {isOwner
          ? "✍️ Nova Lore"
          : "💡 Enviar Sugestão"}
      </h2>

      <div className="space-y-4">
        {/* TÍTULO */}
        <input
          placeholder="Título"
          className="
            w-full
            bg-[#232329]
            border
            border-[#32323a]
            rounded-xl
            p-3
          "
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        {/* CATEGORIA */}
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="
            w-full
            bg-[#232329]
            border
            border-[#32323a]
            rounded-xl
            p-3
          "
        >
          {categories.map((cat) => (
            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>
          ))}
        </select>

        {/* CONTEÚDO */}
        <textarea
          placeholder="Conteúdo..."
          className="
            w-full
            bg-[#232329]
            border
            border-[#32323a]
            rounded-xl
            p-4
            min-h-[180px]
          "
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
        />

        {/* BOTÃO */}
        <button
          onClick={handleCreate}
          className="
            bg-purple-600
            hover:bg-purple-500
            transition
            px-5
            py-3
            rounded-xl
            font-semibold
          "
        >
          {isOwner
            ? "Criar lore"
            : "Enviar sugestão"}
        </button>
      </div>
    </div>
  )
}