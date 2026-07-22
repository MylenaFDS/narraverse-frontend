import type {
  CampaignState,
} from "./CampaignState"



export class CampaignStateFactory {


  static create(): CampaignState {


    return {


      turn:0,


      activeEvents:[],


      history:[],


      aliveCharacters:[],


      deadCharacters:[],


      activeQuests:[],


      discoveredLocations:[],


    }


  }


}