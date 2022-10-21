import {
  Link,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit
} from "react-router-dom";

import Tile from '../Tile'

export async function loader({ params }) {

}

export async function action() {
  
}
const scrollUp = () => {

}
export default function Cart() {
  const cart = {
    total: '',
    diffTotal: '',
    isStale: false,
    isEmpty: true
  }
  const cartSynced = false;
  const cartSaved = 'cartSaved';
  let data = []
  const view =  'cart'
  return (
    <>
      <h1 className="cartHeader">
        <div ng-if="!cart.isEmpty">
          <div>Total shopping price <span className="cartTotal">{ cart.total }</span></div>
          <div>You saved <span className="cartSavingTotal">{ cart.diffTotal }</span></div>
          <div ng-if="cart.isStale" className="stalecart">This cart is more than 1 day old. Click
            
            <button className="syncCart btn btn-primary btn-margin" ng-click="syncCart()">
              Sync Cart
            </button><span className="cartsaved">{ cartSynced }</span>
            <p> to update with latest prices.</p>
          </div>
        </div>

      </h1>
      <div className="products-container">
        {
          data && data.map(item => {
            const clsName = 'product-tile match' + item.type
            return (
              <Link to={`/product/${item.id}`} key={item.id}>
                <Tile product={item} view={view} className={clsName}/>
              </Link>
            )
          })
        }
      </div>
      <span className="scrollup" onClick={scrollUp}><i className="fas fa-chevron-circle-up"></i></span>      

      <div className="cartHeader">
        <div ng-if="!cart.isEmpty">
          <button className="saveCart btn btn-primary btn-margin" ng-click="saveCart()">
            Save Cart
          </button><span className="cartsaved">{ cartSaved }</span>
        </div>
        <div ng-if="cart.isEmpty">Nothing added in your cart. Add some items from the product display page.</div>

      </div>

    </>
  )
}
