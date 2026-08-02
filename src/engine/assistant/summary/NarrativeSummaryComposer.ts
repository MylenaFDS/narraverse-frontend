import type {
  SummaryData,
} from "./SummaryData"



export class NarrativeSummaryComposer {



static compose(
  data:SummaryData,
):string{


 const paragraphs:string[]=[]



 paragraphs.push(
  this.composeOpening(
    data,
  )
 )



 const importantEvents =

  data.majorEvents

   .filter(

    event =>
      event.importance !== "low"

   )

   .sort(

    (a,b)=>
      b.narrativeWeight -
      a.narrativeWeight

   )




 if(
  importantEvents.length
 ){

  paragraphs.push(

   this.composeEvents(
    importantEvents,
   )

  )

 }





 if(
  data.dominantEmotion
 ){

  paragraphs.push(

   `O clima atual da narrativa é marcado por ${data.dominantEmotion}, influenciando as escolhas e reações dos personagens.`

  )

 }





 if(
  data.relationships.length
 ){

  paragraphs.push(

   `Os vínculos entre os personagens passaram por transformações importantes, criando novas possibilidades de alianças, conflitos ou mudanças de perspectiva.`

  )

 }





 if(
  data.objectives.length ||
  data.quests.length
 ){

  paragraphs.push(

   this.composeObjectives(
    data,
   )

  )

 }





 if(
  data.consequences.length
 ){

  paragraphs.push(

   this.unique(
    data.consequences,
   )
   .join(" ")

  )

 }





 if(
  data.characters.length
 ){

  paragraphs.push(

   `Entre os personagens envolvidos estão ${this.unique(data.characters).slice(0,5).join(", ")}, cujas escolhas poderão influenciar diretamente o futuro da campanha.`

  )

 }





 if(
  data.narrativeHooks.length
 ){

  paragraphs.push(

   `Novos caminhos podem surgir a partir de ${this.unique(data.narrativeHooks).join(", ")}.`

  )

 }





 return paragraphs

  .filter(
   text =>
    text.trim().length > 0
  )

  .join(

   "\n\n"

  )


}









// ======================================
// Abertura
// ======================================

private static composeOpening(
 data:SummaryData,
):string{


 const location =

  data.location

   ?

   ` em ${this.capitalize(data.location)}`

   :

   ""




 return (

  `A campanha atravessa um momento decisivo${location}, onde acontecimentos recentes começam a transformar profundamente o destino da jornada.`

 )


}









// ======================================
// Eventos
// ======================================

private static composeEvents(
 events:SummaryData["majorEvents"],
):string{


 const groups = {


  death:[] as string[],

  prophecy:[] as string[],

  alliance:[] as string[],

  relationship:[] as string[],

  discovery:[] as string[],

  dialogue:[] as string[],

  other:[] as string[],


 }



 for(
  const event of events
 ){


  const text =
   this.cleanEvent(
    event.description,
   )



  switch(event.type){


   case "death":

    groups.death.push(
     text,
    )

    break



   case "prophecy":

    groups.prophecy.push(
     text,
    )

    break



   case "alliance":

    groups.alliance.push(
     text,
    )

    break



   case "relationship":

    groups.relationship.push(
     text,
    )

    break



   case "discovery":

    groups.discovery.push(
     text,
    )

    break



   case "dialogue":

    groups.dialogue.push(
     text,
    )

    break



   default:

    groups.other.push(
     text,
    )


  }


 }





 const result:string[]=[]




 if(
  groups.death.length
 ){

  result.push(

   `${this.unique(groups.death).join(", ")}. Essa perda representa uma ruptura significativa na história, alterando escolhas, relações e caminhos futuros.`

  )

 }





 if(
  groups.prophecy.length
 ){

  result.push(

   `${this.unique(groups.prophecy).join(", ")}. A revelação indica que acontecimentos atuais podem estar ligados a forças maiores ou destinos ainda desconhecidos.`

  )

 }





 if(
  groups.alliance.length
 ){

  result.push(

   `${this.unique(groups.alliance).join(", ")}. Novas alianças foram estabelecidas, alterando o equilíbrio de forças da campanha.`

  )

 }





 if(
  groups.relationship.length
 ){

  result.push(

   `${this.unique(groups.relationship).join(", ")}. Essas mudanças influenciam os vínculos e decisões futuras dos personagens.`

  )

 }





 if(
  groups.discovery.length
 ){

  result.push(

   `${this.unique(groups.discovery).join(", ")}. Essas descobertas adicionam novos elementos capazes de mudar o rumo da campanha.`

  )

 }





 if(
  groups.dialogue.length
 ){

  result.push(

   `Conversas importantes revelaram novas perspectivas entre os envolvidos.`

  )

 }





 return result.join(" ")


}









// ======================================
// Objetivos
// ======================================

private static composeObjectives(
 data:SummaryData,
):string{


 const items =

  this.unique(

   [

    ...data.objectives,

    ...data.quests,

   ]

  )



 if(
  !items.length
 ){

  return ""

 }



 return (

  `Os próximos passos da campanha envolvem ${items.join(", ")}.`

 )


}









// ======================================
// Limpeza de eventos
// ======================================

private static cleanEvent(
 text:string,
):string{


 return text

  .replace(
   /^Um diálogo importante ocorreu\.?/i,
   "",
  )

  .replace(
   /^Local importante identificado:\s*/i,
   "",
  )

  .trim()


}









// ======================================
// Utilidades
// ======================================

private static unique(
 values:string[],
):string[]{


 return [

  ...new Set(

   values

  )

 ]

}









private static capitalize(
 value:string,
):string{


 return (

  value.charAt(0).toUpperCase()

  +

  value.slice(1)

 )

}



}