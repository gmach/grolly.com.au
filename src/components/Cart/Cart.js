import { useContext } from "react"
import { RootContext } from "../Root"
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
  const { data } = useContext(RootContext);
  const cart = data.cart
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
              data && data.isStale && 
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
