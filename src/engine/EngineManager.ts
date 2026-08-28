import type { WorldContext } from "./context/ContextEngine"

import {
  RuleEngine,
} from "./RuleEngine"

import {
  MemoryEngine,
} from "./MemoryEngine"

import {
  DecisionEngine,
} from "./WorldDecisionEngine"

import {
  ActionEngine,
  type ActionType,
} from "./ActionEngine"

import {
  WorldStateEngine,
} from "./assistant/state/world/WorldStateEngine"

import {
  EventEngine,
} from "./EventEngine"

import {
  NarrativeEngine,
} from "./NarrativeEngine"


// ============================================================
// RESULTADO DA ENGINE
// ============================================================

export interface EngineResult {

  allowed: boolean

  score: number

  warnings: string[]

  decisions: string[]

  actions: string[]

  events: string[]

  narrative: string[]

}


// ============================================================
// ENGINE MANAGER
// ============================================================

export class EngineManager {


  static run(
    context: WorldContext,
  ): EngineResult {


    // ========================================================
    // 1. VALIDAÇÃO DAS REGRAS
    // ========================================================

    const validation =
      RuleEngine.evaluate(
        context,
      )


    // ========================================================
    // 2. ATUALIZA MEMÓRIA
    // ========================================================

    MemoryEngine.add({

      id:
        Date.now().toString(),

      type:
        "engine",

      title:
        "Execução da Engine",

      description:
        "Contexto processado pelo EngineManager.",

      timestamp:
        Date.now(),

      importance:
        1,

      people:
        [],

      places:
        [],

      tags: [
        "engine",
        "world-processing",
      ],

      confidence:
        1,

      recalled:
        0,

    })


    // ========================================================
    // 3. SUGERE DECISÕES
    // ========================================================

    const decisions =
      DecisionEngine.decide(
        context,
      )


    // ========================================================
    // 4. CONVERTE APENAS AÇÕES COMPATÍVEIS
    // ========================================================

    const validActionTypes:
      ActionType[] = [

        "move",

        "attack",

        "spell",

        "skill",

        "talk",

        "investigate",

        "rest",

      ]


    const actionResults =
      decisions
        .filter(
          decision =>
            validActionTypes.includes(
              decision.action as ActionType,
            ),
        )
        .map(
          decision => {

            const targetId =
              typeof decision.target === "number"
                ? decision.target
                : undefined


            const target =
              targetId !== undefined
                ? context.characters.find(
                    character =>
                      character.id === targetId,
                  )
                : undefined


            return ActionEngine.execute(

              context,

              {

                type:
                  decision.action as ActionType,

                actor:
                  context.profile.character,

                target,

              },

            )

          },
        )


    // ========================================================
    // 5. ATUALIZA ESTADO DO MUNDO
    // ========================================================

    WorldStateEngine.all()


    // ========================================================
    // 6. CRIA EVENTOS
    // ========================================================

    const events =
      actionResults.map(
        action =>
          EventEngine.register({

            type:
              "world",

            title:
              action.description,

            description:
              action.description,

            importance:
              10,

          }),
      )


    // ========================================================
    // 7. GERA NARRATIVA
    // ========================================================

    const narrative =
      actionResults.map(
        action =>
          NarrativeEngine.describe({

            action:
              action.description,

            result:
              action.description,

          }),
      )


    // ========================================================
    // 8. RESULTADO
    // ========================================================

    return {

      allowed:
        validation.allowed,

      score:
        validation.score,

      warnings:
        validation.reasons,

      decisions:
        decisions.map(
          decision =>
            decision.action,
        ),

      actions:
        actionResults.map(
          action =>
            action.description,
        ),

      events:
        events.map(
          event =>
            event.title,
        ),

      narrative,

    }

  }

}