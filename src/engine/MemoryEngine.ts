// MemoryEngine.ts


// ======================================
// Memória narrativa
// ======================================

export interface MemoryEvent {


  // Identificação
  id: string


  // Tipo do acontecimento
  type:
    | "event"
    | "relationship"
    | "death"
    | "discovery"
    | "dialogue"
    | "combat"
    | "quest"
    | "prophecy"
    | "lore"
    | "emotion"
    | string



  // Resumo humano
  title: string


  description?: string



  // ======================================
  // Entidades relacionadas
  // ======================================


  characterId?: number

  people: number[]


  loreId?: number

  factionId?: number

  sceneId?: number


  places: number[]



  // ======================================
  // Estado emocional
  // ======================================


  emotion?: string



  // ======================================
  // Busca e inteligência
  // ======================================


  tags: string[]


  confidence: number


  recalled: number



  // Quantas vezes foi usada
  accessedAt?: number



  // ======================================
  // Importância narrativa
  // ======================================


  importance: number // 1-10


  permanent?: boolean



  // ======================================
  // Relacionamentos
  // ======================================


  relatedMemoryIds?: string[]



  timestamp: number

}





// ======================================
// Engine
// ======================================


export class MemoryEngine {


  private static memories:
    MemoryEvent[] = []





// ======================================
// Adicionar memória
// ======================================


static add(
  memory: MemoryEvent,
): void {


  const duplicated =

    this.memories.find(

      item =>

        item.title === memory.title &&

        item.type === memory.type,

    )



  // ======================================
  // Consolidar memória existente
  // ======================================


  if (duplicated) {


    duplicated.recalled += 1


    duplicated.importance =

      Math.min(

        10,

        duplicated.importance + 1,

      )



    duplicated.confidence =

      Math.min(

        100,

        duplicated.confidence + 5,

      )



    duplicated.timestamp =
      Date.now()



    if(
      memory.description
    ){

      duplicated.description =
        memory.description

    }



    duplicated.tags = [

      ...new Set([

        ...duplicated.tags,

        ...(memory.tags ?? []),

      ]),

    ]



    duplicated.people = [

      ...new Set([

        ...duplicated.people,

        ...(memory.people ?? []),

      ]),

    ]



    duplicated.places = [

      ...new Set([

        ...duplicated.places,

        ...(memory.places ?? []),

      ]),

    ]



    return

  }





  // ======================================
  // Nova memória
  // ======================================


  const newMemory: MemoryEvent = {


    ...memory,


    recalled:

      memory.recalled ?? 0,


    confidence:

      memory.confidence ?? 100,


    people:

      memory.people ?? [],


    places:

      memory.places ?? [],


    tags:

      memory.tags ?? [],


    relatedMemoryIds:

      memory.relatedMemoryIds ?? [],


    permanent:

      memory.permanent ?? false,


    accessedAt:

      Date.now(),


  }





  this.memories.push(
    newMemory,
  )


}







  // ======================================
  // Todas
  // ======================================


  static getAll(): MemoryEvent[] {


    return [
      ...this.memories,
    ]

  }







  // ======================================
  // Recentes
  // ======================================


  static getRecent(
    limit = 20,
  ): MemoryEvent[] {


    return [

      ...this.memories,

    ]

      .sort(

        (a,b)=>

          b.timestamp -
          a.timestamp,

      )

      .slice(
        0,
        limit,
      )

  }







  // ======================================
  // Memórias importantes
  // ======================================


  static getImportant(
    limit = 10,
  ): MemoryEvent[] {


    return [

      ...this.memories,

    ]

      .sort(

        (a,b)=>


          this.score(b)
          -
          this.score(a),


      )

      .slice(
        0,
        limit,
      )


  }







  // ======================================
  // Recuperação contextual
  // ======================================


  static recall(
    id:string,
  ):MemoryEvent | null {


    const memory =
      this.memories.find(
        m =>
          m.id === id,
      )


    if(
      !memory
    )
      return null




    memory.recalled++


    memory.accessedAt =
      Date.now()



    return memory

  }







  // ======================================
  // Busca narrativa
  // ======================================


  static search(
    text:string,
  ):MemoryEvent[] {


    const query =
      text
        .toLowerCase()
        .trim()



    return this.memories.filter(

      memory => {


        const content = [

          memory.title,

          memory.description,

          memory.emotion,

          ...memory.tags,

        ]

          .join(" ")

          .toLowerCase()



        return content.includes(
          query,
        )


      },

    )


  }







  // ======================================
  // Busca por personagem
  // ======================================


  static getByCharacter(
    characterId:number,
  ){


    return this.memories.filter(

      memory =>

        memory.characterId ===
        characterId

        ||

        memory.people.includes(
          characterId,
        ),

    )


  }







  // ======================================
  // Busca por local
  // ======================================


  static getByPlace(
    placeId:number,
  ){


    return this.memories.filter(

      memory =>

        memory.places.includes(
          placeId,
        ),

    )


  }







  // ======================================
  // Busca por tipo
  // ======================================


  static getByType(
    type:string,
  ){


    return this.memories.filter(

      memory =>

        memory.type === type,

    )


  }







  // ======================================
  // Consolidar memórias parecidas
  // ======================================


  static consolidate(){


    const map =
      new Map<string,MemoryEvent>()



    for(
      const memory of this.memories
    ){


      const key =
        `${memory.type}-${memory.title}`



      const existing =
        map.get(key)



      if(existing){


        existing.recalled +=
          memory.recalled


        existing.importance =
          Math.min(
            10,
            existing.importance +
            memory.importance,
          )


      }

      else {


        map.set(
          key,
          memory,
        )


      }


    }



    this.memories =
      Array.from(
        map.values(),
      )


  }







  // ======================================
  // Esquecimento natural
  // ======================================


  static decay(){


    this.memories =

      this.memories.map(
        memory => {


          if(
            memory.permanent
          )
            return memory



          if(
            memory.recalled === 0
          ){

            memory.confidence =
              Math.max(
                0,
                memory.confidence - 5,
              )

          }



          return memory

        },

      )



  }







  // ======================================
  // Limpar memórias fracas
  // ======================================


  static forgetLowImportance(
    threshold = 3,
  ){


    this.memories =

      this.memories.filter(

        memory =>

          memory.permanent ||

          memory.importance >=
          threshold,

      )


  }







  // ======================================
  // Estatísticas
  // ======================================


  static stats(){


    return {


      total:
        this.memories.length,


      important:

        this.memories.filter(

          m =>
            m.importance >= 7,

        )
        .length,


      emotional:

        this.memories.filter(

          m =>
            Boolean(
              m.emotion,
            ),

        )
        .length,


      characters:

        new Set(

          this.memories.flatMap(

            m =>
              m.people,

          ),

        )
        .size,


    }


  }







  // ======================================
  // Pontuação IA
  // ======================================


  private static score(
    memory:MemoryEvent,
  ){


    const age =

      Date.now()
      -
      memory.timestamp



    const freshness =

      Math.max(

        0,

        10 -

        age /
        1000 /
        60 /
        60 /
        24,

      )



    return (

      memory.importance

      +

      memory.recalled * 0.5

      +

      memory.confidence / 20

      +

      freshness

    )


  }







  // ======================================
  // Reset
  // ======================================


  static clear(){

    this.memories = []

  }


}