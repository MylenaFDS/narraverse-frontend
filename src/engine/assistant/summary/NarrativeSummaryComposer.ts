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
 data.consequences.length &&
 !importantEvents.some(
  event =>
   event.type === "death"
 )
){

 paragraphs.push(

  this.unique(
   data.consequences,
  ).join(" ")

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

  betrayal:[] as string[],

  prophecy:[] as string[],

  alliance:[] as string[],

  relationship:[] as string[],

  discovery:[] as string[],

  combat:[] as string[],

  dialogue:[] as string[],

  quest:[] as string[],

  achievement:[] as string[],

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


    // ==================================
    // Perdas irreversíveis
    // ==================================

    case "death":

      groups.death.push(
        text,
      )

      break



    // ==================================
    // Traições
    // ==================================

    case "betrayal":

      groups.betrayal.push(
        text,
      )

      break



    // ==================================
    // Revelações
    // ==================================

    case "prophecy":

      groups.prophecy.push(
        text,
      )

      break



    // ==================================
    // Alianças
    // ==================================

    case "alliance":

      groups.alliance.push(
        text,
      )

      break



    // ==================================
    // Relações
    // ==================================

    case "relationship":

      groups.relationship.push(
        text,
      )

      break



    // ==================================
    // Descobertas
    // ==================================

case "discovery": {

  const ignoredLocations = [

    "gondor",

    "mordor",

    "condado",

    "rivendell",

  ]



  if(

    text.length > 5

    &&

    !ignoredLocations.includes(
      text.toLowerCase(),
    )

  ){

    groups.discovery.push(
      text,
    )

  }


  break

}
    // ==================================
    // Conflitos
    // ==================================

    case "combat":

      groups.combat.push(
        text,
      )

      break



    // ==================================
    // Conversas
    // ==================================

    case "dialogue":

      groups.dialogue.push(
        text,
      )

      break



    // ==================================
    // Progressão
    // ==================================

    case "quest":

      groups.quest.push(
        text,
      )

      break



    case "achievement":

      groups.achievement.push(
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





 // ==================================
 // Mortes
 // ==================================

 if(
  groups.death.length
 ){

  result.push(

   `${this.unique(groups.death).join(", ")}. Essa perda representa uma ruptura significativa na história, alterando escolhas, relações e caminhos futuros.`

  )

 }





 // ==================================
 // Traições
 // ==================================

 if(
  groups.betrayal.length
 ){

  result.push(

   `${this.unique(groups.betrayal).join(", ")}. Essa traição alterou a confiança entre os envolvidos e poderá gerar novos conflitos.`

  )

 }





 // ==================================
 // Profecias
 // ==================================

 if(
  groups.prophecy.length
 ){

  result.push(

   `${this.unique(groups.prophecy).join(", ")}. A revelação indica que acontecimentos atuais podem estar ligados a forças maiores ou destinos ainda desconhecidos.`

  )

 }





 // ==================================
 // Alianças
 // ==================================

 if(
  groups.alliance.length
 ){

  result.push(

   `${this.unique(groups.alliance).join(", ")}. Novas alianças foram estabelecidas, alterando o equilíbrio de forças da campanha.`

  )

 }





 // ==================================
 // Relações
 // ==================================

 if(
  groups.relationship.length
 ){

  result.push(

   `${this.unique(groups.relationship).join(", ")}. Essas mudanças influenciam os vínculos e decisões futuras dos personagens.`

  )

 }





 // ==================================
 // Descobertas
 // ==================================

 if(
  groups.discovery.length
 ){

  result.push(

   `${this.unique(groups.discovery).join(", ")}. Essas descobertas adicionam novos elementos capazes de mudar o rumo da campanha.`

  )

 }





 // ==================================
 // Combates
 // ==================================

 if(
  groups.combat.length
 ){

  result.push(

   `${this.unique(groups.combat).join(", ")}. Esses conflitos aumentaram a tensão da campanha e podem alterar os próximos acontecimentos.`

  )

 }





 // ==================================
 // Diálogos
 // ==================================

 if(
  groups.dialogue.length
 ){

  const dialogues =
 this.unique(
  groups.dialogue,
 )


.filter(
 text =>
  text.length > 0
)



if(
 dialogues.length
){

 result.push(

  `${dialogues.join(", ")}. Essas conversas revelaram novas perspectivas entre os envolvidos.`

 )

}

 }





 // ==================================
 // Missões
 // ==================================

 if(
  groups.quest.length ||
  groups.achievement.length
 ){

  result.push(

   `Novos avanços foram realizados: ${this.unique([
    ...groups.quest,
    ...groups.achievement,
   ]).join(", ")}.`

  )

 }





 // ==================================
 // Outros
 // ==================================

 if(
  groups.other.length
 ){

  result.push(

   this.unique(
    groups.other,
   ).join(", ")

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

  // remove eventos genéricos de diálogo

  .replace(
    /^Um diálogo importante ocorreu\.?/i,
    "",
  )


  // remove prefixos de localização

  .replace(
    /^Local importante identificado:\s*/i,
    "",
  )


  // remove frases vazias de sistema

  .replace(
    /^Uma profecia ou destino foi revelado\.?/i,
    "Uma profecia ou destino foi revelado",
  )


  // remove vírgulas antes de pontuação

  .replace(
    /,\s*\./g,
    ".",
  )


  // remove espaços duplicados

  .replace(
    /\s+/g,
    " ",
  )


  // remove pontos repetidos

  .replace(
    /\.{2,}/g,
    ".",
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
    values,
  )

 ]


}













// ======================================
// Capitalização
// ======================================

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