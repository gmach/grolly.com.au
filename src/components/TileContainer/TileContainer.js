import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { fetchProducts } from "../../features/products/productsSlice";
import InfiniteScroll from "../InfiniteScroll";
import ScrollUp from "../ScrollUp"
import Tile from "../Tile"
import './styles.scss'

export default function TileContainer( { data, view }) {
  const dispatch = useDispatch()
  let page = useSelector(state => state.products.page)
  const navigate = useNavigate()

  const getNewDataHandler = () => {
    if (location.pathname.startsWith("/categories/"))
      dispatch(fetchProducts(++page))
  }

  const handleClick = item => {
    navigate('/product/' + item.id);
  }

  return (
    <InfiniteScroll getNewData={getNewDataHandler}>
      <div className="products-container"> 
      {
        data && data.map(item => {
          const clsName = 'product-tile match ' + item.type
          return (
            <div onClick={() => handleClick(item)} key={item.stockCode}>
              <Tile product={item} view={view} className={clsName}/>
            </div>
          )
        })
      }
      </div>
      <ScrollUp/>
    </InfiniteScroll>
  )
}
