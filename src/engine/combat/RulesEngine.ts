
export interface AttackRulesResult {
  attack: number
  defense: number
}

export class RulesEngine {

  static applyAttackRules(
    attack: number,
    defense: number,
  ): AttackRulesResult {

    return {
      attack: Math.max(0, attack),
      defense: Math.max(0, defense),
    }

  }

}
