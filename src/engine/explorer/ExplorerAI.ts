import {
  EntityDetector,
} from "./EntityDetector"


import {
  NarrativeImportance,
} from "./NarrativeImportance"


import {
  HotspotGenerator,
} from "./HotspotGenerator"


import {
  HotspotPositionEngine,
} from "./HotspotPositionEngine"


import {
  SceneGraphEngine,
} from "./SceneGraph"


import {
  ExplorationMemoryEngine,
} from "./ExplorationMemory"


import {
  ExplorationStateEngine,
  type ExplorationState,
} from "./ExplorationStateEngine"


import type {
  ExplorerEntity,
  ExplorerHotspotSuggestion,
} from "./ExplorerTypes"


// ======================================================
// Resultado da análise
// ======================================================

export interface ExplorerAnalysis {

  entities:
    ExplorerEntity[]


  hotspots:
    Array<
      ExplorerHotspotSuggestion & {
        position: {
          x: number
          y: number
          z: number
        }
      }
    >


  // Estado atual da exploração.
  state:
    ExplorationState

}


// ======================================================
// Explorer AI
// ======================================================

export class ExplorerAI {


  // ====================================================
  // Analisar cena
  //
  // Aceita:
  //
  // analyzeScene(
  //   sceneId,
  //   title,
  //   description,
  // )
  //
  // ou:
  //
  // analyzeScene(
  //   title,
  //   description,
  // )
  //
  // A segunda forma existe para manter compatibilidade
  // com chamadas antigas do ExplorerView.
  // ====================================================

  static analyzeScene(
    sceneId: number,
    title: string,
    description: string,
  ): ExplorerAnalysis


  static analyzeScene(
    title: string,
    description: string,
  ): ExplorerAnalysis


  static analyzeScene(
    sceneIdOrTitle: number | string,
    titleOrDescription: string,
    possibleDescription?: string,
  ): ExplorerAnalysis {


    // ==================================================
    // Resolver argumentos
    // ==================================================

    let sceneId:
      number | null

    let title:
      string

    let description:
      string


    if (
      typeof sceneIdOrTitle === "number"
    ) {

      sceneId =
        sceneIdOrTitle

      title =
        titleOrDescription

      description =
        possibleDescription ?? ""

    } else {

      sceneId =
        null

      title =
        sceneIdOrTitle

      description =
        titleOrDescription

    }


    // ==================================================
    // 1. Registrar visita
    // ==================================================

    if (
      sceneId !== null
    ) {

      ExplorationMemoryEngine
        .visitScene(
          sceneId,
        )


      // ----------------------------------------------
      // Iniciar exploração somente se necessário
      // ----------------------------------------------

      const state =
        ExplorationStateEngine
          .getState()


      if (
        !state.isExploring ||
        state.currentSceneId === null
      ) {

        ExplorationStateEngine
          .start(
            sceneId,
          )

      }

    }


    // ==================================================
    // 2. Detectar entidades
    // ==================================================

    const detected =
      EntityDetector.detect(
        title,
        description,
      )


    // ==================================================
    // 3. Avaliar importância narrativa
    // ==================================================

    let entities =
      NarrativeImportance.evaluateAll(
        detected,
      )


    // ==================================================
    // 4. Aplicar memória
    // ==================================================

    entities =
      this.applyMemory(
        entities,
      )


    // ==================================================
    // 5. Aplicar estado atual da exploração
    // ==================================================

    entities =
      this.applyExplorationState(
        entities,
      )


    // ==================================================
    // 6. Criar Scene Graph
    // ==================================================

    if (
      sceneId !== null
    ) {

      SceneGraphEngine.create(
        sceneId,
        entities,
      )

    }


    // ==================================================
    // 7. Gerar hotspots
    // ==================================================

    const generated =
      HotspotGenerator.generate(
        entities,
      )


    // ==================================================
    // 8. Remover hotspots que já foram explorados
    // ==================================================

    const unexplored =
      this.filterExploredHotspots(
        generated,
      )


    // ==================================================
    // 9. Limitar quantidade
    // ==================================================

    const limited =
      HotspotGenerator.limit(
        unexplored,
        8,
      )


    // ==================================================
    // 10. Definir posições
    // ==================================================

    const hotspots =
      HotspotPositionEngine.assign(
        limited,
      )


    // ==================================================
    // 11. Estado final
    // ==================================================

    const state =
      ExplorationStateEngine
        .getState()


    // ==================================================
    // Resultado
    // ==================================================

    return {

      entities,

      hotspots,

      state,

    }

  }


  // ====================================================
  // Aplicar memória
  // ====================================================

  private static applyMemory(
    entities: ExplorerEntity[],
  ): ExplorerEntity[] {


    const memory =
      ExplorationMemoryEngine
        .getMemory()


    return entities

      .map(
        entity =>
          this.applyMemoryToEntity(
            entity,
            memory,
          ),
      )

      .sort(
        (
          a,
          b,
        ) =>
          b.score -
          a.score,
      )

  }


  // ====================================================
  // Aplicar memória individual
  // ====================================================

  private static applyMemoryToEntity(
    entity: ExplorerEntity,

    memory: ReturnType<
      typeof ExplorationMemoryEngine.getMemory
    >,

  ): ExplorerEntity {


    let score =
      entity.score


    // ==================================================
    // Já descoberto
    // ==================================================

    if (
      memory.discoveredEntities.includes(
        entity.id,
      )
    ) {

      score -= 20

    }


    // ==================================================
    // Já interagiu
    // ==================================================

    if (
      memory.interactedEntities.includes(
        entity.id,
      )
    ) {

      score -= 15

    }


    // ==================================================
    // Segredo ainda desconhecido
    // ==================================================

    if (
      entity.secret &&
      !memory.discoveredSecrets.includes(
        entity.id,
      )
    ) {

      score += 20

    }


    // ==================================================
    // Segredo já descoberto
    // ==================================================

    if (
      entity.secret &&
      memory.discoveredSecrets.includes(
        entity.id,
      )
    ) {

      score -= 10

    }


    // ==================================================
    // Limitar score
    // ==================================================

    score =
      Math.max(
        0,
        Math.min(
          score,
          100,
        ),
      )


    return {

      ...entity,

      score,

    }

  }


  // ====================================================
  // Aplicar estado da exploração
  // ====================================================

  private static applyExplorationState(
    entities: ExplorerEntity[],
  ): ExplorerEntity[] {


    const state =
      ExplorationStateEngine
        .getState()


    // ==================================================
    // Se não existe exploração ativa,
    // não precisamos alterar nada.
    // ==================================================

    if (
      !state.isExploring
    ) {

      return entities

    }


    return entities.map(
      entity => {

        let score =
          entity.score


        // ----------------------------------------------
        // Segredos recebem prioridade durante exploração
        // ----------------------------------------------

        if (
          entity.secret &&
          !state.discoveredSecrets.includes(
            entity.id,
          )
        ) {

          score += 10

        }


        // ----------------------------------------------
        // Limitar novamente
        // ----------------------------------------------

        score =
          Math.max(
            0,
            Math.min(
              score,
              100,
            ),
          )


        return {

          ...entity,

          score,

        }

      },
    )

  }


  // ====================================================
  // Filtrar hotspots já explorados
  // ====================================================

  private static filterExploredHotspots(
    hotspots: ExplorerHotspotSuggestion[],
  ): ExplorerHotspotSuggestion[] {


    const memory =
      ExplorationMemoryEngine
        .getMemory()


    return hotspots.filter(
      hotspot => {


        // ----------------------------------------------
        // Se o hotspot possui algum identificador
        // correspondente a uma entidade já descoberta,
        // evitamos sugeri-lo novamente.
        // ----------------------------------------------

        if (
          memory.discoveredEntities.includes(
            hotspot.name,
          )
        ) {

          return false

        }


        // ----------------------------------------------
        // Segredo já descoberto
        // ----------------------------------------------

        if (
          hotspot.type === "secret" &&
          memory.discoveredSecrets.includes(
            hotspot.name,
          )
        ) {

          return false

        }


        return true

      },
    )

  }


  // ====================================================
  // Gerar hotspots
  //
  // Compatível com:
  //
  // generateHotspots(
  //   sceneId,
  //   title,
  //   description,
  // )
  //
  // e:
  //
  // generateHotspots(
  //   title,
  //   description,
  // )
  // ====================================================

    // ====================================================
  // Gerar hotspots
  // ====================================================

  static generateHotspots(
    sceneId: number,
    title: string,
    description: string,
  ): ExplorerAnalysis["hotspots"]

  static generateHotspots(
    title: string,
    description: string,
  ): ExplorerAnalysis["hotspots"]


  static generateHotspots(
    sceneIdOrTitle: number | string,
    titleOrDescription: string,
    possibleDescription?: string,
  ): ExplorerAnalysis["hotspots"] {

    // ----------------------------------------------
    // Cena com ID
    // ----------------------------------------------

    if (
      typeof sceneIdOrTitle === "number"
    ) {

      return this.analyzeScene(
        sceneIdOrTitle,
        titleOrDescription,
        possibleDescription ?? "",
      ).hotspots

    }


    // ----------------------------------------------
    // Compatibilidade com chamada antiga
    // ----------------------------------------------

    return this.analyzeScene(
      sceneIdOrTitle,
      titleOrDescription,
    ).hotspots

  }

}