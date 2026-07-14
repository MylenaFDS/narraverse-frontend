import type { Personality } from "../brain/types/Personality"
import type { EmotionState } from "../brain/types/Emotion"
import type { Decision } from "../brain/types/Decision"
import type { Plan } from "../brain/types/Planning"

import {
  PersonalityInterpreterEngine,
} from "../brain/interpreter/PersonalityInterpreterEngine"

import {
  DecisionInterpreterEngine,
} from "../brain/interpreter/DecisionInterpreterEngine"

import {
  EmotionInterpreterEngine,
} from "../brain/interpreter/EmotionInterpreterEngine"



export interface NarrativeContext {


  characterName: string


  personality: {

    traits: string[]

    narrativeTone: string

  }



  emotion: {

    dominant: string

    intensity: number

  }



  decision: {

    behavior: string

    urgency: string

    tone: string

    narrativeIntent: string

  }



  goal:
    string | null



  plan:
    Plan | null


}



export class ContextNormalizerEngine {



  static normalize(
    
    data: {

      characterName: string

      personality: Personality

      emotion: EmotionState

      decision: Decision

      goal: string | null

      plan: Plan | null

    }

  ): NarrativeContext {



    const personality =
      PersonalityInterpreterEngine.analyze(
        data.personality,
      )



    const decision =
      DecisionInterpreterEngine.analyze(
        data.decision,
      )



    const dominantEmotion =
      EmotionInterpreterEngine.getDominantEmotion(
        data.emotion,
      )



    const intensity =
      data.emotion[
        dominantEmotion
      ]



    return {


      characterName:
        data.characterName,



      personality: {

        traits:
          personality.traits,

        narrativeTone:
          personality.narrativeTone,

      },



      emotion: {

        dominant:
          dominantEmotion,

        intensity,

      },



      decision: {

        behavior:
          decision.behavior,

        urgency:
          decision.urgency,

        tone:
          decision.tone,

        narrativeIntent:
          decision.narrativeIntent,

      },



      goal:
        data.goal,



      plan:
        data.plan,


    }

  }

}