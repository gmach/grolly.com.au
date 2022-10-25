import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from '../Root'
import Categories from '../Categories'
import CategoryProducts, 
  {   
    loader as categoryProductsLoader,
    action as categoryProductsAction
   } 
  from '../CategoryProducts'

import Product,
  {   
    loader as productLoader,
    action as productAction
 } 
 from '../Product'
import Barcode from '../Barcode'
import Search,
 {
  loader as searchLoader,
  action as searchAction
 }
from '../Search'
import Cart,
 {
  loader as cartLoader,
  action as cartAction
 }
from '../Cart'
import About from '../About'
import Privacy from '../Privacy'
import Error from '../Error'
// import DefaultHome from '../DefaultHome'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    // loader: rootLoader,
    // action: rootAction,
    children: [
      { index: true, element: <Categories /> },
      {
        path: "categories",
        element: <Categories />,
        children: [
          {
            path: ":categoryId",
            element: <CategoryProducts />,
            loader: categoryProductsLoader,
            action: categoryProductsAction        
          }
        ]     
      },
      // {
      //   path: "categories/:categoryId",
      //   element: <CategoryProducts />,
      //   loader: categoryProductsLoader,
      //   action: categoryProductsAction    
      // },
      {
        path: "product/:stockCode",
        element: <Product />,
        loader: productLoader,
        action: productAction,
        errorElement: <div>Oops! There was an error.</div>,
      },   
      {
        path: "barcode",
        element: <Barcode />,
        errorElement: <div>Oops! There was an error.</div>,
      },    
      {
        path: "search",
        element: <Search />,
        loader: searchLoader,
        action: searchAction,
        errorElement: <div>Oops! There was an error.</div>,
      },    
      {
        path: "cart",
        element: <Cart />,
        loader: cartLoader,
        action: cartAction,
        errorElement: <div>Oops! There was an error.</div>,
      },  
      {
        path: "about",
        element: <About />,
        errorElement: <div>Oops! There was an error.</div>,
      },     
      {
        path: "privacy",
        element: <Privacy />,
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