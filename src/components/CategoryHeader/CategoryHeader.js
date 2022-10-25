import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Categories } from '../../config'
import { useSelector } from "react-redux";
import { RootContext } from "../Root";

const _CategoryHeader = () => {
  const { showCategories, toggleShowCategories } = useContext(RootContext);
  const selectedCategoryId = useSelector(state => state.products.categoryId)
  const categoryName = Categories[selectedCategoryId]
  const updownClass = 'fas fa-arrow-' + (showCategories ? 'up' : 'down')
  const headerMsg = selectedCategoryId ? 
    <span>
      Browsing {categoryName} <i className={updownClass}></i>
    </span> 
    : 'Click to choose category'
  const handleClick = () => toggleShowCategories()
  return (
      <Link className="btnbrowse"
        to={`/categories`}
        onClick={handleClick}
      > 
          { headerMsg }
      </Link>
  );
}
const CategoryHeader = React.memo(_CategoryHeader);
export default CategoryHeader