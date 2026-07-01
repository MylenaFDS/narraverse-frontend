export class RulesEngine {

  static applyAttackRules(

    attack: number,

    defense: number,

  ) {

    if (attack < 0) {

      attack = 0

    }

    if (defense < 0) {

      defense = 0

    }

  }

}