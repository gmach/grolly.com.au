import React, { memo, useContext } from "react";
import { Link } from "react-router-dom";
import { Categories } from '../../config'
import { useSelector } from "react-redux";
import { RootContext } from "../Root";

const CategoryHeader = memo(() => {
  const { showCategories, toggleShowCategories } = useContext(RootContext);
  const categoryId = useSelector(state => state.products.categoryId)
  const categoryName = Categories[categoryId]
  const updownClass = 'fas fa-arrow-' + (showCategories ? 'up' : 'down')
  const headerMsg = categoryId ? 
    <span>
      Browsing {categoryName} <i className={updownClass}></i>
    </span> 
    : 'Click to choose category'
  const handleClick = () => toggleShowCategories()
  const toLink = categoryId ? '/categories' : (showCategories ? '/' : '/categories')
  return (
      <Link className="btnbrowse"
        to={toLink}
        onClick={handleClick}
      > 
          { headerMsg }
      </Link>
  );
})
export default CategoryHeader