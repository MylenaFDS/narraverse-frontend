import type { NarrativePrompt }

from "../brain/NarrativePrompt"

export interface WriterContext {

  prompt: NarrativePrompt

  maxWords: number

  firstPerson: boolean

  allowDialogue: boolean

}