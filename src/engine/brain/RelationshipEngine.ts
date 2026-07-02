import type {
  Relationship,
} from "./RelationshipTypes"

export class RelationshipEngine {

  static get(

    relations: Relationship[],

    targetId: number,

  ) {

    return (

      relations.find(

        relation =>
          relation.targetId === targetId,

      ) ?? null

    )

  }

  static likes(

    relations: Relationship[],

    targetId: number,

  ) {

    const relation =
      this.get(relations, targetId)

    if (!relation)
      return false

    return (

      relation.affection >= 70 &&

      relation.trust >= 60

    )

  }

  static hates(

    relations: Relationship[],

    targetId: number,

  ) {

    const relation =
      this.get(relations, targetId)

    if (!relation)
      return false

    return (

      relation.rivalry >= 70 ||

      relation.affection <= 20

    )

  }

  static trusts(

    relations: Relationship[],

    targetId: number,

  ) {

    const relation =
      this.get(relations, targetId)

    if (!relation)
      return false

    return relation.trust >= 70

  }

  static fears(

    relations: Relationship[],

    targetId: number,

  ) {

    const relation =
      this.get(relations, targetId)

    if (!relation)
      return false

    return relation.fear >= 60

  }

  static respects(

    relations: Relationship[],

    targetId: number,

  ) {

    const relation =
      this.get(relations, targetId)

    if (!relation)
      return false

    return relation.respect >= 70

  }

  static rivals(

    relations: Relationship[],

    targetId: number,

  ) {

    const relation =
      this.get(relations, targetId)

    if (!relation)
      return false

    return relation.rivalry >= 70

  }

}