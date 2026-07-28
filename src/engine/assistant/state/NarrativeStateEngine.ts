import type {
  StoryAnalysis,
} from "../analysis/StoryAnalysis"


import type { NarrativeState } from "./NarrativeState"



export class NarrativeStateEngine {


  static build(
    analysis:StoryAnalysis,
  ):NarrativeState {


    const events =
      analysis.events



    return {

  situation:
    this.detectSituation(
      analysis,
    ),

  tension:
    this.calculateTension(
      analysis,
    ),

  importantEvents:
    events
      .slice(-5)
      .map(
        event => event.description,
      ),

  recentCharacters:
    analysis.activeCharacters
      .slice(0, 5),

  hasConflict:
    events.some(
      event =>
        event.type === "attack",
    ),

  hasDeath:
    events.some(
      event =>
        event.type === "death",
    ),

  hasDialogue:
    events.some(
      event =>
        event.type === "dialogue",
    ),

  hasProphecy:
    events.some(
      event =>
        event.type === "prophecy",
    ),

  hasRelationship:
    events.some(
      event =>
        event.type === "relationship" ||
        event.type === "alliance",
    ),

  hasOpenThreads:
    analysis.unresolvedThreads.length > 0,

  isDangerous:
    this.calculateTension(
      analysis,
    ) >= 70,

  canExplore:
    this.detectSituation(
      analysis,
    ) !== "combat",

  canInteract:
    analysis.activeCharacters.length > 1,

  canCreateEvent:
    !events.some(
      event =>
        event.type === "death",
    ),

  characterCount:
    analysis.activeCharacters.length,

  narrativeFocus:
    this.detectNarrativeFocus(
      analysis,
    ),

}


  }





  private static detectSituation(
    analysis:StoryAnalysis,
  ):NarrativeState["situation"] {


    if(
      analysis.events.some(
        event =>
          event.type === "attack",
      )
    ){

      return "combat"

    }


    if(
      analysis.events.some(
        event =>
          event.type === "dialogue",
      )
    ){

      return "dialogue"

    }


    if(
      analysis.discoveredLocations.length > 0
    ){

      return "exploration"

    }


    return "calm"

  }





  private static calculateTension(
    analysis:StoryAnalysis,
  ):number {


    let tension = 20


    if(
      analysis.events.some(
        event =>
          event.type === "death",
      )
    ){

      tension +=40

    }


    if(
      analysis.events.some(
        event =>
          event.type === "attack",
      )
    ){

      tension +=30

    }


    if(
      analysis.unresolvedThreads.length > 0
    ){

      tension +=10

    }


    return Math.min(
      tension,
      100,
    )

  }

private static detectNarrativeFocus(
  analysis: StoryAnalysis,
): NarrativeState["narrativeFocus"] {

  if (
    analysis.events.some(
      event => event.type === "attack",
    )
  ) {
    return "action"
  }

  if (
    analysis.events.some(
      event => event.type === "dialogue",
    )
  ) {
    return "dialogue"
  }

  if (
    analysis.discoveredLocations.length > 0
  ) {
    return "discovery"
  }

  if (
    analysis.events.some(
      event =>
        event.type === "relationship" ||
        event.type === "emotion",
    )
  ) {
    return "emotion"
  }

  return "progress"

}
}