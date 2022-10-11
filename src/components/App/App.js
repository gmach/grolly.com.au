import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import DefaultHome from '../DefaultHome'
import Main from '../Main'
import Categories from '../Categories'
import Category from '../Category'
import Barcode from '../Barcode'
import Search from '../Search'
import Cart from '../Cart'
import About from '../About'
import Privacy from '../Privacy'
import Error from '../Error'
import PageNotFound from '../PageNotFound'

export const App = () => {
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="" element={<Main />}>
              <Route path="/" element={<Categories />} >
                <Route path=":categoryId/:filter" element={<Category/>} />
              </Route>
              <Route path="barcode" element={<Barcode />} />
              <Route path="search" element={<Search />} />
              <Route path="cart" element={<Cart />} />              
              <Route path="about" element={<About />} />  
              <Route path="privacy" element={<Privacy />} /> 
              <Route path="404" element={<Error />} />   
              <Route path="*" element={<PageNotFound/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
    </>
  )
}