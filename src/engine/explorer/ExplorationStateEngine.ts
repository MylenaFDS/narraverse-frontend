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
  // Entidades
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


  private static readonly STORAGE_KEY =
    "narraverse_exploration_state"


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
  // SALVAR ESTADO
  // ==========================================================

  private static saveState(): void {

    try {

      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(
          this.state,
        ),
      )

    } catch (error) {

      console.error(
        "Erro ao salvar estado da exploração:",
        error,
      )

    }
  }


  // ==========================================================
  // CARREGAR ESTADO
  // ==========================================================

  private static loadState(): ExplorationState | null {

    try {

      const stored =
        localStorage.getItem(
          this.STORAGE_KEY,
        )

      if (!stored) {
        return null
      }

      const parsed =
        JSON.parse(
          stored,
        ) as ExplorationState

      return {
        ...createDefaultState(),
        ...parsed,

        sceneHistory:
          parsed.sceneHistory ?? [],

        availableHotspots:
          parsed.availableHotspots ?? [],

        discoveredHotspots:
          parsed.discoveredHotspots ?? [],

        interactedHotspots:
          parsed.interactedHotspots ?? [],

        unlockedPaths:
          parsed.unlockedPaths ?? [],

        lockedPaths:
          parsed.lockedPaths ?? [],

        discoveredSecrets:
          parsed.discoveredSecrets ?? [],

        flags:
          parsed.flags ?? [],

        discoveredEntities:
          parsed.discoveredEntities ?? [],

        discoveredItems:
          parsed.discoveredItems ?? [],

        relationships:
          parsed.relationships ?? [],
      }

    } catch (error) {

      console.error(
        "Erro ao carregar estado da exploração:",
        error,
      )

      return null
    }
  }

    // ==========================================================
  // INICIAR EXPLORAÇÃO
  // ==========================================================

  static start(
    sceneId: number,
  ): ExplorationState {

    const savedState =
      this.loadState()

    if (savedState) {

      this.state =
        savedState

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

    } else {

      this.state =
        createDefaultState()

      this.state.currentSceneId =
        sceneId

      this.state.sceneHistory =
        [sceneId]
    }

    this.state.isExploring =
      true

    this.state.isTransitioning =
      false

    this.saveState()

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
    // Limpa a classificação dos caminhos da cena atual
    // --------------------------------------------------------

    this.state.unlockedPaths = []

    this.state.lockedPaths = []

    // --------------------------------------------------------
    // Classifica os caminhos
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
          location,
        )

      if (
        access.allowed
      ) {

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


  // ==========================================================
  // VERIFICAR ACESSO AO CAMINHO
  // ==========================================================

  static canAccessPath(
    location: SceneLocation,
  ): ExplorationAccessResult {

    const explorationLocation =
      location as ExplorationLocation


    // --------------------------------------------------------
    // Hotspot sem destino
    // --------------------------------------------------------

    if (
      !location.target_scene_id
    ) {

      return {
        allowed: true,
        reason: null,
      }
    }


    // --------------------------------------------------------
    // Caminho explicitamente desbloqueado
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // Caminho explicitamente bloqueado
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // Requer segredo
    // --------------------------------------------------------

    if (
      explorationLocation.requiresSecret
    ) {

      const hasSecret =
        this.state.discoveredSecrets.includes(
          explorationLocation.requiresSecret,
        )

      if (!hasSecret) {

        return {
          allowed: false,
          reason:
            "Você ainda não descobriu o segredo necessário.",
        }
      }
    }


    // --------------------------------------------------------
    // Requer entidade
    // --------------------------------------------------------

    if (
      explorationLocation.requiresEntity
    ) {

      const hasEntity =
        this.state.discoveredEntities.includes(
          explorationLocation.requiresEntity,
        )

      if (!hasEntity) {

        return {
          allowed: false,
          reason:
            "Você ainda não descobriu a entidade necessária.",
        }
      }
    }


    // --------------------------------------------------------
    // Requer hotspot descoberto
    // --------------------------------------------------------

    if (
      explorationLocation.requiresHotspot !==
      undefined
    ) {

      const discovered =
        this.state.discoveredHotspots.includes(
          explorationLocation.requiresHotspot,
        )

      if (!discovered) {

        return {
          allowed: false,
          reason:
            "Você precisa descobrir outro local antes de seguir.",
        }
      }
    }


    // --------------------------------------------------------
    // Requer interação
    // --------------------------------------------------------

    if (
      explorationLocation.requiresInteraction !==
      undefined
    ) {

      const interacted =
        this.state.interactedHotspots.includes(
          explorationLocation.requiresInteraction,
        )

      if (!interacted) {

        return {
          allowed: false,
          reason:
            "Você precisa interagir com outro local antes de seguir.",
        }
      }
    }


    // --------------------------------------------------------
    // Requer flag
    // --------------------------------------------------------

    if (
      explorationLocation.requiresFlag
    ) {

      const hasFlag =
        this.state.flags.includes(
          explorationLocation.requiresFlag,
        )

      if (!hasFlag) {

        return {
          allowed: false,
          reason:
            "Uma condição narrativa ainda precisa ser cumprida.",
        }
      }
    }


    // --------------------------------------------------------
    // Requer item
    // --------------------------------------------------------

    if (
      explorationLocation.requiresItem
    ) {

      const hasItem =
        this.state.discoveredItems.includes(
          explorationLocation.requiresItem,
        )

      if (!hasItem) {

        return {
          allowed: false,
          reason:
            "Você ainda não possui o item necessário.",
        }
      }
    }


    // --------------------------------------------------------
    // Requer relacionamento
    // --------------------------------------------------------

    if (
      explorationLocation.requiresRelationship
    ) {

      const hasRelationship =
        this.state.relationships.includes(
          explorationLocation.requiresRelationship,
        )

      if (!hasRelationship) {

        return {
          allowed: false,
          reason:
            "Seu relacionamento com alguém ainda não permite seguir por este caminho.",
        }
      }
    }


    // --------------------------------------------------------
    // Acesso permitido
    // --------------------------------------------------------

    return {
      allowed: true,
      reason: null,
    }
  }


  // ==========================================================
  // VERIFICAR HOTSPOT INTERAGIDO
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
  // VERIFICAR HOTSPOT DESCOBERTO
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
  // VERIFICAR CAMINHO DESBLOQUEADO
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