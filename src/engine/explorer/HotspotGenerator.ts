import type {
  ExplorerEntity,
  ExplorerHotspotSuggestion,
} from "./ExplorerTypes"


export class HotspotGenerator {

  // ==========================================
  // Gerar hotspots
  // ==========================================

  static generate(
    entities: ExplorerEntity[],
  ): ExplorerHotspotSuggestion[] {

    return entities
      .filter(
        entity =>
          entity.interactive,
      )
      .sort(
        (
          a,
          b,
        ) =>
          b.score -
          a.score,
      )
      .map(
        entity => ({

          name:
            entity.name,

          description:
            entity.description,

          type:
            entity.type,

          importance:
            entity.importance,

          score:
            entity.score,

          keywords:
            entity.matchedKeywords,

        }),
      )

  }


  // ==========================================
  // Limitar quantidade
  // ==========================================

  static limit(
    hotspots: ExplorerHotspotSuggestion[],
    maximum = 8,
  ): ExplorerHotspotSuggestion[] {

    return hotspots.slice(
      0,
      maximum,
    )

  }

}