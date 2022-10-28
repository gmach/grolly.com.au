import { isAdmin } from '../../config'
import useToggle from '../../hooks/useToggle'
import placeHolderImage from '../../img/img_product-placeholder.png';
import bothLogoImage from '../../img/both-logo.png';
import colesLogoImage from '../../img/coles-logo.png';
import woolworthsLogoImage from '../../img/woolworths-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUnlink, faLink } from '@fortawesome/free-solid-svg-icons'
import './styles.scss'

export default function Tile ({product, view, className}) {
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
  const image = product.largeImage ?
    product.largeImage :
      product.smallImage ?
        product.smallImage :
          placeHolderImage

  const [showMatches, toggleShowMatches] = useToggle()          
  // //TODO
  // const getMatches = () => {
  //       $scope.showMatches = !$scope.showMatches
  //       if ($scope.showMatches)
  //           $scope.$parent.getMatches()
  //       else
  //           $scope.$parent.showMatches = false
  // }
  const icon = showMatches ? faUnlink : faLink
  let productLogoImage = bothLogoImage
  if (product.type === 'woolworths')
    productLogoImage = woolworthsLogoImage
  else if (product.type === 'coles')
    productLogoImage = colesLogoImage
  return (
    <div className={className}>
      <div className="tile-header">
        <img className="product-logo" src={productLogoImage}/>
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
                <span className="diff">{ comparisonMsg }FUCK ME TILES</span>
            }
            {
              product.winner === 'woolworths' && 
                <img className="product-logo" src={woolworthsLogoImage}/>
            }
            {
              product.winner === 'coles' && 
                <img className="product-logo" src={colesLogoImage}/>
            }
          </section>
      }     
      <div className="tile-body">
        <figure className="image-tile">
          {
            // (view === 'product') ? 
            //   <Link to={{ pathname: product.productLink }} target="_blank" rel="noreferrer">
            //     <img className='product-image' src={ image } alt="Image not found"/>
            //   </Link>   
            //   :
              <img className='product-image' src={ image } alt="Image not found"/>
          }
        </figure>
        <section className="text-tile">
          <h2 className="product-title">{ product.name } { product.packageSize}</h2>
        </section>
        {
          (view === 'product' && product.hasMatches) && 
          <span className='hasMatches' onClick={toggleShowMatches}>
            <FontAwesomeIcon icon={icon} />
          </span>          
        }
        
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