export interface Desire {

  id: string

  title: string

  intensity: number

  category:

    | "power"
    | "survival"
    | "wealth"
    | "knowledge"
    | "love"
    | "revenge"
    | "faith"
    | "friendship"
    | "honor"
    | "curiosity"

}