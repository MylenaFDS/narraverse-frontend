import type {
  StoryAnalysis,
} from "../analysis/StoryAnalysis"



export class SummaryEngine {


  static build(
    analysis: StoryAnalysis,
  ): string {


    const parts:string[] = []



    // ==================================
    // Situação atual
    // ==================================

    if(
      analysis.currentSituation
    ){

      parts.push(
        analysis.currentSituation,
      )

    }



    // ==================================
    // Eventos estruturados recentes
    // ==================================

    if(

      analysis.events &&
      analysis.events.length > 0

    ){

      const eventDescriptions =
        analysis.events
          .slice(-5)
          .map(
            event =>
              event.description,
          )



      parts.push(
        ...eventDescriptions,
      )

    }



    // ==================================
    // Local atual
    // ==================================

    if(
      analysis.currentLocation
    ){

      parts.push(
        `Local atual: ${analysis.currentLocation}`,
      )

    }



    // ==================================
    // Personagens importantes
    // ==================================

    if(

      analysis.activeCharacters.length > 0

    ){

      parts.push(

        `Personagens presentes: ${
          analysis.activeCharacters
            .slice(0,3)
            .join(", ")
        }`,

      )

    }



    // ==================================
    // Missões
    // ==================================

    if(

      analysis.activeQuests.length > 0

    ){

      parts.push(

        `Missão atual: ${
          analysis.activeQuests[0]
        }`,

      )

    }



    // ==================================
    // Pendências
    // ==================================

    if(

      analysis.unresolvedThreads.length > 0

    ){

      parts.push(

        `Pendência: ${
          analysis.unresolvedThreads[0]
        }`,

      )

    }



    // ==================================
    // Remover duplicados
    // ==================================

    const unique =
      [
        ...new Set(
          parts,
        ),
      ]



    if(
      unique.length === 0
    ){

      return (
        "Nenhum acontecimento relevante registrado."
      )

    }



    return unique.join(
      ". ",
    )


  }


}