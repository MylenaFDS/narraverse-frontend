import { DiceResolver } from "./DiceResolver"

const result =
  DiceResolver.resolve(
    "1d20+5",
    15,
  )

console.log(result)