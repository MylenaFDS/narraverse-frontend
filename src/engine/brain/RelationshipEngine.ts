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

        (relation) =>

          relation.targetId === targetId,

      ) ?? null

    )

  }

}