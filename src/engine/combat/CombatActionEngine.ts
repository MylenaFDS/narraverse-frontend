import type { Character } from "../../types/character"

import type { WorldContext } from "../context/ContextEngine"

import {
  CombatEngine,
  type CombatAction,
  type CombatResult,
} from "./CombatEngine"

import {
  CombatStateEngine,
  type CombatState,
} from "./CombatState"


// ============================================================
// PARTICIPANTE DA AÇÃO
// ============================================================

export interface CombatActionInput {

  attacker: Character

  defender: Character

  action:
    | "attack"
    | "spell"
    | "skill"

}


// ============================================================
// RESULTADO DA AÇÃO
// ============================================================

export interface CombatActionResult {

  combat: CombatResult

  state: CombatState

}


// ============================================================
// ENGINE DE AÇÕES DE COMBATE
// ============================================================

export class CombatActionEngine {


  // ==========================================================
  // EXECUTAR AÇÃO
  // ==========================================================

  static execute(
    context: WorldContext,
    state: CombatState,
    input: CombatActionInput,
  ): CombatActionResult {


    // ========================================================
    // LOCALIZAR PARTICIPANTES
    // ========================================================

    const attacker =
      state.participants.find(
        participant =>
          participant.character.id ===
          input.attacker.id,
      )


    const defender =
      state.participants.find(
        participant =>
          participant.character.id ===
          input.defender.id,
      )


    if (!attacker) {
      throw new Error(
        "Atacante não participa deste combate.",
      )
    }


    if (!defender) {
      throw new Error(
        "Defensor não participa deste combate.",
      )
    }


    // ========================================================
    // VERIFICAR COMBATE ENCERRADO
    // ========================================================

    if (state.finished) {

      throw new Error(
        "O combate já foi encerrado.",
      )

    }


    // ========================================================
    // VERIFICAR DERROTA
    // ========================================================

    if (attacker.defeated) {

      throw new Error(
        "O atacante está derrotado.",
      )

    }


    if (defender.defeated) {

      throw new Error(
        "O defensor já está derrotado.",
      )

    }


    // ========================================================
    // CRIAR AÇÃO
    // ========================================================

    const combatAction: CombatAction = {

      attacker: {
        character:
          attacker.character,
      },

      defender: {
        character:
          defender.character,
      },

      action:
        input.action,

    }


    // ========================================================
    // RESOLVER COMBATE
    // ========================================================

    const combatResult =
      CombatEngine.resolve(
        context,
        combatAction,
      )


    // ========================================================
    // APLICAR DANO
    // ========================================================

    const updatedParticipants =
      state.participants.map(
        participant => {

          if (
            participant.character.id !==
            defender.character.id
          ) {

            return participant

          }


          return CombatStateEngine.applyDamage(
            participant,
            combatResult.damage,
          )

        },
      )


    // ========================================================
    // NOVO ESTADO
    // ========================================================

    let nextState: CombatState = {

      ...state,

      participants:
        updatedParticipants,

    }


    // ========================================================
    // VERIFICAR FIM
    // ========================================================

    if (
      CombatStateEngine.isFinished(
        nextState,
      )
    ) {

      nextState = {

        ...nextState,

        finished: true,

      }

    }


    // ========================================================
    // RETORNAR
    // ========================================================

    return {

      combat:
        combatResult,

      state:
        nextState,

    }

  }

}