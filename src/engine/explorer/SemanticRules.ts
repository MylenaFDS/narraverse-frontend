import type {
  ExplorerEntityType,
  ExplorerImportance,
} from "./ExplorerTypes"


export interface SemanticRule {

  keywords: string[]

  type: ExplorerEntityType

  importance: ExplorerImportance

  score: number

  name: string

  description: string

  secret?: boolean

  interactive?: boolean

}


export const SEMANTIC_RULES:
  SemanticRule[] = [

  // ==========================================
  // SEGREDOS
  // ==========================================

  {
    keywords: [
      "passagem secreta",
      "passagem escondida",
      "túnel secreto",
      "túnel escondido",
      "corredor secreto",
    ],

    type: "secret",

    importance: "critical",

    score: 100,

    name: "Passagem Secreta",

    description:
      "Uma passagem oculta parece conduzir a uma área desconhecida.",

    secret: true,

    interactive: true,
  },


  {
    keywords: [
      "porta secreta",
      "porta escondida",
      "entrada secreta",
    ],

    type: "secret",

    importance: "critical",

    score: 95,

    name: "Porta Secreta",

    description:
      "Uma entrada oculta pode esconder um caminho ou local desconhecido.",

    secret: true,

    interactive: true,
  },


  // ==========================================
  // LOCAIS
  // ==========================================

  {
    keywords: [
      "trono",
      "sala do trono",
      "salão do trono",
    ],

    type: "landmark",

    importance: "high",

    score: 85,

    name: "Trono",

    description:
      "O centro de poder deste lugar.",

    interactive: true,
  },


  {
    keywords: [
      "biblioteca",
      "livraria",
      "estantes",
      "livros",
    ],

    type: "location",

    importance: "high",

    score: 75,

    name: "Biblioteca",

    description:
      "Um local dedicado ao conhecimento, onde informações importantes podem estar escondidas.",

    interactive: true,
  },


  {
    keywords: [
      "taverna",
      "estalagem",
    ],

    type: "location",

    importance: "medium",

    score: 55,

    name: "Taverna",

    description:
      "Um ponto de encontro onde viajantes e habitantes podem trocar histórias e informações.",

    interactive: true,
  },


  {
    keywords: [
      "mercado",
      "feira",
      "comércio",
    ],

    type: "location",

    importance: "medium",

    score: 50,

    name: "Mercado",

    description:
      "Uma área movimentada onde mercadorias, informações e oportunidades circulam.",

    interactive: true,
  },


  // ==========================================
  // ESTRUTURAS
  // ==========================================

  {
    keywords: [
      "torre",
    ],

    type: "landmark",

    importance: "high",

    score: 70,

    name: "Torre",

    description:
      "Uma estrutura elevada que permite observar os arredores.",

    interactive: true,
  },


  {
    keywords: [
      "muralha",
      "muralhas",
    ],

    type: "landmark",

    importance: "medium",

    score: 45,

    name: "Muralhas",

    description:
      "As antigas muralhas protegem o local e oferecem uma visão privilegiada do território.",

    interactive: true,
  },


  {
    keywords: [
      "ponte",
    ],

    type: "landmark",

    importance: "medium",

    score: 45,

    name: "Ponte",

    description:
      "Uma passagem conecta esta região a outro ponto do mundo.",

    interactive: true,
  },


  // ==========================================
  // NATUREZA
  // ==========================================

  {
    keywords: [
      "floresta",
      "bosque",
      "mata",
    ],

    type: "environment",

    importance: "medium",

    score: 40,

    name: "Floresta",

    description:
      "Uma região coberta por vegetação densa que pode esconder caminhos e perigos.",

    interactive: true,
  },


  {
    keywords: [
      "caverna",
      "gruta",
    ],

    type: "location",

    importance: "high",

    score: 70,

    name: "Caverna",

    description:
      "Uma abertura natural que pode esconder criaturas, recursos ou caminhos desconhecidos.",

    interactive: true,
  },


  {
    keywords: [
      "rio",
      "riacho",
      "córrego",
    ],

    type: "landmark",

    importance: "low",

    score: 30,

    name: "Curso de Água",

    description:
      "Um curso de água atravessa ou acompanha este lugar.",

    interactive: false,
  },


  {
    keywords: [
      "lago",
    ],

    type: "landmark",

    importance: "medium",

    score: 35,

    name: "Lago",

    description:
      "Uma extensão de água domina parte da paisagem.",

    interactive: true,
  },


  // ==========================================
  // RELIGIÃO
  // ==========================================

  {
    keywords: [
      "templo",
      "santuário",
    ],

    type: "location",

    importance: "high",

    score: 70,

    name: "Templo",

    description:
      "Um espaço dedicado à fé, aos rituais e aos mistérios religiosos.",

    interactive: true,
  },


  {
    keywords: [
      "altar",
    ],

    type: "object",

    importance: "high",

    score: 65,

    name: "Altar",

    description:
      "Um local destinado a cerimônias e possíveis rituais.",

    interactive: true,
  },


  // ==========================================
  // OBJETOS
  // ==========================================

  {
    keywords: [
      "estátua",
      "estatua",
    ],

    type: "object",

    importance: "medium",

    score: 40,

    name: "Estátua",

    description:
      "Uma antiga representação que pode possuir significado histórico ou simbólico.",

    interactive: true,
  },


  {
    keywords: [
      "lareira",
      "fogão",
      "fogo",
    ],

    type: "object",

    importance: "low",

    score: 25,

    name: "Lareira",

    description:
      "Uma fonte de calor que também pode esconder detalhes do ambiente.",

    interactive: true,
  },


  {
    keywords: [
      "varanda",
      "sacada",
    ],

    type: "landmark",

    importance: "medium",

    score: 45,

    name: "Varanda",

    description:
      "Um ponto elevado permite observar a região ao redor.",

    interactive: true,
  },


  {
    keywords: [
      "jardim",
      "jardins",
    ],

    type: "location",

    importance: "medium",

    score: 35,

    name: "Jardim",

    description:
      "Uma área cultivada que pode esconder caminhos ou pequenos recantos.",

    interactive: true,
  },


  // ==========================================
  // MASMORRAS
  // ==========================================

  {
    keywords: [
      "masmorra",
      "calabouço",
      "prisão",
      "cela",
    ],

    type: "location",

    importance: "high",

    score: 75,

    name: "Masmorra",

    description:
      "Uma área sombria onde prisioneiros podem ser mantidos e segredos esquecidos podem estar escondidos.",

    interactive: true,
  },

]