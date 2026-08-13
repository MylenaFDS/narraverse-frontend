import type {
  SceneLocation,
} from "../../services/api"


// ==========================================
// Estado da exploração
// ==========================================

export interface ExplorationState {

  // ========================================
  // Cena
  // ========================================

  currentSceneId:
    number | null

  previousSceneId:
    number | null

  sceneHistory:
    number[]


  // ========================================
  // Hotspots
  // ========================================

  availableHotspots:
    number[]

  discoveredHotspots:
    number[]

  interactedHotspots:
    number[]


  // ========================================
  // Caminhos
  // ========================================

  unlockedPaths:
    number[]

  lockedPaths:
    number[]


  // ========================================
  // Segredos
  // ========================================

  discoveredSecrets:
    string[]


  // ========================================
  // Estado geral
  // ========================================

  isExploring:
    boolean

  isTransitioning:
    boolean

}


// ==========================================
// Estado inicial
// ==========================================

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

    isExploring:
      false,

    isTransitioning:
      false,

  }

}


// ==========================================
// Engine
// ==========================================

export class ExplorationStateEngine {


  private static state:
    ExplorationState =
      createDefaultState()


  // ========================================
  // Estado atual
  // ========================================

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

    }

  }


  // ========================================
  // Iniciar exploração
  // ========================================

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


  // ========================================
  // Entrar em uma cena
  // ========================================

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


  // ========================================
  // Começar transição
  // ========================================

  static beginTransition(): void {

    this.state.isTransitioning =
      true

  }


  // ========================================
  // Finalizar transição
  // ========================================

  static finishTransition(): void {

    this.state.isTransitioning =
      false

  }


  // ========================================
  // Registrar hotspots
  // ========================================

  static setHotspots(
    locations: SceneLocation[],
  ): void {

    this.state.availableHotspots =
      locations.map(
        location =>
          location.id,
      )

  }


  // ========================================
  // Registrar descoberta
  // ========================================

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


  // ========================================
  // Registrar interação
  // ========================================

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


  // ========================================
  // Desbloquear caminho
  // ========================================

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


  // ========================================
  // Bloquear caminho
  // ========================================

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


  // ========================================
  // Registrar segredo
  // ========================================

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


  // ========================================
  // Verificar hotspot
  // ========================================

  static hasInteracted(
    locationId: number,
  ): boolean {

    return this.state.interactedHotspots
      .includes(
        locationId,
      )

  }


  // ========================================
  // Verificar caminho
  // ========================================

  static isPathUnlocked(
    locationId: number,
  ): boolean {

    return this.state.unlockedPaths
      .includes(
        locationId,
      )

  }


  // ========================================
  // Encerrar exploração
  // ========================================

  static stop(): void {

    this.state.isExploring =
      false

    this.state.isTransitioning =
      false

  }


  // ========================================
  // Resetar
  // ========================================

  static reset(): void {

    this.state =
      createDefaultState()

  }

}