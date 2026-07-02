import type {

  Knowledge,

} from "./KnowledgeTypes"

export class KnowledgeEngine {

  static knows(

    knowledge: Knowledge[],

    subject: string,

  ) {

    return knowledge.some(

      (item) =>

        item.subject === subject,

    )

  }

}