import type { EmotionState } from "../brain/types/Emotion"


export class EmotionInterpreterEngine {


  static getDominantEmotion(
    emotion: EmotionState,
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


  static describe(
    emotion: EmotionState,
  ): string {

    const dominant = this.getDominantEmotion(
      emotion
    )


    const descriptions: Record<string, string> = {

      happiness: "felicidade",

      sadness: "tristeza",

      anger: "raiva",

      fear: "medo",

      trust: "confiança",

      curiosity: "curiosidade",

      surprise: "surpresa",

      disgust: "repulsa",

    }


    return descriptions[dominant] ?? "neutralidade"

  }

}