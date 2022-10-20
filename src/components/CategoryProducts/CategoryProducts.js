import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import {
  fetchProducts,
  selectProducts, 
  selectProductById
} from '../../features/products/productsSlice'
import { StatusFilters, statusFilterChanged } from '../../features/filters/filtersSlice'

import {
  Outlet,
  Link,
  useParams,
  useLoaderData,
  Form,
  redirect,
  useNavigate,
  useNavigation,
  useSubmit
} from "react-router-dom";

import Tile from '../Tile'


import store from '../../store'
export async function loader({ params }) {
    // store.dispatch(fetchProducts(params.categoryId))

//   const RESTURL = 'http://localhost:1234';//'https://groceryhawker-api.au.ngrok.io';// https://localhost:1234';
// const page = 1;
// const filter = 'all'
// const isAdmin = false; // admin view
// const url = RESTURL + '/category/' + 1
// + '/filter/' + filter
// + '/page/' + page
// + '/isAdmin/' + isAdmin;
  // return fetch(url)

}

export async function action() {
  
}

export default function CategoryProducts() {
  // const data = useLoaderData();
  const ids = useSelector(state => state.todos.ids)
  const entities = useSelector(state => state.todos.entities)
  const data = useSelector(state => selectProducts(state))
  const navigate = useNavigate();
  const params = useParams();
  const categoryId = parseInt(params.categoryId, 10)
  const showCategories = useSelector(state => state.todos.categoryName)

  const dispatch = useDispatch()
  const { filter } = useSelector(state => state.filters)
  const capitalizedFilter = filter.charAt(0).toUpperCase() + filter.slice(1);
  const selectedFilter = StatusFilters[capitalizedFilter]
  // const filter = params.filter
  const prodsFound = 50;
  const totalCount = 500;

  useEffect(() => {
    dispatch(fetchProducts(categoryId))
  }, [categoryId]);
  
const scrollUp = () => {

}

const handleSelect = (e) => {
  const newFilter = e.target.value
  dispatch(statusFilterChanged(newFilter))
  // navigate('/categories/' + categoryId + '/' + newFilter);
    
}
const viewProduct = (item) => {
  localStorage.setItem('localGroceryItem', JSON.stringify(item));
  let previousState = {
      // items: $scope.items,
      // prodsFound: $scope.prodsFound,
      // totalAll: $scope.totalAll,
      // totalBoth: $scope.totalBoth,
      // totalColes: $scope.totalColes,
      // totalWow: $scope.totalWow,
      // totalCount: $scope.totalCount
  }
  localStorage.setItem('previousState', JSON.stringify(previousState));
  navigate("/categories/product");
};
  const view = 'category'
  return  (
    <>
      {
        showCategories &&
        <div className="categoryHeader">
          <span className="prodsfound">{ prodsFound } of { totalCount } products found.</span>
          <label htmlFor="selectedType">
              <select 
                className="selectedType" 
                id="selectedType" 
                value={filter} 
                onChange={handleSelect}
                >
                  {
                    Object.entries(StatusFilters).map(([key, value]) => {
                      return (
                        <option 
                          key={key} 
                          value={value}
                        >
                          {key}
                        </option>
                      )
                    })
                  }
              </select>
          </label>

      </div>  
      } 
      <div className="products-container">
        {
          data && data.map(item => {
            const clsName = 'product-tile match' + item.type
            if (item.type == selectedFilter || selectedFilter === 'all')
              return (
                <Link to={`/product/${item.id}`} key={item.id}>
                  <Tile product={item} view={view} className={clsName}/>
                </Link>
              )
          })
        }
      </div>
      <span className="scrollup" onClick={scrollUp}><i className="fas fa-chevron-circle-up"></i></span>      
    </>
  )
}
