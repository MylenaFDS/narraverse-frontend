import type {
  StoryContext,
} from "./types/StoryContext"


import type {
  RPGTurn,
} from "../../../types/turn"



export class StoryContextEngine {


  static build(
    turns: RPGTurn[] = [],
  ): StoryContext {


    const recent =
      turns.slice(-5)



    const contents =
      recent.map(
        turn =>
          turn.content,
      )



    const dialogues =
      recent
        .filter(
          turn =>
            turn.content.includes("—"),
        )
        .map(
          turn =>
            turn.content,
        )



    return {


      // ======================================
      // Histórico recente
      // ======================================

      recentTurns:

        contents,



      lastActions:

        contents,



      lastDialogues:

        dialogues,



      // ======================================
      // Eventos
      // ======================================

      activeEvents:

        this.detectEvents(
          recent,
        ),



      unresolvedThreads:

        this.detectThreads(
          recent,
        ),



      currentSituation:

        this.buildSituation(
          recent,
        ),



      // ======================================
      // Contexto narrativo
      // ======================================

      recentFacts:

        this.extractFacts(
          contents,
        ),



      mentionedCharacters:

        this.extractCharacters(
          contents,
        ),



      topics:

        this.extractTopics(
          contents,
        ),



      sceneMood:

        this.detectMood(
          contents,
        ),



      unansweredQuestions:

        this.detectQuestions(
          contents,
        ),



      lastDialogue:

        dialogues.at(-1),



      // ======================================
      // Objetivos narrativos
      // ======================================

      activeObjectives:

        this.detectObjectives(
          contents,
        ),



      // ======================================
      // Locais conhecidos
      // ======================================

      discoveredLocations:

        this.detectLocations(
          contents,
        ),



      // ======================================
      // Missões
      // ======================================

      activeQuests:

        this.detectQuests(
          contents,
        ),


    }

  }





  // ======================================
  // Detecta acontecimentos importantes
  // ======================================

  private static detectEvents(
    turns:RPGTurn[],
  ):string[] {


    const events:string[] = []



    for(
      const turn of turns
    ){

      const text =
        turn.content.toLowerCase()



      if(
        text.includes("ataque")
        ||
        text.includes("batalha")
        ||
        text.includes("inimigo")
      ){

        events.push(
          "Conflito em andamento",
        )

      }



      if(
        text.includes("morte")
        ||
        text.includes("morreu")
      ){

        events.push(
          "Uma perda ocorreu",
        )

      }



      if(
        text.includes("profecia")
      ){

        events.push(
          "Uma profecia influencia a situação",
        )

      }



      if(
        text.includes("promessa")
      ){

        events.push(
          "Existe uma promessa pendente",
        )

      }



      if(
        text.includes("casamento")
      ){

        events.push(
          "Uma união importante foi mencionada",
        )

      }

    }



    return [
      ...new Set(events),
    ]

  }





  // ======================================
  // Threads narrativas
  // ======================================

  private static detectThreads(
    turns:RPGTurn[],
  ):string[] {


    return turns
      .slice(-3)
      .map(
        turn =>
          `Continuar: ${turn.content}`,
      )

  }





  // ======================================
  // Fatos
  // ======================================

  private static extractFacts(
    texts:string[],
  ):string[] {


    return texts.filter(
      text =>

        text.includes("disse")
        ||
        text.includes("anunciou")
        ||
        text.includes("revelou")
        ||
        text.includes("prometeu")
        ||
        text.includes("descobriu")

    )

  }





  // ======================================
  // Personagens
  // ======================================

  private static extractCharacters(
    texts:string[],
  ):string[] {


    const names = [

      "Aragorn",
      "Arwen",
      "Galadriel",
      "Legolas",
      "Gimli",
      "Gandalf",
      "Frodo",
      "Cersei",
      "Jon Snow",

    ]



    return names.filter(
      name =>
        texts.some(
          text =>
            text.includes(name),
        ),
    )

  }





  // ======================================
  // Tópicos
  // ======================================

  private static extractTopics(
    texts:string[],
  ):string[] {


    const topics = [

      "profecia",
      "guerra",
      "casamento",
      "trono",
      "família",
      "aliança",
      "vingança",
      "perigo",
      "esperança",

    ]



    return topics.filter(
      topic =>
        texts.some(
          text =>
            text
              .toLowerCase()
              .includes(topic),
        ),
    )

  }





  // ======================================
  // Humor da cena
  // ======================================

  private static detectMood(
    texts:string[],
  ):string {


    const text =
      texts.join(" ")
      .toLowerCase()



    if(
      text.includes("profecia")
      ||
      text.includes("destino")
    ){

      return "Mistério e expectativa"

    }



    if(
      text.includes("batalha")
      ||
      text.includes("ataque")
    ){

      return "Tensão"

    }



    if(
      text.includes("esperança")
      ||
      text.includes("união")
    ){

      return "Esperança"

    }



    return "Neutro"

  }





  // ======================================
  // Perguntas abertas
  // ======================================

  private static detectQuestions(
    texts:string[],
  ):string[] {


    const questions:string[] = []



    const text =
      texts.join(" ")
      .toLowerCase()



    if(
      text.includes("profecia")
    ){

      questions.push(
        "O que a profecia significa?",
      )

    }



    if(
      text.includes("herdeiro")
    ){

      questions.push(
        "Quem é o verdadeiro herdeiro?",
      )

    }



    return questions

  }





  // ======================================
  // Objetivos
  // ======================================

  private static detectObjectives(
    texts:string[],
  ):string[] {


    const objectives:string[] = []



    const text =
      texts.join(" ")
      .toLowerCase()



    if(
      text.includes("buscar")
      ||
      text.includes("encontrar")
    ){

      objectives.push(
        "Encontrar uma solução para a situação atual",
      )

    }



    return objectives

  }





  // ======================================
  // Locais
  // ======================================

  private static detectLocations(
    texts:string[],
  ):string[] {


    const locations = [

      "Valfenda",
      "Mordor",
      "Gondor",
      "Floresta",
      "Castelo",
      "Cidade",

    ]



    return locations.filter(
      location =>
        texts.some(
          text =>
            text.includes(location),
        ),
    )

  }





  // ======================================
  // Missões
  // ======================================

  private static detectQuests(
    texts:string[],
  ):string[] {


    const quests:string[] = []



    const text =
      texts.join(" ")
      .toLowerCase()



    if(
      text.includes("missão")
      ||
      text.includes("objetivo")
      ||
      text.includes("proteger")
    ){

      quests.push(
        "Continuar o objetivo principal",
      )

    }



    return quests

  }





  // ======================================
  // Situação atual
  // ======================================

  private static buildSituation(
    turns:RPGTurn[],
  ):string {


    const last =
      turns.at(-1)



    if(
      !last
    ){

      return (
        "Nenhuma situação definida."
      )

    }



    return (

      "Situação atual: "

      +

      last.content

    )

  }


}