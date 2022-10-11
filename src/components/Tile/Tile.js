import TileMatches from '../TileMatches'

export const Tile = ({product, view}) => {
  const isAdmin = false//true
  let formattedDate = new Date(Date.parse(product.dateAdded)).toLocaleString("en-GB", {timeZone: "Australia/Brisbane", hour12: true})
  if (formattedDate === 'Invalid Date') {
    let dp = product.dateAdded.split(',')[0]
    let tp = product.dateAdded.split(',')[1]
    dp = dp.split('/')
    let nw = '_.clone(dp)' // TO DO??
    nw[0]=dp[1]
    nw[1]=dp[0]
    dp = nw.join('/')
    formattedDate = new Date(dp + tp).toLocaleString("en-GB", {timeZone: "Australia/Brisbane", hour12: true})
  }
  let percent = product.diffPercent?product.diffPercent:0
  let diff = product.diff?product.diff:0
  if (product.type != 'both') {
      percent = product.discountPercent?product.discountPercent:0
      diff = product.discount?product.discount:0
  }
  const comparisonMsg = (diff == 0 && percent == 0)?'Same Price':('Saving of $' + diff + ' / ' + (percent?percent:'0') + '%')  
  const image = product.largeImage?product.largeImage:product.smallImage
  // //TODO
  // const getMatches = () => {
  //       $scope.showMatches = !$scope.showMatches
  //       if ($scope.showMatches)
  //           $scope.$parent.getMatches()
  //       else
  //           $scope.$parent.showMatches = false
  // }
  return (
    <div className="product-tile match">
      <div className="tile-header">
        <img className="product-logo" src={`/img/${product.type}-logo.png`}/>
      </div>
      {
        isAdmin && product.type !== 'both' &&
          <div className="w100">Score is {product.score}</div> 
      }
      {
        view !== 'product' && 
          <section>
            {
              (product.type !== 'coles' && product.isAvailable) || product.type === 'coles' && 
                <span className="diff">{ comparisonMsg }</span>
            }
            {
              product.winner === 'woolworths' && 
                <img className="product-logo" src="/img/woolworths-logo.png"/>
            }
            {
              product.winner === 'coles' && 
                <img className="product-logo" src="/img/coles-logo.png"/>
            }
          </section>
      }     
      <div className="tile-body">
        <figure className="image-tile">
          {
            view !== 'product' && 
              <img className='product-image' src={ image } alt="Image not found"/>
              //  onError="this.onerror=null;this.src='img_product-placeholder.png'"/>
          }
          {
            view === 'product' || view === 'cart' && 
              <a href={ product.productLink } target="_blank" rel="noreferrer">
                <img className='product-image' src={ image } alt="Image not found"/>
                 {/* onError="this.onerror=null;this.src='img_product-placeholder.png'"/> */}
              </a>   
          }
        </figure>
        <section className="text-tile">
          <h2 className="product-title">{ product.name } { product.packageSize}</h2>
        </section>
        <TileMatches/>
      </div>
      {
        ((product.type !== 'coles' && product.isAvailable) || product.type === 'coles') &&
        <h3>
          <div className="w100">
            <h2 className="productprice text-item">{ product.price }
              {
                product.discount > 0 &&
                  <div className="small">
                    <span className="was">{ product.originalPrice }</span>
                    <span className="productdiscount text-item small">{ product.discount} / { product.discountPercent }%</span>
                  </div>
              }
            </h2>
            <div className='dateAdded'>
              Price on { formattedDate }
            </div>
          </div>
          <div className="w100">
            <div className="unitPrice text-item">{ product.unitPrice }</div>
          </div>     
        </h3>  
      }
      {
        product.type !== 'coles' && !product.isAvailable && 
          <div className="w100">
            <h2 className="dateAdded text-item">Price unavailable at { formattedDate }</h2>
          </div>        
      }
    </div>
  )
}