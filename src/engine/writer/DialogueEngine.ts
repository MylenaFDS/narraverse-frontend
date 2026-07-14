import type { WriterPrompt } from "./WriterPrompt"


export class DialogueEngine {

  static create(
    prompt: WriterPrompt,
  ): string {

    const emotion = this.getDominantEmotion(
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


  private static getDominantEmotion(
    emotion: WriterPrompt["emotion"],
  ): string {

    const values = [

      {
        name: "happiness",
        value: emotion.happiness,
      },

      {
        name: "sadness",
        value: emotion.sadness,
      },

      {
        name: "anger",
        value: emotion.anger,
      },

      {
        name: "fear",
        value: emotion.fear,
      },

      {
        name: "trust",
        value: emotion.trust,
      },

      {
        name: "curiosity",
        value: emotion.curiosity,
      },

      {
        name: "surprise",
        value: emotion.surprise,
      },

      {
        name: "disgust",
        value: emotion.disgust,
      },

    ]


    return values.sort(
      (a, b) => b.value - a.value
    )[0].name

  }

}