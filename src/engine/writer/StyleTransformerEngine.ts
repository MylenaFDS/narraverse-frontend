import type { StyleProfile } from "./StyleProfile"

export class StyleTransformerEngine {

  static apply(
    text: string,
    style: StyleProfile,
  ): string {

    let result =
      text.trim()

    // =====================================
    // Frases curtas
    // =====================================

    if (
      style.sentenceSize === "short"
    ) {

      result =
        this.makeShortSentences(
          result,
        )

    }

    // =====================================
    // Frases longas
    // =====================================

    if (
      style.sentenceSize === "long"
    ) {

      result =
        this.makeReflective(
          result,
        )

    }

    // =====================================
    // Emoção
    // =====================================

    if (
      style.emotionLevel > 80
    ) {

      result =
        this.increaseEmotion(
          result,
        )

    }

    // =====================================
    // Introspecção
    // =====================================

    if (
      style.introspectionLevel > 80
    ) {

      result =
        this.addReflection(
          result,
        )

    }

    // =====================================
    // Agressividade
    // =====================================

    if (
      style.aggressionLevel > 80
    ) {

      result =
        this.addIntensity(
          result,
        )

    }

    return result

  }

  private static makeShortSentences(
    text: string,
  ): string {

    return text
      .split(",")
      .join(".")
      .replace(
        /\s+/g,
        " ",
      )

  }

  private static makeReflective(
    text: string,
  ): string {

    return (
      "Por um instante, "
      +
      text.charAt(0).toLowerCase()
      +
      text.slice(1)
    )

  }

  private static increaseEmotion(
    text: string,
  ): string {

    return (
      text
      +
      " O peso daquele momento parecia impossível de ignorar."
    )

  }

  private static addReflection(
    text: string,
  ): string {

    return (
      text
      +
      " Me perguntei quais consequências minhas escolhas trariam."
    )

  }

  private static addIntensity(
    text: string,
  ): string {

    return (
      text
      +
      " Não havia espaço para hesitação."
    )

  }

}