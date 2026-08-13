import { ExplorerAI } from "../../engine/explorer/ExplorerAI"
import {
  SceneGraphEngine,
} from "../../engine/explorer/SceneGraph"


export default function ExplorerAITest() {

  const result =
    ExplorerAI.analyzeScene(

      1,

      "Salão do Trono",

      `
        O enorme salão possui um antigo trono
        de pedra.

        Atrás dele existe uma biblioteca esquecida.

        Uma passagem secreta conduz às antigas
        muralhas do castelo.

        Uma torre pode ser vista através da
        varanda.
      `,

    )


  const graph =
    SceneGraphEngine.get(1)


  return (

    <div
      style={{
        padding: "40px",
        background: "#12090b",
        color: "#f2e9e4",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >

      <h1>
        Teste — Explorer AI
      </h1>


      <h2>
        Entidades detectadas
      </h2>


      <pre>
        {JSON.stringify(
          result.entities,
          null,
          2,
        )}
      </pre>


      <h2>
        Hotspots gerados
      </h2>


      <pre>
        {JSON.stringify(
          result.hotspots,
          null,
          2,
        )}
      </pre>


      <h2>
        Scene Graph
      </h2>


      <pre>
        {JSON.stringify(
          graph,
          null,
          2,
        )}
      </pre>

    </div>

  )

}