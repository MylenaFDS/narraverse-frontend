import type { WriterContext } from "./WriterContext"

import { PromptAssembler } from "./PromptAssembler"

import { StyleEngine } from "./StyleEngine"

import { DialogueEngine } from "./DialogueEngine"

import { DescriptionEngine } from "./DescriptionEngine"

import { TurnFormatter } from "./TurnFormatter"



export class NarraverseWriter {

  static generate(

  context: WriterContext,

) {

  

  const prompt =

    PromptAssembler.build(

      context,

    )

  const style =

    StyleEngine.apply(

      prompt,

    )

  const description =

    DescriptionEngine.describe(

      style,

    )

  const dialogue =

    DialogueEngine.create(

      style,

    )

  return TurnFormatter.format(

    description,

    dialogue,

  )

}

}