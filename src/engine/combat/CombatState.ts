
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

    const hp = Math.max(0, maxHP)

    return {
      character,
      currentHP: hp,
      maxHP: hp,
      defeated: hp <= 0,
    }
  }

  // ==========================================================
  // CRIAR COMBATE
  // ==========================================================

  static create(
    participants: CombatParticipantState[],
  ): CombatState {

    const aliveParticipants =
      participants.filter(
        participant => !participant.defeated,
      )

    const finished =
      aliveParticipants.length <= 1

    return {
      participants,

      initiativeOrder:
        aliveParticipants.map(
          participant => participant.character.id,
        ),

      round: 1,

      activeParticipantId:
        finished
          ? null
          : aliveParticipants[0].character.id,

      finished,
    }
  }

  // ==========================================================
  // PARTICIPANTES VIVOS
  // ==========================================================

  static getAliveParticipants(
    state: CombatState,
  ): CombatParticipantState[] {

    return state.participants.filter(
      participant => !participant.defeated,
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
      Math.max(0, Number.isFinite(damage) ? damage : 0)

    const currentHP =
      Math.max(
        0,
        participant.currentHP - safeDamage,
      )

    return {
      ...participant,
      currentHP,
      defeated: currentHP <= 0,
    }
  }

  // ==========================================================
  // VERIFICAR FIM DO COMBATE
  // ==========================================================

  static isFinished(
    state: CombatState,
  ): boolean {

    return (
      this.getAliveParticipants(state).length <= 1
    )
  }

  // ==========================================================
  // AVANÇAR RODADA
  // ==========================================================

  static nextRound(
    state: CombatState,
  ): CombatState {

    if (this.isFinished(state)) {
      return {
        ...state,
        finished: true,
        activeParticipantId: null,
      }
    }

    return {
      ...state,
      round: state.round + 1,
    }
  }
}
