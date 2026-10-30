import type { Character } from "../../types/character"

import {
  ActionEngine,
  type ActionResult,
  type ActionRequest,
} from "../ActionEngine"

import {
  ActionParser,
  type ActionParserOptions,
} from "./ActionParser"

import type {
  WorldContext,
} from "../context/ContextEngine"


export interface ActionExecutionOptions
  extends ActionParserOptions {

  context:
    WorldContext

}


export interface ActionExecutionResult {

  request:
    ActionRequest

  result:
    ActionResult

}


export class ActionExecutionEngine {


  static execute(
  text: string,
  actor: Character,
  options: ActionExecutionOptions,
): ActionExecutionResult {

  const request =
    ActionParser.parse(
      text,
      actor,
      options,
    )

  return this.executeRequest(
    options.context,
    request,
  )
}


static executeRequest(
  context: WorldContext,
  request: ActionRequest,
): ActionExecutionResult {

  const result =
    ActionEngine.execute(
      context,
      request,
    )

  return {
    request,
    result,
  }
}

}