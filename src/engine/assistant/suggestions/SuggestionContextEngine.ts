import type { StoryAnalysis } from "../analysis/StoryAnalysis"
import type { NarrativeState } from "../state/NarrativeState"

import type {
  SuggestionContext,
} from "./SuggestionContext"

export class SuggestionContextEngine {

  static build(
    analysis: StoryAnalysis,
    state: NarrativeState,
  ): SuggestionContext {

    return {
    
      // Contexto completo
      analysis,
      state,

      // Contexto resumido
      focus:
        this.detectFocus(state),

      protagonist:
        analysis.focusedCharacter,

      antagonist:
        analysis.activeConflicts[0],

      objective:
        analysis.activeObjectives[0],

      location:
        analysis.currentLocation,

      tension:
        state.tension,

      canInteract:
        state.canInteract,

      canExplore:
        state.canExplore,

      hasDialogue:
        state.hasDialogue,

      hasDeath:
        state.hasDeath,

      hasOpenThreads:
        state.hasOpenThreads,

    }

  }

  private static detectFocus(
    state: NarrativeState,
  ): SuggestionContext["focus"] {

    switch (state.situation) {

      case "combat":
        return "combat"

      case "dialogue":
        return "dialogue"

      case "exploration":
        return "exploration"

      case "investigation":
        return "investigation"

      default:
        return "emotion"

    }

  }

}