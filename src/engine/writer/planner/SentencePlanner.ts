export class SentencePlanner {

  static compose(
    fragments: string[],
  ): string {

    const sentences =
      fragments
        .map(
          fragment =>
            fragment.trim(),
        )
        .filter(
          fragment =>
            fragment.length > 0,
        )

    if (
      sentences.length === 0
    ) {

      return ""

    }

    const narrative: string[] = []

    for (
      let i = 0;
      i < sentences.length;
      i++
    ) {

      const sentence =
        this.normalizeSentence(
          sentences[i],
        )

      if (!sentence) {

        continue

      }

      narrative.push(
        sentence,
      )

    }

    return this.normalizeText(
      narrative.join(" "),
    )

  }

  private static normalizeSentence(
    sentence: string,
  ): string {

    let result =
      sentence.trim()

    if (
      result.length === 0
    ) {

      return ""

    }

    result =
      result.charAt(0)
      .toUpperCase()
      +
      result.slice(1)

    if (
      !/[.!?]$/.test(result)
    ) {

      result += "."

    }

    return result

  }

  private static normalizeText(
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

      .replace(
        /([.!?])([A-ZÀ-Ú])/g,
        "$1 $2",
      )

      .trim()

  }

}