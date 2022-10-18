import { Link, Outlet, useLocation } from "react-router-dom";
import useToggle from '../../hooks/useToggle'
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

export const CategoryHeader = () => {
  const filter = 'both'
  const category = 1//props.category
  let categories = Object.entries(CATEGORIES);
  // let [searchParams, setSearchParams] = useSearchParams();
  const [toggle, setToggle] = useToggle()
  const updownClass = 'fas fa-arrow-' + (toggle ? 'up' : 'down')
  const categoryName = CATEGORIES[category];
  const isLoading = false//props.isLoading//;useSelector...
  return (
      <Link className="btnbrowse"
        to='categories'>Browsing {categoryName}
        <i className={updownClass}></i>
      </Link>
  );
}