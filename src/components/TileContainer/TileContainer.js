import { Link } from "react-router-dom"
import ScrollUp from "../ScrollUp"
import { Tile } from "../Tile/Tile"

export default function TileContainer( { data, view, selectedFilter = 'all'}) {
  return (
    <>
    <div className="products-container">
    {
      data && data.map(item => {
        const clsName = 'product-tile match ' + item.type
        if (item.type === selectedFilter || selectedFilter === 'all')
          return (
            <Link to={`/product/${item.stockCode}`} key={item.stockCode}>
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
