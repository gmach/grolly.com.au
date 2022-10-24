import { useContext } from "react"
import { RootContext } from "../Root"

export function CartActions({ item }) {
  const { dispatch } = useContext(RootContext);
  
  const addToCartHandler = async () => {
    dispatch({
      type: 'addToCart', 
      payload: item
    })
  }

  const removeFromCartHandler = async () => {
    dispatch({
      type: 'removeFromCart', 
      payload: item
    })
  }

  return (
    <>
      <button className="btn btn-primary addCart" onClick={addToCartHandler}>
        <i className="fas fa-plus-circle"></i>
      </button>
      <button className="btn btn-primary removeCart" onClick={removeFromCartHandler}>
        <i className="fas fa-minus-circle"></i>
      </button>
    </>
  )
}
