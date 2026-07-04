import type { WriterContext } from "./WriterContext"
import type { WriterPrompt } from "./WriterPrompt"

export class PromptAssembler {

  static build(

    context: WriterContext,

  ): WriterPrompt {

    return {

      narrator:
        context.prompt.characterName,

      objective:
        context.prompt.objective,

      emotion:
        context.prompt.emotion,

      tactical:
        context.prompt.tacticalDecision,

      memories:
        context.prompt.recentMemories,

      strategy:
        context.prompt.strategy,

      plan:
        context.prompt.plan,

    }

  }

}