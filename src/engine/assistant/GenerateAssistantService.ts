import type { Character } from "../../types/character"
import type { RPGTurn } from "../../types/turn"

import { CampaignStateFactory } from "./state/CampaignStateFactory"
import { CampaignStateEngine } from "./state/CampaignStateEngine"
import { EventInterpreterEngine } from "./state/events/EventInterpreterEngine"

import { AssistantStoryContextEngine } from "./story/AssistantStoryContextEngine"

import { AssistantService } from "./AssistantService"

export class GenerateAssistantService {

  static generate(
    turns: RPGTurn[],
    characters: Character[],
  ) {

    // ======================================
    // Estado inicial da campanha
    // ======================================

    let campaign =
      CampaignStateFactory.create()

    // ======================================
    // Reconstrói toda a campanha
    // a partir dos turnos
    // ======================================

    for (
      const turn of turns
    ) {

      const events =
        EventInterpreterEngine.interpret(
          turn,
        )

      campaign =
        CampaignStateEngine.update(
          campaign,
          events,
        )

    }

    // ======================================
    // Constrói o contexto narrativo
    // ======================================

    const story =
      AssistantStoryContextEngine.create(
        campaign,
        turns,
        characters,
      )

    // ======================================
    // Último turno da campanha
    // ======================================

    const currentTurn =
      turns.at(-1)

    // ======================================
    // Contexto completo para o assistente
    // ======================================

    const context = {

      turn:
        currentTurn,

      campaignState:
        campaign,

      story,

      characters,

    }

    // ======================================
    // Gera as sugestões
    // ======================================

    return AssistantService.generate(
      context,
    )

  }

}