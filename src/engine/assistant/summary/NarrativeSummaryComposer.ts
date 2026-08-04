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



 if(
  data.atmosphere
 ){

  paragraphs.push(

   `O ambiente é marcado por ${data.atmosphere}, criando o cenário emocional que envolve os acontecimentos recentes.`

  )

 }



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

   `O clima atual da narrativa é marcado por ${data.dominantEmotion}, influenciando as escolhas, reações e decisões dos personagens.`

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

  .map(
    text =>
      text.trim()
  )

  .filter(
    text =>
      text.length > 0
  )

  .filter(
    (text,index,array)=>
      array.indexOf(text) === index
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



  if(
    !text
  ){

    continue

  }



  switch(event.type){


    case "death":

      groups.death.push(
        text,
      )

      break



    case "betrayal":

      groups.betrayal.push(
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



    case "discovery": {


      const ignoredLocations = new Set([

        "gondor",
        "mordor",
        "condado",
        "rivendell",

      ])



      const normalized =

        text
          .toLowerCase()
          .trim()



      if(

        text.length > 5

        &&

        !ignoredLocations.has(
          normalized,
        )

      ){

        groups.discovery.push(
          text,
        )

      }



      break

    }



    case "combat":

      groups.combat.push(
        text,
      )

      break



    case "dialogue":

      groups.dialogue.push(
        text,
      )

      break



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

    this.narrativeSentence(

      this.unique(
        groups.death,
      ).join(", "),

      "Essa perda representa uma ruptura significativa na história, alterando escolhas, relações e caminhos futuros."

    )

  )

 }





 // ==================================
 // Traições
 // ==================================

 if(
  groups.betrayal.length
 ){

  result.push(

    this.narrativeSentence(

      this.unique(
        groups.betrayal,
      ).join(", "),

      "Essa traição abalou a confiança entre os envolvidos e poderá gerar novos conflitos."

    )

  )

 }





 // ==================================
 // Profecias
 // ==================================

 if(
  groups.prophecy.length
 ){

  result.push(

    this.narrativeSentence(

      this.unique(
        groups.prophecy,
      ).join(", "),

      "A revelação amplia o mistério da campanha e sugere que os acontecimentos atuais fazem parte de um destino maior ainda desconhecido."

    )

  )

 }





 // ==================================
 // Alianças
 // ==================================

 if(
  groups.alliance.length
 ){

  result.push(

    this.narrativeSentence(

      this.unique(
        groups.alliance,
      ).join(", "),

      "Essa aliança alterou o equilíbrio de forças da campanha e ampliou as possibilidades de cooperação entre os envolvidos."

    )

  )

 }





 // ==================================
 // Relações
 // ==================================

 if(
  groups.relationship.length
 ){

  result.push(

    this.narrativeSentence(

      this.unique(
        groups.relationship,
      ).join(", "),

      "Essa evolução fortaleceu os vínculos entre os personagens e poderá influenciar decisões importantes nos próximos acontecimentos."

    )

  )

 }





 // ==================================
 // Descobertas
 // ==================================

 if(
  groups.discovery.length
 ){

  result.push(

    this.narrativeSentence(

      this.unique(
        groups.discovery,
      ).join(", "),

      "Essas descobertas ampliam o conhecimento sobre o mundo e podem transformar completamente os rumos da campanha."

    )

  )

 }





 // ==================================
 // Combates
 // ==================================

 if(
  groups.combat.length
 ){

  result.push(

    this.narrativeSentence(

      this.unique(
        groups.combat,
      ).join(", "),

      "Esses conflitos elevaram a tensão da narrativa e poderão desencadear novos acontecimentos."

    )

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



  result.push(

    this.narrativeSentence(

      dialogues.join(", "),

      "Esses diálogos revelaram novas perspectivas entre os personagens e poderão influenciar os acontecimentos seguintes da jornada."

    )

  )

 }





 // ==================================
 // Missões
 // ==================================

 if(
  groups.quest.length ||
  groups.achievement.length
 ){

  result.push(

    `Novos avanços foram realizados: ${
      
      this.unique([
        ...groups.quest,
        ...groups.achievement,
      ])
      .join(", ")

    }.`

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
    )
    .join(", ")

  )

 }





 return result.join("\n\n")


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

// ======================================
// Limpeza de eventos
// ======================================

private static cleanEvent(
  text:string,
):string{


 return text

  // remove prefixos automáticos

  .replace(
    /^Evento identificado:\s*/i,
    "",
  )


  // remove eventos genéricos

  .replace(
    /^Um diálogo importante ocorreu\.?/i,
    "",
  )


  .replace(
    /^Uma relação pessoal evoluiu\.?/i,
    "Uma relação pessoal evoluiu",
  )


  .replace(
    /^Uma aliança foi fortalecida\.?/i,
    "Uma aliança foi fortalecida",
  )


  // remove localização criada pelo sistema

  .replace(
    /^Local importante identificado:\s*/i,
    "",
  )


  // normaliza profecia

  .replace(
    /^Uma profecia ou destino foi revelado\.?/i,
    "Uma profecia ou destino foi revelado",
  )


  // remove espaços duplicados

  .replace(
    /\s+/g,
    " ",
  )


  // remove pontuação duplicada

  .replace(
    /\.{2,}/g,
    ".",
  )


  // corrige vírgulas antes de ponto

  .replace(
    /,\s*\./g,
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

// ======================================
// Construção narrativa
// ======================================

private static narrativeSentence(
  text:string,
  context:string,
):string{

  return `${text}. ${context}`

}

}
