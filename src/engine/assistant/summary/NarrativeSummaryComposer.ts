import type {
 SummaryData,
} from "./SummaryData"





export class NarrativeSummaryComposer {



static compose(
 data:SummaryData,
):string{


 const paragraphs:string[]=[]




 // ==================================
 // Abertura
 // ==================================


 if(data.location){


 paragraphs.push(

 `A campanha atravessa um momento decisivo em ${data.location}.`

 )



 }






 // ==================================
 // Eventos principais
 // ==================================


 const important =
   data.majorEvents.filter(
     event =>
       event.importance !== "low"
   )



 if(
   important.length
 ){


 paragraphs.push(

 this.composeEvents(
   important,
 )

 )


 }








 // ==================================
 // Revelações
 // ==================================


 if(
   data.revelations.length
 ){


 paragraphs.push(

 `Novas revelações surgiram: ${data.revelations.join(", ")}.`

 )


 }









 // ==================================
 // Relações
 // ==================================


 if(
   data.relationships.length
 ){


 paragraphs.push(

 `Os vínculos entre os personagens passaram por mudanças importantes, podendo criar novas alianças ou futuros conflitos.`

 )


 }









 // ==================================
 // Consequências
 // ==================================


 if(
   data.consequences.length
 ){


 paragraphs.push(

 data.consequences.join(" ")

 )


 }







 // ==================================
 // Personagens
 // ==================================


 if(
   data.characters.length
 ){


 paragraphs.push(

 `Entre os personagens envolvidos estão ${data.characters.slice(0,4).join(", ")}.`

 )


 }






 return paragraphs.join(
   "\n\n",
 )


}









private static composeEvents(
 events:SummaryData["majorEvents"],
):string{


 return events
   .map(event=>{


    switch(event.type){


    case "death":

      return (

      `${event.description} Essa perda representa uma ruptura significativa nos acontecimentos atuais.`

      )



    case "prophecy":

      return (

      `${event.description} O destino dos personagens parece estar ligado a forças maiores.`

      )



    case "dialogue":

      return (

      `${event.description} Esse momento revelou novas perspectivas entre os envolvidos.`

      )



    default:

      return event.description


    }


   })

   .join(" ")


}



}