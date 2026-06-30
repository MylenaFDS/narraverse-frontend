// src/engine/RuleEngine.ts

import { ContextEngine, type WorldContext } from "./ContextEngine"

export interface RuleResult {
  allowed: boolean
  score: number
  reasons: string[]
}

export class RuleEngine {
  static evaluate(context: WorldContext): RuleResult {
    const data = ContextEngine.build(context)

    const reasons: string[] = []
    let score = 100

    // Exemplo:
    if (!data.scene) {
      score -= 30
      reasons.push("Nenhuma cena ativa.")
    }

    if (data.characters.length === 0) {
      score -= 20
      reasons.push("Nenhum personagem presente.")
    }

    if (data.world.length === 0) {
      score -= 50
      reasons.push("Mundo vazio.")
    }

    return {
      allowed: score > 0,
      score,
      reasons,
    }
  }
}