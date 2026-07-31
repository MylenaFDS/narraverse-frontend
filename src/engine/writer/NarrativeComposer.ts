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

    // ======================================
    // Perfil narrativo
    // ======================================

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

    // ======================================
    // Emoção dominante
    // ======================================

    const dominantEmotion =
      Object.entries(
        context.emotion ?? {},
      )
        .sort(
          (a,b)=>
            b[1]-a[1],
        )[0]?.[0]
      ??
      "trust"

    // ======================================
    // Planejamento de eventos
    // ======================================

    const events =
      NarrativeEventPlanner.plan(
        context,
      )

    // ======================================
    // Biblioteca narrativa
    // ======================================

    const fragments =
      LibraryManager.compose(

        events,

        context.story,

      )

    // ======================================
    // Planejamento de frases
    // ======================================

    let text =
      SentencePlanner.compose(
        fragments,
      )

    // ======================================
    // Contexto emocional
    // ======================================

    if(
      dominantEmotion ===
      "fear"
    ){

      text =
        "O ambiente parecia mais pesado do que o normal. "
        + text

    }

    if(
      dominantEmotion ===
      "anger"
    ){

      text =
        "A tensão era impossível de ignorar. "
        + text

    }

    if(
      dominantEmotion ===
      "joy"
    ){

      text =
        "Por um breve instante, tudo parecia finalmente em paz. "
        + text

    }

    // ======================================
    // Objetivo da cena
    // ======================================

    if(
      context.goal
    ){

      text +=
        ` O objetivo imediato permanece: ${context.goal.title}.`

    }

    // ======================================
    // Consequências
    // ======================================

    if(
      context.story.currentSituation
    ){

      text +=
        ` Esta situação pode alterar os próximos acontecimentos.`

    }

    // ======================================
    // Continuidade
    // ======================================

    if(
      context.story.previousSummary
    ){

      text =
        `${context.story.previousSummary}\n\n${text}`

    }

    // ======================================
    // Transformação de estilo
    // ======================================

    const prompt =
      StyleTransformerEngine.apply(

        text,

        style,

      )

    // ======================================
    // Resultado
    // ======================================

    return {

      prompt,

      dominantEmotion,

      style,

      writerHints:{

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