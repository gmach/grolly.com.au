import { StatusFilters, statusFilterChanged } from '../../features/filters/filtersSlice'
import { useSelector, useDispatch } from "react-redux"
import { fetchProducts } from '../../features/products/productsSlice'
import './styles.scss'
export default function FiltersHeader( { prodsFound, totalCount }) {
  const dispatch = useDispatch()
  const categoryId = useSelector(state => state.products.categoryId)
  const { filter } = useSelector(state => state.filters)
  const handleSelect = (e) => {
    const newFilter = e.target.value
    dispatch(statusFilterChanged(newFilter))
    dispatch(fetchProducts())
  }

  const statusOptions = Object.entries(StatusFilters).map(([key, value]) => {
    return (
      <option 
        key={key} 
        value={value}
      >
        {key}
      </option>
    )
  })
  return (
    <>
    {
      categoryId !== '' &&
      <div className="filtersHeader">
        <h2 className="prodsfound">{ prodsFound } of { totalCount } products found</h2>
        <select 
          className="selectedType" 
          id="selectedType" 
          value={filter} 
          onChange={handleSelect}
          >
            { statusOptions }
        </select>
      </div>  
    }
    </>
  )
}
