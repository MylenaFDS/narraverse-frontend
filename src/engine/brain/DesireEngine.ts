import type { Desire } from "./types/Desire"

export class DesireEngine {

  static strongest(

    desires: Desire[],

  ) {

    return (

      [...desires]

        .sort(

          (a, b) =>

            b.intensity -
            a.intensity,

        )[0] ??

      null

    )

  }

  static increase(

    desires: Desire[],

    id: string,

    value: number,

  ) {

    const desire =

      desires.find(

        d => d.id === id,

      )

    if (!desire) return

    desire.intensity = Math.min(

      100,

      desire.intensity + value,

    )

  }

  static decrease(

    desires: Desire[],

    id: string,

    value: number,

  ) {

    const desire =

      desires.find(

        d => d.id === id,

      )

    if (!desire) return

    desire.intensity = Math.max(

      0,

      desire.intensity - value,

    )

  }

}