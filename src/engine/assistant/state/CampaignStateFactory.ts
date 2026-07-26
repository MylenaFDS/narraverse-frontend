import type {
  CampaignState,
} from "./CampaignState"



export class CampaignStateFactory {


  static create(): CampaignState {


    return {


      // ======================================
      // Controle da campanha
      // ======================================

      turn: 0,



      // ======================================
      // Histórico
      // ======================================

      history: [],



      // ======================================
      // Eventos ativos
      // ======================================

      activeEvents: [],



      // ======================================
      // Personagens
      // ======================================

      aliveCharacters: [],

      deadCharacters: [],

      knownCharacters: [],



      // ======================================
      // Mundo
      // ======================================

      discoveredLocations: [],

      knownLocations: [],



      // ======================================
      // Missões
      // ======================================

      activeQuests: [],

      completedQuests: [],

      activeObjectives: [],



      // ======================================
      // Contexto narrativo
      // ======================================

      recentDialogues: [],

      recentActions: [],

      recentFacts: [],

      unresolvedThreads: [],


    }


  }


}