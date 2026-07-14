export class IntroLibrary {

  static readonly intros = [

    "Respirei lentamente.",

    "Observei atentamente o ambiente.",

    "Mantive minha postura firme.",

    "Ergui o olhar calmamente.",

    "Permaneci alguns instantes em silêncio.",

    "Meu olhar percorreu todo o cenário.",

    "Fechei os olhos por um breve instante.",

    "Analisei tudo antes de agir.",

    "Permiti que meus pensamentos se organizassem.",

    "Continuei atento ao que acontecia.",

  ]

  static random(): string {

    return this.intros[
      Math.floor(
        Math.random() * this.intros.length,
      )
    ]

  }

}