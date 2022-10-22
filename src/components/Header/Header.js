import { Link } from "react-router-dom";
import { CartNotification } from '../Cart/CartNotification'
import { useContext } from "react"
import { RootContext } from "../Root"

export const Header = () => {
  const { data } = useContext(RootContext);
  const cartSize = data.cart.length
  return (
    <nav className="nav-container">
      <div className="nav-bar">
        <Link to="/" className="nav-logo nav-item"><img alt="sdf" className='logo' src="/img/GroceryHawker-03.png"/></Link>
        <Link to="barcode" className="nav-item scanMenu"><div className="barcodescanner"></div></Link>
        <Link to="search" className="nav-item searchMenu"><div><i className="fas fa-search"></i></div></Link>
        <Link to="cart" className="nav-item shopcart"><div><i className="fas fa-shopping-cart"></i>{cartSize}</div></Link>
        <CartNotification/>
      </div>
    </nav>
  )
}
