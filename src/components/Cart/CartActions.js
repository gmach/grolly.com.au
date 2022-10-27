import { useContext } from "react"
import { RootContext } from "../Root"
// import {
// 	addToCart,
//   removeFromCart
// } from '../../features/cart/cartSlice'
import { useDispatch, useSelector } from "react-redux"

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
  // const dispatch = useDispatch()
  // const addToCartHandler = async () => {
  //   dispatch(addToCart(item))
  // }
  // const removeFromCartHandler = async () => {
  //   dispatch(removeFromCart(item))
  // }
  // const cartentiites = useSelector(state => state.products.entities)
  
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
