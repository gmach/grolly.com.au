import React from "react";
import { Link } from "react-router-dom";
import { Categories } from '../../config'
import { useSelector } from "react-redux";

const _CategoryHeader = ({ showCategories, toggleShowCategories }) => {
  const selectedCategoryId = useSelector(state => state.todos.categoryId)
  const categoryName = Categories[selectedCategoryId]
  const updownClass = 'fas fa-arrow-' + (showCategories ? 'up' : 'down')
  const handleClick = () => toggleShowCategories()
  return (
      <Link className="btnbrowse"
        to='/categories' 
        onClick={handleClick}
      > 
          Browsing {categoryName} <i className={updownClass}></i>
      </Link>
  );
}
const CategoryHeader = React.memo(_CategoryHeader);
export default CategoryHeader