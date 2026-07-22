import type {
  RPGTurn,
} from "../../../../types/turn"


import type {
  StoryEvent,
} from "./StoryEvent"



export class EventInterpreterEngine {


  static interpret(

    turn: RPGTurn,

  ): StoryEvent[] {


    const events: StoryEvent[] = []


    const text =
      turn.content.toLowerCase()



    // ======================================
    // Ataque
    // ======================================

    if (

      text.includes("ataque") ||

      text.includes("atac")

    ) {


      events.push({

        type: "attack",

        actorId:
  turn.character_id ?? undefined,

        description:
          turn.content,

        turnId:
          turn.id,

      })


    }





    // ======================================
    // Morte
    // ======================================

    if (

      text.includes("morreu") ||

      text.includes("morte") ||

      text.includes("caiu")

    ) {


      events.push({

        type: "death",

        actorId:
  turn.character_id ?? undefined,

        description:
          turn.content,

        turnId:
          turn.id,

      })


    }





    // ======================================
    // Movimento
    // ======================================

    if (

      text.includes("entrei") ||

      text.includes("fui") ||

      text.includes("viajei") ||

      text.includes("cheguei") ||

      text.includes("parti")

    ) {


      events.push({

        type: "movement",

        actorId:
  turn.character_id ?? undefined,

        description:
          turn.content,

        turnId:
          turn.id,

      })


    }





    // ======================================
    // Diálogo
    // ======================================

    if (

      turn.content.includes("—")

    ) {


      events.push({

        type: "dialogue",

        actorId:
  turn.character_id ?? undefined,

        description:
          turn.content,

        turnId:
          turn.id,

      })


    }





    return events


  }


}