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

    let campaign =
      CampaignStateFactory.create()

    for (
      const turn of turns
    ) {

      const events =
        EventInterpreterEngine.interpret(
          turn,
        )

      campaign =
        CampaignStateEngine.update(
          campaign,
          events,
        )

    }

    return AssistantService.generate({

      campaignState:
        campaign,

      story:
        AssistantStoryContextEngine.create(

          campaign,

          turns,

          characters,

        ),

      characters,

    })

  }

}