import type {
  Personality,
} from "../types/Personality"


export interface PersonalityProfile {

  traits: string[]

  narrativeTone: string

}



export class PersonalityInterpreterEngine {


  static analyze(
    personality: Personality,
  ): PersonalityProfile {


    const traits: string[] = []



    if (personality.intelligence >= 80) {

      traits.push(
        "muito inteligente",
      )

    }


    if (personality.courage >= 80) {

      traits.push(
        "destemido",
      )

    }


    if (personality.empathy >= 80) {

      traits.push(
        "compassivo",
      )

    }


    if (personality.cruelty >= 80) {

      traits.push(
        "cruel",
      )

    }


    if (personality.patience >= 80) {

      traits.push(
        "paciente",
      )

    }


    if (personality.curiosity >= 80) {

      traits.push(
        "curioso",
      )

    }


    if (personality.honor >= 80) {

      traits.push(
        "honrado",
      )

    }


    if (personality.loyalty >= 80) {

      traits.push(
        "leal",
      )

    }


    if (personality.greed >= 80) {

      traits.push(
        "ambicioso",
      )

    }


    return {

      traits,


      narrativeTone:
        this.createTone(
          traits,
        ),

    }

  }



  private static createTone(
    traits: string[],
  ): string {


    if (
      traits.includes("cruel")
      &&
      traits.includes("muito inteligente")
    ) {

      return "frio e calculista"

    }


    if (
      traits.includes("honrado")
      &&
      traits.includes("destemido")
    ) {

      return "heroico e determinado"

    }


    if (
      traits.includes("curioso")
      &&
      traits.includes("muito inteligente")
    ) {

      return "reflexivo e observador"

    }


    return "equilibrado"

  }

}