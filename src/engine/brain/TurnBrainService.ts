import { ContextBuilder } from "../context/ContextBuilder"

import { BrainEngine } from "./BrainEngine"

import { NarraverseWriter } from "../writer/NarraverseWriter"
import { WriterContextBuilder } from "../writer/WriterContextBuilder"

import type { Character } from "../../types/character"
import type { BrainProfile } from "./BrainProfile"
import type { SceneContext } from "../context/SceneContext"
import type { TimelineContext } from "../context/TimelineContext"



export class TurnBrainService {

  static generate(

    profile: BrainProfile,

    context: {

  rpgId: number

  world: unknown[]

  lore: unknown[]

  factions: unknown[]

  characters: Character[]

  npcs: Character[]

  currentScene?: SceneContext

  currentTurn?: TimelineContext

},

  ) {

    // ======================================
    // Contexto para o cérebro
    // ======================================

    const aiContext =
      ContextBuilder.build(
        profile.character,
        context,
      )

    // ======================================
    // Pensamento
    // ======================================

    const brain =
      BrainEngine.think(
        aiContext,
        profile,
      )

    // ======================================
    // Contexto para o Writer
    // ======================================

    const writer =
  WriterContextBuilder.build(
    brain,
  )

    // ======================================
    // Texto final
    // ======================================

    return NarraverseWriter.generate(
      writer,
    )

  }

}