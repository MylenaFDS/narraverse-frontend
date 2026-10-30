import type { Character } from "../../types/character"

import type {
  ActionRequest,
  ActionType,
} from "../ActionEngine"


// ============================================================
// OPÇÕES DO PARSER
// ============================================================

export interface ActionParserOptions {

  /**
   * Personagens disponíveis para identificar
   * o alvo da ação.
   */
  characters?: Character[]

  /**
   * Dificuldade explícita da ação.
   *
   * Exemplo:
   *
   * "investiga a porta dificuldade 18"
   */
  difficulty?: number

}


// ============================================================
// RESULTADO DO PARSER
// ============================================================

export interface ParsedAction {

  request: ActionRequest

  text: string

}


// ============================================================
// ACTION PARSER
// ============================================================

export class ActionParser {


  // ==========================================================
  // PARSE
  // ==========================================================

  static parse(
    text: string,
    actor: Character,
    options: ActionParserOptions = {},
  ): ActionRequest {

    const normalized =
      this.normalize(text)


    const detectedType =
  this.detectAction(
    normalized,
  )

const type =
  detectedType ?? "wait"


    const target =
      this.detectTarget(
        normalized,
        options.characters ?? [],
        actor,
      )


    const expression =
      this.detectExpression(
        text,
      )


    const difficulty =
      options.difficulty ??
      this.detectDifficulty(
        normalized,
      )


    const attribute =
      this.detectAttribute(
        normalized,
      )


    const request: ActionRequest = {

      type,

      actor,

    }


    if (target) {

      request.target =
        target

    }


    if (expression) {

      request.expression =
        expression

    }


    if (
      difficulty !==
      undefined
    ) {

      request.difficulty =
        difficulty

    }


    if (attribute) {

      request.attribute =
        attribute

    }


    return request

  }

  static parseIfRecognized(
  text: string,
  actor: Character,
  options: ActionParserOptions = {},
): ActionRequest | null {

  const normalized =
    this.normalize(text)

  const detectedType =
    this.detectAction(
      normalized,
    )

  if (detectedType === null) {
    return null
  }

  return this.parse(
    text,
    actor,
    options,
  )
}


  // ==========================================================
  // NORMALIZAÇÃO
  // ==========================================================

  private static normalize(
    text: string,
  ): string {

    return text
      .trim()
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        "",
      )

  }


  // ==========================================================
  // DETECTAR AÇÃO
  // ==========================================================

  private static detectAction(
  text: string,
): ActionType | null {

    // --------------------------------------------------------
// ATAQUE
// --------------------------------------------------------

if (
  this.matches(
    text,
    [
      "ataca",
      "atacar",
      "ataque",
      "golpeia",
      "golpear",
      "agride",
      "agredir",
      "investida",
      "dispara contra",

      // Novas formas de reconhecer uma intenção de ataque
      "tenta acertar",
      "tentando acertar",
      "acerta",
      "acertar",
      "tenta atingir",
      "tentando atingir",
      "atinge",
      "atingir",
      "desfere um golpe",
      "golpe forte",
    ],
  )
) {
  return "attack"
}

    // --------------------------------------------------------
    // MAGIA
    // --------------------------------------------------------

    if (
      this.matches(
        text,
        [
          "lanca uma magia",
          "lanca magia",
          "lancar magia",
          "conjura",
          "conjurar",
          "usa magia",
          "usa um feitiço",
          "usa um feitico",
          "feitico",
          "feitiço",
        ],
      )
    ) {

      return "spell"

    }


    // --------------------------------------------------------
    // INVESTIGAÇÃO
    // --------------------------------------------------------

    if (
      this.matches(
        text,
        [
          "investiga",
          "investigar",
          "examina",
          "examinar",
          "procura pistas",
          "procurar pistas",
          "observa atentamente",
          "analisa",
          "analisar",
        ],
      )
    ) {

      return "investigate"

    }


    // --------------------------------------------------------
    // HABILIDADE
    // --------------------------------------------------------

    if (
      this.matches(
        text,
        [
          "usa uma habilidade",
          "usa habilidade",
          "usa sua habilidade",
          "utiliza habilidade",
          "tenta uma habilidade",
        ],
      )
    ) {

      return "skill"

    }


    // --------------------------------------------------------
    // FUGA
    // --------------------------------------------------------

    if (
      this.matches(
        text,
        [
          "foge",
          "fugir",
          "fuga",
          "corre para longe",
          "corre",
        ],
      )
    ) {

      return "flee"

    }


    // --------------------------------------------------------
    // ESCAPE
    // --------------------------------------------------------

    if (
      this.matches(
        text,
        [
          "escapa",
          "escapar",
          "tenta escapar",
          "tentar escapar",
          "se liberta",
          "libertar-se",
        ],
      )
    ) {

      return "escape"

    }


    // --------------------------------------------------------
    // RETIRADA
    // --------------------------------------------------------

    if (
      this.matches(
        text,
        [
          "recua",
          "recuar",
          "retira-se",
          "retirar-se",
          "faz uma retirada",
        ],
      )
    ) {

      return "retreat"

    }


    // --------------------------------------------------------
    // DEFESA
    // --------------------------------------------------------

    if (
      this.matches(
        text,
        [
          "defende",
          "defender",
          "defesa",
          "assume postura defensiva",
          "protege-se",
          "proteger-se",
        ],
      )
    ) {

      return "defend"

    }


    // --------------------------------------------------------
    // MOVIMENTO
    // --------------------------------------------------------

    if (
      this.matches(
        text,
        [
          "anda",
          "andar",
          "caminha",
          "caminhar",
          "vai para",
          "segue para",
          "move-se",
          "mover-se",
          "se aproxima",
          "aproxima-se",
          "avanca",
          "avançar",
        ],
      )
    ) {

      return "move"

    }


    // --------------------------------------------------------
    // EXPLORAÇÃO
    // --------------------------------------------------------

    if (
      this.matches(
        text,
        [
          "explora",
          "explorar",
          "vasculha",
          "vasculhar",
          "percorre a regiao",
          "percorre a região",
        ],
      )
    ) {

      return "explore"

    }


    // --------------------------------------------------------
    // CONVERSA
    // --------------------------------------------------------

    if (
      this.matches(
        text,
        [
          "fala com",
          "falar com",
          "conversa com",
          "conversar com",
          "dialoga com",
          "dialogar com",
          "diz para",
          "pergunta",
          "responde",
        ],
      )
    ) {

      return "talk"

    }


    // --------------------------------------------------------
    // DESCANSO
    // --------------------------------------------------------

    if (
      this.matches(
        text,
        [
          "descansa",
          "descansar",
          "dorme",
          "dormir",
          "faz uma pausa",
          "para para descansar",
        ],
      )
    ) {

      return "rest"

    }


    // --------------------------------------------------------
    // ESPERA
    // --------------------------------------------------------

    if (
      this.matches(
        text,
        [
          "espera",
          "esperar",
          "aguarda",
          "aguardar",
          "fica parado",
          "permanece parado",
        ],
      )
    ) {

      return "wait"

    }


    // --------------------------------------------------------
    // OBJETIVO
    // --------------------------------------------------------

    if (
      this.matches(
        text,
        [
          "avanca em direcao",
          "avança em direção",
          "prossegue em direcao",
          "prossegue em direção",
          "segue em direcao",
          "segue em direção",
          "aproxima-se do objetivo",
          "avanca para o objetivo",
        ],
      )
    ) {

      return "advance_goal"

    }


    // --------------------------------------------------------
    // PADRÃO
    // --------------------------------------------------------

    return null

  }


  // ==========================================================
  // DETECTAR ALVO
  // ==========================================================

  private static detectTarget(
    text: string,
    characters: Character[],
    actor: Character,
  ): Character | undefined {

    const available =
      characters.filter(
        (character) =>
          character.id !==
          actor.id,
      )


    if (
      available.length ===
      0
    ) {

      return undefined

    }


    /*
     * Primeiro tenta encontrar
     * o nome completo.
     */

    const exact =
      available.find(
        (character) =>
          text.includes(
            this.normalize(
              character.name,
            ),
          ),
      )


    if (exact) {

      return exact

    }


    /*
     * Depois tenta nomes sem acentos
     * e comparação por palavras.
     */

    return available.find(
      (character) => {

        const name =
          this.normalize(
            character.name,
          )

        const words =
          name.split(
            /\s+/,
          )


        return words.some(
          (word) =>
            word.length >= 3 &&
            text.includes(
              word,
            ),
        )

      },
    )

  }


  // ==========================================================
  // DETECTAR EXPRESSÃO
  // ==========================================================

  private static detectExpression(
    text: string,
  ): string | undefined {

    /*
     * Formato principal utilizado
     * pelo Narraverse:
     *
     * [[1d20]]
     *
     * Também aceita:
     *
     * [[1d20+3]]
     * [[2d6]]
     * [[1d20-2]]
     */

    const bracketMatch =
      text.match(
        /\[\[\s*(\d+d\d+(?:[+-]\d+)?)\s*\]\]/i,
      )


    if (bracketMatch) {

      return bracketMatch[1]

    }


    /*
     * Aceita também uma expressão
     * escrita diretamente.
     */

    const diceMatch =
      text.match(
        /\b(\d+d\d+(?:[+-]\d+)?)\b/i,
      )


    if (diceMatch) {

      return diceMatch[1]

    }


    return undefined

  }


  // ==========================================================
  // DETECTAR DIFICULDADE
  // ==========================================================

  private static detectDifficulty(
    text: string,
  ): number | undefined {

    const match =
      text.match(
        /(?:dificuldade|dif|dc)\s*(?:=|:)?\s*(\d+)/i,
      )


    if (!match) {

      return undefined

    }


    const difficulty =
      Number(
        match[1],
      )


    if (
      !Number.isInteger(
        difficulty,
      )
    ) {

      return undefined

    }


    return difficulty

  }


  // ==========================================================
  // DETECTAR ATRIBUTO
  // ==========================================================

  private static detectAttribute(
    text: string,
  ): string | undefined {

    if (
      this.matches(
        text,
        [
          "forca",
          "força",
        ],
      )
    ) {

      return "Força"

    }


    if (
      this.matches(
        text,
        [
          "destreza",
        ],
      )
    ) {

      return "Destreza"

    }


    if (
      this.matches(
        text,
        [
          "inteligencia",
          "inteligência",
        ],
      )
    ) {

      return "Inteligência"

    }


    if (
      this.matches(
        text,
        [
          "sabedoria",
        ],
      )
    ) {

      return "Sabedoria"

    }


    if (
      this.matches(
        text,
        [
          "carisma",
        ],
      )
    ) {

      return "Carisma"

    }


    return undefined

  }


  // ==========================================================
  // MATCH
  // ==========================================================

  private static matches(
    text: string,
    values: string[],
  ): boolean {

    return values.some(
      (value) => {

        const normalizedValue =
          this.normalize(
            value,
          )


        /*
         * Para expressões com espaços,
         * usamos includes.
         */

        return text.includes(
          normalizedValue,
        )

      },
    )

  }

}

