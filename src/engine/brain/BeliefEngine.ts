import type { Belief } from "./types/Belief"

export class BeliefEngine {

  static believes(

    beliefs: Belief[],

    subject: string,

  ) {

    return beliefs.some(

      belief =>

        belief.subject
          .toLowerCase() ===
        subject.toLowerCase(),

    )

  }

  static get(

    beliefs: Belief[],

    subject: string,

  ) {

    return (

      beliefs.find(

        belief =>

          belief.subject
            .toLowerCase() ===
          subject.toLowerCase(),

      ) ?? null

    )

  }

  static add(

    beliefs: Belief[],

    belief: Belief,

  ) {

    beliefs.push(belief)

  }

  static updateConfidence(

    beliefs: Belief[],

    subject: string,

    amount: number,

  ) {

    const belief =

      this.get(
        beliefs,
        subject,
      )

    if (!belief) return

    belief.confidence = Math.max(

      0,

      Math.min(

        100,

        belief.confidence + amount,

      ),

    )

  }

}