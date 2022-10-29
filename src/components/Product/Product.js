import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import {
	fetchProduct,
  selectProductById
} from '../../features/products/productsSlice'
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { ApiUrl, isAdmin } from '../../config'
import Tile from '../Tile'
import BackButton from "../BackButton";
import TileContainer from '../TileContainer';
import { CartActions } from '../Cart/CartActions';
import './styles.scss'

export async function loader() {}
export async function action() {}

export default function Product() {
  const params = useParams();
	const dispatch = useDispatch()
	const [matches, setMatches] = useState([])
	
	useEffect(() => { // Must run before if (!item) conditional check to ensure hooks always run same condition
		const runAsync = async () => {
			if (item === undefined) //load fresh from server
				dispatch(fetchProduct(params.productId))
		}
		runAsync()
	}, [params.productId])

	//load from redux store
	// const item = useSelector(state => Object.values(state.products.entities).find(product => product.stockCode == params.stockCode))
	const item = useSelector((state) => selectProductById(state, params.productId)) 
	if (!item)
		return null
	const classNameTile = 'product-tile ' + item.type
	const classNameWinner = 'winner ' + item.winner

	const getMatches = async () => {
		let response = await fetch(ApiUrl + '/matches/' +  item.id + '/' + isAdmin);
		response = await response.json()
		response = response.map(m => {
				m.hasMatches = false;
				return m;
		})
		setMatches(response)
	}
	
	const view = 'product'
  return (
	<>
		<BackButton/>
		<div className="tile-wrapper">
			<Tile product={item} view={view} className={classNameTile}/>
			{
			item.type == 'both' && 
			<Tile product={item.target} view={view} className={classNameTile}/>
			}
			<div className={classNameWinner}>
				<CartActions item={item}/>
				{
					item.type === 'both' && item.winner !== 'both' && 
					<h2>
						Best value at <span className="winner-name">{ item.winner }</span>
					</h2>
				}
				{
					item.type !== 'both' && 
					<h2>
						Product only at <span className="exclusive">{ item.type }</span>
						{
							matches.length === 0 && 
							<div>
								Click 
								<span className="getMatches"><FontAwesomeIcon onClick={getMatches} icon={faLink} /></span>
								to find nearest matches from { item.targetType }
							</div>
						}
					</h2>
				}
				{
					((item.type !== 'coles' && item.isAvailable) || item.type === 'coles') && 
					<h2>{ item.comparisonMsg }</h2>
				}
			</div>
		</div>
		{
			(matches.length > 0) && 
			<>
				<h2 className="subheading">Disclaimer : These are only best matches found and may not be correct.</h2>
				<TileContainer data={matches} view={view} />
			</>
		}	
	</>
	)
}
