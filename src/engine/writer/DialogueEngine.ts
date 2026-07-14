import type { WriterPrompt } from "./WriterPrompt"
import { EmotionInterpreterEngine } from "../emotion/EmotionInterpreterEngine"

export class DialogueEngine {

  static create(
    prompt: WriterPrompt,
  ): string {

    const emotion = EmotionInterpreterEngine.getDominantEmotion(
  prompt.emotion
)


    if (emotion === "anger") {

      return `"Chega de palavras."`

    }


    if (emotion === "fear") {

      return `"Isso não parece uma boa ideia..."`

    }


    if (emotion === "trust") {

      return `"Estou com vocês."`

    }


    if (emotion === "sadness") {

      return `"Eu esperava que não chegasse a esse ponto..."`

    }


    if (emotion === "curiosity") {

      return `"Preciso descobrir o que está acontecendo."`

    }


    return ""

  }


  

}