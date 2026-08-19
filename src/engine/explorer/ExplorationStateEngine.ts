import type {
  SceneLocation,
} from "../../services/api"


// ============================================================
// CONDIÇÕES DE ACESSO
// ============================================================

export type ExplorationAccessCondition = {

  // ----------------------------------------------------------
  // Segredo
  // ----------------------------------------------------------

  requiresSecret?:
    string

  // ----------------------------------------------------------
  // Entidade
  // ----------------------------------------------------------

  requiresEntity?:
    string

  // ----------------------------------------------------------
  // Hotspot descoberto
  // ----------------------------------------------------------

  requiresHotspot?:
    number

  // ----------------------------------------------------------
  // Hotspot interagido
  // ----------------------------------------------------------

  requiresInteraction?:
    number

  // ----------------------------------------------------------
  // Flag narrativa
  // ----------------------------------------------------------

  requiresFlag?:
    string

  // ----------------------------------------------------------
  // Item
  // ----------------------------------------------------------

  requiresItem?:
    string

  // ----------------------------------------------------------
  // Relacionamento
  // ----------------------------------------------------------

  requiresRelationship?:
    string

}


// ============================================================
// RESULTADO DO ACESSO
// ============================================================

export interface ExplorationAccessResult {

  allowed:
    boolean

  reason:
    string | null

}


// ============================================================
// LOCATION COM CONDIÇÕES DE EXPLORAÇÃO
// ============================================================

export type ExplorationLocation =
  SceneLocation &
  ExplorationAccessCondition & {

    entity_id?:
      string | null

    entityId?:
      string | null
  }


// ============================================================
// ESTADO DA EXPLORAÇÃO
// ============================================================

export interface ExplorationState {

  // ==========================================================
  // Cena
  // ==========================================================

  currentSceneId:
    number | null

  previousSceneId:
    number | null

  sceneHistory:
    number[]


  // ==========================================================
  // Hotspots
  // ==========================================================

  availableHotspots:
    number[]

  discoveredHotspots:
    number[]

  interactedHotspots:
    number[]


  // ==========================================================
  // Caminhos
  // ==========================================================

  unlockedPaths:
    number[]

  lockedPaths:
    number[]


  // ==========================================================
  // Segredos
  // ==========================================================

  discoveredSecrets:
    string[]


  // ==========================================================
  // Flags
  // ==========================================================

  flags:
    string[]


  // ==========================================================
  // Entidades descobertas
  // ==========================================================

  discoveredEntities:
    string[]


  // ==========================================================
  // Itens
  // ==========================================================

  discoveredItems:
    string[]


  // ==========================================================
  // Relacionamentos
  // ==========================================================

  relationships:
    string[]


  // ==========================================================
  // Estado geral
  // ==========================================================

  isExploring:
    boolean

  isTransitioning:
    boolean
}


// ============================================================
// ESTADO INICIAL
// ============================================================

function createDefaultState():
  ExplorationState {

  return {

    currentSceneId:
      null,

    previousSceneId:
      null,

    sceneHistory:
      [],

    availableHotspots:
      [],

    discoveredHotspots:
      [],

    interactedHotspots:
      [],

    unlockedPaths:
      [],

    lockedPaths:
      [],

    discoveredSecrets:
      [],

    flags:
      [],

    discoveredEntities:
      [],

    discoveredItems:
      [],

    relationships:
      [],

    isExploring:
      false,

    isTransitioning:
      false,
  }
}


// ============================================================
// ENGINE
// ============================================================

export class ExplorationStateEngine {


  private static state:
    ExplorationState =
      createDefaultState()


  // ==========================================================
  // ESTADO ATUAL
  // ==========================================================

  static getState():
    ExplorationState {

    return {

      ...this.state,

      sceneHistory:
        [
          ...this.state.sceneHistory,
        ],

      availableHotspots:
        [
          ...this.state.availableHotspots,
        ],

      discoveredHotspots:
        [
          ...this.state.discoveredHotspots,
        ],

      interactedHotspots:
        [
          ...this.state.interactedHotspots,
        ],

      unlockedPaths:
        [
          ...this.state.unlockedPaths,
        ],

      lockedPaths:
        [
          ...this.state.lockedPaths,
        ],

      discoveredSecrets:
        [
          ...this.state.discoveredSecrets,
        ],

      flags:
        [
          ...this.state.flags,
        ],

      discoveredEntities:
        [
          ...this.state.discoveredEntities,
        ],

      discoveredItems:
        [
          ...this.state.discoveredItems,
        ],

      relationships:
        [
          ...this.state.relationships,
        ],
    }
  }


  // ==========================================================
  // INICIAR EXPLORAÇÃO
  // ==========================================================

  static start(
    sceneId: number,
  ): ExplorationState {

    this.state =
      createDefaultState()

    this.state.currentSceneId =
      sceneId

    this.state.sceneHistory =
      [sceneId]

    this.state.isExploring =
      true

    this.state.isTransitioning =
      false

    return this.getState()
  }


  // ==========================================================
  // ENTRAR EM UMA CENA
  // ==========================================================

  static enterScene(
    sceneId: number,
  ): ExplorationState {

    const current =
      this.state.currentSceneId

    if (
      current === sceneId
    ) {
      return this.getState()
    }

    this.state.previousSceneId =
      current

    this.state.currentSceneId =
      sceneId

    if (
      !this.state.sceneHistory.includes(
        sceneId,
      )
    ) {
      this.state.sceneHistory.push(
        sceneId,
      )
    }

    this.state.isExploring =
      true

    this.state.isTransitioning =
      false

    return this.getState()
  }


  // ==========================================================
  // COMEÇAR TRANSIÇÃO
  // ==========================================================

  static beginTransition(): void {

    this.state.isTransitioning =
      true
  }


  // ==========================================================
  // FINALIZAR TRANSIÇÃO
  // ==========================================================

  static finishTransition(): void {

    this.state.isTransitioning =
      false
  }


  // ==========================================================
  // REGISTRAR HOTSPOTS
  // ==========================================================

  static setHotspots(
    locations: SceneLocation[],
  ): void {

    this.state.availableHotspots =
      locations.map(
        location =>
          location.id,
      )

    // --------------------------------------------------------
    // Inicialmente, caminhos que possuem destino são tratados
    // como disponíveis, a menos que uma condição os bloqueie.
    // --------------------------------------------------------

    for (
      const location
      of locations
    ) {

      if (
        location.target_scene_id ===
        null
      ) {
        continue
      }

      const access =
        this.canAccessPath(
          location as ExplorationLocation,
        )

      if (access.allowed) {

        this.unlockPath(
          location.id,
        )

      } else {

        this.lockPath(
          location.id,
        )
      }
    }
  }


  // ==========================================================
  // REGISTRAR DESCOBERTA
  // ==========================================================

  static discoverHotspot(
    locationId: number,
  ): void {

    if (
      !this.state.discoveredHotspots.includes(
        locationId,
      )
    ) {

      this.state.discoveredHotspots.push(
        locationId,
      )
    }
  }


  // ==========================================================
  // REGISTRAR INTERAÇÃO
  // ==========================================================

  static interactHotspot(
    locationId: number,
  ): void {

    this.discoverHotspot(
      locationId,
    )

    if (
      !this.state.interactedHotspots.includes(
        locationId,
      )
    ) {

      this.state.interactedHotspots.push(
        locationId,
      )
    }
  }


  // ==========================================================
  // DESBLOQUEAR CAMINHO
  // ==========================================================

  static unlockPath(
    locationId: number,
  ): void {

    if (
      !this.state.unlockedPaths.includes(
        locationId,
      )
    ) {

      this.state.unlockedPaths.push(
        locationId,
      )
    }

    this.state.lockedPaths =
      this.state.lockedPaths.filter(
        id =>
          id !== locationId,
      )
  }


  // ==========================================================
  // BLOQUEAR CAMINHO
  // ==========================================================

  static lockPath(
    locationId: number,
  ): void {

    if (
      !this.state.lockedPaths.includes(
        locationId,
      )
    ) {

      this.state.lockedPaths.push(
        locationId,
      )
    }

    this.state.unlockedPaths =
      this.state.unlockedPaths.filter(
        id =>
          id !== locationId,
      )
  }


  // ==========================================================
  // REGISTRAR SEGREDO
  // ==========================================================

  static discoverSecret(
    secretId: string,
  ): void {

    if (
      !this.state.discoveredSecrets.includes(
        secretId,
      )
    ) {

      this.state.discoveredSecrets.push(
        secretId,
      )
    }

    // --------------------------------------------------------
    // Ao descobrir um segredo, alguns caminhos podem ser
    // reavaliados pelo ExplorerView quando necessário.
    // --------------------------------------------------------
  }


  // ==========================================================
  // REGISTRAR ENTIDADE
  // ==========================================================

  static discoverEntity(
    entityId: string,
  ): void {

    if (
      !this.state.discoveredEntities.includes(
        entityId,
      )
    ) {

      this.state.discoveredEntities.push(
        entityId,
      )
    }
  }


  // ==========================================================
  // REGISTRAR ITEM
  // ==========================================================

  static discoverItem(
    itemId: string,
  ): void {

    if (
      !this.state.discoveredItems.includes(
        itemId,
      )
    ) {

      this.state.discoveredItems.push(
        itemId,
      )
    }
  }


  // ==========================================================
  // REGISTRAR FLAG
  // ==========================================================

  static setFlag(
    flag: string,
  ): void {

    if (
      !this.state.flags.includes(
        flag,
      )
    ) {

      this.state.flags.push(
        flag,
      )
    }
  }


  // ==========================================================
  // REMOVER FLAG
  // ==========================================================

  static removeFlag(
    flag: string,
  ): void {

    this.state.flags =
      this.state.flags.filter(
        item =>
          item !== flag,
      )
  }


  // ==========================================================
  // REGISTRAR RELACIONAMENTO
  // ==========================================================

  static setRelationship(
    relationship: string,
  ): void {

    if (
      !this.state.relationships.includes(
        relationship,
      )
    ) {

      this.state.relationships.push(
        relationship,
      )
    }
  }


    // ========================================
  // Verificar acesso ao caminho
  // ========================================

  static canAccessPath(
    location: SceneLocation,
  ): {
    allowed: boolean
    reason: string | null
  } {

    // ----------------------------------------
    // Hotspot sem destino
    // ----------------------------------------

    if (
      !location.target_scene_id
    ) {
      return {
        allowed: true,
        reason: null,
      }
    }

    // ----------------------------------------
    // Caminho explicitamente desbloqueado
    // ----------------------------------------

    if (
      this.state.unlockedPaths.includes(
        location.id,
      )
    ) {
      return {
        allowed: true,
        reason: null,
      }
    }

    // ----------------------------------------
    // Caminho explicitamente bloqueado
    // ----------------------------------------

    if (
      this.state.lockedPaths.includes(
        location.id,
      )
    ) {
      return {
        allowed: false,
        reason:
          "Este caminho ainda está bloqueado.",
      }
    }

    // ----------------------------------------
    // Por padrão, caminhos não registrados
    // permanecem acessíveis.
    // ----------------------------------------

    return {
      allowed: true,
      reason: null,
    }
  }


  // ==========================================================
  // VERIFICAR SE HOTSPOT FOI INTERAGIDO
  // ==========================================================

  static hasInteracted(
    locationId: number,
  ): boolean {

    return this.state.interactedHotspots
      .includes(
        locationId,
      )
  }


  // ==========================================================
  // VERIFICAR SE HOTSPOT FOI DESCOBERTO
  // ==========================================================

  static hasDiscoveredHotspot(
    locationId: number,
  ): boolean {

    return this.state.discoveredHotspots
      .includes(
        locationId,
      )
  }


  // ==========================================================
  // VERIFICAR CAMINHO
  // ==========================================================

  static isPathUnlocked(
    locationId: number,
  ): boolean {

    return this.state.unlockedPaths
      .includes(
        locationId,
      )
  }


  // ==========================================================
  // ENCERRAR EXPLORAÇÃO
  // ==========================================================

  static stop(): void {

    this.state.isExploring =
      false

    this.state.isTransitioning =
      false
  }


  // ==========================================================
  // RESETAR
  // ==========================================================

  static reset(): void {

    this.state =
      createDefaultState()
  }
}