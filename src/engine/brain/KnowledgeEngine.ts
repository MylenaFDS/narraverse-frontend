import type {
  Knowledge,
} from "./KnowledgeTypes"

export class KnowledgeEngine {

  static knows(

    knowledge: Knowledge[],

    subject: string,

  ) {

    return knowledge.some(

      item =>

        item.subject
          .toLowerCase() ===
        subject.toLowerCase(),

    )

  }

  // =====================================
  // Recupera um conhecimento específico
  // =====================================

  static get(

    knowledge: Knowledge[],

    subject: string,

  ) {

    return (

      knowledge.find(

        item =>

          item.subject
            .toLowerCase() ===
          subject.toLowerCase(),

      ) ?? null

    )

  }

  // =====================================
  // Aprende algo novo
  // =====================================

  static learn(

    knowledge: Knowledge[],

    info: Knowledge,

  ) {

    const exists =

      this.knows(
        knowledge,
        info.subject,
      )

    if (!exists) {

      knowledge.push(info)

    }

  }

  // =====================================
  // Atualiza um conhecimento existente
  // =====================================

  static update(

    knowledge: Knowledge[],

    info: Knowledge,

  ) {

    const index =
      knowledge.findIndex(

        item =>

          item.subject ===
          info.subject,

      )

    if (index >= 0) {

      knowledge[index] = info

    } else {

      knowledge.push(info)

    }

  }

  // =====================================
  // Esquece um conhecimento
  // =====================================

  static forget(

    knowledge: Knowledge[],

    subject: string,

  ) {

    return knowledge.filter(

      item =>

        item.subject !== subject,

    )

  }

  // =====================================
  // Busca textual
  // =====================================

  static search(

    knowledge: Knowledge[],

    text: string,

  ) {

    const query =
      text.toLowerCase()

    return knowledge.filter(

      item =>

        item.subject
          .toLowerCase()
          .includes(query) ||

        item.description
          ?.toLowerCase()
          .includes(query),

    )

  }

  // =====================================
  // Todo conhecimento
  // =====================================

  static list(

    knowledge: Knowledge[],

  ) {

    return [...knowledge]

  }

}