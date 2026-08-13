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

      // ----------------------------------------
      // Apenas entidades interativas
      // ----------------------------------------

      .filter(
        entity =>
          entity.interactive,
      )


      // ----------------------------------------
      // Mais relevantes primeiro
      // ----------------------------------------

      .sort(
        (
          a,
          b,
        ) =>
          b.score -
          a.score,
      )


      // ----------------------------------------
      // Converter entidade em hotspot
      // ----------------------------------------

      .map(
        entity => ({

          name:
            entity.name,

          description:
            entity.description,


          // ====================================
          // Identidade da entidade
          // ====================================

          entityId:
            entity.id,


          // ====================================
          // Classificação
          // ====================================

          type:
            entity.type,

          importance:
            entity.importance,


          // ====================================
          // Relevância
          // ====================================

          score:
            entity.score,


          // ====================================
          // Palavras encontradas
          // ====================================

          keywords:
            entity.matchedKeywords,

        }),
      )

  }


  // ==========================================
  // Limitar quantidade
  // ==========================================

  static limit(
    hotspots:
      ExplorerHotspotSuggestion[],

    maximum = 8,

  ): ExplorerHotspotSuggestion[] {

    return hotspots.slice(
      0,
      maximum,
    )

  }

}