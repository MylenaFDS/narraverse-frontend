import type {
  CampaignState,
} from "./CampaignState"

export class CampaignStateFactory {

  static create(): CampaignState {

    return {

      // ======================================
      // Controle
      // ======================================

      turn: 0,

      // ======================================
      // Histórico
      // ======================================

      history: [],

      // ======================================
      // Eventos
      // ======================================

      activeEvents: [],

      // ======================================
      // Personagens
      // ======================================

      aliveCharacters: [],

      deadCharacters: [],

      knownCharacters: [],

      // ======================================
      // Relacionamentos
      // ======================================

      relationships: [],

      // ======================================
      // Reputação
      // ======================================

      reputation: {},

      // ======================================
      // Mundo
      // ======================================

      discoveredLocations: [],

      knownLocations: [],

      discoveredItems: [],

      discoveredFactions: [],

      // ======================================
      // Missões
      // ======================================

      activeQuests: [],

      completedQuests: [],

      failedQuests: [],

      activeObjectives: [],

      completedObjectives: [],

      // ======================================
      // Memória narrativa
      // ======================================

      recentDialogues: [],

      recentActions: [],

      recentFacts: [],

      unresolvedThreads: [],

      unansweredQuestions: [],

      importantMoments: [],

      // ======================================
      // Estado do mundo
      // ======================================

      worldFlags: {},

      variables: {},

    }

  }

}