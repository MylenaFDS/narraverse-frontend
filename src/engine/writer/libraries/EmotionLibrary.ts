export class EmotionLibrary {

  private static readonly emotions: Record<string, string[]> = {

    happiness: [

      "Uma sensação de serenidade tomou conta de mim.",

      "Senti confiança em minhas escolhas.",

      "Meu espírito estava leve.",

    ],

    anger: [

      "Controlei a raiva que crescia dentro de mim.",

      "Meu sangue parecia ferver.",

      "Respirei profundamente antes de agir.",

    ],

    fear: [

      "Meu instinto dizia para agir com cautela.",

      "O medo ainda permanecia presente.",

      "Cada passo parecia exigir ainda mais atenção.",

    ],

    sadness: [

      "O peso dos acontecimentos permanecia comigo.",

      "Respirei fundo tentando afastar a tristeza.",

      "Meu coração ainda carregava dúvidas.",

    ],

    trust: [

      "Sabia que podia confiar nos que estavam ao meu lado.",

      "A presença dos meus aliados fortalecia minha determinação.",

    ],

    curiosity: [

      "Minha curiosidade falou mais alto.",

      "Queria entender melhor aquela situação.",

    ],

    surprise: [

      "Aquilo me surpreendeu completamente.",

      "Levei alguns instantes para compreender o que via.",

    ],

    disgust: [

      "Não consegui esconder meu desconforto.",

      "A cena diante de mim provocava repulsa.",

    ],

  }

  static get(
    emotion: string,
  ): string[] {

    return (

      this.emotions[emotion] ??

      [
        "Mantive a calma enquanto refletia sobre a situação.",
      ]

    )

  }

  static random(
    emotion: string,
  ): string {

    const options =
      this.get(emotion)

    return options[
      Math.floor(
        Math.random() * options.length,
      )
    ]

  }

}