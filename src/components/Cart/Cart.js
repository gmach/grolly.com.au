import { useState, useEffect } from "react";
import {
  Link,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit
} from "react-router-dom";

import Tile from '../Tile'
import TileContainer from "../TileContainer";
import _ from 'lodash'
export async function loader({ params }) {

}

export async function action() {
  
}

export default function Cart() {
  const [cart, setCart] = useState([])
  let cartChanged = false
  let showCartMsg = false
  let cartMessage

  useEffect(() => {
    let userCart = localStorage.userCart; 
    if (userCart != null)
      userCart = JSON.parse(userCart);
    else 
      userCart = [];
    setCart(userCart)
  }, [])

  let total = 0;
  let diffTotal = 0;
  let isStale = false;
  let isEmpty = cart.length === 0
  for (const item of cart) {
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
    let cartItem = Object.assign(...item, {
      datedAdded: new Date().toString().substr(0,21)
    })
    let tmpCart = [...cart]
    tmpCart.push(cartItem)
    let newCart = _.uniqWith(tmpCart, (val1, val2) => {
      return val1.id == val2.id && val1.stockCode == val2.stockCode;
    });
    cartChanged = newCart.length > startSize;
    setCart(cartItems => [...cartItems, cartItem])
  }

  const sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  const handleAdd = async (item) => {
    const added = addToCart(item);
    cartMessage = added ? 'Item has been added to your shopping cart' : 'Item already exists in your shopping cart!'
    await sleep(2000)
    showCartMsg = false
    cartMessage = ''
  }

  const syncCart = () => {}
  const saveCart = () => {}
  const cartSynced = false;
  const cartSaved = 'cartSaved';
  const view = 'cart'
  return (
    <>
      <h1 className="cartHeader">
        {
          cart.length > 0 &&
          <>
            <div>Total shopping price <span className="cartTotal">{ cart.total }</span></div>
            <div>You saved <span className="cartSavingTotal">{ cart.diffTotal }</span></div>
            {
              isStale && 
              <div className="stalecart">
                This cart is more than 1 day old. Click
                  <button className="syncCart btn btn-primary btn-margin" onClick={syncCart}>
                    Sync Cart
                  </button><span className="cartsaved">{ cartSynced }</span>
                <p> to update with latest prices.</p>
              </div>              
            }
          </>          
        }
      </h1>
      <TileContainer data={cart} view={view} />
      <div className="cartHeader">
        {
          cart.length > 0 ?
            <div>
              <button className="saveCart btn btn-primary btn-margin" onClick={saveCart}>
                Save Cart
              </button><span className="cartsaved">{ cartSaved }</span>
            </div>
          :
            <div>Nothing added in your cart. Add some items from the product display page.</div>
        }
      </div>

    </>
  )
}
