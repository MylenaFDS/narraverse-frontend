import type { EmotionState } from "../types/Emotion"


export interface EmotionProfile {

  dominant: string

  intensity: number

}



export class EmotionInterpreterEngine {


  static analyze(
    emotion: EmotionState,
  ): EmotionProfile {


    const dominant =
      this.getDominantEmotion(
        emotion,
      )


    return {

      dominant,

      intensity:
        emotion[dominant],

    }

  }



  static getDominantEmotion(
    emotion: EmotionState,
  ): keyof EmotionState {


    return Object.entries(
      emotion,
    )
      .sort(
        (a, b) => b[1] - a[1],
      )[0][0] as keyof EmotionState


  }


}