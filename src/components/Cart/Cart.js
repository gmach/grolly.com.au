import { useContext } from "react"
import { RootContext } from "../Root"
import TileContainer from "../TileContainer";

export async function loader() {}
export async function action() {}

export default function Cart() {
  const { state } = useContext(RootContext);
  const view = 'cart'
  return (
    <>
      <h1 className="cartHeader">
        {
          state.cart && state.cart.length > 0 &&
          <>
            <div>
              Total shopping price <span className="cartTotal">{ state.total }</span>&nbsp;
              You saved <span className="cartSavingTotal">{ state.diffTotal }</span>
            </div>
            {/* {
              data && data.isStale && 
              <div className="stalecart">
                This cart is more than 1 day old. Click
                  <button className="syncCart btn btn-primary btn-margin" onClick={data.syncCartHandler}>
                    Sync Cart
                  </button><span className="cartsaved">{ data.cartSyncedMsg }</span>
                <p> to update with latest prices.</p>
              </div>              
            } */}
          </>          
        }
      </h1>
      <TileContainer data={state.cart} view={view} />
      <div className="cartHeader">
        {
          state.cart && state.cart.length > 0 ?
            <div>
              {/* <button className="saveCart btn btn-primary btn-margin"  onClick={data.saveCartHandler}>
                Save Cart
              </button><span className="cartsaved">{ data.cartSavedMsg }</span> */}
            </div>
          :
            <div>Nothing added in your cart. Add some items first.</div>
        }
      </div>

    </>
  )
}
