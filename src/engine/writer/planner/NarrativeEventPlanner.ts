import type { WriterContext } from "../WriterContext"
import type { NarrativeEvent } from "./NarrativeEvent"

import { EventFactory } from "./EventFactory"
import { NarrativePriority } from "./NarrativePriority"
import { PersonalityEngine } from "../../brain/PersonalityEngine"

export class NarrativeEventPlanner {

  static plan(
    context: WriterContext,
  ): NarrativeEvent[] {

    const events: NarrativeEvent[] = []

    const dominantEmotion =
      Object.entries(
        context.emotion ?? {},
      )
        .sort(
          (a, b) => b[1] - a[1],
        )[0]?.[0] ?? "trust"

    const emotionValue =
      context.emotion?.[
        dominantEmotion as keyof typeof context.emotion
      ] ?? 0

    const action =
      context.decision.action

    // ======================================
    // Observação
    // ======================================

    if (
      this.shouldObserve(
        context,
        emotionValue,
      )
    ) {

      events.push(

        EventFactory.create(
          "observation",
          null,
          NarrativePriority.Observation,
        ),

      )

    }

    // ======================================
    // Emoção
    // ======================================

    if (
      this.shouldDescribeEmotion(
        context,
        emotionValue,
      )
    ) {

      events.push(

        EventFactory.create(
          "emotion",
          dominantEmotion,
          NarrativePriority.Emotion,
        ),

      )

    }

    // ======================================
    // Ação
    // ======================================

    if (
      action
    ) {

      events.push(

        EventFactory.create(
          "action",
          action,
          NarrativePriority.Action,
        ),

      )

    }

    // ======================================
    // Diálogo
    // ======================================

    if (
      this.shouldSpeak(
        context,
      )
    ) {

      events.push(

        EventFactory.create(
          "dialogue",
          action,
          NarrativePriority.Dialogue,
        ),

      )

    }

    // ======================================
    // Encerramento
    // ======================================

    if (
      this.shouldEnd(
        context,
      )
    ) {

      events.push(

        EventFactory.create(
          "ending",
          null,
          NarrativePriority.Ending,
        ),

      )

    }
    
    console.log("EVENTS", events)

    return events.sort(

      (a, b) =>
        a.priority - b.priority,

    )

  }

  private static shouldObserve(
    context: WriterContext,
    emotion: number,
  ): boolean {

    if (
      context.decision.action === "explore"
    ) {

      return true

    }

    if (
      PersonalityEngine.isCautious(
        context.personality,
      )
    ) {

      return true

    }

    return emotion < 80

  }

  private static shouldDescribeEmotion(
    context: WriterContext,
    emotion: number,
  ): boolean {

    if (
      PersonalityEngine.isIntrospective(
        context.personality,
      )
    ) {

      return true

    }

    return emotion >= 20

  }

  private static shouldSpeak(
    context: WriterContext,
  ): boolean {

    if (
      !context.allowDialogue
    ) {

      return false

    }

    if (
      context.decision.action !== "talk"
    ) {

      return false

    }

    return PersonalityEngine.isSociable(
      context.personality,
    )

  }

  private static shouldEnd(
    context: WriterContext,
  ): boolean {

    if (
      context.decision.action === "attack"
    ) {

      return false

    }

    if (
      PersonalityEngine.isImpulsive(
        context.personality,
      )
    ) {

      return false

    }

    return true

  }

}