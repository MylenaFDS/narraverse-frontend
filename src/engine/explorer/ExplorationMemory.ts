import type {
  ExplorationMemory,
} from "./ExplorerTypes"


const STORAGE_KEY =
  "narraverse_explorer_memory"


const DEFAULT_MEMORY:
  ExplorationMemory = {

  visitedScenes: [],

  discoveredEntities: [],

  discoveredSecrets: [],

  interactedEntities: [],

}


export class ExplorationMemoryEngine {

  // ==========================================
  // Carregar memória
  // ==========================================

  static load(): ExplorationMemory {

    try {

      const raw =
        localStorage.getItem(
          STORAGE_KEY,
        )

      if (!raw) {

        return {
          ...DEFAULT_MEMORY,
        }

      }

      const parsed =
        JSON.parse(raw)

      return {

        visitedScenes:
          Array.isArray(
            parsed.visitedScenes,
          )
            ? parsed.visitedScenes
            : [],

        discoveredEntities:
          Array.isArray(
            parsed.discoveredEntities,
          )
            ? parsed.discoveredEntities
            : [],

        discoveredSecrets:
          Array.isArray(
            parsed.discoveredSecrets,
          )
            ? parsed.discoveredSecrets
            : [],

        interactedEntities:
          Array.isArray(
            parsed.interactedEntities,
          )
            ? parsed.interactedEntities
            : [],

      }

    } catch (error) {

      console.error(
        "Erro ao carregar memória do Explorer:",
        error,
      )

      return {
        ...DEFAULT_MEMORY,
      }

    }

  }


  // ==========================================
  // Salvar
  // ==========================================

  static save(
    memory: ExplorationMemory,
  ): void {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          memory,
        ),
      )

    } catch (error) {

      console.error(
        "Erro ao salvar memória do Explorer:",
        error,
      )

    }

  }


  // ==========================================
  // Visitar cena
  // ==========================================

  static visitScene(
    sceneId: number,
  ): ExplorationMemory {

    const memory =
      this.load()

    if (
      !memory.visitedScenes.includes(
        sceneId,
      )
    ) {

      memory.visitedScenes.push(
        sceneId,
      )

    }

    this.save(
      memory,
    )

    return memory

  }


  // ==========================================
  // Descobrir entidade
  // ==========================================

  static discoverEntity(
    entityId: string,
  ): ExplorationMemory {

    const memory =
      this.load()

    if (
      !memory.discoveredEntities.includes(
        entityId,
      )
    ) {

      memory.discoveredEntities.push(
        entityId,
      )

    }

    this.save(
      memory,
    )

    return memory

  }


  // ==========================================
  // Descobrir segredo
  // ==========================================

  static discoverSecret(
    entityId: string,
  ): ExplorationMemory {

    const memory =
      this.load()

    if (
      !memory.discoveredSecrets.includes(
        entityId,
      )
    ) {

      memory.discoveredSecrets.push(
        entityId,
      )

    }

    return this.discoverEntity(
      entityId,
    )

  }


  // ==========================================
  // Registrar interação
  // ==========================================

  static interact(
    entityId: string,
  ): ExplorationMemory {

    const memory =
      this.load()

    if (
      !memory.interactedEntities.includes(
        entityId,
      )
    ) {

      memory.interactedEntities.push(
        entityId,
      )

    }

    this.save(
      memory,
    )

    return memory

  }


  // ==========================================
  // Verificar visita
  // ==========================================

  static hasVisited(
    sceneId: number,
  ): boolean {

    return this
      .load()
      .visitedScenes
      .includes(
        sceneId,
      )

  }


  // ==========================================
  // Verificar descoberta
  // ==========================================

  static hasDiscovered(
    entityId: string,
  ): boolean {

    return this
      .load()
      .discoveredEntities
      .includes(
        entityId,
      )

  }


  // ==========================================
  // Verificar segredo
  // ==========================================

  static hasDiscoveredSecret(
    entityId: string,
  ): boolean {

    return this
      .load()
      .discoveredSecrets
      .includes(
        entityId,
      )

  }


  // ==========================================
  // Verificar interação
  // ==========================================

  static hasInteracted(
    entityId: string,
  ): boolean {

    return this
      .load()
      .interactedEntities
      .includes(
        entityId,
      )

  }


  // ==========================================
  // Limpar memória
  // ==========================================

  static clear(): void {

    localStorage.removeItem(
      STORAGE_KEY,
    )

  }

}