import { useContext } from "react"
import { RootContext } from "../Root"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faMinusCircle} from '@fortawesome/free-solid-svg-icons'
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
        <FontAwesomeIcon icon={faPlusCircle} />
      </button>
      <button className="btn btn-primary removeCart" onClick={removeFromCartHandler}>
        <FontAwesomeIcon icon={faMinusCircle} />
      </button>
    </>
  )
}
