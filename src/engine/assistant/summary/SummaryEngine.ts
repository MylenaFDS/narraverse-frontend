import type {
  StoryAnalysis,
} from "../analysis/StoryAnalysis"


export class SummaryEngine {


  static build(
    analysis: StoryAnalysis,
  ): string {


    const parts: string[] = []



    // ==================================
    // Situação atual
    // ==================================

    if (
      analysis.currentSituation
    ) {

      parts.push(
        analysis.currentSituation,
      )

    }



    // ==================================
    // Eventos recentes
    // ==================================

    if (
      analysis.recentEvents &&
      analysis.recentEvents.length > 0
    ) {

      parts.push(
        ...analysis.recentEvents.slice(0, 3),
      )

    }



    // ==================================
    // Conflitos
    // ==================================

    if (
      analysis.activeConflicts &&
      analysis.activeConflicts.length > 0
    ) {

      parts.push(
        ...analysis.activeConflicts.slice(0, 2),
      )

    }



    // ==================================
    // Pendências
    // ==================================

    if (
      analysis.unresolvedThreads &&
      analysis.unresolvedThreads.length > 0
    ) {

      parts.push(
        analysis.unresolvedThreads[0],
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



    if (
      unique.length === 0
    ) {

      return (
        "Nenhum evento importante aconteceu recentemente."
      )

    }



    return unique.join(
      ", ",
    )


  }


}