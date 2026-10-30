import type {
  Character,
} from "../../types/character"

import type {
  Lore,
} from "../../types/lore"

import type {
  Faction,
} from "../../types/faction"

import type {
  RPGTurn,
} from "../../types/turn"

import {
  ActionParser,
} from "./ActionParser"

import {
  ActionExecutionEngine,
  type ActionExecutionResult,
} from "./ActionExecutionEngine"

import {
  BrainProfileBuilder,
} from "../brain/BrainProfileBuilder"

import {
  WorldContextBuilder,
} from "../context/WorldContextBuilder"

import {
  TurnAdapter,
} from "../adapters/TurnAdapter"

import {
  CharacterStatsEngine,
} from "../CharacterStatsEngine"

import {
  CombatStateEngine,
  type CombatState,
} from "../combat/CombatState"


// ============================================================
// PARÂMETROS
// ============================================================

export interface TurnActionIntegrationParams {

  text: string

  actor: Character

  characters: Character[]

  lore: Lore[]

  factions?: Faction[]

  npcs?: Character[]

  recentTurns?: RPGTurn[]

  difficulty?: number

  /**
   * Estado temporário do combate.
   * Deve ser devolvido pelo resultado de uma ação
   * e reutilizado nos próximos turnos.
   */
  combatState?: CombatState

}


// ============================================================
// INTEGRAÇÃO DAS AÇÕES COM O MUNDO
// ============================================================

export class TurnActionIntegrationEngine {


  static process(
    params: TurnActionIntegrationParams,
  ): ActionExecutionResult | null {

    // ========================================================
    // 1. PREPARAR OS PERSONAGENS
    // ========================================================

    const characters =
      params.characters.some(
        character =>
          character.id === params.actor.id,
      )
        ? params.characters
        : [
            params.actor,
            ...params.characters,
          ]


    // ========================================================
    // 2. RECONHECER A AÇÃO
    // ========================================================

    const request =
      ActionParser.parseIfRecognized(
        params.text,
        params.actor,
        {
          characters,
          difficulty: params.difficulty,
        },
      )

    // Texto puramente narrativo continua fora
    // do motor de ações.
    if (!request) {
      return null
    }


    // ========================================================
    // 3. PREPARAR O ESTADO DO COMBATE
    // ========================================================

    if (
      request.type === "attack" &&
      request.target
    ) {

      const existingState =
        params.combatState

      const actorId =
        params.actor.id

      const targetId =
        request.target.id

      const actorParticipant =
        existingState?.participants.find(
          participant =>
            participant.character.id === actorId,
        )

      const targetParticipant =
        existingState?.participants.find(
          participant =>
            participant.character.id === targetId,
        )

      // Um personagem derrotado não pode iniciar
      // outro ataque a partir do mesmo estado.
      if (actorParticipant?.defeated) {

        return this.failedExecution(
          request,
          "O personagem está derrotado e não pode atacar.",
          existingState,
        )

      }

      // Reutilizar o combate atual quando os dois
      // personagens já participam dele.
      if (
        existingState &&
        !existingState.finished
      ) {

        if (
          !actorParticipant ||
          !targetParticipant
        ) {

          return this.failedExecution(
            request,
            "O alvo não pertence ao combate atual.",
            existingState,
          )

        }

        request.combatState =
          existingState

        // Respeitar a ordem dos turnos existente.
        if (
          existingState.activeParticipantId !== actorId
        ) {

          return this.failedExecution(
            request,
            "Não é o turno deste personagem.",
            existingState,
          )

        }

      } else {

        // Não reiniciar um combate já encerrado
        // contra os mesmos participantes.
        if (
          existingState?.finished &&
          actorParticipant &&
          targetParticipant
        ) {

          return this.failedExecution(
            request,
            "O combate já foi encerrado.",
            existingState,
          )

        }

        // Iniciar um estado temporário para o novo
        // encontro. O atacante fica primeiro para
        // permitir a resolução da ação que iniciou
        // o combate nesta primeira etapa.
        const participants = [
          params.actor,
          request.target,
        ].map(
          character => {

            const hp =
              CharacterStatsEngine.getValue(
                character,
                ["HP", "Vida"],
                100,
              )

            const initialHP =
              Number.isFinite(hp)
                ? Math.max(1, Math.floor(hp))
                : 100

            return CombatStateEngine.createParticipant(
              character,
              initialHP,
            )

          },
        )

        request.combatState =
          CombatStateEngine.create(
            participants,
          )

      }

    }


    // ========================================================
    // 4. CRIAR O PERFIL
    // ========================================================

    const profile =
      BrainProfileBuilder.fromCharacter(
        params.actor,
      )


    // ========================================================
    // 5. CONVERTER O HISTÓRICO
    // ========================================================

    const recentTurns =
      TurnAdapter.toAI(
        params.recentTurns ?? [],
      )


    // ========================================================
    // 6. CONSTRUIR O CONTEXTO
    // ========================================================

    const context =
      WorldContextBuilder.build({

        profile,

        characters,

        npcs:
          params.npcs ??
          characters.filter(
            character =>
              character.is_npc,
          ),

        lore:
          params.lore,

        factions:
          params.factions ?? [],

        recentTurns,

      })


    // ========================================================
    // 7. EXECUTAR A AÇÃO
    // ========================================================

    return ActionExecutionEngine.executeRequest(
      context,
      request,
    )

  }


  // ==========================================================
  // RESULTADO DE AÇÃO NÃO EXECUTADA
  // ==========================================================

  private static failedExecution(
    request: ActionExecutionResult["request"],
    description: string,
    state?: CombatState,
  ): ActionExecutionResult {

    return {

      request,

      result: {

        success: false,

        description,

        action:
          request.type,

        requiresRoll: false,

        ...(state
          ? { combatState: state }
          : {}),

      },

    }

  }

}