import type { NarrativeFragment } from "./NarrativeFragment"

export class SentencePlanner {

  private static readonly rhythms: NarrativeFragment["type"][][] = [

    [

      "observation",

      "emotion",

      "action",

      "dialogue",

      "ending",

    ],

    [

      "observation",

      "action",

      "emotion",

      "dialogue",

      "ending",

    ],

    [

      "emotion",

      "observation",

      "action",

      "ending",

    ],

    [

      "observation",

      "action",

      "ending",

    ],

    [

      "observation",

      "emotion",

      "action",

      "ending",

    ],

  ]

  static compose(
    fragments: NarrativeFragment[],
  ): string {

    if (
      fragments.length === 0
    ) {

      return ""

    }

    const ordered =
      this.applyNarrativeRhythm(
        this.removeDuplicates(
          fragments,
        ),
      )
    
    console.log("ORDERED", ordered)

    const sentences =
      ordered
        .map(
          fragment =>
            this.normalizeSentence(
              fragment,
            ),
        )
        .filter(Boolean)

    return this.normalizeText(
      sentences.join(" "),
    )

  }

  private static removeDuplicates(
    fragments: NarrativeFragment[],
  ): NarrativeFragment[] {

    const seen =
      new Set<string>()

    return fragments.filter(
      fragment => {

        const key =
          `${fragment.type}:${fragment.text}`

        if (
          seen.has(key)
        ) {

          return false

        }

        seen.add(
          key,
        )

        return true

      },
    )

  }

  private static randomRhythm():
    NarrativeFragment["type"][] {

    return this.rhythms[
      Math.floor(
        Math.random() *
        this.rhythms.length,
      )
    ]

  }

  private static applyNarrativeRhythm(
  fragments: NarrativeFragment[],
): NarrativeFragment[] {

  const rhythm =
    this.randomRhythm()

  const result: NarrativeFragment[] = []

  // adiciona os tipos do ritmo

  for (const type of rhythm) {

    const matches =
      fragments.filter(
        fragment =>
          fragment.type === type,
      )

    result.push(
      ...matches,
    )

  }

  // adiciona qualquer fragmento
  // que não estava no ritmo

  for (const fragment of fragments) {

    if (
      !result.includes(fragment)
    ) {

      result.push(fragment)

    }

  }

  return result

}

  private static normalizeSentence(
    fragment: NarrativeFragment,
  ): string {

    let text =
      fragment.text.trim()

    if (
      !text
    ) {

      return ""

    }

    // =================================
    // Diálogo
    // =================================

    if (
  fragment.type === "dialogue"
) {

  const speech =
    text
      .replace(/^["“]|["”]$/g, "")
      .replace(/[.!?]+$/, "")

  return `— ${speech}.`

}

    // =================================
    // Narrativa normal
    // =================================

    text =
      text.charAt(0)
        .toUpperCase()
      +
      text.slice(1)

    text =
      text.replace(
        /[.!?]+$/,
        "",
      )

    return `${text}.`

  }

  private static normalizeText(
    text: string,
  ): string {

    return text

      // espaços duplicados

      .replace(
        /\s+/g,
        " ",
      )

      // remove espaço antes da pontuação

      .replace(
        /\s+([,.!?;:])/g,
        "$1",
      )

      // remove ponto após aspas

      .replace(
        /"\./g,
        "\"",
      )

      // remove múltiplos pontos

      .replace(
        /\.{2,}/g,
        ".",
      )

      .trim()

  }

}