import type {
  RPGTurn,
} from "../../../../../types/turn"

import type {
  StoryEvent,
} from "../StoryEvent"


export class MovementInterpreter {


  static interpret(
    turn: RPGTurn,
  ): StoryEvent[] {


    const events: StoryEvent[] = []


    const text =
      turn.content.toLowerCase()



    const actorId =
      turn.character_id ?? undefined



    const location =
      this.extractLocation(
        turn.content,
      )



    // ======================================
    // Movimento detectado
    // ======================================


    if (

      this.contains(
        text,
        [
          "entrei",
          "entrou",
          "fui",
          "foi",
          "viajei",
          "viajou",
          "cheguei",
          "chegou",
          "parti",
          "partiu",
          "avancei",
          "avançou",
          "caminhei",
          "caminhou",
          "andei",
          "andou",
          "corri",
          "correu",
          "aproximei",
          "aproximou",
          "afastei",
          "afastou",
        ],
      )

    ) {


      events.push({

        type:
          "movement",


        actorId,


        location,


        description:

          location

            ? `Movimento para ${location}`

            : "Movimento importante",


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

      "castelo",

      "floresta",

      "cidade",

      "reino",

      "torre",

      "salão",

      "salões",

      "montanha",

      "estrada",

    ]



    const lower =
      text.toLowerCase()



    return locations.find(

      location =>

        lower.includes(
          location,
        ),

    )

  }


}