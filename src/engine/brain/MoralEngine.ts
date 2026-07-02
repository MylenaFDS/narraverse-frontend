import type { Personality } from "./PersonalityTypes"

export class MoralEngine {

  static acceptsCrime(
    personality: Personality,
  ) {

    return (

      personality.honor < 30 &&

      personality.greed > 70

    )

  }

  static acceptsSacrifice(
    personality: Personality,
  ) {

    return (

      personality.empathy > 70 &&

      personality.courage > 70

    )

  }

}