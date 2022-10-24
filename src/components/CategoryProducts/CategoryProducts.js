import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom";
import {
  fetchProducts,
  selectProducts
} from '../../features/products/productsSlice'
import { StatusFilters } from '../../features/filters/filtersSlice'
import TileContainer from "../TileContainer";
import FiltersHeader from "../FiltersHeader";

export async function loader({ params }) {
    // store.dispatch(fetchProducts(params.categoryId))
}

export async function action() {
  
}

export default function CategoryProducts() {
  // const data = useLoaderData();
  const data = useSelector(state => selectProducts(state))
  const params = useParams();
  const categoryId = parseInt(params.categoryId, 10)
  const dispatch = useDispatch()
  const { filter } = useSelector(state => state.filters)
    // const filter = params.filter
  const totalCount = useSelector(state => state.products.totalCount)  
  const capitalizedFilter = filter.charAt(0).toUpperCase() + filter.slice(1);
  const selectedFilter = StatusFilters[capitalizedFilter]

  useEffect(() => {
    dispatch(fetchProducts(categoryId))
  }, [categoryId]);

  const view = 'category'
  return  (
    <>
      <FiltersHeader prodsFound={data.length} totalCount={totalCount}/>
      <TileContainer data={data} view={view} selectedFilter={selectedFilter} />
    </>
  )
}
