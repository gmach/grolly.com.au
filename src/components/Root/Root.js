import { createContext, useEffect, useReducer } from "react";
import { Outlet } from "react-router-dom";
import Header from '../Header'
import Footer from '../Footer'
import SpinnerLoader from '../SpinnerLoader'
import useToggle from "../../hooks/useToggle";
import { SnackBarType } from "../SnackBar";
import './mulifont.scss'

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
  const [showCategories, toggleShowCategories] = useToggle()
  useEffect(() => {
    let userCart = localStorage.userCart; 
    if (userCart != null)
      userCart = JSON.parse(userCart);
    else 
      userCart = [];
    let total = 0;
    let diffTotal = 0;
    let isStale = false;
    let isEmpty = userCart.length === 0
    for (const item of userCart) {
      total += parseFloat(item.price);
      diffTotal += item.diff ? parseFloat(item.diff) : 0
      let da = new Date(item.datedAdded);
      let day = 60 * 60 * 24 * 1000;
      let daplus1 = new Date(da.getTime() + day);
      let now = new Date();
      let dateDiff = now - daplus1;
      if (dateDiff / day > 1)
        isStale = true
    }
    dispatch({type: 'init', 
      payload: {
        cart: userCart,
        total: '$' + total.toFixed(2),
        diffTotal: '$' + diffTotal.toFixed(2),
        isStale,
        isEmpty
      }
    })
  }, [])
  
  return (
    <RootContext.Provider value={{ state, dispatch, showCategories, toggleShowCategories }}>
      <Header/>
      <SpinnerLoader/>
      <Outlet/> 
      <Footer/>
    </RootContext.Provider>
  );
}