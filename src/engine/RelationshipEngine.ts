export type RelationshipType =
  | "character"
  | "npc"
  | "faction"
  | "location"
  | "kingdom"
  | "city"

export interface Relationship {
  sourceId: number
  sourceType: RelationshipType

  targetId: number
  targetType: RelationshipType

  value: number

  reasons: string[]
}

export class RelationshipEngine {
  private static relations: Relationship[] = []

  static set(
    relation: Relationship,
  ) {
    const existing =
      this.relations.find(
        r =>
          r.sourceId === relation.sourceId &&
          r.sourceType === relation.sourceType &&
          r.targetId === relation.targetId &&
          r.targetType === relation.targetType
      )

    if (existing) {
      existing.value = relation.value
      existing.reasons = relation.reasons
      return
    }

    this.relations.push(relation)
  }

  static get(
    sourceId: number,
    sourceType: RelationshipType,
    targetId: number,
    targetType: RelationshipType,
  ) {
    return (
      this.relations.find(
        r =>
          r.sourceId === sourceId &&
          r.sourceType === sourceType &&
          r.targetId === targetId &&
          r.targetType === targetType
      ) ?? null
    )
  }

  static change(
    sourceId: number,
    sourceType: RelationshipType,
    targetId: number,
    targetType: RelationshipType,
    delta: number,
    reason: string,
  ) {
    let relation =
      this.get(
        sourceId,
        sourceType,
        targetId,
        targetType,
      )

    if (!relation) {
      relation = {
        sourceId,
        sourceType,
        targetId,
        targetType,
        value: 0,
        reasons: [],
      }

      this.relations.push(relation)
    }

    relation.value += delta
    relation.value = Math.max(
      -100,
      Math.min(100, relation.value),
    )

    relation.reasons.push(reason)
  }

  static all() {
    return this.relations
  }
}