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

  static acceptsLie(
    personality: Personality,
  ) {

    return (

      personality.honor < 45 ||

      personality.cruelty > 60 ||

      personality.ambition > 80

    )

  }

  static acceptsMercy(
    personality: Personality,
  ) {

    return (

      personality.empathy > 60 &&

      personality.cruelty < 40

    )

  }

  static acceptsRevenge(
    personality: Personality,
  ) {

    return (

      personality.cruelty > 70 ||

      personality.honor < 20

    )

  }

  static acceptsRisk(
    personality: Personality,
  ) {

    return (

      personality.courage > 70 ||

      personality.curiosity > 85

    )

  }

  static acceptsNegotiation(
    personality: Personality,
  ) {

    return (

      personality.intelligence > 60 &&

      personality.patience > 50

    )

  }

  static acceptsViolence(
    personality: Personality,
  ) {

    return (

      personality.cruelty > 60 ||

      personality.courage > 85

    )

  }

}