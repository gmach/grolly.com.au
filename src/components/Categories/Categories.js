import { NavLink, Outlet } from "react-router-dom";
import CategoryHeader from '../CategoryHeader'
import { Categories as CategoriesObj } from '../../config'
import { useContext } from "react";
import { RootContext } from "../Root";

export const Categories = () => {
  let categories = Object.entries(CategoriesObj);
  const { showCategories } = useContext(RootContext);
  return (
    <>
      <CategoryHeader />
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