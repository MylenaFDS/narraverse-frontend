import type { StyleProfile } from "./StyleProfile"
import type { WriterPrompt } from "./WriterPrompt"

import { EmotionInterpreterEngine } from "../emotion/EmotionInterpreterEngine"


export class StyleEngine {


  static apply(
    prompt: WriterPrompt,
  ): StyleProfile {

    return this.createProfile(
      prompt,
    )

  }



  private static createProfile(
    prompt: WriterPrompt,
  ): StyleProfile {


    const emotion =
      EmotionInterpreterEngine.getDominantEmotion(
        prompt.emotion,
      )


    const personality =
      prompt.personality


    const decision =
      prompt.decision?.action ?? ""



    let sentenceSize:
      | "short"
      | "medium"
      | "long" = "medium"


    let adjectiveLevel = 50

    let dialogueLevel = 40

    let introspectionLevel = 50

    let aggressionLevel = 40

    let emotionLevel = 60



    // =====================================
    // Emoção dominante
    // =====================================

    switch (emotion) {


      case "anger":

        sentenceSize = "short"

        aggressionLevel = 100

        emotionLevel = 90

        adjectiveLevel = 20

        introspectionLevel = 5

        dialogueLevel = 30

        break



      case "fear":

        sentenceSize = "short"

        aggressionLevel = 10

        emotionLevel = 100

        adjectiveLevel = 60

        introspectionLevel = 95

        dialogueLevel = 15

        break



      case "sadness":

        sentenceSize = "long"

        adjectiveLevel = 80

        introspectionLevel = 95

        dialogueLevel = 20

        emotionLevel = 90

        aggressionLevel = 0

        break



      case "trust":

        sentenceSize = "medium"

        adjectiveLevel = 60

        dialogueLevel = 55

        introspectionLevel = 60

        aggressionLevel = 15

        emotionLevel = 70

        break



      case "happiness":

        sentenceSize = "medium"

        adjectiveLevel = 55

        dialogueLevel = 50

        introspectionLevel = 40

        aggressionLevel = 10

        emotionLevel = 75

        break

    }



    // =====================================
    // Personalidade
    // =====================================

    if (personality.intelligence > 80) {

      adjectiveLevel += 20

      sentenceSize = "long"

    }


    if (personality.curiosity > 80) {

      introspectionLevel += 15

    }


    if (personality.courage > 80) {

      aggressionLevel += 20

    }


    if (personality.empathy > 80) {

      dialogueLevel += 20

    }


    if (personality.patience > 80) {

      sentenceSize = "long"

    }


    if (personality.cruelty > 80) {

      aggressionLevel += 40

    }


    if (personality.greed > 80) {

      introspectionLevel -= 15

    }


    if (personality.honor > 80) {

      dialogueLevel += 10

    }


    if (personality.loyalty > 80) {

      emotionLevel += 10

    }



    // =====================================
    // Decisão
    // =====================================

    switch (decision) {


      case "attack":

        aggressionLevel += 25

        sentenceSize = "short"

        break



      case "talk":

        dialogueLevel += 25

        break



      case "explore":

        adjectiveLevel += 15

        introspectionLevel += 10

        break



      case "retreat":

        introspectionLevel += 20

        aggressionLevel -= 20

        break



      case "defend":

        emotionLevel += 10

        break

    }



    // =====================================
    // Limites
    // =====================================

    adjectiveLevel =
      Math.max(
        0,
        Math.min(100, adjectiveLevel),
      )


    dialogueLevel =
      Math.max(
        0,
        Math.min(100, dialogueLevel),
      )


    introspectionLevel =
      Math.max(
        0,
        Math.min(100, introspectionLevel),
      )


    aggressionLevel =
      Math.max(
        0,
        Math.min(100, aggressionLevel),
      )


    emotionLevel =
      Math.max(
        0,
        Math.min(100, emotionLevel),
      )



    return {


      sentenceSize,


      adjectiveLevel,


      dialogueLevel,


      introspectionLevel,


      aggressionLevel,


      emotionLevel,


    }

  }

}