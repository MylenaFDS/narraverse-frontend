import type {
  StoryAnalysis,
} from "../analysis/StoryAnalysis"


import type {
  AssistantSuggestion,
} from "../types/AssistantSuggestion"



export class EventSuggestionEngine {


  static build(
    analysis: StoryAnalysis,
  ): AssistantSuggestion[] {


    const events:
      AssistantSuggestion[] = []



    // ==================================
    // Conflitos ativos
    // ==================================

    if (
      analysis.activeConflicts.length > 0
    ) {


      events.push({

        title:
          "Reforços chegam ao conflito",

        description:
          "Um aliado ou inimigo pode aparecer e alterar o equilíbrio da situação.",

        type:
          "event",

      })


      events.push({

        title:
          "Mudança inesperada no combate",

        description:
          "O ambiente pode mudar, criando uma nova ameaça ou oportunidade.",

        type:
          "event",

      })


      events.push({

        title:
          "O inimigo muda de estratégia",

        description:
          "O adversário pode recuar, preparar uma armadilha ou usar uma nova habilidade.",

        type:
          "event",

      })


    }



    // ==================================
    // Sem conflito
    // ==================================

    else {


      events.push({

        title:
          "Novo encontro",

        description:
          "Um viajante, aliado ou personagem desconhecido pode surgir na história.",

        type:
          "event",

      })


      events.push({

        title:
          "Nova descoberta",

        description:
          "O personagem pode encontrar uma pista, local secreto ou informação importante.",

        type:
          "event",

      })


    }



    // ==================================
    // Personagens presentes
    // ==================================

    if (
      analysis.activeCharacters.length > 1
    ) {


      events.push({

        title:
          "Reação de personagem",

        description:
          "Um personagem presente pode tomar uma decisão própria ou revelar uma informação.",

        type:
          "character",

      })


    }



    // ==================================
    // Pontas soltas
    // ==================================

    if (
      analysis.unresolvedThreads.length > 0
    ) {


      events.push({

        title:
          "Resolver uma pendência",

        description:
          "Uma questão anterior pode voltar e avançar a narrativa.",

        type:
          "strategy",

      })


    }



    return events


  }


}