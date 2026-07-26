import type {
  AssistantSuggestion,
} from "../types/AssistantSuggestion"

import type {
  SuggestionContext,
} from "./SuggestionContext"


export class EventSuggestionEngine {


  static build(

    context: SuggestionContext,

  ): AssistantSuggestion[] {


    const events:
      AssistantSuggestion[] = []



    this.buildConflictEvents(
      context,
      events,
    )



    this.buildExplorationEvents(
      context,
      events,
    )



    this.buildCharacterEvents(
      context,
      events,
    )



    this.buildStoryEvents(
      context,
      events,
    )



    return events

  }





  // ==================================
  // Combate
  // ==================================

  private static buildConflictEvents(

    context: SuggestionContext,

    events: AssistantSuggestion[],

  ) {


    if(
      context.focus !== "combat"
    ){

      return

    }



    events.push({

      title:
        "Reforços chegam",


      description:
        "Um novo aliado ou inimigo pode entrar no conflito.",


      type:
        "event",

    })



    events.push({

      title:
        "Mudança no campo de batalha",


      description:
        "O ambiente pode alterar completamente o combate.",


      type:
        "event",

    })



    if(
      context.tension > 70
    ){

      events.push({

        title:
          "Virada inesperada",


        description:
          "A situação pode mudar rapidamente devido à alta tensão.",


        type:
          "event",

      })

    }


  }





  // ==================================
  // Exploração
  // ==================================

  private static buildExplorationEvents(

    context: SuggestionContext,

    events: AssistantSuggestion[],

  ) {


    if(
      !context.canExplore
    ){

      return

    }



    events.push({

      title:
        "Nova descoberta",


      description:
        "Uma pista, objeto ou local importante pode ser encontrado.",


      type:
        "event",

    })



    if(
      context.location
    ){

      events.push({

        title:
          "Explorar a região",


        description:
          `Algo interessante pode existir em ${context.location}.`,


        type:
          "event",

      })

    }


  }





  // ==================================
  // Personagens
  // ==================================

  private static buildCharacterEvents(

    context: SuggestionContext,

    events: AssistantSuggestion[],

  ) {


    if(
      !context.canInteract
    ){

      return

    }



    if(
      context.hasDialogue
    ){

      events.push({

        title:
          "Nova resposta",


        description:
          "Um personagem pode reagir às últimas palavras.",


        type:
          "character",

      })

    }



    if(
      context.hasDeath
    ){

      events.push({

        title:
          "Consequência emocional",


        description:
          "A perda de alguém pode gerar novas decisões.",


        type:
          "character",

      })

    }


  }





  // ==================================
  // Narrativa
  // ==================================

  private static buildStoryEvents(

    context: SuggestionContext,

    events: AssistantSuggestion[],

  ) {


    if(
      context.hasOpenThreads
    ){

      events.push({

        title:
          "Retomar uma pendência",


        description:
          "Um acontecimento anterior pode voltar a influenciar a história.",


        type:
          "event",

      })

    }



    if(
      context.objective
    ){

      events.push({

        title:
          "Avançar objetivo",


        description:
          context.objective,


        type:
          "strategy",

      })

    }



    events.push({

      title:
        "Introduzir um acontecimento",


      description:
        "Um novo evento pode movimentar a narrativa.",


      type:
        "event",

    })


  }


}