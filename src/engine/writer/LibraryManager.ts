import type { WriterPrompt } from "./WriterPrompt"

import { ActionLibrary } from "./libraries/ActionLibrary"
import { ConnectorLibrary } from "./libraries/ConnectorLibrary"
import { DialogueLibrary } from "./libraries/DialogueLibrary"
import { EmotionLibrary } from "./libraries/EmotionLibrary"
import { EndingLibrary } from "./libraries/EndingLibrary"


export class LibraryManager {


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
    prompt: WriterPrompt,
    fragments: string[] = [],
  ): string {


    const parts: string[] = []



    // ======================================
    // Emoção dominante
    // ======================================

    const dominantEmotion =
      Object.entries(
        prompt.emotion,
      ).sort(
        (a, b) => b[1] - a[1],
      )[0]?.[0] ?? "trust"



    // ======================================
    // Conector
    // ======================================

    const connector =
      this.random(
        ConnectorLibrary.introductions,
      )


    if (connector) {

      parts.push(
        connector,
      )

    }



    // ======================================
    // Emoção
    // ======================================

    const emotions =
      EmotionLibrary.get(
        dominantEmotion,
      )


    if (
      emotions &&
      emotions.length > 0
    ) {

      parts.push(
        this.random(
          emotions,
        ),
      )

    }



    // ======================================
    // Ação
    // ======================================

    const actions =
      ActionLibrary.get(
        prompt.decision.action,
      )


    if (
      actions &&
      actions.length > 0
    ) {

      parts.push(
        this.random(
          actions,
        ),
      )

    }



    // ======================================
    // Fragmentos extras
    // ======================================

    if (
      fragments.length > 0
    ) {

      parts.push(
        ...fragments,
      )

    }



    // ======================================
    // Diálogo
    // ======================================

    const dialogues =
      DialogueLibrary.get(
        dominantEmotion,
      )


    if (
      dialogues &&
      dialogues.length > 0
    ) {

      parts.push(
        this.random(
          dialogues,
        ),
      )

    }



    // ======================================
    // Final
    // ======================================

    const ending =
      this.random(
        EndingLibrary.endings,
      )


    if (ending) {

      parts.push(
        ending,
      )

    }



    return parts
      .filter(Boolean)
      .join(" ")

  }

}