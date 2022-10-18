import React, { useEffect, useState, useContext } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom";
import useToggle from '../../hooks/useToggle'
import SpinnerLoader from '../SpinnerLoader'
const RootContext = React.createContext();

const CategoryRow = ({category, categorySelected, onChange, filter}) => { //black
  const className = "catlink thumb" + (category[0] === categorySelected ? ' catSelected' : '')
  return (
    <div className="catitem" onClick={()=>onChange(category[0])}>
      <NavLink className={className}
        style={({ isActive }) => { return { color: isActive ? "red" : "" }}} 
        to={`/${category[0]}/${filter}`}
      >
        { category[1] }
      </NavLink>
  </div>
  )
}

const CategoriesPane = ({categories, onChange, selectedCategory, filter}) => { //purple
  let rows = []
  categories.map(category => rows.push(
    <CategoryRow key={category[0]} category={category} onChange={onChange} categorySelected={selectedCategory} filter={filter}/>
  ))

  return (
    <div className="categories-pane">
      { rows }
    </div>    
  )
}
 
const ProductsPane = ({header, content}) => { //pink
  return (
    <>
      {/* <header>{header}</header>  */}
      <div className="content-pane">
        <div id="routedContent">
          <Outlet />
        </div>
      </div>
    </>
  )
}

const Product = ({product}) => { //green
  const root = useContext(RootContext);
  return (
    <h3>
      {product.name}
      <button onClick={()=>root.changeValue('123')}>Change root scope value</button>
    </h3>
  )
}

const FilterHeader = ({headerTitle, categoryTitle, children, onChange}) => { //Cyan
  return (
    <>
      <header>
        <h1 onClick={onChange}>
          <span style={{fontSize: 16}}>{ headerTitle }</span>Browsing {categoryTitle}
        </h1>
      {children}     
      </header>
    </>
  )
}

export const Main = ({categories, types}) => { //orange 
  const [selectedCategory, setCategory] = useState(1)
  const [selectedType, setType] = useState('All')
  const [showCatPanel, setShowCatPanel] = useState(true)
  const [data, setData] = useState();
  const page = 1;
  const isAdmin = false; // admin view
  const RESTURL = 'http://localhost:1234';//'https://groceryhawker-api.au.ngrok.io';// https://localhost:1234';
  const url = RESTURL + '/category/' + selectedCategory
  + '/filter/' + selectedType
  + '/page/' + page
  + '/isAdmin/' + isAdmin;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url);
      const json = await response.json();
      setData(json);
    }
  
    fetchData()
      .catch(console.error);
  }, [url]) 

  const handleSelectedCategory = (selectedCategory) => {
    setCategory(selectedCategory)
  }
  const handleSelectedType = (selectedType) => {
    setType(selectedType)
  }
  const toggleCatPanel = () => {
    setShowCatPanel(!showCatPanel)
  }

  let root = {
    changeValue: function(val) {
      setCategory(2)
    },
    light: {
      foreground: "#000000",
      background: "#eeeeee"
    },
    dark: {
      foreground: "#ffffff",
      background: "#222222"
    }
  }

  let products = []
  let totalCount, prodsFound
  if (data && data.totalCount > 0) {
    totalCount = data.totalCount
    prodsFound = data.records.length
    data.records.map(product => products.push(
      <Product key={product.id} product={product}/>
    ))
  }
  const content = 
    <>
      {products}
    </>

  const headerTitle = `${prodsFound} of ${totalCount} products found`
  const categoryTitle = categories[selectedCategory]
  const header =
    <FilterHeader headerTitle={headerTitle} categoryTitle={categoryTitle} onChange={toggleCatPanel}>
      <label htmlFor="selectedType">Select Type : &nbsp;
          <select 
            id="selectedType" 
            className="selectedType" 
            value={selectedType} 
            onChange={(e)=>handleSelectedType(e.target.value)}
            >
              {
                types.map(type => <option key={type.id} value={type.id}>{type.name}</option>)
              }
          </select>
        </label>         
    </FilterHeader>

const filter = 'both'
const category = 1//props.category
// let [searchParams, setSearchParams] = useSearchParams();
const [toggle, setToggle] = useToggle()
const updownClass = 'fas fa-arrow-' + (toggle ? 'up' : 'down')
const categoryName = categories[category];
const isLoading = false//props.isLoading//;useSelector...
  return (
    <RootContext.Provider value={root}>
      <main className="main-container">
        <a  className="btnbrowse" onClick={setToggle}>Browsing {categoryName}
          <i className={updownClass}></i>
        </a>
      {/* <a className="btnbrowse">{header}</a> */}
        <section className="main-content">
          {
          showCatPanel && 
          <CategoriesPane categories={categories} onChange={handleSelectedCategory} selectedCategory={selectedCategory} filter={filter}/>
          }
          <ProductsPane header={header} content={content}/>
        </section>
        {
          isLoading &&
            <SpinnerLoader/>
        }
      </main>
    </RootContext.Provider>
  )
}