import {
  SEMANTIC_RULES,
  type SemanticRule,
} from "./SemanticRules"

import {
  KeywordEngine,
} from "./KeywordEngine"

import type {
  ExplorerEntity,
} from "./ExplorerTypes"


export class EntityDetector {

  // ==========================================
  // Detectar entidades
  // ==========================================

  static detect(
    title: string,
    description: string,
  ): ExplorerEntity[] {

    const text =
      `${title}. ${description}`

    const entities:
      ExplorerEntity[] = []

    const matchedRules =
      KeywordEngine.matchRules(
        text,
        SEMANTIC_RULES,
      )

    for (
      const rule of matchedRules
    ) {

      const matchedKeywords =
        KeywordEngine.getMatchedKeywords(
          text,
          rule.keywords,
        )

      if (
        !matchedKeywords.length
      ) {

        continue

      }

      const occurrences =
        this.calculateOccurrences(
          text,
          matchedKeywords,
        )

      const score =
        this.calculateScore(
          rule,
          occurrences,
          title,
        )

      const entity:
        ExplorerEntity = {

          id:
            this.createEntityId(
              rule,
              matchedKeywords,
            ),

          name:
            rule.name,

          description:
            rule.description,

          type:
            rule.type,

          importance:
            rule.importance,

          score,

          matchedKeywords,

          position: {

            x: 0,

            y: 0,

            z: 0,

          },

          interactive:
            rule.interactive ??
            true,

          secret:
            rule.secret ??
            false,

        }

      entities.push(
        entity,
      )

    }

    return this.removeDuplicates(
      entities,
    )

  }


  // ==========================================
  // Ocorrências
  // ==========================================

  private static calculateOccurrences(
    text: string,
    keywords: string[],
  ): number {

    let total = 0

    for (
      const keyword of keywords
    ) {

      total +=
        KeywordEngine.count(
          text,
          keyword,
        )

    }

    return total

  }


  // ==========================================
  // Pontuação
  // ==========================================

  private static calculateScore(
    rule: SemanticRule,
    occurrences: number,
    title: string,
  ): number {

    let score =
      rule.score

    // ----------------------------------------
    // Repetição aumenta relevância
    // ----------------------------------------

    if (
      occurrences > 1
    ) {

      score +=
        Math.min(
          (occurrences - 1) * 5,
          20,
        )

    }

    // ----------------------------------------
    // Elementos mencionados no título
    // ganham relevância
    // ----------------------------------------

    const appearsInTitle =
      rule.keywords.some(
        keyword =>
          KeywordEngine.contains(
            title,
            keyword,
          ),
      )

    if (
      appearsInTitle
    ) {

      score += 15

    }

    return Math.min(
      score,
      100,
    )

  }


  // ==========================================
  // ID
  // ==========================================

  private static createEntityId(
    rule: SemanticRule,
    keywords: string[],
  ): string {

    const base =
      `${rule.type}-${rule.name}`

    const suffix =
      keywords
        .join("-")
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          "-",
        )

    return `${base}-${suffix}`

  }


  // ==========================================
  // Remover duplicações
  // ==========================================

  private static removeDuplicates(
    entities: ExplorerEntity[],
  ): ExplorerEntity[] {

    const map =
      new Map<
        string,
        ExplorerEntity
      >()

    for (
      const entity of entities
    ) {

      const existing =
        map.get(entity.id)

      if (!existing) {

        map.set(
          entity.id,
          entity,
        )

        continue

      }

      // --------------------------------------
      // Se a entidade já existe,
      // mantemos a maior pontuação.
      // --------------------------------------

      if (
        entity.score >
        existing.score
      ) {

        map.set(
          entity.id,
          entity,
        )

      }

    }

    return Array.from(
      map.values(),
    )

  }

}