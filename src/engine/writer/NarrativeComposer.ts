import type { WriterContext } from "./WriterContext"

export class NarrativeComposer {

  private static intros = [
    "Respirei lentamente antes de agir.",
    "Observei tudo ao meu redor por alguns instantes.",
    "Mantive a calma enquanto analisava a situação.",
    "Ergui o olhar com tranquilidade.",
    "Permiti que meus pensamentos se organizassem antes de agir.",
    "Permaneci em silêncio por um breve momento.",
    "Ajustei minha postura antes de tomar qualquer atitude.",
    "Meu olhar percorreu cuidadosamente o ambiente.",
  ]

  private static endings = [
    "Continuei atento ao que acontecia ao meu redor.",
    "Permaneci preparado para qualquer mudança.",
    "Esperei pela reação dos demais.",
    "Mantive minha posição.",
    "Observei atentamente as consequências da minha escolha.",
    "Segui em frente sem hesitar.",
    "Não baixei a guarda.",
    "Apenas aguardei o próximo movimento.",
  ]

  private static emotionTexts: Record<string, string[]> = {

    happiness: [
      "Uma sensação de tranquilidade me acompanhava.",
      "Senti confiança no caminho escolhido.",
      "Meu espírito estava leve.",
    ],

    anger: [
      "A irritação ainda queimava dentro de mim.",
      "Meu sangue fervia.",
      "Controlei minha raiva antes de agir.",
    ],

    fear: [
      "Não consegui ignorar o medo que sentia.",
      "Cada movimento exigia cautela.",
      "Meu instinto dizia para agir com prudência.",
    ],

    sadness: [
      "O peso dos acontecimentos ainda permanecia em meu coração.",
      "A tristeza tornava cada decisão mais difícil.",
      "Respirei fundo tentando afastar meus pensamentos.",
    ],

    trust: [
      "Confiava plenamente em meus aliados.",
      "Sabia que não estava sozinho.",
      "A presença dos demais fortalecia minha determinação.",
    ],

    curiosity: [
      "Minha curiosidade falava mais alto.",
      "Queria entender melhor aquela situação.",
      "Cada detalhe parecia importante.",
    ],

    surprise: [
      "Aquilo me pegou completamente desprevenido.",
      "Levei alguns instantes para compreender o que via.",
      "Não esperava por aquele acontecimento.",
    ],

    disgust: [
      "A cena diante de mim causava profundo desconforto.",
      "Tive dificuldade para esconder minha repulsa.",
      "Aquilo contrariava tudo em que acreditava.",
    ],

  }

  private static actionTexts: Record<string, string[]> = {

    talk: [
      "Decidi expressar meus pensamentos em voz alta.",
      "Dirigi minhas palavras aos presentes.",
      "Quebrei o silêncio para compartilhar minha opinião.",
      "Escolhi conversar antes de qualquer outra ação.",
    ],

    explore: [
      "Segui observando cuidadosamente os arredores.",
      "Passei a investigar o ambiente.",
      "Avancei com cautela enquanto examinava cada detalhe.",
      "Resolvi explorar a região ao meu redor.",
    ],

    defend: [
      "Mantive minha posição para proteger aqueles ao meu lado.",
      "Preparei-me para defender meus aliados.",
      "Coloquei-me entre o perigo e quem precisava de proteção.",
    ],

    attack: [
      "Avancei decidido contra meu adversário.",
      "Não hesitei antes de partir para o ataque.",
      "Aproveitei a oportunidade para golpear.",
    ],

    retreat: [
      "Recuei alguns passos para reorganizar minha estratégia.",
      "Preferi preservar minhas forças antes de continuar.",
      "Afastei-me do perigo para pensar melhor.",
    ],

  }

  private static random(list: string[]) {
    return list[
      Math.floor(
        Math.random() * list.length,
      )
    ]
  }

  static compose(
    context: WriterContext,
  ): string {

    const dominantEmotion =
      Object.entries(context.emotion)
        .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "trust"

    const intro =
      this.random(this.intros)

    const emotion =
      this.random(
        this.emotionTexts[dominantEmotion] ??
        ["Mantive a calma."],
      )

    const action =
      this.random(
        this.actionTexts[
          context.decision.action
        ] ??
        ["Segui com minha decisão."],
      )

    const ending =
      this.random(this.endings)

    return [
      intro,
      emotion,
      action,
      ending,
    ].join(" ")

  }

}