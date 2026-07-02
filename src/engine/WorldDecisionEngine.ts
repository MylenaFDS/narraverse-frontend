import type { WorldContext } from "./ContextEngine"

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

    // -----------------------------
    // Mundo vazio
    // -----------------------------

    if (context.world.length === 0) {

      decisions.push({
        action: "generate_world",
        priority: 100,
        reason: "O RPG ainda não possui regiões.",
      })

      return decisions
    }

    // -----------------------------
    // Sem personagens
    // -----------------------------

    if (context.characters.length === 0) {

      decisions.push({
        action: "suggest_character",
        priority: 90,
        reason: "Não existem personagens ativos.",
      })
    }

    // -----------------------------
    // Sem NPCs
    // -----------------------------

    if (context.npcs.length === 0) {

      decisions.push({
        action: "generate_npc",
        priority: 80,
        reason: "A cena não possui NPCs.",
      })
    }

    // -----------------------------
    // Sem facções
    // -----------------------------

    if (context.factions.length === 0) {

      decisions.push({
        action: "suggest_faction",
        priority: 70,
        reason: "Ainda não existem facções.",
      })
    }

    // -----------------------------
    // Sem eventos
    // -----------------------------

    if (context.timeline.length === 0) {

      decisions.push({
        action: "generate_event",
        priority: 60,
        reason: "Nenhum evento histórico registrado.",
      })
    }

    return decisions.sort(
      (
        a,
        b,
      ) => b.priority - a.priority
    )
  }
}