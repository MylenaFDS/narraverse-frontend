import type {
  RPGTurn,
} from "../../../../../types/turn"

import type {
  StoryEvent,
} from "../StoryEvent"


export class RelationshipInterpreter {


  static interpret(
    turn:RPGTurn,
  ):StoryEvent[] {


    const events:StoryEvent[] = []


    const text =
      turn.content.toLowerCase()



    const actorId =
      turn.character_id ?? undefined



    // ======================================
    // Aliança
    // ======================================


    if (

      this.contains(
        text,
        [
          "aliança",
          "aliado",
          "unidos",
          "juntos",
          "juramento",
          "prometo",
        ],
      )

    ){

      events.push({

        type:
          "alliance",

        actorId,

        description:
          "Uma relação de aliança foi fortalecida",

        turnId:
          turn.id,

      })

    }



    // ======================================
    // Romance / Casamento
    // ======================================


    if (

      this.contains(
        text,
        [
          "amor",
          "amada",
          "amado",
          "casamento",
          "casou",
          "união",
          "abraço",
        ],
      )

    ){

      events.push({

        type:
          "relationship",

        actorId,

        description:
          "Uma relação pessoal importante aconteceu",

        turnId:
          turn.id,

      })

    }



    // ======================================
    // Conflito entre personagens
    // ======================================


    if (

      this.contains(
        text,
        [
          "ódio",
          "inimigo",
          "traiu",
          "traição",
          "vingança",
        ],
      )

    ){

      events.push({

        type:
          "conflict",

        actorId,

        description:
          "Um conflito entre personagens foi criado",

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


}