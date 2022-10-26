import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"
import { fetchProducts } from "../../features/products/productsSlice";
import InfiniteScroll from "../InfiniteScroll";
import ScrollUp from "../ScrollUp"
import Tile from "../Tile"

export default function TileContainer( { data, view }) {
  const dispatch = useDispatch()
  let page = useSelector(state => state.products.page)
  const getNewDataHandler = () => {
    dispatch(fetchProducts(++page))
  }

  return (
    <InfiniteScroll getNewData={getNewDataHandler}>
    <div className="products-container"> 
    {
      data && data.map(item => {
        const clsName = 'product-tile match ' + item.type
        return (
          <Link to={`/product/${item.id}`} key={item.stockCode}>
            <Tile product={item} view={view} className={clsName}/>
          </Link>
        )
      })
    }
    </div>
    <ScrollUp/>
    </InfiniteScroll>
  )
}
