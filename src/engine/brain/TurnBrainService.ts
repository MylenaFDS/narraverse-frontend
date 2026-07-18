import { ContextBuilder } from "../context/ContextBuilder"

import { BrainEngine } from "./BrainEngine"

import { NarraverseWriter } from "../writer/NarraverseWriter"
import { WriterContextBuilder } from "../writer/WriterContextBuilder"

import type { BrainProfile } from "./BrainProfile"
import type { WorldContext } from "../context/ContextEngine"
import type { RPGTurn } from "../../types/turn"

export class TurnBrainService {

  static generate(

    profile: BrainProfile,

    context: WorldContext,

    turns: RPGTurn[],

  ): string {

    // ======================================
    // Contexto utilizado pelo cérebro
    // ======================================

    const aiContext =
      ContextBuilder.build(
        profile.character,
        context,
      )

    // ======================================
    // Processamento do cérebro
    // ======================================

    const brain =
      BrainEngine.think(
        aiContext,
        profile,
      )

    // ======================================
    // Contexto utilizado pelo Writer
    // ======================================

    const writer =
      WriterContextBuilder.build(
        brain,
        turns,
      )

    // ======================================
    // Escrita do turno
    // ======================================

    const text =
      NarraverseWriter.generate(
        writer,
      )

    return text

  }

}