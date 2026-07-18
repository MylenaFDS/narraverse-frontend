import type { BrainResult } from "../brain/types/BrainResult"
import type { WriterContext } from "./WriterContext"

import {
  StoryContextEngine,
} from "./story/StoryContextEngine"

import type {
  RPGTurn,
} from "../../types/turn"


export class WriterContextBuilder {


  static build(
    brain: BrainResult,
    turns: RPGTurn[] = [],
  ): WriterContext {


    const story =
      StoryContextEngine.build(
        turns,
      )



    return {


      // ======================================
      // Prompt base
      // ======================================

      prompt:
        brain.narrativeContext,



      // ======================================
      // História atual
      // ======================================

      story,



      // ======================================
      // Personagem
      // ======================================

      character:
        brain.character,



      // ======================================
      // Estado mental
      // ======================================

      personality:
        brain.personality,


      emotion:
        brain.emotion,


      goal:
        brain.goal,


      strategy:
        brain.strategy,


      plan:
        brain.plan,


      decision:
        brain.decision,


      behavior:
        brain.behavior,



      // ======================================
      // Escrita
      // ======================================

      maxWords:
        180,


      firstPerson:
        true,


      allowDialogue:
        true,


    }

  }

}