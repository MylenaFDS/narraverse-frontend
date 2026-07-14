import type { StyleProfile } from "./StyleProfile"

export interface NarrativeDraft {

  prompt: string

  dominantEmotion: string

  style: StyleProfile

  writerHints: {

    firstPerson: boolean

    allowDialogue: boolean

    maxWords: number

  }

}