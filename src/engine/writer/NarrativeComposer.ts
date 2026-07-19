import type { WriterContext } from "./WriterContext"
import type { NarrativeDraft } from "./NarrativeDraft"

import { StyleEngine } from "./StyleEngine"
import { LibraryManager } from "./LibraryManager"
import { NarrativeEventPlanner } from "./planner/NarrativeEventPlanner"
import { SentencePlanner } from "./planner/SentencePlanner"
import { StyleTransformerEngine } from "./StyleTransformerEngine"


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
        context.emotion ?? {},
      )
      .sort(
        (a,b) =>
          b[1] - a[1],
      )[0]?.[0] ?? "trust"



    // ============================
    // Planejamento
    // ============================

    const events =
      NarrativeEventPlanner.plan(
        context,
      )



    // ============================
    // Bibliotecas
    // ============================

    const fragments =
      LibraryManager.compose(
        events,
        context.story,
      )



    // ============================
    // Montagem narrativa
    // ============================

    const text =
      SentencePlanner.compose(
        fragments,
      )



    // ============================
    // Estilo
    // ============================

    const prompt =
      StyleTransformerEngine.apply(
        text,
        style,
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