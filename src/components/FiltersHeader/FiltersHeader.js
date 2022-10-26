import { StatusFilters, statusFilterChanged } from '../../features/filters/filtersSlice'
import { useSelector, useDispatch } from "react-redux"
import { fetchProducts } from '../../features/products/productsSlice'

export default function FiltersHeader( { prodsFound, totalCount }) {
  const dispatch = useDispatch()
  const categoryId = useSelector(state => state.products.categoryId)
  const { filter } = useSelector(state => state.filters)
  const handleSelect = (e) => {
    const newFilter = e.target.value
    dispatch(statusFilterChanged(newFilter))
    dispatch(fetchProducts())
  }
  return (
    <>
    {
      categoryId !== '' &&
      <div className="filtersHeader">
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
    </>
  )
}
