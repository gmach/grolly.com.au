import { useContext } from "react"
import { RootContext } from "../Root"

export function CartActions({ item }) {
  const { data } = useContext(RootContext);
  return (
    <>
      <button className="btn btn-primary addCart" onClick={()=>data.addToCartHandler(item)}>
        <i className="fas fa-plus-circle"></i>
      </button>
      <button className="btn btn-primary removeCart" onClick={()=>data.removeFromCartHandler(item)}>
        <i className="fas fa-minus-circle"></i>
      </button>
    </>
  )
}
