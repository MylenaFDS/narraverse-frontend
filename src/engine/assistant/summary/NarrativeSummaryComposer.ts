import type {
  SummaryData,
} from "./SummaryData"

import type {SummaryEvent} from "./SummaryEvent"


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

  // ======================================
// Personagens envolvidos nos acontecimentos
// ======================================

if(
  importantEvents.length
){

  const recentCharacters =
    this.extractEventCharacters(
      importantEvents,
    )


  if(
    recentCharacters.length
  ){

    paragraphs.push(

      `Os acontecimentos recentes colocam ${this.naturalList(recentCharacters)} no centro da narrativa, tornando suas próximas escolhas decisivas para o futuro da campanha.`

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
  events:SummaryEvent[],
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



    // ==================================
    // Ignorar eventos genéricos
    // ==================================

    if(
      this.isGenericEvent(
        event,
        text,
      )
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

        const normalized =
          text
            .toLowerCase()
            .trim()



        const ignoredLocations =
          new Set([

            "gondor",

            "mordor",

            "condado",

            "rivendell",

            "castelo",

            "castelos",

            "floresta",

            "cidade",

            "vila",

            "fortaleza",

            "palácio",

            "palacio",

          ])



        if(

          text.length > 5 &&

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

        "A perda representa uma ruptura significativa na história, alterando escolhas, relações e caminhos futuros.",

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

        "A traição abalou a confiança entre os envolvidos e abriu espaço para novos conflitos.",

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

        "A revelação amplia o mistério da campanha e poderá influenciar acontecimentos que ainda estão por vir.",

      )

    )

  }



  // ======================================
  // Alianças
  // ======================================

  if(
    groups.alliance.length
  ){

    const marriages =
      events
        .filter(
          event =>
            event.type === "alliance" &&
            event.subtype === "marriage",
        )
        .map(
          event =>
            this.composeMarriageEvent(
              event,
            ),
        )
        .filter(
          Boolean,
        )



    const otherAlliances =
      events
        .filter(
          event =>
            event.type === "alliance" &&
            event.subtype !== "marriage",
        )
        .map(
          event =>
            this.cleanEvent(
              event.description,
            ),
        )
        .filter(
          text =>
            Boolean(
              text,
            ),
        )



    // --------------------------------
    // Casamentos
    // --------------------------------

    if(
      marriages.length
    ){

      result.push(

        this.unique(
          marriages,
        ).join(" ")

      )

    }



    // --------------------------------
    // Outras alianças
    // --------------------------------

    if(
      otherAlliances.length
    ){

      result.push(

        this.narrativeSentence(

          this.unique(
            otherAlliances,
          ).join(", "),

          "Essas alianças poderão alterar as relações entre os envolvidos e influenciar os próximos acontecimentos.",

        )

      )

    }

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

        "O desenvolvimento desses vínculos poderá influenciar as relações e decisões dos personagens nos acontecimentos seguintes.",

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

        "As descobertas acrescentam novas informações à situação atual e podem alterar os rumos da campanha.",

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

        "Os confrontos aumentaram a tensão dos acontecimentos e poderão provocar novas consequências.",

      )

    )

  }



  // ======================================
  // Diálogos
  // ======================================

  if(
    groups.dialogue.length
  ){

    result.push(

      this.narrativeSentence(

        this.unique(
          groups.dialogue,
        ).join(", "),

        "As conversas trouxeram novas perspectivas e poderão influenciar as decisões seguintes.",

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

  return [

    ...new Set(

      result

        .map(
          text =>
            text.trim(),
        )

        .filter(
          text =>
            text.length > 0,
        )

    ),

  ].join(

    "\n\n",

  )

}

// ======================================
// Identificar evento genérico
// ======================================

private static isGenericEvent(
  event:SummaryEvent,
  text:string,
):boolean{


  const normalized =
    text
      .toLowerCase()
      .trim()



  // ==================================
  // Descrições genéricas
  // ==================================

  const genericDescriptions = [

    "uma relação pessoal evoluiu",

    "um vínculo de confiança se fortaleceu",

    "uma informação importante foi descoberta",

    "uma tarefa de busca ou investigação foi criada",

    "um diálogo importante ocorreu",

    "um conflito emergiu",

    "uma emoção significativa foi registrada",

    "um movimento importante ocorreu",

  ]



  if(
    genericDescriptions.includes(
      normalized,
    )
  ){

    return true

  }



  // ==================================
  // Descoberta que contém apenas local
  // ==================================

  if(
    event.type === "discovery"
  ){

    const locations = [

      "gondor",

      "mordor",

      "condado",

      "rivendell",

      "castelo",

      "floresta",

      "cidade",

      "vila",

      "fortaleza",

      "palácio",

      "palacio",

    ]



    if(
      locations.includes(
        normalized,
      )
    ){

      return true

    }

  }



  return false

}



// ======================================
// Evento de casamento
// ======================================

private static composeMarriageEvent(
  event:SummaryEvent,
):string{


  // ======================================
  // Participantes
  // ======================================

  const participants =
    (event.participants ?? [])

      .map(
        (
          name:string,
        ) =>
          name.trim(),
      )

      .filter(
        (
          name:string,
        ) =>
          Boolean(
            name,
          ),
      )



  // ======================================
  // Dois ou mais participantes
  // ======================================

  if(
    participants.length >= 2
  ){

    return (

      `${participants[0]} e ${participants[1]} se casaram`

    )

  }



  // ======================================
  // Actor + target
  // ======================================

  if(
    event.actor &&
    event.target
  ){

    return (

      `${event.actor} e ${event.target} se casaram`

    )

  }



  // ======================================
  // Um participante
  // ======================================

  if(
    participants.length === 1
  ){

    return (

      `Um casamento envolvendo ${participants[0]} foi realizado`

    )

  }



  // ======================================
  // Descrição original
  // ======================================

  if(
    event.description
  ){

    return this.cleanEvent(
      event.description,
    )

  }



  return ""

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
// Personagens dos eventos recentes
// ======================================

private static extractEventCharacters(
  events:SummaryEvent[],
):string[]{


  const characters:string[] = []



  for(
    const event of events
  ){


    // ==================================
    // Participantes
    // ==================================

    if(
      event.participants?.length
    ){

      characters.push(
        ...event.participants,
      )

    }



    // ==================================
    // Actor
    // ==================================

    if(
      event.actor
    ){

      characters.push(
        event.actor,
      )

    }



    // ==================================
    // Target
    // ==================================

    if(
      event.target
    ){

      characters.push(
        event.target,
      )

    }

  }



  return [

    ...new Set(

      characters

        .map(
          (
            name:string,
          ) =>
            name.trim(),
        )

        .filter(
          (
            name:string,
          ) =>
            Boolean(
              name,
            ),
        )

    ),

  ]

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
