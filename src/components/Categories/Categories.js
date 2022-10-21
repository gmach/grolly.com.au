import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import CategoryHeader from '../CategoryHeader'
import SpinnerLoader from '../SpinnerLoader'
import { Categories as CategoriesObj } from '../../config'
import useToggle from '../../hooks/useToggle'
import { setCategoryId } from '../../features/products/productsSlice'
import { useDispatch } from "react-redux";

export const Categories = () => {
  let categories = Object.entries(CategoriesObj);
  const status = useSelector(state => state.todos.status)
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
            <div  className="categories-pane">
              { categories.map((category) => (
                <div className="catitem" key={category[0]}>
                  <Link className='catlink thumb' 
                    to={`/categories/${category[0]}`}
                    onClick={()=>handleClick(category[0])}
                  >
                    {category[1]} 
                    {/* <CategoryRow/> */}
                  </Link>
                </div>
              ))}
            </div>
            <div className="content-pane">
              <div id="routedContent">
                <Outlet />
              </div>
            </div>
          </>
        }
        </div>
        {
          status === 'loading' &&
            <SpinnerLoader/>
        }
      </main>
      </>
  );
}