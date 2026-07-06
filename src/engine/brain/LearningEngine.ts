export interface LearnedFact {

  characterId: number

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

    characterId: number,

    situation: string,

    result: string,

    success = true,

  ) {

    const existing =

      this.memory.find(

        fact =>

          fact.characterId === characterId &&

          fact.situation === situation &&

          fact.result === result,

      )

    if (existing) {

      existing.occurrences++

      existing.lastUsed = Date.now()

      existing.success = success

      existing.confidence = Math.min(

        100,

        existing.confidence +

          (success ? 5 : -3),

      )

      return

    }

    this.memory.push({

      characterId,

      situation,

      result,

      success,

      confidence:

        success ? 70 : 30,

      occurrences: 1,

      lastUsed: Date.now(),

    })

  }

  static find(

    characterId: number,

    situation: string,

  ) {

    return this.memory

      .filter(

        fact =>

          fact.characterId === characterId &&

          fact.situation === situation,

      )

      .sort(

        (a, b) =>

          b.confidence -

          a.confidence,

      )

  }

  static all(

    characterId: number,

  ) {

    return this.memory.filter(

      fact =>

        fact.characterId === characterId,

    )

  }

  static clear(

    characterId?: number,

  ) {

    if (characterId === undefined) {

      this.memory = []

      return

    }

    this.memory =

      this.memory.filter(

        fact =>

          fact.characterId !== characterId,

      )

  }

}