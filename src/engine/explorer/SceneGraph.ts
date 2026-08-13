import type {
  ExplorerEntity,
} from "./ExplorerTypes"


// ==========================================
// Tipos
// ==========================================

export interface SceneGraphNode {

  id: string

  sceneId: number

  name: string

  type:
    | "scene"
    | "entity"

  entityId?: string

}


export interface SceneGraphConnection {

  from: string

  to: string

  type:
    | "contains"
    | "connects"
    | "leads_to"
    | "near"
    | "related"

}


export interface SceneGraphData {

  nodes: SceneGraphNode[]

  connections: SceneGraphConnection[]

}


// ==========================================
// Scene Graph Engine
// ==========================================

export class SceneGraphEngine {

  private static graphs =
    new Map<
      number,
      SceneGraphData
    >()


  // ==========================================
  // Criar gráfico de uma cena
  // ==========================================

  static create(
    sceneId: number,
    entities: ExplorerEntity[],
  ): SceneGraphData {

    const nodes:
      SceneGraphNode[] = []

    const connections:
      SceneGraphConnection[] = []


    // ----------------------------------------
    // Nó principal da cena
    // ----------------------------------------

    const sceneNode:
      SceneGraphNode = {

      id:
        `scene-${sceneId}`,

      sceneId,

      name:
        "Scene",

      type:
        "scene",

    }


    nodes.push(
      sceneNode,
    )


    // ----------------------------------------
    // Entidades
    // ----------------------------------------

    for (
      const entity of entities
    ) {

      const entityNode:
        SceneGraphNode = {

        id:
          `entity-${entity.id}`,

        sceneId,

        name:
          entity.name,

        type:
          "entity",

        entityId:
          entity.id,

      }


      nodes.push(
        entityNode,
      )


      // --------------------------------------
      // Cena contém entidade
      // --------------------------------------

      connections.push({

        from:
          sceneNode.id,

        to:
          entityNode.id,

        type:
          "contains",

      })

    }


    const graph:
      SceneGraphData = {

      nodes,

      connections,

    }


    this.graphs.set(
      sceneId,
      graph,
    )


    return graph

  }


  // ==========================================
  // Obter gráfico
  // ==========================================

  static get(
    sceneId: number,
  ): SceneGraphData | null {

    return (
      this.graphs.get(
        sceneId,
      ) ?? null
    )

  }


  // ==========================================
  // Adicionar conexão
  // ==========================================

  static connect(
    sceneId: number,
    from: string,
    to: string,
    type:
      SceneGraphConnection["type"],
  ): void {

    const graph =
      this.graphs.get(
        sceneId,
      )

    if (!graph) {

      return

    }


    const exists =
      graph.connections.some(
        connection =>
          connection.from === from &&
          connection.to === to &&
          connection.type === type,
      )


    if (exists) {

      return

    }


    graph.connections.push({

      from,

      to,

      type,

    })

  }


  // ==========================================
  // Encontrar entidade
  // ==========================================

  static findEntity(
    sceneId: number,
    entityId: string,
  ): SceneGraphNode | null {

    const graph =
      this.graphs.get(
        sceneId,
      )

    if (!graph) {

      return null

    }


    return (
      graph.nodes.find(
        node =>
          node.entityId ===
          entityId,
      ) ?? null
    )

  }


  // ==========================================
  // Entidades de uma cena
  // ==========================================

  static getEntities(
    sceneId: number,
  ): SceneGraphNode[] {

    const graph =
      this.graphs.get(
        sceneId,
      )

    if (!graph) {

      return []

    }


    return graph.nodes.filter(
      node =>
        node.type ===
        "entity",
    )

  }


  // ==========================================
  // Conexões de uma entidade
  // ==========================================

  static getConnections(
    sceneId: number,
    nodeId: string,
  ): SceneGraphConnection[] {

    const graph =
      this.graphs.get(
        sceneId,
      )

    if (!graph) {

      return []

    }


    return graph.connections.filter(
      connection =>
        connection.from ===
          nodeId ||
        connection.to ===
          nodeId,
    )

  }


  // ==========================================
  // Limpar cena
  // ==========================================

  static clear(
    sceneId: number,
  ): void {

    this.graphs.delete(
      sceneId,
    )

  }


  // ==========================================
  // Limpar tudo
  // ==========================================

  static clearAll(): void {

    this.graphs.clear()

  }

}