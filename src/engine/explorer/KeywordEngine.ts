import type { SemanticRule } from "./SemanticRules"


export interface KeywordMatch {

  keyword: string

  start: number

  end: number

  occurrences: number

}


export class KeywordEngine {

  // ==========================================
  // Normalização
  // ==========================================

  static normalize(
    text: string,
  ): string {

    return text
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        "",
      )
      .toLowerCase()
      .replace(
        /\s+/g,
        " ",
      )
      .trim()

  }


  // ==========================================
  // Preparação do texto
  // ==========================================

  static prepare(
    text: string,
  ): string {

    return this
      .normalize(text)

  }


  // ==========================================
  // Verificação de palavra
  // ==========================================

  static contains(
    text: string,
    keyword: string,
  ): boolean {

    const normalizedText =
      this.normalize(text)

    const normalizedKeyword =
      this.normalize(keyword)

    return normalizedText.includes(
      normalizedKeyword,
    )

  }


  // ==========================================
  // Contagem
  // ==========================================

  static count(
    text: string,
    keyword: string,
  ): number {

    const normalizedText =
      this.normalize(text)

    const normalizedKeyword =
      this.normalize(keyword)

    if (
      !normalizedKeyword ||
      !normalizedText
    ) {

      return 0

    }

    let count = 0

    let position = 0

    while (true) {

      const index =
        normalizedText.indexOf(
          normalizedKeyword,
          position,
        )

      if (index === -1) {

        break

      }

      count++

      position =
        index +
        normalizedKeyword.length

    }

    return count

  }


  // ==========================================
  // Encontrar todas as ocorrências
  // ==========================================

  static findMatches(
    text: string,
    keyword: string,
  ): KeywordMatch[] {

    const normalizedText =
      this.normalize(text)

    const normalizedKeyword =
      this.normalize(keyword)

    const matches:
      KeywordMatch[] = []

    if (
      !normalizedKeyword ||
      !normalizedText
    ) {

      return matches

    }

    let position = 0

    while (true) {

      const index =
        normalizedText.indexOf(
          normalizedKeyword,
          position,
        )

      if (index === -1) {

        break

      }

      matches.push({

        keyword:
          normalizedKeyword,

        start:
          index,

        end:
          index +
          normalizedKeyword.length,

        occurrences:
          1,

      })

      position =
        index +
        normalizedKeyword.length

    }

    return matches

  }


  // ==========================================
  // Procurar dentro das regras
  // ==========================================

  static matchRules(
    text: string,
    rules: SemanticRule[],
  ): SemanticRule[] {

    const normalizedText =
      this.normalize(text)

    const matched:
      SemanticRule[] = []

    for (
      const rule of rules
    ) {

      const found =
        rule.keywords.some(
          keyword =>
            normalizedText.includes(
              this.normalize(
                keyword,
              ),
            ),
        )

      if (found) {

        matched.push(rule)

      }

    }

    return matched

  }


  // ==========================================
  // Descobrir palavras correspondentes
  // ==========================================

  static getMatchedKeywords(
    text: string,
    keywords: string[],
  ): string[] {

    const normalizedText =
      this.normalize(text)

    const matches:
      string[] = []

    for (
      const keyword of keywords
    ) {

      const normalizedKeyword =
        this.normalize(
          keyword,
        )

      if (
        normalizedText.includes(
          normalizedKeyword,
        )
      ) {

        matches.push(
          keyword,
        )

      }

    }

    return matches

  }

}