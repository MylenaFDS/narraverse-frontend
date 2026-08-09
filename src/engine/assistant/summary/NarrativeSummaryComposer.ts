import type {
  SummaryData,
} from "./SummaryData"



export class NarrativeSummaryComposer {



static compose(
  data:SummaryData,
):string{


  const paragraphs:string[] = []



  // ======================================
  // Abertura
  // ======================================

  paragraphs.push(

    this.composeOpening(
      data,
    )

  )



  // ======================================
  // Atmosfera / emoção
  // ======================================

  const atmosphere =
    this.normalizeNarrativeValue(
      data.atmosphere,
    )


  const emotion =
    this.normalizeNarrativeValue(
      data.dominantEmotion,
    )



  if(
    atmosphere ||
    emotion
  ){

    paragraphs.push(

      emotion

        ? `A narrativa assume um tom ${atmosphere ?? emotion}, criando um clima de ${emotion} que influencia diretamente as escolhas, reações e decisões dos personagens.`

        : `A narrativa assume um tom ${atmosphere}, intensificando a tensão e envolvendo os personagens em um cenário de mudanças decisivas.`

    )

  }



  // ======================================
  // Eventos importantes
  // ======================================

  const importantEvents =

    data.majorEvents

      .filter(

        event =>
          event.importance !== "low"

      )

      .sort(

        (a,b) =>

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



  // ======================================
  // Objetivos / missões
  // ======================================

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



  // ======================================
  // Consequências
  // ======================================

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



  // ======================================
  // Personagens envolvidos
  // ======================================

  /*
   * Personagens só devem ser apresentados
   * como parte dos acontecimentos recentes
   * quando realmente existem acontecimentos.
   */

  if(
    data.characters.length &&
    importantEvents.length
  ){

    const chars =

      this.unique(
        data.characters,
      ).slice(0,5)



    if(
      chars.length
    ){

      paragraphs.push(

        `Os acontecimentos recentes colocam ${this.naturalList(chars)} no centro da narrativa, tornando suas próximas escolhas decisivas para o futuro da campanha.`

      )

    }

  }



  // ======================================
  // Ganchos narrativos
  // ======================================

  if(
    data.narrativeHooks.length
  ){

    const hooks =

      this.unique(
        data.narrativeHooks,
      )



    if(
      hooks.length
    ){

      paragraphs.push(

        `Os acontecimentos recentes indicam que a campanha entrou em uma nova fase. Questões como ${this.naturalList(hooks)} poderão definir os próximos rumos da jornada.`

      )

    }

  }



  // ======================================
  // Resultado final
  // ======================================

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

      (text,index,array) =>
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





  // ======================================
  // Classificar eventos
  // ======================================

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



    switch(
      event.type
    ){


      // ==================================
      // Morte
      // ==================================

      case "death":

        groups.death.push(
          text,
        )

        break



      // ==================================
      // Traição
      // ==================================

      case "betrayal":

        groups.betrayal.push(
          text,
        )

        break



      // ==================================
      // Profecia
      // ==================================

      case "prophecy":

        groups.prophecy.push(
          text,
        )

        break



      // ==================================
      // Aliança
      // ==================================

      case "alliance": {


        // --------------------------------
        // Casamento
        // --------------------------------

        if(
          event.subtype === "marriage"
        ){


          const marriageText =

            this.composeMarriageEvent(
              event,
            )



          if(
            marriageText
          ){

            groups.alliance.push(
              marriageText,
            )

          }


        }


        // --------------------------------
        // Outras alianças
        // --------------------------------

        else{


          groups.alliance.push(
            text,
          )

        }



        break

      }



      // ==================================
      // Relação
      // ==================================

      case "relationship":

        groups.relationship.push(
          text,
        )

        break



      // ==================================
      // Descoberta
      // ==================================

      case "discovery": {


        const ignoredLocations =
          new Set([

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



      // ==================================
      // Combate
      // ==================================

      case "combat":

        groups.combat.push(
          text,
        )

        break



      // ==================================
      // Diálogo
      // ==================================

      case "dialogue":

        groups.dialogue.push(
          text,
        )

        break



      // ==================================
      // Missão
      // ==================================

      case "quest":

        groups.quest.push(
          text,
        )

        break



      // ==================================
      // Conquista
      // ==================================

      case "achievement":

        groups.achievement.push(
          text,
        )

        break



      // ==================================
      // Outros
      // ==================================

      default:

        groups.other.push(
          text,
        )

        break

    }

  }





  const result:string[] = []





  // ======================================
  // Mortes
  // ======================================

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





  // ======================================
  // Traições
  // ======================================

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





  // ======================================
  // Profecias
  // ======================================

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





  // ======================================
  // Alianças
  // ======================================

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





  // ======================================
  // Relações
  // ======================================

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





  // ======================================
  // Descobertas
  // ======================================

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





  // ======================================
  // Combates
  // ======================================

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





  // ======================================
  // Diálogos
  // ======================================

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





  // ======================================
  // Missões
  // ======================================

  if(
    groups.quest.length ||
    groups.achievement.length
  ){

    const advances =

      this.unique([

        ...groups.quest,

        ...groups.achievement,

      ])



    if(
      advances.length
    ){

      result.push(

        `Novos avanços foram realizados: ${advances.join(", ")}.`

      )

    }

  }





  // ======================================
  // Outros
  // ======================================

  if(
    groups.other.length
  ){

    result.push(

      this.unique(
        groups.other,
      ).join(", ")

    )

  }





  // ======================================
  // Resultado
  // ======================================

  return result

    .filter(
      Boolean,
    )

    .map(
      text =>
        text.trim()
    )

    .filter(
      text =>
        text.length > 0
    )

    .join(
      "\n\n",
    )

}





// ======================================
// Evento de casamento
// ======================================

private static composeMarriageEvent(
  event:SummaryData["majorEvents"][number],
):string{


  // ------------------------------------
  // Participantes explícitos
  // ------------------------------------

  if(
    event.participants
  ){

    const participants =
      event.participants.trim()



    if(
      participants.length
    ){

      return (
        `Uma união por casamento foi estabelecida entre ${participants}`
      )

    }

  }





  // ------------------------------------
  // Actor + target
  // ------------------------------------

  if(
    event.actor &&
    event.target
  ){

    return (
      `${event.actor} se casou com ${event.target}`
    )

  }





  // ------------------------------------
  // Somente target
  // ------------------------------------

  if(
    event.target
  ){

    return (
      `O personagem se casou com ${event.target}`
    )

  }





  // ------------------------------------
  // Somente actor
  // ------------------------------------

  if(
    event.actor
  ){

    return (
      `${event.actor} se casou`
    )

  }





  // ------------------------------------
  // Fallback
  // ------------------------------------

  return (
    "Um casamento foi realizado"
  )

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
// ======================================
// Normalizar valores narrativos
// ======================================

private static normalizeNarrativeValue(
  value?:string | null,
):string | null{


  if(
    !value
  ){

    return null

  }



  const normalized =

    value
      .trim()
      .toLowerCase()



  if(
    [
      "neutral",
      "neutra",
      "neutro",
      "unknown",
      "desconhecido",
      "desconhecida",
      "undefined",
      "null",
    ].includes(
      normalized,
    )
  ){

    return null

  }



  return value.trim()

}
}
