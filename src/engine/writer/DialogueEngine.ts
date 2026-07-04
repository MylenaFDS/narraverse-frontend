import type { WriterPrompt } from "./WriterPrompt"

export class DialogueEngine {

  static create(
    prompt: WriterPrompt,
  ): string {

    const emotion =
      prompt.emotion.toLowerCase()

    if (emotion.includes("anger")) {

      return `"Chega de palavras."`

    }

    if (emotion.includes("fear")) {

      return `"Isso não parece uma boa ideia..."`

    }

    if (emotion.includes("trust")) {

      return `"Estou com vocês."`

    }

    return ""

  }

}