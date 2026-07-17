import type { StyleProfile } from "./StyleProfile"


export class StyleTransformerEngine {


  static apply(
    text: string,
    style: StyleProfile,
  ): string {


    if (
      !text.trim()
    ) {

      return ""

    }


    let result =
      text.trim()



    // =====================================
    // Frases curtas
    // =====================================

    if (
      style.sentenceSize === "short"
    ) {

      result =
        this.makeShortSentences(
          result,
        )

    }



    // =====================================
    // Frases reflexivas
    // =====================================

    if (
      style.sentenceSize === "long"
    ) {

      result =
        this.makeReflective(
          result,
        )

    }



    // =====================================
    // Emoção
    // =====================================

    if (
      style.emotionLevel >= 90
    ) {

      result =
        this.enhanceEmotion(
          result,
        )

    }



    // =====================================
    // Introspecção
    // =====================================

    if (
      style.introspectionLevel >= 90
    ) {

      result =
        this.addReflection(
          result,
        )

    }



    // =====================================
    // Agressividade
    // =====================================

    if (
      style.aggressionLevel >= 90
    ) {

      result =
        this.addIntensity(
          result,
        )

    }



    return this.normalize(
      result,
    )

  }





  private static makeShortSentences(
    text: string,
  ): string {


    return text
      .replace(
        /,\s/g,
        ". ",
      )


  }





  private static makeReflective(
    text: string,
  ): string {


    if (
      !text
    ) {

      return text

    }


    return (

      "Por um instante, "

      +

      text.charAt(0).toLowerCase()

      +

      text.slice(1)

    )

  }





  private static enhanceEmotion(
    text: string,
  ): string {


    return (

      text

      +

      " Aquela sensação permaneceu comigo."

    )

  }





  private static addReflection(
    text: string,
  ): string {


    return (

      text

      +

      " Pensei nas consequências daquela escolha."

    )

  }





  private static addIntensity(
    text: string,
  ): string {


    return (

      text

      +

      " Não havia espaço para hesitação."

    )

  }





  private static normalize(
    text: string,
  ): string {


    return text

      .replace(
        /\s+/g,
        " ",
      )

      .replace(
        /\s+([,.!?;:])/g,
        "$1",
      )

      .trim()

  }


}