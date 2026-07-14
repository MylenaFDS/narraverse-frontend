import type { Decision } from "../types"


export interface DecisionProfile {

  behavior:
    | "offensive"
    | "defensive"
    | "social"
    | "exploratory"
    | "passive"


  urgency:
    | "low"
    | "medium"
    | "high"


  tone:
    string


  narrativeIntent:
    string

}



export class DecisionInterpreterEngine {


  static analyze(
    decision: Decision,
  ): DecisionProfile {


    switch (
      decision.action
    ) {


      case "attack":

        return {

          behavior:
            "offensive",

          urgency:
            "high",

          tone:
            "aggressive",

          narrativeIntent:
            "agir rapidamente para eliminar a ameaça",

        }



      case "defend":

        return {

          behavior:
            "defensive",

          urgency:
            "medium",

          tone:
            "determined",

          narrativeIntent:
            "proteger sua posição e resistir ao perigo",

        }



      case "talk":

        return {

          behavior:
            "social",

          urgency:
            "low",

          tone:
            "calm",

          narrativeIntent:
            "buscar uma solução através da comunicação",

        }



      case "explore":

        return {

          behavior:
            "exploratory",

          urgency:
            "low",

          tone:
            "curious",

          narrativeIntent:
            "descobrir informações e compreender o ambiente",

        }



      case "retreat":

        return {

          behavior:
            "defensive",

          urgency:
            "high",

          tone:
            "cautious",

          narrativeIntent:
            "preservar a própria sobrevivência",

        }



      default:

        return {

          behavior:
            "passive",

          urgency:
            "low",

          tone:
            "neutral",

          narrativeIntent:
            "aguardar uma oportunidade",

        }

    }

  }

}