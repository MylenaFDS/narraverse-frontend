export class ValueInterpreter {

  static isTrue(

    value: string | null,

  ) {

    if (!value) {

      return false

    }

    return [

      "sim",

      "true",

      "yes",

      "1",

    ].includes(

      value

        .trim()

        .toLowerCase(),

    )

  }

  static number(

    value: string | null,

  ) {

    if (!value) {

      return null

    }

    const parsed =

      Number(value)

    return Number.isNaN(parsed)

      ? null

      : parsed

  }

}