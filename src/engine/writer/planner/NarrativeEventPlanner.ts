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
        (a,b) =>
          b[1] - a[1],
      )[0]?.[0] ?? "trust"



    const emotionValue =
      context.emotion?.[
        dominantEmotion as keyof typeof context.emotion
      ] ?? 0



    const action =
      context.decision.action



    // ======================================
    // CONTEXTO DA HISTÓRIA
    // ======================================

    if (
      context.story.currentSituation
    ) {

      events.push(

        EventFactory.create(
          "observation",
          context.story.currentSituation,
          NarrativePriority.Observation,
        ),

      )

    }



    // ======================================
    // EVENTOS PENDENTES
    // ======================================

    if (
      context.story.activeEvents.length > 0
    ) {

      events.push(

        EventFactory.create(
          "thought",
          context.story.activeEvents.join(
            ". ",
          ),
          15,
        ),

      )

    }



    // ======================================
    // DIÁLOGOS ANTERIORES
    // ======================================

    if (
      context.story.lastDialogues.length > 0
    ) {

      events.push(

        EventFactory.create(
          "memory",
          context.story.lastDialogues.at(-1),
          18,
        ),

      )

    }



    // ======================================
    // EMOÇÃO
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
    // AÇÃO
    // ======================================

    if(action)
    {

      events.push(

        EventFactory.create(
          "action",
          action,
          NarrativePriority.Action,
        ),

      )

    }



    // ======================================
    // DIÁLOGO NOVO
    // ======================================

    if(
      this.shouldSpeak(
        context,
      )
    ){

      events.push(

        EventFactory.create(
          "dialogue",
          action,
          NarrativePriority.Dialogue,
        ),

      )

    }



    // ======================================
    // FINAL
    // ======================================

    if(
      this.shouldEnd(
        context,
      )
    ){

      events.push(

        EventFactory.create(
          "ending",
          null,
          NarrativePriority.Ending,
        ),

      )

    }



    console.log(
      "EVENTS",
      events,
    )



    return events.sort(

      (a,b)=>
        a.priority - b.priority,

    )

  }





  private static shouldDescribeEmotion(
    context: WriterContext,
    emotion:number,
  ){

    if(
      PersonalityEngine.isIntrospective(
        context.personality,
      )
    ){

      return true

    }


    return emotion >= 20

  }





  private static shouldSpeak(
    context:WriterContext,
  ){

    if(
      !context.allowDialogue
    ){

      return false

    }


    if(
      context.decision.action !== "talk"
    ){

      return false

    }


    return PersonalityEngine.isSociable(
      context.personality,
    )

  }





  private static shouldEnd(
    context:WriterContext,
  ){

    if(
      context.decision.action === "attack"
    ){

      return false

    }


    if(
      PersonalityEngine.isImpulsive(
        context.personality,
      )
    ){

      return false

    }


    return true

  }

}