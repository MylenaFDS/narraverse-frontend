import type {
  RPGTurn,
} from "../../../../../types/turn"


import type {
  StoryEvent,
} from "../StoryEvent"



export class DialogueInterpreter {


  static interpret(
    turn:RPGTurn,
  ):StoryEvent[] {


    const events:StoryEvent[] = []


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



    events.push({

      type:
        "dialogue",


      actorId,


      actorName,


      description:

        actorName

          ? `${actorName} participou de um diálogo`

          : "Diálogo importante",


      turnId:
        turn.id,


    })



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


}