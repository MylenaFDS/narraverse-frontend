export class ActionLibrary {

  private static readonly actions: Record<string, string[]> = {

    talk: [

      "Resolvi expressar meus pensamentos.",

      "Dirigi minhas palavras aos presentes.",

      "Quebrei o silêncio.",

      "Escolhi conversar antes de qualquer outra ação.",

    ],

    attack: [

      "Avancei contra meu adversário.",

      "Parti para o ataque.",

      "Aproveitei a oportunidade para agir.",

    ],

    defend: [

      "Mantive minha posição.",

      "Preparei-me para defender meus aliados.",

      "Coloquei-me entre o perigo e aqueles que protegiam.",

    ],

    retreat: [

      "Resolvi recuar alguns passos.",

      "Preferi reorganizar minha estratégia.",

      "Afastei-me do confronto.",

    ],

    explore: [

      "Passei a observar cuidadosamente os arredores.",

      "Resolvi explorar o ambiente.",

      "Segui investigando tudo ao meu redor.",

    ],

  }

  static get(
    action: string,
  ): string[] {

    return (
      this.actions[action] ??
      [
        "Segui com minha decisão.",
      ]
    )

  }

  static random(
    action: string,
  ): string {

    const options =
      this.get(action)

    return options[
      Math.floor(
        Math.random() * options.length,
      )
    ]

  }

}