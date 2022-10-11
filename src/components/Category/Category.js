import {  useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import Tile from '../Tile'

export const Category = () => {
// const navigate = useNavigate();
  // const location = useLocation();
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


  return  (

    <div className="products-container">
    {
      data && data.records.map(tile => <Tile key={tile.id} product={tile} view='category'/>)
    }
  </div> 
    // <div ng-if="auth.isAuthenticated()">
    //     <div className="categoryHeader" ng-show="shared.loaded">
    //         <span ng-show="shared.loaded" className="prodsfound">  products found.</span>
          
    //             <select className="selectedType" id="selectedType"
    //                     ng-options="type.name for type in types track by type.id"
    //                     ng-model="selectedType" ng-change="onSelect(selectedType)">
    //             </select>
    //     </div>

    //     <div className="products-container">
    //         <div product="item" view="view" ng-if="item.type == selectedType.id || selectedType.id == 'all'"
    //               ng-repeat="item in items" className="product-tile match"
                  
    //               ng-click="viewProduct(item)">


    //               </div>
    //     </div>
    //     <span className="scrollup" ng-click="$root.scrollUp()"><i className="fas fa-chevron-circle-up"></i></span>
    // </div>
    
  )
}
