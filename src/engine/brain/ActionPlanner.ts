import type { Decision } from "./DecisionTypes"

import type { ActionPlan } from "./ActionPlan"

export class ActionPlanner {

  static create(
    decision: Decision,
  ): ActionPlan {

    switch (decision.action) {

      case "attack":

        return {

          title: "Ataque",

          actions: [

            {
              type: "move",
              description: "Aproximar do alvo",
              priority: 100,
            },

            {
              type: "draw",
              description: "Preparar arma",
              priority: 95,
            },

            {
              type: "observe",
              description: "Encontrar abertura",
              priority: 90,
            },

            {
              type: "attack",
              description: "Executar ataque",
              priority: 80,
            },

            {
              type: "retreat",
              description: "Reposicionar",
              priority: 60,
            },

          ],

        }

      case "talk":

        return {

          title: "Conversa",

          actions: [

            {
              type: "approach",
              description: "Aproximar",

              priority: 100,
            },

            {
              type: "observe",
              description: "Observar reação",

              priority: 90,
            },

            {
              type: "speak",
              description: "Iniciar diálogo",

              priority: 80,
            },

            {
              type: "listen",
              description: "Ouvir resposta",

              priority: 70,
            },

          ],

        }

      case "explore":

        return {

          title: "Exploração",

          actions: [

            {

              type: "observe",

              description: "Examinar arredores",

              priority: 100,

            },

            {

              type: "move",

              description: "Avançar",

              priority: 90,

            },

            {

              type: "inspect",

              description: "Investigar detalhes",

              priority: 80,

            },

          ],

        }

      default:

        return {

          title: "Livre",

          actions: [

            {

              type: "think",

              description: decision.reason,

              priority: 100,

            },

          ],

        }

    }

  }

}