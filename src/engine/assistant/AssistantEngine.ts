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

import {
  NarrativeStateEngine,
} from "./state/NarrativeStateEngine"



export class AssistantEngine {


  static assist(

    context: AssistantContext,

  ): AssistantResult {



    // ======================================
    // Interpretar último turno
    // ======================================

    const events =

      context.turn

        ? EventInterpreterEngine.interpret(
            context.turn,
          )

        : []





    // ======================================
    // Atualizar estado da campanha
    // ======================================

    const campaignState =

      CampaignStateEngine.update(

        context.campaignState,

        events,

      )





    // ======================================
    // Analisar narrativa
    // ======================================

    const analysis =

      StoryAnalysisEngine.analyze({

        ...context,

        campaignState,

      })





    // ======================================
    // Estado narrativo atual
    // ======================================

    const narrativeState =

      NarrativeStateEngine.analyze(
        analysis,
      )





    // ======================================
    // Resultado do assistente
    // ======================================

    return {


      summary:

        SummaryEngine.build(
          analysis,
        ),





      suggestions:

        SuggestionEngine.build(

          analysis,

          narrativeState,

        ),





      possibleEvents:

        EventSuggestionEngine.build(

          analysis,

          narrativeState,

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