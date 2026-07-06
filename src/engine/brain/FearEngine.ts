import type { Fear } from "./types/Fear"

export class FearEngine {

  static strongest(

    fears: Fear[],

  ) {

    return (

      [...fears]

        .sort(

          (a, b) =>

            b.intensity -
            a.intensity,

        )[0] ??

      null

    )

  }

}