export type KnowledgeCategory =

  | "person"
  | "place"
  | "item"
  | "faction"
  | "magic"
  | "history"
  | "culture"
  | "religion"
  | "creature"
  | "organization"
  | "technology"
  | "language"

export type KnowledgeSource =

  | "memory"
  | "book"
  | "rumor"
  | "vision"
  | "npc"
  | "player"
  | "observation"
  | "dream"
  | "divination"

export interface Knowledge {

  id: string

  // Assunto principal
  subject: string

  // Explicação completa
  description: string

  // Categoria
  category: KnowledgeCategory

  // O quanto o personagem acredita nisso (0–100)
  confidence: number

  // Origem da informação
  source: KnowledgeSource

  // Informação pública?
  public: boolean

  // Quem contou isso
  authorCharacterId?: number

  // Onde aprendeu
  loreId?: number

  factionId?: number

  sceneId?: number

  // Palavras-chave
  tags: string[]

  // Última atualização
  updatedAt: number

}
