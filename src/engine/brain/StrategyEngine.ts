import type { Goal } from "./GoalTypes"
import type { Personality } from "./PersonalityTypes"
import type { WorldKnowledge } from "./WorldKnowledge"
import type { InventoryKnowledge } from "./InventoryKnowledge"
import type { Strategy } from "./StrategyTypes"

export class StrategyEngine {

  static create(

    personality: Personality,

    goal: Goal | null,

    world: WorldKnowledge,

    inventory: InventoryKnowledge,

  ): Strategy | null {

    if (!goal) {

      return null

    }

    const title =
      goal.title.toLowerCase()

    // ==========================
    // Sobrevivência
    // ==========================

    if (

      world.hasDanger &&

      !inventory.hasWeapon

    ) {

      return {

        id: "survive",

        title: "Sobrevivência",

        description:

          "Evitar combate e procurar segurança.",

        priority: 100,

        estimatedTurns: 2,

      }

    }

    // ==========================
    // Combate
    // ==========================

    if (

      title.includes("matar") ||

      title.includes("derrotar")

    ) {

      return {

        id: "combat",

        title: "Eliminar alvo",

        description:

          inventory.hasWeapon

            ? "Atacar diretamente o alvo."

            : "Buscar recursos antes do confronto.",

        priority: goal.priority,

        estimatedTurns: 6,

      }

    }

    // ==========================
    // Proteção
    // ==========================

    if (

      title.includes("proteger")

    ) {

      return {

        id: "protect",

        title: "Proteção",

        description:

          "Permanecer próximo ao alvo e impedir ameaças.",

        priority: goal.priority,

        estimatedTurns: 999,

      }

    }

    // ==========================
    // Exploração
    // ==========================

    if (

      title.includes("explorar")

    ) {

      return {

        id: "exploration",

        title: "Exploração",

        description:

          world.isIndoor

            ? "Explorar cuidadosamente o interior."

            : "Explorar a região ao redor.",

        priority: goal.priority,

        estimatedTurns: 8,

      }

    }

    // Diplomacia
if (

  title.includes("convencer") ||

  title.includes("negociar") ||

  title.includes("persuadir")

) {

  const diplomatic =

    personality.empathy > 60 &&

    personality.intelligence > 60

  const manipulative =

    personality.cruelty > 70 &&

    personality.intelligence > 60

  return {

    id: "diplomacy",

    title: "Diplomacia",

    description:

      diplomatic

        ? "Negociar utilizando empatia e argumentos."

        : manipulative

        ? "Manipular a conversa em benefício próprio."

        : "Buscar argumentos sólidos antes de agir.",

    priority: goal.priority,

    estimatedTurns: 5,

  }

}

    // ==========================
    // Genérico
    // ==========================

    return {

      id: "generic",

      title: goal.title,

      description: goal.title,

      priority: goal.priority,

      estimatedTurns: 4,

    }

  }

}