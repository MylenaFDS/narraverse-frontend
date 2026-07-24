import type {
  StoryContext,
} from "../../writer/story/types/StoryContext"


export interface NarrativeSituation {


  // ======================================
  // Estado da cena
  // ======================================

  conflictLevel:
    | "none"
    | "low"
    | "medium"
    | "high"


  emotionalTone:
    string


  sceneType:
    | "battle"
    | "dialogue"
    | "exploration"
    | "discovery"
    | "travel"
    | "unknown"



  // ======================================
  // Possibilidades
  // ======================================

  availableActions:
    string[]


  narrativeRisks:
    string[]


  opportunities:
    string[]



  // ======================================
  // Continuidade
  // ======================================

  importantFacts:
    string[]


  activeThreads:
    string[]

}



export class NarrativeSituationEngine {


  static analyze(

    story: StoryContext,

  ): NarrativeSituation {



    const text = [

      ...story.recentTurns,

      ...story.activeEvents,

      story.currentSituation,

    ]

      .join(" ")

      .toLowerCase()



    return {


      conflictLevel:

        this.detectConflictLevel(
          text,
        ),



      emotionalTone:

        story.sceneMood,



      sceneType:

        this.detectSceneType(
          text,
        ),



      availableActions:

        this.generateActions(
          text,
        ),



      narrativeRisks:

        this.generateRisks(
          text,
        ),



      opportunities:

        this.generateOpportunities(
          text,
        ),



      importantFacts:

        story.recentFacts,



      activeThreads:

        story.unresolvedThreads,


    }


  }





  // ======================================
  // Nível de conflito
  // ======================================

  private static detectConflictLevel(
    text:string,
  ):
    NarrativeSituation["conflictLevel"] {


    if(

      text.includes("batalha")

      ||

      text.includes("guerra")

      ||

      text.includes("ataque")

      ||

      text.includes("inimigo")

    ){

      return "high"

    }



    if(

      text.includes("ameaça")

      ||

      text.includes("perigo")

      ||

      text.includes("tensão")

    ){

      return "medium"

    }



    return "none"


  }





  // ======================================
  // Tipo da cena
  // ======================================

  private static detectSceneType(

    text:string,

  ):
    NarrativeSituation["sceneType"] {


    if(

      text.includes("ataque")

      ||

      text.includes("batalha")

    ){

      return "battle"

    }



    if(

      text.includes("disse")

      ||

      text.includes("—")

    ){

      return "dialogue"

    }



    if(

      text.includes("encontrou")

      ||

      text.includes("descobriu")

    ){

      return "discovery"

    }



    if(

      text.includes("viajou")

      ||

      text.includes("caminhou")

    ){

      return "travel"

    }



    return "exploration"


  }





  // ======================================
  // Ações possíveis
  // ======================================

  private static generateActions(

    text:string,

  ):string[] {


    const actions:string[] = []



    if(

      text.includes("batalha")

      ||

      text.includes("ataque")

    ){

      actions.push(

        "Atacar ou defender",

        "Proteger um aliado",

        "Criar uma estratégia",

      )

    }


    if(

      text.includes("diálogo")

      ||

      text.includes("disse")

    ){

      actions.push(

        "Responder",

        "Fazer uma pergunta",

        "Revelar uma informação",

      )

    }


    if(
      actions.length === 0
    ){

      actions.push(

        "Explorar o ambiente",

        "Conversar com personagens",

        "Buscar informações",

      )

    }


    return actions


  }





  // ======================================
  // Riscos
  // ======================================

  private static generateRisks(

    text:string,

  ):string[] {


    const risks:string[] = []



    if(

      text.includes("inimigo")

      ||

      text.includes("ameaça")

    ){

      risks.push(

        "O perigo pode aumentar",

      )

    }



    if(

      text.includes("segredo")

      ||

      text.includes("profecia")

    ){

      risks.push(

        "Uma informação importante pode mudar a situação",

      )

    }



    return risks


  }





  // ======================================
  // Oportunidades
  // ======================================

  private static generateOpportunities(

    text:string,

  ):string[] {


    const opportunities:string[] = []



    if(

      text.includes("aliado")

    ){

      opportunities.push(

        "Buscar ajuda de aliados",

      )

    }



    if(

      text.includes("descoberta")

      ||

      text.includes("pista")

    ){

      opportunities.push(

        "Investigar a descoberta",

      )

    }



    return opportunities


  }


}