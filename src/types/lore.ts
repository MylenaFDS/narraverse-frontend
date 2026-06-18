export type Lore = {
  id: number
  title: string
  content: string

  // 🌍 usado para geração de cenários
  visual_description?: string | null

  is_approved: boolean
  category?: string
  order?: number
}