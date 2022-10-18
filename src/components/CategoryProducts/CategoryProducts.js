import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";

import Tile from '../Tile'
import Product from '../Product'
export const CategoryProducts = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [data, setData] = useState();
  const categoryId = parseInt(params.categoryId, 10)
  const page = 1;
  const filter = 'all'
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
const onSelect = (e) => {
    const filter = e.target.id;
    const categoryID = 1// useSelector
    // dispatch $rootScope.filter = selection.id;
    navigate('/category/' + categoryID + '/' + filter);
}
const viewProduct = (item) => {
  localStorage.setItem('localGroceryItem', JSON.stringify(item));
  let previousState = {
      // items: $scope.items,
      // prodsFound: $scope.prodsFound,
      // totalAll: $scope.totalAll,
      // totalBoth: $scope.totalBoth,
      // totalColes: $scope.totalColes,
      // totalWow: $scope.totalWow,
      // totalCount: $scope.totalCount
  }
  localStorage.setItem('previousState', JSON.stringify(previousState));
  navigate("/category/product");
};
  const loaded = true//;useSelector...
  const view = 'category'
  return  (
    <>
      {
        loaded &&
        <div className="categoryHeader">
          <span className="prodsfound">{ prodsFound } of { totalCount } products found.</span>
          <label htmlFor="selectedType">
              <select 
                className="selectedType" 
                id="selectedType" 
                // value={this.state.value} 
                onChange={onSelect}
                >
                  {
                    types.map(type => <option key={type.id} value={type.name}>{type.name}</option>)
                  }
              </select>
          </label>
      </div>  
      } 
      {/* {
        data && 
        <Product item={data.records[0]} view='product'/>
      } */}
      <div className="products-container">
        {
          data && data.records.map(item => {
            const clsName = 'product-tile match' + item.type
            if (item.type == selectedType.id || selectedType.id == 'all')
              return (
                <Link to={`/product/${item.id}`} key={item.id}>
                  <Tile product={item} view={view} className={clsName}/>
                </Link>
              )
          })
        }
      </div>
      <span className="scrollup" onClick={scrollUp}><i className="fas fa-chevron-circle-up"></i></span>      
    </>
  )
}
