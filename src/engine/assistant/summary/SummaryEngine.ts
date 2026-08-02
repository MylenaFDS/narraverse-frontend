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


  // ==================================
  // Contexto
  // ==================================

  situation:
    analysis.currentSituation
    ??
    "A história continua em desenvolvimento.",



  location:
    analysis.currentLocation
    ??
    null,



  atmosphere:
    analysis.sceneMood
    ??
    "neutro",



  tension:
    analysis.narrativeTension
    ??
    0,



  // ==================================
  // Eventos
  // ==================================

  majorEvents:

    this.extractEvents(
      analysis.events,
    ),



  // ==================================
  // Desenvolvimento
  // ==================================

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



  quests:

    [
      ...analysis.activeQuests,
    ],



  unresolvedThreads:

    [
      ...analysis.unresolvedThreads,
    ],



  unansweredQuestions:

    [
      ...analysis.unansweredQuestions,
    ],



  // ==================================
  // Personagens
  // ==================================

  characters:

    [
      ...analysis.activeCharacters,
    ],



  focusedCharacter:

    analysis.focusedCharacter,



  // ==================================
  // Consequências
  // ==================================

  consequences:

    this.generateConsequences(
      analysis,
    ),



  // ==================================
  // Elementos narrativos
  // ==================================

  themes:

    this.extractThemes(
      analysis,
    ),



  narrativeHooks:

    this.generateHooks(
      analysis,
    ),


 }


}









// ======================================
// Conversão EventType -> SummaryEventType
// ======================================


private static normalizeEventType(
 type:StoryEvent["type"],
):SummaryEvent["type"] | null {


 switch(type){


  // ======================================
  // Combate
  // ======================================

  case "attack":
  case "defense":
  case "combat":
  case "victory":
  case "defeat":
  case "retreat":
  case "siege":
  case "ambush":
  case "duel":

    return "combat"



  // ======================================
  // Personagens
  // ======================================

  case "death":

    return "death"



  // ======================================
  // Relações
  // ======================================

  case "relationship":
  case "friendship":
  case "marriage":
  case "reconciliation":

    return "relationship"



  case "alliance":

    return "alliance"



  case "betrayal":

    return "betrayal"



  // ======================================
  // Conversas
  // ======================================

  case "dialogue":
  case "conversation":
  case "speech":
  case "promise":
  case "threat":

    return "dialogue"



  // ======================================
  // Missões
  // ======================================

  case "quest":
  case "objective":
  case "questComplete":
  case "questFailed":

    return "quest"



  case "achievement":

    return "achievement"



  // ======================================
  // Exploração
  // ======================================

  case "movement":
  case "travel":
  case "exploration":
  case "location":

    return "movement"



  case "discovery":

    return "discovery"



  // ======================================
  // Lore
  // ======================================

  case "prophecy":
  case "revelation":
  case "legend":
  case "history":
  case "lore":

    return "prophecy"



  // ======================================
  // Política
  // ======================================

  case "political":
  case "coronation":
  case "war":
  case "peace":
  case "treaty":
  case "rebellion":

    return "political"



  // ======================================
  // Estado narrativo
  // ======================================

  case "emotion":
  case "decision":
  case "memory":

    return "emotion"



  default:

    return null


 }


}









// ======================================
// Peso narrativo
// ======================================


private static calculateNarrativeWeight(
 type:SummaryEvent["type"],
):number{


 switch(type){


  case "death":

    return 100



  case "betrayal":

    return 95



  case "prophecy":

    return 90



  case "political":
  case "alliance":

    return 75



  case "relationship":

    return 60



  case "achievement":

    return 55



  case "quest":

    return 45



  case "discovery":

    return 40



  case "combat":

    return 35



  case "dialogue":

    return 25



  case "emotion":

    return 20



  case "movement":

    return 10



  default:

    return 0


 }


}









// ======================================
// Extração de eventos
// ======================================


private static extractEvents(
 events:StoryEvent[],
):SummaryEvent[]{


 const unique =
   new Map<string,SummaryEvent>()



 for(
  const event of events
 ){


  const type =
    this.normalizeEventType(
      event.type,
    )



  if(!type){

    continue

  }



  const description =
    this.normalizeDescription(
      event.description,
    )



  const key =
    `${type}-${description}`



  if(
    unique.has(key)
  ){

    continue

  }



  unique.set(

   key,

   {


    type,


    importance:

      this.calculateImportance(
        type,
      ),



    narrativeWeight:

      this.calculateNarrativeWeight(
        type,
      ),



    description,



    actor:
      event.actorName,



    target:
      event.targetName,



    participants:
      event.participants,



    location:
      event.location,



    faction:
      event.faction,



    item:
      event.item,



    consequence:
      event.consequence,



    tags:
      event.tags ?? [],


   }

  )


 }



 return [

  ...unique.values(),

 ]

 .sort(

  (a,b)=>

   b.narrativeWeight -
   a.narrativeWeight

 )


}









// ======================================
// Importância
// ======================================


private static calculateImportance(
 type:SummaryEvent["type"],
):SummaryEvent["importance"]{


 switch(type){


  case "death":
  case "betrayal":
  case "prophecy":

    return "critical"



  case "political":
  case "alliance":
  case "relationship":
  case "discovery":

    return "high"



  case "dialogue":
  case "quest":
  case "achievement":

    return "medium"



  default:

    return "low"


 }


}









// ======================================
// Textos únicos
// ======================================


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









// ======================================
// Revelações
// ======================================


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

      event.type === "revelation"

      ||

      (
        event.type === "discovery"

        &&

        !event.description
        .toLowerCase()
        .startsWith(
          "local importante",
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









// ======================================
// Consequências
// ======================================


private static generateConsequences(
 analysis:StoryAnalysis,
):string[]{


 const result:string[]=[]



 if(

  analysis.events.some(
    event =>
      event.type === "death"
  )

 ){

  result.push(

   "A perda de personagens importantes alterou o equilíbrio da narrativa e poderá influenciar decisões futuras."

  )

 }



 if(
  analysis.unresolvedThreads.length
 ){

  result.push(

   "Existem acontecimentos pendentes que permanecem como possíveis caminhos para os próximos capítulos."

  )

 }



 return [

  ...new Set(
    result,
  )

 ]

}









// ======================================
// Normalização
// ======================================


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









// ======================================
// Temas
// ======================================


private static extractThemes(
 analysis:StoryAnalysis,
):string[]{


 const themes:string[]=[]



 if(
  analysis.events.some(
   e=>e.type==="death"
  )
 ){

  themes.push(
   "perda",
  )

 }



 if(
  analysis.events.some(
   e =>
    e.type==="prophecy"
    ||
    e.type==="revelation"
    ||
    e.type==="discovery"
  )
 ){

  themes.push(
   "mistério",
  )

 }



 if(
  analysis.events.some(
   e=>e.type==="relationship"
  )
 ){

  themes.push(
   "relações",
  )

 }



 if(
  analysis.events.some(
   e=>e.type==="combat"
  )
 ){

  themes.push(
   "conflito",
  )

 }



 return [

  ...new Set(
    themes,
  )

 ]

}









// ======================================
// Ganchos futuros
// ======================================


private static generateHooks(
 analysis:StoryAnalysis,
):string[]{


 const hooks:string[]=[]



 if(
  analysis.unresolvedThreads.length
 ){

  hooks.push(
   "mistérios ainda não resolvidos",
  )

 }



 if(
  analysis.activeQuests.length
 ){

  hooks.push(
   "objetivos pendentes",
  )

 }



 if(
  analysis.unansweredQuestions.length
 ){

  hooks.push(
   "questões sem resposta",
  )

 }



 return [

  ...new Set(
   hooks,
  )

 ]

}


}