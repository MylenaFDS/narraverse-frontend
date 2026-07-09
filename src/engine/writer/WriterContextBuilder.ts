import type { BrainResult } from "../brain/types/BrainResult"
import type { WriterContext } from "./WriterContext"

export class WriterContextBuilder {

  static build(

    brain: BrainResult,

  ): WriterContext {

    return {

      prompt: brain.narrativeContext,

      maxWords: 180,

      firstPerson: true,

      allowDialogue: true,

    }

  }

}