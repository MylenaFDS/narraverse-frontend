import type { WriterContext } from "./WriterContext"
import type { NarrativeDraft } from "./NarrativeDraft"

import { ActionLibrary } from "./libraries/ActionLibrary"
import { ConnectorLibrary } from "./libraries/ConnectorLibrary"
import { DialogueLibrary } from "./libraries/DialogueLibrary"
import { EmotionLibrary } from "./libraries/EmotionLibrary"
import { EndingLibrary } from "./libraries/EndingLibrary"

import { StyleEngine } from "./StyleEngine"

export class NarrativeComposer {

  private static random<T>(
    items: T[],
  ): T {

    return items[
      Math.floor(
        Math.random() * items.length,
      )
    ]

  }

  static compose(
    context: WriterContext,
  ): NarrativeDraft {

    const style =
      StyleEngine.apply({

        characterName:
          context.character.name,

        personality:
          context.personality,

        emotion:
          context.emotion,

        goal:
          context.goal?.title ?? null,

        decision:
          context.decision,

        plan:
          context.plan,

      }).style

    const dominantEmotion =
      Object.entries(
        context.emotion,
      ).sort(
        (a, b) => b[1] - a[1],
      )[0]?.[0] ?? "trust"

    const intro =
      this.random(
        ConnectorLibrary.introductions,
      )

    const emotion =
      this.random(

        EmotionLibrary.get(
          dominantEmotion,
        ),

      )

    const action =
      this.random(

        ActionLibrary.get(
          context.decision.action,
        ),

      )

    const dialogue =
      context.allowDialogue

        ? this.random(

            DialogueLibrary.get(
              dominantEmotion,
            ),

          )

        : ""

    const ending =
      this.random(
        EndingLibrary.endings,
      )

    const prompt = [

      intro,

      emotion,

      action,

      dialogue,

      ending,

    ]

      .filter(Boolean)

      .join(" ")

    return {

      prompt,

      dominantEmotion,

      style,

      writerHints: {

        firstPerson:
          context.firstPerson,

        allowDialogue:
          context.allowDialogue,

        maxWords:
          context.maxWords,

      },

    }

  }

}