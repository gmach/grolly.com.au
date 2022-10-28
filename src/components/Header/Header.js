import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useRef } from "react"
import { RootContext } from "../Root"
import SnackBar from "../SnackBar";
import useScroll from "../../hooks/useScroll";
import logoImage from '../../img/GroceryHawker-03.png';
import './styles.scss'
export const Header = () => {
  const { state } = useContext(RootContext);
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
  }, [cartMessage])

  return (
    <nav className="nav-container">
      <div className="nav-bar">
        <Link to="/" className="nav-logo nav-item">
          <img alt="Logo" className='logo' src="/img/GroceryHawker-03.png"/>
        </Link>
        <Link to="barcode" className="nav-item scanMenu">
          <div className="barcodescanner"></div>
        </Link>
        <Link to="search" className="nav-item searchMenu">
          <FontAwesomeIcon icon={faSearch} size="2xl"/>
        </Link>
        <Link to="cart" className="nav-item shopcart">
          <FontAwesomeIcon icon={faShoppingCart} size="2xl"/><span className="cartSize">{cartSize}</span>
        </Link>
        <SnackBar 
          message={cartMessage} 
          type={messageType} 
          ref={snackBarRef}
        />
      </div>
    </nav>

    // <header>
    //   <div className="nav-bar">
    //     <li className="nav-item">
    //       <Link to="/">
    //         <div className="navd-logo"/>
    //       </Link>
    //     </li>
    //     <li className="nav-item">
    //       <Link to="barcode">
    //         <div className="barcodde-scanner"/>
    //       </Link>
    //     </li>
    //     <li className="nav-item">
    //       <Link to="search">
    //         <FontAwesomeIcon icon={faSearch} size="2xl"/>
    //       </Link>
    //     </li>      
    //     <li className="nav-item">
    //       <Link to="cart">
    //         <FontAwesomeIcon icon={faShoppingCart} size="2xl"/><span className="cartSize">{cartSize}</span>
    //       </Link>
    //     </li>
    //   </div>
    //     <SnackBar 
    //       message={cartMessage} 
    //       type={messageType} 
    //       ref={snackBarRef}
    //     />
    // </header>
  )
}
