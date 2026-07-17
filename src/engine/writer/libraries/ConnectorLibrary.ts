export class ConnectorLibrary {

  private static readonly observations = [

    "Respirei lentamente antes de agir.",

    "Observei tudo ao meu redor por alguns instantes.",

    "Mantive a calma enquanto analisava a situação.",

    "Ergui o olhar com tranquilidade.",

    "Permiti que meus pensamentos se organizassem antes de agir.",

    "Permaneci em silêncio por um breve momento.",

    "Ajustei minha postura antes de tomar qualquer atitude.",

    "Meu olhar percorreu cuidadosamente o ambiente.",

    "Analisei cada detalhe antes de tomar uma decisão.",

    "Esperei alguns instantes antes de reagir.",

  ]

  private static readonly transitions = [

    "Enquanto isso,",

    "Mesmo assim,",

    "Apesar disso,",

    "No entanto,",

    "Com cautela,",

    "Logo depois,",

    "Sem hesitar,",

    "Ainda assim,",

    "Naquele instante,",

    "Por fim,",

  ]

  static getObservation(): string[] {

    return this.observations

  }

  static getTransition(): string[] {

    return this.transitions

  }

  static randomObservation(): string {

    return this.random(
      this.observations,
    )

  }

  static randomTransition(): string {

    return this.random(
      this.transitions,
    )

  }

  static randomIntroduction(): string {

    // Compatibilidade com versões antigas
    return this.randomObservation()

  }

  private static random(
    options: string[],
  ): string {

    if (
      options.length === 0
    ) {

      return ""

    }

    return options[
      Math.floor(
        Math.random() *
        options.length,
      )
    ]

  }

}