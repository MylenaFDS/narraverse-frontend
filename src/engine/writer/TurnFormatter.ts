
export class TurnFormatter {

  static format(

    description: string,

    dialogue: string,


  ) {

    return [

      description,

      dialogue,

    ]

      .filter(Boolean)

      .join("\n\n")

  }

}