export interface NarrativeFragment {

  type:
    | "observation"
    | "emotion"
    | "action"
    | "dialogue"
    | "ending"

  text: string

}