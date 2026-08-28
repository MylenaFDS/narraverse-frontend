import type { Character } from "../../types/character"


// ============================================================
// ESTADO DE UM PARTICIPANTE
// ============================================================

export interface CombatParticipantState {

  character: Character

  currentHP: number

  maxHP: number

  defeated: boolean

}


// ============================================================
// ESTADO DO COMBATE
// ============================================================

export interface CombatState {

  participants: CombatParticipantState[]

  /**
   * IDs dos personagens na ordem em que agirão.
   *
   * Exemplo:
   *
   * [3, 1, 2]
   *
   * significa:
   *
   * personagem 3 → personagem 1 → personagem 2
   */
  initiativeOrder: number[]

  round: number

  activeParticipantId: number | null

  finished: boolean

}


// ============================================================
// ENGINE DO ESTADO
// ============================================================

export class CombatStateEngine {


  // ==========================================================
  // CRIAR PARTICIPANTE
  // ==========================================================

  static createParticipant(
    character: Character,
    maxHP: number,
  ): CombatParticipantState {

    const hp =
      Math.max(
        1,
        maxHP,
      )

    return {

      character,

      currentHP:
        hp,

      maxHP:
        hp,

      defeated:
        false,

    }

  }


  // ==========================================================
  // CRIAR COMBATE
  // ==========================================================

  static create(
    participants: CombatParticipantState[],
  ): CombatState {

    return {

      participants,

      initiativeOrder:
        participants.map(
          participant =>
            participant.character.id,
        ),

      round:
        1,

      activeParticipantId:
        participants[0]?.character.id ??
        null,

      finished:
        participants.length <= 1,

    }

  }


  // ==========================================================
  // PARTICIPANTES VIVOS
  // ==========================================================

  static getAliveParticipants(
    state: CombatState,
  ): CombatParticipantState[] {

    return state.participants.filter(
      participant =>
        !participant.defeated,
    )

  }


  // ==========================================================
  // APLICAR DANO
  // ==========================================================

  static applyDamage(
    participant: CombatParticipantState,
    damage: number,
  ): CombatParticipantState {

    const safeDamage =
      Math.max(
        0,
        damage,
      )

    const currentHP =
      Math.max(
        0,
        participant.currentHP - safeDamage,
      )

    return {

      ...participant,

      currentHP,

      defeated:
        currentHP <= 0,

    }

  }


  // ==========================================================
  // VERIFICAR FIM DO COMBATE
  // ==========================================================

  static isFinished(
    state: CombatState,
  ): boolean {

    return (
      this.getAliveParticipants(
        state,
      ).length <= 1
    )

  }


  // ==========================================================
  // AVANÇAR RODADA
  // ==========================================================

  static nextRound(
    state: CombatState,
  ): CombatState {

    if (
      this.isFinished(state)
    ) {

      return {

        ...state,

        finished:
          true,

        activeParticipantId:
          null,

      }

    }

    return {

      ...state,

      round:
        state.round + 1,

    }

  }

}