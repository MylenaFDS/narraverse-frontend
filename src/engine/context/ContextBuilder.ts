import type { Character } from "../../types/character"

import type { WorldContext } from "./ContextEngine"

import type { AIContext } from "../brain/AIContext"

import { CharacterAdapter } from "../adapters/CharacterAdapter"

import { InventoryAdapter } from "../adapters/InventoryAdapter"
import { LoreAdapter } from "../adapters/LoreAdapter"
import { FactionAdapter } from "../adapters/FactionAdapter"

export class ContextBuilder {

  static build(

    character: Character,

    world: WorldContext,

  ): AIContext {

    return {

      world,

      self:
        CharacterAdapter.toAI(
          character,
        ),

      profile:
        world.profile,

      inventory:
        InventoryAdapter.toAI(
          world.inventory,
        ),

      nearbyCharacters:
        world.characters,

      nearbyNPCs:
        world.npcs,

      nearbyLore:
        LoreAdapter.toAI(
          world.lore,
        ),

      nearbyFactions:
        FactionAdapter.toAI(
          world.factions,
        ),

      visibleLore:
        LoreAdapter.toAI(
          world.lore,
        ),

      visibleFactions:
        FactionAdapter.toAI(
          world.factions,
        ),

      currentScene:
        world.currentScene,

      currentTerrain:
        world.currentTerrain,

      currentWeather:
        world.currentWeather,

      currentTurn: world.currentTurn ?? null,

      recentTurns: world.recentTurns,
      timelineEvents:
        world.timeline,

      scene:
        world.scene,

      timeOfDay:
        world.timeOfDay,

      season:
        world.season,

      temperature:
        world.temperature,

      dangerLevel:
        world.dangerLevel,

    }

  }

}