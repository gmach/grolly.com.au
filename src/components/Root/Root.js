import { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from '../Header'
import Footer from '../Footer'
import SpinnerLoader from '../SpinnerLoader'
import _ from 'lodash'
let RootContext

export const Root = () => {
  const [data, setData] = useState({});
  const cart = data.userCart ? data.userCart : []

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


    const addToCart = item => {
      if (typeof item !== 'object') {
        throw Error('Item not added as it is not an object!')
      }
      let startSize = cart.length;
      let cartItem = {...item}
      cartItem.dateAdded = new Date().toString().substr(0,21)
      let tmpCart = [...cart]
      tmpCart.push(cartItem)
      let newCart = _.uniqWith(tmpCart, (val1, val2) => {
        return val1.id == val2.id && val1.stockCode == val2.stockCode;
      });
      const cartChanged = newCart.length > startSize
      setData(prevState => {
        return {
          userCart: [...prevState.userCart, cartItem],
          cartChanged
        }
      })
      return cartChanged
    }
  
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    const addToCartHandler = async (item) => {
      let showCartMsg = addToCart(item);
      let cartMessage = showCartMsg ? 'Item has been added to your shopping cart' : 'Item already exists in your shopping cart!'
      setData(prevState => {
        return {
          ...prevState,
          showCartMsg,
          cartMessage
        }
      })
      await sleep(2000)
      showCartMsg = false
      cartMessage = ''
      setData(prevState => {
        return {
          ...prevState,
          showCartMsg,
          cartMessage
        }
      })
    }
    const removeFromCartHandler  = async (item) => {}
    setData({
      userCart,
      addToCartHandler,
      removeFromCartHandler,
      total: '$' + total.toFixed(2),
      diffTotal: '$' + diffTotal.toFixed(2),
      isStale,
      isEmpty
    })
  }, [])


  RootContext = createContext({ data, setData });

  return (
    <RootContext.Provider value={{ data, setData }}>
      <Header/>
      <SpinnerLoader/>
      <Outlet/>
      <Footer/>
    </RootContext.Provider>
  );
}

export { RootContext }