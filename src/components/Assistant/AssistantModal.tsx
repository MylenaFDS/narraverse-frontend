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
        flex
        items-center
        justify-center
        z-50
        p-4
      "
    >


      <div
        className="
          bg-neutral-900
          text-white
          rounded-xl
          w-full
          max-w-3xl
          max-h-[90vh]
          overflow-y-auto
          shadow-2xl
          border
          border-neutral-700
        "
      >


        {/* =========================
            Header
        ========================= */}


        <div
          className="
            flex
            justify-between
            items-center
            p-5
            border-b
            border-neutral-700
          "
        >

          <h2
            className="
              text-xl
              font-bold
            "
          >
            ✨ Assistente Narrativo
          </h2>


          <button

            onClick={onClose}

            className="
              text-neutral-400
              hover:text-white
              text-xl
            "

          >
            ×
          </button>


        </div>





        <div
          className="
            p-5
            space-y-6
          "
        >



          {/* =========================
              Resumo
          ========================= */}


          <Section
            title="📖 Resumo da campanha"
          >

            <p>
              {result.summary}
            </p>

          </Section>





          {/* =========================
              Estado atual
          ========================= */}


          <Section
            title="🎭 Situação atual"
          >


            <p>
              {result.currentSituation}
            </p>


            <p
              className="
                mt-2
                text-neutral-300
              "
            >

              Clima:
              {" "}
              {result.sceneMood}

            </p>


          </Section>







          {/* =========================
              Sugestões
          ========================= */}


          <Section
            title="💡 O que fazer agora"
          >


            {
              result.suggestions.length === 0

              ?

              <Empty/>

              :

              <List>

                {
                  result.suggestions.map(
                    (item,index)=>(

                      <Card
                        key={index}
                      >

                        <h4
                          className="
                            font-semibold
                          "
                        >
                          {item.title}
                        </h4>


                        <p
                          className="
                            text-neutral-300
                          "
                        >
                          {item.description}
                        </p>


                      </Card>

                    )
                  )
                }

              </List>

            }


          </Section>







          {/* =========================
              Eventos possíveis
          ========================= */}


          <Section
            title="🌌 Eventos possíveis"
          >


            {
              result.possibleEvents.length === 0

              ?

              <Empty/>

              :

              <List>

                {
                  result.possibleEvents.map(
                    (event,index)=>(

                      <Card
                        key={index}
                      >

                        <h4
                          className="
                            font-semibold
                          "
                        >
                          {event.title}
                        </h4>


                        <p
                          className="
                            text-neutral-300
                          "
                        >

                          {event.description}

                        </p>


                      </Card>

                    )
                  )
                }

              </List>

            }


          </Section>








          {/* =========================
              Conflitos
          ========================= */}


          <Section
            title="⚔️ Conflitos ativos"
          >


            <SimpleList

              items={
                result.activeConflicts
              }

            />


          </Section>







          {/* =========================
              Pendências
          ========================= */}


          <Section
            title="🔮 Pontas soltas"
          >


            <SimpleList

              items={
                result.unresolvedThreads
              }

            />


          </Section>








          {/* =========================
              Personagens
          ========================= */}



          <Section
            title="🟢 Personagens vivos"
          >


            <SimpleList

              items={
                result.aliveCharacters
              }

            />


          </Section>






          <Section
            title="⚰️ Personagens mortos"
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

    <section>


      <h3
        className="
          text-lg
          font-bold
          mb-2
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
        bg-neutral-800
        rounded-lg
        p-3
      "
    >

      {children}

    </div>

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
        space-y-2
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
        space-y-1
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
      Nenhuma informação registrada.
    </p>

  )

}