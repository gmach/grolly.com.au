import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"
import { fetchProducts } from "../../features/products/productsSlice";
import ScrollUp from "../ScrollUp"
import { Tile } from "../Tile/Tile"

export default function TileContainer( { data, view }) {
  const dispatch = useDispatch()
  const categoryId = useSelector(state => state.products.categoryId)
  window.onscroll = () => {
    let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
    if (bottomOfWindow) {
        // $scope.page++;
        // $scope.getProducts(true);
        dispatch(fetchProducts(categoryId))
    }
};

  return (
    <>
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
    </>
  )
}
