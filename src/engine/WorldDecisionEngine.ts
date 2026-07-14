import type { WorldContext } from "./context/ContextEngine"

export interface Decision {

  action: string

  target?: number | string

  priority: number

  reason: string

}

export class DecisionEngine {

  static decide(
    context: WorldContext,
  ): Decision[] {

    const decisions: Decision[] = []

    // =============================
    // Mundo vazio
    // =============================

    if (context.lore.length === 0) {

      decisions.push({

        action: "generate_world",

        priority: 100,

        reason: "O RPG ainda não possui nenhuma lore.",

      })

      return decisions

    }

    // =============================
    // Personagens
    // =============================

    if (context.characters.length === 0) {

      decisions.push({

        action: "suggest_character",

        priority: 90,

        reason: "Não existem personagens ativos.",

      })

    }

    // =============================
    // NPCs
    // =============================

    if (context.npcs.length === 0) {

      decisions.push({

        action: "generate_npc",

        priority: 80,

        reason: "A cena não possui NPCs.",

      })

    }

    // =============================
    // Facções
    // =============================

    if (context.factions.length === 0) {

      decisions.push({

        action: "suggest_faction",

        priority: 70,

        reason: "Ainda não existem facções.",

      })

    }

    // =============================
    // Timeline
    // =============================

    if (context.timeline.length === 0) {

      decisions.push({

        action: "generate_event",

        priority: 60,

        reason: "Nenhum evento histórico registrado.",

      })

    }

    return decisions.sort(
      (a, b) => b.priority - a.priority,
    )

  }

}