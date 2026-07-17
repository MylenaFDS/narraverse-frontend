import type { NarrativeDraft } from "./NarrativeDraft"

import { StyleTransformerEngine } from "./StyleTransformerEngine"

export class TurnFormatter {

  static format(
    draft: NarrativeDraft,
  ): string {

    const styledText =
      StyleTransformerEngine.apply(

        draft.prompt,

        draft.style,

      )

    return styledText

  }

}