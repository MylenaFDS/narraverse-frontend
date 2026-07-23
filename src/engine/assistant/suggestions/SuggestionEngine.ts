import type {
  StoryAnalysis,
} from "../analysis/StoryAnalysisEngine"


import type {
  AssistantSuggestion,
} from "../types/AssistantSuggestion"



export class SuggestionEngine {


  static build(
    analysis: StoryAnalysis,
  ): AssistantSuggestion[] {


    const suggestions:
      AssistantSuggestion[] = []



    // ==================================
    // Combate acontecendo
    // ==================================

    if (
      analysis.activeConflicts.length > 0
    ) {

      suggestions.push({

        title:
          "Explorar o conflito atual",

        description:
          "O personagem pode atacar, defender, procurar uma vantagem ou tentar uma solução alternativa.",

        type:
          "strategy",

      })


      suggestions.push({

        title:
          "Mudar a abordagem",

        description:
          "Considere usar o ambiente, aliados ou uma estratégia diferente para alterar o rumo da situação.",

        type:
          "action",

      })

    }



    // ==================================
    // Muitos personagens presentes
    // ==================================

    if (
      analysis.activeCharacters.length > 1
    ) {

      suggestions.push({

        title:
          "Interagir com outro personagem",

        description:
          "Um aliado ou inimigo pode reagir aos acontecimentos, oferecer ajuda ou criar um novo conflito.",

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

      suggestions.push({

        title:
          "Retomar uma questão pendente",

        description:
          "Uma informação esquecida ou objetivo antigo pode voltar a influenciar a história.",

        type:
          "event",

      })

    }



    // ==================================
    // Sem conflito
    // ==================================

    if (
      analysis.activeConflicts.length === 0
    ) {

      suggestions.push({

        title:
          "Criar um novo acontecimento",

        description:
          "O personagem pode descobrir algo, encontrar alguém ou iniciar uma nova situação.",

        type:
          "event",

      })

    }



    // ==================================
    // Segurança
    // ==================================

    if (
      suggestions.length === 0
    ) {

      suggestions.push({

        title:
          "Continuar explorando",

        description:
          "Observe o ambiente, converse com personagens ou avance o objetivo atual.",

        type:
          "action",

      })

    }



    return suggestions


  }


}