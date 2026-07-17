import type { NarrativeFragment } from "./NarrativeFragment"


export class SentencePlanner {


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
        fragments,
      )


    return ordered
      .map(
        fragment =>
          this.normalizeSentence(
            fragment,
          ),
      )
      .filter(Boolean)
      .join(" ")

  }





  private static applyNarrativeRhythm(
    fragments: NarrativeFragment[],
  ): NarrativeFragment[] {


    const priority = {

      observation: 1,

      emotion: 2,

      action: 3,

      dialogue: 4,

      ending: 5,

    }


    return [
      ...fragments,
    ]
    .sort(
      (a,b) =>
        priority[a.type] -
        priority[b.type],
    )

  }





  private static normalizeSentence(
    fragment: NarrativeFragment,
  ): string {


    let text =
      fragment.text.trim()



    if (
      text.length === 0
    ) {

      return ""

    }



    // diálogo

    if(
      fragment.type === "dialogue"
    ){

      text =
        text.replace(
          /[.!?]+$/,
          "",
        )

      return text + "."

    }




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


    return text + "."

  }

}