import type {
  RPGTurn,
} from "../../../../../types/turn"


import type {
  StoryEvent,
} from "../StoryEvent"



export class DialogueInterpreter {



  static interpret(
    turn: RPGTurn,
  ): StoryEvent[] {


    const events: StoryEvent[] = []



    const text =
      turn.content.toLowerCase()



    const actorId =
      turn.character_id ?? undefined



    const actorName =
      this.extractMention(
        turn.content,
      )



    const hasDialogue =

      turn.content.includes("—")

      ||

      turn.content.includes("\"")

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



    if(
      !hasDialogue
    ){

      return events

    }



    const dialogueText =
      this.extractDialogue(
        turn.content,
      )



    const targetName =
      this.extractTarget(
        turn.content,
      )



    events.push({


      // ==============================
      // Tipo
      // ==============================

      type:
        "dialogue",



      // ==============================
      // Personagem
      // ==============================

      actorId,


      actorName,


      targetName,



      // ==============================
      // Informação narrativa
      // ==============================

      description:

        actorName

          ? `${actorName} realizou um diálogo`

          : "Um diálogo importante ocorreu",



      sourceText:

        dialogueText
        ||
        turn.content,



      // ==============================
      // Tempo
      // ==============================

      turnId:
        turn.id,



    })



    return events


  }





  // ======================================
  // Detecta palavras de diálogo
  // ======================================

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



    if(
      !match
    ){

      return undefined

    }



    return match[1]


  }





  // ======================================
  // Extrai conteúdo entre aspas ou travessão
  // ======================================

  private static extractDialogue(

    text:string,

  ):string | undefined {



    // ==============================
    // Formato:
    // "fala"
    // ==============================

    const quoted =

      text.match(
        /"([^"]+)"/,
      )



    if(
      quoted
    ){

      return quoted[1]

    }





    // ==============================
    // Formato:
    // — fala —
    // ==============================

    const dash =

      text.match(
        /—\s*(.*?)($|—)/,
      )



    if(
      dash
    ){

      return dash[1].trim()

    }





    return undefined


  }





  // ======================================
  // Detecta personagem citado após fala
  // ======================================

  private static extractTarget(

    text:string,

  ):string | undefined {



    const match =

      text.match(

        /@([A-Za-zÀ-ÿ0-9_]+)/g,

      )



    if(
      !match ||
      match.length < 2
    ){

      return undefined

    }



    return match[1]
      .replace(
        "@",
        "",
      )


  }


}