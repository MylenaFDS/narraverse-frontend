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


        {/* =========================
            Header
        ========================= */}


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

              Análise da campanha e próximos caminhos narrativos

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
              Resumo
          ========================= */}


          <Section
            title="📖 Resumo da campanha"
          >

            <p
              className="
                leading-relaxed
                text-neutral-200
              "
            >

              {result.summary || "Nenhum resumo disponível."}

            </p>


          </Section>





          {/* =========================
              Estado atual
          ========================= */}


          <Section
            title="🎭 Situação atual"
          >

            <Card>

              <p>

                {result.currentSituation}

              </p>


              <p
                className="
                  mt-3
                  text-neutral-300
                "
              >

                🌫️ Clima:

                {" "}

                <span
                  className="
                    font-semibold
                    text-white
                  "
                >

                  {result.sceneMood}

                </span>

              </p>


            </Card>


          </Section>





          {/* =========================
              Sugestões
          ========================= */}


          <Section
            title="💡 O que fazer agora"
          >


            <SuggestionList

              items={result.suggestions}

            />


          </Section>





          {/* =========================
              Eventos possíveis
          ========================= */}


          <Section

            title="🌌 Eventos possíveis"

          >


            <EventList

              items={result.possibleEvents}

            />


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
              Pontas soltas
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


          <div
            className="
              grid
              md:grid-cols-2
              gap-6
            "
          >


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


    </div>

  )

}






/* =====================================================
   Section
===================================================== */


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
          text-white
        "
      >

        {title}

      </h3>


      {children}


    </section>

  )

}







/* =====================================================
   Card
===================================================== */


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
        transition
        hover:border-neutral-600
      "

    >

      {children}

    </div>

  )

}







/* =====================================================
   Sugestões
===================================================== */


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
                  text-white
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








/* =====================================================
   Eventos
===================================================== */


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







/* =====================================================
   Lista genérica
===================================================== */


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







/* =====================================================
   Lista simples
===================================================== */


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







/* =====================================================
   Empty State
===================================================== */


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