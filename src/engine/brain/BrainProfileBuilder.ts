import type { Character } from "../../types/character"
import type { BrainProfile } from "./BrainProfile"

import { EmotionEngine } from "./EmotionEngine"

export class BrainProfileBuilder {

  static fromCharacter(
    character: Character,
  ): BrainProfile {

    const emotions = EmotionEngine.create()

    const initialGoal = {

      id: crypto.randomUUID(),

      title: "Continuar interpretando o personagem",

      priority: 100,

      completed: false,

    }

    return {

      // ======================================
      // Personagem
      // ======================================

      character,

      // ======================================
      // Progressão
      // ======================================

      level: 1,

      experience: 0,

      skillPoints: 0,

      evolutionStage: 0,

      // ======================================
      // Personalidade
      // ======================================

      personality: {

        courage: 50,
        honor: 50,
        empathy: 50,
        greed: 0,
        curiosity: 50,
        patience: 50,
        cruelty: 0,
        ambition: 50,
        loyalty: 50,
        intelligence: 50,

      },

      // ======================================
      // Emoções
      // ======================================

      emotions,

      currentEmotion: emotions,

      // ======================================
      // Reputação
      // ======================================

      reputation: {

        honor: 0,
        fear: 0,
        kindness: 0,
        cruelty: 0,
        wisdom: 0,
        leadership: 0,

      },

      // ======================================
      // Objetivos
      // ======================================

      goals: [
        initialGoal,
      ],

      desires: [],

      fears: [],

      beliefs: [],

      currentGoal: initialGoal,

      // ======================================
      // Relações
      // ======================================

      relationships: [],

      trust: [],

      // ======================================
      // Conhecimento
      // ======================================

      knowledge: [],

      memories: [],

      inventory: [],

      habits: [],

    }

  }

}