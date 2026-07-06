import type { NarrativePrompt }

from "../brain/types/NarrativePrompt"

export interface WriterContext {

  prompt: NarrativePrompt

  maxWords: number

  firstPerson: boolean

  allowDialogue: boolean

}