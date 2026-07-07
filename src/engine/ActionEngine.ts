import type { WorldContext } from "./context/ContextEngine"

export interface ActionResult {
  success: boolean
  description: string
}

export class ActionEngine {
  static execute(
    _context: WorldContext,
    action: string,
  ): ActionResult {

    switch (action) {

      case "move":
        return {
          success: true,
          description: "O personagem mudou de localização.",
        }

      case "attack":
        return {
          success: true,
          description: "O ataque foi executado.",
        }

      case "talk":
        return {
          success: true,
          description: "Uma conversa foi iniciada.",
        }

      case "investigate":
        return {
          success: true,
          description: "O personagem investigou o local.",
        }

      case "rest":
        return {
          success: true,
          description: "O personagem descansou.",
        }

      default:
        return {
          success: false,
          description: "Ação desconhecida.",
        }

    }
  }
}