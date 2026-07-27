import type {
  RPGTurn,
} from "../../../../../types/turn"

import type {
  StoryEvent,
} from "../StoryEvent"


export class CombatInterpreter {


  static interpret(
    turn: RPGTurn,
  ): StoryEvent[] {


    const events: StoryEvent[] = []


    const text =
      turn.content.toLowerCase()


    const actorId =
      turn.character_id ?? undefined



    // ======================================
    // Ataque
    // ======================================


    if (

      this.contains(
        text,
        [
          "atac",
          "golpe",
          "feri",
          "investi",
          "espad",
          "flecha",
          "lança",
          "combate",
          "batalha",
        ],
      )

    ) {


      events.push({

        type:
          "attack",

        actorId,

        description:
          "Combate iniciado",

        turnId:
          turn.id,

      })

    }



    // ======================================
    // Defesa
    // ======================================


    if (

      this.contains(
        text,
        [
          "defendi",
          "protegi",
          "escudo",
          "bloque",
          "apar",
        ],
      )

    ) {


      events.push({

        type:
          "defense",

        actorId,

        description:
          "Ação defensiva",

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