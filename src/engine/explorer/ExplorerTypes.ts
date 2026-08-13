export type ExplorerEntityType =
  | "location"
  | "object"
  | "character"
  | "secret"
  | "landmark"
  | "environment"


export type ExplorerImportance =
  | "very_low"
  | "low"
  | "medium"
  | "high"
  | "critical"


export interface ExplorerPosition {

  x: number

  y: number

  /**
   * Reservado para a futura representação 3D.
   *
   * No Explorer 2D permanece 0.
   */
  z: number

}


export interface ExplorerEntity {

  /**
   * Identificador interno da entidade.
   *
   * Não precisa ser o ID do banco.
   */
  id: string

  /**
   * Nome apresentado ao jogador.
   */
  name: string

  /**
   * Descrição narrativa.
   */
  description: string

  /**
   * Categoria semântica.
   */
  type: ExplorerEntityType

  /**
   * Importância narrativa.
   */
  importance: ExplorerImportance

  /**
   * Pontuação numérica usada pelo motor.
   */
  score: number

  /**
   * Palavras que fizeram a entidade ser detectada.
   */
  matchedKeywords: string[]

  /**
   * Posição visual.
   *
   * x/y = Explorer 2D
   * z   = futura dimensão 3D
   */
  position: ExplorerPosition

  /**
   * Indica se o jogador pode interagir.
   */
  interactive: boolean

  /**
   * Indica se a entidade é secreta.
   */
  secret: boolean

}


export interface ExplorerScene {

  id: number

  title: string

  description: string

  entities: ExplorerEntity[]

}


export interface ExplorerHotspotSuggestion {

  // ==========================================
  // Identidade
  // ==========================================

  name: string

  description: string


  // ==========================================
  // Entidade de origem
  // ==========================================

  entityId: string


  // ==========================================
  // Classificação
  // ==========================================

  type: ExplorerEntityType

  importance: ExplorerImportance


  // ==========================================
  // Relevância
  // ==========================================

  score: number


  // ==========================================
  // Termos encontrados
  // ==========================================

  keywords: string[]

}


export interface ExplorationMemory {

  /**
   * Cenas que o jogador já visitou.
   */
  visitedScenes: number[]

  /**
   * Entidades descobertas.
   */
  discoveredEntities: string[]

  /**
   * Segredos descobertos.
   */
  discoveredSecrets: string[]

  /**
   * Entidades com as quais o jogador interagiu.
   */
  interactedEntities: string[]

}