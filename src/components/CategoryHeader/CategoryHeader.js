import React, { memo, useContext } from "react";
import { Link } from "react-router-dom";
import { Categories } from '../../config'
import { useSelector } from "react-redux";
import { RootContext } from "../Root";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import './styles.scss'
const CategoryHeader = memo(() => {
  const { showCategories, setShowCategories } = useContext(RootContext);
  const categoryId = useSelector(state => state.products.categoryId)
  const categoryName = Categories[categoryId]
  const icon = showCategories ? faArrowUp : faArrowDown
  const headerMsg = categoryId ? 
    <span>
      Browsing {categoryName} <FontAwesomeIcon icon={icon} />
    </span> 
    : 'Choose category from side menu'
  const toggleShowCategories = () => {
    setShowCategories(!showCategories)
  }    
  return (
      <Link className="btnbrowse"
        onClick={toggleShowCategories}
      > 
          { headerMsg }
      </Link>
  );
})
export default CategoryHeader