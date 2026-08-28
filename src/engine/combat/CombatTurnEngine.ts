import {
  CombatStateEngine,
  type CombatParticipantState,
  type CombatState,
} from "./CombatState"


// ============================================================
// RESULTADO DA INICIATIVA
// ============================================================

export interface CombatInitiative {

  characterId: number

  roll: number

}


// ============================================================
// ENGINE DE TURNOS
// ============================================================

export class CombatTurnEngine {


  // ==========================================================
  // ROLAR INICIATIVA
  // ==========================================================

  static rollInitiative(
    state: CombatState,
  ): CombatInitiative[] {

    const initiatives =
      state.participants
        .filter(
          participant =>
            !participant.defeated,
        )
        .map(
          participant => {

            const dexterity =
              this.getDexterity(
                participant,
              )

            const roll =
              Math.floor(
                Math.random() * 20,
              ) + 1

            return {

              characterId:
                participant.character.id,

              roll:
                roll + dexterity,

            }

          },
        )

    return initiatives.sort(
      (a, b) =>
        b.roll - a.roll,
    )

  }


  // ==========================================================
  // DESTRZA / MODIFICADOR
  // ==========================================================

  private static getDexterity(
    participant: CombatParticipantState,
  ): number {

    const value =
      participant.character.sheet_values
        ?.find(
          sheetValue => {

            const name =
              sheetValue.field.name
                .trim()
                .toLowerCase()

            return (
              name === "destreza" ||
              name === "dexterity" ||
              name === "agilidade"
            )

          },
        )
        ?.value

    const dexterity =
      Number(value)

    if (
      Number.isNaN(dexterity)
    ) {

      return 0

    }

    return Math.floor(
      (dexterity - 10) / 2,
    )

  }


  // ==========================================================
  // INICIAR COMBATE
  //
  // Rola iniciativa e grava a ordem no estado.
  // ==========================================================

  static start(
    state: CombatState,
  ): CombatState {

    const alive =
      CombatStateEngine.getAliveParticipants(
        state,
      )

    if (
      alive.length === 0
    ) {

      return {

        ...state,

        initiativeOrder:
          [],

        activeParticipantId:
          null,

        finished:
          true,

      }

    }

    if (
      alive.length === 1
    ) {

      return {

        ...state,

        initiativeOrder:
          [
            alive[0].character.id,
          ],

        activeParticipantId:
          alive[0].character.id,

        finished:
          true,

      }

    }

    const initiatives =
      this.rollInitiative(
        state,
      )

    const initiativeOrder =
      initiatives.map(
        initiative =>
          initiative.characterId,
      )

    return {

      ...state,

      initiativeOrder,

      round:
        1,

      activeParticipantId:
        initiativeOrder[0] ??
        null,

      finished:
        false,

    }

  }


  // ==========================================================
  // PRÓXIMO TURNO
  // ==========================================================

  static nextTurn(
    state: CombatState,
  ): CombatState {

    if (
      CombatStateEngine.isFinished(
        state,
      )
    ) {

      return {

        ...state,

        activeParticipantId:
          null,

        finished:
          true,

      }

    }

    const aliveIds =
      new Set(
        CombatStateEngine
          .getAliveParticipants(
            state,
          )
          .map(
            participant =>
              participant.character.id,
          ),
      )

    const initiativeOrder =
      state.initiativeOrder
        .filter(
          id =>
            aliveIds.has(id),
        )

    if (
      initiativeOrder.length === 0
    ) {

      return {

        ...state,

        activeParticipantId:
          null,

        finished:
          true,

      }

    }

    const currentIndex =
      initiativeOrder.findIndex(
        id =>
          id ===
          state.activeParticipantId,
      )

    const nextIndex =
      currentIndex === -1
        ? 0
        : (
            currentIndex + 1
          ) %
          initiativeOrder.length

    const wrapped =
      currentIndex !== -1 &&
      nextIndex === 0

    return {

      ...state,

      initiativeOrder,

      activeParticipantId:
        initiativeOrder[nextIndex],

      round:
        wrapped
          ? state.round + 1
          : state.round,

      finished:
        false,

    }

  }


  // ==========================================================
  // VERIFICAR SE PODE AGIR
  // ==========================================================

  static canAct(
    state: CombatState,
    characterId: number,
  ): boolean {

    if (
      state.finished
    ) {

      return false

    }

    const participant =
      state.participants.find(
        participant =>
          participant.character.id ===
          characterId,
      )

    if (!participant) {

      return false

    }

    if (
      participant.defeated
    ) {

      return false

    }

    return (
      state.activeParticipantId ===
      characterId
    )

  }


  // ==========================================================
  // PARTICIPANTE ATIVO
  // ==========================================================

  static getActiveParticipant(
    state: CombatState,
  ): CombatParticipantState | null {

    if (
      state.activeParticipantId === null
    ) {

      return null

    }

    return (
      state.participants.find(
        participant =>
          participant.character.id ===
          state.activeParticipantId,
      ) ??
      null
    )

  }


  // ==========================================================
  // OBTER ORDEM DE INICIATIVA
  // ==========================================================

  static getInitiativeOrder(
    state: CombatState,
  ): CombatParticipantState[] {

    const participants =
      new Map(
        state.participants.map(
          participant => [
            participant.character.id,
            participant,
          ],
        ),
      )

    return state.initiativeOrder
      .map(
        id =>
          participants.get(id),
      )
      .filter(
        (
          participant,
        ): participant is CombatParticipantState =>
          participant !== undefined &&
          !participant.defeated,
      )

  }

}