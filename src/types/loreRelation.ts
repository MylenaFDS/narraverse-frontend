export type LoreRelation = {
  id: number

  source_lore_id: number
  target_lore_id: number

  target_lore: {
    id: number
    title: string
  }
}