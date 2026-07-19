export interface NarrativeFragment {

  type:
    | "observation"
    | "emotion"
    | "action"
    | "dialogue"
    | "thought"
    | "movement"
    | "description"
    | "ending"

  text: string

}