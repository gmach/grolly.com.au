import { useEffect, useState } from "react";
import { useParams, NavLink, useLocation, useNavigate } from "react-router-dom";

const QueryNavLink = ({ to, ...props }) => {
  let location = useLocation();
  return <NavLink to={to + location.search} {...props} />;
}

import Tile from '../Tile'
import Product from '../Product'
export const Category = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [data, setData] = useState();
  const categoryId = parseInt(params.categoryId, 10)
  const page = 1;
  const filter = params.filter
  const isAdmin = false; // admin view
  const RESTURL = 'http://localhost:1234';//'https://groceryhawker-api.au.ngrok.io';// https://localhost:1234';
  const url = RESTURL + '/category/' + categoryId
  + '/filter/' + filter
  + '/page/' + page
  + '/isAdmin/' + isAdmin;

  useEffect(() => {
    // declare the async data fetching function
    const fetchData = async () => {
      // get the data from the api
      const response = await fetch(url);
      // convert the data to json
      const json = await response.json();
      // set state with the result
      setData(json);
    }
  
    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, [url]) 

  const prodsFound = 50;
  const totalCount = 500;
  const FILTER_TYPES = [
    {id: 'all', name: 'All'},
    {id: 'both', name: 'Both'},
    {id: 'woolworths', name: 'Woolworths'},
    {id: 'coles', name: 'Coles'}
];
const scrollUp = () => {

}
const types = [
  {id: 'all', name: 'All'},
  {id: 'both', name: 'Both'},
  {id: 'woolworths', name: 'Woolworths'},
  {id: 'coles', name: 'Coles'}
];
const getTypeFromFilter = id => {
  for (const type of types) {
    if (type.id == id)
      return type;
  }
}
const selectedType = getTypeFromFilter(filter);
const handleClick = (product) => {
  localStorage.setItem('localGroceryItem', JSON.stringify(product));
  let previousState = {
      items: data.records
  }
  localStorage.setItem('previousState', JSON.stringify(previousState));
  navigate("/product");
};
  return  (
    <>
      <div className="categoryHeader">
          <span className="prodsfound">{ prodsFound } of { totalCount } products found.</span>
          <label htmlFor="selectedType">
              <select 
                className="selectedType" 
                id="selectedType" 
                // value={this.state.value} 
                // onChange={this.handleChange}
                >
                  {
                    FILTER_TYPES.map(filter => <option key={filter.id} value={filter.name}>{filter.name}</option>)
                  }
              </select>
          </label>
      </div>   
      {/* {
        data && 
        <Product item={data.records[0]} view='product'/>
      } */}
      <div className="products-container">
        {
          data && data.records.map(tile => {
            const clsName = 'product-tile match' + tile.type
            if (tile.type == selectedType.id || selectedType.id == 'all')
              return (
                <div onClick={()=>handleClick(tile)} key={tile.id}>
                  <Tile product={tile} view='category' className={clsName}/>
                </div>
              )
          })
        }
      </div>
      <span className="scrollup" onClick={scrollUp}><i className="fas fa-chevron-circle-up"></i></span>      
    </>
  )
}
