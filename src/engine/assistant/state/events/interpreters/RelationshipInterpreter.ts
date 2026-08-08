import type {
  RPGTurn,
} from "../../../../../types/turn"



import type {
  StoryEvent,
} from "../StoryEvent"

type AllianceSubtype =
  | "marriage"
  | "treaty"
  | "oath"
  | "military"
  | "political"
  | "unknown"


export class RelationshipInterpreter {




  static interpret(
    turn:RPGTurn,
  ):StoryEvent[] {



    const originalText =
      turn.content



    const text =
      originalText.toLowerCase()



    const events:StoryEvent[] = []



    const actorId =
      turn.character_id ??
      undefined



    const targetName =
      this.extractMention(
        originalText,
      )



    // ======================================
    // Casamento
    // ======================================

    if(
      this.contains(
        text,
        [
          "casou",
          "casaram",
          "casamento",
          "se casou",
          "se casar",
          "casar com",
          "casados",
          "casadas",
          "espos",
          "matrimônio",
          "matrimonio",
        ],
      )
    ){



      events.push({

        type:"alliance",

        subtype:"marriage",

        actorId,

        targetName,

        participants:
          this.buildParticipants(
            targetName,
          ),

        description:
          this.buildMarriageDescription(
            targetName,
          ),

        sourceText:
          originalText,

        turnId:
          turn.id,

        importance:
          90,

        dramaticWeight:
          90,

        plotImpact:
          "high",

        tags:[
          "relationship",
          "alliance",
          "marriage",
        ],

      })



      return events

    }



    // ======================================
    // Relações românticas
    // ======================================

    if(
      this.contains(
        text,
        [
          "amor",
          "apaixon",
          "beij",
          "namor",
          "romance",
          "romântico",
          "romantico",
        ],
      )
    ){



      events.push({

        type:"relationship",

        subtype:"romantic",

        actorId,

        targetName,

        participants:
          this.buildParticipants(
            targetName,
          ),

        description:
          this.buildRelationshipDescription(
            "Uma relação romântica se desenvolveu",
            targetName,
          ),

        sourceText:
          originalText,

        turnId:
          turn.id,

        importance:
          75,

        dramaticWeight:
          75,

        plotImpact:
          "medium",

        tags:[
          "relationship",
          "romantic",
        ],

      })



    }



    // ======================================
    // Amizade / confiança
    // ======================================

    if(
      this.contains(
        text,
        [
          "amizade",
          "amigo",
          "amiga",
          "confio",
          "confiança",
          "confianca",
          "lealdade",
          "leald",
        ],
      )
    ){



      events.push({

        type:"relationship",

        subtype:"friendship",

        actorId,

        targetName,

        participants:
          this.buildParticipants(
            targetName,
          ),

        description:
          this.buildRelationshipDescription(
            "Um vínculo de confiança se fortaleceu",
            targetName,
          ),

        sourceText:
          originalText,

        turnId:
          turn.id,

        importance:
          65,

        dramaticWeight:
          65,

        plotImpact:
          "medium",

        tags:[
          "relationship",
          "friendship",
          "trust",
        ],

      })



    }



    // ======================================
    // Relação genérica
    // ======================================

    if(
      this.contains(
        text,
        [
          "abraç",
          "união",
          "relacion",
          "vínculo",
          "vinculo",
          "aproxim",
        ],
      )
    ){



      events.push({

        type:"relationship",

        subtype:"trust",

        actorId,

        targetName,

        participants:
          this.buildParticipants(
            targetName,
          ),

        description:
          this.buildRelationshipDescription(
            "Uma relação pessoal evoluiu",
            targetName,
          ),

        sourceText:
          originalText,

        turnId:
          turn.id,

        importance:
          70,

        dramaticWeight:
          70,

        plotImpact:
          "medium",

        tags:[
          "relationship",
        ],

      })



    }



    // ======================================
    // Aliança
    // ======================================

    if(
      this.contains(
        text,
        [
          "alian",
          "pacto",
          "juramento",
          "juntos",
          "prometo",
          "acordo",
          "tratado",
        ],
      )
    ){



      const subtype =
        this.detectAllianceSubtype(
          text,
        )



      events.push({

        type:"alliance",

        subtype,

        actorId,

        targetName,

        participants:
          this.buildParticipants(
            targetName,
          ),

        description:
          this.buildAllianceDescription(
            subtype,
            targetName,
          ),

        sourceText:
          originalText,

        turnId:
          turn.id,

        importance:
          85,

        dramaticWeight:
          85,

        plotImpact:
          "high",

        tags:[
          "alliance",
          subtype,
        ],

      })



    }



    // ======================================
    // Traição
    // ======================================

    if(
      this.contains(
        text,
        [
          "trai",
          "engan",
          "conspir",
          "vingança",
        ],
      )
    ){



      events.push({

        type:"betrayal",

        subtype:"betrayal",

        actorId,

        targetName,

        participants:
          this.buildParticipants(
            targetName,
          ),

        description:
          this.buildBetrayalDescription(
            targetName,
          ),

        sourceText:
          originalText,

        turnId:
          turn.id,

        importance:
          90,

        dramaticWeight:
          90,

        plotImpact:
          "high",

        tags:[
          "betrayal",
          "conflict",
        ],

      })



    }



    return events

  }






  // ======================================
  // Detectar subtipo de aliança
  // ======================================

  private static detectAllianceSubtype(
  text:string,
):AllianceSubtype {



    if(
      this.contains(
        text,
        [
          "cas",
          "espos",
          "matrimônio",
          "matrimonio",
        ],
      )
    ){

      return "marriage"

    }



    if(
      this.contains(
        text,
        [
          "tratado",
          "acordo",
        ],
      )
    ){

      return "treaty"

    }



    if(
      this.contains(
        text,
        [
          "juramento",
          "prometo",
          "juro",
        ],
      )
    ){

      return "oath"

    }



    if(
      this.contains(
        text,
        [
          "exército",
          "exercito",
          "militar",
          "batalha",
          "guerra",
        ],
      )
    ){

      return "military"

    }



    if(
      this.contains(
        text,
        [
          "política",
          "politica",
          "reino",
          "coroa",
          "trono",
        ],
      )
    ){

      return "political"

    }



    return "unknown"

  }






  // ======================================
  // Descrição de casamento
  // ======================================

  private static buildMarriageDescription(
    targetName?:string,
  ):string {



    if(
      targetName
    ){

      return (
        `O personagem se casou com ${targetName}`
      )

    }



    return (
      "Um casamento foi realizado"
    )

  }






  // ======================================
  // Descrição de relação
  // ======================================

  private static buildRelationshipDescription(
    base:string,
    targetName?:string,
  ):string {



    if(
      targetName
    ){

      return (
        `${base} com ${targetName}`
      )

    }



    return base

  }






  // ======================================
  // Descrição de aliança
  // ======================================

  private static buildAllianceDescription(
  subtype:AllianceSubtype,
  targetName?:string,
):string{



    const target =
      targetName
        ? ` com ${targetName}`
        : ""



    switch(
      subtype
    ){

      case "marriage":

        return (
          `Uma união por casamento foi estabelecida${target}`
        )



      case "treaty":

        return (
          `Um tratado foi estabelecido${target}`
        )



      case "oath":

        return (
          `Um juramento de aliança foi estabelecido${target}`
        )



      case "military":

        return (
          `Uma aliança militar foi estabelecida${target}`
        )



      case "political":

        return (
          `Uma aliança política foi estabelecida${target}`
        )



      default:

        return (
          `Uma aliança foi fortalecida${target}`
        )

    }

  }






  // ======================================
  // Descrição de traição
  // ======================================

  private static buildBetrayalDescription(
    targetName?:string,
  ):string {



    if(
      targetName
    ){

      return (
        `Uma traição envolvendo ${targetName} criou um novo conflito`
      )

    }



    return (
      "Uma traição criou um novo conflito"
    )

  }






  // ======================================
  // Participantes
  // ======================================

  private static buildParticipants(
    targetName?:string,
  ):string[] {



    if(
      !targetName
    ){

      return []

    }



    return [
      targetName,
    ]

  }






  // ======================================
  // Verificar palavras
  // ======================================

  private static contains(
    text:string,
    words:string[],
  ):boolean {



    return words.some(

      word =>
        text.includes(
          word,
        )

    )

  }






  // ======================================
  // Extrair @personagem
  // ======================================

  private static extractMention(
    text:string,
  ):string | undefined {



    const match =

      text.match(
        /@([A-Za-zÀ-ÿ0-9_]+)/,
      )



    return match
      ? match[1]
      : undefined

  }

}