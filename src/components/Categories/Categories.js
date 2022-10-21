import { NavLink, Outlet } from "react-router-dom";
import CategoryHeader from '../CategoryHeader'
import { Categories as CategoriesObj } from '../../config'
import useToggle from '../../hooks/useToggle'
import { setCategoryId } from '../../features/products/productsSlice'
import { useDispatch } from "react-redux";

export const Categories = () => {
  let categories = Object.entries(CategoriesObj);
  const [showCategories, toggleShowCategories] = useToggle()
    // const [categoryId, setCategoryId] = useState(1)
  const dispatch = useDispatch();
  const handleClick = categoryId => dispatch(setCategoryId(categoryId))
  return (
    <>
      <CategoryHeader showCategories={showCategories} toggleShowCategories={toggleShowCategories}/>
      <main className="main-container">
        <div className="main-content">
        {
          showCategories && 
          <>
            <div className="categories-pane">
            { 
              categories.map(category => {
                const [categoryId, categoryName] = category
                return (
                  <div className="catitem" key={categoryId}>
                    <NavLink className='catlink thumb' 
                      to={`/categories/${categoryId}`}
                      onClick={()=>handleClick(categoryId)}
                    >
                      {categoryName} 
                    </NavLink>
                  </div>
                )
              })
            }
            </div>
            <div className="content-pane">
              <div id="routedContent">
                <Outlet />
              </div>
            </div>
          </>
        }
        </div>
      </main>
      </>
  );
}