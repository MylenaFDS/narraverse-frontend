import type {
  ExplorerEntity,
  ExplorerImportance,
} from "./ExplorerTypes"


export class NarrativeImportance {

  // ==========================================
  // Calcular importância
  // ==========================================

  static evaluate(
    entity: ExplorerEntity,
  ): ExplorerEntity {

    let score =
      entity.score

    // ========================================
    // Segredos
    // ========================================

    if (
      entity.secret
    ) {

      score += 10

    }


    // ========================================
    // Elementos interativos
    // ========================================

    if (
      entity.interactive
    ) {

      score += 5

    }


    // ========================================
    // Limite
    // ========================================

    score =
      Math.min(
        score,
        100,
      )

    return {

      ...entity,

      score,

      importance:
        this.toImportance(
          score,
        ),

    }

  }


  // ==========================================
  // Avaliar várias entidades
  // ==========================================

  static evaluateAll(
    entities: ExplorerEntity[],
  ): ExplorerEntity[] {

    return entities
      .map(
        entity =>
          this.evaluate(
            entity,
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


  // ==========================================
  // Converter score
  // ==========================================

  private static toImportance(
    score: number,
  ): ExplorerImportance {

    if (
      score >= 90
    ) {

      return "critical"

    }

    if (
      score >= 70
    ) {

      return "high"

    }

    if (
      score >= 45
    ) {

      return "medium"

    }

    if (
      score >= 25
    ) {

      return "low"

    }

    return "very_low"

  }


  // ==========================================
  // Filtrar relevantes
  // ==========================================

  static getRelevant(
    entities: ExplorerEntity[],
    minimumScore = 30,
  ): ExplorerEntity[] {

    return entities.filter(
      entity =>
        entity.score >=
        minimumScore,
    )

  }

}