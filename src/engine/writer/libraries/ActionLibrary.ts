export class ActionLibrary {

  private static readonly actions: Record<string, string[]> = {

    talk: [

      "Dirigi minhas palavras aos presentes.",

      "Quebrei o silêncio com calma.",

      "Resolvi expressar aquilo que pensava.",

      "Expliquei meu ponto de vista.",

      "Procurei estabelecer um diálogo.",

      "Escolhi conversar antes de agir.",

      "Tentei acalmar os ânimos através da conversa.",

      "Falei de forma firme, mas respeitosa.",

    ],

    attack: [

      "Avancei contra meu adversário.",

      "Parti para o ataque.",

      "Desferi um golpe preciso.",

      "Investi sem hesitação.",

      "Aproveitei a abertura do inimigo.",

      "Ataquei antes que pudesse reagir.",

      "Canalizei minha força para um único golpe.",

      "Lancei-me ao combate.",

    ],

    defend: [

      "Mantive minha posição.",

      "Preparei-me para defender meus aliados.",

      "Ergui minha guarda.",

      "Bloqueei qualquer tentativa de avanço.",

      "Protegi aqueles que estavam atrás de mim.",

      "Assumi uma postura defensiva.",

      "Mantive-me firme diante da ameaça.",

      "Interpus meu corpo entre o perigo e meus companheiros.",

    ],

    retreat: [

      "Resolvi recuar alguns passos.",

      "Afastei-me do confronto.",

      "Reorganizei minha estratégia.",

      "Busquei uma posição mais segura.",

      "Ganhei distância para avaliar a situação.",

      "Preferi preservar minhas forças.",

      "Abandonei temporariamente a linha de frente.",

      "Recuei sem perder o foco no inimigo.",

    ],

    explore: [

      "Passei a observar cuidadosamente os arredores.",

      "Resolvi explorar o ambiente.",

      "Examinei cada detalhe ao meu redor.",

      "Investiguei o local com atenção.",

      "Analisei tudo o que parecia incomum.",

      "Procurei pistas que pudessem ajudar.",

      "Segui explorando a região.",

      "Observei o ambiente em busca de qualquer sinal importante.",

    ],

    investigate: [

      "Passei a reunir informações.",

      "Examinei cuidadosamente cada detalhe.",

      "Analisei os vestígios encontrados.",

      "Procurei compreender o que realmente havia acontecido.",

      "Busquei evidências antes de tirar conclusões.",

      "Observei atentamente tudo ao meu redor.",

    ],

    negotiate: [

      "Procurei encontrar uma solução pacífica.",

      "Busquei um entendimento entre todos.",

      "Preferi negociar antes de recorrer à força.",

      "Tentei convencer os presentes.",

      "Acreditei que o diálogo ainda era possível.",

      "Fiz uma proposta para encerrar o conflito.",

    ],

    help: [

      "Corri para ajudar quem precisava.",

      "Ofereci meu apoio imediatamente.",

      "Estendi a mão aos meus aliados.",

      "Fiz tudo ao meu alcance para auxiliar.",

      "Priorizei proteger aqueles que dependiam de mim.",

      "Atendi ao chamado sem hesitar.",

    ],

    wait: [

      "Preferi aguardar antes de agir.",

      "Mantive-me observando a situação.",

      "Esperei pelo momento mais adequado.",

      "Permaneci atento.",

      "Decidi não agir precipitadamente.",

      "Continuei acompanhando os acontecimentos.",

    ],

  }

  static get(
    action: string,
  ): string[] {

    return (

      this.actions[action] ??

      [
        "Segui com minha decisão.",
      ]

    )

  }

  static random(
    action: string,
  ): string {

    const options =
      this.get(action)

    return options[
      Math.floor(
        Math.random() * options.length
      )
    ]

  }

}