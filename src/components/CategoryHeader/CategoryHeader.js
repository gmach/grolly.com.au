import React from "react";
import { Link } from "react-router-dom";
import { Categories } from '../../config'

const _CategoryHeader = ({ showCategories, selectedCategoryId }) => {
  const categoryName = Categories[selectedCategoryId]
  const updownClass = 'fas fa-arrow-' + (showCategories ? 'up' : 'down')
  return (
      <Link className="btnbrowse"
        to='/categories' 
      > 
          Browsing {categoryName} <i className={updownClass}></i>
      </Link>
  );
}
const CategoryHeader = React.memo(_CategoryHeader);
export default CategoryHeader