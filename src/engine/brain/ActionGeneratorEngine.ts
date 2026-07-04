import type { Decision } from "./DecisionTypes"

import type { ActionSequence } from "./ActionSequence"

export class ActionGeneratorEngine {

  static generate(

    decision: Decision,

  ): ActionSequence {

    switch (decision.action) {

      case "attack":

        return {

          title: "Ataque",

          actions: [

            {

              id: "draw",

              type: "weapon",

              description: "Empunhar arma",

              duration: 1,

            },

            {

              id: "approach",

              type: "move",

              description: "Avançar",

              duration: 2,

            },

            {

              id: "strike",

              type: "combat",

              description: "Golpear",

              duration: 1,

            },

            {

              id: "observe",

              type: "perception",

              description: "Observar reação",

              duration: 1,

            },

          ],

        }

      case "talk":

        return {

          title: "Diálogo",

          actions: [

            {

              id: "approach",

              type: "move",

              description: "Aproximar",

              duration: 1,

            },

            {

              id: "look",

              type: "perception",

              description: "Observar expressão",

              duration: 1,

            },

            {

              id: "speak",

              type: "dialogue",

              description: "Falar",

              duration: 2,

            },

            {

              id: "listen",

              type: "dialogue",

              description: "Ouvir",

              duration: 2,

            },

          ],

        }

      case "explore":

        return {

          title: "Exploração",

          actions: [

            {

              id: "look",

              type: "perception",

              description: "Examinar arredores",

              duration: 2,

            },

            {

              id: "walk",

              type: "move",

              description: "Avançar",

              duration: 3,

            },

            {

              id: "inspect",

              type: "interaction",

              description: "Investigar objeto",

              duration: 2,

            },

          ],

        }

      default:

        return {

          title: "Livre",

          actions: [

            {

              id: "think",

              type: "brain",

              description: decision.reason,

              duration: 1,

            },

          ],

        }

    }

  }

}