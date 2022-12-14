import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode, faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useRef } from "react"
import { RootContext } from "../Root"
import SnackBar from "../SnackBar";
import useScroll from "../../hooks/useScroll";
import './styles.scss'
export const Header = () => {
  const { state, setShowCategories } = useContext(RootContext);
  const snackBarRef = useRef(null)
  const [scrollTo] = useScroll()
  const scrollUp = () => {
    scrollTo(0, 0)
  }
  const cartMessage = state.snackBar ? state.snackBar.cartMessage : null
  const messageType = state.snackBar ? state.snackBar.messageType : null
  const cartSize = state.cart.length > 0 ? state.cart.length : ''
  useEffect(() => {
    const doAsync = async () => {
      if (state.snackBar) {
        scrollUp()
        snackBarRef.current.show()
        const userCart = [...state.cart]
        localStorage.userCart = JSON.stringify(userCart)
      }
    }
    doAsync()
  }, [state.cart])

  return (
    <header>
      <div className="nav-bar">
        <li className="nav-item">
          <Link to="categories" onClick={()=>setShowCategories(true)}>
            <div className="nav-logo"/>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="barcode">
          <FontAwesomeIcon icon={faBarcode} size="2xl"/>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="search">
            <FontAwesomeIcon icon={faSearch} size="2xl"/>
          </Link>
        </li>      
        <li className="nav-item">
          <Link to="cart">
            <FontAwesomeIcon icon={faShoppingCart} size="2xl"/><span className="cartSize">{cartSize}</span>
          </Link>
        </li>
      </div>
        <SnackBar 
          message={cartMessage} 
          type={messageType} 
          ref={snackBarRef}
        />
    </header>
    

  )
}
