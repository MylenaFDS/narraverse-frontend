import type {
  RPGTurn,
} from "../../../../types/turn"



import type {
  StoryEvent,
} from "./StoryEvent"



import { CombatInterpreter }
  from "./interpreters/CombatInterpreter"



import { DeathInterpreter }
  from "./interpreters/DeathInterpreter"



import { DialogueInterpreter }
  from "./interpreters/DialogueInterpreter"



import { LoreInterpreter }
  from "./interpreters/LoreInterpreter"



import { MovementInterpreter }
  from "./interpreters/MovementInterpreter"



import { QuestInterpreter }
  from "./interpreters/QuestInterpreter"



import { RelationshipInterpreter }
  from "./interpreters/RelationshipInterpreter"



export class EventInterpreterEngine {



  private static readonly interpreters = [

    DeathInterpreter,

    CombatInterpreter,

    RelationshipInterpreter,

    DialogueInterpreter,

    LoreInterpreter,

    MovementInterpreter,

    QuestInterpreter,

  ]



  // ======================================
  // Interpretação
  // ======================================

  static interpret(
    turn:RPGTurn,
  ):StoryEvent[] {



    console.log(
      "INTERPRETING:",
      turn.content,
    )



    const events:StoryEvent[] = []



    for(
      const interpreter
      of this.interpreters
    ){



      const result =

        interpreter.interpret(
          turn,
        )



      if(
        result.length === 0
      ){

        continue

      }



      events.push(
        ...result,
      )

    }



    // ==================================
    // Normalização
    // ==================================

    const normalized =

      this.normalize(
        events,
      )



    // ==================================
    // Duplicados
    // ==================================

    const unique =

      this.removeDuplicates(
        normalized,
      )



    // ==================================
    // Ordenação
    // ==================================

    const sorted =

      this.sortByImportance(
        unique,
      )



    console.log(
      "EVENTS GENERATED:",
      sorted,
    )



    return sorted

  }



  // ======================================
  // Normalização
  // ======================================

  private static normalize(
    events:StoryEvent[],
  ):StoryEvent[] {



    return events.map(

      event => ({

        ...event,



        description:

          event.description
            .trim()
            .replace(
              /\s+/g,
              " ",
            ),



        importance:

          event.importance
          ??
          this.defaultImportance(
            event.type,
          ),



        tags:

          event.tags
          ??
          [],

      })

    )

  }



  // ======================================
  // Remover duplicados
  // ======================================

  private static removeDuplicates(
    events:StoryEvent[],
  ):StoryEvent[] {



    const map =

      new Map<
        string,
        StoryEvent
      >()



    for(
      const event
      of events
    ){



      const key = [

        event.type,

        event.subtype,

        event.actorName,

        event.targetName,

        event.location,

        event.description,

      ].join("|")



      const existing =

        map.get(
          key,
        )



      if(
        !existing
      ){

        map.set(
          key,
          event,
        )

        continue

      }



      if(

        (
          event.importance ?? 0
        )

        >

        (
          existing.importance ?? 0
        )

      ){

        map.set(
          key,
          event,
        )

      }

    }



    return [

      ...map.values(),

    ]

  }



  // ======================================
  // Ordenação
  // ======================================

  private static sortByImportance(
    events:StoryEvent[],
  ):StoryEvent[] {



    return [

      ...events,

    ].sort(

      (
        a,
        b,
      ) =>

        (
          b.importance ?? 0
        )

        -

        (
          a.importance ?? 0
        )

    )

  }



  // ======================================
  // Importância padrão
  // ======================================

  private static defaultImportance(
    type:StoryEvent["type"],
  ):number {



    switch(
      type
    ){

      case "death":

        return 100



      case "prophecy":

        return 95



      case "discovery":

        return 90



      case "relationship":

        return 80



      case "alliance":

        return 85



      case "betrayal":

        return 90



      case "political":

        return 85



      case "combat":

      case "attack":

        return 75



      case "dialogue":

        return 60



      case "quest":

        return 55



      case "movement":

        return 20



      default:

        return 40

    }

  }



}