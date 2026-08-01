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
      this.extractByType(
        analysis.events,
        "relationship",
      ),



    revelations:
      this.extractRevelations(
        analysis,
      ),



    conflicts:
      this.extractByType(
        analysis.events,
        "attack",
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
// Eventos
// ==================================


private static extractEvents(
  events:StoryEvent[],
):SummaryEvent[]{


  const unique =
    new Map<string,SummaryEvent>()



  const allowedTypes:SummaryEvent["type"][] = [

    "combat",

    "death",

    "relationship",

    "dialogue",

    "quest",

    "discovery",

    "prophecy",

    "emotion",

  ]



  for(
    const event of events
  ){


    if(
      !allowedTypes.includes(
        event.type as SummaryEvent["type"],
      )
    ){

      continue

    }



    const summaryEventType =
      event.type as SummaryEvent["type"]



    const key =
      `${summaryEventType}-${event.description}`



    if(
      unique.has(key)
    ){

      continue

    }



    unique.set(

      key,

      {

        type:
          summaryEventType,


        description:
          event.description,


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









private static extractByType(
 events:StoryEvent[],
 type:StoryEvent["type"],
):string[]{


 return events

   .filter(
     event =>
       event.type === type
   )

   .map(
     event =>
       event.description
   )

   .filter(
     (value,index,array)=>
       array.indexOf(value) === index
   )


}









private static extractRevelations(
 analysis:StoryAnalysis,
):string[]{


 return analysis.events

   .filter(
     event =>
       event.type === "prophecy"
       ||
       event.type === "discovery"
   )

   .map(
     event =>
       event.description
   )


}









private static generateConsequences(
 analysis:StoryAnalysis,
):string[]{


 const consequences:string[]=[]



 if(
   analysis.events.some(
     e =>
       e.type==="death"
   )
 ){

   consequences.push(

     "A perda de um personagem importante alterou o equilíbrio da história."

   )

 }



 if(
   analysis.unresolvedThreads.length
 ){

   consequences.push(

     "Existem acontecimentos pendentes que podem influenciar o futuro da campanha."

   )

 }



 return consequences


}









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


    default:
      return "low"

  }


}



}