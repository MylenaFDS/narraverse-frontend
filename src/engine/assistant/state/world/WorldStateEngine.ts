import type {

  WorldState,

  WorldStateType,

} from "./WorldState"

export class WorldStateEngine {

  private static states =
    new Map<number,WorldState>()

  // ======================================
  // Registro
  // ======================================

  static register(
    state:WorldState,
  ){

    this.states.set(
      state.id,
      structuredClone(state),
    )

  }

  // ======================================

  static get(
    id:number,
  ){

    return this.states.get(id) ?? null

  }

  static exists(
    id:number,
  ){

    return this.states.has(id)

  }

  static remove(
    id:number,
  ){

    this.states.delete(id)

  }

  static clear(){

    this.states.clear()

  }

  // ======================================
  // Consultas
  // ======================================

  static all(){

    return [...this.states.values()]

  }

  static byType(
    type:WorldStateType,
  ){

    return this.all()

      .filter(
        state =>
          state.type === type,
      )

  }

  static discovered(){

    return this.all()

      .filter(
        state =>
          state.discovered,
      )

  }

  static destroyed(){

    return this.all()

      .filter(
        state =>
          state.destroyed,
      )

  }

  static occupied(){

    return this.all()

      .filter(
        state =>
          state.occupied,
      )

  }

  static underAttack(){

    return this.all()

      .filter(
        state =>
          state.underAttack,
      )

  }

  static byTag(
    tag:string,
  ){

    return this.all()

      .filter(

        state =>

          state.tags.includes(
            tag,
          ),

      )

  }

  // ======================================
  // Descoberta
  // ======================================

  static discover(
    id:number,
  ){

    const state =
      this.get(id)

    if(!state)
      return

    state.discovered = true

  }

  // ======================================
  // Guerra
  // ======================================

  static attack(
    id:number,
  ){

    const state =
      this.get(id)

    if(!state)
      return

    state.underAttack = true

    state.stability =
      Math.max(
        0,
        state.stability - 5,
      )

    state.security =
      Math.max(
        0,
        state.security - 10,
      )

    state.history.push(
      "Entrou em combate",
    )

  }

  static stopAttack(
    id:number,
  ){

    const state =
      this.get(id)

    if(!state)
      return

    state.underAttack = false

  }

  static destroy(
    id:number,
  ){

    const state =
      this.get(id)

    if(!state)
      return

    state.destroyed = true

    state.population = 0

    state.security = 0

    state.history.push(
      "Foi destruído",
    )

  }

  // ======================================
  // Ocupação
  // ======================================

  static occupy(

    id:number,

    owner:number,

  ){

    const state =
      this.get(id)

    if(!state)
      return

    state.ownerId = owner

    state.occupied = true

    state.history.push(
      "Mudança de domínio",
    )

  }

  static release(
    id:number,
  ){

    const state =
      this.get(id)

    if(!state)
      return

    state.ownerId = null

    state.occupied = false

  }

  // ======================================
  // Economia
  // ======================================

  static changeEconomy(

    id:number,

    value:number,

  ){

    const state =
      this.get(id)

    if(!state)
      return

    state.economy += value

    state.prosperity += value * 0.4

  }

  // ======================================
  // População
  // ======================================

  static changePopulation(

    id:number,

    amount:number,

  ){

    const state =
      this.get(id)

    if(!state)
      return

    state.population =

      Math.max(

        0,

        state.population + amount,

      )

  }

  // ======================================
  // Moral
  // ======================================

  static changeMorale(

    id:number,

    amount:number,

  ){

    const state =
      this.get(id)

    if(!state)
      return

    state.morale += amount

  }

  // ======================================
  // Clima
  // ======================================

  static setClimate(

    id:number,

    climate:string,

  ){

    const state =
      this.get(id)

    if(!state)
      return

    state.climate = climate

  }

  // ======================================
  // Recursos
  // ======================================

  static addResource(

  id:number,

  resource:string,

  amount:number = 1,

){

  const state =
    this.get(id)

  if(!state)
    return

  state.resources[resource] =
    (
      state.resources[resource]
      ??
      0
    )
    +
    amount

}

  // ======================================
  // Flags
  // ======================================

  static setFlag(

    id:number,

    key:string,

    value:boolean,

  ){

    const state =
      this.get(id)

    if(!state)
      return

    state.flags[key] = value

  }

  static getFlag(

    id:number,

    key:string,

  ){

    return (

      this.get(id)

      ?.flags[key]

      ??

      false

    )

  }

  // ======================================
  // Valores
  // ======================================

  static setValue(

    id:number,

    key:string,

    value:number,

  ){

    const state =
      this.get(id)

    if(!state)
      return

    state.values[key] = value

  }

  static getValue(

    id:number,

    key:string,

  ){

    return (

      this.get(id)

      ?.values[key]

      ??

      0

    )

  }

  // ======================================
  // Snapshot para IA
  // ======================================

  static snapshot(){

    return this.all().map(

      state => ({

        id:state.id,

        name:state.name,

        type:state.type,

        ownerId:state.ownerId,

        discovered:state.discovered,

        destroyed:state.destroyed,

        occupied:state.occupied,

        underAttack:state.underAttack,

        prosperity:state.prosperity,

        stability:state.stability,

        economy:state.economy,

        morale:state.morale,

        danger:state.danger,

      }),

    )

  }

  // ======================================
  // Estatísticas
  // ======================================

  static stats(){

    const all =
      this.all()

    return {

      total:
        all.length,

      discovered:
        all.filter(
          s => s.discovered,
        ).length,

      destroyed:
        all.filter(
          s => s.destroyed,
        ).length,

      occupied:
        all.filter(
          s => s.occupied,
        ).length,

      underAttack:
        all.filter(
          s => s.underAttack,
        ).length,

    }

  }

}