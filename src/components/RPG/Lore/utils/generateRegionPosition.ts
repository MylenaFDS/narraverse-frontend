type Region = {
  pos_x: number
  pos_y: number
}

export function generateRegionPosition(
  regions: Region[]
) {
  let finalX = 0
  let finalY = 0
  let isTooClose = true

  while (isTooClose) {
    finalX =
      Math.floor(
        Math.random() * 70
      ) + 15

    finalY =
      Math.floor(
        Math.random() * 60
      ) + 20

    isTooClose =
      regions.some(
        (region) => {
          const dx =
            region.pos_x -
            finalX

          const dy =
            region.pos_y -
            finalY

          const distance =
            Math.sqrt(
              dx * dx +
                dy * dy
            )

          return (
            distance < 10
          )
        }
      )
  }

  return {
    finalX,
    finalY,
  }
}