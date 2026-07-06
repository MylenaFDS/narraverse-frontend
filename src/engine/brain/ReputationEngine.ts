import type {

  Reputation,

} from "./types/Reputation"

export class ReputationEngine {

  static create(): Reputation {

    return {

      honor: 50,

      fear: 0,

      kindness: 50,

      cruelty: 0,

      wisdom: 50,

      leadership: 50,

    }

  }

  static change(

    reputation: Reputation,

    key: keyof Reputation,

    amount: number,

  ) {

    reputation[key] = Math.max(

      0,

      Math.min(

        100,

        reputation[key] + amount,

      ),

    )

  }

}