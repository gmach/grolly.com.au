import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './components/Root'
import Categories from './components/Categories'
import CategoryProducts from './components/CategoryProducts'
import Product from './components/Product'
import Barcode from './components/Barcode'
import Search from './components/Search'
import Cart from './components/Cart'
import About from './components/About'
import Privacy from './components/Privacy'
import Error from './components/Error'
import DefaultHome from './components/DefaultHome'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    // loader: rootLoader,
    // action: rootAction,
    children: [
      { index: true, element: <DefaultHome /> },
      {
        path: "categories",
        element: <Categories />,
        // loader: contactLoader,
        // action: contactAction   
        children: [
          {
            path: ":categoryId/:filter",
            element: <CategoryProducts />,
            // loader: contactLoader,
            // action: contactAction        
          }
        ]     
      },  
      {
        path: "product/:productId",
        element: <Product />,
        // loader: contactLoader,
        // action: deleteAction,
        errorElement: <div>Oops! There was an error.</div>,
      },   
      {
        path: "barcode",
        element: <Barcode />,
        // loader: contactLoader,
        // action: deleteAction,
        errorElement: <div>Oops! There was an error.</div>,
      },      
      {
        path: "barcode",
        element: <Barcode />,
        // loader: contactLoader,
        // action: deleteAction,
        errorElement: <div>Oops! There was an error.</div>,
      },    
      {
        path: "search",
        element: <Search />,
        // loader: contactLoader,
        // action: deleteAction,
        errorElement: <div>Oops! There was an error.</div>,
      },    
      {
        path: "cart",
        element: <Cart />,
        // loader: contactLoader,
        // action: deleteAction,
        errorElement: <div>Oops! There was an error.</div>,
      },  
      {
        path: "about",
        element: <About />,
        // loader: contactLoader,
        // action: deleteAction,
        errorElement: <div>Oops! There was an error.</div>,
      },     
      {
        path: "privacy",
        element: <Privacy />,
        // loader: contactLoader,
        // action: deleteAction,
        errorElement: <div>Oops! There was an error.</div>,
      },    

    ]
  }

]);

export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}