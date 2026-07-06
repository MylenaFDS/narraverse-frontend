import type { BrainProfile } from "./BrainProfile"
import type { DialogueLine } from "./types"

export class DialoguePlanner {

  static build(

    profile: BrainProfile,

    intent: string,

  ): DialogueLine {

    const personality =
      profile.personality

    const emotion =
      profile.emotions

    let text = intent

    // Honra

    if (
      personality.honor > 70
    ) {

      text =
        `Com todo respeito, ${intent.toLowerCase()}.`

    }

    // Crueldade

    if (
      personality.cruelty > 70
    ) {

      text =
        `Você vai obedecer. ${intent}`

    }

    // Empatia

    if (
      personality.empathy > 70
    ) {

      text =
        `Entendo como você se sente... ${intent}`

    }

    // Ambição

    if (
      personality.ambition > 80
    ) {

      text =
        `Isto nos aproximará do poder. ${intent}`

    }

    // Medo

    if (
      emotion.fear > 70
    ) {

      text =
        `${intent}... rápido!`

    }

    // Raiva

    if (
      emotion.anger > 70
    ) {

      text =
        `${intent}! Agora!`

    }

    return {

      text,

      emotion:
        this.currentEmotion(
          emotion,
        ),

      politeness:
        personality.empathy,

    }

  }

  private static currentEmotion(
    emotions: BrainProfile["emotions"],
  ) {

    const entries =
      Object.entries(emotions)

    entries.sort(

      (a, b) =>

        b[1] - a[1],

    )

    return entries[0][0]

  }

}