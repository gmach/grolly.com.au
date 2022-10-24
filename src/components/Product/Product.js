import { useEffect, useState } from 'react'
import useToggle from '../../hooks/useToggle'
import { useSelector, useDispatch } from "react-redux"
import {
	fetchProduct,
  selectProductById
} from '../../features/products/productsSlice'
import { addToCart } from '../../features/cart/cartSlice'
import { useParams } from "react-router-dom";
import { ApiUrl } from '../../config'
import { isAdmin } from '../../config'
import Tile from '../Tile'
import BackButton from "../BackButton";
import TileContainer from '../TileContainer';
import { CartActions } from '../Cart/CartActions';

export async function loader({ params }) {}

export async function action() {}

export default function Product() {
  const params = useParams();
	const dispatch = useDispatch()
	const [matches, setMatches] = useState([])
	const item = useSelector((state) => selectProductById(state, params.productId)) //load from redux store
	const status = useSelector(state => state.products.status)
	let targetType, comparisonMsg
	if (item) {
		let percent = item.diffPercent?item.diffPercent:0;
		let diff = item.diff?item.diff:0;
		if (item.type != 'both') {
				percent = item.discountPercent?item.discountPercent:0;
				diff = item.discount?item.discount:0;
		}
		targetType = item.type === 'coles' ? 'Woolworths' : 'Coles';
		comparisonMsg = (diff == 0 && percent == 0)?'Same Price':('Saving of $' + diff + ' / ' + (percent?percent:'0') + '%');
		// item.hasMatches = (item.target == null);
	}
	
	useEffect(() => {
		const runAsync = async () => {
			if (item === undefined) {//load fresh from server
				await dispatch(fetchProduct(params.productId))
				console.log('wh')
			}

		}
		runAsync()
		
	}, [])
	
	const getMatches = async () => {
		let response = await fetch(ApiUrl + '/matches/' +  item.id + '/' + isAdmin);
		response = await response.json()
		response = response.map(m => {
				m.hasMatches = false;
				return m;
		})
		setMatches(response)
	}
	if (isAdmin) {
		getMatches()
		.catch(console.error);
	}
	const classNameTile = 'product-tile ' + (item ? item.type : '')
	const classNameWinner = 'winner ' + (item ?item.winner : '')
	const view = 'product'
  return (
	<>
	{
		item && 
		<div className="product-container">
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
								Click <i onClick={getMatches} className="fas fa-link"></i> to find nearest matches from { targetType }
							</div>
						}
					</h2>
				}
				{
					(item.type !== 'coles' && item.isAvailable) || item.type === 'coles' && 
					<h2>{ comparisonMsg }</h2>
				}
			</div>
		</div>
		{/* {
			isAdmin && item.type != 'both' &&
			<div className="suggestionswrap">
			<input id="suggestField" type="text" className="form-control" ng-model="ngModelOptionsSelected" ng-model-options="modelOptions"
					placeholder="Search for target match ..."
					uib-typeahead="suggest as suggest.n for suggest in getSuggestions($viewValue) | limitTo:5"
					typeahead-loading="loadingSuggestions"
					typeahead-no-results="noResults"
					typeahead-on-select="onSelect($item)"
					typeahead-test valueemplate-url="suggestTemplate.html"
			/>
			<i ng-show="loadingLocations" className="glyphicon glyphicon-refresh"></i>
			<div className="addResults">addresults</div>
			<div ng-show="noResults">
				<i className="glyphicon glyphicon-remove"></i> No Results Found
			</div>
			<div className="promptAddQC" ng-show="matchedItem">Replace With this match?
				<button className="cancelAddQC btn btn-primary" type="button" ng-click="cancelReplaceMatch()">
					Cancel
				</button>
				<button className="AddQC btn btn-success" type="button" ng-click="replaceMatch()">
					OK
				</button>
			</div>
			<button className="AddQC btn btn-success" type="button" ng-click="popup(item)">
				Show Search
			</button>

			<button ng-click="showMatches = !showMatches">
				<span ng-show="!showMatches">Show Matches</span>
				<span ng-show="showMatches">Hide Matches</span>
			</button>
			<span ng-show="isAdmin" className="barcode">{ item.barcode }</span>
		</div>
		} */}
		{
			(matches.length > 0) && 
			<>
				<h2 className="subheading">Disclaimer : These are only best matches found and may not be correct.</h2>
				<TileContainer data={matches} view={view} />
			</>
		}
	</div>		
	}

	</>
	)
/* <script type="text/ng-template" id="suggestTemplate.html">
	<div className="suggestion">
		<img className='suggest-image' ng-src="https://shop.coles.com.au{match.model.t}" width="16"/>
		<span className='suggest-name'>{match.model.m}</span>
		<span ng-bind-html="match.model.n | uibTypeaheadHighlight:query"></span>
		<span className="suggest-size">{match.model.a.O3}</span>
	</div>
</script>  */
}
