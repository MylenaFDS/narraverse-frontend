import type {
  RPGTurn,
} from "../../../types/turn"


import type {
  CampaignState,
} from "./CampaignState"


import {
  EventInterpreterEngine,
} from "../../brain/interpreter/EventInterpreterEngine"


import {
  CampaignStateEngine,
} from "./CampaignStateEngine"



export class CampaignMemoryEngine {


  static processTurn(

    state: CampaignState,

    turn: RPGTurn,

  ): CampaignState {


    const events =
      EventInterpreterEngine.interpret(
        turn,
      )


    const nextState =
      CampaignStateEngine.update(
        state,
        events,
      )


    return nextState

  }


}