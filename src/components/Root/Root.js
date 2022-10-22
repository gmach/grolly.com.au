import { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from '../Header'
import Footer from '../Footer'
import SpinnerLoader from '../SpinnerLoader'
let RootContext

export const Root = () => {
  const [data, setData] = useState({
    cart: []
  });

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
    
    setData({
      cart: userCart,
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