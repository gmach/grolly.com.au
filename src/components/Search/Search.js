import { useState } from "react"
import Tile from '../Tile'

import {
  Outlet,
  Link,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit
} from "react-router-dom";

import { useEffect } from "react";



export async function loader({ request }) {
  let url = new URL(request.url);
  let searchTerm = url.searchParams.get("q");
  // const formData = await request.formData();
  // const updates = Object.fromEntries(formData);
  // const q = updates.q
  if (!searchTerm)
    return { data: [], q: '' };  
  const RESTURL = 'http://localhost:1234';//'https://groceryhawker-api.au.ngrok.io';// https://localhost:1234';
  let response = await fetch(RESTURL + '/search', 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          searchTerm: searchTerm,
          isAdmin: false
        }
      )
    }
  )
  response = await response.json()
  return { data: response.records, q: searchTerm };  
}

export async function action({ request }) {
  // const url = new URL(request.url);
  // // const q = url.searchParams.get("q");
  let a  = 1;

}

const scrollUp = () => {

}

export default function Search() {
  const { data, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );


  const [searchTxt, setSearchTxt] = useState('')
  const totalCount = 1
  const view =  'search'

  return (
    <>
      <div className="searchWrap">
        <input className="searchBox" type="text"
              ng-model="searchText"
              my-enter="search(searchText)"/>
        {/* <button onClick=search className="searchBtn btn btn-primary">Search</button> */}
      </div>
      <div ng-if="showSearchResults">
        <h2 className="subheading">Search Results for { searchTxt } </h2>
        <Form id="search-form" role="search" action="/search" method="get">
          <input
            id="q"
            className={searching ? "loading" : ""}
            aria-label="Search contacts"
            placeholder="Search"
            type="search"
            name="q"
            defaultValue={q}
            // onChange={(event) => {
            //   const isFirstSearch = q == null;
            //   submit(event.currentTarget.form, {
            //     replace: !isFirstSearch,
            //   });
            // }}              
          />
          <div
            id="search-spinner"
            aria-hidden
            hidden={!searching}
          />
          <div
            className="sr-only"
            aria-live="polite"
          ></div>
          <button type="submit">Search</button>
        </Form>

        <div className="categoryHeader" ng-show="$root.loaded">
          <span ng-show="$root.loaded" className="prodsfound">{ totalCount } products found.</span>
        </div>
        <div className="products-container">
        {
          data && data.map(item => {
            const clsName = 'product-tile match' + item.type
            return (
              <Link to={`/product/${item.id}`} key={item.id}>
                <Tile product={item} view={view} className={clsName}/>
              </Link>
            )
          })
        }
        </div>
        <span className="scrollup" onClick={scrollUp}><i className="fas fa-chevron-circle-up"></i></span>      
      </div>
    </>   
  )
}
