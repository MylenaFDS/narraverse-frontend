export type WorldStateType =
  | "kingdom"
  | "city"
  | "region"
  | "location"
  | "faction"
  | "road"
  | "building"
  | "forest"
  | "dungeon"

export interface WorldState {
  id: number

  type: WorldStateType

  name: string

  ownerId?: number | null

  destroyed: boolean

  occupied: boolean

  underAttack: boolean

  locked: boolean

  discovered: boolean

  tags: string[]

  flags: Record<string, boolean>

  values: Record<string, number>
}

export class WorldStateEngine {
  private static states = new Map<number, WorldState>()

  static register(state: WorldState) {
    this.states.set(state.id, state)
  }

  static get(id: number) {
    return this.states.get(id) ?? null
  }

  static all() {
    return [...this.states.values()]
  }

  static destroy(id: number) {
    const state = this.states.get(id)

    if (!state) return

    state.destroyed = true
  }

  static occupy(
    id: number,
    ownerId: number,
  ) {
    const state = this.states.get(id)

    if (!state) return

    state.ownerId = ownerId
    state.occupied = true
  }

  static release(id: number) {
    const state = this.states.get(id)

    if (!state) return

    state.ownerId = null
    state.occupied = false
  }

  static setFlag(
    id: number,
    flag: string,
    value: boolean,
  ) {
    const state = this.states.get(id)

    if (!state) return

    state.flags[flag] = value
  }

  static getFlag(
    id: number,
    flag: string,
  ) {
    return (
      this.states.get(id)?.flags[
        flag
      ] ?? false
    )
  }

  static setValue(
    id: number,
    key: string,
    value: number,
  ) {
    const state = this.states.get(id)

    if (!state) return

    state.values[key] = value
  }

  static getValue(
    id: number,
    key: string,
  ) {
    return (
      this.states.get(id)?.values[
        key
      ] ?? 0
    )
  }
}