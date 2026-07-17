export class DialogueLibrary {

  private static readonly dialogues: Record<string, string[]> = {

    talk: [

      "\"Ainda há esperança.\"",

      "\"Precisamos permanecer unidos.\"",

      "\"Vamos resolver isso juntos.\"",

      "\"Nem tudo está perdido.\"",

    ],

    attack: [

      "\"Agora!\"",

      "\"Não vou recuar!\"",

    ],

    retreat: [

      "\"Ainda não é o momento.\"",

      "\"Precisamos reorganizar nossas forças.\"",

    ],

    defend: [

  "\"Fiquem atrás de mim.\"",

  "\"Eu protegerei vocês.\"",

],

explore: [

  "\"Precisamos descobrir o que aconteceu.\"",

  "\"Vamos investigar antes de agir.\"",

],

  }

  static get(
    action: string,
  ): string[] {

    return (
      this.dialogues[action] ??
      []
    )

  }

  static random(
    action: string,
  ): string {

    const options =
      this.get(action)

    if (options.length === 0) {

      return ""

    }

    return options[
      Math.floor(
        Math.random() * options.length,
      )
    ]

  }

}