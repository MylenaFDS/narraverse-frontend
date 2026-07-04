import type { StyleProfile } from "./StyleProfile"
import type { WriterPrompt } from "./WriterPrompt"

export class StyleEngine {

  static apply(
    prompt: WriterPrompt,
  ) {

    const profile =
      this.createProfile(prompt)

    return {

      ...prompt,

      style: profile,

    }

  }

  private static createProfile(
    prompt: WriterPrompt,
  ): StyleProfile {

    const emotion =
      String(prompt.emotion).toLowerCase()

    if (
      emotion.includes("anger")
    ) {

      return {

        sentenceSize: "short",

        adjectiveLevel: 20,

        dialogueLevel: 30,

        introspectionLevel: 5,

        aggressionLevel: 100,

        emotionLevel: 90,

      }

    }

    if (
      emotion.includes("fear")
    ) {

      return {

        sentenceSize: "short",

        adjectiveLevel: 60,

        dialogueLevel: 15,

        introspectionLevel: 95,

        aggressionLevel: 10,

        emotionLevel: 100,

      }

    }

    return {

      sentenceSize: "medium",

      adjectiveLevel: 50,

      dialogueLevel: 40,

      introspectionLevel: 50,

      aggressionLevel: 40,

      emotionLevel: 60,

    }

  }

}