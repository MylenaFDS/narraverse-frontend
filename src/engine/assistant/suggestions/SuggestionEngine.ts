import type {
  AssistantSuggestion,
} from "../types/AssistantSuggestion"

import type {
  SuggestionContext,
} from "./SuggestionContext"

import type {
  StoryEvent,
} from "../state/events/StoryEvent"



export class SuggestionEngine {


  static build(

    context: SuggestionContext,

  ): AssistantSuggestion[] {


    const suggestions:
      AssistantSuggestion[] = []



    this.buildEventSuggestions(
      context,
      suggestions,
    )



    this.buildCharacterSuggestions(
      context,
      suggestions,
    )



    this.buildObjectiveSuggestions(
      context,
      suggestions,
    )



    this.buildQuestSuggestions(
      context,
      suggestions,
    )



    this.buildExplorationSuggestions(
      context,
      suggestions,
    )



    this.buildStorySuggestions(
      context,
      suggestions,
    )



    this.buildFallback(
      suggestions,
    )



    return suggestions

  }





  // ==================================
  // Eventos estruturados
  // ==================================

  private static buildEventSuggestions(

    context: SuggestionContext,

    suggestions: AssistantSuggestion[],

  ) {


    const events =
      context.analysis.events



    // ===============================
    // Combate
    // ===============================

    if (

      this.hasEvent(
        events,
        "attack",
      )

    ) {

      suggestions.push({

        title:
          "Buscar vantagem tática",


        description:
          "Analise o campo de batalha, aliados e recursos antes de agir.",


        type:
          "strategy",

      })



      suggestions.push({

        title:
          "Proteger um aliado",


        description:
          "Um personagem vulnerável pode mudar o rumo do conflito.",


        type:
          "action",

      })

    }



    // ===============================
    // Morte
    // ===============================

    if (

      this.hasEvent(
        events,
        "death",
      )

    ) {


      suggestions.push({

        title:
          "Lidar com a perda",


        description:
          "A morte recente pode alterar relações e decisões futuras.",


        type:
          "character",

      })


    }



    // ===============================
    // Profecia
    // ===============================

    if (

      this.hasEvent(
        events,
        "prophecy",
      )

    ) {


      suggestions.push({

        title:
          "Investigar a profecia",


        description:
          "Descubra o significado e as consequências dessa revelação.",


        type:
          "event",

      })


    }



    // ===============================
    // Aliança
    // ===============================

    if (

      this.hasEvent(
        events,
        "alliance",
      )

    ) {


      suggestions.push({

        title:
          "Fortalecer a aliança",


        description:
          "Novos acordos podem mudar o equilíbrio político da história.",


        type:
          "character",

      })


    }



    // ===============================
    // Descoberta
    // ===============================

    if (

      this.hasEvent(
        events,
        "discovery",
      )

    ) {


      suggestions.push({

        title:
          "Investigar a descoberta",


        description:
          "A nova informação pode revelar caminhos ou ameaças.",


        type:
          "exploration",

      })


    }



  }





  // ==================================
  // Personagens
  // ==================================

  private static buildCharacterSuggestions(

    context: SuggestionContext,

    suggestions: AssistantSuggestion[],

  ) {


    const {
      analysis,
    } = context



    if (

      analysis.recentDialogue.length > 0

    ) {


      suggestions.push({

        title:
          "Responder ao diálogo",


        description:
          analysis.recentDialogue.at(-1) ??
          "Uma conversa recente pode influenciar a narrativa.",


        type:
          "character",

      })


    }



    if (

      analysis.activeCharacters.length > 1

    ) {


      suggestions.push({

        title:
          "Criar interação entre personagens",


        description:
          "Outro personagem pode reagir, revelar informações ou tomar uma decisão.",


        type:
          "character",

      })


    }


  }





  // ==================================
  // Objetivos
  // ==================================

  private static buildObjectiveSuggestions(

    context: SuggestionContext,

    suggestions: AssistantSuggestion[],

  ) {


    const objectives =
      context.analysis.activeObjectives



    if(
      objectives.length === 0
    ){

      return

    }



    suggestions.push({

      title:
        "Avançar o objetivo atual",


      description:
        objectives[0],


      type:
        "strategy",

    })


  }





  // ==================================
  // Missões
  // ==================================

  private static buildQuestSuggestions(

    context: SuggestionContext,

    suggestions: AssistantSuggestion[],

  ) {


    const quests =
      context.analysis.activeQuests



    if(
      quests.length === 0
    ){

      return

    }



    suggestions.push({

      title:
        "Continuar a missão",


      description:
        quests[0],


      type:
        "event",

    })


  }





  // ==================================
  // Exploração
  // ==================================

  private static buildExplorationSuggestions(

    context: SuggestionContext,

    suggestions: AssistantSuggestion[],

  ) {


    const locations =
      context.analysis.discoveredLocations



    if(

      locations.length === 0

    ){

      return

    }



    suggestions.push({

      title:
        "Explorar um local conhecido",


      description:
        locations[0],


      type:
        "exploration",

    })


  }





  // ==================================
  // Continuidade narrativa
  // ==================================

  private static buildStorySuggestions(

    context: SuggestionContext,

    suggestions: AssistantSuggestion[],

  ) {


    const {
      analysis,
    } = context



    if(

      analysis.unansweredQuestions.length > 0

    ) {


      suggestions.push({

        title:
          "Buscar respostas",


        description:
          analysis.unansweredQuestions[0],


        type:
          "strategy",

      })


    }



    if(

      analysis.unresolvedThreads.length > 0

    ) {


      suggestions.push({

        title:
          "Retomar um acontecimento",


        description:
          analysis.unresolvedThreads[0],


        type:
          "event",

      })


    }


  }





  // ==================================
  // Fallback
  // ==================================

  private static buildFallback(

    suggestions: AssistantSuggestion[],

  ) {


    if(
      suggestions.length > 0
    ){

      return

    }



    suggestions.push({

      title:
        "Continuar explorando",


      description:
        "Observe o ambiente e permita que a história evolua naturalmente.",


      type:
        "action",

    })


  }





  // ==================================
  // Helper
  // ==================================

  private static hasEvent(

    events: StoryEvent[],

    type: StoryEvent["type"],

  ): boolean {


    return events.some(

      event =>
        event.type === type,

    )

  }


}