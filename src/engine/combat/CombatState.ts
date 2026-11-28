
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
// FASES DO COMBATE
// ============================================================

export type CombatPhase =
  | "opening"
  | "initiative"
  | "finished"

// ============================================================
// ESTADO DO COMBATE
// ============================================================

export interface CombatState {
  participants: CombatParticipantState[]
  initiativeOrder: number[]
  round: number
  activeParticipantId: number | null
  finished: boolean

  // Controle da fase de abertura
  // Opcionais para preservar compatibilidade
  // com estados criados anteriormente.

  phase?: CombatPhase
  openingOrder?: number[]
  openingIndex?: number
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

      phase:
        finished
          ? "finished"
          : "initiative",

      openingOrder: [],
      openingIndex: 0,
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
  // INICIAR FASE DE ABERTURA
  // ==========================================================

  static startOpening(
    state: CombatState,
    participantIds: number[],
  ): CombatState {

    if (state.finished || this.isFinished(state)) {
      return {
        ...state,
        phase: "finished",
        finished: true,
        activeParticipantId: null,
        openingOrder: [],
        openingIndex: 0,
      }
    }

    const aliveIds = new Set(
      this.getAliveParticipants(state).map(
        participant => participant.character.id,
      ),
    )

    const openingOrder = [
      ...new Set(
        participantIds.filter(
          id => aliveIds.has(id),
        ),
      ),
    ]

    if (openingOrder.length === 0) {
      return {
        ...state,
        phase: "initiative",
        openingOrder: [],
        openingIndex: 0,
      }
    }

    return {
      ...state,
      phase: "opening",
      openingOrder,
      openingIndex: 0,
      activeParticipantId: openingOrder[0],
      finished: false,
    }
  }

  // ==========================================================
  // AVANÇAR FASE DE ABERTURA
  // ==========================================================

  static advanceOpening(
    state: CombatState,
  ): CombatState {

    if (state.phase !== "opening") {
      return state
    }

    const aliveIds = new Set(
      this.getAliveParticipants(state).map(
        participant => participant.character.id,
      ),
    )

    const remainingOrder =
      (state.openingOrder ?? []).filter(
        id => aliveIds.has(id),
      )

    const currentIndex =
      remainingOrder.findIndex(
        id => id === state.activeParticipantId,
      )

    const nextIndex = currentIndex + 1

    if (nextIndex >= remainingOrder.length) {
      return {
        ...state,
        phase: "initiative",
        openingOrder: [],
        openingIndex: 0,
        activeParticipantId: null,
      }
    }

    return {
      ...state,
      openingOrder: remainingOrder,
      openingIndex: nextIndex,
      activeParticipantId: remainingOrder[nextIndex],
    }
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
        phase: "finished",
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
