import { useParams } from "react-router-dom"

export default function RPG() {
  const { id } = useParams()

  return <h2 className="text-2xl">RPG {id}</h2>
}