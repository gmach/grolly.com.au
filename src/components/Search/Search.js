import {
  useLoaderData,
  Form
} from "react-router-dom";

import { useEffect } from "react";
import { isAdmin, ApiUrl } from '../../config'
import TileContainer from '../TileContainer';
import './styles.scss'
import { postProcessProducts } from "../../features/products/productsSlice";

export async function loader({ request }) {
  let url = new URL(request.url);
  let searchTerm = url.searchParams.get("q");
  // const formData = await request.formData();
  // const updates = Object.fromEntries(formData);
  // const q = updates.q
  if (!searchTerm)
    return { data: [], q: '' };  
  let response = await fetch(ApiUrl + '/search', 
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
  const data = response.records
  postProcessProducts(data)
  return { data, q: searchTerm };  
}

export async function action({ request }) {}

export default function Search() {
  const { data, q } = useLoaderData();
  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);
  const view =  'search'

  return (
    <>
      <Form className="searchWrap" id="search-form" role="search" action="/search" method="get">
          <input
            id="q"
            className="searchBox"
            placeholder="Search"
            type="search"
            name="q"
            defaultValue={q}
          />
          <button type="submit" className="searchBtn btn btn-primary">Search</button>
        </Form>
        {
          q &&         
      <>
        <h2 className="subheading text-center">Search Results for <span className="qSearch">{ q }</span></h2>
        <div className="searchResults">
          <span className="prodsfound">{ data.length } products found.</span>
        </div>
        <TileContainer data={data} view={view} />         
      </>
    }
    </>   
  )
}
