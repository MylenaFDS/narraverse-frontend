import type { Trust } from "./TrustTypes"

export class TrustEngine {

  static get(

    trust: Trust[],

    targetId: number,

  ) {

    return (

      trust.find(

        item =>

          item.targetId === targetId,

      )?.value ??

      0

    )

  }

  static increase(

    trust: Trust[],

    targetId: number,

    amount: number,

  ) {

    const relation =

      trust.find(

        item =>

          item.targetId === targetId,

      )

    if (relation) {

      relation.value = Math.min(

        100,

        relation.value + amount,

      )

      return

    }

    trust.push({

      targetId,

      value: amount,

    })

  }

  static decrease(

    trust: Trust[],

    targetId: number,

    amount: number,

  ) {

    const relation =

      trust.find(

        item =>

          item.targetId === targetId,

      )

    if (!relation) return

    relation.value = Math.max(

      0,

      relation.value - amount,

    )

  }

}