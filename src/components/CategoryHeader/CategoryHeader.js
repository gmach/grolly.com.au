import { Link } from "react-router-dom";
import { toggleShowCategories } from '../../features/products/productsSlice'
import { useSelector, useDispatch } from "react-redux";

export const CategoryHeader = () => {
  const dispatch = useDispatch();
  const handleCompletedChanged = e => dispatch(toggleShowCategories())
  const showCategories = useSelector(state => state.todos.showCategories)
  const categoryName = useSelector(state => state.todos.categoryName)

  const updownClass = 'fas fa-arrow-' + (showCategories ? 'up' : 'down')
  return (
      <Link className="btnbrowse"
        to='categories' 
        onClick={handleCompletedChanged}> 
          Browsing {categoryName} <i className={updownClass}></i>
      </Link>
  );
}