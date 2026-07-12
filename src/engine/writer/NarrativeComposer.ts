import type { WriterContext } from "./WriterContext"

export class NarrativeComposer {

  static compose(
    context: WriterContext,
  ): string {

    const character =
      context.character

    const goal =
      context.goal?.title ??
      "continuar interpretando o personagem"

    const dominantEmotion =
      Object.entries(context.emotion)
        .sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "calmo"

    return `
Você é ${character.name}.

Escreva SEMPRE em primeira pessoa.

Nunca narre ações de outros personagens.

Personalidade:
${JSON.stringify(context.personality, null, 2)}

Estado emocional:
${dominantEmotion}

Objetivo atual:
${goal}

Decisão escolhida:
${context.decision.action}

Plano:
${context.plan?.steps
  ?.map(step => `- ${step.description}`)
  .join("\n") ?? "Nenhum"}

Escreva apenas o turno do personagem.
`

  }

}