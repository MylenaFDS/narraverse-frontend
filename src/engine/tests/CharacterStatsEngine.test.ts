import { describe, expect, it } from "vitest"

import type { Character } from "../../types/character"

import {
  CharacterStatsEngine,
} from "../CharacterStatsEngine"


const character: Character = {

  id: 1,

  name: "Guerreiro",

  description: "Guerreiro de teste.",

  history: null,

  world_lore_id: null,

  faction_id: null,

  faction: null,

  image_url: null,

  inventory: [],

  user_id: 1,

  rpg_id: 1,

  is_npc: false,

  sheet_values: [

    {
      id: 1,

      value: "16",

      field: {
        id: 1,
        name: "Força",
        field_type: "number",
      },
    },

    {
      id: 2,

      value: "12",

      field: {
        id: 2,
        name: "Destreza",
        field_type: "number",
      },
    },

  ],

}


describe("CharacterStatsEngine", () => {

  it("deve ler a Força corretamente", () => {

    const strength =
      CharacterStatsEngine.getValue(
        character,
        ["Força"],
        0,
      )

    expect(strength).toBe(16)

  })


  it("deve calcular o modificador de ataque", () => {

    const modifier =
      CharacterStatsEngine.getAttackModifier(
        character,
      )

    expect(modifier).toBe(3)

  })

})