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

    const summary =
      this.summarizeEvents(
        analysis,
      )

    if (
      summary
    ) {

      return summary

    }

    return (
      "Nenhum acontecimento relevante registrado."
    )

  }

  // ==================================
  // Síntese narrativa
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

    const prophecy =
      this.find(
        events,
        "prophecy",
      )

    const relationship =
      this.find(
        events,
        "relationship",
      )

    const quest =
      this.find(
        events,
        "quest",
      )

    const location =
      analysis.currentLocation

    const characters =
      analysis.activeCharacters
        .slice(0, 2)

    const text: string[] = []

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

    else if (
      attack
    ) {

      if (
        characters.length > 0
      ) {

        text.push(
          `${characters.join(" e ")} enfrentam um conflito importante.`,
        )

      }

      else {

        text.push(
          "Um conflito importante está em andamento.",
        )

      }

    }

    // ==========================
    // Profecia
    // ==========================

    if (
      prophecy
    ) {

      if (
        location
      ) {

        text.push(
          `Uma antiga profecia influencia os acontecimentos em ${location}.`,
        )

      }

      else {

        text.push(
          "Uma antiga profecia influencia os acontecimentos.",
        )

      }

    }

    // ==========================
    // Relação
    // ==========================

    if (
      relationship
    ) {

      text.push(
        "As relações entre os personagens continuam evoluindo.",
      )

    }

    // ==========================
    // Objetivo
    // ==========================

    if (
      analysis.activeObjectives.length > 0
    ) {

      text.push(
        `O principal objetivo continua sendo ${analysis.activeObjectives[0]}.`,
      )

    }

    // ==========================
    // Missão
    // ==========================

    else if (
      quest
    ) {

      text.push(
        `A missão em andamento é ${quest.description}.`,
      )

    }

    // ==========================
    // Local
    // ==========================

    if (
      location &&
      !prophecy
    ) {

      text.push(
        `A cena permanece em ${location}.`,
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
    events: StoryEvent[],
    type: StoryEvent["type"],
  ): StoryEvent | undefined {

    return events.find(
      event =>
        event.type === type,
    )

  }

}