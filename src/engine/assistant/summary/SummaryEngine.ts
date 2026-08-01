import type {
  StoryAnalysis,
} from "../analysis/StoryAnalysis"

import type {
  StoryEvent,
} from "../state/events/StoryEvent"

export class SummaryEngine {

  static build(
    analysis: StoryAnalysis,
  ): string {

    const sections: string[] = []

    const summary =
      this.summarizeEvents(
        analysis,
      )

    if (summary) {

      sections.push(
        summary,
      )

    }

    const world =
      this.summarizeWorld(
        analysis,
      )

    if (world) {

      sections.push(
        world,
      )

    }

    const characters =
      this.summarizeCharacters(
        analysis,
      )

    if (characters) {

      sections.push(
        characters,
      )

    }

    const objectives =
      this.summarizeObjectives(
        analysis,
      )

    if (objectives) {

      sections.push(
        objectives,
      )

    }

    const mysteries =
      this.summarizeMysteries(
        analysis,
      )

    if (mysteries) {

      sections.push(
        mysteries,
      )

    }

    if (
      sections.length === 0
    ) {

      return (
        "Nenhum acontecimento relevante foi registrado até o momento."
      )

    }

    return sections.join(
      " ",
    )

  }

  // ==================================
  // Síntese narrativa principal
  // ==================================

  private static summarizeEvents(
    analysis: StoryAnalysis,
  ): string {

    const events =
      analysis.events

    if (
      events.length === 0
    ) {

      return ""

    }

    const text:string[] = []

    const death =
      this.find(
        events,
        "death",
      )

    const attack =
      this.find(
        events,
        "attack",
      )

    const dialogue =
      this.find(
        events,
        "dialogue",
      )

    const relationship =
      this.find(
        events,
        "relationship",
      )

    const prophecy =
      this.find(
        events,
        "prophecy",
      )

    const quest =
      this.find(
        events,
        "quest",
      )

    const discovery =
      this.find(
        events,
        "discovery",
      )

    const emotion =
      this.find(
        events,
        "emotion",
      )

    // ==========================
    // Morte
    // ==========================

    if (
      death
    ) {

      text.push(
        death.description,
      )

    }

    // ==========================
    // Combate
    // ==========================

    if (
      attack
    ) {

      text.push(
        attack.description,
      )

    }

    // ==========================
    // Diálogo
    // ==========================

    if (
      dialogue
    ) {

      text.push(
        dialogue.description,
      )

    }

    // ==========================
    // Relações
    // ==========================

    if (
      relationship
    ) {

      text.push(
        relationship.description,
      )

    }

    // ==========================
    // Descoberta
    // ==========================

    if (
      discovery
    ) {

      text.push(
        discovery.description,
      )

    }

    // ==========================
    // Emoção
    // ==========================

    if (
      emotion
    ) {

      text.push(
        emotion.description,
      )

    }

    // ==========================
    // Profecia
    // ==========================

    if (
      prophecy
    ) {

      text.push(
        prophecy.description,
      )

    }

    // ==========================
    // Missão
    // ==========================

    if (
      quest
    ) {

      text.push(
        quest.description,
      )

    }

    return text.join(
      " ",
    )

  }

  // ==================================
  // Mundo
  // ==================================

  private static summarizeWorld(
    analysis:StoryAnalysis,
  ):string{

    const text:string[] = []

    if(
      analysis.currentLocation
    ){

      text.push(
        `A cena acontece em ${analysis.currentLocation}.`,
      )

    }

    if(
      analysis.sceneMood
    ){

      text.push(
        `O clima predominante é ${analysis.sceneMood}.`,
      )

    }

    return text.join(
      " ",
    )

  }

  // ==================================
  // Personagens
  // ==================================

  private static summarizeCharacters(
    analysis:StoryAnalysis,
  ):string{

    if(
      analysis.activeCharacters.length === 0
    ){

      return ""

    }

    if(
      analysis.activeCharacters.length === 1
    ){

      return (
        `${analysis.activeCharacters[0]} permanece no centro dos acontecimentos.`
      )

    }

    const names =
      analysis.activeCharacters
        .slice(
          0,
          4,
        )

    return (
      `Os principais envolvidos são ${names.join(", ")}.`
    )

  }

  // ==================================
  // Objetivos
  // ==================================

  private static summarizeObjectives(
    analysis:StoryAnalysis,
  ):string{

    if(
      analysis.activeObjectives.length === 0
    ){

      return ""

    }

    return (
      `O objetivo principal continua sendo ${analysis.activeObjectives[0]}.`
    )

  }

  // ==================================
  // Mistérios
  // ==================================

  private static summarizeMysteries(
    analysis:StoryAnalysis,
  ):string{

    const text:string[] = []

    if(
  analysis.unresolvedThreads.length
){

  text.push(
    `${analysis.unresolvedThreads.length} acontecimentos ainda aguardam uma resolução.`,
  )

}

if(
  analysis.unansweredQuestions.length
){

  text.push(
    `${analysis.unansweredQuestions.length} perguntas permanecem sem resposta.`,
  )

}

    return text.join(
      " ",
    )

  }

  // ==================================
  // Helpers
  // ==================================

  private static find(
    events:StoryEvent[],
    type:StoryEvent["type"],
  ){

    return events.find(
      event =>
        event.type === type,
    )

  }

}