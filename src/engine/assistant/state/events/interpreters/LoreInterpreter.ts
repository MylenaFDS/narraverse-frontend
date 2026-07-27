import type {
  RPGTurn,
} from "../../../../../types/turn"

import type {
  StoryEvent,
} from "../StoryEvent"


export class LoreInterpreter {


  static interpret(
    turn: RPGTurn,
  ): StoryEvent[] {


    const events: StoryEvent[] = []


    const text =
      turn.content.toLowerCase()


    const actorId =
      turn.character_id ?? undefined



    // ======================================
    // Profecias
    // ======================================


    if (

      this.contains(
        text,
        [
          "profecia",
          "destino",
          "oráculo",
          "visão",
          "presságio",
        ],
      )

    ) {


      events.push({

        type:
          "prophecy",

        actorId,

        description:
          "Uma profecia ou destino foi revelado",

        turnId:
          turn.id,

      })

    }



    // ======================================
    // Segredos / Revelações
    // ======================================


    if (

      this.contains(
        text,
        [
          "segredo",
          "revelou",
          "descobri",
          "descoberta",
          "verdade",
          "mistério",
          "antigo",
          "relíquia",
        ],
      )

    ) {


      events.push({

        type:
          "discovery",

        actorId,

        description:
          "Uma informação importante foi descoberta",

        turnId:
          turn.id,

      })

    }



    // ======================================
    // Locais importantes
    // ======================================


    const location =
      this.extractLocation(
        text,
      )


    if(location){

      events.push({

        type:
          "discovery",

        actorId,

        location,

        description:
          `Local importante identificado: ${location}`,

        turnId:
          turn.id,

      })

    }



    return events

  }





  private static contains(

    text:string,

    words:string[],

  ):boolean {


    return words.some(

      word =>
        text.includes(word),

    )

  }





  private static extractLocation(

    text:string,

  ):string | undefined {


    const locations = [

      "gondor",

      "mordor",

      "valfenda",

      "minas tirith",

      "floresta",

      "castelo",

      "torre",

      "reino",

    ]



    return locations.find(

      location =>
        text.includes(
          location,
        ),

    )

  }


}