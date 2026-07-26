import type {
  AssistantSuggestion,
} from "../types/AssistantSuggestion"

import type {
  SuggestionContext,
} from "./SuggestionContext"



export class SuggestionEngine {


  static build(

    context: SuggestionContext,

  ): AssistantSuggestion[] {


    const suggestions:
      AssistantSuggestion[] = []



    this.buildConflictSuggestions(
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
  // Combate
  // ==================================

  private static buildConflictSuggestions(

    context: SuggestionContext,

    suggestions: AssistantSuggestion[],

  ) {


    const {
      state,
    } = context



    if(
      state.situation !== "combat"
    ){

      return

    }



    suggestions.push({

      title:
        "Buscar vantagem tática",

      description:
        "Use terreno, aliados ou recursos disponíveis antes de agir.",

      type:
        "strategy",

    })



    suggestions.push({

      title:
        "Proteger um aliado",

      description:
        "Um personagem vulnerável pode alterar o rumo do conflito.",

      type:
        "action",

    })



    if(
      state.isDangerous
    ){

      suggestions.push({

        title:
          "Recuar temporariamente",

        description:
          "A tensão é alta. Sobreviver pode ser mais importante do que vencer agora.",

        type:
          "strategy",

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
      state,
    } = context



    if(
      !state.canInteract
    ){

      return

    }



    if(
      state.hasDeath
    ){

      suggestions.push({

        title:
          "Reagir à perda",

        description:
          "A morte recente pode mudar completamente a motivação dos personagens.",

        type:
          "character",

      })

    }



    if(
      state.hasDialogue
    ){

      suggestions.push({

        title:
          "Responder ao diálogo",

        description:
          "As últimas palavras ainda podem influenciar a narrativa.",

        type:
          "character",

      })

    }



    if(
      analysis.activeCharacters.length > 1
    ){

      suggestions.push({

        title:
          "Criar interação",

        description:
          "Outro personagem pode agir, interromper a conversa ou revelar algo importante.",

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


    const {
      analysis,
      state,
    } = context



    if(
      analysis.activeObjectives.length === 0
    ){

      return

    }



    suggestions.push({

      title:

        state.situation === "combat"

          ? "Cumprir o objetivo durante o combate"

          : "Avançar o objetivo",



      description:

        analysis.activeObjectives[0],



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


    const {
      analysis,
    } = context



    if(
      analysis.activeQuests.length === 0
    ){

      return

    }



    suggestions.push({

      title:
        "Continuar a missão",

      description:
        analysis.activeQuests[0],

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


    const {
      analysis,
      state,
    } = context



    if(
      !state.canExplore
    ){

      return

    }



    suggestions.push({

      title:
        "Explorar o cenário",

      description:
        "O ambiente pode esconder pistas, objetos ou novos caminhos.",

      type:
        "action",

    })



    if(
      analysis.discoveredLocations.length > 0
    ){

      suggestions.push({

        title:
          "Visitar outro local",

        description:
          analysis.discoveredLocations[0],

        type:
          "event",

      })

    }


  }





  // ==================================
  // Narrativa
  // ==================================

  private static buildStorySuggestions(

    context: SuggestionContext,

    suggestions: AssistantSuggestion[],

  ) {


    const {
      analysis,
      state,
    } = context



    if(
      analysis.unansweredQuestions.length > 0
    ){

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
      state.hasOpenThreads
    ){

      suggestions.push({

        title:
          "Retomar um acontecimento",

        description:
          analysis.unresolvedThreads[0],

        type:
          "event",

      })

    }



    if(
      state.canCreateEvent
    ){

      suggestions.push({

        title:
          "Introduzir um novo acontecimento",

        description:
          "Um evento inesperado pode movimentar a narrativa.",

        type:
          "event",

      })

    }


  }





  // ==================================
  // Segurança
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


}