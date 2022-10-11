import { Link } from "react-router-dom";
export const Header = () => {
  return (
    <nav className="nav-container">
      <div className="nav-bar">
        <Link to="/" className="nav-logo nav-item"><img alt="sdf" className='logo' src="/img/GroceryHawker-03.png"/></Link>
        <Link to="/barcode" className="nav-item scanMenu"><div className="barcodescanner"></div></Link>
        <Link to="/search" className="nav-item searchMenu"><div><i className="fas fa-search"></i></div></Link>
        <Link to="/cart" className="nav-item shopcart"><div><i className="fas fa-shopping-cart"></i>123</div></Link>
        <div hidden className="cartPrompt notification-panel">
          <div className="notification-panel-body">
            <p>{ '123' }</p>
          </div>
        </div>
      </div>
    </nav>
  )
}
