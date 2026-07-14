import type { WriterContext } from "./WriterContext"
import type { WriterPrompt } from "./WriterPrompt"

export class PromptAssembler {

  static build(
    context: WriterContext,
  ): WriterPrompt {

    return {

      // =====================================
      // Personagem
      // =====================================

      characterName:
        context.character.name,

      // =====================================
      // Personalidade
      // =====================================

      personality:
        context.personality,

      // =====================================
      // Emoções
      // =====================================

      emotion:
        context.emotion,

      // =====================================
      // Objetivo
      // =====================================

      goal:
        context.goal
          ? context.goal.title
          : null,

      // =====================================
      // Decisão
      // =====================================

      decision:
        context.decision,

      // =====================================
      // Plano
      // =====================================

      plan:
        context.plan,

    }

  }

}