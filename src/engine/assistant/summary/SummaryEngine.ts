import type {
  StoryAnalysis,
} from "../analysis/StoryAnalysis"


import type {
  StoryEvent,
} from "../state/events/StoryEvent"


import type {
  SummaryData,
} from "./SummaryData"


import type {
  SummaryEvent,
} from "./SummaryEvent"




export class SummaryEngine {



static build(
  analysis:StoryAnalysis,
):SummaryData{


  return {


    location:
      analysis.currentLocation
      ??
      null,



    atmosphere:
      analysis.sceneMood
      ??
      null,



    majorEvents:
      this.extractEvents(
        analysis.events,
      ),



    relationships:
      this.extractUniqueDescriptions(
        analysis.events,
        "relationship",
      ),



    revelations:
      this.extractRevelations(
        analysis,
      ),



    conflicts:
  this.extractUniqueDescriptions(
    analysis.events,
    "combat",
  ),



    objectives:
      [
        ...analysis.activeObjectives,
      ],



    characters:
      [
        ...analysis.activeCharacters,
      ],



    consequences:
      this.generateConsequences(
        analysis,
      ),


  }


}







// ==================================
// Eventos principais
// ==================================


private static extractEvents(
  events:StoryEvent[],
):SummaryEvent[]{


  const unique =
    new Map<string,SummaryEvent>()


  const allowed = [
  "combat",
  "death",
  "relationship",
  "dialogue",
  "quest",
  "discovery",
  "prophecy",
  "emotion",
] as SummaryEvent["type"][]




  for(
    const event of events
  ){


    if(
      !allowed.includes(
        event.type as SummaryEvent["type"],
      )
    ){

      continue

    }



    const type =
      event.type as SummaryEvent["type"]




    const normalized =
      this.normalizeDescription(
        event.description,
      )



    const key =
      `${type}-${normalized}`




    if(
      unique.has(key)
    ){

      continue

    }




    unique.set(

      key,

      {

        type,

        description:
          normalized,

        importance:
          this.calculateImportance(
            event,
          ),

      }

    )


  }




  return [
    ...unique.values(),
  ]


}









// ==================================
// Remover duplicados
// ==================================


private static extractUniqueDescriptions(
 events:StoryEvent[],
 type:StoryEvent["type"],
):string[]{



 return [

   ...new Set(

    events

    .filter(
      event =>
        event.type === type
    )

    .map(
      event =>
        this.normalizeDescription(
          event.description,
        )
    )

   )

 ]


}









// ==================================
// Revelações
// ==================================


private static extractRevelations(
  analysis:StoryAnalysis,
):string[]{


 return [

  ...new Set(

   analysis.events

    .filter(

      event =>

        event.type === "prophecy"

        ||

        (
          event.type === "discovery"

          &&

          !event.description
            .toLowerCase()
            .startsWith(
              "local importante"
            )

        )

    )

    .map(

      event =>

        this.normalizeDescription(
          event.description,
        )

    )

  )

 ]

}









// ==================================
// Consequências
// ==================================


private static generateConsequences(
 analysis:StoryAnalysis,
):string[]{


 const consequences:string[]=[]



 if(

  analysis.events.some(

   event =>
    event.type==="death"

  )

 ){


   consequences.push(
 "A ausência de personagens importantes continuará influenciando os próximos acontecimentos da campanha."
)

  

 }



 if(

  analysis.unresolvedThreads.length

 ){

  consequences.push(

   "Existem mistérios e acontecimentos pendentes que podem influenciar os próximos capítulos."

  )

 }



 return [

  ...new Set(
    consequences
  )

 ]


}









// ==================================
// Importância
// ==================================


private static calculateImportance(
  event:StoryEvent,
):SummaryEvent["importance"]{


  switch(event.type){


    case "death":
      return "high"


    case "prophecy":
      return "high"



    case "relationship":
      return "medium"


    case "discovery":
      return "medium"


    case "dialogue":
      return "medium"



    default:
      return "low"


  }


}









// ==================================
// Limpeza narrativa
// ==================================


private static normalizeDescription(
 text:string,
):string{


 return text

  .replace(
    /\.$/,
    "",
  )

  .replace(
    /^Local importante identificado:\s*/i,
    "",
  )

  .replace(
    /^Um diálogo importante ocorreu\.\s*/i,
    "",
  )

  .trim()


}



}