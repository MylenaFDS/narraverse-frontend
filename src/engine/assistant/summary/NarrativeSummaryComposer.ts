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

   `A campanha atravessa um momento decisivo em ${this.capitalize(data.location)}, onde acontecimentos recentes começam a transformar profundamente o destino da jornada.`

  )

 }




 // ==================================
 // Eventos importantes
 // ==================================


 const events =
   data.majorEvents
     .filter(
       event =>
        event.importance !== "low"
     )



 const deaths =
   events.filter(
     event =>
      event.type === "death"
   )



 const revelations =
   events.filter(
     event =>
      event.type === "prophecy" ||
      event.type === "discovery"
   )



 const relationships =
   events.filter(
     event =>
      event.type === "relationship"
   )



 const dialogues =
   events.filter(
     event =>
      event.type === "dialogue"
   )





 // ==================================
 // Perdas
 // ==================================


 if(
  deaths.length
 ){


  paragraphs.push(

   deaths
    .map(
     event =>
      `${event.description}. Essa perda representa uma ruptura profunda na história, alterando alianças, objetivos e o caminho daqueles que permanecem na jornada.`
    )
    .join(" ")

  )


 }




 // ==================================
 // Revelações
 // ==================================


 if(
  revelations.length
 ){


  paragraphs.push(

   `Novas revelações surgiram durante a jornada: ${
    this.unique(
      revelations.map(
       e=>e.description
      )
    ).join(", ")
   }. Esses acontecimentos sugerem que forças maiores podem estar conectadas ao destino dos personagens.`

  )


 }





 // ==================================
 // Relações
 // ==================================


 if(
  relationships.length
 ){


  paragraphs.push(

   `Os vínculos entre os personagens passaram por mudanças importantes, criando novas possibilidades de alianças, conflitos e escolhas difíceis.`

  )


 }




 // ==================================
 // Diálogo
 // ==================================


 if(
  dialogues.length
 ){


  paragraphs.push(

   `Conversas importantes revelaram novas perspectivas entre os envolvidos, trazendo informações capazes de influenciar os próximos acontecimentos.`

  )


 }




 // ==================================
 // Consequências
 // ==================================


 if(
  data.consequences.length
 ){


  paragraphs.push(

   this.unique(
    data.consequences
   ).join(" ")

  )


 }




 // ==================================
 // Personagens
 // ==================================


 if(
  data.characters.length
 ){


  paragraphs.push(

   `Entre os personagens envolvidos estão ${data.characters.slice(0,4).join(", ")}, cujas decisões poderão definir o futuro da campanha.`

  )


 }





 return paragraphs.join(
  "\n\n"
 )


}







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