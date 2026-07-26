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


    console.log(
      "INTERPRETING:",
      turn.content,
    )


    const text =
      turn.content.toLowerCase()


    const actorId =
      turn.character_id ?? undefined


    const actorName =
      this.extractMention(
        turn.content,
      )



    // ======================================
    // Combate
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

        type: "attack",

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

        type: "defense",

        actorId,

        description:
          "Ação defensiva",

        turnId:
          turn.id,

      })

    }




    // ======================================
    // Movimento
    // ======================================


    if (

      this.contains(
        text,
        [
          "entrei",
          "fui",
          "viajei",
          "cheguei",
          "parti",
          "avancei",
          "corri",
          "aproximei",
          "afastei",
        ],
      )

    ) {


      events.push({

        type: "movement",

        actorId,

        description:
          "Movimento importante",

        location:
          this.extractLocation(
            turn.content,
          ),

        turnId:
          turn.id,

      })

    }




    // ======================================
    // Diálogo
    // ======================================


    if (

      turn.content.includes("—")

      ||

      this.contains(
        text,
        [
          "disse",
          "falou",
          "sussurrou",
          "respondeu",
          "gritou",
          "afirmou",
          "declarou",
          "contou",
        ],
      )

    ) {


      events.push({

        type: "dialogue",

        actorId,

        description:
          actorName
            ? `${actorName} participou de um diálogo`
            : "Diálogo importante",

        turnId:
          turn.id,

      })

    }




    // ======================================
    // Morte
    // ======================================


    if (

      this.contains(
        text,
        [
          "morreu",
          "morte",
          "caiu",
          "execut",
          "assassin",
        ],
      )

    ) {


      events.push({

        type: "death",

        actorId,

        description:
          actorName
            ? `${actorName} morreu`
            : "Um personagem morreu",

        turnId:
          turn.id,

      })

    }




    // ======================================
    // Descoberta
    // ======================================


    if (

      this.contains(
        text,
        [
          "descobri",
          "encontrei",
          "achei",
          "revel",
          "segredo",
          "pista",
        ],
      )

    ) {


      events.push({

        type: "discovery",

        actorId,

        description:
          "Nova descoberta",

        turnId:
          turn.id,

      })

    }




    // ======================================
    // Missão
    // ======================================


    if (

      this.contains(
        text,
        [
          "missão",
          "objetivo",
          "quest",
          "tarefa",
        ],
      )

    ) {


      events.push({

        type: "quest",

        actorId,

        description:
          "Missão mencionada",

        turnId:
          turn.id,

      })

    }




    // ======================================
    // Promessa
    // ======================================


    if (

      this.contains(
        text,
        [
          "prometo",
          "promessa",
          "juramento",
        ],
      )

    ) {


      events.push({

        type: "promise",

        actorId,

        description:
          "Uma promessa foi feita",

        turnId:
          turn.id,

      })

    }




    // ======================================
    // Profecia
    // ======================================


    if (

      this.contains(
        text,
        [
          "profecia",
          "destino",
          "oráculo",
        ],
      )

    ) {


      events.push({

        type: "prophecy",

        actorId,

        description:
          actorName
            ? `${actorName} revelou uma profecia`
            : "Uma profecia foi mencionada",

        turnId:
          turn.id,

      })

    }




    // ======================================
    // Aliança
    // ======================================


    if (

      this.contains(
        text,
        [
          "casamento",
          "aliança",
          "casou",
          "união",
        ],
      )

    ) {


      events.push({

        type: "alliance",

        actorId,

        description:
          "Uma aliança importante foi criada",

        turnId:
          turn.id,

      })

    }



    console.log(
      "EVENTS GENERATED:",
      events,
    )


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




  // ======================================
  // Captura @Personagem
  // ======================================


  private static extractMention(

    text:string,

  ):string | undefined {


    const match =
      text.match(
        /@([A-Za-zÀ-ÿ0-9_]+)/,
      )


    if(!match){

      return undefined

    }


    return match[1]

  }




  // ======================================
  // Local simples
  // ======================================


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

    ]


    const lower =
      text.toLowerCase()


    return locations.find(

      location =>
        lower.includes(location),

    )

  }


}