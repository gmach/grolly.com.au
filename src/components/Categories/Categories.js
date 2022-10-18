import { Link, Outlet, useLocation } from "react-router-dom";
import SpinnerLoader from '../SpinnerLoader'

const CATEGORIES = {
  // 0: "Top Diffs",  
  1: "Fruit & Veg",
  2: "Meat, Seafood & Deli",  
  3: "Bakery",
  4: "Dairy, Eggs & Fridge",
  5: "Pantry",
  6: "Freezer",
  7: "Drinks",
  8: "Liquor",
  9: "Front of Store",
  10: "Pet",
  11: "Baby",
  12: "Health & Beauty",
  13: "Household"
}

export const Categories = () => {
  const location = useLocation();
  let showCategories = false;
  if (location.state)
    showCategories = location.state.showCategories
  const filter = 'both'
  const category = 1//props.category
  let categories = Object.entries(CATEGORIES);
  // let [searchParams, setSearchParams] = useSearchParams();
  const isLoading = false//props.isLoading//;useSelector...
  return (
    <main className="main-container">
      <div className="main-content">
      {
        showCategories && 
        <>
          <div  className="categories-pane">
            { categories.map((category) => (
              <div className="catitem" key={category[0]}>
                <Link className='catlink thumb' 
                  to={`${category[0]}/${filter}`}
                  state={{ showCategories: showCategories }}
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
        isLoading &&
          <SpinnerLoader/>
      }
    </main>
  );
}