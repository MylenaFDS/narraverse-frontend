import type { NarrativeEvent } from "./planner/NarrativeEvent"
import type { NarrativeFragment } from "./planner/NarrativeFragment"

import type { StoryContext } from "./story/types/StoryContext"


import { ActionLibrary } from "./libraries/ActionLibrary"
import { ConnectorLibrary } from "./libraries/ConnectorLibrary"
import { DialogueLibrary } from "./libraries/DialogueLibrary"
import { EmotionLibrary } from "./libraries/EmotionLibrary"
import { EndingLibrary } from "./libraries/EndingLibrary"



export class LibraryManager {

  static compose(

    events: NarrativeEvent[],

    story: StoryContext,

    

  ): NarrativeFragment[] {



    const fragments: NarrativeFragment[] = []



    for(
      const event of events
    ){



      switch(event.type){



        // ======================================
        // História anterior
        // ======================================

        case "thought":


          if(
            story.currentSituation
          ){

            fragments.push({

              type:"thought",

              text:
                `Ainda carregava comigo ${story.currentSituation}.`

            })

          }


          break





        // ======================================
        // Eventos ativos
        // ======================================

        case "description":


          if(
            story.activeEvents.length
          ){

            fragments.push({

              type:"description",

              text:
                story.activeEvents.join(
                  ". "
                )

            })

          }


          break





        // ======================================
        // Observação
        // ======================================

        case "observation":


          fragments.push({

            type:"observation",

            text:
              ConnectorLibrary.randomObservation(),

          })


          break





        // ======================================
        // Emoção
        // ======================================

        case "emotion":


          fragments.push({

            type:"emotion",

            text:
              EmotionLibrary.random(
                String(event.payload),
              ),

          })


          break





        // ======================================
        // Ação
        // ======================================

        case "action":


          fragments.push({

            type:"action",

            text:
              ActionLibrary.random(
                String(event.payload),
              ),

          })


          break





        // ======================================
        // Diálogo
        // ======================================

        case "dialogue":


  fragments.push({

    type:"dialogue",

    text:
      DialogueLibrary.random(
        String(event.payload),
        
      ),

  })


break


        // ======================================
        // Encerramento
        // ======================================

        case "ending":


          fragments.push({

            type:"ending",

            text:
              EndingLibrary.random(),

          })


          break


      }


    }



    console.log(
      "FRAGMENTS",
      fragments,
    )



    return fragments

  }


}