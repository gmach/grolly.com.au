import React, { useEffect, useState, useContext } from "react"
//data 
// minimal set of mutable state that your app needs. The key here is DRY: Don’t Repeat Yourself.
//Figure out the absolute minimal representation of the state your application needs and compute everything else you need on-demand.
// CATEGORIES data is prop (unchanged just passed down)
// types is prop (unchanged just passed down)
//prodsFound, totalCount is prop (computed)
// selectedType is State 
// selectedCat is state
// showhideCatPanel is state

const FILTERTYPES = [
  {id: 'all', name: 'All'},
  {id: 'both', name: 'Both'},
  {id: 'woolworths', name: 'Woolworths'},
  {id: 'coles', name: 'Coles'}
];

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

const App = () => {
  const RootContext = React.createContext();

  const Header = () => {//Yellow 
    return (
      <ul>
        <li>LOGO</li>
        <li>Barcode</li>
        <li>Search</li>
        <li>Cart</li>
      </ul>
    )
  }
     
  const CategoryRow = ({category, categorySelected, onChange}) => { //black
    const name = category[0] === categorySelected 
      ?<span style={{color: 'red'}}>
        {category[1]}
      </span>: <span onClick={()=>onChange(category[0])}>{category[1]}</span>
    return (
      <tr>
         <td>{name}</td>
      </tr>
    )
  }
  
  const CategoriesPane = ({categories, onChange, selectedCategory}) => { //purple
    let rows = []
    categories.map(category => rows.push(
      <CategoryRow key={category[0]} category={category} onChange={onChange} categorySelected={selectedCategory}/>
    ))

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
    </table>
    )
  }
   
  const ProductsPane = ({header, content}) => { //pink
    return (
      <div>
        <header>{header}</header>
        <main>{content}</main>  
      </div>
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

  const Main = ({categories, types}) => { //orange 
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
    const categoryTitle = CATEGORIES[selectedCategory]
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

    return (
      <RootContext.Provider value={root}>
        {
          showCatPanel && 
          <CategoriesPane categories={categories} onChange={handleSelectedCategory} selectedCategory={selectedCategory}/>
        }
        <ProductsPane header={header} content={content}/>
      </RootContext.Provider>
    )
  }
  
  return (
    <>
      <Header/>
      <Main categories={Object.entries(CATEGORIES)} types={FILTERTYPES}/>
    </>  
  )
}

export default App