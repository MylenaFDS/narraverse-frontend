import type { AssistantContext } from "./AssistantContext"
import type { AssistantResult } from "./AssistantResult"

import { AssistantEngine } from "./AssistantEngine"

export class AssistantService {

  static generate(
    context: AssistantContext,
  ): AssistantResult {

    return AssistantEngine.assist(
      context,
    )

  }

}