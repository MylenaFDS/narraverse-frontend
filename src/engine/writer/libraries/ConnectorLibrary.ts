export class ConnectorLibrary {

  static readonly introductions = [

    "Respirei lentamente antes de agir.",

    "Observei tudo ao meu redor por alguns instantes.",

    "Mantive a calma enquanto analisava a situação.",

    "Ergui o olhar com tranquilidade.",

    "Permiti que meus pensamentos se organizassem antes de agir.",

    "Permaneci em silêncio por um breve momento.",

    "Ajustei minha postura antes de tomar qualquer atitude.",

    "Meu olhar percorreu cuidadosamente o ambiente.",

  ]

  static readonly connectors = [

    "Enquanto isso,",

    "Mesmo assim,",

    "Apesar disso,",

    "No entanto,",

    "Com cautela,",

    "Logo depois,",

    "Sem hesitar,",

    "Por fim,",

  ]

  static randomIntroduction(): string {

    return this.introductions[
      Math.floor(
        Math.random() * this.introductions.length,
      )
    ]

  }

  static randomConnector(): string {

    return this.connectors[
      Math.floor(
        Math.random() * this.connectors.length,
      )
    ]

  }

}