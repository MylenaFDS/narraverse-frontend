import { describe, expect, it } from "vitest"

import {
  ActionParser,
} from "../action/ActionParser"

import type {
  Character,
} from "../../types/character"


function createCharacter(
  id: number,
  name: string,
): Character {

  return {
    id,
    name,
  } as Character

}


describe(
  "ActionParser",
  () => {


    const aragorn =
      createCharacter(
        1,
        "Aragorn",
      )


    const orc =
      createCharacter(
        2,
        "Orc",
      )


    const characters = [
      aragorn,
      orc,
    ]


    // ========================================================
    // ATAQUE
    // ========================================================

    it(
      "deve identificar uma ação de ataque",
      () => {

        const result =
          ActionParser.parse(
            "Aragorn ataca o Orc",
            aragorn,
            {
              characters,
            },
          )


        expect(
          result.type,
        ).toBe("attack")


        expect(
          result.target,
        ).toEqual(orc)

      },
    )


    // ========================================================
    // INVESTIGAÇÃO
    // ========================================================

    it(
      "deve identificar uma investigação",
      () => {

        const result =
          ActionParser.parse(
            "Aragorn investiga a porta",
            aragorn,
            {
              characters,
            },
          )


        expect(
          result.type,
        ).toBe("investigate")

      },
    )


    // ========================================================
    // DADO
    // ========================================================

    it(
      "deve identificar uma expressão de dados",
      () => {

        const result =
          ActionParser.parse(
            "Aragorn investiga a porta [[1d20]]",
            aragorn,
            {
              characters,
            },
          )


        expect(
          result.type,
        ).toBe("investigate")


        expect(
          result.expression,
        ).toBe("1d20")

      },
    )


    // ========================================================
    // DIFICULDADE
    // ========================================================

    it(
      "deve identificar a dificuldade",
      () => {

        const result =
          ActionParser.parse(
            "Aragorn investiga a porta [[1d20]] dificuldade 18",
            aragorn,
            {
              characters,
            },
          )


        expect(
          result.difficulty,
        ).toBe(18)

      },
    )


    // ========================================================
    // ATRIBUTO
    // ========================================================

    it(
      "deve identificar o atributo",
      () => {

        const result =
          ActionParser.parse(
            "Aragorn tenta abrir a porta usando Destreza",
            aragorn,
            {
              characters,
            },
          )


        expect(
          result.attribute,
        ).toBe("Destreza")

      },
    )


    // ========================================================
    // MAGIA
    // ========================================================

    it(
      "deve identificar uma magia",
      () => {

        const result =
          ActionParser.parse(
            "Aragorn conjura uma magia",
            aragorn,
            {
              characters,
            },
          )


        expect(
          result.type,
        ).toBe("spell")

      },
    )


    // ========================================================
    // HABILIDADE
    // ========================================================

    it(
      "deve identificar uma habilidade",
      () => {

        const result =
          ActionParser.parse(
            "Aragorn usa uma habilidade",
            aragorn,
            {
              characters,
            },
          )


        expect(
          result.type,
        ).toBe("skill")

      },
    )


    // ========================================================
    // FUGA
    // ========================================================

    it(
      "deve identificar fuga",
      () => {

        const result =
          ActionParser.parse(
            "Aragorn foge",
            aragorn,
            {
              characters,
            },
          )


        expect(
          result.type,
        ).toBe("flee")

      },
    )


    // ========================================================
    // DEFESA
    // ========================================================

    it(
      "deve identificar defesa",
      () => {

        const result =
          ActionParser.parse(
            "Aragorn assume postura defensiva",
            aragorn,
            {
              characters,
            },
          )


        expect(
          result.type,
        ).toBe("defend")

      },
    )


    // ========================================================
    // MOVIMENTO
    // ========================================================

    it(
      "deve identificar movimento",
      () => {

        const result =
          ActionParser.parse(
            "Aragorn caminha até a floresta",
            aragorn,
            {
              characters,
            },
          )


        expect(
          result.type,
        ).toBe("move")

      },
    )


    // ========================================================
    // EXPLORAÇÃO
    // ========================================================

    it(
      "deve identificar exploração",
      () => {

        const result =
          ActionParser.parse(
            "Aragorn explora a região",
            aragorn,
            {
              characters,
            },
          )


        expect(
          result.type,
        ).toBe("explore")

      },
    )


    // ========================================================
    // CONVERSA
    // ========================================================

    it(
      "deve identificar conversa",
      () => {

        const result =
          ActionParser.parse(
            "Aragorn conversa com o Orc",
            aragorn,
            {
              characters,
            },
          )


        expect(
          result.type,
        ).toBe("talk")


        expect(
          result.target,
        ).toEqual(orc)

      },
    )


    // ========================================================
    // DESCANSO
    // ========================================================

    it(
      "deve identificar descanso",
      () => {

        const result =
          ActionParser.parse(
            "Aragorn descansa",
            aragorn,
            {
              characters,
            },
          )


        expect(
          result.type,
        ).toBe("rest")

      },
    )


    // ========================================================
    // ESPERA
    // ========================================================

    it(
      "deve identificar espera",
      () => {

        const result =
          ActionParser.parse(
            "Aragorn aguarda",
            aragorn,
            {
              characters,
            },
          )


        expect(
          result.type,
        ).toBe("wait")

      },
    )


    // ========================================================
    // RETIRADA
    // ========================================================

    it(
      "deve identificar retirada",
      () => {

        const result =
          ActionParser.parse(
            "Aragorn recua",
            aragorn,
            {
              characters,
            },
          )


        expect(
          result.type,
        ).toBe("retreat")

      },
    )


  },
)