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
import ScrollUp from "../ScrollUp"; 
import store from '../../store'
import TileContainer from "../TileContainer/TileContainer";
export async function loader({ params }) {
    // store.dispatch(fetchProducts(params.categoryId))

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
  const selectedCategoryId = useSelector(state => state.todos.categoryId)
  const showCategories = selectedCategoryId !== ''

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

const handleSelect = (e) => {
  const newFilter = e.target.value
  dispatch(statusFilterChanged(newFilter))
  // navigate('/categories/' + categoryId + '/' + newFilter);
    
}
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
      <TileContainer data={data} view={view} selectedFilter={selectedFilter} />
    </>
  )
}
