import { ContextBuilder } from "../context/ContextBuilder"

import { BrainEngine } from "./BrainEngine"

import { NarraverseWriter } from "../writer/NarraverseWriter"

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

    // ==========================
    // Contexto da IA
    // ==========================

    const aiContext =
      ContextBuilder.build(

        profile.character,

        context,

      )

    // ==========================
    // Cérebro
    // ==========================

    const brain =

      BrainEngine.think(

        aiContext,

        profile,

      )

    // ==========================
    // Escritor
    // ==========================

    return NarraverseWriter.generate({

      prompt:

        brain.narrativeContext,

      maxWords: 250,

      firstPerson: true,

      allowDialogue: true,

    })

  }

}