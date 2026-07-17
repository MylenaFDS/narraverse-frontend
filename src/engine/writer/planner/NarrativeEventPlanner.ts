import type { WriterContext } from "../WriterContext"
import type { NarrativeEvent } from "./NarrativeEvent"

import { EventFactory } from "./EventFactory"
import { NarrativePriority } from "./NarrativePriority"


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



    // ======================================
    // Observação inicial
    // ======================================

    events.push(

      EventFactory.create(
        "observation",
        null,
        NarrativePriority.Observation,
      ),

    )



    // ======================================
    // Estado emocional
    // ======================================

    events.push(

      EventFactory.create(
        "emotion",
        dominantEmotion,
        NarrativePriority.Emotion,
      ),

    )



    // ======================================
    // Ação principal
    // ======================================

    if (
      context.decision.action
    ) {

      events.push(

        EventFactory.create(
          "action",
          context.decision.action,
          NarrativePriority.Action,
        ),

      )

    }



    // ======================================
    // Diálogo
    // ======================================

    if (
      context.allowDialogue &&
      context.decision.action
    ) {

      events.push(

        EventFactory.create(
          "dialogue",
          context.decision.action,
          NarrativePriority.Dialogue,
        ),

      )

    }



    // ======================================
    // Encerramento
    // ======================================

    events.push(

      EventFactory.create(
        "ending",
        null,
        NarrativePriority.Ending,
      ),

    )



    return events.sort(

      (a, b) =>
        a.priority - b.priority,

    )


  }


}