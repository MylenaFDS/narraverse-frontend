import type { Character } from "../../../types/character"
import type { RPGTurn } from "../../../types/turn"

import type { CampaignState } from "../state/CampaignState"

import type { StoryContext } from "../../writer/story/types/StoryContext"

export class StoryContextBuilder {

  static build(

    campaign: CampaignState,

    turns: RPGTurn[],

    characters: Character[],

  ): StoryContext {

    const recentTurns =
      turns.slice(-5)

    const recentTexts =
      recentTurns.map(
        turn => turn.content,
      )

    const recentHistory =
      campaign.history.slice(-10)

    const lastDialogues =
      recentTurns

        .filter(
          turn =>

            turn.content.includes("—") ||

            turn.content.includes("\""),
        )

        .map(
          turn => turn.content,
        )

    const lastActions =
      recentHistory

        .filter(
          event =>
            event.type !== "dialogue",
        )

        .map(
          event => event.description,
        )

    const recentFacts =
      recentHistory.map(
        event =>
          event.description,
      )

    // ======================================
    // Narrativa
    // ======================================

    const unresolvedThreads =
      this.extractUnresolvedThreads(
        campaign,
      )

    const unansweredQuestions =
      this.extractQuestions(
        recentTexts,
      )

    const topics =
      this.extractTopics(
        recentTexts,
      )

        return {

      // ======================================
      // Histórico
      // ======================================

      recentTurns:
        recentTexts,

      recentFacts,

      lastActions,

      lastDialogues,


      // ======================================
      // Continuidade narrativa
      // ======================================

      previousSummary:
        undefined,

      previousScene:
        undefined,

      previousLocation:
        undefined,

      previousMood:
        undefined,


      // ======================================
      // Situação atual
      // ======================================

      currentSituation:

        this.buildSituation(
          campaign,
        ),


      currentLocation:

        campaign.discoveredLocations.at(-1),


      sceneMood:

        this.detectMood(
          campaign,
        ),


      activeEvents: [

        ...campaign.activeEvents,

        ...campaign.history.map(
          event =>
            event.description,
        ),

      ],



      // ======================================
      // Estrutura narrativa
      // ======================================

      storyArc:
        undefined,

      chapter:
        undefined,

      sceneNumber:
        undefined,

      storyPhase:
        "development",

      storyTempo:
        "normal",



      // ======================================
      // Dramaturgia
      // ======================================

      narrativeTension:

        this.calculateNarrativeTension(
          campaign,
        ),


      dominantEmotion:

        this.detectMood(
          campaign,
        ),


      dramaticQuestion:

        unansweredQuestions.at(0),


      expectedClimax:
        undefined,


      lastMajorEvent:

        campaign.history
          .at(-1)
          ?.description,


      lastTurningPoint:

        campaign.history
          .at(-1)
          ?.description,


      currentConflict:

        campaign.activeEvents
          .at(0),


      currentGoal:

        campaign.activeQuests
          .at(0),


      currentMystery:

        unansweredQuestions
          .at(0),


      recentConsequences:

        campaign.history
          .slice(-5)
          .map(
            event =>
              event.description,
          ),



      // ======================================
      // Continuidade
      // ======================================

      unresolvedThreads,

      unansweredQuestions,

      topics,



      // ======================================
      // Personagens
      // ======================================

      mentionedCharacters:

        characters.map(
          character =>
            character.name,
        ),


      focusedCharacter:

        this.detectFocusedCharacter(
          characters,
          recentTexts,
        ),


      lastDialogue:

        lastDialogues.at(-1),



      // ======================================
      // Mundo
      // ======================================

      discoveredLocations:

        [
          ...campaign.discoveredLocations,
        ],


      discoveredFactions:

        [],


      discoveredItems:

        [],



      // ======================================
      // Objetivos
      // ======================================

      activeObjectives:

        [
          ...campaign.activeQuests,
        ],


      activeQuests:

        [
          ...campaign.activeQuests,
        ],


      completedObjectives:

        [],


      completedQuests:

        [],



      // ======================================
      // Resumo dinâmico
      // ======================================

      keywords:

        this.extractKeywords(
          recentTexts,
        ),


      themes:

        topics,


      narrativeHooks:

        unresolvedThreads,


    }

  }

  private static buildSituation(
    campaign: CampaignState,
  ): string {

    if (
      campaign.activeEvents.length === 0
    ) {

      return "Nenhum evento importante."

    }

    return campaign.activeEvents.join(
      ", ",
    )

  }

  private static detectMood(
    campaign: CampaignState,
  ): string {

    if (
      campaign.deadCharacters.length > 0
    ) {

      return "tragic"

    }

    if (
      campaign.activeEvents.length >= 3
    ) {

      return "tense"

    }

    return "neutral"

  }

  private static detectFocusedCharacter(
    characters: Character[],
    turns: string[],
  ): string | undefined {

    for (
      const character of characters
    ) {

      if (

        turns.some(
          text =>
            text.includes(
              character.name,
            ),
        )

      ) {

        return character.name

      }

    }

    return characters.at(0)?.name

  }

  private static extractQuestions(
    turns: string[],
  ): string[] {

    return turns.filter(
      turn =>
        turn.includes("?"),
    )

  }

  private static extractTopics(
    turns: string[],
  ): string[] {

    const topics = new Set<string>()

    for (
      const turn of turns
    ) {

      const text =
        turn.toLowerCase()

      if (
        text.includes("guerra")
      ) {

        topics.add("guerra")

      }

      if (
        text.includes("castelo")
      ) {

        topics.add("castelo")

      }

      if (
        text.includes("profecia")
      ) {

        topics.add("profecia")

      }

      if (
        text.includes("casamento")
      ) {

        topics.add("casamento")

      }

      if (
        text.includes("ritual")
      ) {

        topics.add("ritual")

      }

    }

    return [...topics]

  }

  private static extractUnresolvedThreads(
    campaign: CampaignState,
  ): string[] {

    return campaign.activeEvents.filter(
      event =>

        !event
          .toLowerCase()
          .includes("encerrado"),
    )

  }

    private static calculateNarrativeTension(
    campaign: CampaignState,
  ): number {


    let tension = 0



    tension +=
      campaign.activeEvents.length * 10



    tension +=
      campaign.deadCharacters.length * 15



    if(
      campaign.activeQuests.length > 0
    ){

      tension += 10

    }



    return Math.min(
      tension,
      100,
    )

  }





  private static extractKeywords(
    turns:string[],
  ):string[] {


    const keywords =
      new Set<string>()



    for(
      const turn of turns
    ){

      const words =
        turn
          .toLowerCase()
          .split(/\s+/)



      for(
        const word of words
      ){

        if(
          word.length > 5
        ){

          keywords.add(
            word.replace(
              /[.,!?]/g,
              "",
            ),
          )

        }

      }

    }


    return [
      ...keywords,
    ].slice(
      0,
      20,
    )


  }

}