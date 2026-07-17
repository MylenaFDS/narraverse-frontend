import type { WriterContext } from "./WriterContext"

import { NarrativeComposer } from "./NarrativeComposer"
import { TurnFormatter } from "./TurnFormatter"


export class NarraverseWriter {


  static generate(
    context: WriterContext,
  ): string {


    const draft =
      NarrativeComposer.compose(
        context,
      )


    const formatted =
      TurnFormatter.format(
        draft,
      )


    return formatted

  }

}