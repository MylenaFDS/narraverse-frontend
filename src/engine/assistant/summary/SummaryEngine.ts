import type {
  StoryAnalysis,
} from "../analysis/StoryAnalysis"

import type {
  StoryEvent,
} from "../state/events/StoryEvent"



export class SummaryEngine {


  static build(
    analysis: StoryAnalysis,
  ): string {


    const sections:string[] = []



    const summary =
      this.summarizeEvents(
        analysis,
      )


    if(summary){

      sections.push(
        summary,
      )

    }




    const world =
      this.summarizeWorld(
        analysis,
      )


    if(world){

      sections.push(
        world,
      )

    }





    const characters =
      this.summarizeCharacters(
        analysis,
      )


    if(characters){

      sections.push(
        characters,
      )

    }





    const objectives =
      this.summarizeObjectives(
        analysis,
      )


    if(objectives){

      sections.push(
        objectives,
      )

    }





    const mysteries =
      this.summarizeMysteries(
        analysis,
      )


    if(mysteries){

      sections.push(
        mysteries,
      )

    }





    if(
      sections.length === 0
    ){

      return (
        "Nenhum acontecimento relevante foi registrado até o momento."
      )

    }



    return sections.join(
      " ",
    )

  }








  // ==================================
  // Síntese narrativa principal
  // ==================================


  private static summarizeEvents(
    analysis:StoryAnalysis,
  ):string{


    const events =
      analysis.events



    if(
      events.length === 0
    ){

      return ""

    }




    const sentences:string[] = []



    const handlers:

    Partial<

      Record<
        StoryEvent["type"],
        (event:StoryEvent)=>string
      >

    >

  = {


    death:
      event =>
        this.transformDeath(
          event.description,
        ),



    attack:
      event =>
        this.transformConflict(
          event.description,
        ),



    dialogue:
      event =>
        this.transformDialogue(
          event.description,
        ),



    relationship:
      event =>
        this.transformRelationship(
          event.description,
        ),



    prophecy:
      event =>
        this.transformProphecy(
          event.description,
        ),



    discovery:
      event =>
        this.transformDiscovery(
          event.description,
        ),



    emotion:
      event =>
        this.transformEmotion(
          event.description,
        ),



    quest:
      event =>
        this.transformQuest(
          event.description,
        ),


  }







    for(
      const event of events
    ){


      const handler =
        handlers[event.type]



      if(handler){

        sentences.push(
          handler(event),
        )

      }

    }





    return sentences.join(
      " ",
    )

  }









  // ==================================
  // Interpretação narrativa
  // ==================================


  private static transformDeath(
    description:string,
  ):string{


    return (

      `${description}. `
      +
      `Essa perda representa uma ruptura significativa na história, `
      +
      `alterando os caminhos daqueles que continuam a jornada.`

    )

  }







  private static transformConflict(
    description:string,
  ):string{


    return (

      `${description}. `
      +
      `O conflito aumenta a tensão da narrativa e força os personagens `
      +
      `a enfrentar novos riscos e decisões difíceis.`

    )

  }







  private static transformRelationship(
    description:string,
  ):string{


    return (

      `${description}. `
      +
      `Essa mudança emocional pode fortalecer alianças, criar conflitos `
      +
      `ou influenciar escolhas futuras.`

    )

  }







  private static transformDialogue(
    description:string,
  ):string{


    return (

      `${description}. `
      +
      `O diálogo revelou novas perspectivas e trouxe maior compreensão `
      +
      `sobre os envolvidos e seus objetivos.`

    )

  }







  private static transformProphecy(
    description:string,
  ):string{


    return (

      `${description}. `
      +
      `A revelação sugere que os acontecimentos atuais podem fazer parte `
      +
      `de um destino maior ainda em desenvolvimento.`

    )

  }







  private static transformDiscovery(
    description:string,
  ):string{


    return (

      `${description}. `
      +
      `Essa descoberta adiciona novas informações capazes de mudar `
      +
      `o rumo dos próximos acontecimentos.`

    )

  }







  private static transformEmotion(
    description:string,
  ):string{


    return (

      `${description}. `
      +
      `O estado emocional presente influencia diretamente o tom `
      +
      `e as consequências da cena.`

    )

  }







  private static transformQuest(
    description:string,
  ):string{


    return (

      `${description}. `
      +
      `Esse objetivo direciona os próximos passos da jornada `
      +
      `e estabelece um novo caminho para os personagens.`

    )

  }









  // ==================================
  // Mundo
  // ==================================


  private static summarizeWorld(
    analysis:StoryAnalysis,
  ):string{


    const text:string[] = []



    if(
      analysis.currentLocation
    ){

      text.push(

        `A cena acontece em ${analysis.currentLocation}, um local que influencia diretamente os acontecimentos atuais.`

      )

    }





    if(
      analysis.sceneMood
    ){

      text.push(

        `O clima predominante é ${analysis.sceneMood}, refletindo o tom emocional da narrativa.`

      )

    }




    return text.join(
      " ",
    )

  }









  // ==================================
  // Personagens
  // ==================================


  private static summarizeCharacters(
    analysis:StoryAnalysis,
  ):string{


    if(
      analysis.activeCharacters.length === 0
    ){

      return ""

    }




    if(
      analysis.activeCharacters.length === 1
    ){

      return (

        `${analysis.activeCharacters[0]} permanece no centro dos acontecimentos.`

      )

    }





    const names =
      analysis.activeCharacters.slice(
        0,
        4,
      )




    return (

      `Os principais envolvidos são ${names.join(", ")}, cujas decisões podem influenciar o destino da campanha.`

    )

  }









  // ==================================
  // Objetivos
  // ==================================


  private static summarizeObjectives(
    analysis:StoryAnalysis,
  ):string{


    if(
      analysis.activeObjectives.length === 0
    ){

      return ""

    }





    return (

      `O objetivo principal atual é ${analysis.activeObjectives[0]}, guiando os próximos passos da narrativa.`

    )

  }









  // ==================================
  // Mistérios
  // ==================================


  private static summarizeMysteries(
    analysis:StoryAnalysis,
  ):string{


    const text:string[] = []



    if(
      analysis.unresolvedThreads.length > 0
    ){

      text.push(

        `${analysis.unresolvedThreads.length} acontecimentos permanecem sem resolução e podem influenciar o futuro da história.`

      )

    }




    if(
      analysis.unansweredQuestions.length > 0
    ){

      text.push(

        `${analysis.unansweredQuestions.length} perguntas continuam sem resposta, mantendo mistérios em aberto.`

      )

    }




    return text.join(
      " ",
    )

  }









  


}