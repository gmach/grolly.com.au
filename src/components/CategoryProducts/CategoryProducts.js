import { memo,  useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom";
import {
  fetchProducts,
  selectFilteredProducts,
  setCategoryId
} from '../../features/products/productsSlice'
import TileContainer from "../TileContainer";
import FiltersHeader from "../FiltersHeader";

export async function loader({ params }) {
    // store.dispatch(fetchProducts(params.categoryId))
}

export async function action() {}

const CategoryProducts = memo(() => {
  const data = useSelector(state => selectFilteredProducts(state))
  const params = useParams();
  const categoryId = parseInt(params.categoryId, 10)
  const dispatch = useDispatch()
  const totalCount = useSelector(state => state.products.totalCount)  
  const status = useSelector(state => state.products.status)

  useEffect(() => { 
		const runAsync = async () => {
			// if (data.length == 0) //load fresh from server
      dispatch(setCategoryId(categoryId))
      dispatch(fetchProducts())
		}
		runAsync()
	}, [categoryId])

  const view = 'category'
  return status === 'loading' ? null :
    <>
      <FiltersHeader prodsFound={data.length} totalCount={totalCount}/>
      <TileContainer data={data} view={view} />
    </>
})

export default CategoryProducts