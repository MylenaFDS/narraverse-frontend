export class EndingLibrary {

  static readonly endings = [

    "Continuei atento ao que acontecia ao meu redor.",

    "Esperei pela reação dos demais.",

    "Mantive minha posição.",

    "Não baixei a guarda.",

    "Observei atentamente as consequências daquela decisão.",

    "Permaneci preparado para agir novamente.",

  ]

  static get(): string[] {

    return this.endings

  }

  static random(): string {

    const options =
      this.get()

    return options[
      Math.floor(
        Math.random() * options.length,
      )
    ]

  }

}