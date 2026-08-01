import type {
  AssistantResult,
} from "../../engine/assistant/AssistantResult"



interface Props {

  open:boolean

  onClose:() => void

  result:AssistantResult | null

}





export default function AssistantModal({

  open,

  onClose,

  result,

}:Props){



  if(
    !open ||
    !result
  ){

    return null

  }



  return (

    <div
      className="
        fixed
        inset-0
        bg-black/70
        backdrop-blur-sm
        flex
        items-center
        justify-center
        z-50
        p-4
      "
    >


      <div
        className="
          bg-neutral-950
          text-white
          rounded-2xl
          w-full
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
          shadow-2xl
          border
          border-neutral-700
        "
      >


        <div
          className="
            flex
            justify-between
            items-center
            p-6
            border-b
            border-neutral-700
            sticky
            top-0
            bg-neutral-950
            z-10
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-bold
                flex
                items-center
                gap-2
              "
            >

              ✨ Assistente Narrativo

            </h2>


            <p
              className="
                text-sm
                text-neutral-400
                mt-1
              "
            >

              Observação da campanha, análise do mundo e possíveis destinos narrativos.

            </p>

          </div>



          <button

            onClick={onClose}

            className="
              text-neutral-400
              hover:text-white
              text-3xl
              transition
            "

            aria-label="Fechar"

          >

            ×

          </button>


        </div>





        <div
          className="
            p-6
            space-y-8
          "
        >





          {/* =========================
              Resumo da campanha
          ========================= */}


          <Section

            title="📖 Resumo da campanha"

          >

            <Card>


              <div
                className="
                  space-y-5
                "
              >


                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >

                  <span
                    className="
                      text-3xl
                    "
                  >

                    📜

                  </span>



                  <p
                    className="
                      leading-relaxed
                      text-neutral-200
                    "
                  >

                    {
                      result.summary ||
                      "A campanha ainda está em seus primeiros momentos. O mundo aguarda pelos acontecimentos que irão moldar seu destino."
                    }

                  </p>


                </div>





                <div
                  className="
                    border-t
                    border-neutral-800
                    pt-4
                    grid
                    grid-cols-2
                    md:grid-cols-4
                    gap-3
                  "
                >


                  <SummaryMetric

                    icon="🎭"

                    label="Atmosfera"

                    value={
                      result.sceneMood ||
                      "Indefinida"
                    }

                  />



                  <SummaryMetric

                    icon="⚔️"

                    label="Conflitos"

                    value={
                      String(
                        result.activeConflicts?.length ?? 0
                      )
                    }

                  />



                  <SummaryMetric

                    icon="🔮"

                    label="Mistérios"

                    value={
                      String(
                        result.unresolvedThreads?.length ?? 0
                      )
                    }

                  />



                  <SummaryMetric

                    icon="👥"

                    label="Personagens"

                    value={
                      String(
                        (
                          result.aliveCharacters?.length ?? 0
                        )
                        +
                        (
                          result.deadCharacters?.length ?? 0
                        )
                      )
                    }

                  />


                </div>


              </div>


            </Card>


          </Section>








          {/* =========================
              Situação atual
          ========================= */}


          <Section

            title="🎭 Situação atual"

          >

            <Card>


              <p
                className="
                  leading-relaxed
                  text-neutral-200
                "
              >

                {
                  result.currentSituation ||
                  "A situação atual ainda não foi definida."
                }

              </p>



              <p
                className="
                  mt-3
                  text-neutral-400
                "
              >

                🌫️ Estado emocional da cena:

                {" "}

                <span
                  className="
                    text-white
                    font-semibold
                  "
                >

                  {
                    result.sceneMood ||
                    "Desconhecido"
                  }

                </span>


              </p>


            </Card>


          </Section>








          <Section

            title="💡 Possíveis caminhos"

          >

            <SuggestionList

              items={
                result.suggestions
              }

            />


          </Section>







          <Section

            title="🌌 Eventos que podem surgir"

          >

            <EventList

              items={
                result.possibleEvents
              }

            />


          </Section>







          <Section

            title="⚔️ Conflitos ativos"

          >

            <SimpleList

              items={
                result.activeConflicts
              }

            />


          </Section>







          <Section

            title="🔮 Mistérios e pontas soltas"

          >

            <SimpleList

              items={
                result.unresolvedThreads
              }

            />


          </Section>







          <div
            className="
              grid
              md:grid-cols-2
              gap-6
            "
          >

            <Section

              title="🟢 Personagens presentes"

            >

              <SimpleList

                items={
                  result.aliveCharacters
                }

              />

            </Section>




            <Section

              title="⚰️ Personagens perdidos"

            >

              <SimpleList

                items={
                  result.deadCharacters
                }

              />

            </Section>


          </div>




        </div>


      </div>


    </div>

  )

}







function Section({

  title,

  children,

}:{

  title:string

  children:React.ReactNode

}){


  return (

    <section
      className="
        space-y-3
      "
    >

      <h3
        className="
          text-lg
          font-bold
        "
      >

        {title}

      </h3>


      {children}


    </section>

  )

}







function Card({

  children,

}:{

  children:React.ReactNode

}){


  return (

    <div
      className="
        bg-neutral-900
        border
        border-neutral-800
        rounded-xl
        p-4
        hover:border-neutral-600
        transition
      "
    >

      {children}

    </div>

  )

}







function SummaryMetric({

  icon,

  label,

  value,

}:{

  icon:string

  label:string

  value:string

}){


  return (

    <div
      className="
        bg-neutral-950
        rounded-lg
        p-3
        border
        border-neutral-800
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
          text-xs
          uppercase
          text-neutral-500
        "
      >

        <span>
          {icon}
        </span>


        {label}


      </div>



      <p
        className="
          text-white
          font-bold
          text-lg
          mt-2
        "
      >

        {value}

      </p>


    </div>

  )

}







function SuggestionList({

  items,

}:{

  items:AssistantResult["suggestions"]

}){


  if(
    !items ||
    items.length === 0
  ){

    return <Empty/>

  }



  return (

    <List>

      {

        items.map(

          (item,index)=>(

            <Card

              key={index}

            >

              <h4
                className="
                  font-semibold
                "
              >

                💡 {item.title}

              </h4>



              <p
                className="
                  text-neutral-300
                  mt-2
                "
              >

                {item.description}

              </p>


            </Card>

          )

        )

      }

    </List>

  )

}







function EventList({

  items,

}:{

  items:AssistantResult["possibleEvents"]

}){


  if(
    !items ||
    items.length === 0
  ){

    return <Empty/>

  }



  return (

    <List>

      {

        items.map(

          (event,index)=>(

            <Card

              key={index}

            >

              <h4
                className="
                  font-semibold
                "
              >

                🌌 {event.title}

              </h4>



              <p
                className="
                  text-neutral-300
                  mt-2
                "
              >

                {event.description}

              </p>


            </Card>

          )

        )

      }


    </List>

  )

}







function List({

  children,

}:{

  children:React.ReactNode

}){


  return (

    <div
      className="
        space-y-3
      "
    >

      {children}

    </div>

  )

}







function SimpleList({

  items,

}:{

  items:string[]

}){


  if(
    !items ||
    items.length === 0
  ){

    return <Empty/>

  }



  return (

    <ul
      className="
        list-disc
        pl-5
        space-y-2
        text-neutral-300
      "
    >

      {

        items.map(

          (item,index)=>(

            <li
              key={index}
            >

              {item}

            </li>

          )

        )

      }


    </ul>

  )

}







function Empty(){


  return (

    <p
      className="
        text-neutral-500
        italic
      "
    >

      Nenhuma informação narrativa registrada até o momento.

    </p>

  )

}