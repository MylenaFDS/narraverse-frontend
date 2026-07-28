import type { Character } from "../../types/character"
import type { RPGTurn } from "../../types/turn"

import { CampaignStateFactory } from "./state/CampaignStateFactory"
import { CampaignStateEngine } from "./state/CampaignStateEngine"
import { EventInterpreterEngine } from "./state/events/EventInterpreterEngine"

import { AssistantStoryContextEngine } from "./story/AssistantStoryContextEngine"

import { AssistantService } from "./AssistantService"


export class GenerateAssistantService {


  static generate(

    turns: RPGTurn[],

    characters: Character[],

  ) {


    // ======================================
    // Estado inicial da campanha
    // ======================================

    let campaign =

      CampaignStateFactory.create()



    console.log(
      "INITIAL CAMPAIGN",
      campaign,
    )



    // ======================================
    // Reconstrói toda a campanha
    // ======================================

    for (
      const turn of turns
    ) {


      console.log(
        "INTERPRETING TURN",
        turn,
      )



      const events =

        EventInterpreterEngine.interpret(
          turn,
        )



      console.log(
        "EVENTS GENERATED",
        events,
      )



      campaign =

        CampaignStateEngine.update(
          campaign,
          events,
        )



      console.log(
        "UPDATED CAMPAIGN",
        campaign,
      )


    }



    // ======================================
    // Contexto narrativo
    // ======================================

    const story =

      AssistantStoryContextEngine.create(
        campaign,
        turns,
        characters,
      )



    console.log(
      "ASSISTANT STORY CONTEXT",
      story,
    )



    // ======================================
    // Último turno
    // ======================================

    const currentTurn =

      turns.at(-1)



    console.log(
      "CURRENT TURN",
      currentTurn,
    )



    // ======================================
    // Contexto completo
    // ======================================

    const context = {


      turn:

        currentTurn,


      campaignState:

        campaign,


      story,


      characters,


    }



    console.log(
      "ASSISTANT CONTEXT",
      context,
    )



    // ======================================
    // Gerar Assistente
    // ======================================

    const result =

      AssistantService.generate(
        context,
      )



    console.log(
      "ASSISTANT RESULT",
      result,
    )



    return result


  }


}