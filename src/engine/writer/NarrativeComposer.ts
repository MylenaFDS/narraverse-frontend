import type { WriterContext } from "./WriterContext"
import type { NarrativeDraft } from "./NarrativeDraft"

import { LibraryManager } from "./LibraryManager"
import { StyleEngine } from "./StyleEngine"


export class NarrativeComposer {


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

      })



    const dominantEmotion =
      Object.entries(
        context.emotion,
      ).sort(
        (a, b) => b[1] - a[1],
      )[0]?.[0] ?? "trust"



    const prompt =
      LibraryManager.compose(

        {

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

        },

        [],

      )



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