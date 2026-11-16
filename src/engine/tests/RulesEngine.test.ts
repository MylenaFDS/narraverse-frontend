
import { describe, expect, it } from "vitest"

import { RulesEngine } from "../combat/RulesEngine"

describe("RulesEngine", () => {

  it("deve impedir ataque negativo", () => {
    const result =
      RulesEngine.applyAttackRules(-5, 10)

    expect(result.attack).toBe(0)
    expect(result.defense).toBe(10)
  })

  it("deve impedir defesa negativa", () => {
    const result =
      RulesEngine.applyAttackRules(10, -5)

    expect(result.attack).toBe(10)
    expect(result.defense).toBe(0)
  })

  it("deve preservar valores positivos", () => {
    const result =
      RulesEngine.applyAttackRules(15, 12)

    expect(result.attack).toBe(15)
    expect(result.defense).toBe(12)
  })

})
