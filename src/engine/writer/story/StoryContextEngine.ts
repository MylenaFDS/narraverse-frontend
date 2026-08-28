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


    const activeEvents =
      this.detectEvents(
        recent,
      )


    const unresolvedThreads =
      this.detectThreads(
        recent,
      )


    const recentFacts =
      this.extractFacts(
        contents,
      )


    const mentionedCharacters =
      this.extractCharacters(
        contents,
      )


    const topics =
      this.extractTopics(
        contents,
      )


    const sceneMood =
      this.detectMood(
        contents,
      )


    const unansweredQuestions =
      this.detectQuestions(
        contents,
      )


    const activeObjectives =
      this.detectObjectives(
        contents,
      )


    const discoveredLocations =
      this.detectLocations(
        contents,
      )


    const activeQuests =
      this.detectQuests(
        contents,
      )


    return {


      // ======================================================
      // HISTÓRICO RECENTE
      // ======================================================

      recentTurns:
        contents,

      recentFacts,

      lastActions:
        contents,

      lastDialogues:
        dialogues,


      // ======================================================
      // CONTINUIDADE NARRATIVA
      // ======================================================

      previousSummary:
        undefined,

      previousScene:
        undefined,

      previousLocation:
        discoveredLocations.at(-1),

      previousMood:
        undefined,


      // ======================================================
      // ESTADO ATUAL
      // ======================================================

      currentSituation:
        this.buildSituation(
          recent,
        ),

      currentLocation:
        discoveredLocations.at(-1),

      sceneMood,

      activeEvents,


      // ======================================================
      // ESTRUTURA NARRATIVA
      // ======================================================

      storyArc:
        undefined,

      chapter:
        undefined,

      sceneNumber:
        turns.length > 0
          ? turns.length
          : undefined,

      storyPhase:
        this.detectStoryPhase(
          turns.length,
        ),

      storyTempo:
        this.detectStoryTempo(
          contents,
        ),


      // ======================================================
      // DRAMATURGIA
      // ======================================================

      narrativeTension:
        this.calculateTension(
          contents,
        ),

      dominantEmotion:
        sceneMood,

      dramaticQuestion:
        unansweredQuestions.at(0),

      expectedClimax:
        undefined,

      lastMajorEvent:
        activeEvents.at(-1),

      lastTurningPoint:
        recentFacts.at(-1),

      currentConflict:
        activeEvents.find(
          event =>
            event.includes("Conflito"),
        ),

      currentGoal:
        activeObjectives.at(0),

      currentMystery:
        unansweredQuestions.at(0),

      recentConsequences:
        this.detectConsequences(
          contents,
        ),


      // ======================================================
      // CONTINUIDADE
      // ======================================================

      unresolvedThreads,

      unansweredQuestions,

      topics,


      // ======================================================
      // PERSONAGENS
      // ======================================================

      mentionedCharacters,

      focusedCharacter:
        mentionedCharacters.at(-1),

      lastDialogue:
        dialogues.at(-1),


      // ======================================================
      // MUNDO
      // ======================================================

      discoveredLocations,

      discoveredFactions:
        this.detectFactions(
          contents,
        ),

      discoveredItems:
        this.detectItems(
          contents,
        ),


      // ======================================================
      // OBJETIVOS
      // ======================================================

      activeObjectives,

      activeQuests,

      completedObjectives:
        this.detectCompletedObjectives(
          contents,
        ),

      completedQuests:
        this.detectCompletedQuests(
          contents,
        ),


      // ======================================================
      // RESUMO DINÂMICO
      // ======================================================

      keywords:
        this.extractKeywords(
          contents,
        ),

      themes:
        topics,

      narrativeHooks:
        this.generateNarrativeHooks(
          activeEvents,
          unresolvedThreads,
          unansweredQuestions,
        ),

    }

  }


  // ==========================================================
  // EVENTOS
  // ==========================================================

  private static detectEvents(
    turns: RPGTurn[],
  ): string[] {


    const events: string[] = []


    for (
      const turn of turns
    ) {

      const text =
        turn.content.toLowerCase()


      if (
        text.includes("ataque")
        ||
        text.includes("batalha")
        ||
        text.includes("inimigo")
      ) {

        events.push(
          "Conflito em andamento",
        )

      }


      if (
        text.includes("morte")
        ||
        text.includes("morreu")
      ) {

        events.push(
          "Uma perda ocorreu",
        )

      }


      if (
        text.includes("profecia")
      ) {

        events.push(
          "Uma profecia influencia a situação",
        )

      }


      if (
        text.includes("promessa")
      ) {

        events.push(
          "Existe uma promessa pendente",
        )

      }


      if (
        text.includes("casamento")
      ) {

        events.push(
          "Uma união importante foi mencionada",
        )

      }

    }


    return [
      ...new Set(events),
    ]

  }


  // ==========================================================
  // THREADS
  // ==========================================================

  private static detectThreads(
    turns: RPGTurn[],
  ): string[] {

    return turns
      .slice(-3)
      .map(
        turn =>
          `Continuar: ${turn.content}`,
      )

  }


  // ==========================================================
  // FATOS
  // ==========================================================

  private static extractFacts(
    texts: string[],
  ): string[] {

    return texts.filter(
      text => {

        const value =
          text.toLowerCase()

        return (
          value.includes("disse")
          ||
          value.includes("anunciou")
          ||
          value.includes("revelou")
          ||
          value.includes("prometeu")
          ||
          value.includes("descobriu")
        )

      },
    )

  }


  // ==========================================================
  // PERSONAGENS
  // ==========================================================

  private static extractCharacters(
    texts: string[],
  ): string[] {


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
      "Daenerys",
      "Harry",
      "Hermione",

    ]


    return names.filter(
      name =>
        texts.some(
          text =>
            text.includes(name),
        ),
    )

  }


  // ==========================================================
  // TÓPICOS
  // ==========================================================

  private static extractTopics(
    texts: string[],
  ): string[] {


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
      "magia",
      "reino",
      "batalha",
      "amor",
      "traição",

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


  // ==========================================================
  // HUMOR
  // ==========================================================

  private static detectMood(
    texts: string[],
  ): string {


    const text =
      texts
        .join(" ")
        .toLowerCase()


    if (
      text.includes("profecia")
      ||
      text.includes("destino")
    ) {

      return "Mistério e expectativa"

    }


    if (
      text.includes("batalha")
      ||
      text.includes("ataque")
      ||
      text.includes("inimigo")
    ) {

      return "Tensão"

    }


    if (
      text.includes("esperança")
      ||
      text.includes("união")
    ) {

      return "Esperança"

    }


    if (
      text.includes("amor")
      ||
      text.includes("casamento")
    ) {

      return "Romântico"

    }


    return "Neutro"

  }


  // ==========================================================
  // PERGUNTAS
  // ==========================================================

  private static detectQuestions(
    texts: string[],
  ): string[] {


    const questions: string[] = []


    const text =
      texts
        .join(" ")
        .toLowerCase()


    if (
      text.includes("profecia")
    ) {

      questions.push(
        "O que a profecia significa?",
      )

    }


    if (
      text.includes("herdeiro")
    ) {

      questions.push(
        "Quem é o verdadeiro herdeiro?",
      )

    }


    if (
      text.includes("?")
    ) {

      questions.push(
        "Qual será a resposta para essa questão?",
      )

    }


    return [
      ...new Set(questions),
    ]

  }


  // ==========================================================
  // OBJETIVOS
  // ==========================================================

  private static detectObjectives(
    texts: string[],
  ): string[] {


    const objectives: string[] = []


    const text =
      texts
        .join(" ")
        .toLowerCase()


    if (
      text.includes("buscar")
      ||
      text.includes("encontrar")
    ) {

      objectives.push(
        "Encontrar uma solução para a situação atual",
      )

    }


    if (
      text.includes("proteger")
    ) {

      objectives.push(
        "Proteger alguém ou algo importante",
      )

    }


    return [
      ...new Set(objectives),
    ]

  }


  // ==========================================================
  // LOCAIS
  // ==========================================================

  private static detectLocations(
    texts: string[],
  ): string[] {


    const locations = [

      "Valfenda",
      "Mordor",
      "Gondor",
      "Floresta",
      "Castelo",
      "Cidade",
      "Minas Tirith",
      "Rivendell",

    ]


    return locations.filter(
      location =>
        texts.some(
          text =>
            text.includes(location),
        ),
    )

  }


  // ==========================================================
  // FACÇÕES
  // ==========================================================

  private static detectFactions(
    texts: string[],
  ): string[] {


    const factions = [

      "Império",
      "Reino",
      "Guarda",
      "Exército",
      "Aliança",
      "Conselho",
      "Clã",
      "Guilda",

    ]


    return factions.filter(
      faction =>
        texts.some(
          text =>
            text.toLowerCase()
              .includes(
                faction.toLowerCase(),
              ),
        ),
    )

  }


  // ==========================================================
  // ITENS
  // ==========================================================

  private static detectItems(
    texts: string[],
  ): string[] {


    const items = [

      "espada",
      "escudo",
      "anel",
      "chave",
      "mapa",
      "poção",
      "livro",
      "coroa",
      "arma",

    ]


    return items.filter(
      item =>
        texts.some(
          text =>
            text.toLowerCase()
              .includes(item),
        ),
    )

  }


  // ==========================================================
  // MISSÕES
  // ==========================================================

  private static detectQuests(
    texts: string[],
  ): string[] {


    const quests: string[] = []


    const text =
      texts
        .join(" ")
        .toLowerCase()


    if (
      text.includes("missão")
      ||
      text.includes("objetivo")
      ||
      text.includes("proteger")
    ) {

      quests.push(
        "Continuar o objetivo principal",
      )

    }


    return quests

  }


  // ==========================================================
  // OBJETIVOS CONCLUÍDOS
  // ==========================================================

  private static detectCompletedObjectives(
    texts: string[],
  ): string[] {


    return texts.filter(
      text => {

        const value =
          text.toLowerCase()

        return (
          value.includes("objetivo concluído")
          ||
          value.includes("objetivo completado")
          ||
          value.includes("conseguiu")
        )

      },
    )

  }


  // ==========================================================
  // MISSÕES CONCLUÍDAS
  // ==========================================================

  private static detectCompletedQuests(
    texts: string[],
  ): string[] {


    return texts.filter(
      text => {

        const value =
          text.toLowerCase()

        return (
          value.includes("missão concluída")
          ||
          value.includes("missão completada")
          ||
          value.includes("quest concluída")
          ||
          value.includes("quest completed")
        )

      },
    )

  }


  // ==========================================================
  // CONSEQUÊNCIAS
  // ==========================================================

  private static detectConsequences(
    texts: string[],
  ): string[] {


    return texts.filter(
      text => {

        const value =
          text.toLowerCase()

        return (
          value.includes("por causa")
          ||
          value.includes("como consequência")
          ||
          value.includes("resultado")
          ||
          value.includes("consequência")
        )

      },
    )

  }


  // ==========================================================
  // PALAVRAS-CHAVE
  // ==========================================================

  private static extractKeywords(
    texts: string[],
  ): string[] {


    const stopWords = new Set([

      "que",
      "para",
      "com",
      "uma",
      "um",
      "uma",
      "por",
      "dos",
      "das",
      "e",
      "de",
      "do",
      "da",
      "em",
      "no",
      "na",
      "o",
      "a",
      "os",
      "as",
      "se",
      "ao",
      "aos",

    ])


    const words =
      texts
        .join(" ")
        .toLowerCase()
        .replace(
          /[^\p{L}\p{N}\s]/gu,
          "",
        )
        .split(/\s+/)
        .filter(
          word =>
            word.length >= 5
            &&
            !stopWords.has(word),
        )


    const frequency =
      new Map<string, number>()


    for (
      const word of words
    ) {

      frequency.set(
        word,
        (frequency.get(word) ?? 0) + 1,
      )

    }


    return [
      ...frequency.entries(),
    ]
      .sort(
        (a, b) =>
          b[1] - a[1],
      )
      .slice(0, 10)
      .map(
        ([word]) =>
          word,
      )

  }


  // ==========================================================
  // TENSÃO NARRATIVA
  // ==========================================================

  private static calculateTension(
    texts: string[],
  ): number {


    const text =
      texts
        .join(" ")
        .toLowerCase()


    let tension = 20


    if (
      text.includes("perigo")
    ) {

      tension += 15

    }


    if (
      text.includes("inimigo")
    ) {

      tension += 15

    }


    if (
      text.includes("ataque")
    ) {

      tension += 20

    }


    if (
      text.includes("batalha")
    ) {

      tension += 25

    }


    if (
      text.includes("morte")
      ||
      text.includes("morreu")
    ) {

      tension += 20

    }


    if (
      text.includes("profecia")
    ) {

      tension += 10

    }


    return Math.min(
      tension,
      100,
    )

  }


  // ==========================================================
  // FASE DA HISTÓRIA
  // ==========================================================

  private static detectStoryPhase(
    turnCount: number,
  ):
    | "opening"
    | "development"
    | "climax"
    | "ending" {


    if (
      turnCount <= 5
    ) {

      return "opening"

    }


    if (
      turnCount <= 20
    ) {

      return "development"

    }


    if (
      turnCount <= 30
    ) {

      return "climax"

    }


    return "ending"

  }


  // ==========================================================
  // RITMO
  // ==========================================================

  private static detectStoryTempo(
    texts: string[],
  ):
    | "slow"
    | "normal"
    | "fast" {


    const text =
      texts.join(" ")
        .toLowerCase()


    if (
      text.includes("batalha")
      ||
      text.includes("ataque")
    ) {

      return "fast"

    }


    if (
      text.includes("conversa")
      ||
      text.includes("diálogo")
    ) {

      return "slow"

    }


    return "normal"

  }


  // ==========================================================
  // GANCHOS NARRATIVOS
  // ==========================================================

  private static generateNarrativeHooks(
    events: string[],
    threads: string[],
    questions: string[],
  ): string[] {


    return [

      ...events.map(
        event =>
          `Explorar consequência: ${event}`,
      ),

      ...threads.map(
        thread =>
          `Retomar fio narrativo: ${thread}`,
      ),

      ...questions.map(
        question =>
          `Responder questão: ${question}`,
      ),

    ].slice(0, 10)

  }


  // ==========================================================
  // SITUAÇÃO ATUAL
  // ==========================================================

  private static buildSituation(
    turns: RPGTurn[],
  ): string {


    const last =
      turns.at(-1)


    if (!last) {

      return "Nenhuma situação definida."

    }


    return (
      "Situação atual: "
      +
      last.content
    )

  }

}