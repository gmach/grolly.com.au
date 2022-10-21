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
import useScroll from '../../hooks/useScroll'
import { isAdmin } from '../../config'

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
          searchTerm,
          isAdmin
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

  const view =  'search'

  const [scrollTo] = useScroll()
  const scrollUp = () => {
    scrollTo(0, 0)
  }
  
  return (
    <>
      <Form className="searchWrap" id="search-form" role="search" action="/search" method="get">
          <input
            id="q"
            className="searchBox"
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
          <button type="submit" className="searchBtn btn btn-primary">Search</button>
        </Form>
        {
          data.length > 0 &&         
      <>
        <h2 className="subheading">Search Results for { q } </h2>
        <div className="categoryHeader">
          <span className="prodsfound">{ data.length } products found.</span>
        </div>
        <div className="products-container">
        {
          data.map(item => {
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
      </>
    }
    </>   
  )
}
