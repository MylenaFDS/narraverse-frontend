import type { Character } from "../../types/character"

import type { WorldContext } from "../context/ContextEngine"

import type {
  InventoryItem,
} from "./types/Inventory"


// ============================================================
// CONTEXTO DA IA
// ============================================================

export interface AIContext {

  // ==========================================================
  // MUNDO
  // ==========================================================

  world: WorldContext


  // ==========================================================
  // PERSONAGEM
  // ==========================================================

  self: Character


  // ==========================================================
  // PERFIL
  // ==========================================================

  profile: WorldContext["profile"]


  // ==========================================================
  // INVENTÁRIO
  // ==========================================================

  inventory: InventoryItem[]


  // ==========================================================
  // PERSONAGENS PRÓXIMOS
  // ==========================================================

  nearbyCharacters:
    WorldContext["characters"]

  nearbyNPCs:
    WorldContext["npcs"]


  // ==========================================================
  // LORE
  // ==========================================================

  nearbyLore:
    WorldContext["lore"]

  visibleLore:
    WorldContext["lore"]


  // ==========================================================
  // FACÇÕES
  // ==========================================================

  nearbyFactions:
    WorldContext["factions"]

  visibleFactions:
    WorldContext["factions"]


  // ==========================================================
  // CENA
  // ==========================================================

  currentScene?:
    WorldContext["currentScene"]

  currentTerrain?:
    string

  currentWeather?:
    string


  // ==========================================================
  // TURNO
  // ==========================================================

  currentTurn?:
    WorldContext["currentTurn"]

  recentTurns:
    WorldContext["recentTurns"]

  timelineEvents:
    WorldContext["timeline"]


  // ==========================================================
  // CONTEXTO NARRATIVO
  // ==========================================================

  scene?:
    WorldContext["scene"]

  timeOfDay?:
    WorldContext["timeOfDay"]

  season?:
    WorldContext["season"]

  temperature?:
    WorldContext["temperature"]

  dangerLevel?:
    WorldContext["dangerLevel"]

}