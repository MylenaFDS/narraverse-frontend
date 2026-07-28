type Props = {
  deadCharacters: string[]
}

export function CharacterDeathSection({
  deadCharacters,
}: Props) {

  if (
    deadCharacters.length === 0
  ) {

    return null

  }

  return (

    <section>

      <h3>
        ☠ Mortos
      </h3>

      <ul>

        {deadCharacters.map(
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