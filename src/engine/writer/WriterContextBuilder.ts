import type { BrainResult } from "../brain/types/BrainResult"
import type { WriterContext } from "./WriterContext"

export class WriterContextBuilder {

  static build(
    brain: BrainResult,
  ): WriterContext {

    return {

      // ======================================
      // Prompt base
      // ======================================

      prompt: brain.narrativeContext,

      // ======================================
      // Personagem
      // ======================================

      character: brain.character,

      // ======================================
      // Estado mental
      // ======================================

      personality: brain.personality,

      emotion: brain.emotion,

      goal: brain.goal,

      strategy: brain.strategy,

      plan: brain.plan,

      decision: brain.decision,

      behavior: brain.behavior,

      // ======================================
      // Configuração da escrita
      // ======================================

      maxWords: 180,

      firstPerson: true,

      allowDialogue: true,

    }

  }

}