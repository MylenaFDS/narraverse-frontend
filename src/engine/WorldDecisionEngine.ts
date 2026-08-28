import type { WorldContext } from "./context/ContextEngine"


// ============================================================
// TIPOS
// ============================================================

export type WorldDecisionAction =
  | "generate_world"
  | "suggest_character"
  | "generate_npc"
  | "suggest_faction"
  | "generate_event"


export interface Decision {

  action: WorldDecisionAction

  target?: number | string

  priority: number

  reason: string

}


// ============================================================
// ENGINE DE DECISÃO DO MUNDO
// ============================================================

export class DecisionEngine {


  static decide(
    context: WorldContext,
  ): Decision[] {

    const decisions: Decision[] = []


    // ========================================================
    // MUNDO VAZIO
    // ========================================================

    if (
      context.lore.length === 0
    ) {

      decisions.push({

        action:
          "generate_world",

        priority:
          100,

        reason:
          "O RPG ainda não possui nenhuma lore.",

      })

      return decisions

    }


    // ========================================================
    // PERSONAGENS
    // ========================================================

    if (
      context.characters.length === 0
    ) {

      decisions.push({

        action:
          "suggest_character",

        priority:
          90,

        reason:
          "Não existem personagens ativos.",

      })

    }


    // ========================================================
    // NPCs
    // ========================================================

    if (
      context.npcs.length === 0
    ) {

      decisions.push({

        action:
          "generate_npc",

        priority:
          80,

        reason:
          "A cena não possui NPCs.",

      })

    }


    // ========================================================
    // FACÇÕES
    // ========================================================

    if (
      context.factions.length === 0
    ) {

      decisions.push({

        action:
          "suggest_faction",

        priority:
          70,

        reason:
          "Ainda não existem facções.",

      })

    }


    // ========================================================
    // TIMELINE
    // ========================================================

    if (
      context.timeline.length === 0
    ) {

      decisions.push({

        action:
          "generate_event",

        priority:
          60,

        reason:
          "Nenhum evento histórico registrado.",

      })

    }


    // ========================================================
    // ORDENAR POR PRIORIDADE
    // ========================================================

    return decisions.sort(
      (a, b) =>
        b.priority - a.priority,
    )

  }

}