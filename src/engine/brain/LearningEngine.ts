export interface LearnedFact {

  situation: string

  result: string

}

export class LearningEngine {

  private static memory:
    LearnedFact[] = []

  static learn(
    situation: string,
    result: string,
  ) {

    this.memory.push({

      situation,

      result,

    })

  }

  static find(
    situation: string,
  ) {

    return this.memory.filter(

      fact =>
        fact.situation === situation,

    )

  }

}