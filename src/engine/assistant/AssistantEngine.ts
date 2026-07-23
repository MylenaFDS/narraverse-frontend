import type {
  AssistantContext,
} from "./AssistantContext"

import type {
  AssistantResult,
} from "./AssistantResult"


import { SummaryEngine } from "./summary/SummaryEngine"

import { SuggestionEngine } from "./suggestions/SuggestionEngine"

import { EventSuggestionEngine } from "./suggestions/EventSuggestionEngine"

import { CharacterStatusEngine } from "./CharacterStatusEngine"

import { StoryAnalysisEngine } from "./analysis/StoryAnalysisEngine"

import { CampaignStateEngine } from "./state/CampaignStateEngine"

import { EventInterpreterEngine } from "./state/events/EventInterpreterEngine"



export class AssistantEngine {

  static assist(
    context: AssistantContext,
  ): AssistantResult {

    const events =
      context.turn
        ? EventInterpreterEngine.interpret(
            context.turn,
          )
        : []

    const campaignState =
      CampaignStateEngine.update(
        context.campaignState,
        events,
      )

    const analysis =
      StoryAnalysisEngine.analyze({

        ...context,

        campaignState,

      })

    return {

      summary:

        SummaryEngine.build(
          analysis,
        ),

      suggestions:

        SuggestionEngine.build(
          analysis,
        ),

      possibleEvents:

  EventSuggestionEngine.build(
    analysis,
  ),

      aliveCharacters:

        CharacterStatusEngine.alive(
          analysis,
        ),

      deadCharacters:

        CharacterStatusEngine.dead(
          analysis,
        ),

      activeConflicts:

        analysis.activeConflicts,

      unresolvedThreads:

        analysis.unresolvedThreads,

      currentSituation:

        analysis.currentSituation,

      sceneMood:

        analysis.sceneMood,

    }

  }

}