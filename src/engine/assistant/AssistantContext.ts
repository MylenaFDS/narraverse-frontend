import type { StoryContext } from "../writer/story/types/StoryContext"

import type { Character } from "../../types/character"

import type { WorldContext } from "../context/ContextEngine"

import type { BrainProfile } from "../brain/BrainProfile"

export interface AssistantContext {

  profile: BrainProfile

  world: WorldContext

  story: StoryContext

  characters: Character[]

}