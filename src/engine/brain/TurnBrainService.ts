import { ContextBuilder } from "../context/ContextBuilder"

import { BrainEngine } from "./BrainEngine"

import { NarraverseWriter } from "../writer/NarraverseWriter"
import { WriterContextBuilder } from "../writer/WriterContextBuilder"

import type { BrainProfile } from "./BrainProfile"
import type { WorldContext } from "../context/ContextEngine"

export class TurnBrainService {

  static generate(

    profile: BrainProfile,

    context: WorldContext,

  ) {

    const aiContext =
      ContextBuilder.build(
        profile.character,
        context,
      )

    const brain =
      BrainEngine.think(
        aiContext,
        profile,
      )

    const writer =
      WriterContextBuilder.build(
        brain,
      )

    return NarraverseWriter.generate(
      writer,
    )

  }

}