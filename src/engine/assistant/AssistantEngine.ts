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

import {
  SuggestionContextEngine,
} from "./suggestions/SuggestionContextEngine"

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

      NarrativeStateEngine.build(
        analysis,
      )


    const suggestionContext =
  SuggestionContextEngine.build(
    analysis,
    narrativeState,
  )


    // ======================================
    // Resultado do assistente
    // ======================================

    return {

  // ======================================
  // Resumo
  // ======================================

  summary:

    SummaryEngine.build(
      analysis,
    ),


  // ======================================
  // Situação atual
  // ======================================

  currentSituation:

    analysis.currentSituation,


  sceneMood:

    analysis.sceneMood,


  currentLocation:

    analysis.currentLocation,



  // ======================================
  // Sugestões
  // ======================================

  suggestions:

    SuggestionEngine.build(
      suggestionContext,
    ),


  possibleEvents:

    EventSuggestionEngine.build(
      suggestionContext,
    ),



  // ======================================
  // Personagens
  // ======================================

  aliveCharacters:

    CharacterStatusEngine.alive(
      analysis,
    ),


  deadCharacters:

    CharacterStatusEngine.dead(
      analysis,
    ),


  focusedCharacter:

    analysis.focusedCharacter,



  // ======================================
  // Conflitos
  // ======================================

  activeConflicts:

    analysis.activeConflicts,



  // ======================================
  // Objetivos
  // ======================================

  activeObjectives:

    analysis.activeObjectives ?? [],


  activeQuests:

    analysis.activeQuests ?? [],



  // ======================================
  // Continuidade narrativa
  // ======================================

  unresolvedThreads:

    analysis.unresolvedThreads,


  unansweredQuestions:

    analysis.unansweredQuestions ?? [],



  // ======================================
  // Cenário
  // ======================================

  discoveredLocations:

    analysis.discoveredLocations ?? [],


  topics:

    analysis.topics ?? [],



  // ======================================
  // Histórico recente
  // ======================================

  recentEvents:

    analysis.recentEvents ?? [],


  recentDialogue:

    analysis.recentDialogue ?? [],


  recentFacts:

    analysis.recentFacts ?? [],

}


  }


}