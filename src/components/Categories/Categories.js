import { NavLink, Outlet } from "react-router-dom";
import { Categories as CategoriesObj } from '../../config'
import { useContext } from "react";
import { RootContext } from "../Root";
import './styles.scss'
import CategoryHeader from "../CategoryHeader";

export const Categories = () => {
  let categories = Object.entries(CategoriesObj);
  const { showCategories, setShowCategories } = useContext(RootContext);
  const catItems = categories.map(category => {
    const [categoryId, categoryName] = category
    return (
      <li 
        className="catitem" 
        key={categoryId}
      >
        <NavLink 
          className='catlink' 
          to={`/categories/${categoryId}`}
          onClick={()=>setShowCategories(false)}
        >
          {categoryName} 
        </NavLink>
      </li>
    )
  })

  return (
    <>
      <CategoryHeader />
      <main className="main-content">
        {
          showCategories && 
            <ul className="categories-pane">
              { catItems } 
            </ul>
        }
        <div className="content-pane">
          <Outlet />
        </div>
      </main>
      </>
  );
}