export class VariationEngine {

  static random<T>(
    items: T[],
  ): T {

    return items[
      Math.floor(
        Math.random() * items.length,
      )
    ]

  }

}