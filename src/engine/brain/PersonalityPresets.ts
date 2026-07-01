import type {
  Personality,
} from "./PersonalityTypes"

export const PersonalityPresets = {

  hero: {

    courage: 90,

    honor: 95,

    empathy: 80,

    greed: 5,

    curiosity: 60,

    patience: 70,

    cruelty: 0,

    ambition: 50,

    loyalty: 90,

    intelligence: 70,

  } satisfies Personality,

  merchant: {

    courage: 20,

    honor: 40,

    empathy: 50,

    greed: 95,

    curiosity: 50,

    patience: 90,

    cruelty: 20,

    ambition: 95,

    loyalty: 30,

    intelligence: 80,

  } satisfies Personality,

  villain: {

    courage: 80,

    honor: 5,

    empathy: 0,

    greed: 90,

    curiosity: 40,

    patience: 40,

    cruelty: 100,

    ambition: 95,

    loyalty: 15,

    intelligence: 90,

  } satisfies Personality,

}