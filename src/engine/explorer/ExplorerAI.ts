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

import type {
  ExplorerEntity,
  ExplorerHotspotSuggestion,
} from "./ExplorerTypes"

import {
  SceneGraphEngine,
} from "./SceneGraph"

export interface ExplorerAnalysis {

  entities: ExplorerEntity[]

  hotspots: Array<
    ExplorerHotspotSuggestion & {
      position: {
        x: number
        y: number
        z: number
      }
    }
  >

}


export class ExplorerAI {

  // ==========================================
  // Analisar cena
  // ==========================================

  static analyzeScene(
  sceneId: number,
  title: string,
  description: string,
): ExplorerAnalysis {

  // ----------------------------------------
  // 1. Detectar entidades
  // ----------------------------------------

  const detected =
    EntityDetector.detect(
      title,
      description,
    )


  // ----------------------------------------
  // 2. Avaliar importância
  // ----------------------------------------

  const entities =
    NarrativeImportance.evaluateAll(
      detected,
    )


  // ----------------------------------------
  // 3. Criar Scene Graph
  // ----------------------------------------

  SceneGraphEngine.create(
    sceneId,
    entities,
  )


  // ----------------------------------------
  // 4. Gerar hotspots
  // ----------------------------------------

  const generated =
    HotspotGenerator.generate(
      entities,
    )


  // ----------------------------------------
  // 5. Limitar quantidade
  // ----------------------------------------

  const limited =
    HotspotGenerator.limit(
      generated,
      8,
    )


  // ----------------------------------------
  // 6. Definir posições
  // ----------------------------------------

  const hotspots =
    HotspotPositionEngine.assign(
      limited,
    )


  return {

    entities,

    hotspots,

  }

}


  // ==========================================
  // Atalho para hotspots
  // ==========================================

  static generateHotspots(
  sceneId: number,
  title: string,
  description: string,
) {

  const analysis =
    this.analyzeScene(
      sceneId,
      title,
      description,
    )

  return analysis.hotspots

}

}