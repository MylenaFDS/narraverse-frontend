import type { WorldContext } from "./context/ContextEngine"

import { RuleEngine } from "./RuleEngine"
import { MemoryEngine } from "./MemoryEngine"
import { DecisionEngine } from "./WorldDecisionEngine"
import { ActionEngine } from "./ActionEngine"
import { WorldStateEngine } from "./WorldStateEngine"
import { EventEngine } from "./EventEngine"
import { NarrativeEngine } from "./NarrativeEngine"

export interface EngineResult {
  allowed: boolean

  score: number

  warnings: string[]

  decisions: string[]

  actions: string[]

  events: string[]

  narrative: string[]
}

export class EngineManager {
  static run(
    context: WorldContext,
  ): EngineResult {

    // 1. Validação das regras
    const validation =
      RuleEngine.evaluate(context)

    // 2. Atualiza memória
    MemoryEngine.add({
  id: Date.now().toString(),

  type: "engine",

  title: "Execução da Engine",

  description: "Contexto processado pelo EngineManager.",

  timestamp: Date.now(),

  importance: 1,
})

    // 3. Sugere decisões
    const decisions =
      DecisionEngine.decide(context)

    // 4. Executa ações
    const actionResults =
      decisions.map((decision) =>
        ActionEngine.execute(
          context,
          decision.action,
        )
      )

    // 5. Atualiza estado do mundo
    // (por enquanto apenas mantém sincronizado)
    WorldStateEngine.all()

    // 6. Cria eventos
    const events =
  actionResults.map((action) =>
    EventEngine.register({
      type: "world",

      title: action.description,

      description: action.description,

      importance: 10,
    })
  )

    // 7. Gera narrativa
    const narrative =
      actionResults.map((action) =>
        NarrativeEngine.describe({
          action: action.description,
          result: action.description,
        })
      )

    return {
      allowed: validation.allowed,

      score: validation.score,

      warnings: validation.reasons,

      decisions:
        decisions.map(
          (d) => d.action,
        ),

      actions:
        actionResults.map(
          (a) => a.description,
        ),

      events:
        events.map(
          (e) => e.title,
        ),

      narrative,
    }
  }
}