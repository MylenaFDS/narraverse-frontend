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
  data.atmosphere ||
  data.dominantEmotion
){

  const atmosphere =
    data.atmosphere ??
    data.dominantEmotion

  const emotion =
    data.dominantEmotion

  paragraphs.push(

    emotion

      ? `A narrativa assume um tom ${atmosphere}, criando um clima de ${emotion} que influencia diretamente as escolhas, reações e decisões dos personagens.`

      : `A narrativa assume um tom ${atmosphere}, intensificando a tensão e envolvendo os personagens em um cenário de mudanças decisivas.`

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

  const chars =
    this.unique(
      data.characters,
    ).slice(0, 5)

  paragraphs.push(

    `Os acontecimentos recentes colocam ${this.naturalList(chars)} no centro da narrativa, tornando suas próximas escolhas decisivas para o futuro da campanha.`

  )

}





if(
  data.narrativeHooks.length
){

  paragraphs.push(

    `Os acontecimentos recentes indicam que a campanha entrou em uma nova fase. Questões como ${this.unique(data.narrativeHooks).join(", ")} poderão definir os próximos rumos da jornada.`

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
  data: SummaryData,
): string {

  const location =
    data.location
      ? ` em ${this.capitalize(data.location)}`
      : ""

  const phase = {

    opening:
      "A jornada começa a revelar seus primeiros grandes desafios",

    development:
      "A campanha entra em uma fase de profundas transformações",

    climax:
      "A campanha alcança um momento decisivo, em que cada escolha pode alterar o destino da jornada",

    ending:
      "Os acontecimentos finais começam a definir o legado desta história",

  }[data.storyPhase ?? "development"]


  switch(data.storyPhase){

    case "opening":

      return `${phase}${location}, enquanto os primeiros acontecimentos começam a moldar o mundo e o destino dos personagens.`


    case "development":

      return `${phase}${location}, onde acontecimentos recentes passam a alterar profundamente o rumo da jornada.`


    case "climax":

      return `${phase}${location}. As decisões tomadas neste momento poderão definir o futuro de todos os envolvidos.`


    case "ending":

      return `${phase}${location}. As consequências das escolhas feitas ao longo da campanha começam a revelar seus desfechos.`


    default:

      return `${phase}${location}, onde acontecimentos recentes passam a alterar profundamente o rumo da jornada.`

  }

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

      "A perda representa uma ruptura significativa na história, alterando escolhas, relações e caminhos futuros."

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

      "O ato de traição abalou a confiança entre os envolvidos e poderá desencadear novos conflitos."

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

      "O fortalecimento dessa união alterou o equilíbrio de forças da campanha e ampliou as possibilidades de cooperação entre os envolvidos."

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

      "O desenvolvimento desse vínculo fortaleceu os laços entre os personagens e poderá influenciar decisões importantes nos próximos acontecimentos."

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

      "As descobertas ampliam o conhecimento sobre o mundo e podem transformar completamente os rumos da campanha."

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

      "Os confrontos elevaram a tensão da narrativa e poderão desencadear novos acontecimentos."

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

      "As conversas revelaram novas perspectivas entre os personagens e poderão influenciar os acontecimentos seguintes da jornada."

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





 return result
 .filter(Boolean)
 .map(
   text => text.trim()
 )
 .join("\n\n")


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

private static naturalList(
  items: string[],
): string {

  if(
    items.length === 0
  ){
    return ""
  }

  if(
    items.length === 1
  ){
    return items[0]
  }

  if(
    items.length === 2
  ){
    return `${items[0]} e ${items[1]}`
  }

  return (
    `${items.slice(0, -1).join(", ")} e ${items.at(-1)}`
  )

}
}
