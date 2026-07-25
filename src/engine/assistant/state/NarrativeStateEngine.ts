import type {
  StoryAnalysis,
} from "../analysis/StoryAnalysis"

import type {
  NarrativeState,
} from "./NarrativeState"


export class NarrativeStateEngine {


  static analyze(
    analysis: StoryAnalysis,
    
  ): NarrativeState {


    const situation =
      this.detectSituation(
        analysis,
      )


    const tension =
      this.calculateTension(
        analysis,
      )



    return {


      situation,


      tension,



      hasDeath:

        analysis.deadCharacters.length > 0,



      hasDialogue:

        analysis.recentDialogue.length > 0,



      hasOpenThreads:

        analysis.unresolvedThreads.length > 0,



      hasConflict:

        analysis.activeConflicts.length > 0,



      isDangerous:

        tension >= 60,



      canExplore:

        analysis.activeConflicts.length === 0,



      canInteract:

        analysis.activeCharacters.length > 1,



      canCreateEvent:

        situation === "calm"
        ||
        situation === "exploration",



      characterCount:

        analysis.activeCharacters.length,



      narrativeFocus:

        this.detectFocus(
          situation,
          tension,
        ),


    }

  }





  private static detectSituation(
    analysis: StoryAnalysis,
  ): NarrativeState["situation"] {


    const text =
      analysis.currentSituation
        .toLowerCase()



    if(

      text.includes("combate")
      ||
      text.includes("batalha")
      ||
      text.includes("ataque")

    ){

      return "combat"

    }



    if(
      analysis.recentDialogue.length > 0
    ){

      return "dialogue"

    }



    if(
      analysis.unresolvedThreads.length > 0
    ){

      return "investigation"

    }



    if(
      analysis.discoveredLocations.length > 0
    ){

      return "exploration"

    }



    return "calm"

  }





  private static calculateTension(
    analysis: StoryAnalysis,
  ): number {


    let value = 0



    if(
      analysis.activeConflicts.length > 0
    ){

      value += 50

    }



    if(
      analysis.deadCharacters.length > 0
    ){

      value += 25

    }



    if(

      analysis.sceneMood
        .toLowerCase()
        .includes("tensão")

    ){

      value += 25

    }



    return Math.min(
      value,
      100,
    )

  }





  private static detectFocus(

    situation:
      NarrativeState["situation"],

    tension:number,

  ): NarrativeState["narrativeFocus"] {



    if(
      tension >= 60
    ){

      return "action"

    }



    switch(
      situation
    ){

      case "dialogue":

        return "dialogue"



      case "exploration":

        return "discovery"



      case "investigation":

        return "progress"



      default:

        return "emotion"

    }

  }


}