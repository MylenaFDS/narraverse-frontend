export interface LearnedFact {

  situation: string

  result: string

  success: boolean

  confidence: number

  occurrences: number

  lastUsed: number

}

export class LearningEngine {

  private static memory: LearnedFact[] = []

  static learn(

    situation: string,

    result: string,

    success = true,

  ) {

    const existing =

      this.memory.find(

        fact =>

          fact.situation === situation &&

          fact.result === result,

      )

    if (existing) {

      existing.occurrences++

      existing.lastUsed = Date.now()

      existing.confidence = Math.min(

        100,

        existing.confidence + 5,

      )

      existing.success = success

      return

    }

    this.memory.push({

      situation,

      result,

      success,

      confidence: success ? 70 : 30,

      occurrences: 1,

      lastUsed: Date.now(),

    })

  }

  static find(

    situation: string,

  ) {

    return this.memory

      .filter(

        fact =>

          fact.situation === situation,

      )

      .sort(

        (a, b) =>

          b.confidence - a.confidence,

      )

  }

  static clear() {

    this.memory = []

  }

}