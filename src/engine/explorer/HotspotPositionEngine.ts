import type {
  ExplorerPosition,
  ExplorerHotspotSuggestion,
} from "./ExplorerTypes"


export class HotspotPositionEngine {

  // ==========================================
  // Gerar posições
  // ==========================================

  static generate(
    hotspots: ExplorerHotspotSuggestion[],
  ): ExplorerPosition[] {

    if (!hotspots.length) {

      return []

    }

    const positions:
      ExplorerPosition[] = []

    const total =
      hotspots.length

    const centerX = 50
    const centerY = 50

    // ----------------------------------------
    // Distribuição circular
    // ----------------------------------------

    const radius =
      Math.min(
        35,
        15 +
          total * 3,
      )

    for (
      let index = 0;
      index < total;
      index++
    ) {

      const angle =
        (
          Math.PI * 2 * index
        ) /
        total

      const x =
        centerX +
        Math.cos(angle) *
        radius

      const y =
        centerY +
        Math.sin(angle) *
        radius

      positions.push({

        x:
          Math.round(
            this.clamp(
              x,
              10,
              90,
            ),
          ),

        y:
          Math.round(
            this.clamp(
              y,
              15,
              85,
            ),
          ),

        z: 0,

      })

    }

    return positions

  }


  // ==========================================
  // Distribuir hotspots
  // ==========================================

  static assign(
    hotspots: ExplorerHotspotSuggestion[],
  ) {

    const positions =
      this.generate(
        hotspots,
      )

    return hotspots.map(
      (
        hotspot,
        index,
      ) => ({

        ...hotspot,

        position:
          positions[index],

      }),
    )

  }


  // ==========================================
  // Limitar coordenada
  // ==========================================

  private static clamp(
    value: number,
    min: number,
    max: number,
  ): number {

    return Math.max(
      min,
      Math.min(
        max,
        value,
      ),
    )

  }

}