import { useContext } from "react"
import { RootContext } from "../Root"
import _ from 'lodash'

export function CartActions({ item }) {
  const { data, setData } = useContext(RootContext);

  const addToCart = item => {
    if (typeof item !== 'object') {
      throw Error('Item not added. Expected object!')
    }
    let cart = data.cart
    let index = cart.findIndex(el => el.id == item.id && el.stockCode == item.stockCode)
    if (index !== -1) 
      return false
    let cartItem = {...item}
    cartItem.dateAdded = new Date().toString().substr(0,21)
    cart.push(cartItem)
    setData(prevState => {
      return {
        ...prevState,
        cart
      }
    })
    localStorage.userCart = JSON.stringify(data.cart)
    return true
  }

  const addToCartHandler = async (item) => {
    const added = addToCart(item);
    let cartMessage = added ? 'Item has been added to your shopping cart' : 'Item already exists in your shopping cart!'
    setData(prevState => {
      return {
        ...prevState,
        cartMessage
      }
    })
    await sleep(2000)
    cartMessage = ''
    setData(prevState => {
      return {
        ...prevState,
        cartMessage
      }
    })
    localStorage.userCart = JSON.stringify(data.cart)
  }

  const removeFromCart = item => {
    if (typeof item !== 'object') {
      throw Error('Item not added. Expected object!')
    }
    let cart = data.cart
    let index = cart.findIndex(el => el.id == item.id && el.stockCode == item.stockCode)
    if (index === -1) 
      return false    
    cart.splice(index, 1)
    setData(prevState => {
      return {
        ...prevState,
        cart
      }
    })
    localStorage.userCart = JSON.stringify(data.cart)
    return true
  }

  const removeFromCartHandler = async (item) => {
    const removed = removeFromCart(item);
    let cartMessage = removed ? 'Item has been removed from your shopping cart' : 'Item does not exist in your shopping cart!'
    setData(prevState => {
      return {
        ...prevState,
        cartMessage
      }
    })
    await sleep(2000)
    cartMessage = ''
    setData(prevState => {
      return {
        ...prevState,
        cartMessage
      }
    })
    localStorage.userCart = JSON.stringify(data.cart)
  }  

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  return (
    <>
      <button className="btn btn-primary addCart" onClick={()=>addToCartHandler(item)}>
        <i className="fas fa-plus-circle"></i>
      </button>
      <button className="btn btn-primary removeCart" onClick={()=>removeFromCartHandler(item)}>
        <i className="fas fa-minus-circle"></i>
      </button>
    </>
  )
}
