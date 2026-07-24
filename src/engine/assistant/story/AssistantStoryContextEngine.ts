import type {
  Character,
} from "../../../types/character"

import type {
  RPGTurn,
} from "../../../types/turn"

import type {
  CampaignState,
} from "../state/CampaignState"

import type {
  StoryContext,
} from "../../writer/story/types/StoryContext"

import {
  StoryContextBuilder,
} from "./StoryContextBuilder"

export class AssistantStoryContextEngine {

  static create(

    campaign: CampaignState,

    turns: RPGTurn[],

    characters: Character[],

  ): StoryContext {

    const context =
      StoryContextBuilder.build(
        campaign,
        turns,
        characters,
      )

    return {

      ...context,

      // ======================================
      // Personagem principal da cena
      // ======================================

      focusedCharacter:

        this.detectFocusedCharacter(
          context,
        ),

      // ======================================
      // Situação resumida
      // ======================================

      currentSituation:

        this.buildSituation(
          context,
        ),

      // ======================================
      // Clima da cena
      // ======================================

      sceneMood:

        this.detectMood(
          context,
        ),

      // ======================================
      // Assuntos principais
      // ======================================

      topics:

        this.buildTopics(
          context,
        ),

      // ======================================
      // Pendências narrativas
      // ======================================

      unresolvedThreads:

        this.buildThreads(
          context,
        ),

    }

  }

  // ======================================
  // Personagem em destaque
  // ======================================

  private static detectFocusedCharacter(
    context: StoryContext,
  ): string | undefined {

    return context.mentionedCharacters.at(-1)

  }

  // ======================================
  // Situação resumida
  // ======================================

  private static buildSituation(
    context: StoryContext,
  ): string {

    if (
      context.activeEvents.length > 0
    ) {

      return context.activeEvents.join(
        ", ",
      )

    }

    return context.currentSituation

  }

  // ======================================
  // Clima da cena
  // ======================================

  private static detectMood(
    context: StoryContext,
  ): string {

    const text = [

      ...context.activeEvents,

      ...context.recentFacts,

      ...context.recentTurns,

    ]
      .join(" ")
      .toLowerCase()

    if (

      text.includes("batalha") ||

      text.includes("combate") ||

      text.includes("ataque")

    ) {

      return "tenso"

    }

    if (

      text.includes("morte") ||

      text.includes("morreu")

    ) {

      return "dramático"

    }

    if (

      text.includes("esperança") ||

      text.includes("aliança")

    ) {

      return "esperançoso"

    }

    if (

      text.includes("profecia") ||

      text.includes("mistério")

    ) {

      return "misterioso"

    }

    return context.sceneMood

  }

  // ======================================
  // Assuntos principais
  // ======================================

  private static buildTopics(
    context: StoryContext,
  ): string[] {

    return [

      ...new Set([

        ...context.topics,

        ...context.activeEvents,

      ]),

    ]

  }

  // ======================================
  // Pendências narrativas
  // ======================================

  private static buildThreads(
    context: StoryContext,
  ): string[] {

    return [

      ...new Set([

        ...context.unresolvedThreads,

        ...context.unansweredQuestions,

      ]),

    ]

  }

}