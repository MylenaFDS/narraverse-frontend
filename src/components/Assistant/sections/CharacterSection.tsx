type Props = {
  characters: string[]
}

export function CharacterSection({
  characters,
}: Props) {

  if (
    characters.length === 0
  ) {

    return null

  }

  return (

    <section>

      <h3>
        👥 Personagens vivos
      </h3>

      <ul>

        {characters.map(
          character => (

            <li
              key={character}
            >

              {character}

            </li>

          ),
        )}

      </ul>

    </section>

  )

}