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
  const [showMatches, toggleShowMatches] = useToggle()
  const showMatchesIcon = showMatches ? faUnlink : faLink
  let storeIcon = bothLogoImage
  if (product.type === 'woolworths' 
    || view === 'product' && product.type === 'both')
    storeIcon = woolworthsLogoImage
  else if (product.type === 'coles')
    storeIcon = colesLogoImage

  const image = product.largeImage ?
    product.largeImage :
      product.smallImage ?
        product.smallImage :
          placeHolderImage    
  return (
    <div className={className}>
      <div className="tile-header">
        <img className="store-icon" src={storeIcon}/>
      </div>
      {
        isAdmin && product.type !== 'both' &&
          <div className="w100">Score is {product.score}</div> 
      }
      {
        view !== 'product' && 
          <section>
            {
              ((product.type !== 'coles' && product.isAvailable) || product.type === 'coles') && 
                <span className="diff">{ product.comparisonMsg ? product.comparisonMsg : '' + (product.type === 'both' ? ' at ' : '') }</span>
            }
            {
              product.winner === 'woolworths' && 
                <img className="store-icon" src={woolworthsLogoImage}/>
            }
            {
              product.winner === 'coles' && 
                <img className="store-icon" src={colesLogoImage}/>
            }
          </section>
      }     
      <div className="tile-body">
        <figure className="image-tile">
          {
            (view === 'product') ? 
              <a href={product.productLink} target="_blank" rel="noreferrer">
                <img className='product-image' src={ image } alt="Image not found"/>
              </a>   
              :
              <img className='product-image' src={ image } alt="Image not found"/>
          }
        </figure>
        <section className="text-tile">
          <h2 className="product-title">{ product.name } { product.packageSize}</h2>
        </section>
        {
          (view === 'product' && product.hasMatches) && 
          <span className='hasMatches' onClick={toggleShowMatches}>
            <FontAwesomeIcon icon={showMatchesIcon} />
          </span>          
        }
        
      </div>
      {
        ((product.type !== 'coles' && product.isAvailable) || product.type === 'coles') &&
        <h3>
          <div className="w100">
            <h2 className="productprice text-item">${ product.price }
              {
                view === 'product' && product.discount > 0 &&
                  <div className="small">
                    <span className="was">{ product.originalPrice }</span>
                    <span className="productdiscount text-item small">{ product.discount} / { product.discountPercent }%</span>
                  </div>
              }
            </h2>
           {
            view === 'product' && 
              <div className='dateAdded'>
              Price on { product.formattedDate }
            </div>
            } 
          </div>
            {
              view === 'product' &&    
              <div className="w100">
                <div className="unitPrice text-item">{ product.unitPrice }</div>
              </div> 
            }    
        </h3>  
      }
      {
        product.type !== 'coles' && !product.isAvailable && 
          <div className="w100">
            <h2 className="dateAdded text-item">Price unavailable at { product.formattedDate }</h2>
          </div>        
      }
    </div>
  )
}