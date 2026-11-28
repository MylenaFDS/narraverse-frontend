
import type { CombatState } from "./CombatState"

import {
  CombatStateEngine,
} from "./CombatState"

import {
  CombatTurnEngine,
} from "./CombatTurnEngine"

// ============================================================
// CONFIGURAÇÃO DA SURPRESA
// ============================================================

export interface CombatOpeningInput {
  participantIds: number[]
}

// ============================================================
// ENGINE DE INÍCIO DO COMBATE
// ============================================================

export class CombatStartEngine {

  // ==========================================================
  // INICIAR COMBATE
  // ==========================================================

  static start(
    state: CombatState,
    opening?: CombatOpeningInput,
  ): CombatState {

    if (state.finished || CombatStateEngine.isFinished(state)) {
      return {
        ...state,
        phase: "finished",
        finished: true,
        activeParticipantId: null,
        openingOrder: [],
        openingIndex: 0,
      }
    }

    const openingParticipantIds =
      opening?.participantIds ?? []

    if (openingParticipantIds.length > 0) {
      const openingState =
        CombatStateEngine.startOpening(
          state,
          openingParticipantIds,
        )

      if (openingState.phase === "opening") {
        return openingState
      }
    }

    const initiativeState =
      CombatTurnEngine.start(state)

    return {
      ...initiativeState,
      phase: initiativeState.finished
        ? "finished"
        : "initiative",
      openingOrder: [],
      openingIndex: 0,
    }
  }

  // ==========================================================
  // AVANÇAR ABERTURA
  // ==========================================================

  static advanceOpening(
    state: CombatState,
  ): CombatState {

    if (state.phase !== "opening") {
      return state
    }

    const nextState =
      CombatStateEngine.advanceOpening(state)

    if (nextState.phase === "finished") {
      return {
        ...nextState,
        finished: true,
        activeParticipantId: null,
      }
    }

    if (nextState.phase === "initiative") {
      const initiativeState =
        CombatTurnEngine.start(nextState)

      return {
        ...initiativeState,
        phase: initiativeState.finished
          ? "finished"
          : "initiative",
        openingOrder: [],
        openingIndex: 0,
      }
    }

    return nextState
  }

}
