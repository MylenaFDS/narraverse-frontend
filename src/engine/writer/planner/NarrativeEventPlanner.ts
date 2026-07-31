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



    // ======================================
    // Emoção dominante
    // ======================================

    const dominantEmotion =
      Object.entries(
        context.emotion ?? {},
      )
      .sort(
        (a,b) =>
          Number(b[1]) -
          Number(a[1]),
      )[0]?.[0]
      ??
      "trust"



    const emotionValue =
      Number(
        context.emotion?.[
          dominantEmotion as keyof typeof context.emotion
        ]
        ??
        0
      )



    const action =
      context.decision.action



    // ======================================
    // Análise dramática
    // ======================================

    const tension =
      this.calculateTension(
        context,
        emotionValue,
      )



    const focus =
      this.defineFocus(
        context,
      )



    // ======================================
    // Contexto anterior
    // ======================================

    if(
      context.story.currentSituation
    ){

      events.push(

        EventFactory.create(

          "thought",

          context.story.currentSituation,

          NarrativePriority.Thought,

        )

      )

    }



    // ======================================
    // Localização
    // ======================================

    if(
      context.story.currentLocation
    ){

      events.push(

        EventFactory.create(

          "description",

          `Local atual: ${context.story.currentLocation}`,

          NarrativePriority.Description,

        )

      )

    }



    // ======================================
    // Eventos ativos
    // ======================================

    if(
      context.story.activeEvents.length
    ){

      events.push(

        EventFactory.create(

          "conflict",

          context.story.activeEvents.join(
            ". "
          ),

          NarrativePriority.Conflict,

        )

      )

    }



    // ======================================
    // Fios narrativos abertos
    // ======================================

    if(
      context.story.unresolvedThreads.length
    ){

      events.push(

        EventFactory.create(

          "mystery",

          context.story.unresolvedThreads.join(
            ". "
          ),

          NarrativePriority.Mystery,

        )

      )

    }



    // ======================================
    // Observação
    // ======================================

    if(
      this.shouldObserve(
        context,
        emotionValue,
      )
    ){

      events.push(

        EventFactory.create(

          "observation",

          focus,

          NarrativePriority.Observation,

        )

      )

    }



    // ======================================
    // Estado emocional
    // ======================================

    if(
      this.shouldDescribeEmotion(
        context,
        emotionValue,
      )
    ){

      events.push(

        EventFactory.create(

          "emotion",

          dominantEmotion,

          NarrativePriority.Emotion,

        )

      )

    }



    // ======================================
    // Ação principal
    // ======================================

    if(action){

      events.push(

        EventFactory.create(

          "action",

          action,

          NarrativePriority.Action,

        )

      )

    }



    // ======================================
    // Diálogo
    // ======================================

    if(
      this.shouldSpeak(
        context,
      )
    ){

      events.push(

        EventFactory.create(

          "dialogue",

          context.story.lastDialogue
          ??
          action,

          NarrativePriority.Dialogue,

        )

      )

    }



    // ======================================
    // Consequência futura
    // ======================================

    if(
      tension >= 70
    ){

      events.push(

        EventFactory.create(

          "consequence",

          "As escolhas atuais podem alterar o destino dos próximos acontecimentos.",

          NarrativePriority.Consequence,

        )

      )

    }



    // ======================================
    // Gancho final
    // ======================================

    if(
      this.shouldCreateHook(
        context,
        tension,
      )
    ){

      events.push(

        EventFactory.create(

          "hook",

          "Uma nova possibilidade surge diante do personagem.",

          NarrativePriority.Ending,

        )

      )

    }



    console.log(
      "NARRATIVE EVENTS",
      {
        tension,
        focus,
        events,
      },
    )



    return events.sort(
      (a,b)=>
        a.priority -
        b.priority,
    )

  }







  // ======================================
  // Tensão narrativa
  // ======================================

  private static calculateTension(

    context:WriterContext,

    emotion:number,

  ){

    let value = 0



    value += emotion * 0.4



    value +=
      context.story.activeEvents.length * 10



    value +=
      context.story.unresolvedThreads.length * 8



    if(
      context.decision.action === "attack"
    ){

      value += 30

    }



    if(
      context.decision.action === "investigate"
    ){

      value += 15

    }



    return Math.min(
      100,
      Math.round(value),
    )

  }







  // ======================================
  // Foco narrativo
  // ======================================

  private static defineFocus(
    context:WriterContext,
  ){

    if(
      context.story.focusedCharacter
    ){

      return context.story.focusedCharacter

    }



    if(
      context.character.name
    ){

      return context.character.name

    }



    return "O ambiente ao redor"

  }







  private static shouldObserve(
    context: WriterContext,
    emotion:number,
  ){

    if(
      context.decision.action === "explore"
    ){

      return true

    }


    if(
      PersonalityEngine.isCautious(
        context.personality,
      )
    ){

      return true

    }


    return emotion < 80

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







  private static shouldCreateHook(

    context:WriterContext,

    tension:number,

  ){

    if(
      tension >= 60
    ){

      return true

    }


    if(
      context.story.unansweredQuestions.length
    ){

      return true

    }


    return false

  }



}