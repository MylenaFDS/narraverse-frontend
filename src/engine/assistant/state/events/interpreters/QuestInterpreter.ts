import type {
  RPGTurn,
} from "../../../../../types/turn"

import type {
  StoryEvent,
} from "../StoryEvent"


export class QuestInterpreter {


  static interpret(
    turn:RPGTurn,
  ):StoryEvent[] {


    const events:StoryEvent[] = []


    const text =
      turn.content.toLowerCase()



    const actorId =
      turn.character_id ?? undefined



    // ======================================
    // Nova missão
    // ======================================


    if (

      this.contains(
        text,
        [
          "missão",
          "objetivo",
          "precisamos",
          "devemos",
          "tarefa",
          "buscar",
          "encontrar",
          "proteger",
        ],
      )

    ){

      events.push({

        type:
          "quest",

        actorId,

        description:
          "Novo objetivo narrativo identificado",

        turnId:
          turn.id,

      })

    }



    // ======================================
    // Busca específica
    // ======================================


    if (

      this.contains(
        text,
        [
          "encontrar",
          "recuperar",
          "resgatar",
          "salvar",
          "descobrir",
        ],
      )

    ){

      events.push({

        type:
          "objective",

        actorId,

        description:
          "Uma tarefa de busca ou investigação foi criada",

        turnId:
          turn.id,

      })

    }



    // ======================================
    // Conclusão
    // ======================================


    if (

      this.contains(
        text,
        [
          "concluí",
          "conseguimos",
          "terminamos",
          "completamos",
          "finalizamos",
        ],
      )

    ){

      events.push({

        type:
          "quest_completed",

        actorId,

        description:
          "Um objetivo pode ter sido concluído",

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