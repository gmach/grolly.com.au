import { BrowserRouter, Routes, Route } from 'react-router-dom'
import IndexPage from '../IndexPage'
import Main from '../Main'
import Categories from '../Categories'
import Category from '../CategoryProducts'
import Product from '../Product'
import Barcode from '../Barcode'
import Search from '../Search'
import Cart from '../Cart'
import About from '../About'
import Privacy from '../Privacy'
import Error from '../Error'
import PageNotFound from '../PageNotFound'

const FILTERTYPES = [
  {id: 'all', name: 'All'},
  {id: 'both', name: 'Both'},
  {id: 'woolworths', name: 'Woolworths'},
  {id: 'coles', name: 'Coles'}
];

const CATEGORIES = {
  // 0: "Top Diffs",  
  1: "Fruit & Veg",
  2: "Meat, Seafood & Deli",  
  3: "Bakery",
  4: "Dairy, Eggs & Fridge",
  5: "Pantry",
  6: "Freezer",
  7: "Drinks",
  8: "Liquor",
  9: "Front of Store",
  10: "Pet",
  11: "Baby",
  12: "Health & Beauty",
  13: "Household"
}

export const App = () => {
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<IndexPage />}>
              <Route path="/" elemenlt={<Categories />} >
              {/* <Route path="/" element={<Main categories={Object.entries(CATEGORIES)} types={FILTERTYPES}/>} > */}
                <Route path=":categoryId/:filter/" element={<Category/>} >
                  <Route path=":productId" element={<Product/>} />
                </Route>
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