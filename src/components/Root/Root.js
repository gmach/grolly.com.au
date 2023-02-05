import { createContext, useEffect, useReducer, useState } from "react";
import { Outlet, redirect, useNavigate } from "react-router-dom";
import Header from '../Header'
import Footer from '../Footer'
import SpinnerLoader from '../SpinnerLoader'
import { SnackBarType } from "../SnackBar";
import './mulifont.scss'
import './styles.scss'

export const RootContext = createContext();

export const Root = () => {

  const reducer = (state, action) => {
    const processCart = action => {
      const item = action.payload
      if (typeof item !== 'object') 
        throw Error('Item not added. Expected object!')
      let cart = [...state.cart]
      const index = cart.findIndex(el => el.id == item.id && el.stockCode == item.stockCode)
      let cartMessage, messageType
      if (action.type === 'addToCart') {
        cartMessage = 'Item already exists in your shopping cart!'
        messageType = SnackBarType.fail
        if (index === -1) {
          cart.push(item)
          cartMessage = 'Item has been added to your shopping cart'
          messageType = SnackBarType.success
        }
      } else if (action.type === 'removeFromCart') {
        cartMessage = 'Item does not exist in your shopping cart!'
        messageType = SnackBarType.fail
        if (index > -1) {
          cart.splice(index, 1)    
          cartMessage = 'Item has been removed from your shopping cart'
          messageType = SnackBarType.success
        }
      }
      return {
        ...state,
        cart,
        snackBar: {
          cartMessage,
          messageType
        }
      }
    }       
    switch (action.type) {
      case 'addToCart':
      case 'removeFromCart': {
        return processCart(action)
      }
      case 'upsert':
        return {
          ...state,
          ...action.payload
        }
      case 'init':
        return action.payload
      default:
        throw new Error();
    }
  }
  
  const [state, dispatch] = useReducer(reducer, {
    cart: []
  });
  const [showCategories, setShowCategories] = useState(true)

  const navigate = useNavigate();

  useEffect(() => {
    let userCart = localStorage.userCart; 
    if (userCart != null)
      userCart = JSON.parse(userCart);
    else 
      userCart = [];
    dispatch({type: 'init', 
      payload: {
        cart: userCart
      }
    })
    navigate("/categories");
  }, [])
  
  return (
    <RootContext.Provider value={{ state, dispatch, showCategories, setShowCategories }}>
      <Header/>
      <SpinnerLoader/>
      <Outlet/> 
      <Footer/>
    </RootContext.Provider>
  );
}